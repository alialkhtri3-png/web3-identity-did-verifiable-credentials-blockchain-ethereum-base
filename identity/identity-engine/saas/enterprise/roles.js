export const roles = {

    admin:[
        "read",
        "write",
        "manage_users"
    ],


    developer:[
        "read",
        "analyze"
    ],


    viewer:[
        "read"
    ]

};



export function hasPermission(role,permission){

    return roles[role]?.includes(permission);

}
