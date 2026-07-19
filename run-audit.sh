#!/data/data/com.termux/files/usr/bin/bash

WALLET=$1

if [ -z "$WALLET" ]; then
 echo "Usage: ./run-audit.sh 0xWallet"
 exit 1
fi

npm install ethers >/dev/null 2>&1

cat > wallet-final-audit.js <<'JS'
import { ethers } from "ethers";

const wallet=process.argv[2];

const chains=[
["Ethereum","https://ethereum-rpc.publicnode.com",{
USDT:"0xdAC17F958D2ee523a2206206994597C13D831ec7",
USDC:"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
}],
["BNB","https://bsc-dataseed1.binance.org",{
USDT:"0x55d398326f99059fF775485246999027B3197955",
USDC:"0x8ac76a51cc950d9822d68b83cc3e6f0f7c8e9"
}],
["Polygon","https://polygon-bor-rpc.publicnode.com",{
USDT:"0xc2132D05D31c914a87C6611C10748AaCbC5320F",
USDC:"0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
}],
["Arbitrum","https://arbitrum-one-rpc.publicnode.com",{
USDC:"0xaf88d065e77c8cC2239327C5EDb3A432268e5831"
}],
["Base","https://base-rpc.publicnode.com",{
USDC:"0xd9aaEC86B65D86f6A7B5B1b0c42FFA531710b6CA"
}]
];

const abi=[
"function balanceOf(address) view returns(uint256)",
"function decimals() view returns(uint8)"
];

console.log("\n👛 Wallet:",wallet);

for(const [name,rpc,tokens] of chains){

console.log("\n================");
console.log("🌐",name);

try{

const provider=new ethers.JsonRpcProvider(
rpc,
undefined,
{staticNetwork:true}
);

let eth=await provider.getBalance(wallet);
console.log("ETH:",ethers.formatEther(eth));

for(const [symbol,address] of Object.entries(tokens)){

try{
let c=new ethers.Contract(address,abi,provider);
let b=await c.balanceOf(wallet);
let d=await c.decimals();

console.log(
symbol+":",
ethers.formatUnits(b,d)
);

}catch{
console.log(symbol+": ERROR");
}

}

}catch(e){

console.log("RPC ERROR");

}

}

console.log("\n✅ FINAL AUDIT DONE");

JS

node wallet-final-audit.js $WALLET
