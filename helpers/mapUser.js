module.exports = function(user, userDetails) {
    if (userDetails.username)
        user.username = userDetails.username;
    if (userDetails.email)
        user.email = userDetails.email;
    if (userDetails.colour)
        user.colour = userDetails.colour;
    if(userDetails.role)
    	user.role = userDetails.role;
    return user;
}