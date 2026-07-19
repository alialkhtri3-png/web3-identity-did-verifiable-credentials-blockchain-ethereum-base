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
