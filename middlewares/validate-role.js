
const validateRoleAdmin = (req, res, next) => {
    if (!req.userLogged) return res.status(401)
        .json({
            messgae: `Token verify is required - role validation`
        })

    const { userLogged } = req.userLogged;

    if (!roles.includes(userLogged.role)) return res.status(401)
        .json({
            messgae: `You dont have permission - you role is ${userLogged.role}`
        })
    next();
}

const validateRole = (...roles) => {

    return (req, res, next) => {

        if (!req.userLogged) return res.status(401)
            .json({
                messgae: `Token verify is required - role validation`
            })

        const { userLogged } = req.userLogged;

        if (!roles.includes(userLogged.role)) return res.status(401)
            .json({
                messgae: `You dont have permission - you role is ${userLogged.role}`
            })

        next();
    }
}



module.exports = {
    validateRoleAdmin,
    validateRole
}