#!/bin/bash

echo "🔧 Installing V8.3 Identity Binding Layer..."

mkdir -p saas/enterprise/identity
mkdir -p saas/enterprise/data


cat > saas/enterprise/identity/profile.js <<'EOF'
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
EOF



cat > saas/enterprise/identity/routes.js <<'EOF'
import express from "express";

import {
 createIdentityProfile,
 getIdentityByOrg
}
from "./profile.js";


export const identityRoutes =
express.Router();



identityRoutes.post(
"/bind",
(req,res)=>{


 const profile =
 createIdentityProfile(
    req.body
 );


 res.json(profile);


});



identityRoutes.get(
"/:orgId",
(req,res)=>{


 res.json(
    getIdentityByOrg(
        req.params.orgId
    )
 );


});
EOF



python3 - <<'EOF'
p="server.js"

s=open(p).read()

if 'identityRoutes' not in s:

    s=s.replace(
'import { adminRoutes } from "./saas/enterprise/adminRoutes.js";',
'import { adminRoutes } from "./saas/enterprise/adminRoutes.js";\nimport { identityRoutes } from "./saas/enterprise/identity/routes.js";'
    )


    s=s.replace(
'// Health',
'app.use("/api/identity", identityRoutes);\n\n// Health'
    )


open(p,"w").write(s)
EOF



echo "✅ Syntax Check"

node --check saas/enterprise/identity/profile.js
node --check saas/enterprise/identity/routes.js
node --check server.js


echo "🚀 Restart Engine"

pkill node

nohup node server.js > engine.log 2>&1 &

sleep 2

cat engine.log


echo "✅ V8.3 Identity Binding Ready"
