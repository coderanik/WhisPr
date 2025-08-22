import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const SALT_ROUNDS = 10;

// ⬇️ Updated registration range
const REGISTRATION_RANGE = {
  min: 2411033010001,
  max: 2411033010057,
};

// ⬇️ Utility function to validate regNo (with or without "RA" prefix)
function isValidRegistration(regNo: string): boolean {
  const cleaned = regNo.startsWith("RA") ? regNo.slice(2) : regNo;
  if (!/^\d+$/.test(cleaned)) return false;
  const num = parseInt(cleaned, 10);
  return num >= REGISTRATION_RANGE.min && num <= REGISTRATION_RANGE.max;
}

export const register = async (req: Request, res: Response) => {
  try {
    const { name, regNo, password } = req.body as { name: string; regNo: string; password: string };

    if (!name || !regNo || !password) {
      return res.status(400).json({ message: 'Name, registration number, and password are required' });
    }

    // ⬇️ Check if regNo is within allowed range
    if (!isValidRegistration(regNo)) {
      return res.status(403).json({ message: 'Registration number not allowed' });
    }

    // ⬇️ Check for unique name
    const existingName = await User.findOne({ name });
    if (existingName) {
      return res.status(409).json({ message: 'Username already taken' });
    }

    // ⬇️ Hash regNo and password
    const regNoHash = await bcrypt.hash(regNo.toString(), SALT_ROUNDS);
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = new User({
      name,
      regNoHash,
      passwordHash,
    });

    await newUser.save();

    return res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { name, regNo, password } = req.body as { name: string; regNo: string; password: string };

    if (!name || !regNo || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const user = await User.findOne({ name });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // ⏱ Filter loginAttempts within last hour
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    // Handle loginAttempts array properly - convert to regular array
    let filteredAttempts: Date[] = [];
    if (user.loginAttempts && Array.isArray(user.loginAttempts)) {
      filteredAttempts = user.loginAttempts
        .map((attempt: any) => new Date(attempt))
        .filter((attempt: Date) => attempt > oneHourAgo);
    }

    if (filteredAttempts.length >= 5) {
      return res.status(429).json({
        message: 'Too many login attempts. Try again after 1 hour.',
      });
    }

    // 🔐 Validate credentials
    const isRegMatch = await bcrypt.compare(regNo.toString(), user.regNoHash);
    const isPassMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isRegMatch || !isPassMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // ✅ Add current attempt and increment login count
    filteredAttempts.push(now);
    // Use set to update the array field
    user.set('loginAttempts', filteredAttempts);
    user.loginCount = (user.loginCount || 0) + 1;
    await user.save();

    // 💾 Set session
    req.session.userId = user._id.toString();
    req.session.username = user.name;

    // 🔐 Generate JWT
    const token = jwt.sign(
      { userId: user._id, name: user.name },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      loginCount: user.loginCount,
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const logout = (req: Request, res: Response) => {
  req.session.destroy((err: any) => {
    if (err) return res.status(500).json({ message: 'Error logging out' });
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logged out' });
  });
};
