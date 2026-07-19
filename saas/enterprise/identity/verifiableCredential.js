import crypto from "crypto";

export function createVerifiableCredential(data){

const credential={
 "@context":[
  "https://www.w3.org/2018/credentials/v1"
 ],
 type:[
  "VerifiableCredential",
  "SovereignIdentityCredential"
 ],
 issuer:"did:sovereign:engine",
 issuanceDate:new Date().toISOString(),

 credentialSubject:{
  id:"did:sovereign:"+data.wallet.toLowerCase(),
  wallet:data.wallet,
  identity:data.identity || "Unverified",
  reputation:data.reputation || 0,
  risk:data.sybilRisk || "UNKNOWN",
  confidence:data.confidence || 0
 }
};

const proof=crypto
.createHash("sha256")
.update(JSON.stringify(credential))
.digest("hex");

credential.proof={
 type:"SHA256IntegrityProof",
 proofValue:proof,
 verified:true
};

return credential;

}
