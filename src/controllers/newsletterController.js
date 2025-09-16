const Newsletter = require('../models/Newsletter');

async function getNewsletter(req, res) {
    const newsletter = await Newsletter.findOne().sort({ updatedAt: -1 });
    res.json(newsletter ? newsletter : { content: "Bem-vindo ao chat de inovação!" });
}

async function setNewsletter(req, res) {
    const { content } = req.body;
    const newsletter = new Newsletter({ content });
    await newsletter.save();
    res.json({ message: "Newsletter atualizada!" });
}

module.exports = { getNewsletter, setNewsletter };
