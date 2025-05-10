const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Project = require('../models/Project');



// JSON route for frontend use
router.get('/api/entrepreneur-projects', async (req, res) => {
    if (!req.session.userId || req.session.role !== 'entrepreneur') {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const projects = await Project.find({ createdBy: req.session.userId });
        res.status(200).json(projects);
    } catch (err) {
        console.error('Error fetching projects:', err);
        res.status(500).json({ message: 'Failed to load projects' });
    }
});



// Investor Dashboard
router.get('/investor-dashboard', async (req, res) => {
    if (req.session.role !== 'investor') return res.redirect('/login');
    const projects = await Project.find();
    res.render('investorDashboard', { projects });
});

// Staff/Admin Dashboard
router.get('/staff-dashboard', async (req, res) => {
    if (req.session.role !== 'staff') return res.redirect('/login');
    const users = await User.find({ isVerified: false });
    res.render('staffDashboard', { users });
});

// Approve User
router.post('/approve-user/:id', async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, { isVerified: true });
    res.redirect('/staff-dashboard');
});



router.post('/create-project', async (req, res) => {
    // if (!req.session.userId || req.session.role !== 'entrepreneur') {
    //     return res.status(401).json({ message: 'Unauthorized' }); // ✅ send JSON instead of redirect
    // }

    try {
        const { title, description, fundingGoal, deadline,img } = req.body;

        const newProject = new Project({
            title,
            description,
            fundingGoal,
            deadline,
            img,
            createdBy: req.session.userId,
        });

        const savedProject = await newProject.save();

        res.status(201).json({ message: 'Project created', insertedId: savedProject._id });
    } catch (error) {
        console.error('Create project error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

    // GET all projects
    router.get('/create-project', async (req, res) => {
        try {
            const projects = await Project.find();
            res.status(200).json(projects); // ✅ Return valid JSON
        } catch (err) {
            console.error('Error fetching projects:', err);
            res.status(500).json({ message: 'Failed to load projects' });
        }
    });


   
    
    router.get('/create-project/:id', async (req, res) => {
        try {
            const projectId = req.params.id; // Get project ID from the URL
            const project = await Project.findById(projectId); // Use findById directly on the database
            
            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }
            res.status(200).json(project); // Return the project as JSON
        } catch (err) {
            console.error('Error fetching project by ID:', err);
            res.status(500).json({ message: 'Failed to load project' });
        }
    });
    





// Investor Dashboard with Filtering
router.get('/investor-dashboard', async (req, res) => {
    if (req.session.role !== 'investor') return res.redirect('/login');
    const { industry, fundingProgress } = req.query;
    let filter = {};
    if (industry) filter.industry = industry;
    if (fundingProgress) filter.fundingProgress = { $gte: fundingProgress };
    const projects = await Project.find(filter);
    res.render('investorDashboard', { projects });
});

// View Project Details
router.get('/project/:id', async (req, res) => {
    const project = await Project.findById(req.params.id);
    res.render('projectDetails', { project });
});

// Reject User
router.post('/reject-user/:id', async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/staff-dashboard');
});



router.get('/edit-project/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);  // Check if this is correct
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });  // Return JSON for 404
        }
        res.status(200).json(project);  // Correct: Returning JSON
    } catch (err) {
        console.error('Error fetching project by ID:', err);
        res.status(500).json({ message: 'Failed to load project' });  // Return JSON for error
    }
});


// Edit Project Logic
router.post('/edit-project/:id', async (req, res) => {
    const { title, description, fundingGoal, deadline } = req.body;
    await Project.findByIdAndUpdate(req.params.id, { title, description, fundingGoal, deadline });
    res.redirect('/entrepreneur-dashboard');
});


module.exports = router;