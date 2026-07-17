import fs from "fs";

const FILE="./saas/enterprise/data/federation.json";


function load(){

if(!fs.existsSync(FILE))
 return {organizations:[],links:[]};

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


export function registerOrganization(orgId,name){

const data=load();

if(!data.organizations.find(o=>o.orgId===orgId)){

data.organizations.push({
 orgId,
 name:name || "Unknown Organization",
 createdAt:new Date().toISOString()
});

}

save(data);

return data;

}


export function federateIdentity(orgA,orgB,trust){

const data=load();

data.links.push({
 from:orgA,
 to:orgB,
 trust:trust || 0,
 createdAt:new Date().toISOString()
});

save(data);

return data;

}


export function getFederation(){

return load();

}
