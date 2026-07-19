import express from "express";
import { analyzeWallet } from "./walletAnalyzer.js";

const app = express();

app.get("/api/status",(req,res)=>{
res.json({
engine:"Sovereign Identity Engine",
version:"V6",
status:"online"
});
});


app.get("/api/identity/:wallet",async(req,res)=>{

try{

const result =
await analyzeWallet(req.params.wallet);

res.json(result);

}catch(e){

res.status(500).json({
error:e.message
});

}

});


app.listen(3000,()=>{

console.log(
"🚀 Sovereign Identity API V6 :3000"
);

});
