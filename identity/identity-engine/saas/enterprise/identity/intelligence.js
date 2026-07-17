import fs from "fs";
import {createVerifiableCredential} from "./verifiableCredential.js";
import {createCredential} from "./credentialEngine.js";
import crypto from "crypto";
import { analyzeBehavior } from "./behaviorEngine.js";
import { classifyIdentity } from "./aiClassifier.js";

const FILE="./saas/enterprise/data/onchain-intelligence.json";


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



export function analyzeWalletIdentity(data){

    const records=load();

    const behavior=analyzeBehavior(data);

      const result={

        id:"intel-"+Date.now(),

        wallet:data.wallet,

        orgId:data.orgId,

        network:data.network || "Base",

        aiIdentity:data.aiIdentity,

        entities:data.entities,

        chains:data.chains,

        graphScore:data.graphScore || 0,

        cluster:data.cluster,

        sybilCluster:{
            clusterId:
                "cluster-"+Date.now(),

            members:
                data.cluster?.connections || 0,

            risk:
                data.sybilRisk || "UNKNOWN",

            similarity:
                data.graphScore || 0
        },

        behavior,

        trustScore:{
            score:
                (data.reputation || 0)
                +
                (data.graphScore || 0)
                +
                (data.confidence || 0),

            grade:
                ((data.reputation || 0)+(data.graphScore || 0)+(data.confidence || 0)) >= 80
                ? "A"
                :
                ((data.reputation || 0)+(data.graphScore || 0)+(data.confidence || 0)) >= 40
                ? "B"
                :
                "C",

            signals:{
                reputation:data.reputation || 0,
                graph:data.graphScore || 0,
                confidence:data.confidence || 0,
                sybilRisk:data.sybilRisk || "UNKNOWN"
            }
        },

        reputationProfile:{
            score:data.reputation || 0,
            graph:data.graphScore || 0,
            confidence:
                data.confidence ||
                data.aiIdentity?.confidence ||
                0,
            level:
                data.reputation >= 80
                ? "TRUSTED"
                :
                data.reputation >= 40
                ? "ACTIVE"
                :
                "NEW"
        },

        transactions:data.transactions || 0,

        connections:data.connections || 0,

        tokens:data.tokens || 0,

        reputation:data.reputation || 0,

        sybilRisk:data.sybilRisk || "UNKNOWN",

        identity:
            data.reputation >= 80
            ? "Verified Human"
            :
            "Unverified",

        confidence:
                data.confidence ||
                data.aiIdentity?.confidence ||
                0,

        history:data.history,

        timeline:{
    firstSeen:data.firstSeen || new Date().toISOString(),
    lastActivity:new Date().toISOString(),
    activityDays:data.transactions > 0 ? 1 : 0,
    lifecycle:
        data.transactions > 50 ? "MATURE"
        : data.transactions > 5 ? "ACTIVE"
        : "NEW"
},

memory:{
    scans:1,
    previousReputation:data.reputation || 0,
    previousRisk:data.sybilRisk || "UNKNOWN",
    trend:
      data.transactions > 10
      ? "GROWING"
      : "STABLE",
    evolution:{
      reputationChange:0,
      riskChange:"UNCHANGED",
      trustDirection:
        data.confidence >= 50
        ? "IMPROVING"
        : "STABLE",
      history:{
        previousScore:data.reputation || 0,
        currentScore:data.reputation || 0,
        delta:0,
        events:1
      }
    }
},

passport:{
    version:"V10.1",
    status:
      data.reputation >= 80
      ? "VERIFIED"
      : "UNVERIFIED",
    identityScore:data.confidence || 0,
    reputation:data.reputation || 0,
    risk:data.sybilRisk || "UNKNOWN",
    verification:{
      authenticityScore:
        Math.min(
          100,
          (data.reputation || 0) +
          (data.graphScore || 0) +
          (data.confidence || 0)
        ),
      level:
        data.confidence >= 70
        ? "HIGH"
        : data.confidence >= 30
        ? "MEDIUM"
        : "LOW"
    }
},

attestation:{
    id:"att-"+Date.now(),
    type:"Wallet Identity Proof",
    issuer:"Sovereign Identity Engine",
    claims:{
      walletType:data.aiIdentity?.walletType || "UNKNOWN",
      activity:data.behavior?.walletClass || "UNKNOWN",
      reputation:data.reputation || 0,
      risk:data.sybilRisk || "UNKNOWN",
      confidence:data.confidence || 0
    },
    issuedAt:new Date().toISOString()
},

signature:{
    algorithm:"SHA256",
    hash:crypto
      .createHash("sha256")
      .update(data.wallet + JSON.stringify(data))
      .digest("hex"),
    verified:true
},

credential:{
    credentialId:"cred-"+Date.now(),
    type:"Sovereign Identity Credential",
    subject:data.wallet,
    claims:{
        identity:data.aiIdentity?.category || "UNKNOWN",
        reputation:data.reputation || 0,
        trust:data.confidence || 0,
        risk:data.sybilRisk || "UNKNOWN"
    },
    proof:{
        type:"SHA256",
        verified:true
    },
    credential:createCredential(data),
      verifiableCredential:createVerifiableCredential(data),

createdAt:new Date().toISOString()
},

credential:createCredential(data),
      verifiableCredential:createVerifiableCredential(data),

createdAt:new Date().toISOString()

    };


    records.push(result);

    save(records);

    return result;
}


export function getWalletIntelligence(wallet){

    return load().filter(
        x=>x.wallet===wallet
    );

}
