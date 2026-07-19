#!/data/data/com.termux/files/usr/bin/bash

CID=$(curl -s \
  -X POST "https://uploads.pinata.cloud/v3/files" \
  -H "Authorization: Bearer $PINATA_JWT" \
  -F "file=@gap-artifact.json;type=application/json" \
  | grep -o '"cid":"[^"]*"' | cut -d'"' -f4)

echo "CID: $CID"

if [ -n "$CID" ]; then
node - <<EOF2
const fs=require("fs");
let a=JSON.parse(fs.readFileSync("gap-artifact.json"));
a.storage={
 type:"IPFS",
 cid:"$CID"
};
fs.writeFileSync(
 "gap-artifact.json",
 JSON.stringify(a,null,2)
);
console.log("✅ Artifact updated");
EOF2
fi
