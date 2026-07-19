import ElectrumClient from "electrum-client";
import crypto from "crypto";

const address = process.argv[2];

if (!address) {
  console.log("Usage: node btc-electrum-check.js BTC_ADDRESS");
  process.exit(1);
}

function fakeScriptHash(addr){
  // placeholder until address decoder is added
  return crypto.createHash("sha256")
    .update(addr)
    .digest("hex")
    .match(/.{2}/g)
    .reverse()
    .join("");
}

async function run(){

const servers=[
["electrum.blockstream.info",60002],
["blockstream.info",993]
];

for(const [host,port] of servers){

try{

console.log(`🔌 ${host}:${port}`);

const client=new ElectrumClient(
 port,
 host,
 "tls"
);

await client.connect();

console.log("✅ Connected");

const version=await client.server_version(
"SovereignEngine",
"1.4"
);

console.log("⚡ Version:",version);

const scripthash=fakeScriptHash(address);

const result=await client.request(
"blockchain.scripthash.get_history",
[scripthash]
);

console.log("💰 Result:",result);

await client.close();

return;

}catch(e){

console.log("❌",e.message);

}

}

}

run();
