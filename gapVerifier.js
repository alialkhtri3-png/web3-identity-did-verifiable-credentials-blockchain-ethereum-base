import "dotenv/config";
import { JsonRpcProvider } from "ethers";
import fs from "fs";

const provider = new JsonRpcProvider(process.env.ETH_RPC);

async function verify(txHash){

  if(!txHash){
    console.log("❌ ضع txHash بعد الأمر");
    return;
  }

  const tx = await provider.getTransaction(txHash);

  if(!tx){
    console.log("❌ Transaction not found");
    return;
  }

  const receipt = await provider.getTransactionReceipt(txHash);

  const artifact = JSON.parse(
    fs.readFileSync("artifact.json","utf8")
  );

  artifact.verification = {
    confirmed: receipt?.status === 1,
    txHash,
    blockNumber: receipt?.blockNumber,
    network:"Ethereum"
  };

  fs.writeFileSync(
    "artifact.json",
    JSON.stringify(artifact,null,2)
  );

  console.log("✅ Artifact updated");
  console.log(artifact.verification);
}

verify(process.argv[2]);
