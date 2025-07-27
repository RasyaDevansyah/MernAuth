import jwt from 'jsonwebtoken';

const userAuth = async(req, res, next) => {
    const {token} = req.cookies;

    if (!token) {
        return res.status(401).json({success: false, message: "Unauthorized access please login"});
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if(decoded.id){
            req.body.userId = decoded.id;
        } else{
            return res.status(401).json({success: false, message: "Unauthorized access please login"});
        }
        next();

    } catch (error) {
        return res.status(401).json({success: false, message: "Invalid token"});
    }
}
 
export default userAuth;
