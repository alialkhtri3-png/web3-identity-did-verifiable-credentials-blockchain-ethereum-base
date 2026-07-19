import ElectrumClient from "electrum-client";
import * as bitcoin from "bitcoinjs-lib";
import crypto from "crypto";

const address = process.argv[2];

if(!address){
 console.log("Usage: node btc-electrum-real.js BTC_ADDRESS");
 process.exit(1);
}

function getScriptHash(address){

 const network =
 address.startsWith("tb1") || address.startsWith("m") || address.startsWith("n")
 ? bitcoin.networks.testnet
 : bitcoin.networks.bitcoin;

 const output =
 bitcoin.address.toOutputScript(address, network);

 const hash =
 crypto.createHash("sha256")
 .update(output)
 .digest();

 return Buffer.from(hash)
 .reverse()
 .toString("hex");
}

async function scan(){

const client=new ElectrumClient(
60002,
"electrum.blockstream.info",
"tls"
);

await client.connect();

console.log("✅ Electrum Connected");

const scripthash=getScriptHash(address);

console.log("🔑 Scripthash:",scripthash);

const balance=await client.request(
"blockchain.scripthash.get_balance",
[scripthash]
);

const history=await client.request(
"blockchain.scripthash.get_history",
[scripthash]
);

console.log("💰 Balance:",balance);
console.log("📜 Transactions:",history.length);

console.log(history);

await client.close();

}

scan();
