const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role.name)) {
            return res.status(403).json({ message: 'Forbidden: Access is denied' });
        }
        next();
    };
};

module.exports = { authorizeRoles };