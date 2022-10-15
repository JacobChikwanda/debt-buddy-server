const router = require('express').Router()
const { authenticateToken } = require('../middleware/auth');
const { createCustomer, deleteCustomer, getAllcustomers, getCustomerById, updateCustomerProfle } = require('../controllers/customers');

router.get('/', authenticateToken, getAllcustomers);
router.get('/single/:id', authenticateToken, getCustomerById);

router.post('/', authenticateToken, createCustomer);

router.put('/updateUser/:id', authenticateToken, updateCustomerProfle);

router.delete('/:id', authenticateToken, deleteCustomer);

module.exports = router