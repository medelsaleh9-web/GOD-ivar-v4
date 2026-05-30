module.exports.config = {
  name: "عبد",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "كاڪو",
  description: "جعل عضو خادم غونزالو وتغيير كنيته",
  commandCategory: "الملاك",
  usages: "عبد (رد على رسالة العضو)",
  cooldowns: 3
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID, messageReply } = event;

  if (!messageReply) {
    return api.sendMessage(
      `⚠️ ارد على رسالة العضو واكتب "عبد`,
      threadID,
      messageID
    );
  }

  const targetID = messageReply.senderID;
  const botID = api.getCurrentUserID();

  if (targetID === botID) {
    return api.sendMessage("😅 لا يمكن تعيين البوت خادماً!", threadID, messageID);
  }

  const nickname = `خآدم الغࢪبآان`;

  try {
    await api.changeNickname(nickname, threadID, targetID);
    return api.sendMessage(
      `حڪم عليڪ القاضي ڪاڪو بالإستعباد لما تبقى لك فهذا الغروب`,
      threadID,
      messageID
    );
  } catch (err) {
    return api.sendMessage("❌ فشل تغيير الكنية", threadID, messageID);
  }
};
