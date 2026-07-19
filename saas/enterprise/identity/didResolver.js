export function createDID(wallet){

return {
 did:"did:sovereign:"+wallet.toLowerCase(),
 method:"sovereign",
 controller:wallet,
 createdAt:new Date().toISOString()
};

}


export function resolveDID(did){

if(!did.startsWith("did:sovereign:")){
 return null;
}

return {
 did,
 controller:did.replace("did:sovereign:",""),
 status:"active",
 resolvedAt:new Date().toISOString()
};

}
