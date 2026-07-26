import { useEffect, useState } from "react";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import { Path } from "../constant";
import {
  LOREBOOK_ENTRY_TYPES,
  buildCorrectionDraft,
  buildLorebookDrafts,
  createDefaultLorebook,
  formatLorebookType,
  readEffectiveLorebookEntries,
  readLorebook,
  writeLorebook,
  type Lorebook,
  type LorebookEntry,
  type LorebookEntryType,
  type LorebookVisibility,
} from "../data/lorebook";
import {
  CHARACTER_DIRECTORY,
  getCharacterById,
} from "../data/scene-chat";
import styles from "./lorebook.module.scss";

export function LoreBadge({
  count,
  onClick,
}: {
  count: number;
  onClick: () => void;
}) {
  return (
    <button className={styles.badge} onClick={onClick}>
      <span>▤</span>
      <span>World lore</span>
      <small>{count}</small>
    </button>
  );
}

export function LorebookViewer({
  characterId,
  onClose,
}: {
  characterId: string;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const character = getCharacterById(characterId);
  const [lorebook, setLorebook] = useState<Lorebook>(() =>
    createDefaultLorebook(character.name),
  );

  useEffect(() => {
    setLorebook(readLorebook(character.id, character.name));
  }, [character.id, character.name]);

  const enabled = readEffectiveLorebookEntries(
    character.id,
    character.name,
    CHARACTER_DIRECTORY,
  );
  const visibleEntries = lorebook.visibility === "full" ? enabled : [];

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <section
        className={styles.viewer}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lorebook-viewer-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header>
          <div>
            <small>WORLD LORE</small>
            <h2 id="lorebook-viewer-title">{lorebook.name}</h2>
          </div>
          <div>
            <button
              aria-label="Edit lorebook"
              onClick={() =>
                navigate(`${Path.Character}/${character.id}/lorebook`)
              }
            >
              ✎
            </button>
            <button aria-label="Close lorebook" onClick={onClose}>
              ×
            </button>
          </div>
        </header>

        <p className={styles.viewerIntro}>
          {enabled.length} active entries help {character.name} stay consistent.
        </p>

        {lorebook.visibility === "private" ? (
          <div className={styles.privateState}>
            <span>◇</span>
            <b>This lorebook is private</b>
            <p>
              The creator uses private world notes to keep this character
              consistent.
            </p>
          </div>
        ) : lorebook.visibility === "hint" ? (
          <div className={styles.privateState}>
            <span>▤</span>
            <b>{enabled.length} world entries</b>
            <p>
              The creator shares entry titles but keeps their contents hidden.
            </p>
            <div className={styles.hintList}>
              {enabled.map((entry) => (
                <span key={entry.id}>{entry.title}</span>
              ))}
            </div>
          </div>
        ) : (
          <ul className={styles.viewerList}>
            {visibleEntries.map((entry) => (
              <li key={entry.id}>
                <div>
                  <h3>{entry.title}</h3>
                  <span>{formatLorebookType(entry.type)}</span>
                </div>
                <div className={styles.keys}>
                  {entry.keys.map((key) => (
                    <span key={key}>{key}</span>
                  ))}
                </div>
                <p>{entry.content}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function newEntry(): LorebookEntry {
  return {
    id: `entry-${Date.now()}`,
    title: "Untitled entry",
    type: "culture",
    keys: [],
    content: "",
    enabled: true,
  };
}

export function LorebookEditorPage({ characterId }: { characterId: string }) {
  const navigate = useNavigate();
  const character = getCharacterById(characterId);
  const [lorebook, setLorebook] = useState<Lorebook>(() =>
    createDefaultLorebook(character.name),
  );
  const [selectedId, setSelectedId] = useState("");
  const [saved, setSaved] = useState(false);
  const [showBorrowPicker, setShowBorrowPicker] = useState(false);
  const [drafting, setDrafting] = useState(false);
  const [drafts, setDrafts] = useState<LorebookEntry[]>([]);

  useEffect(() => {
    const value = readLorebook(character.id, character.name);
    setLorebook(value);
    setSelectedId(value.entries[0]?.id ?? "");
  }, [character.id, character.name]);

  const selected =
    lorebook.entries.find((entry) => entry.id === selectedId) ?? null;

  const updateEntry = (patch: Partial<LorebookEntry>) => {
    setSaved(false);
    setLorebook((value) => ({
      ...value,
      entries: value.entries.map((entry) =>
        entry.id === selectedId ? { ...entry, ...patch } : entry,
      ),
    }));
  };

  const addEntry = () => {
    const entry = newEntry();
    setLorebook((value) => ({ ...value, entries: [...value.entries, entry] }));
    setSelectedId(entry.id);
    setSaved(false);
  };

  const removeEntry = () => {
    setLorebook((value) => {
      const entries = value.entries.filter((entry) => entry.id !== selectedId);
      setSelectedId(entries[0]?.id ?? "");
      return { ...value, entries };
    });
    setSaved(false);
  };

  const save = () => {
    writeLorebook(character.id, lorebook);
    setSaved(true);
  };

  const updateBook = (patch: Partial<Lorebook>) => {
    setSaved(false);
    setLorebook((value) => ({ ...value, ...patch }));
  };

  const toggleLinkedCharacter = (characterId: string) => {
    setSaved(false);
    setLorebook((value) => ({
      ...value,
      linkedCharacterIds: value.linkedCharacterIds.includes(characterId)
        ? value.linkedCharacterIds.filter((id) => id !== characterId)
        : [...value.linkedCharacterIds, characterId].slice(0, 2),
    }));
  };

  const draftWithAI = () => {
    setDrafting(true);
    window.setTimeout(() => {
      setDrafts(buildLorebookDrafts(character.name, character.summary));
      setDrafting(false);
    }, 280);
  };

  const adoptDraft = (draft: LorebookEntry) => {
    const entry = {
      ...draft,
      id: `entry-${Date.now()}-${draft.type}`,
      enabled: false,
    };
    setLorebook((value) => ({
      ...value,
      entries: [...value.entries, entry],
    }));
    setDrafts((value) => value.filter((item) => item.id !== draft.id));
    setSelectedId(entry.id);
    setSaved(false);
  };

  const linkedCharacters = lorebook.linkedCharacterIds
    .map((id) => CHARACTER_DIRECTORY.find((item) => item.id === id))
    .filter((item): item is (typeof CHARACTER_DIRECTORY)[number] => Boolean(item));
  const borrowCandidates = CHARACTER_DIRECTORY.filter(
    (item) =>
      item.id !== character.id &&
      !lorebook.linkedCharacterIds.includes(item.id),
  );

  return (
    <div className={styles.editorPage}>
      <header className={styles.editorHeader}>
        <button onClick={() => navigate(`${Path.Character}/${character.id}`)}>
          ←
        </button>
        <div>
          <small>{character.name.toUpperCase()}</small>
          <h1>Lorebook</h1>
        </div>
        <button className={styles.saveButton} onClick={save}>
          {saved ? "Saved" : "Save"}
        </button>
      </header>

      <div className={styles.editorLayout}>
        <aside className={styles.entryList}>
          <div>
            <span>{lorebook.entries.length} entries</span>
            <button onClick={addEntry}>+ Add</button>
          </div>
          {lorebook.entries.map((entry) => (
            <button
              key={entry.id}
              className={clsx({ [styles.active]: selectedId === entry.id })}
              onClick={() => setSelectedId(entry.id)}
            >
              <span>{entry.title || "Untitled entry"}</span>
              <small>{formatLorebookType(entry.type)}</small>
            </button>
          ))}
        </aside>

        <main className={styles.entryEditor}>
          <section className={styles.sharedWorlds}>
            <header>
              <div>
                <small>SHARED WORLDS</small>
                <h2>Reuse world lore</h2>
                <p>
                  Group characters into one universe or borrow a world from
                  another character.
                </p>
              </div>
            </header>

            <label>
              Universe
              <input
                value={lorebook.universeName}
                onChange={(event) =>
                  updateBook({ universeName: event.target.value.slice(0, 80) })
                }
                placeholder="Astral Station"
              />
              <small>
                Characters with the same universe name share their active lore.
              </small>
            </label>

            <div className={styles.borrowedWorlds}>
              <div>
                <span>Borrowed worlds</span>
                <button
                  type="button"
                  onClick={() => setShowBorrowPicker((value) => !value)}
                  disabled={lorebook.linkedCharacterIds.length >= 2}
                >
                  + Borrow
                </button>
              </div>
              {linkedCharacters.length > 0 ? (
                <ul>
                  {linkedCharacters.map((item) => (
                    <li key={item.id}>
                      <span>
                        <b>{item.name}&apos;s world</b>
                        <small>
                          {
                            readLorebook(item.id, item.name).entries.filter(
                              (entry) => entry.enabled,
                            ).length
                          }{" "}
                          active entries
                        </small>
                      </span>
                      <button
                        type="button"
                        aria-label={`Stop borrowing ${item.name}'s world`}
                        onClick={() => toggleLinkedCharacter(item.id)}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No borrowed worlds yet.</p>
              )}

              {showBorrowPicker && (
                <div className={styles.borrowPicker}>
                  {borrowCandidates.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => {
                        toggleLinkedCharacter(item.id);
                        setShowBorrowPicker(false);
                      }}
                    >
                      <span>{item.name}&apos;s world</span>
                      <small>Borrow active entries</small>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className={styles.aiDrafts}>
            <header>
              <div>
                <small>DRAFT WITH AI</small>
                <h2>Start from a reviewable draft</h2>
                <p>
                  Turn the character premise into starter lore. Kept entries
                  begin inactive until you approve them.
                </p>
              </div>
              <button type="button" onClick={draftWithAI} disabled={drafting}>
                {drafting ? "Drafting…" : "✦ Draft"}
              </button>
            </header>

            {drafts.length > 0 && (
              <ul>
                {drafts.map((draft) => (
                  <li key={draft.id}>
                    <div>
                      <span>{formatLorebookType(draft.type)}</span>
                      <h3>{draft.title}</h3>
                      <p>{draft.content}</p>
                      <div className={styles.keys}>
                        {draft.keys.map((key) => (
                          <span key={key}>{key}</span>
                        ))}
                      </div>
                    </div>
                    <button type="button" onClick={() => adoptDraft(draft)}>
                      Keep
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className={styles.bookSettings}>
            <label>
              Lorebook name
              <input
                value={lorebook.name}
                onChange={(event) => updateBook({ name: event.target.value })}
              />
            </label>
            <label>
              Reader visibility
              <select
                value={lorebook.visibility}
                onChange={(event) =>
                  updateBook({
                    visibility: event.target.value as LorebookVisibility,
                  })
                }
              >
                <option value="private">Private</option>
                <option value="hint">Titles only</option>
                <option value="full">Full entries</option>
              </select>
            </label>
          </section>

          {selected ? (
            <section className={styles.fields}>
              <div className={styles.fieldTop}>
                <label className={styles.enabled}>
                  <input
                    type="checkbox"
                    checked={selected.enabled}
                    onChange={(event) =>
                      updateEntry({ enabled: event.target.checked })
                    }
                  />
                  Active
                </label>
                <button onClick={removeEntry}>Delete entry</button>
              </div>
              <label>
                Entry title
                <input
                  value={selected.title}
                  onChange={(event) =>
                    updateEntry({ title: event.target.value })
                  }
                  placeholder="Give this piece of lore a name"
                />
              </label>
              <label>
                Entry type
                <select
                  value={selected.type}
                  onChange={(event) =>
                    updateEntry({
                      type: event.target.value as LorebookEntryType,
                    })
                  }
                >
                  {LOREBOOK_ENTRY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {formatLorebookType(type)}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Trigger keywords
                <input
                  value={selected.keys.join(", ")}
                  onChange={(event) =>
                    updateEntry({
                      keys: event.target.value
                        .split(",")
                        .map((value) => value.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="station, platform, last train"
                />
                <small>Separate keywords with commas.</small>
              </label>
              <label>
                Lore content
                <textarea
                  value={selected.content}
                  onChange={(event) =>
                    updateEntry({ content: event.target.value })
                  }
                  placeholder="What should the character remember?"
                />
              </label>
            </section>
          ) : (
            <section className={styles.noEntry}>
              <span>▤</span>
              <h2>Create your first entry</h2>
              <button onClick={addEntry}>Add entry</button>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export function LoreFixModal({
  characterId,
  characterName,
  message,
  onClose,
  onSaved,
}: {
  characterId: string;
  characterName: string;
  message: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [note, setNote] = useState("");
  const [draft, setDraft] = useState<LorebookEntry | null>(null);
  const [saved, setSaved] = useState(false);

  const saveDraft = () => {
    if (!draft) return;
    const lorebook = readLorebook(characterId, characterName);
    writeLorebook(characterId, {
      ...lorebook,
      entries: [...lorebook.entries, draft],
    });
    setSaved(true);
    onSaved();
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <section
        className={styles.fixModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="fix-lore-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header>
          <div>
            <small>WORLD INFO</small>
            <h2 id="fix-lore-title">Fix this in world lore</h2>
          </div>
          <button aria-label="Close correction" onClick={onClose}>
            ×
          </button>
        </header>

        {saved ? (
          <div className={styles.fixSaved}>
            <span>✓</span>
            <p>Saved. The correction applies from the next reply.</p>
            <button onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <p>
              Capture what this reply got wrong while the context is still
              fresh.
            </p>
            <label>
              What should be true instead? <small>Optional</small>
              <input
                value={note}
                onChange={(event) => setNote(event.target.value.slice(0, 300))}
                placeholder="Miko never forgets the rooftop promise."
              />
            </label>

            {draft && (
              <div className={styles.fixDraft}>
                <span>{formatLorebookType(draft.type)}</span>
                <h3>{draft.title}</h3>
                <p>{draft.content}</p>
                <div className={styles.keys}>
                  {draft.keys.map((key) => (
                    <span key={key}>{key}</span>
                  ))}
                </div>
              </div>
            )}

            <footer>
              <button onClick={onClose}>Cancel</button>
              {draft ? (
                <button onClick={saveDraft}>Save entry</button>
              ) : (
                <button
                  onClick={() =>
                    setDraft(
                      buildCorrectionDraft(characterName, message, note),
                    )
                  }
                >
                  ✦ Draft the fix
                </button>
              )}
            </footer>
          </>
        )}
      </section>
    </div>
  );
}
