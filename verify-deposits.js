import fs from "fs";
import csv from "csv-parser";
import { ethers } from "ethers";

const RPC = process.env.ETH_RPC || "https://cloudflare-eth.com";
const provider = new ethers.JsonRpcProvider(RPC);

const file = process.argv[2] || "deposits.csv";

console.log("🔍 Checking:", file);
console.log("🌐 RPC:", RPC);

async function checkTx(hash, name){

    if(!hash || hash.includes("YOUR")){
        console.log("⚠️",name,"Missing real tx hash");
        return;
    }

    try {

        const tx = await provider.getTransaction(hash);

        if(!tx){
            console.log("❌",name,"Not Found");
            return;
        }

        const receipt = await provider.getTransactionReceipt(hash);

        console.log("\n====================");
        console.log(name);
        console.log("Hash:",hash);
        console.log("From:",tx.from);
        console.log("To:",tx.to);
        console.log("Block:",tx.blockNumber);
        console.log(
            "Status:",
            receipt?.status === 1 ? "✅ SUCCESS":"❌ FAILED"
        );

        console.log(
            "ETH:",
            ethers.formatEther(tx.value)
        );

    }catch(e){
        console.log(name,"ERROR:",e.message);
    }
}


const rows=[];

fs.createReadStream(file)
.pipe(csv())
.on("data",r=>rows.push(r))
.on("end",async()=>{

for(const row of rows){

console.log("\n====================");
console.log(
"Token:",
row["Token Name"],
row["Token Symbol"]
);

console.log("Value:",row["Value"]);

await checkTx(
row["L1 Deposit Txhash"],
"L1 Ethereum"
);

if(row["L2 Txhash"])
await checkTx(
row["L2 Txhash"],
"L2"
);

}

console.log("\n✅ Verification Finished");

});
