# Decentralized Mirror Network

This guide describes how to mirror each Omniversal-Landing domain into a peer-to-peer network for archival or distribution purposes. The process downloads each site as static files and republishes it using [IPFS](https://ipfs.tech/).

## Prerequisites

- Linux or macOS environment with `wget` and `ipfs` installed
- A text file listing all domains to mirror (default: `omni-domains.txt`)

## Steps

1. Populate a file called `omni-domains.txt` in the repository root. List one domain per line, for example:

```
ghost.omniversal.cloud
portal.omniversal.cloud
```

2. Run the helper script to mirror all domains and publish them to IPFS:

```bash
bash scripts/mirror-ipfs.sh
```

Each domain will be mirrored under `mirrors/<domain>` and a corresponding `<domain>.cid` file will contain the IPFS CID.

3. Optionally, pin the resulting CIDs on other IPFS nodes or gateways. This distributes the content across the decentralized network. You may also configure a Tor hidden service or other alternative transport layer pointing to the static files if deeper anonymity is desired.

---

The mirrored sites are static copies. Dynamic features requiring server-side logic will not be preserved.
