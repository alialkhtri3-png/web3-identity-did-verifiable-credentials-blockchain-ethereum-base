export function calculateScore(wallet){

  let activityScore = 0;
  let sybilScore = 50;
  let role = "New Wallet";


  if(wallet.transactions > 100){
    activityScore += 40;
    sybilScore -= 20;
  }
  else if(wallet.transactions > 10){
    activityScore += 20;
    sybilScore -= 10;
  }
  else if(wallet.transactions === 0){
    sybilScore += 20;
  }


  const balance = Number(wallet.balance || 0);


  if(balance > 1){
    activityScore += 20;
    sybilScore -= 10;
  }
  else if(balance > 0){
    activityScore += 10;
  }


  if(wallet.firstActivity){
    activityScore += 20;
    sybilScore -= 10;
  }


  if(sybilScore < 0)
    sybilScore = 0;


  if(activityScore > 100)
    activityScore = 100;


  if(activityScore >= 70 && sybilScore < 20){
    role = "Trusted User";
  }
  else if(activityScore >= 30){
    role = "Active User";
  }
  else{
    role = "New Wallet";
  }


  return {
    activityScore,
    sybilScore,
    role
  };

}
