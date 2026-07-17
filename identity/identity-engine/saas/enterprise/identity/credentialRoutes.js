import express from "express";

export const credentialRoutes = express.Router();

credentialRoutes.post("/verify", async(req,res)=>{

const {credential}=req.body;

if(!credential){
 return res.status(400).json({
  verified:false,
  error:"Missing credential"
 });
}

const valid =
credential.proof &&
credential.proof.verified === true;

res.json({
 verified:valid,
 credentialId:credential.credentialId,
 wallet:credential.payload?.wallet || null,
 identity:credential.payload?.identity || "UNKNOWN",
 reputation:credential.payload?.reputation || 0,
 risk:credential.payload?.risk || "UNKNOWN",
 checkedAt:new Date().toISOString()
});

});
