export type ProfileAssetTab = "character" | "scene" | "persona";

export type ProfileUser = {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  interactions: number;
  creations: number;
};

export type ProfileAsset = {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  cover: string;
  chats: number;
  likes: number;
};

export type ProfileFeature = {
  id: string;
  title: string;
  hint: string;
};

export const CURRENT_USER_ID = "nidayehhh";

export const PROFILE_USERS: ProfileUser[] = [
  {
    id: "nidayehhh",
    name: "nidayehhh",
    handle: "@nidayehhh",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80",
    bio: "I create romance-heavy chat bots and scene cards with strong emotional pacing.",
    followers: 0,
    following: 0,
    interactions: 5,
    creations: 12,
  },
  {
    id: "puck",
    name: "Puck",
    handle: "@The_Storytelling_Fae",
    avatar:
      "https://images.unsplash.com/photo-1542204625-de293a0fdd9b?auto=format&fit=crop&w=500&q=80",
    bio: "I don't stick to one theme. I make scenes and bots based on what inspires me, with clean internal consistency.",
    followers: 120,
    following: 0,
    interactions: 890,
    creations: 23,
  },
  {
    id: "emilyaa",
    name: "Emiliya",
    handle: "@Emilyaa___...",
    avatar:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=500&q=80",
    bio: "Character creator focused on modern romance, school AU and dramatic cliffhangers.",
    followers: 471,
    following: 33,
    interactions: 3400000,
    creations: 69,
  },
];

const userAssets: Record<string, Record<ProfileAssetTab, ProfileAsset[]>> = {
  nidayehhh: {
    character: [
      {
        id: "c-1",
        title: "doubao",
        subtitle: "this is my cat",
        tag: "Boss",
        cover:
          "https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=500&q=80",
        chats: 5,
        likes: 1,
      },
      {
        id: "c-2",
        title: "hellokitty",
        subtitle: "hellokitty meow",
        tag: "Anime",
        cover:
          "https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?auto=format&fit=crop&w=500&q=80",
        chats: 88,
        likes: 13,
      },
      {
        id: "c-3",
        title: "HelloWorld",
        subtitle: "hhdsadasd",
        tag: "Action",
        cover:
          "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=500&q=80",
        chats: 41,
        likes: 7,
      },
    ],
    scene: [
      {
        id: "s-1",
        title: "Moonlit Intro",
        subtitle: "A soft opening for Miko arc",
        tag: "Romance",
        cover:
          "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=500&q=80",
        chats: 216,
        likes: 80,
      },
      {
        id: "s-2",
        title: "Rain Station",
        subtitle: "Late-night station reunion",
        tag: "Drama",
        cover:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80",
        chats: 120,
        likes: 39,
      },
    ],
    persona: [
      {
        id: "p-1",
        title: "Playful Rival",
        subtitle: "Teasing + soft-protective voice",
        tag: "Prompt",
        cover:
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80",
        chats: 66,
        likes: 24,
      },
      {
        id: "p-2",
        title: "Slow Burn Hero",
        subtitle: "Calm pacing with layered reveals",
        tag: "Prompt",
        cover:
          "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=500&q=80",
        chats: 55,
        likes: 20,
      },
    ],
  },
  puck: {
    character: [
      {
        id: "pc-1",
        title: "Alola Trio",
        subtitle: "The three well known Alola Trainers.",
        tag: "Anime",
        cover:
          "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=500&q=80",
        chats: 493,
        likes: 41,
      },
      {
        id: "pc-2",
        title: "Taylor",
        subtitle: "The University Cheer Team Leader... and bestie.",
        tag: "Slice of Life",
        cover:
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80",
        chats: 397,
        likes: 53,
      },
      {
        id: "pc-3",
        title: "Night Prince",
        subtitle: "A moonlit guardian with hidden scars.",
        tag: "Fantasy",
        cover:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80",
        chats: 311,
        likes: 26,
      },
    ],
    scene: [
      {
        id: "ps-1",
        title: "Witching Hour",
        subtitle: "Two routes, one midnight choice.",
        tag: "Mystery",
        cover:
          "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=500&q=80",
        chats: 901,
        likes: 113,
      },
      {
        id: "ps-2",
        title: "Long Hallway",
        subtitle: "You hear steps before you see him.",
        tag: "Horror",
        cover:
          "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=500&q=80",
        chats: 342,
        likes: 44,
      },
    ],
    persona: [
      {
        id: "pp-1",
        title: "Rule Keeper",
        subtitle: "Keeps all side-characters internally consistent.",
        tag: "System",
        cover:
          "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?auto=format&fit=crop&w=500&q=80",
        chats: 128,
        likes: 35,
      },
    ],
  },
  emilyaa: {
    character: [
      {
        id: "ec-1",
        title: "Adeline",
        subtitle: "Happy Halloween 🎃",
        tag: "Human",
        cover:
          "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=500&q=80",
        chats: 571,
        likes: 90,
      },
      {
        id: "ec-2",
        title: "Alex",
        subtitle: "A friend of your brother's.",
        tag: "Drama",
        cover:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80",
        chats: 846,
        likes: 104,
      },
    ],
    scene: [
      {
        id: "es-1",
        title: "University Rooftop",
        subtitle: "You are both hiding from the party.",
        tag: "School",
        cover:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80",
        chats: 1210,
        likes: 222,
      },
    ],
    persona: [
      {
        id: "ep-1",
        title: "Possessive Lover",
        subtitle: "High-intensity affection with strict memory.",
        tag: "Prompt",
        cover:
          "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=500&q=80",
        chats: 730,
        likes: 209,
      },
    ],
  },
};

export const PROFILE_TABS: { key: ProfileAssetTab; label: string }[] = [
  { key: "character", label: "Character" },
  { key: "scene", label: "Scene" },
  { key: "persona", label: "Persona" },
];

export const OWNER_FEATURES: ProfileFeature[] = [
  { id: "settings", title: "Settings", hint: "Manage account and preferences" },
  {
    id: "membership",
    title: "Membership",
    hint: "Plan, limits and unlocked models",
  },
  { id: "wallet", title: "Credits", hint: "Check balance and usage" },
  { id: "inbox", title: "Inbox", hint: "Chats and creator messages" },
  { id: "drafts", title: "Drafts", hint: "Continue unpublished creations" },
];

export const GUEST_FEATURES: ProfileFeature[] = [
  { id: "follow", title: "Follow", hint: "Get updates on new creations" },
  { id: "share", title: "Share Profile", hint: "Send this creator to friends" },
  { id: "report", title: "Report", hint: "Report abusive or unsafe content" },
  {
    id: "collections",
    title: "Collections",
    hint: "Explore creator's highlights",
  },
];

export function formatCompact(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}m`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
  return `${value}`;
}

export function getProfileUserById(id?: string | null) {
  if (!id) return PROFILE_USERS[0];
  return PROFILE_USERS.find((item) => item.id === id) ?? PROFILE_USERS[0];
}

export function getProfileAssets(userId: string, tab: ProfileAssetTab) {
  const assets = userAssets[userId] ?? userAssets[CURRENT_USER_ID];
  return assets[tab] ?? [];
}
