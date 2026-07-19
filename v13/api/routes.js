import express from "express";
import { verifyApiKey } from "../auth/apiKey.js";

const router = express.Router();

router.get("/v1/status", verifyApiKey, (req,res)=>{
 res.json({
  engine:"Sovereign Identity Cloud V13",
  status:"online",
  edition:"Commercial",
  modules:[
   "Passport",
   "Credential",
   "Wallet Intelligence",
   "Graph Intelligence",
   "Sybil Detection",
   "Reputation Engine"
  ]
 });
});

export default router;
