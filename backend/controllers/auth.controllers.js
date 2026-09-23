import bcrypt from "bcryptjs"
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
    try {
        const {fullName, username, password, confirmPassword, gender} = req.body;
        const normalizedUsername = username?.trim().toLowerCase();

        if(!normalizedUsername){
            return res.status(400).json({error:"Username is required"})
        }

        if(password !== confirmPassword){
            return res.status(400).json({error:"Passwords don't match"})
        }

        const user = await User.findOne({username: normalizedUsername})

        if(user){
            return res.status(400).json({error:"Username already exists"})
        }

        // Hash Password here
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const avatarNumber = [...username].reduce(
            (total, character) => total + character.charCodeAt(0),
            0
        ) % 99 + 1
        const avatarGender = gender === 'male' ? 'men' : 'women'
        const profilePic = `https://randomuser.me/api/portraits/${avatarGender}/${avatarNumber}.jpg`

        const newUser = new User({
            fullName,
            username: normalizedUsername,
            password: hashedPassword,
            gender,
            profilepic: profilePic
        })

        if(newUser){

            // Generate JWT Token here
            generateTokenAndSetCookie(newUser._id, res)

            await newUser.save();

            res.status(201).json({
                _id: newUser.id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePic: newUser.profilepic
            })
        }
        else{
            res.status(400).json({error:'Invalid user data'})
        }
                
    } catch (error) {
        console.log('Error in signup controller',error.message)
        if(error.code === 11000){
            return res.status(400).json({error:"Username already exists"})
        }
        res.status(500).json({error:'Internal Server Error'})
    }
}

export const login = async (req, res) => {
    try {
        const {username, password} = req.body;
        const normalizedUsername = username?.trim().toLowerCase();
        const user = await User.findOne({username: normalizedUsername});
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if(!user || !isPasswordCorrect){
            return res.status(400).json({error:'Invalid username or password'});
        }

        generateTokenAndSetCookie(user._id,res);

        res.status(201).json({
            _id: user.id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilepic
        })
        
    } catch (error) {
        console.log('Error in signup controller',error.message)
        res.status(500).json({error:'Internal Server Error'})
    }
}

export const logout = (req, res) => {
    try {
        res.cookie('jwt','',{maxAge:0})
        res.status(200).json({message:'Logged Out Successfully'})
    } catch (error) {
        console.log('Error in signup controller',error.message)
        res.status(500).json({error:'Internal Server Error'})
    }
}