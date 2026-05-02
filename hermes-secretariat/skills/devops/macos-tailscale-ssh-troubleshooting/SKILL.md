---
name: macos-tailscale-ssh-troubleshooting
category: devops
description: Diagnose and fix SSH connectivity issues between macOS machines on Tailscale, especially DNS hijacking by 114.114.114.114 causing false IP resolution (198.18.x.x fake IPs).
---

# macOS + Tailscale SSH Troubleshooting

## Symptoms
- SSH to Tailscale hostname (e.g., `ssh user@m3max`) connects briefly then closes
- No SSH banner received despite TCP connection succeeding
- `ping hostname` works but SSH fails
- Resolved IP shows `198.18.x.x` range (OrbStack-like but actually DNS hijacking)

## Root Cause: 114 DNS Hijacking
DNS server `114.114.114.114` does NOT return NXDOMAIN for unknown domains. Instead, it returns fake IPs in the `198.18.0.0/15` range (used by Chinese ISPs for search/ad redirect pages).

This causes `ssh user@hostname` to connect to a fake IP instead of the real Tailscale IP (`100.x.x.x`).

## Diagnosis Steps

### 1. Check DNS resolution
```bash
nslookup hostname          # May return fake 198.18.x.x
nslookup hostname.ts.net   # Should return real Tailscale IP if MagicDNS works
dscacheutil -q host -a name hostname
```

### 2. Check current DNS servers
```bash
scutil --dns               # Look for nameserver entries
networksetup -getdnsservers "Wi-Fi"
```

### 3. Verify Tailscale connectivity
```bash
tailscale status           # Find the real 100.x.x.x IP
ping -c 1 100.x.x.x        # Test direct Tailscale IP
ssh user@100.x.x.x         # Test SSH via direct IP
```

### 4. Check Tailscale MagicDNS
```bash
scutil --dns | grep -B 2 -A 2 'ts.net'
# Should show domain: ts.net with nameserver 100.100.100.100
# If flags show "Not Reachable", MagicDNS is not being used
ping -c 1 100.100.100.100  # Test Tailscale DNS server reachability
```

### 5. Confirm DNS hijacking
```bash
nslookup non-existent-domain-xyz123.com 114.114.114.114
# If it returns an IP (like 198.18.x.x) instead of NXDOMAIN → hijacking confirmed
```

## Fix

### Step 1: Replace DNS servers
```bash
# For Wi-Fi
sudo networksetup -setdnsservers "Wi-Fi" 223.5.5.5 119.29.29.29

# For wired (adjust service name as needed)
sudo networksetup -setdnsservers "USB 10/100/1G/2.5G LAN" 223.5.5.5 119.29.29.29

# Flush DNS cache
sudo dscacheutil -flushcache
```

### Step 2: (Optional) Add hosts entry for critical hosts
```bash
sudo sh -c 'echo "100.86.50.21 m3max" >> /etc/hosts'
```

### Step 3: Verify
```bash
nslookup m3max  # Should now fail (NXDOMAIN) or resolve correctly
ssh m3max@m3max # Should now work
```

## Pitfalls
- **OrbStack coincidence**: The `198.18.x.x` range IS used by OrbStack internally, but in this case the fake IP comes from DNS hijacking, NOT OrbStack. Always verify by testing `nslookup` of a random non-existent domain against the DNS server.
- **ISP-level UDP 53 hijacking**: If `nslookup` of non-existent domains returns fake IPs even after switching to known-good DNS servers (223.5.5.5, 119.29.29.29, 8.8.8.8), the hijacking is at the ISP/router level via transparent UDP 53 proxy. Changing DNS servers in system settings will NOT fix this. Use the SSH config `HostName` workaround with full Tailscale MagicDNS name instead.
- **MagicDNS not active**: Tailscale configures `ts.net` domain to use `100.100.100.100`, but macOS marks it as "Not Reachable" and falls back to system DNS. This is why `hostname.ts.net` queries also fail.
- **Multiple network interfaces**: If user uses both Wi-Fi and Ethernet, DNS must be changed for BOTH interfaces.
- **SSH config Include**: OrbStack adds `Include ~/.orbstack/ssh/config` to `~/.ssh/config`. After uninstalling OrbStack, remove this line to prevent SSH warnings/errors.

## OrbStack Cleanup (if installed but not used)
```bash
brew uninstall --cask --force orbstack 2>&1 || true
rm -rf ~/.orbstack
# Edit ~/.ssh/config to remove the Include ~/.orbstack/ssh/config line
```

## Workaround: SSH config with full Tailscale domain (bypasses DNS hijacking entirely)

If DNS hijacking cannot be fixed (e.g., ISP-level UDP 53 hijacking that affects all DNS servers), use the full Tailscale MagicDNS name in `~/.ssh/config`:

```text
Host m3max
    HostName m3max.tailcc8506.ts.net
    User m3max
```

This works because `ssh` resolves `m3max.tailcc8506.ts.net` correctly — the Tailscale client handles resolution internally for `*.ts.net` domains, bypassing the system DNS.

Find the full MagicDNS name with:
```bash
tailscale status
# OR
tailscale dns-status  # if supported
```