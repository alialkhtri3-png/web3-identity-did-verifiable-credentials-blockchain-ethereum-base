import { saveIdentity } from "./database/identityStore.js";
import express from "express";
import cors from "cors";
import { ethers } from "ethers";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3001;

const RPC =
"https://mainnet.base.org";

const provider = new ethers.JsonRpcProvider(RPC);


function validateWallet(wallet){
  return ethers.isAddress(wallet);
}


async function analyzeWallet(wallet){

  const balance =
    await provider.getBalance(wallet);

  const block =
    await provider.getBlockNumber();


  return {

    wallet,

    network:"Base",

    intelligence:{
      walletAge:"unknown",
      activity:"scanned",
      tokens:[],
      graph:{
        uniqueConnections:0,
        topPartners:[]
      }
    },

    reputation:{
      score:50,
      label:"Neutral",
      sybilRisk:false
    },

    portfolio:{
      ETH:
      ethers.formatEther(balance)
    },

    scannedBlock:block,

    modules:[
      "Passport",
      "Credential",
      "BaseLogScanner",
      "WalletAge",
      "ActivityAnalyzer",
      "TokenScanner",
      "GraphBuilder",
      "SybilDetector",
      "ReputationEngine"
    ]

  };

}



app.get("/",(req,res)=>{

res.json({

name:"Sovereign Identity Engine",

version:"V12.0 Production",

status:"running",

timestamp:new Date()

});

});



app.get("/api/status",(req,res)=>{

res.json({

status:"online",

engine:"Sovereign Identity Engine V12.0 Production",

port:PORT,

modules:[

"Passport",
"Credential",
"Intelligence",
"Graph"

],

time:new Date()

});

});



app.post("/api/identity",async(req,res)=>{

try{

const {wallet}=req.body;


if(!wallet)
return res.status(400).json({

error:"wallet required"

});


if(!validateWallet(wallet))
return res.status(400).json({

error:"invalid ethereum address"

});


const result =
await analyzeWallet(wallet);


saveIdentity(result);

res.json({
  ...result,
  stored:true
});


}catch(e){

console.error(e);

res.status(500).json({

error:"Internal Server Error",

message:e.message

});

}

});




    
app.get("/api/identity/:wallet",(req,res)=>{
try{

const { getIdentity } = require("./database/identityStore.js");

const identity=getIdentity(req.params.wallet);

if(!identity)
return res.status(404).json({
error:"identity not found"
});

res.json(identity);

}catch(e){

res.status(500).json({
error:e.message
});

}

});

app.listen(PORT,()=>{

console.log(
`Sovereign Identity Engine V12.0 Production running on ${PORT}`
);

});
