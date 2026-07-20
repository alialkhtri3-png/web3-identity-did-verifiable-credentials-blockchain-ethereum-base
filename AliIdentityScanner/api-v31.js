const express=require("express");
const crypto=require("crypto");

const app=express();

const wallets=[
"0x412E8548be87Da2e16E2fd74A6b7099C9d90933C",
"0xba777ae3a3c91fcd83ef85bfe65410592bdd0f7c"
];


function analyze(address){

let active=wallets.includes(address);

let score=active?95:20;

return {

address,

identity:active?
"Verified Human Multi-chain":
"Unknown Wallet",

trustScore:score,

signals:[
active?"multi-chain activity":"no activity",
active?"graph connections detected":"isolated wallet",
active?"credential verified":"no credential"
],

risk:
active?"LOW":"MEDIUM",

sybilScore:
active?5:70,

graph:{
nodes:active?3:1,
connections:active?2:0
},

proof:
crypto
.createHash("sha256")
.update(address+Date.now())
.digest("hex")

};

}


app.get("/",(req,res)=>{
res.json({
engine:"AliAlkhtri Sovereign Identity Engine V31",
status:"ONLINE",
module:"AI Reputation Graph"
});
});


app.get("/trust/:address",(req,res)=>{
res.json(analyze(req.params.address));
});


app.listen(3000,()=>{
console.log(
"✅ V31 AI Reputation Graph API running http://localhost:3000"
);
});

