import express from 'express';
import { checkauth, loginController, logoutController, signupController } from '../controller/auth.controller.js';
import { protectRoute } from '../middleware/check.auth.js';

const  authRouter= express.Router();

authRouter.post('/signup',signupController);
authRouter.post('/login',loginController);
authRouter.post('/logout',logoutController);
authRouter.get('/check-auth',protectRoute,checkauth);

export default authRouter;

//  testing :-
// authRouter.get('/',(req,res)=>{
//     res.send("hi")
// });