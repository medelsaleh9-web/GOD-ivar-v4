const fs = require("fs-extra");
const path = require("path");

const PHOTO_STATE_PATH = path.join(__dirname, "../commands/data/groupPhoto.json");

module.exports.config = {
  name: "photoProtection",
  eventType: ["log:thread-icon"],
  version: "1.0.0",
  credits: "كاڪو",
  description: "حماية صورة الغروب من التغيير"
};

module.exports.run = async function ({ api, event }) {
  const { threadID, author } = event;
  const botID = api.getCurrentUserID();

  if (author === botID) return;

  let state = {};
  try { state = JSON.parse(fs.readFileSync(PHOTO_STATE_PATH, "utf-8")); }
  catch { return; }

  if (!state[threadID]) return;

  const savedPath = state[threadID].path;
  if (!savedPath || !fs.existsSync(savedPath)) return;

  try {
    await new Promise(r => setTimeout(r, 1500));
    await api.changeGroupImage(fs.createReadStream(savedPath), threadID);
    api.sendMessage("🛡️ صورة الغروب محمية — تم استعادتها تلقائياً", threadID);
  } catch {}
};
