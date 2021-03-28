const checkAuthentication = (req, res, next) => {
    console.log(req.isAuthenticated());

    if (req.isAuthenticated()) {
        next();
    } else {
        //res.redirect("/login");
        res.status(401).send("Please log in first.");
    }
}

module.exports = checkAuthentication;