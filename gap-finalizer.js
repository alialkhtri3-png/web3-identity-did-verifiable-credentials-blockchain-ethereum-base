import "dotenv/config";
import fs from "fs";
import { Wallet } from "ethers";
import { PinataSDK } from "pinata-web3";

const filePath="gap-artifact.json";

let artifact=JSON.parse(fs.readFileSync(filePath,"utf8"));

async function main(){

  if(process.env.PRIVATE_KEY){

    const wallet=new Wallet(process.env.PRIVATE_KEY);

    const message=JSON.stringify({
      gap_id:artifact.gap_id,
      identity:artifact.identity,
      txHash:artifact.verification.txHash
    });

    artifact.artifact.signature=await wallet.signMessage(message);

    artifact.proof={
      method:"wallet-signature",
      wallet:wallet.address
    };

    console.log("✅ Signed:",wallet.address);
  }


  if(process.env.PINATA_JWT){

    const pinata=new PinataSDK({
      pinataJwt:process.env.PINATA_JWT
    });


    const json=JSON.stringify(artifact,null,2);

    const encoded=new TextEncoder().encode(json);

    const upload=await pinata.upload.file(
      new File(
        [encoded],
        "gap-artifact.json",
        {
          type:"application/json"
        }
      )
    );


    artifact.storage={
      type:"IPFS",
      cid:upload.IpfsHash || upload.cid
    };

    console.log("✅ IPFS:",artifact.storage.cid);
  }


  fs.writeFileSync(
    filePath,
    JSON.stringify(artifact,null,2)
  );


  console.log("✅ Gap Artifact finalized");
}

main().catch(console.error);
