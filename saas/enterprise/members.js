import fs from "fs";

const FILE = "./saas/enterprise/data/members.json";


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


export function addMember(
    orgId,
    wallet,
    role
){

    const members = load();

    const member = {

        id:"member-" + Date.now(),

        orgId,

        wallet,

        role,

        createdAt:
        new Date().toISOString()

    };


    members.push(member);

    save(members);


    return member;

}



export function getMembers(orgId){

    return load()
    .filter(
        m=>m.orgId===orgId
    );

}
