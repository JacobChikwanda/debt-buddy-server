const router = require('express').Router()
const { authenticateToken } = require('../middleware/auth');
const { getMonthlyReports, getQuarterlyReports } = require('../controllers/reports');

router.get('/monthly', authenticateToken, getMonthlyReports);
router.get('/quarterly', authenticateToken, getQuarterlyReports);

module.exports = router