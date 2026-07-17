const subscriptions = [];


export function createSubscription(
orgId,
plan
){

const sub = {

id:"sub-"+Date.now(),

orgId,

plan,

status:"active",

createdAt:new Date().toISOString()

};


subscriptions.push(sub);

return sub;

}



export function getSubscriptions(){

return subscriptions;

}



export function getOrganizationSubscription(orgId){

return subscriptions.find(
s=>s.orgId===orgId
);

}
