import fs from "fs";

const FILE="./saas/enterprise/data/organizations.json";


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


export function createOrganization(name, tenant){

    const organizations = load();

    const org={
        id:"org-"+Date.now(),
        name,
        tenantId:tenant,
        createdAt:new Date().toISOString()
    };

    organizations.push(org);

    save(organizations);

    return org;
}


export function getOrganizations(tenant){

    return load().filter(
        o=>o.tenantId===tenant
    );

}
