import express from 'express';
import session from 'express-session'; // Add express-session for session handling
import homeroutes from './Routes/homeroute.js';
import gatepassroute from './Routes/gatepassroute.js';
import maintenanceroute from './Routes/maintenanceroute.js';
import aboutusroute from './Routes/aboutusroute.js';
import loginroute from './Routes/loginroute.js';
import registerroute from './Routes/registerroute.js';
import adminroute from './Routes/AdminRoutes/RtRoute.js';
import housekeepingroute from './Routes/MaintenanceRoute/HousekeepingRoute.js'

const app = express();
const port = 3000;

// Middleware to parse incoming requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Parse JSON bodies

// Set the view engine to EJS
app.set("view engine", "ejs");

// Serve static files from the "public" directory
app.use(express.static('public'));

// Session setup
app.use(session({
    secret: 'your-secret-key', // Use a strong secret for session encryption
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Use 'secure: true' in production with HTTPS
}));

// Authentication middleware
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next(); // User is authenticated, allow them to proceed
    } else {
        res.redirect('/login'); // Redirect to login page if not authenticated
    }
}

// Define routes
app.use('/', loginroute); // Public login route
app.use('/',registerroute);
// Protected routes (require authentication)
app.use('/', isAuthenticated, homeroutes); 
app.use('/', isAuthenticated, gatepassroute);
app.use('/maintenance', isAuthenticated, maintenanceroute);
app.use('/aboutus', isAuthenticated, aboutusroute);

app.use('/',adminroute);

app.use('/',housekeepingroute);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
