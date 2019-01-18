module.exports = function(user, userDetails) {
    if (userDetails.username)
        user.username = userDetails.username;
    if (userDetails.email)
        user.email = userDetails.email;
    if (userDetails.colour)
        user.colour = userDetails.colour;
    return user;
}