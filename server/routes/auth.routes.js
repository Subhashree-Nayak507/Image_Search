import express from 'express';
import { checkauth, loginController, logoutController, signupController, updateProfileDataController } from '../controller/auth.controller.js';
import { protectRoute } from '../middleware/check.auth.js';
import { upload } from '../middleware/uploadImage.js';

const  authRouter= express.Router();

authRouter.post('/signup',signupController);
authRouter.post('/login',loginController);
authRouter.post('/logout',logoutController);
authRouter.get('/check-auth',protectRoute,checkauth);
authRouter.post("/updateProfile", protectRoute, 
    upload.fields([{ name: 'profileImg', optional: true }]),
     updateProfileDataController);

export default authRouter;

//  testing :-
// authRouter.get('/',(req,res)=>{
//     res.send("hi")
// });