const usageDB = {};

export function trackUsage(tenantId){

    if(!usageDB[tenantId]){

        usageDB[tenantId] = {
            requests:0,
            lastRequest:null
        };

    }


    usageDB[tenantId].requests++;

    usageDB[tenantId].lastRequest =
        new Date().toISOString();


    return usageDB[tenantId];

}


export function getUsage(tenantId){

    return usageDB[tenantId] || {
        requests:0,
        lastRequest:null
    };

}
