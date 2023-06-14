import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const register = async (req, res) => {
  const { password,confirmPassword,...userData } = req.body;
  const { email  } = userData;

  try {
    if(password!==confirmPassword) {
        return res.status(400).json({success:false, message:"Passwords do not match" });
    }
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({success:false, message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user
    const newUser = new User({
        ...userData,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({success:true, message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({success:false, message: 'Registration failed', error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(401).json({success:false, message: 'Authentication failed' });
    }

    // Check if the password matches
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({success:false, message: 'Authentication failed' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id,role:user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const {password:trash, ...userInfo}=user
    res.status(200).json({success:true, message: 'Login successful', token ,user:userInfo._doc});
  } catch (error) {
    res.status(500).json({success:false, message: 'Login failed', error: error.message });
  }
};

export { register, login };
