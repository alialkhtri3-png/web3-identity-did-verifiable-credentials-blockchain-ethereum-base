const express=require("express");
const fs=require("fs");

const app=express();

const report=JSON.parse(
 fs.readFileSync("identity-report-v19.json")
);

app.get("/",(req,res)=>{
 res.json({
  engine:"AliAlkhtri Sovereign Identity Engine V20",
  status:"ONLINE",
  wallets:report.wallets.length
 });
});

app.get("/identity/:address",(req,res)=>{

const wallet=report.wallets.find(
 w=>w.address.toLowerCase()
 ===req.params.address.toLowerCase()
);

if(!wallet)
 return res.status(404).json({
  error:"Identity not found"
 });

res.json(wallet);

});


app.get("/proof",(req,res)=>{
res.json(report.proof);
});


app.listen(3000,()=>{
console.log(
"✅ V20 API running http://localhost:3000"
);
});
