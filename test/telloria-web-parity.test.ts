import { Path } from "../app/constant";
import {
  LOREBOOK_ENTRY_TYPES,
  buildCorrectionDraft,
  buildLorebookDrafts,
  createDefaultLorebook,
  readEffectiveLorebookEntries,
  readLorebook,
  writeLorebook,
} from "../app/data/lorebook";

describe("Telloria Web parity contracts", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test("exposes the primary Cuddler-compatible user routes", () => {
    expect([
      Path.Explore,
      Path.Games,
      Path.Scene,
      Path.Gacha,
      Path.Feed,
      Path.Character,
      Path.Profile,
      Path.Inbox,
      Path.Membership,
      Path.Credits,
      Path.Settings,
      Path.Resources,
      Path.Changelog,
      Path.Download,
      Path.Support,
      Path.Privacy,
      Path.Terms,
    ]).toEqual([
      "/explore",
      "/games",
      "/scene",
      "/gacha",
      "/feed",
      "/character",
      "/profile",
      "/inbox",
      "/membership",
      "/credits",
      "/settings",
      "/resources",
      "/changelog",
      "/download",
      "/support",
      "/privacy",
      "/terms",
    ]);
  });

  test("supports all nine lorebook entry types", () => {
    expect(LOREBOOK_ENTRY_TYPES).toEqual([
      "correction",
      "side_character",
      "location",
      "item",
      "event",
      "faction",
      "system_rule",
      "culture",
      "species",
    ]);
  });

  test("persists lorebook visibility and entries locally", () => {
    const lorebook = createDefaultLorebook("Miko");
    lorebook.visibility = "hint";
    lorebook.entries[0].title = "Changed title";

    writeLorebook("miko", lorebook);

    const saved = readLorebook("miko", "Miko");
    expect(saved).toMatchObject({
      name: "Miko's world",
      visibility: "hint",
    });
    expect(saved.entries[0]).toMatchObject({ title: "Changed title" });
  });

  test("migrates legacy lorebook types and reusable-world fields", () => {
    window.localStorage.setItem(
      "telloria-lorebook:miko",
      JSON.stringify({
        name: "Legacy world",
        visibility: "full",
        entries: [
          {
            id: "legacy",
            title: "Old rule",
            type: "rule",
            keys: ["old"],
            content: "Legacy content",
            enabled: true,
          },
        ],
      }),
    );

    expect(readLorebook("miko", "Miko")).toMatchObject({
      universeName: "",
      linkedCharacterIds: [],
      entries: [{ type: "system_rule" }],
    });
  });

  test("creates disabled AI drafts and enabled chat corrections", () => {
    const drafts = buildLorebookDrafts("Miko", "A cinematic storyteller.");
    expect(drafts).toHaveLength(3);
    expect(drafts.every((entry) => entry.aiDrafted && !entry.enabled)).toBe(
      true,
    );

    expect(
      buildCorrectionDraft(
        "Miko",
        "Miko forgot the rooftop promise.",
        "Miko always remembers the rooftop promise.",
      ),
    ).toMatchObject({
      type: "correction",
      enabled: true,
      aiDrafted: true,
    });
  });

  test("combines explicitly borrowed and same-universe active lore", () => {
    const miko = createDefaultLorebook("Miko");
    miko.universeName = "Astral";
    miko.linkedCharacterIds = ["jake"];
    writeLorebook("miko", miko);

    const jake = createDefaultLorebook("Jake");
    writeLorebook("jake", jake);

    const koharu = createDefaultLorebook("Koharu");
    koharu.universeName = "astral";
    writeLorebook("koharu", koharu);

    const entries = readEffectiveLorebookEntries("miko", "Miko", [
      { id: "miko", name: "Miko" },
      { id: "jake", name: "Jake" },
      { id: "koharu", name: "Koharu" },
    ]);

    expect(entries).toHaveLength(9);
    expect(entries.some((entry) => entry.id.startsWith("jake:"))).toBe(true);
    expect(entries.some((entry) => entry.id.startsWith("koharu:"))).toBe(true);
  });
});
