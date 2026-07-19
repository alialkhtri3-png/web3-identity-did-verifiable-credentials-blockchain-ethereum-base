export const billing = {

    free:{
        price:0,
        requests:1000
    },

    pro:{
        price:49,
        requests:100000
    },

    enterprise:{
        price:499,
        requests:1000000
    }

};


export function getPlan(name){

    return billing[name] || billing.free;

}
