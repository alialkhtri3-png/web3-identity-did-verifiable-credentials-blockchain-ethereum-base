import express from "express";
import {createDID} from "./didResolver.js";
import {signPassport} from "./passportSigner.js";
import {getCredentials} from "./credentialRegistry.js";
import {getWalletIntelligence} from "./intelligence.js";

export const passportRoutes = express.Router();

passportRoutes.get("/:wallet",(req,res)=>{

const wallet=req.params.wallet;

const intelligence=getWalletIntelligence(wallet);

const credentials=getCredentials(wallet);

res.json({
 wallet,
 did:createDID(wallet),
 passport:{
  credentials,
  history:intelligence,
  issuedAt:new Date().toISOString(),
  signature:signPassport({
   wallet,
   credentials,
   history:intelligence
  })
 }
});

});
