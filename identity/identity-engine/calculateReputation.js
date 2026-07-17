
export function calculateReputation({
    activity = {},
    tokens = [],
    sybil = {}
}) {

    let score = 0;


    if(activity.transactions){
        score += activity.transactions.length;
    }


    if(tokens.length){
        score += tokens.length * 5;
    }


    if(sybil.score){
        score -= sybil.score;
    }


    let label = "New Wallet";


    if(score >= 100){
        label = "Trusted User";
    }
    else if(score >= 30){
        label = "Active User";
    }


    return {

        score,

        label,

        risk:
            sybil.score > 50
            ? "High"
            : "Low"

    };

}

