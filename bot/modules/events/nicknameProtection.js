const fs = require("fs-extra");
const path = require("path");
const STATE_PATH = path.join(__dirname, "../commands/data/malakState.json");

module.exports.config = {
  name: "nicknameProtection",
  eventType: ["log:user-nickname"],
  version: "2.0.0",
  credits: "كاڪو",
  description: "حماية الكنيات من التغيير — لا يمكن لأحد تغييرها إلا ادمن البوت"
};

module.exports.run = async function ({ api, event }) {
  const { threadID, author, logMessageData } = event;
  const botID = api.getCurrentUserID();

  let state = {};
  try { state = JSON.parse(fs.readFileSync(STATE_PATH, "utf-8")); }
  catch {}

  if (!state.nicknameProtection || !state.nicknameProtection[threadID]) return;

  const { ADMINBOT } = global.config || {};
  const botAdmins = Array.isArray(ADMINBOT) ? ADMINBOT : [];

  if (botAdmins.includes(author) || author === botID) return;

  const targetID = logMessageData?.participant_id;
  if (!targetID) return;

  await api.changeNickname("", threadID, targetID).catch(() => {});

  api.sendMessage(
    `🛡️ الحماية مفعّلة — لا يملك أحد صلاحية تغيير الكنيات\nفقط ادمن البوت يستطيع ذلك`,
    threadID
  );
};
