 const adminAuth = (req, res, next) => {
    console.log("MiddleWare is checking the authentiating!");
    const token = "xyz"
    const isAdminAuthorized = token === "xyz";

    if (!isAdminAuthorized) {
        res.status(401).send("You aren't authorized");
    } else {
        next()
    }

}

const userAuth = (req, res, next) => {
    console.log("MiddleWare is checking the authentiating!");
    const token = "xyz"
    const isAdminAuthorized = token === "xyz";

    if (!isAdminAuthorized) {
        res.status(401).send("You aren't authorized");
    } else {
        next()
    }

}

module.exports = {
    adminAuth,
    userAuth
}