const router = require('express').Router()
const {registerUser, updateUserProfle, authenticateUser, getAllUsers, deleteUser, getUserById} = require('../controllers/users');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, getAllUsers);
router.get('/single/:id', authenticateToken, getUserById);

router.post('/', registerUser);
router.post('/login', authenticateUser);

router.put('/updateUser/:id', authenticateToken, updateUserProfle);

router.delete('/:id', authenticateToken, deleteUser);

module.exports = router