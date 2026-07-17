import express from "express";
import { authorize } from "./auth.js";
import { analyzeWallet } from "./analyzer/walletAnalyzer.js";

const app = express();

app.use(express.json());

app.post("/api/v1/identity/analyze", authorize, async (req,res)=>{

    try {

        const { wallet } = req.body;

        if(!wallet){
            return res.status(400).json({
                error:"Wallet address required"
            });
        }

        const identity = await analyzeWallet(wallet);

        res.json({
            success:true,
            wallet,
            identity,
            issuedAt:new Date().toISOString()
        });

    } catch(error){

        console.error(error);

        res.status(500).json({
            error:error.message
        });

    }

});


app.listen(3002,()=>{
 console.log("SIE API Gateway V12.1 Intelligence running on port 3002");
});
