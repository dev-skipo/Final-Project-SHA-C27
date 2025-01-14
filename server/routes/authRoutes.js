const express = require('express');
const { register, login, getUser, updateUser, deleteUser } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/user', authMiddleware, getUser); 
router.put('/user/update', authMiddleware, updateUser); 
router.delete('/user/delete', authMiddleware, deleteUser); 

module.exports = router;
