const express=require("express");
const crypto=require("crypto");
const fs=require("fs");

const app=express();
app.use(express.json());

const profiles={
"0x412E8548be87Da2e16E2fd74A6b7099C9d90933C":{
identity:"Verified Human Multi-chain",
reputation:95,
confidence:95,
risk:"LOW",
graph:{
connections:2,
score:80
}
},
"0xba777ae3a3c91fcd83ef85bfe65410592bdd0f7c":{
identity:"Active Wallet",
reputation:60,
confidence:90,
risk:"LOW",
graph:{
connections:1,
score:40
}
}
};


function createCredential(address){

let profile=profiles[address];

if(!profile){
return null;
}

let credential={
type:"SovereignIdentityCredential",
version:"V25",
issuer:"AliAlkhtri Identity Engine",
subject:{
wallet:address,
did:"did:ethr:"+address,
identity:profile.identity,
reputation:profile.reputation,
confidence:profile.confidence,
risk:profile.risk
},
graph:profile.graph,
created:new Date().toISOString()
};


let hash=crypto
.createHash("sha256")
.update(JSON.stringify(credential))
.digest("hex");


credential.proof={
type:"SHA256Proof",
hash:hash
};


fs.writeFileSync(
"credential-v25.json",
JSON.stringify(credential,null,2)
);


return credential;
}


app.get("/",(req,res)=>{
res.json({
engine:"AliAlkhtri Sovereign Identity Engine V25",
status:"ONLINE",
module:"Verifiable Credential Proof Layer"
});
});


app.get("/credential/:address",(req,res)=>{

let c=createCredential(req.params.address);

if(!c)
return res.status(404).json({
error:"identity not found"
});

res.json(c);

});


app.get("/verify/:hash",(req,res)=>{

let data=fs.existsSync("credential-v25.json")
?JSON.parse(fs.readFileSync("credential-v25.json"))
:null;

if(data && data.proof.hash===req.params.hash){

return res.json({
verified:true,
issuer:data.type,
credential:data.subject
});

}

res.json({
verified:false
});

});


app.listen(3000,()=>{
console.log("✅ V25 Verifiable Credential API running http://localhost:3000");
});
