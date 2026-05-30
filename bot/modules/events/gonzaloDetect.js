if (!global.gonzaloTracker) global.gonzaloTracker = {};

const phrases = [
  "اتى الزعيم CROOOOW... 👑",
  "🔱 CRROOOW عاد للميدان... احذروا 👑",
  "👑 الملك موجود... CROOOOW دخل الكروب 🔱",
  "⚡ اتى الزعيم ROMEOOOOOO... الجميع في خدمته 👑",
  "🌟 KAKUUUUUUU هنا... الكروب اكتمل 👑✨"
  "myyyyy FATHEEEER BARDOCK IS HEREEE"
];

module.exports.config = {
  name: "CROWDETECT",
  eventType: ["message"],
  version: "1.0.0",
  credits: "كاڪو",
  description: "يرصد ظهور الزعيم غراب بعد 15 رسالة غياب"
};

module.exports.run = async function ({ api, event }) {
  const { threadID, senderID } = event;
  if (!event.body) return;

  const ADMINBOT = global.config?.ADMINBOT || [];
  if (ADMINBOT.length === 0) return;

  if (!global.gonzaloTracker[threadID]) {
    global.gonzaloTracker[threadID] = { count: 0 };
  }

  const tracker = global.gonzaloTracker[threadID];
  const isGonzalo = ADMINBOT.includes(senderID);

  if (isGonzalo) {
    if (tracker.count >= 15) {
      const msg = phrases[Math.floor(Math.random() * phrases.length)];
      api.sendMessage(msg, threadID);
    }
    tracker.count = 0;
  } else {
    tracker.count = (tracker.count || 0) + 1;
  }
};
