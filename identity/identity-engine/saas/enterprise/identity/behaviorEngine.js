export function analyzeBehavior(data){

let score=0;

if(data.transactions>10)
score+=30;

if(data.connections>5)
score+=20;

if(data.tokens>2)
score+=15;

if(data.graphScore>20)
score+=20;

let type="New Wallet";

if(score>70)
type="Trusted Human";

else if(score>40)
type="Active User";

else if(score>20)
type="Growing Wallet";

return {
behaviorScore:score,
walletClass:type,
signals:{
transactions:data.transactions,
connections:data.connections,
tokens:data.tokens,
graph:data.graphScore
}
};

}
