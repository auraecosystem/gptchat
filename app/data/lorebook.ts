export const LOREBOOK_ENTRY_TYPES = [
  "correction",
  "side_character",
  "location",
  "item",
  "event",
  "faction",
  "system_rule",
  "culture",
  "species",
] as const;

export type LorebookEntryType = (typeof LOREBOOK_ENTRY_TYPES)[number];
export type LorebookVisibility = "private" | "hint" | "full";

export type LorebookEntry = {
  id: string;
  title: string;
  type: LorebookEntryType;
  keys: string[];
  content: string;
  enabled: boolean;
  aiDrafted?: boolean;
};

export type Lorebook = {
  name: string;
  visibility: LorebookVisibility;
  universeName: string;
  linkedCharacterIds: string[];
  entries: LorebookEntry[];
};

export type LorebookCharacter = {
  id: string;
  name: string;
};

const DEFAULT_ENTRIES: LorebookEntry[] = [
  {
    id: "entry-astral-station",
    title: "Astral Station",
    type: "location",
    keys: ["station", "platform", "last train"],
    content:
      "A terminal between timelines. Its clocks count choices instead of minutes, and platform seven only appears after midnight.",
    enabled: true,
  },
  {
    id: "entry-memory-rule",
    title: "The memory rule",
    type: "system_rule",
    keys: ["remember", "timeline", "choice"],
    content:
      "Characters remember emotional consequences across timeline resets, but not the exact event that caused them.",
    enabled: true,
  },
  {
    id: "entry-yellow-letter",
    title: "The yellow letter",
    type: "item",
    keys: ["letter", "envelope", "yellow"],
    content:
      "A sealed letter in a yellow envelope. Opening it permanently closes one possible route through the story.",
    enabled: true,
  },
  {
    id: "entry-quiet-pact",
    title: "The quiet pact",
    type: "correction",
    keys: ["promise", "pact", "rooftop"],
    content:
      "Miko promised to protect the user's original timeline, even if that means erasing herself from the next one.",
    enabled: false,
  },
];

export function createDefaultLorebook(characterName: string): Lorebook {
  return {
    name: `${characterName}'s world`,
    visibility: "full",
    universeName: "",
    linkedCharacterIds: [],
    entries: DEFAULT_ENTRIES.map((entry) => ({
      ...entry,
      keys: [...entry.keys],
    })),
  };
}

export function lorebookStorageKey(characterId: string) {
  return `telloria-lorebook:${characterId}`;
}

export function readLorebook(
  characterId: string,
  characterName: string,
): Lorebook {
  if (typeof window === "undefined")
    return createDefaultLorebook(characterName);
  try {
    const value = window.localStorage.getItem(lorebookStorageKey(characterId));
    if (!value) return createDefaultLorebook(characterName);

    const fallback = createDefaultLorebook(characterName);
    const parsed = JSON.parse(value) as Partial<Lorebook>;
    return {
      ...fallback,
      ...parsed,
      universeName:
        typeof parsed.universeName === "string" ? parsed.universeName : "",
      linkedCharacterIds: Array.isArray(parsed.linkedCharacterIds)
        ? parsed.linkedCharacterIds.filter(
            (id): id is string => typeof id === "string",
          )
        : [],
      entries: Array.isArray(parsed.entries)
        ? parsed.entries.map((entry) => ({
            ...entry,
            type: normalizeLorebookType(entry.type),
          }))
        : fallback.entries,
    };
  } catch {
    return createDefaultLorebook(characterName);
  }
}

export function writeLorebook(characterId: string, lorebook: Lorebook) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    lorebookStorageKey(characterId),
    JSON.stringify(lorebook),
  );
}

export function formatLorebookType(type: LorebookEntryType) {
  return type
    .split("_")
    .map((value) => value[0].toUpperCase() + value.slice(1))
    .join(" ");
}

function normalizeLorebookType(type: unknown): LorebookEntryType {
  if (
    typeof type === "string" &&
    (LOREBOOK_ENTRY_TYPES as readonly string[]).includes(type)
  ) {
    return type as LorebookEntryType;
  }

  const legacy: Record<string, LorebookEntryType> = {
    character: "side_character",
    rule: "system_rule",
    relationship: "culture",
    secret: "correction",
    other: "culture",
  };
  return typeof type === "string" ? (legacy[type] ?? "culture") : "culture";
}

export function buildLorebookDrafts(
  characterName: string,
  summary: string,
): LorebookEntry[] {
  const seed = Date.now();
  return [
    {
      id: `ai-draft-${seed}-identity`,
      title: `${characterName}'s core`,
      type: "side_character",
      keys: [characterName.toLowerCase(), "personality", "identity"],
      content: `${characterName} is defined by this premise: ${summary}`,
      enabled: false,
      aiDrafted: true,
    },
    {
      id: `ai-draft-${seed}-rule`,
      title: "Story continuity",
      type: "system_rule",
      keys: ["remember", "before", "promise"],
      content:
        "Preserve established promises, emotional consequences, and named relationships between replies.",
      enabled: false,
      aiDrafted: true,
    },
    {
      id: `ai-draft-${seed}-relationship`,
      title: "Relationship with the reader",
      type: "culture",
      keys: ["you", "together", "trust"],
      content: `${characterName} treats the reader as an active participant whose choices permanently shape the story.`,
      enabled: false,
      aiDrafted: true,
    },
  ];
}

export function buildCorrectionDraft(
  characterName: string,
  message: string,
  note: string,
): LorebookEntry {
  const conciseMessage = message.replace(/\s+/g, " ").trim().slice(0, 180);
  const correction = note.trim();
  const keywords = correction
    .split(/[\s,，.!?]+/)
    .map((value) => value.toLowerCase())
    .filter((value) => value.length > 2)
    .slice(0, 4);

  return {
    id: `correction-${Date.now()}`,
    title: correction ? `Correction: ${correction.slice(0, 48)}` : "Chat correction",
    type: "correction",
    keys: keywords.length > 0 ? keywords : [characterName.toLowerCase(), "correction"],
    content: correction
      ? `${correction}\n\nPrevious reply to avoid repeating: ${conciseMessage}`
      : `${characterName} should not repeat this incorrect reply: ${conciseMessage}`,
    enabled: true,
    aiDrafted: true,
  };
}

export function readEffectiveLorebookEntries(
  characterId: string,
  characterName: string,
  characters: LorebookCharacter[],
): LorebookEntry[] {
  const current = readLorebook(characterId, characterName);
  const relatedIds = new Set(current.linkedCharacterIds);

  if (current.universeName.trim()) {
    for (const character of characters) {
      if (character.id === characterId) continue;
      const candidate = readLorebook(character.id, character.name);
      if (
        candidate.universeName.trim().toLowerCase() ===
        current.universeName.trim().toLowerCase()
      ) {
        relatedIds.add(character.id);
      }
    }
  }

  const entries = current.entries
    .filter((entry) => entry.enabled)
    .map((entry) => ({ ...entry, keys: [...entry.keys] }));

  for (const relatedId of relatedIds) {
    const character = characters.find((item) => item.id === relatedId);
    if (!character) continue;
    const related = readLorebook(character.id, character.name);
    entries.push(
      ...related.entries
        .filter((entry) => entry.enabled)
        .map((entry) => ({
          ...entry,
          id: `${character.id}:${entry.id}`,
          keys: [...entry.keys],
        })),
    );
  }

  return entries;
}
