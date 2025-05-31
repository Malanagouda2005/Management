import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../utils/db';
// Ensure the correct path to UserService
import { PatientService } from '../services/patientService'; // Use named import // Verify the file exists at this path

class AuthController {
  // User signup
  async register(req: Request, res: Response) {
    const { name, email, password } = req.body;

    try {
      // Check if the user already exists
      const existingUser = (await query('SELECT * FROM users WHERE email = ?', [email])) as any[];
      if (existingUser.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert the user into the database
      await query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [
        name,
        email,
        hashedPassword,
      ]);

      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  // User login
  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    // Validate user credentials (this is just an example)
    const user = await PatientService.validateUser(email, password);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'MALLU', {
      expiresIn: '1h', // Token expiration time
    });

    res.status(200).json({ token });
  }

  async refreshToken(req: Request, res: Response) {
    const { token } = req.body;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'MALLU', { ignoreExpiration: true });
      if (typeof decoded === 'object' && 'email' in decoded) {
        const newToken = jwt.sign({ id: decoded.id, email: decoded.email }, process.env.JWT_SECRET || 'MALLU', {
        expiresIn: '1h',
      });
        res.status(200).json({ token: newToken });
      } else {
        res.status(401).json({ message: 'Invalid token payload' });
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      res.status(401).json({ message: 'Invalid token' });
    }
  }
}

export default new AuthController();