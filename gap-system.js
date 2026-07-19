import "dotenv/config";
import express from "express";
import fs from "fs";
import QRCode from "qrcode";
import { Wallet } from "ethers";

const app = express();
app.use(express.json());

const artifact = {
  gap_id:"gap-nano-nft-first-support-2025",
  timestamp:new Date().toISOString(),
  identity:"Ali.cb.id",
  artifact:{
    title:"Gap Nano NFT Support Artifact",
    description:"Sovereign Identity Engine Proof Artifact",
    signature:null
  },
  verification:{
    confirmed:true,
    chain:"Ethereum",
    txHash:"0x70ce91d28dc2d2e642d1850f52ea4be56005fa67cab3e94a835a7bd400809557"
  },
  storage:{
    type:"IPFS",
    cid:null
  }
};

if(process.env.PRIVATE_KEY){
 const wallet=new Wallet(process.env.PRIVATE_KEY);
 const message=JSON.stringify({
  gap_id:artifact.gap_id,
  identity:artifact.identity
 });
 artifact.artifact.signature=await wallet.signMessage(message);
 artifact.wallet=wallet.address;
}

fs.writeFileSync(
 "gap-artifact.json",
 JSON.stringify(artifact,null,2)
);

app.get("/",async(req,res)=>{
 const qr=await QRCode.toDataURL(JSON.stringify(artifact));
 res.send(`
 <h1>Ali.cb.id Gap Proof</h1>
 <pre>${JSON.stringify(artifact,null,2)}</pre>
 <img src="${qr}">
 `);
});

app.get("/verify",(req,res)=>{
 res.json(JSON.parse(fs.readFileSync("gap-artifact.json")));
});

app.listen(3005,()=>console.log("✅ Gap Proof Layer: http://127.0.0.1:3005"));
