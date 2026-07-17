#!/data/data/com.termux/files/usr/bin/bash

echo "🔧 Updating Audit Logs..."

cat > saas/enterprise/auditLogs.js <<'JS'
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
JS



echo "🔧 Updating Admin Routes..."

python - <<'PY'
p="saas/enterprise/adminRoutes.js"

s=open(p).read()

s=s.replace(
'addAuditLog(\n        org.id,\n        "CREATE_ORGANIZATION",\n        "admin"\n    );',
'addAuditLog(\n        org.id,\n        "CREATE_ORGANIZATION",\n        "OWNER",\n        req.tenant.tenantId\n    );'
)

open(p,"w").write(s)
PY



echo "✅ Syntax Check"

node --check saas/enterprise/auditLogs.js
node --check saas/enterprise/adminRoutes.js
node --check server.js


echo "🚀 Restart Server"

pkill node

node server.js
