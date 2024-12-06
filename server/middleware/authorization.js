const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async(req, res, next) => {
    try {
        // 1. destructure the token
        const token = req.header("token");

        if (!token) { // if no token, obviously we're not permitted to enter 
            return res.status(403).json("Not authorized");
        }

        const payload = jwt.verify(token, process.env.HWT_SECRET); // method provided by jsonwebtoken

        req.user = payload.user; // i lowkey don't get what this line does

    } catch (err) {
        console.error(err.message);
        return res.status(403).json("Not authorized"); // 401 refers to the lack of valid authentication credentials, whereas the 403 error occurs after authentication, signaling the absence of necessary permissions to access a resource.
    }
}