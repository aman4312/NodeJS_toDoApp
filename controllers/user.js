import { User } from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendCookie } from '../utils/features.js';
export const getAllUsers = async (req, res) => {};

//login

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not  registered',
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(404).json({
        success: false,
        message: 'Invlaid Email or password',
      });
    }
    sendCookie(user, res, `Welcome back ${user.name}`, 200);
  } catch (error) {
    next(error);
  }
};

// register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(404).json({
        success: false,
        message: 'User already registered',
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    sendCookie(user, res, 'Registered Successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getMyProfile = async (req, res) => {
  // const id = 'myid';
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  try {
    res
      .status(200)
      .cookie('token', '', {
        expires: new Date(Date.now()),
        sameSite: process.env.NODE_ENV === 'Development' ? 'lax' : 'none',
        secure: process.env.NODE_ENV === 'Development' ? false : true,
      })
      .json({
        success: true,
        user: req.user,
      });
  } catch (error) {
    next(error);
  }
};
