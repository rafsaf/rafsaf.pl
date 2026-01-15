# Proxmox private SDN network between two clusters

Story of setting up network between two distinct Proxmox clusters in different locations based on wireguard and [SDN](https://pve.proxmox.com/pve-docs/chapter-pvesdn.html) [EVPN](https://pve.proxmox.com/pve-docs/chapter-pvesdn.html#pvesdn_zone_plugin_evpn) zone.

I started with already **working** homelab setup for Proxmox (diagram below). It's quite typical and nothing special besides the paranoid usage of [proxmox opentofu bpg provider](https://registry.terraform.io/providers/bpg/proxmox/latest/docs) (which I really love and also contribute to) for everything that was possible and ansible for nodes/vms setup. I think that's a strong requirement, simple "fire and forget" approach to setup something like this article describes is probably a very bad idea to the point where you'll probably end up with a messed up, broken current environment and non-working SDN (for one of dozens of non-trivial reasons).

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
- Be able to connect from VMs from roz to wro and reverse. So for example, in the above diagram, haproxy VM is unable to connect to ddns_updater VM other than using NAT port. With cross-site network, it's as simple as within each cluster in initial setup.
- Possibility to extend it with another cluster. In theory, this is quite scalable to new nodes within each cluster with minimal effort, and moderate effort to span new 10.3.0.0/16 zone in new location (ideally, I can try that some day and write a followup; if that can be done in <2h then I would call it success, whereas something like 2 days would be a fail).
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
- **Per-site SDN subnets and VMs**
  - Rozalin: `10.1.1.0/24` (gateway `10.1.1.1`, sdntest vm at `10.1.1.11`)
  - Wro: `10.2.1.0/24` (gateway `10.2.1.1`, sdntest vm at `10.2.1.9`)
- **Critical fixes** `snat=true` (enabling snat for subnet is needed).
- **Critical fixes** `exit_nodes_local_routing=false` (enabling "local routing" was the trap).
- **Firewall** Proxmox cluster firewall must explicitly allow FORWARD and IN rules for SDN subnets and also between nodes on public network level (wireguard) and also some allow IN rules for wireguard network interface.

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

There is ansible role – [ansible-role-wireguard](https://github.com/githubixx/ansible-role-wireguard) which has a seamless setup based on assumption that **you have all nodes in single inventory** (and hosts group). There is great README on the GitHub, I am not going into the details. Thankfully, I already have that. I have `proxmox` group and dedicated `playbook_proxmox.yml` playbook for proxmox nodes (whether roz or wro). The only nit pick is `linear` strategy (free doesn't work well).

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
  - "10.2.0.1/16"
wireguard_endpoint: "wro.rafsaf.pl"
wireguard_allowed_ips: "10.2.0.0/16"
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

Why do i create EVPN controller via ansible instead of using already mentioned [opentofu proxmox provider](https://github.com/bpg/terraform-provider-proxmox)? Because in v0.93.0 as of Jan 2026, there is no controller resource support yet. As it's a rather simple API, this will probably be added in the near future. Another option is to just use GUI.

[EVPN Controller](https://pve.proxmox.com/pve-docs/chapter-pvesdn.html#pvesdn_controller_plugin_evpn) is a requirement for SDN EVPN zone, with simple arguments, unique random ASN and list of peers basically where:
> Peers - An IP list of all nodes that are part of the EVPN zone. (could also be external nodes or route reflector servers)

Of course for that we use our wireguard internal IP, that is `10.2.0.1` for wro and `10.1.0.1` for roz. What if, again, we add new node `10.1.0.2` into roz cluster? Then we need to update the peers list and update existing controllers. There is no such thing in the above simplified role. Doing it via opentofu would be much more convenient.

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

Last but not least, sysctl modification that will help later. ALL of them are required, maybe except rp_filter settings, but see [Multiple EVPN Exit Nodes](https://pve.proxmox.com/pve-docs/chapter-pvesdn.html#_multiple_evpn_exit_nodes), they encourage doing it right away to allow packet flow between nodes.

- `net.ipv4.ip_forward=1` (setting in Linux controls whether the system can forward IPv4 packets between network interfaces)
- `net.bridge.bridge-nf-call-iptables=1` (see [libvirt wiki](https://wiki.libvirt.org/Net.bridge.bridge-nf-call_and_sysctl.conf.html), without it packets were stuck on pve firewall in my case (from VM1 in wro to VM2 in roz to be precise, not on wireguard level), `net.bridge.bridge-nf-call-ip6tables` is not really needed but won't hurt to already fix ipv6).

With all of that in place and successful deployment of this ansible playbook on proxmox nodes in both regions:

- wireguard is working between nodes, e.g. encrypted traffic between 10.2.0.1 and 10.1.0.1 (e.g. test with telnet)
- evpn controller is in place for SDN EVPN foundation (that can be moved to opentofu resource, if it exists)
- there are sysctl variables prepared

## Overlay SDN

Below is the Proxmox SDN setup in roz region. In wro, the only difference is that subnet is obviously part of `10.2.x.x` and not `10.1.x.x`, but beside that, the same setup is used.

```tf
resource "proxmox_virtual_environment_sdn_zone_evpn" "crosssite" {
  id         = "crossite"
  controller = "evpnctl"
  vrf_vxlan  = 99999
  mtu        = 1370

  advertise_subnets          = true
  disable_arp_nd_suppression = false

  exit_nodes               = [local.proxmox_dell_r740_node_name]
  exit_nodes_local_routing = false
  ipam                     = "pve"

  depends_on = [
    proxmox_virtual_environment_sdn_applier.evpn_finalizer
  ]
}

resource "proxmox_virtual_environment_sdn_vnet" "crosssite_vnet" {
  id    = "crossvnt"
  zone  = proxmox_virtual_environment_sdn_zone_evpn.crosssite.id
  tag   = 100000
  alias = "Cross-site EVPN network - Rozalin subnet"

  depends_on = [
    proxmox_virtual_environment_sdn_applier.evpn_finalizer
  ]
}

resource "proxmox_virtual_environment_sdn_subnet" "crosssite_subnet" {
  cidr    = "10.1.1.0/24"
  vnet    = proxmox_virtual_environment_sdn_vnet.crosssite_vnet.id
  gateway = "10.1.1.1"
  snat    = true

  depends_on = [
    proxmox_virtual_environment_sdn_applier.evpn_finalizer
  ]
}

resource "proxmox_virtual_environment_sdn_applier" "evpn_applier" {
  lifecycle {
    replace_triggered_by = [
      proxmox_virtual_environment_sdn_zone_evpn.crosssite,
      proxmox_virtual_environment_sdn_vnet.crosssite_vnet,
      proxmox_virtual_environment_sdn_subnet.crosssite_subnet,
    ]
  }

  depends_on = [
    proxmox_virtual_environment_sdn_zone_evpn.crosssite,
    proxmox_virtual_environment_sdn_vnet.crosssite_vnet,
    proxmox_virtual_environment_sdn_subnet.crosssite_subnet,
  ]
}

resource "proxmox_virtual_environment_sdn_applier" "evpn_finalizer" {
}
```

Clarifications:

`proxmox_virtual_environment_sdn_zone_evpn`:

- arbitrary id
- controller – the id of one created in ansible, evpn controller id, in my case "evpnctl"
- vrf_vxlan 99999 – arbitrary value:
  > A VXLAN-ID used for dedicated routing interconnect between VNets. It must be different than the VXLAN-ID of the VNets
- [MTU](https://en.wikipedia.org/wiki/Maximum_transmission_unit) reduced for VXLAN (50 bytes) + WireGuard (~60-80 bytes) – 1500 - 50 - 80 = 1370. In fact, it's possible that 1370 is not the perfect value and packet fragmentation may occur, but I didn't dig that deep for now. Whatever works, I guess, unless you're building a corporate-grade network, but then you're probably not reading this article.
- advertise_subnets true (Announce the full subnet in the EVPN network) seems useful, but I didn't check result without it
- disable_arp_nd_suppression false (again, at your opinion)
- exit_nodes - all of them, in this case, only one
- **exit_nodes_local_routing**!!! false – one of few hours debugging session spent here:
  > This is a special option if you need to reach a VM/CT service from an exit node. (By default, the exit nodes only allow forwarding traffic between real network and EVPN network). Optional.

    This looks innocently and "useful", but in fact in my case it broke packets between vms on different clusters (vm1wro to vm1roz), described in section below.
- ipam pve - default one

`proxmox_virtual_environment_sdn_vnet`:

- arbitrary id
- zone id from above
- arbitrary tag
- some alias

`proxmox_virtual_environment_sdn_subnet`:

- cidr matching roz zone `10.1.0.0/16`. Why `10.1.1.0/24`? Better question is why not. This ensure that there will be no overlap with reserved node `10.1.0.0/24` for roz.
- vnet id from above
- arbitrary `10.1.1.1` gateway – standard choice for `10.1.1.0/24`
- **snat** true – this is required with this setup. Described in section below why.

## Per-site SDN subnets and VMs

```tf
# vm_sdntest.tf in roz

locals {
  proxmox_dell_r740_node_name = "proxmox-dell-r740"
  sdntest_ip                  = "192.168.3.12"
  sdntest_evpn_ip             = "10.1.1.11"
  sdntest_vm_id               = 123
  sdntest_tag                 = "sdntest"
  sdntest_memory              = 512
  sdntest_cores               = 1
  sdntest_size                = 6
}

resource "proxmox_virtual_environment_vm" "sdntest" {
  name        = local.sdntest_tag
  description = "Managed by Terraform - EVPN test VM"
  tags        = [local.sdntest_ip, local.sdntest_tag]

  node_name  = local.proxmox_dell_r740_node_name
  vm_id      = local.sdntest_vm_id
  protection = false

  startup {
    order    = 200
    up_delay = 30
  }

  agent {
    enabled = true
    timeout = "10s"
  }

  disk {
    datastore_id = local.proxmox_dell_r740_datastore_ssd
    file_id      = proxmox_virtual_environment_download_file.dell_r740__debian_13_trixie_qcow2_img.id
    interface    = "scsi0"
    size         = local.sdntest_size
    file_format  = "raw"
  }

  initialization {
    datastore_id      = local.proxmox_dell_r740_datastore_ssd
    user_data_file_id = proxmox_virtual_environment_file.cloud_config_debian.id

    ip_config {
      ipv4 {
        address = "${local.sdntest_evpn_ip}/24"
        gateway = proxmox_virtual_environment_sdn_subnet.crosssite_subnet.gateway
      }
    }
    ip_config {
      ipv4 {
        address = "${local.sdntest_ip}/16"
      }
    }
  }

  network_device {
    bridge   = proxmox_virtual_environment_sdn_vnet.crosssite_vnet.id
    enabled  = true
    firewall = true
  }
  network_device {
    bridge   = "vmbr0"
    enabled  = true
    firewall = true
  }

  memory {
    dedicated = local.sdntest_memory
  }

  cpu {
    architecture = "x86_64"
    cores        = local.sdntest_cores
    flags        = ["+md-clear", "+spec-ctrl", "+ssbd", "+pcid"]
    sockets      = 1
    type         = "x86-64-v4"
    units        = 100
  }

  operating_system {
    type = "l26"
  }

  keyboard_layout = "pl"

  started = true
  migrate = true
}

resource "proxmox_virtual_environment_firewall_options" "tf-sdntest" {
  depends_on    = [proxmox_virtual_environment_vm.sdntest]
  node_name     = local.proxmox_dell_r740_node_name
  vm_id         = local.sdntest_vm_id
  enabled       = true
  dhcp          = false
  ipfilter      = false
  log_level_in  = "err"
  log_level_out = "err"
  macfilter     = false
  ndp           = true
  input_policy  = "REJECT"
  output_policy = "ACCEPT"
  radv          = false
}

resource "proxmox_virtual_environment_firewall_rules" "tf-sdntest" {
  depends_on = [
    proxmox_virtual_environment_cluster_firewall_security_group.tf-sdntest,
    proxmox_virtual_environment_vm.sdntest
  ]

  node_name = local.proxmox_dell_r740_node_name
  vm_id     = local.sdntest_vm_id

  rule {
    security_group = proxmox_virtual_environment_cluster_firewall_security_group.tf-sdntest.name
    comment        = "TF managed"
  }
}

resource "proxmox_virtual_environment_cluster_firewall_security_group" "tf-sdntest" {
  name    = "tf-${local.sdntest_tag}"
  comment = "Managed by Terraform"

  rule {
    type    = "in"
    action  = "ACCEPT"
    comment = "Allow ssh to vm from sdntest vm in wro"
    source  = "10.2.1.9"
    dport   = "22"
    proto   = "tcp"
    log     = "err"
  }
  rule {
    type    = "in"
    action  = "ACCEPT"
    comment = "Allow ssh to vm from bastion"
    source  = "192.168.100.1"
    dport   = "22"
    proto   = "tcp"
    log     = "err"
  }
}

resource "proxmox_virtual_environment_file" "cloud_config_debian" {
  content_type = "snippets"
  datastore_id = "local"
  node_name    = local.proxmox_dell_r740_node_name

  source_raw {
    data = <<-EOF
    #cloud-config
    package_upgrade: false
    users:
      - name: debian
        groups: sudo
        shell: /bin/bash
        ssh-authorized-keys:
          - ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIFcSbrQuaj60B0gOKXm8biPsF3xQxYvzx0rQTacGOOYX servers rafsaf@RYCERSKI 2025
          - ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIFj7D5PqyotQupnbUaL8/1Jc/20nuWIBwv7PBfa3rTxY servers rafsaf@szczery 2025
        sudo: ALL=(ALL) NOPASSWD:ALL
    packages:
      - qemu-guest-agent
    runcmd:
      - systemctl enable qemu-guest-agent
      - systemctl start qemu-guest-agent
    EOF

    file_name = "cloud-config-debian.yaml"
  }
}

resource "proxmox_virtual_environment_download_file" "dell_r740__debian_13_trixie_qcow2_img" {
  content_type = "import"
  datastore_id = "local"
  node_name    = local.proxmox_dell_r740_node_name
  url          = "https://cloud.debian.org/images/cloud/trixie/20251117-2299/debian-13-generic-amd64-20251117-2299.qcow2"
  overwrite    = false
}
```

This is mainly [proxmox_virtual_environment_vm](https://registry.terraform.io/providers/bpg/proxmox/latest/docs/resources/virtual_environment_vm) I use, with firewall rules alongisde.

Let's focus on the change before/after SDN for network interfaces. For older VMs, there is only eth0 definition on `vmbr0`:

```tf
initialization {
  ip_config {
      ipv4 {
        address = "${local.sdntest_ip}/16"
        gateway = local.proxmox_cluster_network_gateway
      }
    }
}

network_device {
  bridge   = "vmbr0"
  enabled  = true
  firewall = true
}
```

That would give following interfaces generated by cloud init:

```bash
# /etc/netplan/50-cloud-init.yaml

network:
    version: 2
    ethernets:
        eth0:
            addresses:
            - 192.168.3.12/16
            gateway4: 192.168.1.1
            match:
                macaddress: bc:24:11:f6:35:20
            nameservers:
                addresses:
                - 192.168.3.12
                search:
                - proxmox-dell-r740.internal
            set-name: eth0
```

whereas in the SDN VM it's:

```tf
initialization {
  ip_config {
    ipv4 {
      address = "${local.sdntest_evpn_ip}/24"
      gateway = proxmox_virtual_environment_sdn_subnet.crosssite_subnet.gateway
    }
  }
  ip_config {
    ipv4 {
      address = "${local.sdntest_ip}/16"
    }
  }
}

network_device {
  bridge   = proxmox_virtual_environment_sdn_vnet.crosssite_vnet.id
  enabled  = true
  firewall = true
}

network_device {
  bridge   = "vmbr0"
  enabled  = true
  firewall = true
}
```

This means eth0 is now the SDN network and **default route for internet is via 10.1.1.1 gateway**. We leave the (optional) vmbr0 management interface, but it's not used for internet anymore.

```bash
network:
  version: 2
  ethernets:
    eth0:
      match:
        macaddress: "bc:24:11:5d:83:33"
      addresses:
      - "10.1.1.11/24"
      nameservers:
        addresses:
        - 192.168.3.8
        search:
        - proxmox-dell-r740.internal
      set-name: "eth0"
      routes:
      - to: "default"
        via: "10.1.1.1"
    eth1:
      match:
        macaddress: "bc:24:11:30:b0:cb"
      addresses:
      - "192.168.3.12/16"
      nameservers:
        addresses:
        - 192.168.3.8
        search:
        - proxmox-dell-r740.internal
      set-name: "eth1"
```

(Please ignore nameserver 192.168.3.8, I use dnscrypt VM for DNS resolution and this is why such address)

In fact, this is exactly what we need. ALL traffic must go over the subnet gateway and SDN because this is the place where we can decide whether traffic should go over router to public internet or to the other data center (yes, in fact this is also using public internet, but hidden by wireguard magic and encrypted):

For example:

```bash
VM 10.1.1.5 from roz wants to reach 10.2.1.5 from wro
├── 10.2.1.5 is NOT in local subnet 10.1.1.0/24
├── VM sends packet to default gateway 10.1.1.1 (standard IP routing)
├── Gateway (Proxmox EVPN router) has route to 10.2.1.0/24 via BGP-EVPN
├── Packet encapsulated in VXLAN, sent to 10.2.0.1 via Wireguard
└── WRO decapsulates, delivers to VM 10.2.1.5
```

This scenario is not possible when vmbr0 is main interface.

So for each VM, it must be:

```bash
+--------------------+
| eth0: vnet (SDN)   | 10.x.1.x/24
|  - default gw =    | 10.x.1.1
|    SDN gateway     |
|                    |
| eth1: vmbr0 (mgmt) | 192.168.x.x
+--------------------+

eth0 overlay + exit-node + SNAT
eth1 control when overlay is broken, port forwarding from router
```

## Critical fixes

### SNAT

`snat=1` enabled in `proxmox_virtual_environment_sdn_subnet`.

You could theoretically have masquerade and NAT setup for `10.1.1.0/24` on your router and with some hassle that is going to work, but this is exactly what we want to avoid – having a hardcoded, non-trivial setup anywhere if not needed. With `snat`, proxmox node is going to have iptables rule for this subnet so it can access internet via `vmbr0` node interface:

```bash
$ iptables -t nat -L -n -v | egrep '10\.1\.1\.0/24|MASQUERADE|SNAT'

   64  4859 SNAT       all  --  *      vmbr0   10.1.1.0/24          0.0.0.0/0            to:192.168.2.3
    0     0 SNAT       all  --  *      vmbr0   10.1.1.0/24          0.0.0.0/0            to:192.168.2.3
    0     0 SNAT       all  --  *      vmbr0   10.1.1.0/24          0.0.0.0/0            to:192.168.2.3
    0     0 SNAT       all  --  *      vmbr0   10.1.1.0/24          0.0.0.0/0            to:192.168.2.3
```

Small nit pick found: after disabling it with `snat=0`, iptables rules were still in place for `10.1.1.0/24`, so Proxmox doesn't clean them up. It's probably a bug, but maybe a feature.

### The killer setting: `exit_nodes_local_routing`

This was the bug-shaped hole.

I initially assumed "local routing" should be enabled because... why not.
> Exit Nodes Local Routing
>
> This is a special option if you need to reach a VM/CT service from an exit node. (By default, the exit nodes only allow forwarding traffic between real network and EVPN network). Optional.

In practice for this design, **enabling local routing broke cross-site behavior** causing hard to debug packets port mangling.

Test scenario that discovered the issue:

- `tcpdump -n -vv -i vmbr0 host 104.18.27.120` in 1st terminal on roz node
- `tcpdump -n -vv -i xvrf_crossite host 104.18.27.120` in 2nd terminal on roz node
- `tcpdump -n -vv -i crossvnt host 104.18.27.120` in 3rd terminal on roz node
- `tcpdump -n -v -i eth0 'host 104.18.27.120'` in 1st terminal in VM
- `10.1.1.11` roz VM: `curl --connect-timeout 5 http://example.com -v` (104.18.27.120) in 2nd terminal in VM

#### On Proxmox (vmbr0)

- 104.18.26.120.80 > 10.1.1.11.59376 with full HTTP/1.1 200 OK body.
- SNAT on the exit node is correct (Cloudflare replies to 192.168.2.3:59376).
- De‑SNAT is correct (by the time it’s leaving vmbr0 towards EVPN, it’s 80 → 10.1.1.11:59376).

#### On Proxmox (crossvnt) and inside the VM (eth0)

- Handshake and GET are normal on port 80:
- 10.1.1.11.58044 > 104.18.27.120.**80** [S]
- 104.18.27.120.**80**  > 10.1.1.11.58044 [S.]
- 10.1.1.11.58044 > 104.18.27.120.**80** [.]
- 10.1.1.11.58044 > 104.18.27.120.**80** [P.] GET / ...

Then all subsequent packets from the server side on the way to the guest:

- 104.18.27.120.**397** > 10.1.1.11.58044 [.]
- 104.18.27.120.**238** > 10.1.1.11.58044 [P.]
- 104.18.27.120.**125** > 10.1.1.11.58044 [P.]

...and so on with ports 100, 49, 402, 440, 171, etc.

VM immediately sending RSTs to every one of these:

- 10.1.1.11.58044 > 104.18.27.120.**397**: Flags [R] ...
- 10.1.1.11.58044 > 104.18.27.120.**238**: Flags [R] ...

So sequence looks like:

1. Internet ↔ EdgeRouter ↔ vmbr0: fine (port 80).
2. vmbr0 ↔ xvrf_crossite: fine (port 80).
3. xvrf_crossite → crossvnt: **the port is rewritten from 80 to random ephemeral values**.
4. crossvnt → VM: these corrupted ports reach the guest, which correctly resets.

With `exit_nodes_local_routing=false`, there is no `xvrf_crossite` interface at all and no problems.

## Firewall

First, for forward traffic rules you need nftables-based [proxmox-firewall](https://pve.proxmox.com/pve-docs/pve-firewall.8.html).

- On cluster level, `ebtables=true` (`proxmox_virtual_environment_cluster_firewall` ebtables=true)
- On each node, additionally it must be enabled (via GUI for now, no opentofu resource yet) – `nftables (tech preview) = yes`

```tf
resource "proxmox_virtual_environment_cluster_firewall_security_group" "tf-cluster-security-group-sdn" {
  name    = "tf-cluster-sg-sdn"
  comment = "Cluster level SDN firewall rules"

  rule {
    type    = "in"
    action  = "ACCEPT"
    comment = "Allow udp to host wireguard"
    source  = "0.0.0.0/0"
    dport   = "51820"
    proto   = "udp"
    log     = "err"
  }
  rule {
    type    = "in"
    action  = "ACCEPT"
    comment = "Allow EVPN BGP over WireGuard"
    source  = "10.2.0.0/24"
    dport   = "179"
    proto   = "tcp"
    log     = "err"
  }
  rule {
    type    = "in"
    action  = "ACCEPT"
    comment = "Allow VXLAN over WireGuard"
    source  = "10.2.0.0/24"
    dport   = "4789"
    proto   = "udp"
    log     = "err"
  }
  rule {
    type    = "forward"
    action  = "ACCEPT"
    comment = "SDN crosssite_vnet allow cross-site subnet"
    source  = "10.0.0.0/8"
    dest    = "+sdn/${proxmox_virtual_environment_sdn_vnet.crosssite_vnet.id}-all"
    log     = "err"
  }
  rule {
    type    = "in"
    action  = "ACCEPT"
    comment = "SDN crosssite_vnet allow traffic from no-gateway to gateway"
    dest    = "+sdn/${proxmox_virtual_environment_sdn_vnet.crosssite_vnet.id}-gateway"
    log     = "err"
    source  = "+sdn/${proxmox_virtual_environment_sdn_vnet.crosssite_vnet.id}-no-gateway"
  }
  rule {
    type    = "forward"
    action  = "ACCEPT"
    comment = "SDN crosssite_vnet allow forward traffic to 0.0.0.0/0"
    dest    = "0.0.0.0/0"
    log     = "err"
    source  = "+sdn/${proxmox_virtual_environment_sdn_vnet.crosssite_vnet.id}-all"
  }
}
```

PVE automatically creates some [IPSets for every SDN Vnet](https://pve.proxmox.com/pve-docs/chapter-pvesdn.html#pvesdn_firewall_integration) so this is where "vnetid-all", "vnetid-gateway" come from.

Clarifications:

- Allow udp to host wireguard – UDP port from ansible setup must be allowed for cluster. This is the "public" port with port forwarding on public IP in my case
- Allow EVPN BGP over WireGuard and Allow VXLAN over WireGuard – allow BGP and VXLAN ports; without this, packets will be stuck between clusters (vm1wro to vm1roz and reverse). For wro it's `source = "10.1.0.0/24"`.
- SDN crosssite_vnet allow cross-site subnet – allow forward traffic between "VPN" full 10.0.0.0/8 network to all IPs in subnet. This is wide for simplicity, but could be `10.2.0.0/16` for now. Without this, packets will flow from cluster to cluster, but will be stuck trying to reach SDN interface from wireguard interface.
- SDN crosssite_vnet allow traffic from no-gateway to gateway – no-gateway subnet IPs must have access to gateway (check with ping gateway_ip).
- SDN crosssite_vnet allow forward traffic to 0.0.0.0/0 – this allows public internet access from VMs in subnet.

---

Last updated: 2026-01-15

Content license: CC BY-NC 4.0 — share and adapt with attribution, no commercial use.
