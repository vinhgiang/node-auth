const router = require('express').Router();
const { store, login } = require('../controllers/userController');

router.post('/login', login);
router.post('/', store);

const userRoute = router;
module.exports = userRoute;