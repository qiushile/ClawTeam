---
name: macos-ssh-troubleshooting
category: devops
description: Diagnose and fix SSH connection issues on macOS, including immediate disconnect after TCP handshake, missing SSH banners, and OrbStack network SSH problems.
---

# macOS SSH Troubleshooting

## Symptoms: Connection closed immediately after TCP handshake

When SSH connects at TCP level but closes before exchanging version strings (no banner), follow these steps:

### 1. Verify connectivity and port status

```bash
# Test TCP connection
nc -vz <target> 22

# Check for SSH banner (should return SSH-2.0-...)
python3 -c "
import socket
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.settimeout(3)
try:
    s.connect(('<target>', 22))
    banner = s.recv(256)
    print('Banner:', banner.decode().strip() if banner else '(empty)')
except Exception as e:
    print('Error:', e)
finally:
    s.close()
"
```

### 2. Check SSH daemon status on target

```bash
# Verify sshd is running
sudo lsof -i :22
sudo launchctl list | grep sshd

# Check for access control restrictions
cat /etc/hosts.allow 2>/dev/null; echo "---"; cat /etc/hosts.deny 2>/dev/null

# Check sshd_config for user/group restrictions
sudo grep -E '^(AllowUsers|DenyUsers|AllowGroups|DenyGroups|MaxStartups|PerSourceMaxStarts|UsePAM)' /etc/ssh/sshd_config
```

### 3. Debug with sshd in debug mode (non-disruptive)

```bash
# Stop system sshd temporarily
sudo launchctl stop com.openssh.sshd

# Run sshd in debug mode on alternate port
sudo /usr/sbin/sshd -d -p 2222
```

Then from client machine:
```bash
ssh -p 2222 <user>@<target> -v 2>&1 | tail -20
```

Watch both the client verbose output and the server debug output for the exact failure point.

### 4. Restore service after debugging

```bash
sudo killall sshd
sudo launchctl start com.openssh.sshd
```

## Common causes on macOS

1. **Missing or corrupted host keys**: Fix with `sudo ssh-keygen -A`
2. **PAM configuration issues**: Check `/etc/pam.d/sshd`
3. **OrbStack network isolation**: OrbStack uses fdpass proxy, not standard SSH
4. **MaxStartups rate limiting**: Too many concurrent connections from same source
5. **Corrupted sshd_config**: Reset with `sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak && sudo rm /etc/ssh/sshd_config && sudo systemsetup -setremotelogin on`

## OrbStack-specific notes

- OrbStack machines use `~/.orbstack/ssh/config` with fdpass proxy
- Standard SSH may not work through OrbStack's network isolation
- Use the OrbStack helper for SSH proxy: `ProxyCommand '/Applications/OrbStack.app/Contents/Frameworks/OrbStack Helper.app/Contents/MacOS/OrbStack Helper' ssh-proxy-fdpass 501`