const router = require('express').Router();
const { authenticateToken } = require('../middleware/auth');
const { createDebt, deleteDebt, getDebts, updateDebt } = require('../controllers/debts');

router.all("*", authenticateToken);

router.post('/', createDebt);

router.put('/:id', updateDebt);

router.get('/', getDebts);

router.delete('/:id', deleteDebt);

module.exports = router;