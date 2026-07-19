import { ethers } from "ethers";

const wallet=process.argv[2];

const chains=[
{
 name:"BNB Chain",
 rpc:"https://bsc-dataseed.binance.org/",
 token:"0xe9e7cea3dedca5984780bafc599bd69add087d56",
 symbol:"BUSD"
},
{
 name:"Ethereum",
 rpc:"https://ethereum-rpc.publicnode.com",
 token:"0x4fabb145d64652a948d72533023f6e7a623c7c53",
 symbol:"BUSD"
}
];


const abi=[
"function balanceOf(address) view returns(uint256)",
"function decimals() view returns(uint8)",
"function symbol() view returns(string)"
];


async function check(c){

try{

const provider=new ethers.JsonRpcProvider(c.rpc);

const contract=new ethers.Contract(
c.token,
abi,
provider
);

const bal=await contract.balanceOf(wallet);
const dec=await contract.decimals();

console.log("\n================");
console.log(c.name);
console.log(c.symbol);
console.log(
ethers.formatUnits(bal,dec)
);

}catch(e){

console.log(c.name,"ERROR",e.message);

}

}


async function main(){

console.log("👛 Wallet:",wallet);

for(const c of chains)
 await check(c);

console.log("\n✅ Done");

}

main();
