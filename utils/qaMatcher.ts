type Rule = {
  keywords: string[];
  response: string;
};

const RULES: Rule[] = [
  {
    keywords: ["food", "breakfast", "menu", "order"],
    response:
      "Our restaurant is open 24/7. You can order food from the in-room tablet or by calling extension 9.",
  },
  {
    keywords: ["water", "bottle", "drinking water"],
    response:
      "Sure! Housekeeping will deliver two bottles of drinking water shortly.",
  },
  {
    keywords: ["clean room", "housekeeping", "towel", "linen"],
    response:
      "Housekeeping has been notified. They will attend to your room in 10–15 minutes.",
  },
  {
    keywords: ["wifi", "internet"],
    response: "The WiFi password is: ROOM1234.",
  },
  {
    keywords: ["swimming pool", "pool"],
    response: "The swimming pool is open from 6 AM to 8 PM.",
  },
  {
    keywords: ["gym", "fitness"],
    response:
      "Our gym is open 24 hours and accessible using your room card.",
  },
  {
    keywords: ["check out", "checkout"],
    response:
      "Standard checkout time is 11 AM. You can request late checkout based on availability.",
  },
  {
    keywords: ["location", "address"],
    response:
      "We are located at 12th Cross, MG Road, Bangalore.",
  },
];

export function getBotResponse(userText: string): string {
  const text = userText
  .toLowerCase()
  .replace(/[-_]/g, "")
  .replace(/[^\w\s]/g, "");


  for (const rule of RULES) {
    if (rule.keywords.some((k) => text.includes(k))) {
      return rule.response;
    }
  }

  return "I’m sorry, I didn’t understand that. Could you please rephrase?";
} 