const router = require('express').Router();

const { home } = require('../controllers/homeController');

router.use('/', home);

module.exports = router;