import jwt from 'jsonwebtoken';

const userAuth = async(req, res, next) => {
    const {token} = req.cookies;

    if (!token) {
        return res.json({success: false, message: "Unauthorized access please login"});
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if(decoded.id){
            req.user = { userId: decoded.id };
        } else{
            return res.json({success: false, message: "Unauthorized access please login"});
        }
        next();

    } catch (error) {
        console.error("JWT verification failed:", error);
        return res.json({success: false, message: "Invalid token"});
    }
}
 
export default userAuth;
