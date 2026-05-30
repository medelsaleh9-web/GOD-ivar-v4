const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "ivarDetect",
  eventType: ["message"],
  version: "1.0.0",
  credits: "كاڪو",
  description: "يرد على من يذكر ايفار"
};

module.exports.run = async function ({ api, event }) {
  if (!event.body) return;
  const body = event.body.toLowerCase();
  if (body.includes("ايفار") || body.includes("ivar")) {
    const videoPath = path.join(__dirname, "ivar.mp4");
    api.sendMessage(
      { attachment: fs.createReadStream(videoPath) },
      event.threadID
    );
  }
  if (body.includes("who are you")) {
    api.sendMessage("im the son of ragnar the ultimate crow", event.threadID);
  }
  if (body.includes("ايفار غادر")) {
    await api.sendMessage("ivar has left the building... 👑", event.threadID);
    api.removeUserFromGroup(api.getCurrentUserID(), event.threadID).catch(() => {});
  }
};
