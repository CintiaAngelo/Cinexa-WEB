const express = require('express');
const router = express.Router();
const controller = require('../controllers/chatController');

router.post('/message', controller.handleMessage);

module.exports = {
  handleMessage: async (req, res) => {
    // lógica do chat
  }
};
module.exports = router;
