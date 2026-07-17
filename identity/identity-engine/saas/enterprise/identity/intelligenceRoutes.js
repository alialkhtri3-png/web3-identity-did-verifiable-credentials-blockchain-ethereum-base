import express from "express";

import {
 analyzeWalletIdentity,
 getWalletIntelligence
} from "./intelligence.js";


export const intelligenceRoutes =
express.Router();


intelligenceRoutes.post(
"/analyze",
(req,res)=>{

    res.json(
        analyzeWalletIdentity(req.body)
    );

});


intelligenceRoutes.get(
"/:wallet",
(req,res)=>{

    res.json(
        getWalletIntelligence(
            req.params.wallet
        )
    );

});


export const attestationRoutes = express.Router();

attestationRoutes.get(
"/attestation/:wallet",
(req,res)=>{

 const records =
 getWalletIntelligence(
 req.params.wallet
 );

 if(!records.length){
   return res.json({
     verified:false,
     message:"No identity found"
   });
 }

 const latest =
 records[records.length-1];

 res.json({
   verified:true,
   wallet:latest.wallet,
   attestation:latest.attestation,
   passport:latest.passport
 });

});
