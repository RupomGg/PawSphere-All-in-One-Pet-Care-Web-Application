const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const { startReminderService } = require('./utils/reminderService');

const app = express();


app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'], // Allow both ports
    credentials: true // Allow cookies (sessions) to be sent
}));
// app.use(cors());

app.use(express.json())
// app.use(cors());




// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
// app.use(session({
//     secret: 'secretKey',
//     resave: false,
//     saveUninitialized: true
// }));
app.use(session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // set to true in production with HTTPS
        httpOnly: true,
        maxAge: 1000 * 60 * 30 // 30 minutes
    }
}));



// MongoDB Connection
// mongodb+srv://petsphere:<db_password>@petsphere.tgznjun.mongodb.net/?retryWrites=true&w=majority&appName=petsphere
mongoose.connect('mongodb+srv://petsphere:123@petsphere.tgznjun.mongodb.net/petsphere?retryWrites=true&w=majority&appName=petsphere', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Routes
app.use('/', require('./routes/authRoutes'));

app.get('/', (req, res) => {
    res.render('index');
});

// adoption
app.use('/', require('./routes/adoptionRoutes'));


app.use('/', require('./routes/petRoutes'));

const notificationRoutes = require('./routes/Notification');
app.use('/api/notifications', notificationRoutes);
const lostorfoundRoutes = require('./routes/lostorfoundRoutes');
app.use('/', lostorfoundRoutes);

app.use('/', require('./routes/profileRoutes'));
// app.use('/api/user', require('./routes/profileRoutes'));

app.use('/api/reviews', require('./routes/reviewRoutes')); //rupom

app.use('/', require('./routes/dashboardRoutes'));
app.use((req, res, next) => {
    if (req.session.userId) {
        req.session.cookie.maxAge = 30 * 60 * 1000; // 30 minutes
    }
    next();
});

const adminRoutes = require('./routes/adminRoutes');
app.use('/admin', adminRoutes);


// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    // Start the reminder service
    startReminderService();
    console.log('Reminder service started');
});