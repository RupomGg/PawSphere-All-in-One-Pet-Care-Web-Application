const User = require('../models/User');



exports.signup =async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
      console.log('Received data:', req.body);
      const newUser = new User({ name, email, password, role });
      await newUser.save();
      console.log('Received data:', req.body);
  
      // Return JSON, not redirect
      res.status(201).json({ message: 'User created successfully',
         insertedId: newUser._id 
        });
    } catch (error) {
        console.error('Signup error:', error);
        
    
        if (error.code === 11000 && error.keyValue.email) {
            return res.status(400).json({ message: 'Email already registered' });
        }
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error' });
        console.error('Signup error:', error);

    }
  }

exports.login = async (req, res) => {
    const { email, password } = req.body;
    console.log('Login attempt with data:', req.body);
    
    const user = await User.findOne({ email, password });
    if (user) {
        // Check if user is banned
        if (user.banned) {
            return res.status(403).json({ message: 'Your account has been banned. Please contact support.' });
        }

        // Create user session
        req.session.userId = user._id;
        req.session.role = user.role;
        
        // Return success response with user info
        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                role: user.role,
                email: user.email
            }
        });
    } else {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
}


exports.checkSession = (req, res) => {
    console.log(req.session,100); // Debugging line
    if (req.session.userId) {
        res.status(200).json({
            loggedIn: true,
            user: {
                id: req.session.userId,
                role: req.session.role,
            }
        });
    } else {
        res.status(200).json({ loggedIn: false });
    }
}

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('name email role');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}

exports.getlogout = (req, res) => {
    req.session.destroy();
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
}


exports.getAllUsers = async (req, res) => {
    try {
        // Check if user is admin
        if (!req.session.userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const adminUser = await User.findById(req.session.userId);
        if (!adminUser || adminUser.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Fetch all users but exclude sensitive information
        const users = await User.find({}).select('name email role createdAt profilePicture banned');
        res.json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ message: 'Server error' });
    }
}


exports.banUser = async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.session.userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        // Verify that the authenticated user is an admin
        const adminUser = await User.findById(req.session.userId);
        if (!adminUser || adminUser.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { userId } = req.params;
        const { banned } = req.body;

        // Find the user to be banned/unbanned
        const userToBan = await User.findById(userId);
        if (!userToBan) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent banning of admin accounts
        if (userToBan.role === 'admin') {
            return res.status(403).json({ message: 'Cannot ban admin users' });
        }

        // Update the user's banned status
        userToBan.banned = banned;
        await userToBan.save();

        // Return success message
        res.json({ message: banned ? 'User banned successfully' : 'User unbanned successfully' });
    } catch (err) {
        console.error('Error updating user ban status:', err);
        res.status(500).json({ message: 'Server error' });
    }
}