import { generateTokenAndSetCookie } from "../utils/Token.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';

export const signupController = async(req,res)=>{
    try{
        const  { username,fullName,email,password}= req.body;

		if (!username || !fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter all fields"
            });
        };

        const existingUser = await User.findOne({ username });
		if (existingUser) {
			return res.status(400).json({ error: "Username is already taken" });
		};

		const existingEmail = await User.findOne({ email });
		if (existingEmail) {
			return res.status(400).json({ error: "Email is already taken" });
		};

        if (password.length < 6) {
			return res.status(400).json({ error: "Password must be at least 6 characters" });
		};
        const newUser = new User({
			fullName,
			username,
			email,
			password,
		});

		if (newUser) {
			generateTokenAndSetCookie(newUser._id, res);
			await newUser.save();

			 return res.status(201).json({
				_id: newUser._id,
				fullName: newUser.fullName,
				username: newUser.username,
				email: newUser.email,
				followers: newUser.followers,
				following: newUser.following,
				profileImg: newUser.profileImg,
				coverImg: newUser.coverImg,
			});
		} else {
			 return res.status(400).json({ message: "Invalid user data" });
		}

    }catch(error){
        console.log("Error :",error);
        return res.status(500).json({ message:"Internal server Error"});
    }
};

export const loginController = async(req,res)=>{
    try{
		const { username, password } = req.body;

		if (!username  || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter all fields"
            });
        };

		const user = await User.findOne({ username });
		if ( !user) {
			return res.status(400).json({ error: "Invalid username " });
		};

		const isPasswordCorrect = await bcrypt.compare(password, user.password);
		if ( !isPasswordCorrect) {
			return res.status(400).json({ error: "Invalid  password" });
		};

		generateTokenAndSetCookie(user._id, res);

		 return res.status(200).json({
			_id: user._id,
			fullName: user.fullName,
			username: user.username,
			email: user.email,
			followers: user.followers,
			following: user.following,
			profileImg: user.profileImg,
			coverImg: user.coverImg,
		});

    }catch(error){
        console.log("Error :",error);
         return res.status(500).json({ message:"Internal server Error"});
    }
};

export const logoutController = async(req,res)=>{
    try{
		res.clearCookie("jwt");
       return  res.status(200).json({ message:"logout successfully"});

    }catch(error){
        console.log("Error :",error);
        return  res.status(500).json({ message:"Internal server Error"});
    }
};

export const checkauth = async(req,res)=>{
    try{
		const user= req.user;
         return res.status(200).json({ message:"authorized user",
         user
		 });

    }catch(error){
        console.log("Error :",error);
         return res.status(500).json({ message:"Internal server Error"});
    }
};