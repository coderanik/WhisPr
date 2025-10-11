import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AnonymousNameGenerator } from '../utils/anonymousNames';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}
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
    const { regNo, password } = req.body as { regNo: string; password: string };

    if (!regNo || !password) {
      return res.status(400).json({ message: 'Registration number and password are required' });
    }

    // ⬇️ Check if regNo is within allowed range
    if (!isValidRegistration(regNo)) {
      return res.status(403).json({ message: 'Registration number not allowed' });
    }

    // ⬇️ Check if user with this regNo already exists
    const existingUser = await User.findOne({ regNoHash: await bcrypt.hash(regNo.toString(), SALT_ROUNDS) });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this registration number already exists' });
    }

    // ⬇️ Generate anonymous name based on regNo
    const anonymousName = AnonymousNameGenerator.generateAnonymousName(regNo);
    
    // ⬇️ Check if anonymous name is unique (should be, but just in case)
    const existingAnonymousName = await User.findOne({ anonymousName });
    if (existingAnonymousName) {
      return res.status(409).json({ message: 'Anonymous name conflict. Please try again.' });
    }

    // ⬇️ Hash regNo and password
    const regNoHash = await bcrypt.hash(regNo.toString(), SALT_ROUNDS);
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = new User({
      anonymousName,
      regNoHash,
      passwordHash,
    });

    console.log('🔍 About to save user with data:', {
      anonymousName: newUser.anonymousName,
      regNoHash: newUser.regNoHash ? '***HASHED***' : 'undefined',
      passwordHash: newUser.passwordHash ? '***HASHED***' : 'undefined'
    });

    await newUser.save();

    return res.status(201).json({ 
      message: 'User registered successfully',
      anonymousName: anonymousName // Return the anonymous name to the user
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { regNo, password } = req.body as { regNo: string; password: string };

    if (!regNo || !password) {
      return res.status(400).json({ message: 'Registration number and password are required' });
    }

    // ⬇️ Find user by comparing regNo with all stored hashes
    const users = await User.find({});
    let user = null;
    
    for (const u of users) {
      const isRegNoMatch = await bcrypt.compare(regNo.toString(), u.regNoHash);
      if (isRegNoMatch) {
        user = u;
        break;
      }
    }
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // ⏱ Filter loginAttempts within last 2 minutes
    const now = new Date();
    const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);

    // Handle loginAttempts array properly - convert to regular array
    let filteredAttempts: Date[] = [];
    if (user.loginAttempts && Array.isArray(user.loginAttempts)) {
      filteredAttempts = user.loginAttempts
        .map((attempt: any) => new Date(attempt))
        .filter((attempt: Date) => attempt > twoMinutesAgo);
    }

    if (filteredAttempts.length >= 5) {
      return res.status(429).json({
        message: 'Too many login attempts. Try again after 1 minute.',
      });
    }

    // 🔐 Validate password
    const isPassMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isPassMatch) {
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
    req.session.anonymousName = user.anonymousName;

    // 🔐 Generate JWT
    const token = jwt.sign(
      { userId: user._id, anonymousName: user.anonymousName },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      anonymousName: user.anonymousName,
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
