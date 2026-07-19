import fs from "fs";

const FILE="./saas/enterprise/data/credentials.json";

function load(){
 if(!fs.existsSync(FILE)) return [];
 return JSON.parse(fs.readFileSync(FILE,"utf8"));
}

function save(data){
 fs.writeFileSync(FILE,JSON.stringify(data,null,2));
}

export function registerCredential(credential){

const list=load();

list.push(credential);

save(list);

return credential;

}

export function getCredentials(wallet){

return load().filter(
 c=>c.payload?.wallet===wallet
);

}
