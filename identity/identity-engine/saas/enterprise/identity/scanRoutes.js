import express from "express";
import { analyzeWalletIdentity } from "./intelligence.js";
import { realScanWallet } from "./realScanner.js";

export const scanRoutes = express.Router();

async function scanWallet(wallet){

    return await realScanWallet(wallet);

}

scanRoutes.post(
"/scan",
async(req,res)=>{

    const {wallet,orgId}=req.body;

    const data = await scanWallet(wallet);

    const result = analyzeWalletIdentity({
        chains:data.chains,
          graphScore:data.graphScore,
          cluster:data.cluster,
        ...data,
        orgId
    });

    res.json(result);

});
