const {unAuthenticated} = require('../errors');

const checkAdminPermissions = (requestUser) => {
   if(requestUser.role === "admin") return;
   throw new unAuthenticated('Not Authorized to access this route');
}

module.exports = checkAdminPermissions;