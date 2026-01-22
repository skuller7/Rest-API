const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admin role required.' });
    }
};

const isOperator = (req, res, next) => {
    if (req.user && (req.user.role === 'operator' || req.user.role === 'admin')) {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Operator or Admin role required.' });
    }
};

module.exports = { isAdmin, isOperator };
