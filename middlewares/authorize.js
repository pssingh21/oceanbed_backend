module.exports = function(req, res, next) {
	if (req.user.role == 1) {
		return next();
	} else {
		return next({
			status: 403,
			message: 'You dont have access'
		});
	}
}