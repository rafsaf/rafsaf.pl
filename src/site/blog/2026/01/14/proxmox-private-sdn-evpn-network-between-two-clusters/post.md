# Proxmox private SDN EVPN network between two clusters

Story of setuping network between two distinct Proxmox clusters in different locations based on wireguard and SDN EVPN zone.

Initial already **working** homelabs setup:

```
                            Public Internet
                ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

            roz                                      wro
      ================                         ================

+---------------------------+          +---------------------------+
| ISP Router (Roz)          |          | ISP Router (Wro)          |
| WAN: public IP STATIC     |          | WAN: public IP DYNAMIC    |
| LAN: 192.168.1.0/24       |          | LAN: 192.168.1.0/24       |
+-------------+-------------+          +-------------+-------------+
              |                                        |
              | 192.168.1.35                           | 192.168.1.5
+-------------v-------------+          +-------------v-------------+
| My Router (Roz)           |          | Proxmox (Wro)             |
| WAN: 192.168.1.35/24      |          | mgmt: 192.168.1.5         |
| LAN: 192.168.2.0/16       |          |                           |
+-------------+-------------+          | VMs:                      |
              |                        | - ddns_updater VM         |
              | 192.168.2.3            |   192.168.1.7             |
              |                        | - ...                     |
+-------------v-------------+          +---------------------------+
| Proxmox (Roz)             |
| mgmt: 192.168.2.3         |
|                           |
| VMs:                      |
| - haproxy VM              |
|   192.168.3.1             |
| - ...                     |
+---------------------------+
```

The goal was the following:

- Put workloads in Rozalin and Wro on a single private L3 fabric.
- Keep the underlay on the public Internet, but encrypted.
- Make it manageable and reproducible (OpenTofu/Terraform + Ansible).

```
                        Public Internet
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

           roz                                     wro
     ==================                    ==================

+----------------------------+      +----------------------------+
| Proxmox (Roz)              |      | Proxmox (Wro)              |
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

The *reality* was mostly about understanding Proxmox SDN semantics, exit node behavior, Linux forwarding, and Proxmox firewall forwarding.