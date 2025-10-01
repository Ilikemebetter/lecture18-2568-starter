import { Router, type Request, type Response } from "express";
import jwt from "jsonwebtoken"; //pnpm i -D  @types/jsonwebtoken  ไม่ใส่ -D จะหนักเครื่อง มันจะติดตั้งไปดว้ย ไฟล์จะใหญ่
import dotenv from "dotenv";
dotenv.config();

import type { User, CustomRequest, UserPayload} from "../libs/types.js";
import { authenticateToken } from "../middlewares/authenMiddleware.js";
import { checkRoleAdmin } from "../middlewares/checkRoleAdminMiddleware.js";
// import database
import { users, reset_users } from "../db/db.js";
//import { success } from "zod";

const router = Router();

// GET /api/v2/users
router.get("/",authenticateToken, checkRoleAdmin, (req: CustomRequest, res: Response) => {
  try {
    /*
    // get auth headers
    const authHeader = req.headers["authorization"]
    console.log(authHeader)

    //check if authHeader is not found or wrong format
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({
            success: false,
            message: "Authorization header is not found"
        })
    }
    //extract token and check if token is avaliable
    const token = authHeader?.split("")[1] //ดึงเฉพาะหลัง bearer
    if(!token){
        return res.status(401).json({
            success: false,
            message: "Token is required"        
    });
    }

    // verify
    try{
        const jwt_secret = process.env.JWT_SECRET || "forgot_secert";
        jwt.verify(token, jwt_secret, (err, payload) => { //verify token ที่ได้มา และverify ด้วย jwt_secret 
            //fn as asyncronus, so we have to add callback fn (err,payload)
            //payload == users' data
            if(err){
                return res.status(403).json({
                    success: false,
                    message: "Invalid or expired token"
                })
            }
            const user = users.find(
            (u: User) => u.username === payload?.username);
        })
    } catch(err){

    }
    */ //comment เพราะถูกย้ายไปเช็คใน middleware หมดแล้ว
    
    // return all users imported from db that declare on above
    return res.status(200).json({
      success: true,
      data: users,
      message: "Successful Operation",
    });
  } catch (err) {
    return res.status(200).json({
      success: false,
      message: "Something is wrong, please try again",
      error: err,
    });
  }
});

// POST /api/v2/users/login
router.post("/login", (req: CustomRequest, res: Response) => {
    try {
    // 1. get username and password from body
        const { username, password} = req.body;
        const user = users.find(
            (u: User) => u.username === username && u.password === password
        );
  // 2. check if user exists (search with username & password in DB)
// not existing if exitsting , skip this part
        if (!user){
            return res.status(401).json ({
                success: false,
                message: "Invalid username or password!"
            });
        }

  // 3. create JWT token (with user info object as payload) using JWT_SECRET_KEY
  //    (optional: save the token as part of User data)
        //const jwt_secret = "This_is_very_secret_key"; 
        const jwt_secret = process.env.JWT_SECRET || "forgot_secert";
        const token = jwt.sign({
            //create add JWT payload
            username: user.username,
            studentId: user.studentId,
            role: user.role,
        },jwt_secret,{expiresIn:"5m"}); //อายุการใช้งาน 5 นาที หลังจาก 5 ล้อคอินใหม่

  // 4. send HTTP response with JWT token
        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
        })


    } catch(err){
        return res.status(500).json({
            success: false,
            message: "Something went wrong.",
            error: err,
        })
 
}
/*
  return res.status(500).json({
    success: false,
    message: "POST /api/v2/users/login has not been implemented yet",
  }); */
});

// POST /api/v2/users/logout
router.post("/logout", (req: Request, res: Response) => {
  // 1. check Request if "authorization" header exists
  //    and container "Bearer ...JWT-Token..."

  // 2. extract the "...JWT-Token..." if available

  // 3. verify token using JWT_SECRET_KEY and get payload (username, studentId and role)

  // 4. check if user exists (search with username)

  // 5. proceed with logout process and return HTTP response
  //    (optional: remove the token from User data)

  return res.status(500).json({
    success: false,
    message: "POST /api/v2/users/logout has not been implemented yet",
  });
});

// POST /api/v2/users/reset
router.post("/reset", (req: Request, res: Response) => {
  try {
    reset_users();
    return res.status(200).json({
      success: true,
      message: "User database has been reset",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something is wrong, please try again",
      error: err,
    });
  }
});

export default router;