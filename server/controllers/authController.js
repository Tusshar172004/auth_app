import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../model/UserModel.js';

const signToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
};

export const signup = async (req, res) => {

  const { firstname, lastname, email, password } = req.body;
  if(!firstname || !lastname || !email || !password) {
    return res.status(400).json({ message: 'All Fields arw required'});
  }

  const existing = await User.findOne({email});
  if(existing) return res.status(401).json({message: 'User already exists'});

  const user = new User({firstname, lastname, email, password});
  await user.save();
  const token = signToken(user);
  res.status(201).json({
    token,
    user: { id: user._id, firstname: user.firstname, lastname: user.lastname, email: user.email }
  });
};

export const login = async (req, res) => {

  const { email, password } = req.body;
  if(!email || !password) {
    return res.status(400).json({ message: 'All Fields arw required'});
  }

  const user = await User.findOne({email});
  if(!user) return res.status(401).json({message: 'Invaid credentials'});

  const isMatch = await user.comparePassword(password);
  if(!isMatch) return res.status(401).json({message : 'Invaid credentials'})

  const token = signToken(user);
  res.json({
    token,
    user: { id: user._id, firstname: user.firstname, lastname: user.lastname, email: user.email }
  });
};

