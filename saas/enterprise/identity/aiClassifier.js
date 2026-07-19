export function classifyIdentity(data){

    let category="User";
    let walletType="EOA";
    let behavior="Normal";
    let riskLevel="LOW";

    if(data.transactions > 5000){
        category="Power User";
        behavior="Highly Active";
    }

    if(data.tokens > 50){
        category="Trader";
    }

    if(data.connections > 100){
        category="Network Hub";
    }

    if(data.sybilRisk==="HIGH"){
        riskLevel="HIGH";
        behavior="Suspicious";
    }

    if(data.sybilRisk==="LOW" && data.transactions > 20){
        category="Human Activity";
    }

    const confidence =
        Math.min(
            95,
            50 +
            (data.transactions || 0)/100 +
            (data.tokens || 0)
        );

    return {
        category,
        behavior,
        walletType,
        riskLevel,
        confidence:Math.round(confidence)
    };
}
