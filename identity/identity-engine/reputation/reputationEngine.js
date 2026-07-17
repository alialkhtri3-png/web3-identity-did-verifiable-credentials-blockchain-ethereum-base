export function calculateReputation(data){

    let score = 0;

    let signals = [];


    // Activity
    const tx =
        data.activity?.transactions || 0;


    if(tx > 100){

        score += 30;

        signals.push(
            "high_activity"
        );

    } 
    else if(tx > 0){

        score += 15;

        signals.push(
            "wallet_activity"
        );

    }


    // Tokens
    const tokens =
        data.tokens?.length || 0;


    if(tokens > 5){

        score += 20;

        signals.push(
            "token_diversity"
        );

    }


    // Wallet age
    if(data.activity?.firstSeen){

        score += 10;

        signals.push(
            "wallet_age"
        );

    }


    // Graph
    const edges =
        data.graph?.edges?.length || 0;


    if(edges > 10){

        score += 20;

        signals.push(
            "network_connections"
        );

    }


    let role="New Wallet";


    if(score >=70)

        role="Trusted User";

    else if(score >=40)

        role="Active User";

    else if(score >=20)

        role="Emerging User";



    return {

        score,

        role,

        level:
            score >=70 ? "High" :
            score >=40 ? "Medium" :
            "Low",


        signals

    };

}
