const permissions = {

    OWNER:[
        "ORG_CREATE",
        "ORG_DELETE",
        "MEMBER_ADD",
        "MEMBER_REMOVE",
        "ROLE_UPDATE",
        "AUDIT_VIEW"
    ],


    ADMIN:[
        "MEMBER_ADD",
        "MEMBER_REMOVE",
        "ROLE_UPDATE",
        "AUDIT_VIEW"
    ],


    MEMBER:[
        "AUDIT_VIEW"
    ]

};



export function hasPermission(
    role,
    permission
){

    if(!permissions[role]){
        return false;
    }


    return permissions[role]
        .includes(permission);

}



export function getPermissions(role){

    return permissions[role] || [];

}
