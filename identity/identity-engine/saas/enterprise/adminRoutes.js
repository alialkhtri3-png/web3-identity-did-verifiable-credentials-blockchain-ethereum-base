import {
createSubscription,
getSubscriptions
} from "./billing/subscriptions.js";


import {
createInvoice,
getInvoices
} from "./billing/invoices.js";

import express from "express";

import {
    createOrganization,
    getOrganizations
} from "./organizations.js";

import {
    addMember,
    getMembers
} from "./members.js";

import {
    addAuditLog,
    getAuditLogs
} from "./auditLogs.js";


export const adminRoutes = express.Router();


// Create Organization
adminRoutes.post("/organizations",(req,res)=>{

    const {name}=req.body;

    const org =
    createOrganization(
    name,
    req.tenant.tenantId
);


    addAuditLog(
        org.id,
        "CREATE_ORGANIZATION",
        req.user?.role || "OWNER",
        req.user?.tenantId
    );


    res.json(org);

});


// List Organizations
adminRoutes.get("/organizations",(req,res)=>{

    res.json(
        getOrganizations(
    req.tenant.tenantId
)
    );

});


// Add Member
adminRoutes.post("/members",(req,res)=>{

    const {
        orgId,
        wallet,
        role
    } = req.body;


    const member =
    addMember(
        orgId,
        wallet,
        role
    );


    addAuditLog(
        orgId,
        "ADD_MEMBER",
        req.user?.role || "OWNER",
        req.user?.tenantId
    );


    res.json(member);

});


// List Members
adminRoutes.get("/members/:orgId",(req,res)=>{

    res.json(
        getMembers(
            req.params.orgId
        )
    );

});
adminRoutes.post(
"/subscriptions",
(req,res)=>{

const sub =
createSubscription(
req.body.orgId,
req.body.plan
);

res.json(sub);

});


adminRoutes.get(
"/subscriptions",
(req,res)=>{

res.json(
getSubscriptions()
);

});



adminRoutes.post(
"/invoices",
(req,res)=>{


const invoice =
createInvoice(
req.body.orgId,
req.body.amount
);


res.json(invoice);

});


adminRoutes.get(
"/invoices/:orgId",
(req,res)=>{


res.json(
getInvoices(req.params.orgId)
);


});


// Audit Logs
adminRoutes.get("/audit/:orgId",(req,res)=>{

    res.json(
        getAuditLogs(
            req.params.orgId
        )
    );

});

