const express=require("express");
const fs=require("fs");

const app=express();

const report=JSON.parse(
fs.readFileSync("identity-report-v19.json")
);


app.get("/",(req,res)=>{
res.json({
engine:"AliAlkhtri Sovereign Identity Engine V24",
status:"ONLINE",
module:"Public Identity Profile"
});
});


app.get("/profile/:address",(req,res)=>{

let wallet=report.wallets.find(
w=>w.address.toLowerCase()===
req.params.address.toLowerCase()
);

if(!wallet)
return res.status(404).json({
error:"wallet not found"
});


res.json({
profile:{
address:wallet.address,
did:wallet.did,
identity:wallet.identity,
reputation:wallet.reputation,
confidence:wallet.confidence,
risk:wallet.risk
},
graph:wallet.graph,
credential:{
type:"SovereignIdentityCredential",
issuer:"AliAlkhtri Identity Engine V24"
}
});

});


app.listen(3000,()=>{
console.log(
"✅ V24 Public Identity API running http://localhost:3000"
);
});
