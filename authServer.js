require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const mongoURI = process.env.MONGODB_URI;
const sessionSecret = process.env.SESSION_SECRET;
const port = process.env.PORT || 3000;

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false
}));

app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

// User Schema
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

// Login API
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ success: false, msg: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ success: false, msg: 'Invalid password' });

        req.session.user = user._id;
        res.json({ success: true, msg: 'Login successful' });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Server error' });
    }
});

// Signup API
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, msg: 'User already exists' });
        }

        const hash = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hash });
        await newUser.save();

        res.json({ success: true, msg: 'User created' });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Error creating user' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});