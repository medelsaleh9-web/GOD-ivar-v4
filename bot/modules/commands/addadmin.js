const fs = require("fs-extra");
const path = require("path");
const configPath = path.join(__dirname, "../../config.json");

function getConfig() {
  return JSON.parse(fs.readFileSync(configPath, "utf-8"));
}
function saveConfig(cfg) {
  fs.writeFileSync(configPath, JSON.stringify(cfg, null, 4));
}

module.exports.config = {
  name: "ادمن",
  version: "1.0.0",
  hasPermssion: 3,
  credits: "كاڪو",
  description: "إضافة أو حذف ادمن عام للبوت",
  commandCategory: "الملاك",
  usages: "ادمن اضافة [ID] | ادمن حذف [ID] | ادمن قائمة",
  cooldowns: 3
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const sub = args[0];
  const uid = args[1];

  if (!sub) {
    return api.sendMessage(
      `👑 أوامر الادمن:\n\n` +
      `ادمن اضافة [ID] — إضافة ادمن عام للبوت\n` +
      `ادمن حذف [ID] — حذف ادمن من البوت\n` +
      `ادمن قائمة — عرض قائمة الادمن`,
      threadID, messageID
    );
  }

  const cfg = getConfig();
  if (!cfg.ADMINBOT) cfg.ADMINBOT = [];

  if (sub === "قائمة") {
    if (cfg.ADMINBOT.length === 0) {
      return api.sendMessage("📋 قائمة الادمن فارغة.", threadID, messageID);
    }
    let list = "👑 قائمة ادمن البوت:\n━━━━━━━━━━━━━━━\n";
    for (let i = 0; i < cfg.ADMINBOT.length; i++) {
      let name = cfg.ADMINBOT[i];
      try {
        const info = await api.getUserInfo(cfg.ADMINBOT[i]);
        name = info[cfg.ADMINBOT[i]]?.name || cfg.ADMINBOT[i];
      } catch {}
      list += `${i + 1}. ${name}\n🆔 ${cfg.ADMINBOT[i]}\n`;
    }
    return api.sendMessage(list, threadID, messageID);
  }

  if (!uid) {
    return api.sendMessage("⚠️ يرجى كتابة الـ ID بعد الأمر.", threadID, messageID);
  }

  if (sub === "اضافة") {
    if (cfg.ADMINBOT.includes(uid)) {
      return api.sendMessage(`⚠️ المستخدم ${uid} ادمن بالفعل!`, threadID, messageID);
    }

    let userName = uid;
    try {
      const info = await api.getUserInfo(uid);
      userName = info[uid]?.name || uid;
    } catch {}

    cfg.ADMINBOT.push(uid);
    saveConfig(cfg);
    global.config.ADMINBOT = cfg.ADMINBOT;

    return api.sendMessage(
      `✅ تم إضافة ادمن جديد للبوت\n` +
      `━━━━━━━━━━━━━━━\n` +
      `👤 الاسم: ${userName}\n` +
      `🆔 الـ ID: ${uid}`,
      threadID, messageID
    );
  }

  if (sub === "حذف") {
    const idx = cfg.ADMINBOT.indexOf(uid);
    if (idx === -1) {
      return api.sendMessage(`⚠️ المستخدم ${uid} غير موجود في قائمة الادمن!`, threadID, messageID);
    }

    let userName = uid;
    try {
      const info = await api.getUserInfo(uid);
      userName = info[uid]?.name || uid;
    } catch {}

    cfg.ADMINBOT.splice(idx, 1);
    saveConfig(cfg);
    global.config.ADMINBOT = cfg.ADMINBOT;

    return api.sendMessage(
      `🗑️ تم حذف الادمن من البوت\n` +
      `━━━━━━━━━━━━━━━\n` +
      `👤 الاسم: ${userName}\n` +
      `🆔 الـ ID: ${uid}`,
      threadID, messageID
    );
  }

  return api.sendMessage(
    `❌ أمر غير معروف. استخدم:\nادمن اضافة | ادمن حذف | ادمن قائمة`,
    threadID, messageID
  );
};
