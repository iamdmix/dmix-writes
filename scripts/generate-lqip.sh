#!/bin/bash
set -e

for source in public/blog/*; do
  base=$(basename "$source")
  name="${base%.*}"
  sips -s format jpeg -s formatOptions 35 -Z 48 --out "public/lqip/$name.jpg" "$source" >/dev/null 2>&1
done

echo "Generated $(ls public/lqip | wc -l | tr -d ' ') LQIP placeholders in public/lqip/"
