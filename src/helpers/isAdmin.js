/**
 * [isAdmin description]
 * @param  {[type]}  userGroups [description]
 * @return {Boolean}            [description]
 */
export default function isAdmin(userGroups){
    return Object.keys(userGroups).filter(function(id) {
        return userGroups[id] === 'admins';
    })[0];
}