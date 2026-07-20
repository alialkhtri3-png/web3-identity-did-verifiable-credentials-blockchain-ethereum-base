const express=require("express");
const crypto=require("crypto");

const app=express();

const registry={};

const wallets=[
"0x412E8548be87Da2e16E2fd74A6b7099C9d90933C",
"0xba777ae3a3c91fcd83ef85bfe65410592bdd0f7c"
];

function createCredential(address){

const credential={
id:"cred-"+crypto.randomBytes(8).toString("hex"),
type:"SovereignIdentityCredential",
version:"V26",
issuer:"AliAlkhtri Identity Engine",
subject:{
wallet:address,
did:"did:ethr:"+address,
identity:"Verified Human Multi-chain",
reputation:95,
confidence:95,
risk:"LOW"
},
created:new Date().toISOString()
};

const hash=crypto
.createHash("sha256")
.update(JSON.stringify(credential))
.digest("hex");

credential.proof={
type:"SHA256Proof",
hash
};

registry[credential.id]=credential;

return credential;
}


wallets.forEach(w=>{
createCredential(w);
});


app.get("/",(req,res)=>{
res.json({
engine:"AliAlkhtri Sovereign Identity Engine V26",
status:"ONLINE",
module:"Credential Registry"
});
});


app.get("/registry",(req,res)=>{
res.json({
count:Object.keys(registry).length,
credentials:Object.values(registry)
});
});


app.get("/verify/:id",(req,res)=>{

const credential=registry[req.params.id];

if(!credential)
return res.status(404).json({
valid:false,
message:"Credential not found"
});


const copy={...credential};
delete copy.proof;

const hash=crypto
.createHash("sha256")
.update(JSON.stringify(copy))
.digest("hex");


res.json({
valid:hash===credential.proof.hash,
credential,
verificationHash:hash
});

});


app.get("/credential/:wallet",(req,res)=>{

let c=Object.values(registry)
.find(x=>x.subject.wallet.toLowerCase()==req.params.wallet.toLowerCase());

if(!c)
return res.status(404).json({error:"not found"});

res.json(c);

});


app.listen(3000,()=>{
console.log("✅ V26 Registry API running http://localhost:3000");
});

