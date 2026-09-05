import dotenv from 'dotenv';
import jwt from "jsonwebtoken"

dotenv.config()
const jwt_key = process.env.JWT_SECRET_KEY

export const auth = (req, res, next)=>{
    const authHeader = req.headers.authorization || ""
    const [schema, tokenFromHeader] = authHeader.split(' ')
    const tokenFromCookie = req.cookies?.accessToken
    
    const token = schema === "Bearer" && tokenFromHeader ? tokenFromHeader : tokenFromCookie
    if(!token) return res.status(404).json({warningInfo:{all:"Invalid Login"}})
    try{
        const decode = jwt.verify(token, jwt_key)
        req.user = {userid:decode.userid, username:decode.username,  useremail:decode.useremail}
        console.log("user", req.user)
        next()
    }catch(err){
        console.log(err)
        if(err.name === "TokenExpiredError")
            return res.status(401).json({warningInfo:{all:"Access Token Expired"}})
        return res.status(401).json({warningInfo:{all:"Token Invalid"}})
    }
}  