import crypto from "crypto";

export function signPassport(passport){

const payload=JSON.stringify(passport);

const signature=crypto
.createHash("sha256")
.update(payload)
.digest("hex");

return {
 signature:{
  algorithm:"SHA256",
  hash:signature,
  verified:true
 },
 signedAt:new Date().toISOString()
};

}
