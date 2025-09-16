const express = require('express');
const router = express.Router();
const { getNewsletter, setNewsletter } = require('../controllers/newsletterController');

router.get('/', getNewsletter);
router.post('/', setNewsletter);

module.exports = router;

