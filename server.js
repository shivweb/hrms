const express = require("express")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const connectToMongoDB = require("./config/mongoConfig"); 
const {connectToDB} = require("./config/dbConfig");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors")
const cron = require('node-cron');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
connectToMongoDB();  // for mongo conn
// connectToDB();  // for sql conn

const mainRoutes = require('./routes/mainRoutes');
const authRoutes = require('./routes/authRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const commonRoutes = require("./routes/commonRoutes");
const indexRoutes = require("./routes/index");


const logRequestDetails = (req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next(); // Pass control to the next middleware/handler
};

app.use(morgan("combined"));
// Middleware to log request details
app.use(logRequestDetails);
// Use the main route file


app.use('/api', mainRoutes);
app.use('/api/employee', authRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/common', commonRoutes)
app.use('/api/s3', indexRoutes);

// cron job
const employeeModel = require("./models/employeeModel");
// Schedule a cron job to run at midnight on the first day of every month
cron.schedule('0 0 1 * *', async () => {
    console.log('Running cron job to reset casualLeave...');

    try {
        // Update all employees' casualLeave to 1
        const result = await employeeModel.updateMany(
            {},
            { $set: { 'leaveBalance.casualLeave': '1' } }
        );

        console.log(`Successfully updated casualLeave for ${result.nModified} employees.`);
    } catch (error) {
        console.error('Error updating casualLeave:', error);
    }
});


// Cron job for January 1st at midnight
cron.schedule('0 0 1 1 *', async () => {
    console.log('Running cron job to reset medicalLeave to 6 on January 1st...');

    try {
        // Update all employees' medicalLeave to 6
        const result = await employeeModel.updateMany(
            {},
            { $set: { 'leaveBalance.medicalLeave': '6' } }
        );

        console.log(`Successfully updated medicalLeave to 6 for ${result.nModified} employees.`);
    } catch (error) {
        console.error('Error updating medicalLeave on January 1st:', error);
    }
});

// Cron job for July 1st at midnight
cron.schedule('0 0 1 7 *', async () => {
    console.log('Running cron job to reset medicalLeave to 6 on July 1st...');

    try {
        // Update all employees' medicalLeave to 6
        const result = await employeeModel.updateMany(
            {},
            { $set: { 'leaveBalance.medicalLeave': '6' } }
        );

        console.log(`Successfully updated medicalLeave to 6 for ${result.nModified} employees.`);
    } catch (error) {
        console.error('Error updating medicalLeave on July 1st:', error);
    }
});

// Cron job to credit 4 earned leaves every quarter
cron.schedule('0 0 1 1,4,7,10 *', async () => {
    console.log('Running cron job to credit 4 earned leaves...');

    try {
        // Update all employees' earnedLeave by adding 4 to the existing value
        const result = await employeeModel.updateMany(
            {},
            {
                $inc: { 'leaveBalance.earnedLeave': 4 }, // Increment earnedLeave by 4
            }
        );

        console.log(`Successfully credited 4 earned leaves for ${result.nModified} employees.`);
    } catch (error) {
        console.error('Error crediting earned leaves:', error);
    }
});








app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
