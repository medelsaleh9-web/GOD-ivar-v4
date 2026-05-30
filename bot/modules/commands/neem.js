if (!global.botNicknameProtection) global.botNicknameProtection = {};

module.exports.config = {
  name: "نيم",
  version: "9.0.0",
  hasPermssion: 1,
  credits: "kaku",
  description: "سحق الكنيات + حماية صامتة لكنية البوت (سرعة 1.5 ثانية)",
  commandCategory: "Admin",
  usages: "[الاسم]",
  cooldowns: 0
};

// --- [ 1. الحارس الصامت ] ---
module.exports.handleEvent = async function({ api, event }) {
  const { threadID, logMessageType, logMessageData, author } = event;
  const botID = api.getCurrentUserID();

  if (logMessageType === "log:user-nickname" && global.botNicknameProtection[threadID]) {
    const { targetID } = logMessageData;
    const protectedName = global.botNicknameProtection[threadID].name;

    if (targetID === botID && author !== botID) {
      return api.changeNickname(protectedName, threadID, botID);
    }
  }
};

// --- [ 2. هجوم السيطرة ] ---
module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;
  const name = args.join(" ");

  if (!name) return api.sendMessage("❌ حدد الاسم يا زعيم!", threadID, messageID);

  const botID = api.getCurrentUserID();

  global.botNicknameProtection[threadID] = { name, botID };

  await api.sendMessage("👁️‍🗨️ أمرك أيها الزعيم kaku.. جاري سحق هوياتهم بكل هدوء الآن!", threadID);

  const threadInfo = await api.getThreadInfo(threadID);
  const allUsers = threadInfo.participantIDs;

  for (let uid of allUsers) {
    api.changeNickname(name, threadID, uid, (err) => {
      if (err) console.log(`[Error] UID: ${uid}`);
    });

    await new Promise(resolve => setTimeout(resolve, 3.5));
  }
};
