const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

const register = async (req, res) => {
  try {
    console.log('Registration request received:', req.body); // Debug log
    
    const { email, password, name, role } = req.body;
    
    // Validate input
    if (!email || !password || !name) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ error: 'User already exists' });
    }

    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    
    console.log('Creating user in database...');
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || 'freelancer'
      }
    });

    console.log('User created successfully:', user.id);
    
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    
    res.json({ 
      token, 
      user: { id: user.id, email: user.email, name: user.name, role: user.role } 
    });
  } catch (error) {
    console.error('Registration error details:', error);
    res.status(500).json({ error: 'Registration failed: ' + error.message });
  }
};

const login = async (req, res) => {
  try {
    console.log('Login request received:', req.body.email); // Debug log
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    
    console.log('Login successful:', email);
    res.json({ 
      token, 
      user: { id: user.id, email: user.email, name: user.name, role: user.role } 
    });
  } catch (error) {
    console.error('Login error details:', error);
    res.status(500).json({ error: 'Login failed: ' + error.message });
  }
};

module.exports = { register, login };