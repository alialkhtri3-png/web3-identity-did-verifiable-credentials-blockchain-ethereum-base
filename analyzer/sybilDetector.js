export function detectSybil(data){

    let score = 0;
    let signals = [];


    if(data.activity?.transactions === 0){

        score += 20;

        signals.push(
            "no_transaction_history"
        );

    }


    if(!data.tokens || data.tokens.length===0){

        score += 10;

        signals.push(
            "no_token_activity"
        );

    }


    let risk="Low";


    if(score > 70)
        risk="High";

    else if(score > 40)
        risk="Medium";


    return {

        score,

        risk,

        signals

    };

}
