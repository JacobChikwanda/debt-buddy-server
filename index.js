const express = require('express');
const cors = require('cors');
const orm = require('./models');
require('dotenv').config();

const app = express();
const PORT = 5000;

// Routes
const userRoute = require('./routes/users');
const customerRoute = require('./routes/customers');
const debtRoute = require('./routes/debts');
const reportsRoute = require('./routes/reports');

app.use(cors({
    origin: '*'
}));
app.use(express.json());

app.use('/users', userRoute);
app.use('/customers', customerRoute);
app.use('/debts', debtRoute);
app.use('/reports', reportsRoute)


orm.sequelize.sync({alter: false})
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on PORT ${PORT}`)
    })
})