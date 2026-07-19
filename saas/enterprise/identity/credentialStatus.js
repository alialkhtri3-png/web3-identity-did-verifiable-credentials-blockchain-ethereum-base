import fs from "fs";

const FILE="./saas/enterprise/data/credential-status.json";


function load(){

if(!fs.existsSync(FILE))
 return [];

return JSON.parse(
 fs.readFileSync(FILE,"utf8")
);

}


function save(data){

fs.writeFileSync(
 FILE,
 JSON.stringify(data,null,2)
);

}


export function registerStatus(id){

const list=load();

const record={
 credentialId:id,
 status:"ACTIVE",
 createdAt:new Date().toISOString()
};

list.push(record);

save(list);

return record;

}


export function revokeCredential(id,reason){

const list=load();

const item=list.find(
 x=>x.credentialId===id
);

if(item){

item.status="REVOKED";
item.reason=reason;
item.revokedAt=new Date().toISOString();

save(list);

}

return item;

}


export function getCredentialStatus(id){

return load().find(
 x=>x.credentialId===id
) || {
 status:"UNKNOWN"
};

}
