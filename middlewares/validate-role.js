
const validateRoleAdmin = (req, res, next) => {
    if (!req.userLogged) return res.status(401)
        .json({
            message: `Token verify is required - role validation`
        })

    const userLogged = req.userLogged;

    if (userLogged.role !== 'ADMIN_ROLE') return res.status(401)
        .json({
            message: `You dont have permission - you role is ${userLogged.role}`
        })
    next();
}

const validateRole = (...roles) => {

    return (req, res, next) => {

        if (!req.userLogged) return res.status(401)
            .json({
                message: `Token verify is required - role validation`
            })

        const userLogged = req.userLogged;

        if (!roles.includes(userLogged?.role)) return res.status(401)
            .json({
                message: `You dont have permission - you role is ${userLogged.role}`
            })

        next();
    }
}



module.exports = {
    validateRoleAdmin,
    validateRole
}