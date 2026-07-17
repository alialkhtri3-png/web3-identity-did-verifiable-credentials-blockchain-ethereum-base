import fs from "fs";

const FILE = "./saas/api-keys.json";


function load(){

    if(!fs.existsSync(FILE)){
        return [];
    }

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



export function createApiKey(tenantId){

    const keys = load();

    const key =
    "sk_" +
    Math.random()
    .toString(36)
    .substring(2,14);


    const record = {

        apiKey:key,

        tenantId,

        createdAt:
        new Date().toISOString()

    };


    keys.push(record);

    save(keys);


    return record;

}



export function verifyApiKey(key){

    const keys = load();


    return keys.find(
        item =>
        item.apiKey === key
    );

}
