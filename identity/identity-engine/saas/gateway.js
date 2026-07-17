import express from "express";
import { verifyApiKey } from "./apiKeys.js";

export const gateway = express.Router();


gateway.use((req,res,next)=>{


    const key = req.headers["x-api-key"];


    if(!key){

        return res.status(401).json({
            error:"Missing API Key"
        });

    }


    const tenant = verifyApiKey(key);


    if(!tenant){

        return res.status(403).json({
            error:"Invalid API Key"
        });

    }


    req.tenant = tenant;

    next();

});
