const router = require('express').Router();

const { home } = require('../controllers/homeController');
const userRoute = require('./user');

router.use('/users', userRoute);
router.use('/', home);

module.exports = router;