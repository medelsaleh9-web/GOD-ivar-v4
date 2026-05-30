const moment = require("moment-timezone");

module.exports.config = {
  name: "قائمة",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "كاڪو",
  description: "عرض قائمة الأوامر",
  commandCategory: "الملاك",
  usages: "قائمة",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID, senderID } = event;
  const { ADMINBOT, NDH } = global.config;

  const now = moment().tz("Asia/Riyadh");
  const timeStr = now.format("hh:mm A");
  const dateStr = now.format("DD/MM/YYYY");

  const totalCmds = global.client?.commands?.size || 0;
  const totalGroups = global.data?.allThreadID?.length || 0;
  const totalUsers = global.data?.allUserID?.length || 0;

  const isOwner   = ADMINBOT.includes(String(senderID));
  const isNDH     = NDH.includes(String(senderID));

  const uptimeSec = process.uptime();
  const h = Math.floor(uptimeSec / 3600);
  const m = Math.floor((uptimeSec % 3600) / 60);
  const uptimeStr = `${h > 0 ? h + "س " : ""}${m}د`;

  const line  = "═══════════════════════";
  const tline = "───────────────────────";

  let msg = "";

  msg += `\n`;
  msg += `꧁𝕮𝖗𝖔𝖜𝖘 𝕬𝖈𝖆𝖉𝖊𝖒𝖞꧂\n`;
  msg += `${line}\n`;
  msg += `👑 البوت : كاكو\n`;
  msg += `⚡ الأوامر : ${totalCmds} أمر\n`;
  msg += `🌐 المجموعات : ${totalGroups}\n`;
  msg += `👥 المستخدمون : ${totalUsers}\n`;
  msg += `⏱️ وقت التشغيل : ${uptimeStr}\n`;
  msg += `🕒 ${timeStr}  ·  ${dateStr}\n`;
  msg += `${line}\n\n`;

  msg += `『 🌍 للجميع 』\n`;
  msg += `${tline}\n`;
  msg += `  📊 ابتيم — حالة البوت\n`;
  msg += `  💘 كراشي — يحزر كراشك\n`;
  msg += `${tline}\n\n`;

  msg += `『 ⚔️ ادمن الكروب 』\n`;
  msg += `${tline}\n`;
  msg += `  🪽 غراب — رسالة الغراب كل 15ث\n`;
  msg += `  🌑 الغربان — تغيير كنيات الكروب\n`;
  msg += `  ✏️ نيم [اسم] — سحق الكنيات + حماية\n`;
  msg += `  🔗 اوروا [اسم] — تثبيت اسم الكروب\n`;
  msg += `  📸 الكراش — صورة الكراش\n`;
  msg += `  ⛓️ عبد — تعبيد عضو\n`;
  msg += `${tline}\n\n`;

  if (isNDH || isOwner) {
    msg += `『 👁️ NDH 』\n`;
    msg += `${tline}\n`;
    msg += `  👑 تاج [ID] — تتويج ادمن بوت\n`;
    msg += `${tline}\n\n`;
  }

  if (isOwner) {
    msg += `『 🔴 أصحاب البوت 』\n`;
    msg += `${tline}\n`;
    msg += `  🛡️ ادمن اضافة [ID] — إضافة ادمن\n`;
    msg += `  🗑️ ادمن حذف [ID] — حذف ادمن\n`;
    msg += `  📋 ادمن قائمة — عرض الادمن\n`;
    msg += `${tline}\n\n`;
  }

  msg += `${line}\n`;
  msg += `𝑪𝑹𝑶𝑾𝑺  ۬ ۬  𝑴𝑶𝑵𝑺𝑻𝑬𝑹𝑺 👹🪽`;

  return api.sendMessage(msg, threadID, messageID);
};
