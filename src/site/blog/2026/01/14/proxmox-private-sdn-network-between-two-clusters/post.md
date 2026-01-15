# Proxmox private SDN network between two clusters

Story of setuping network between two distinct Proxmox clusters in different locations based on wireguard and [SDN](https://pve.proxmox.com/pve-docs/chapter-pvesdn.html) [EVPN](https://pve.proxmox.com/pve-docs/chapter-pvesdn.html#pvesdn_zone_plugin_evpn) zone.

I started with already **working** homelabs setup for Proxmox (diagram below). It's quite typical and nothing special beside paranoid usage of [proxmox opentofu bpg provider](https://registry.terraform.io/providers/bpg/proxmox/latest/docs) (which I really love and also contribute to) for everything what is possible and ansible for nodes/vms setup. I think that's strong requirement, simple "fire and forget" approach to setup something like this article describes is probably very bad idea to the point where you probably will end up with messed up, broken current environment and not working SDN (for one of dozen not trivial reasons).

Enjoy!

```bash
                            Public Internet
                ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

            roz                                      wro
      ================                         ================

+---------------------------+          +---------------------------+
| ISP Router (roz)          |          | ISP Router (wro)          |
| WAN: public IP STATIC     |          | WAN: public IP DYNAMIC    |
| LAN: 192.168.1.0/24       |          | LAN: 192.168.1.0/24       |
+-------------+-------------+          +-------------+-------------+
              |                                        |
              | 192.168.1.35                           | 192.168.1.5
+-------------v-------------+          +-------------v-------------+
| My Router (roz)           |          | Proxmox (wro)             |
| WAN: 192.168.1.35/24      |          | mgmt: 192.168.1.5         |
| LAN: 192.168.2.0/16       |          |                           |
+-------------+-------------+          | VMs:                      |
              |                        | - ddns_updater VM         |
              | 192.168.2.3            |   192.168.1.7             |
              |                        | - ...                     |
+-------------v-------------+          +---------------------------+
| Proxmox (roz)             |
| mgmt: 192.168.2.3         |
|                           |
| VMs:                      |
| - haproxy VM              |
|   192.168.3.1             |
| - ...                     |
+---------------------------+
```

The goals were the following:

- Waste a lot of time.
- Have fun learning SDN.
- (If you think i needed it for anything really, then you are wrong).
- Be able to connect from VMs from roz to wro and reverse. So for example, in the above diagram, haproxy VM is unable to connect to ddns_updater VM other than using NAT port. With cross network, it's as simple as within each cluster in initial setup.
- Posibility to extend it with another cluster. In theory, this is quite scalable to new nodes within each cluster with minimal effort, and moderate effort to span new 10.3.0.0/16 zone in new location (ideally, I can try that some day and write followup, if that can be done in <2h then i would call it success, where something like 2 days fail).
- Have firewall enabled. A lot of things is much simpler and just work with PVE firewall disabled.
This is more or less the result:

```bash
                        Public Internet
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

           roz                                     wro
     ==================                    ==================

+----------------------------+      +----------------------------+
| Proxmox (roz)              |      | Proxmox (wro)              |
| mgmt: 192.168.2.3          |      | mgmt: 192.168.1.5          |
| WG:   10.1.0.1/16          |      | WG:   10.2.0.1/16          |
| FRR + evpnctl              |      | FRR + evpnctl              |
+--------------+-------------+      +--------------+-------------+
               |                                   |
               |        WireGuard (UDP/51820)      |
               +=========== tunnel ================+
               |                                   |
               |        EVPN / VXLAN overlay       |
               +==== BGP TCP/179 | VXLAN UDP/4789 =+
               |             (over WireGuard)      |
               |                                   |

        Overlay VM subnets (EVPN/VXLAN)
        --------------------------------

        roz: 10.1.1.0/24                    wro: 10.2.1.0/24

+----------------------------+      +----------------------------+
| VMs:                       |      | VMs:                       |
| - haproxy VM               |      | - ddns_updater VM          |
|   10.1.1.31 (main, eth0)   |      |   10.2.1.7 (main, eth0)    |
|   192.168.3.1 (eth1)       |      |   192.168.1.7 (eth1)       |
| - ...                      |      | - ...                      |
+----------------------------+      +----------------------------+
```

## Final working shape

- **Early traps** trying to use VXLAN Zone and/or fabrics instead of EVPN zone and wireguard.
- **Underlay WireGuard** between the Proxmox hosts setup using ansible.
- **Overlay SDN** Proxmox EVPN zone controlled by `evpnctl` (FRR). VXLAN encapsulation runs over the WireGuard underlay.
- **Per-site SDN subnets:**
  - Rozalin: `10.1.1.0/24` (gateway `10.1.1.1`)
  - Wro: `10.2.1.0/24` (gateway `10.2.1.1`)
- **Egress:** SDN subnet has `snat=true` (per site). Traffic from SDN to "outside" egresses via the exit node.
- **Critical fix:** `exit_nodes_local_routing=false` (enabling "local routing" was the trap).
- **Critical host sysctls:** enable forwarding, net.bridge.bridge-nf-call-iptables, disable rp_filter.
- **Firewall:** Proxmox cluster firewall must explicitly allow FORWARD and IN rules for SDN subnets and also between nodes on public network level (wireguard) and also some allow IN rules for wireguard network interface.

## Early traps

Early on I tried to use [cross-site VXLAN zone](https://pve.proxmox.com/pve-docs/chapter-pvesdn.html#pvesdn_zone_plugin_vxlan).

This looks exactly what we want:
> You have to configure the underlay network yourself to enable UDP connectivity between all peers.
> You can, for example, create a VXLAN overlay network on top of public internet, appearing to the VMs as if they share the same local Layer 2 network.

Perfect. We can have both clusters nodes expose UDP port overt NAT. If new node is added, new port and new peer is connected. There is even builtin way to have [IPSEC Encryption](https://pve.proxmox.com/pve-docs/chapter-pvesdn.html#_vxlan_ipsec_encryption) using strongswan, because there is no encryption by default.

But quick look on [provider resource proxmox_virtual_environment_sdn_zone_vxlan](https://registry.terraform.io/providers/bpg/proxmox/latest/docs/resources/virtual_environment_sdn_zone_vxlan) and then confirming in [PVE api viewer](https://pve.proxmox.com/pve-docs/api-viewer/index.html) confirms that you must use static IP for every peer. Not going to work with dynamic public IP. I have dyndns domain, not static IP in wro region. Beside dyndns, hardcoded IPs means limited flexibility and for things like this network, you don't want to have breaking changes after setup.

Then, i have read and tried using [Fabrics](https://pve.proxmox.com/pve-docs/chapter-pvesdn.html#pvesdn_config_fabrics) with EVPN zone.
> Fabrics in Proxmox VE SDN provide automated routing between nodes in a cluster. They simplify the configuration of underlay networks between nodes to form the foundation for SDN deployments

Another dead end. They are indeed nice foundation for cluster network (for things like Ceph, which makes sense), but won't help in multi cluster network.

After another spike and looking for solutions, it turned out that wireguard vpn between nodes and EVPN SDN on top of it *should* work as expected.

## Underlay WireGuard

There is ansible role – [ansible-role-wireguard](https://github.com/githubixx/ansible-role-wireguard) which have seemingless setup based on assumption that **you have all nodes in single inventory** (and hosts group). There is great README on the GitHub, I am not going into the details. Thankfully, I already have that. I have `proxmox` group and dedicated `playbook_proxmox.yml` playbook for proxmox nodes (wherever roz or wro). The only nit pick is `linear` strategy (free doesn't work well).

```yaml
# playbook_proxmox.yml
# Ignore meaningless details, clue is that every node have same setup
# I put "extra" data like that on purpose to be precise, this is not light read anyway

---
- hosts: proxmox
  become: yes
  strategy: linear
  tasks:
    - import_role:
        name: proxmox_host
    - import_role:
        name: apt_upgrade_and_common
    - import_role:
        name: authorized_keys
      vars:
        ssh_keys:
          - "2025_01_27_rafsaf_rycerski_servers.txt"
          - "2025_01_28_rafsaf_szczery_servers.txt"
```

Host vars for wro and roz nodes. This is all documented in ansible role. In short, let's take roz. The wireguard adresses will be 10.1.0.1 and I plan to reserve 10.1.0.0/24 for new nodes, so new-node-roz2 would have `"10.1.0.2/16"` wireguard_addresses and **the same** wireguard_allowed_ips. `wireguard_endpoint` is DNS with **public IP** (either dynamic or static, does not matter). This is required to allow `wireguard_port` over UDP over public internet.

Please ignore evpn related configuration for now (described later on).

```yaml
# roz host_vars

wireguard_addresses:
  - "10.1.0.1/16"
wireguard_endpoint: "roz.rafsaf.pl"
wireguard_allowed_ips: "10.1.0.0/16"
wireguard_persistent_keepalive: "25"
wireguard_port: "51820"
wireguard_interface_restart: true

evpn_controller_name: "evpnctl"
evpn_controller_asn: 65000
evpn_controller_peers:
  - "10.2.0.1"  # wro Wireguard IP
  - "10.1.0.1"  # roz Wireguard IP
```

```yaml
# wro host_vars

wireguard_addresses:
  - "10.1.0.1/16"
wireguard_endpoint: "roz.rafsaf.pl"
wireguard_allowed_ips: "10.1.0.0/16"
wireguard_persistent_keepalive: "25"
wireguard_port: "51820"
wireguard_interface_restart: true

evpn_controller_name: "evpnctl"
evpn_controller_asn: 65000
evpn_controller_peers:
  - "10.2.0.1"  # wro Wireguard IP
  - "10.1.0.1"  # roz Wireguard IP
```

With configuration in place, let's go over `proxmox_host` role. I split it into 3 parts and describe it.

```yaml
# proxmox_host role - part 1/3

- name: Install required apt libs
  apt:
    update_cache: yes
    name:
      - sudo
      - lsb-release
      - frr
      - frr-pythontools
    state: present

- name: Enable FRR service
  service:
    name: frr
    enabled: yes
    state: started

- name: Configure WireGuard for cross-site VXLAN
  ansible.builtin.import_role:
    name: githubixx.ansible_role_wireguard
```

The role use `lsb_release`, so that's why it's added. Same for `sudo` for become to work without any issue. Other than that, frr and frr-pythontools are simply [because](https://pve.proxmox.com/pve-docs/chapter-pvesdn.html#pvesdn_controller_plugin_evpn) Proxmox wiki say so:
> To enable the EVPN controller, you need to enable FRR on every node, see install FRRouting.

```yaml
# proxmox_host role - part 2/3
# =============================================================================
# EVPN Controller
# =============================================================================

- name: Check if EVPN controller exists
  shell: pvesh get /cluster/sdn/controllers/{{ evpn_controller_name }} --output-format json 2>/dev/null || echo "NOT_FOUND"
  register: evpn_controller_check
  changed_when: false
  failed_when: false

- name: Create EVPN controller
  shell: |
    pvesh create /cluster/sdn/controllers \
      --controller {{ evpn_controller_name }} \
      --type evpn \
      --asn {{ evpn_controller_asn }} \
      --peers "{{ evpn_controller_peers | join(',') }}"
  when:
    - evpn_controller_check.stdout == "NOT_FOUND"
  register: evpn_controller_created

- name: Apply SDN configuration after controller creation
  shell: pvesh set /cluster/sdn
  when:
    - evpn_controller_created is changed
```

Why do i create EVPN controller via ansible instead of using already mentioned [opentofu proxmox provider](https://github.com/bpg/terraform-provider-proxmox)? Because in v0.93.0 as of Jan 2026, there is no controller resource support yet. As it's rather simple API, probably this will be added in near future.

[EVPN Controller](https://pve.proxmox.com/pve-docs/chapter-pvesdn.html#pvesdn_controller_plugin_evpn) is requirement for SDN EVPN zone, with simple arguments, unique random ASN and list of peers basically where:
> Peers - An IP list of all nodes that are part of the EVPN zone. (could also be external nodes or route reflector servers)

Of course for that we use our wireguard internal ip, that is `10.2.0.1` for wro and `10.1.0.1` for roz. What if, again, we add new node `10.1.0.2` into roz cluster? Then we need to update peers list and update existing controllers. There is no such thing in above simplified role. Doing it via opentofu would be much more convinient.

```yaml
# proxmox_host role - part 3/3
# =============================================================================
# EVPN Exit Node - Required sysctl settings
# =============================================================================

- name: Enable IP forwarding for EVPN exit node routing
  ansible.posix.sysctl:
    name: "{{ item }}"
    value: "1"
    sysctl_set: yes
    state: present
    reload: yes
  loop:
    - net.ipv4.ip_forward
    - net.bridge.bridge-nf-call-ip6tables
    - net.bridge.bridge-nf-call-iptables

- name: Disable rp_filter (required for EVPN exit nodes)
  ansible.posix.sysctl:
    name: "{{ item }}"
    value: "0"
    sysctl_set: yes
    state: present
    reload: yes
  loop:
    - net.ipv4.conf.default.rp_filter
    - net.ipv4.conf.all.rp_filter
```

Last but not least, sysctl modification that will help later. ALL of them are required, maybe except rp_filter settings, but see [Multiple EVPN Exit Nodes](https://pve.proxmox.com/pve-docs/chapter-pvesdn.html#_multiple_evpn_exit_nodes), they encourage do to it right away to allow packets flow between nodes.

- `net.ipv4.ip_forward=1` (setting in Linux controls whether the system can forward IPv4 packets between network interfaces)
- `net.bridge.bridge-nf-call-iptables=1` (see [libvirt wiki](https://wiki.libvirt.org/Net.bridge.bridge-nf-call_and_sysctl.conf.html), without it packets were stuck on pve firewall in my case (from VM1 in wro to VM2 in roz to be precise, not on wireguard level), `net.bridge.bridge-nf-call-ip6tables` is not really needed but won't hurt to already fix ipv6).

With all of that in place and sucessfull deployment of this ansible playbook on proxmox nodes in both regions:

- wireguard is working between nodes, eg. encrypted traffic between 10.2.0.1 and 10.1.0.1 (eg. test with telnet)
- evpn controller is in place for SDN EVPN foundation (that can be moved to opentofu resource, if it exists)
- there are sysctl variables prepared
