import {
 getConnections
} from "./graphBuilder.js";


export function detectSybil(wallet){

    const connections =
    getConnections(wallet);


    const count =
    connections.length;


    let score = 0;
    let risk = "LOW";


    if(count === 0){

        score = 50;
        risk = "UNKNOWN";

    }

    else if(count < 5){

        score = 30;
        risk = "LOW";

    }

    else if(count < 50){

        score = 15;
        risk = "LOW";

    }

    else {

        score = 70;
        risk = "HIGH";

    }


    return {

        connections:count,

        sybilScore:score,

        sybilRisk:risk

    };

}
