// SaaS Plans V8.1

const plans = {

    free:{
        name:"Free",
        scans:100,
        apiCalls:1000,
        features:[
            "wallet-analysis",
            "basic-reputation"
        ]
    },


    pro:{
        name:"Pro",
        scans:10000,
        apiCalls:100000,
        features:[
            "wallet-analysis",
            "sybil-detection",
            "graph-intelligence",
            "token-analysis"
        ]
    },


    enterprise:{
        name:"Enterprise",
        scans:"unlimited",
        apiCalls:"unlimited",
        features:[
            "full-identity-engine",
            "custom-rules",
            "priority-api",
            "dedicated-support"
        ]
    }

};


function getPlan(name){

    return plans[name] || plans.free;

}


module.exports={
    plans,
    getPlan
};
