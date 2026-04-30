---
name: lan-device-discovery
description: Discover and identify devices on the local network, including OS, vendor, and device type, without requiring root privileges.
---

## Steps

1. **Quick Discovery**: Use ARP table and fast ping scan
   ```bash
   arp -a
   nmap -sn 192.168.31.0/24
   ```

2. **Service/Version Detection (No Root)**: Since `-O` (OS detection) requires sudo, use `-A` (aggressive) and `-sV` (version detection) instead
   ```bash
   nmap -A -sV --top-ports 50 --host-timeout 60s <IP_LIST>
   ```

3. **OS Fingerprinting via TTL**: Ping devices and extract TTL to guess OS
   - **TTL=64**: Linux, macOS, iOS, Android
   - **TTL=128**: Windows
   - **TTL=255**: Embedded/IoT devices, some routers
   ```bash
   ping -c 1 <IP> | grep -o 'ttl=[0-9]*'
   ```

4. **Vendor Identification via MAC**: Use nmap's local MAC prefix database
   ```bash
   # Extract first 3 octets (e.g., 00e04c)
   grep -i "<MAC_PREFIX>" /opt/homebrew/share/nmap/nmap-mac-prefixes
   ```
   - `58:b6:23`, `cc:da:20`, `84:46:93`, `1c:ea:ac`, `cc:4d:75` -> Xiaomi
   - `00:e0:4c` -> Realtek
   - `00:15:5d` -> Microsoft/Hyper-V
   - `8c:32:23` -> Jwipc (Mini PC/TV Box)

5. **Specific Device Indicators**:
   - **Xiaomi Router**: HTTP title "小米路由器" on port 80/8080
   - **iOS Device**: TTL=64 + Randomized MAC (2nd hex digit is even/high entropy) + all ports closed
   - **Windows PC**: TTL=128 + ports 135, 139, 445 open
   - **Linux Server**: TTL=64 + ports 22, 80, 443 open
   - **IoT/Embedded**: TTL=255 + no open ports or only obscure ports

## Pitfalls
- `nmap -O` requires `sudo`. Use TTL + service detection as fallback.
- `nmap -sU` (UDP scan) also requires `sudo`. Skip UDP unless necessary.
- Homebrew `brew install nmap` may timeout on auto-update. Use `HOMEBREW_NO_AUTO_UPDATE=1`.
- Some IoT devices block all TCP ports; rely on TTL and MAC for identification.