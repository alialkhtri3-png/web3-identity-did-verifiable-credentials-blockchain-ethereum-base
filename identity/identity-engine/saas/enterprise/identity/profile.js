import fs from "fs";

const FILE="./saas/enterprise/data/identity-profiles.json";


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


export function createIdentityProfile(data){

    const profiles=load();


    const profile={

        id:"identity-"+Date.now(),

        orgId:data.orgId,

        wallet:data.wallet,

        role:data.role || "USER",

        reputation:data.reputation || 0,

        sybilRisk:data.sybilRisk || "LOW",

        createdAt:new Date().toISOString()

    };


    profiles.push(profile);

    save(profiles);


    return profile;

}



export function getIdentityByOrg(orgId){

    return load().filter(
        p=>p.orgId===orgId
    );

}
