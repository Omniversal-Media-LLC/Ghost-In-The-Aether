#!/bin/bash
set -euo pipefail

DOMAIN_FILE=${1:-omni-domains.txt}

if [ ! -f "$DOMAIN_FILE" ]; then
  echo "Domain file $DOMAIN_FILE not found" >&2
  exit 1
fi

mkdir -p mirrors

while IFS= read -r domain || [ -n "$domain" ]; do
  [ -z "$domain" ] && continue
  target="mirrors/$domain"
  echo "Mirroring $domain..."
  wget --mirror --page-requisites --convert-links --adjust-extension --no-parent "https://$domain" -P "$target"
  if command -v ipfs >/dev/null 2>&1; then
    ipfs add -r -Q "$target" > "$target.cid"
    echo "Added $domain to IPFS: $(cat "$target.cid")"
  else
    echo "ipfs command not found; skipped publishing $domain" >&2
  fi
done < "$DOMAIN_FILE"

echo "All done."
