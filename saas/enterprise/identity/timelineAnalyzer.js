export function analyzeTimeline(data){

    const tx = data.transactions || 0;

    let lifecycle="New";

    if(tx>1000)
        lifecycle="Whale";

    else if(tx>100)
        lifecycle="Active";

    else if(tx>10)
        lifecycle="Growing";


    return {

        walletAgeDays:
            data.walletAgeDays || 0,

        activeDays:
            data.activeDays || tx,

        lifecycle,

        activityRate:
            tx===0 ? 0 : Math.min(tx/100,100)

    };
}
