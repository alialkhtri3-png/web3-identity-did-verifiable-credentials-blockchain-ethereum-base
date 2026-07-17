import crypto from "crypto";

export function createCredential(data){

const payload={
 type:"SovereignIdentityCredential",
 wallet:data.wallet,
 identity:data.identity || "Unverified",
 reputation:data.reputation || 0,
 trustScore:data.trustScore || 0,
 risk:data.sybilRisk || "UNKNOWN",
 confidence:data.confidence || 0,
 issuedAt:new Date().toISOString()
};


const hash=crypto
.createHash("sha256")
.update(JSON.stringify(payload))
.digest("hex");


return {
 credentialId:"cred-"+Date.now(),
 payload,
 proof:{
  type:"SHA256",
  hash,
  verified:true
 }
};

}
