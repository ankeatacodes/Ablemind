import validator from "validator";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const createToken = (id) =>{
    return jwt.sign({ id }, process.env.JWT_SECRET,) 
}



// Route for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        // Generate token
        const token = createToken(user._id);
        res.json({ success: true, token });
        
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Route for user registration
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

    // Checking if the user already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
        return res.json({ success: false, message: "User already exists" });
    }

    // Validating email format
    if (!validator.isEmail(email)) {
        return res.json({ success: false, message: "Invalid email format" });
    }

    // Validating password strength
    if (password.length < 8) {
        return res.json({ success: false, message: "Please enter a strong password" });
    }

    // Hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Creating new user
    const newUser = new userModel({
        name,
        email,
        password: hashedPassword
    });

    const user = await newUser.save();

    const token = createToken(user._id);

    res.json({ success: true, token });

        
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
    
};

const getCurrentUserProfile = async (req, res) => {
    const user = await userModel.findById(req.user._id);
  
    if (user) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
      });
    } else {
      res.status(400);
      throw new Error("User not found");
    }

};

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ email, password }, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};





export { loginUser, registerUser, adminLogin, getCurrentUserProfile };
