export function analyzeEntities(data){

    const entities=[];

    if(data.transactions>0)
        entities.push("ONCHAIN_USER");

    if(data.tokens>0)
        entities.push("TOKEN_HOLDER");

    if(data.connections>5)
        entities.push("NETWORKED_WALLET");

    if(data.contracts && data.contracts>0)
        entities.push("CONTRACT_INTERACTOR");

    return {
        entities,
        entityScore:
            entities.length * 20,
        activity:
            entities.length>2
            ? "CONNECTED"
            : "LIMITED"
    };
}
