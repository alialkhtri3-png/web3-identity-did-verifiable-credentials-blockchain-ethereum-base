const express=require("express");
const fs=require("fs");

const app=express();

const report=JSON.parse(
fs.readFileSync("identity-report-v19.json")
);

function analyze(w){

let signals=[];
let score=0;

if(w.reputationScore>=80){
 score+=40;
 signals.push("high reputation");
}

if(w.graph?.score>=40){
 score+=30;
 signals.push("graph activity");
}

if(w.identity?.includes("Human")){
 score+=20;
 signals.push("human behavior pattern");
}

if(w.balances){
 score+=10;
 signals.push("onchain presence");
}

let classification="Inactive";

if(score>=80)
 classification="Human Multi-chain";
else if(score>=40)
 classification="Active Wallet";

return {
 address:w.address,
 classification,
 confidence:Math.min(score,100),
 risk:score>=70?"LOW":"MEDIUM",
 signals
};

}


app.get("/",(req,res)=>{
res.json({
engine:"AliAlkhtri Sovereign Identity Engine V23",
status:"ONLINE",
module:"AI Intelligence"
});
});


app.get("/ai-analysis/:address",(req,res)=>{

let wallet=report.wallets.find(
w=>w.address.toLowerCase()===
req.params.address.toLowerCase()
);

if(!wallet)
return res.status(404).json({
error:"wallet not found"
});

res.json(analyze(wallet));

});


app.listen(3000,()=>{
console.log(
"✅ V23 AI Identity API running http://localhost:3000"
);
});
