const invoices=[];


export function createInvoice(
orgId,
amount
){

const invoice={

id:"inv-"+Date.now(),

orgId,

amount,

status:"pending",

createdAt:new Date().toISOString()

};


invoices.push(invoice);

return invoice;

}



export function getInvoices(orgId){

return invoices.filter(
i=>i.orgId===orgId
);

}
