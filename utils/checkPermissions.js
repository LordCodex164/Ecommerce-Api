const {unAuthenticated} = require('../errors');

const checkAdminPermissions = (requestUser) => {
    console.log("requestUser", requestUser);
   if(requestUser.role === "admin") return;
   throw new unAuthenticated('Not Authorized to access this route');
}

module.exports = checkAdminPermissions;