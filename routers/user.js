const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const { store, login, profile, createToken } = require('../controllers/userController');

router.post('/login', login);
router.post('/token', createToken);
router.post('/', store);
router.get('/', authenticate, profile);

const userRoute = router;
module.exports = userRoute;