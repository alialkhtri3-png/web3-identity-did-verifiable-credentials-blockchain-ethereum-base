import fs from "fs";

const FILE="./saas/enterprise/data/audit.json";

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


export function addAuditLog(
    orgId,
    action,
    actor,
    tenantId
){

    const logs = load();


    const log={

        id:"audit-"+Date.now(),

        orgId,

        action,

        tenant:tenantId || "unknown",

        actor,

        timestamp:new Date().toISOString()

    };


    logs.push(log);

    save(logs);

    return log;

}



export function getAuditLogs(orgId){

    const logs = load();

    return logs.filter(
        l=>l.orgId===orgId
    );

}
