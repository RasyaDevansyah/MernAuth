import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
    try{
        const { userId } = req.user;
        
        const user = await userModel.findById(userId)

        if (!user) {
            return res.json({success: false, message: "User not found"});
        }

        res.json({
            success: true,
            userData: {
            name: user.name,
            email: user.email,
            isAccountVerified: user.isAccountVerified,
            actions: !user.isAccountVerified
                ? [
                {
                    name: "Verify Account",
                    uri: "/api/auth/verify-account",
                    method: "POST",
                }
                ]
                : []
            }
        })
    } catch (error) {
        return res.json({success: false, message: "Internal server error"});
    }

}

