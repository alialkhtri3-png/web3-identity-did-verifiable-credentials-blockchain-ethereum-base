export const tenants = new Map();

export function createTenant(id, name){

    const tenant = {
        id,
        name,
        createdAt:new Date().toISOString()
    };

    tenants.set(id, tenant);

    return tenant;
}


export function getTenant(id){

    return tenants.get(id);

}
