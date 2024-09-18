const unAuthenticated = require('../errors/unAuthenticated');

const checkUserPermissions = (user, resourceId) => {
    if(user.id.toString() === resourceId.toString()) return;
    throw new unAuthenticated('You do not have permission to perform this action');
}

module.exports = checkUserPermissions;