const router = require('express').Router();
const { store } = require('../controllers/userController');

router.post('/', store);

const userRoute = router;
module.exports = userRoute;