const fs = require("fs");
const path = require("path");

const IMG_PATH = path.join(__dirname, "cache/alcrash.jpg");

const phrases = [
  "💙✨ الكراش...",
  "💙 الكراش الخيالي ✨",
  "💙 مو ناقصة إلا الكراش 🌟",
  "✨💙 الكراش اللي في الخيال..."
];

module.exports.config = {
  name: "الكراش",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "كاڪو",
  description: "يرسل صورة الكراش — للادمن فقط",
  commandCategory: "الملاك",
  usages: "الكراش",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID, senderID } = event;

  const ADMINBOT = global.config?.ADMINBOT || [];
  let threadAdmins = [];
  try {
    const info = await api.getThreadInfo(threadID);
    threadAdmins = (info.adminIDs || []).map(a => String(a.uid || a));
  } catch {}

  const isAdmin = ADMINBOT.includes(senderID) || threadAdmins.includes(String(senderID));
  if (!isAdmin) {
    return api.sendMessage("❌ هذا الأمر للادمن فقط!", threadID, messageID);
  }

  const phrase = phrases[Math.floor(Math.random() * phrases.length)];

  if (fs.existsSync(IMG_PATH)) {
    return api.sendMessage(
      { body: phrase, attachment: fs.createReadStream(IMG_PATH) },
      threadID,
      messageID
    );
  } else {
    return api.sendMessage(phrase, threadID, messageID);
  }
};
