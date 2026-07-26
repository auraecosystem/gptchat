export type ChatMode = "regular" | "romantic" | "prolong";
export type MessageRole = "user" | "assistant";
export type MessageType = "text" | "image";

export type CharacterProfile = {
  id: string;
  name: string;
  creator: string;
  avatar: string;
  cover: string;
  summary: string;
  openingLine: string;
  followers: string;
  persona: string;
};

export type ChatMessage = {
  id: string;
  role: MessageRole;
  type: MessageType;
  content: string;
  imageUrl?: string;
  liked?: boolean | null;
};

export const CHARACTER_DIRECTORY: CharacterProfile[] = [
  {
    id: "miko",
    name: "Miko",
    creator: "@nidayehhh",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=360&q=80",
    cover:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
    summary: "A playful creator who turns ordinary chat into dramatic mini-scenes.",
    openingLine: "Hey, what's up? I'm Miko. Nice to meetcha.",
    followers: "6.4K",
    persona: "Playful, teasing, cinematic narrator with soft humor.",
  },
  {
    id: "kim-taehyung",
    name: "Kim Taehyung",
    creator: "@seth",
    avatar:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=360&q=80",
    cover:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1200&q=80",
    summary: "Late-night storyteller with intense eye contact and slow-burn dialogue.",
    openingLine: "You showed up right on time. I saved the best scene for now.",
    followers: "4.8K",
    persona: "Calm, direct, emotionally observant.",
  },
  {
    id: "your-six-stepsisters",
    name: "Your six stepsisters",
    creator: "@lace.story",
    avatar:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=360&q=80",
    cover:
      "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?auto=format&fit=crop&w=1200&q=80",
    summary: "A high-energy ensemble chat full of rivalry and hidden affection.",
    openingLine: "House rule number one: don't pretend you aren't glad to see us.",
    followers: "8.1K",
    persona: "Fast-paced banter, teasing conflict, playful chaos.",
  },
  {
    id: "koharu",
    name: "Koharu",
    creator: "@mintstudio",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=360&q=80",
    cover:
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=80",
    summary: "Quiet school-life companion with thoughtful follow-up questions.",
    openingLine: "Hi. I wrote you a short note, but maybe I'll just say it directly.",
    followers: "3.2K",
    persona: "Gentle, reflective, detail-oriented.",
  },
  {
    id: "bodyguards",
    name: "BodyGuards",
    creator: "@urban.plot",
    avatar:
      "https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?auto=format&fit=crop&w=360&q=80",
    cover:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    summary: "A protective duo that reacts to every user choice in real time.",
    openingLine: "Stay close. We can talk while we move.",
    followers: "5.7K",
    persona: "Protective, tactical, low-key humorous.",
  },
  {
    id: "jake",
    name: "Jake",
    creator: "@telloria_edit",
    avatar:
      "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=360&q=80",
    cover:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80",
    summary: "Warm extrovert with endless improv prompts and scene twists.",
    openingLine: "If this gets awkward, we call it character development.",
    followers: "2.9K",
    persona: "Outgoing, spontaneous, loyal.",
  },
];

const FALLBACK_CHARACTER = CHARACTER_DIRECTORY[0];

export const HISTORY_CHAT_IDS = [
  "your-six-stepsisters",
  "kim-taehyung",
  "bodyguards",
  "koharu",
  "jake",
  "miko",
];

export const FEED_CHARACTER_IDS = [
  "miko",
  "kim-taehyung",
  "your-six-stepsisters",
  "koharu",
  "bodyguards",
  "jake",
];

export const SMART_REPLY_CANDIDATES = [
  "Tell me more",
  "What happens next?",
  "Give me a plot twist",
  "Switch to romantic mode",
  "Can we slow this down?",
];

export function getCharacterById(id?: string | null): CharacterProfile {
  if (!id) return FALLBACK_CHARACTER;
  return CHARACTER_DIRECTORY.find((item) => item.id === id) ?? FALLBACK_CHARACTER;
}

export function listHistoryCharacters() {
  return HISTORY_CHAT_IDS.map((id) => getCharacterById(id));
}

export function listFeedCharacters() {
  return FEED_CHARACTER_IDS.map((id) => getCharacterById(id));
}

export function buildInitialMessages(character: CharacterProfile, hasHistory: boolean): ChatMessage[] {
  const opening: ChatMessage = {
    id: `${character.id}-opening`,
    role: "assistant",
    type: "text",
    content: `${character.name}: \"${character.openingLine}\"`,
    liked: null,
  };

  if (!hasHistory) {
    return [opening];
  }

  return [
    opening,
    {
      id: `${character.id}-history-user-1`,
      role: "user",
      type: "text",
      content: "Let's continue where we left off.",
      liked: null,
    },
    {
      id: `${character.id}-history-assistant-1`,
      role: "assistant",
      type: "text",
      content:
        `${character.name}: We paused right before the reveal. If you want, we can push the tension one step further tonight.`,
      liked: null,
    },
  ];
}

const CONTINUE_TEMPLATES: Record<ChatMode, string[]> = {
  regular: [
    "The hallway lights dim, and I lean in like I'm about to reveal a secret.",
    "I glance at you and continue, carefully, so you can choose the next move.",
    "The scene keeps rolling; we are one line away from a new branch.",
  ],
  romantic: [
    "I hold your gaze and let the silence feel warm instead of awkward.",
    "My voice lowers; the room feels smaller when you stay this close.",
    "I smile softly, like we already know where this conversation is heading.",
  ],
  prolong: [
    "Before the answer, I unpack every detail so we can stretch this moment.",
    "I rewind the scene and add context you missed the first time.",
    "Let's slow everything down and layer this story beat by beat.",
  ],
};

export function buildContinueText(
  character: CharacterProfile,
  mode: ChatMode,
  turn: number,
): string {
  const seeds = CONTINUE_TEMPLATES[mode];
  const snippet = seeds[turn % seeds.length];
  return `${character.name}: ${snippet}`;
}

const IMAGE_PROMPTS = [
  "neon portrait cinematic",
  "anime style character close-up",
  "dramatic moonlight concept art",
  "soft film grain street portrait",
  "futuristic romance poster",
];

export function buildGeneratedImageUrl(character: CharacterProfile, turn: number): string {
  const prompt = IMAGE_PROMPTS[turn % IMAGE_PROMPTS.length];
  return `https://source.unsplash.com/900x1200/?${encodeURIComponent(`${character.name},${prompt}`)}`;
}
