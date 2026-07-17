const profiles = [];


export function createProfile(data){

    const profile = {

        id:"profile-" + Date.now(),

        wallet:data.wallet,

        orgId:data.orgId,

        reputation:0,

        risk:"unknown",

        createdAt:new Date().toISOString()

    };


    profiles.push(profile);

    return profile;

}



export function getProfiles(orgId){

    return profiles.filter(
        p=>p.orgId===orgId
    );

}



export function getProfile(wallet){

    return profiles.find(
        p=>p.wallet===wallet
    );

}
