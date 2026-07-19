export function calculateReputation(data){

    let score = 0;


    // Transaction activity
    if(data.transactions > 500)
        score += 30;
    else if(data.transactions > 100)
        score += 20;
    else if(data.transactions > 10)
        score += 10;


    // Token activity
    if(data.tokens > 20)
        score += 20;
    else if(data.tokens > 5)
        score += 10;


    // Graph trust
    if(data.connections > 50)
        score += 25;
    else if(data.connections > 5)
        score += 15;
    else if(data.connections > 0)
        score += 5;


    // Sybil penalty
    if(data.sybilRisk === "HIGH")
        score -= 40;


    if(score < 0)
        score = 0;


    let identity =
    "Unverified";


    if(score >= 70)
        identity = "Verified Human";

    else if(score >= 40)
        identity = "Active User";


    return {

        reputation:score,

        identity,

        trustLevel:
        score >= 70 ? "A" :
        score >= 40 ? "B" :
        "C"

    };

}
