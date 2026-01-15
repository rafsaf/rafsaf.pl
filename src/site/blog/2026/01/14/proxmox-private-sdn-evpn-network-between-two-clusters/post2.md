# Proxmox private SDN EVPN network between two clusters

This is a technical write-up of how I connected two physically separate Proxmox clusters into one coherent private network.

The goal was simple:

- Put workloads in Rozalin and Wro on a single private L3 fabric.
- Keep the underlay on the public Internet, but encrypted.
- Make it manageable and reproducible (OpenTofu/Terraform + Ansible).

The *reality* was mostly about understanding Proxmox SDN semantics, exit node behavior, Linux forwarding, and Proxmox firewall forwarding.

---

## Final working shape

- **Underlay:** WireGuard between the Proxmox hosts setup using ansible.
- **Overlay:** Proxmox SDN **EVPN zone** controlled by `evpnctl` (FRR). VXLAN encapsulation runs over the WireGuard underlay.
- **Per-site SDN subnets:**
  - Rozalin: `10.1.1.0/24` (gateway `10.1.1.1`)
  - Wro: `10.2.1.0/24` (gateway `10.2.1.1`)
- **Egress:** SDN subnet has `snat=true` (per site). Traffic from SDN to "outside" egresses via the site’s exit node.
- **Critical fix:** `exit_nodes_local_routing=false` (enabling "local routing" was the trap).
- **Critical host sysctls:** enable forwarding, net.bridge.bridge-nf-call-iptables, disable rp_filter.
- **Firewall:** Proxmox cluster firewall must explicitly allow FORWARD and IN rules for SDN subnets and also between nodes on public network level (wireguard) and also some allow IN rules for wireguard network interface.

---

## Architecture

### Layering

Think in two layers:

1) **Underlay (encrypted L3)**: WireGuard
2) **Overlay (virtual L2/L3 fabric)**: EVPN/VXLAN (Proxmox SDN)

```
             Public Internet
        (dynamic IPs, NAT, etc.)

   roz.rafsaf.pl                       wro.rafsaf.pl
   +----------------+                  +----------------+
   | Proxmox (Roz)  |                  | Proxmox (Wro)  |
   | WG: 10.1.0.1   |<==== WireGuard ===>| WG: 10.2.0.1   |
   | FRR + evpnctl  |  UDP/51820       | FRR + evpnctl  |
   +--------+-------+                  +--------+-------+
            |                                   |
            |             EVPN/VXLAN            |
            +====(BGP: TCP/179, VXLAN: UDP/4789)+
                           over WG
```

### Why WireGuard underlay instead of “SDN peers over DDNS”

Early on I tried to make “cross-site VXLAN peers” work with DDNS endpoints. That is fragile:

- SDN VXLAN/EVPN needs stable peer addressing.
- DDNS changes don’t map nicely to how Proxmox stores/uses peer endpoints.
- Even if DNS updates correctly, you now debug: DNS → firewall → NAT → VXLAN.

WireGuard gives you stable “site-to-site” tunnel IPs (`10.1.0.1`, `10.2.0.1`). SDN peers can then be defined in terms of those stable addresses.

---

## Repository mapping (where the truth lives)

### Underlay: Ansible (WireGuard + sysctls)

- WireGuard is managed via Ansible role `githubixx.ansible_role_wireguard`.
- Host variables (tunnel IPs, endpoints, peer AllowedIPs) are in `ansible/inventory/host_vars/*`.
- Host prerequisites (FRR packages, evpnctl controller creation, sysctls) are in `ansible/roles/proxmox_host/tasks/main.yml`.

Key sysctls:

- `net.ipv4.ip_forward=1`
- `net.bridge.bridge-nf-call-iptables=1`
- `net.bridge.bridge-nf-call-ip6tables=1`
- `net.ipv4.conf.all.rp_filter=0`
- `net.ipv4.conf.default.rp_filter=0`

If you skip rp_filter here, you will burn hours “debugging EVPN” while the kernel quietly drops your asymmetric flows.

### Overlay: OpenTofu/Terraform (Proxmox SDN EVPN)

Per cluster:

- `proxmox_rozalin_server_bpg/sdn_evpn.tf`
- `proxmox_wro_server_bpg/sdn_evpn.tf`

This defines:

- SDN EVPN zone
- SDN VNet
- SDN subnet
- Exit node behavior

A previous attempt used SDN VXLAN zone resources (see milestone commit below), but EVPN ended up being the path that worked and scaled.

### Firewall: OpenTofu/Terraform (Proxmox cluster firewall)

Per cluster:

- `proxmox_rozalin_server_bpg/cluster_firewall.tf`
- `proxmox_wro_server_bpg/cluster_firewall.tf`

This is where most “it should work” gets murdered.

Two separate requirements:

1) **Ports:** allow WireGuard UDP 51820, BGP TCP 179, VXLAN UDP 4789.
2) **Forwarding policy:** allow forwarding between SDN objects and the outside.

---

## SDN testing VM (sdntest): the NIC layout that finally stopped lying

To validate SDN behavior without dragging real workloads into the blast radius I created a tiny VM in each cluster.

Final shape is **two NICs**:

- `eth0`: attached to the SDN VNet (this becomes the overlay dataplane)
- `eth1`: attached to the “local mgmt” bridge (`vmbr0`)

This matters because if you try to do everything on one NIC you conflate:

- “Can I reach the other site”
- “Can the exit node NAT/forward”
- “Can Proxmox firewall forward SDN traffic”
- “Is the VM routing correctly”

Two NICs makes it obvious which plane broke.

ASCII view:

```
     sdntest VM

      +--------------------+
      | eth0: vnet (SDN)   | 10.x.1.x/24
      |  - default gw =    | 10.x.1.1
      |    SDN gateway     |
      |                    |
      | eth1: vmbr0 (mgmt) | 192.168.x.x
      +--------------------+

 eth0 tests overlay + exit-node + SNAT
 eth1 keeps you in control when overlay is broken
```

Definitions live in:

- `proxmox_rozalin_server_bpg/vm_sdntest.tf`
- `proxmox_wro_server_bpg/vm_sdntest.tf`

---

## Debugging story (the parts that actually mattered)

### 1) VXLAN zone attempt: it looked straightforward, it wasn’t

Milestone commit:

- `bc980a5 2026-01-10 sdn next step`

At this point, SDN VXLAN was defined with peers as WireGuard tunnel IPs and MTU 1370.

Conceptually fine. Practically, VXLAN didn’t give me the “control plane” visibility I needed. And the moment you bring dynamic endpoints (DDNS) into peer definition, you add another failure mode that Proxmox does not “helpfully explain”.

EVPN (BGP control plane) is more verbose and debuggable.

### 2) EVPN introduced (and why it’s not just “turn it on”)

Milestone commit:

- `b0d5919 2026-01-12 sdn evpn`

EVPN isn’t magic. You now depend on:

- FRR being installed and working
- `evpnctl` controller created and configured
- BGP reachability between controllers (TCP 179) on the underlay
- VXLAN reachability between nodes (UDP 4789) on the underlay

If any of those are blocked, your “L2 overlay” just silently doesn’t appear.

### 3) The killer setting: `exit_nodes_local_routing`

This is the bug-shaped hole.

Proxmox EVPN zone supports “exit nodes” to provide a routed gateway / egress for SDN subnets (and to do SNAT if configured).

I initially assumed:

- “local routing” should be enabled because it sounds like “route locally, be efficient”.

In practice for this design, **enabling local routing broke cross-site behavior**.

Final working config is:

- `exit_nodes_local_routing = false`

Milestone commit:

- `9674147 2026-01-12 exit_nodes`

If there is one takeaway from the whole saga, it is:

> Do not assume `exit_nodes_local_routing=true` is an optimization. Treat it as a behavioral change that can blackhole traffic.

### 4) The kernel wasn’t routing (because I didn’t tell it to)

Milestone commit:

- `eeab5cf 2026-01-14 bring back sysctl`

EVPN exit-node behavior is basically “you are a router now”. Linux defaults do not assume that.

Without the sysctls (forwarding + rp_filter disabled), you can have:

- WG working
- BGP sessions up
- VXLAN up
- yet packets still die at the exit node.

This is the worst category of problem: everything “looks up” but traffic doesn’t flow.

### 5) Proxmox firewall forwarding: allow-list the SDN objects, not just raw ports

Milestones:

- `af89abc 2026-01-14 missing forward`
- `4bc782a 2026-01-14 allow forwarding`
- `09f9892 2026-01-14 accept`

I hit the classic Proxmox firewall trap:

- “I opened the underlay ports, why is SDN traffic still blocked?”

Because SDN traffic isn’t just about underlay ports. Once the SDN vnet exists, you need to allow forwarding rules for SDN endpoints using Proxmox’s SDN object selectors (things like `+sdn/<vnet>-gateway` etc.).

If you don’t, the SDN gateway can exist and still be unable to forward.

### 6) Conntrack / NAT symptoms that mislead you

A lot of the time the broken behavior *looks like* conntrack weirdness:

- SYN goes out, SYN/ACK comes back, then it dies
- or traffic works one way but not the other

In this stack it’s usually one of:

- rp_filter dropping packets
- forwarding off
- Proxmox firewall forward rules missing
- exit-node “local routing” doing something you didn’t intend

Conntrack becomes the *visible* symptom, not the root cause.

---

## Final configuration (what to verify when it’s broken)

### Underlay checklist (WireGuard)

- `wg show` shows a recent handshake in both directions.
- `ping 10.1.0.1 <-> 10.2.0.1` works.
- UDP 51820 open between sites.

### EVPN control-plane checklist

- FRR running.
- BGP session established between `evpnctl` peers.
- TCP 179 allowed over the WG underlay.

### VXLAN dataplane checklist

- UDP 4789 allowed over the WG underlay.
- MTU reduced (1370) to avoid fragmentation through WG+VXLAN overhead.

### Exit-node + NAT checklist

- `exit_nodes_local_routing=false`.
- sysctls applied (`ip_forward=1`, rp_filter=0).
- Proxmox firewall forwarding explicitly allows SDN gateway -> 0.0.0.0/0.

### Practical tests (sdntest)

From Roz sdntest:

- `ping 10.2.1.9` (Wro sdntest overlay IP)
- `curl` to something external to validate SNAT via exit node

Then repeat from Wro.

---

## Timeline of milestones (repo history)

- `c85e2dc 2026-01-09 wireguard`
- `bc980a5 2026-01-10 sdn next step` (VXLAN SDN attempt)
- `550a2b0 2026-01-10 vm sdntest`
- `b0d5919 2026-01-12 sdn evpn`
- `9674147 2026-01-12 exit_nodes` (includes the key `exit_nodes_local_routing` behavior change)
- `eeab5cf 2026-01-14 bring back sysctl` (forwarding + rp_filter)
- `af89abc 2026-01-14 missing forward`
- `4bc782a 2026-01-14 allow forwarding`
- `09f9892 2026-01-14 accept`

---

## Closing notes

If you want to reproduce this setup elsewhere, stop thinking of Proxmox SDN as a “checkbox” feature.

Treat it like:

- a routing project (forwarding + rp_filter)
- plus a firewall project (forward rules for SDN objects)
- plus a control-plane project (BGP)

And remember the one configuration bit that cost me the most time:

- `exit_nodes_local_routing=false`

Last updated: 2025-02-05

Content license: CC BY-NC 4.0 — share and adapt with attribution, no commercial use.
