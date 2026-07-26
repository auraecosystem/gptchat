import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";

import { Path } from "../constant";
import { useMobileScreen } from "../utils";
import { showToast } from "./ui-lib";
import { TelloriaSidebar } from "./telloria-sidebar";
import { LoreBadge, LorebookViewer, LoreFixModal } from "./lorebook";
import { readEffectiveLorebookEntries } from "../data/lorebook";
import styles from "./scene-chat.module.scss";
import {
  type ChatMessage,
  type ChatMode,
  type MessageType,
  CHARACTER_DIRECTORY,
  SMART_REPLY_CANDIDATES,
  buildContinueText,
  buildGeneratedImageUrl,
  buildInitialMessages,
  getCharacterById,
  listHistoryCharacters,
} from "../data/scene-chat";

type BottomTab = "home" | "scene" | "create" | "chats" | "profile";

const BOTTOM_TABS: { key: BottomTab; label: string; icon: string }[] = [
  { key: "home", label: "Home", icon: "⌂" },
  { key: "scene", label: "Scene", icon: "◈" },
  { key: "create", label: "Create", icon: "+" },
  { key: "profile", label: "Profile", icon: "◯" },
  { key: "chats", label: "Chats", icon: "◌" },
];

function createMessage(
  role: "assistant" | "user",
  type: MessageType,
  content: string,
  imageUrl?: string,
): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    role,
    type,
    content,
    imageUrl,
    liked: null,
  };
}

function parseCharacterId(pathname: string): string {
  const prefix = `${Path.SceneChat}/`;
  if (!pathname.startsWith(prefix)) {
    return "";
  }
  const value = pathname.slice(prefix.length).split("/")[0];
  return decodeURIComponent(value || "");
}

export function SceneChatPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMobileScreen();

  const chatCharacters = useMemo(() => listHistoryCharacters(), []);
  const activeCharacterId = useMemo(
    () => parseCharacterId(location.pathname),
    [location.pathname],
  );
  const character = useMemo(
    () => getCharacterById(activeCharacterId),
    [activeCharacterId],
  );

  const [activeTab, setActiveTab] = useState<BottomTab>("scene");
  const [chatMode, setChatMode] = useState<ChatMode>("regular");
  const [inputValue, setInputValue] = useState("");
  const [followed, setFollowed] = useState(false);
  const [showSmartReplies, setShowSmartReplies] = useState(false);
  const [autoPlayVoice, setAutoPlayVoice] = useState(false);
  const [personaEnabled, setPersonaEnabled] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(!isMobile);
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [turn, setTurn] = useState(0);
  const [showLorebook, setShowLorebook] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [loreCount, setLoreCount] = useState(0);
  const [fixingMessage, setFixingMessage] = useState<ChatMessage | null>(null);

  const messageEndRef = useRef<HTMLDivElement>(null);

  const hasHistory = useMemo(
    () => chatCharacters.some((item) => item.id === character.id),
    [character.id, chatCharacters],
  );

  useEffect(() => {
    const initial = buildInitialMessages(character, hasHistory);
    setMessages(initial);
    setTurn(initial.length);
    setInputValue("");
    setShowSmartReplies(false);
  }, [character, hasHistory]);

  useEffect(() => {
    setLoreCount(
      readEffectiveLorebookEntries(
        character.id,
        character.name,
        CHARACTER_DIRECTORY,
      ).length,
    );
  }, [character.id, character.name, showLorebook]);

  useEffect(() => {
    if (!isMobile || !window.visualViewport) return;
    const viewport = window.visualViewport;
    const syncComposer = () => {
      const keyboardOffset = Math.max(
        0,
        window.innerHeight - viewport.height - viewport.offsetTop,
      );
      document.documentElement.style.setProperty(
        "--telloria-keyboard-offset",
        `${keyboardOffset}px`,
      );
    };
    syncComposer();
    viewport.addEventListener("resize", syncComposer);
    viewport.addEventListener("scroll", syncComposer);
    return () => {
      viewport.removeEventListener("resize", syncComposer);
      viewport.removeEventListener("scroll", syncComposer);
      document.documentElement.style.removeProperty(
        "--telloria-keyboard-offset",
      );
    };
  }, [isMobile]);

  useEffect(() => {
    setRightSidebarOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  const onBottomTabClick = (tab: BottomTab) => {
    setActiveTab(tab);
    if (tab === "home") {
      navigate(Path.Home);
      return;
    }
    if (tab === "scene") {
      navigate(Path.Scene);
      return;
    }
    if (tab === "create") {
      navigate(Path.NewChat);
      return;
    }
    if (tab === "profile") {
      navigate(Path.Profile);
      return;
    }
    if (tab === "chats") {
      navigate(`${Path.SceneChat}/${character.id}`);
      return;
    }
  };

  const pushAssistantMessage = (content: string) => {
    setMessages((prev) => [
      ...prev,
      createMessage("assistant", "text", content),
    ]);
    setTurn((prev) => prev + 1);
  };

  const onContinue = () => {
    pushAssistantMessage(buildContinueText(character, chatMode, turn));
  };

  const onGenerateImage = () => {
    const imageUrl = buildGeneratedImageUrl(character, turn);
    const content = `${character.name}: Generated an image from this moment.`;
    setMessages((prev) => [
      ...prev,
      createMessage("assistant", "image", content, imageUrl),
    ]);
    setTurn((prev) => prev + 1);
  };

  const onSend = () => {
    const payload = inputValue.trim();
    if (!payload) return;

    setMessages((prev) => [
      ...prev,
      createMessage("user", "text", payload),
      createMessage(
        "assistant",
        "text",
        buildContinueText(character, chatMode, turn + 1),
      ),
    ]);
    setInputValue("");
    setTurn((prev) => prev + 2);
  };

  const onSendImageFromComposer = () => {
    const imageUrl = buildGeneratedImageUrl(character, turn + 2);
    setMessages((prev) => [
      ...prev,
      createMessage("user", "image", "[User sent an image]", imageUrl),
      createMessage(
        "assistant",
        "text",
        `${character.name}: I can use this image as context. Want me to continue this plot from here?`,
      ),
    ]);
    setTurn((prev) => prev + 2);
  };

  const setMessageFeedback = (messageId: string, liked: boolean | null) => {
    setMessages((prev) =>
      prev.map((item) => (item.id === messageId ? { ...item, liked } : item)),
    );
  };

  const regenerateMessage = (messageId: string) => {
    setMessages((prev) =>
      prev.map((item) => {
        if (item.id !== messageId) return item;
        if (item.role !== "assistant") return item;

        if (item.type === "image") {
          const nextImage = buildGeneratedImageUrl(character, turn + 3);
          return {
            ...item,
            imageUrl: nextImage,
            content: `${character.name}: Regenerated a fresh image variation.`,
            liked: null,
          };
        }

        return {
          ...item,
          content: buildContinueText(character, chatMode, turn + 3),
          liked: null,
        };
      }),
    );
    setTurn((prev) => prev + 1);
  };

  const shareMessage = (messageId: string) => {
    const target = messages.find((item) => item.id === messageId);
    if (!target) return;
    showToast(
      target.type === "image"
        ? "Image copied for sharing."
        : "Message copied for sharing.",
    );
  };

  const restartChat = () => {
    const initial = buildInitialMessages(character, false);
    setMessages(initial);
    setTurn(initial.length);
    showToast("Chat restarted.");
  };

  const clearHistory = () => {
    const opening = buildInitialMessages(character, false).slice(0, 1);
    setMessages(opening);
    setTurn(opening.length);
    showToast("Chat history cleared.");
  };

  const settingsPanel = (
    <div className={styles["settings-panel"]}>
      <div className={styles["settings-hero"]}>
        <img src={character.cover} alt={character.name} />
        <div className={styles["settings-hero-mask"]} />
        <div className={styles["settings-hero-info"]}>
          <h3>{character.name}</h3>
          <p>
            {character.followers} followers | {character.creator}
          </p>
        </div>
      </div>

      <div className={styles["settings-group"]}>
        <h4>General</h4>
        <div className={styles["mode-row"]}>
          {(
            [
              ["regular", "Regular"],
              ["romantic", "Romantic"],
              ["prolong", "Prolong"],
            ] as [ChatMode, string][]
          ).map(([mode, label]) => (
            <button
              key={mode}
              className={clsx(styles["mode-chip"], {
                [styles.active]: chatMode === mode,
              })}
              onClick={() => setChatMode(mode)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles["settings-group"]}>
        <h4>Character</h4>
        <button
          className={styles["settings-item"]}
          onClick={() => navigate(`${Path.Character}/${character.id}`)}
        >
          <span>View Profile</span>
          <small>›</small>
        </button>
        <button
          className={styles["settings-item"]}
          onClick={() => setShowLorebook(true)}
        >
          <span>World lore</span>
          <small>{loreCount} entries</small>
        </button>
        <button
          className={styles["settings-item"]}
          onClick={() => setPersonaEnabled((prev) => !prev)}
        >
          <span>Persona</span>
          <small>{personaEnabled ? "On" : "Off"}</small>
        </button>
      </div>

      <div className={styles["settings-group"]}>
        <h4>Chat</h4>
        <button className={styles["settings-item"]} onClick={restartChat}>
          <span>Restart chat</span>
          <small>›</small>
        </button>
        <button className={styles["settings-item"]} onClick={clearHistory}>
          <span>Clear history</span>
          <small>›</small>
        </button>
        <button
          className={styles["settings-item"]}
          onClick={() => setAutoPlayVoice((prev) => !prev)}
        >
          <span>Auto-play voice</span>
          <small>{autoPlayVoice ? "On" : "Off"}</small>
        </button>
        <button
          className={styles["settings-item"]}
          onClick={() => showToast("Background settings coming soon.")}
        >
          <span>Background setting</span>
          <small>›</small>
        </button>
        <button
          className={styles["settings-item"]}
          onClick={() => showToast("Thanks, report submitted.")}
        >
          <span>Report</span>
          <small>›</small>
        </button>
      </div>
    </div>
  );

  return (
    <div className={styles.page}>
      {!isMobile && <TelloriaSidebar />}

      <section className={styles.center}>
        <header className={styles.topbar}>
          {isMobile ? (
            <button
              className={styles["mobile-back"]}
              onClick={() => navigate(Path.Scene)}
            >
              ←
            </button>
          ) : null}

          <div className={styles["topbar-left"]}>
            <img src={character.avatar} alt={character.name} />
            <div>
              <h2>{character.name}</h2>
              <p>By {character.creator}</p>
            </div>
          </div>

          <div className={styles["topbar-actions"]}>
            <LoreBadge
              count={loreCount}
              onClick={() => setShowLorebook(true)}
            />
            <button
              className={clsx(styles["action-btn"], {
                [styles.followed]: followed,
              })}
              onClick={() => setFollowed((prev) => !prev)}
            >
              {followed ? "Following" : "Follow"}
            </button>
            <button
              className={styles["action-btn"]}
              onClick={() => showToast("Share link copied.")}
            >
              Share
            </button>
            {isMobile ? (
              <button
                className={styles["action-btn"]}
                onClick={() => setMobileSettingsOpen(true)}
              >
                ⋯
              </button>
            ) : (
              <button
                className={styles["action-btn"]}
                onClick={() => setRightSidebarOpen((prev) => !prev)}
              >
                {rightSidebarOpen ? "Hide" : "Show"}
              </button>
            )}
          </div>
        </header>

        <div className={styles.thread}>
          <div className={styles["character-card"]}>
            <img src={character.avatar} alt={character.name} />
            <h3>{character.name}</h3>
            <p>By {character.creator}</p>
            <small>{character.summary}</small>
          </div>

          {messages.map((message) => (
            <article key={message.id} className={styles["message-wrap"]}>
              <div className={styles["message-meta"]}>
                <b>{message.role === "assistant" ? character.name : "You"}</b>
                <span>{message.role === "assistant" ? "c.ai" : "user"}</span>
              </div>

              <div
                className={clsx(styles.message, {
                  [styles.assistant]: message.role === "assistant",
                  [styles.user]: message.role === "user",
                })}
              >
                {message.type === "image" ? (
                  <div className={styles["image-message"]}>
                    {message.imageUrl && (
                      <img src={message.imageUrl} alt={message.content} />
                    )}
                    <p>{message.content}</p>
                  </div>
                ) : (
                  <p>{message.content}</p>
                )}
              </div>

              <div className={styles["message-actions"]}>
                <button onClick={() => regenerateMessage(message.id)}>↻</button>
                {message.role === "assistant" && message.type === "text" && (
                  <button
                    aria-label="Fix this in world lore"
                    title="Fix this in world lore"
                    onClick={() => setFixingMessage(message)}
                  >
                    ▤
                  </button>
                )}
                <button
                  className={clsx({ [styles.active]: message.liked === true })}
                  onClick={() =>
                    setMessageFeedback(
                      message.id,
                      message.liked === true ? null : true,
                    )
                  }
                >
                  👍
                </button>
                <button
                  className={clsx({ [styles.active]: message.liked === false })}
                  onClick={() =>
                    setMessageFeedback(
                      message.id,
                      message.liked === false ? null : false,
                    )
                  }
                >
                  👎
                </button>
                <button onClick={() => shareMessage(message.id)}>⤴</button>
              </div>
            </article>
          ))}

          <div className={styles["dialog-actions"]}>
            <button onClick={onContinue}>▶ Continue</button>
            <button onClick={onGenerateImage}>🖼 Image</button>
          </div>

          <div ref={messageEndRef} />
        </div>

        <footer className={styles.composer}>
          {showSmartReplies && (
            <div className={styles["smart-row"]}>
              {SMART_REPLY_CANDIDATES.map((reply) => (
                <button
                  key={reply}
                  onClick={() => {
                    setInputValue(reply);
                    setShowSmartReplies(false);
                  }}
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          <div className={styles["composer-row"]}>
            <input
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder={`Message ${character.name}...`}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  onSend();
                }
              }}
            />
            <button
              aria-label="Smart replies"
              title="Smart replies"
              onClick={() => setShowSmartReplies((prev) => !prev)}
            >
              ✦
            </button>
            <button
              aria-label="Attach image"
              title="Attach image"
              onClick={onSendImageFromComposer}
            >
              ＋
            </button>
            <button
              aria-label={
                isRecording ? "Stop voice input" : "Start voice input"
              }
              title={isRecording ? "Stop voice input" : "Start voice input"}
              className={clsx({ [styles.recording]: isRecording })}
              onClick={() => setIsRecording((value) => !value)}
            >
              {isRecording ? "■" : "◉"}
            </button>
            <button className={styles["send-btn"]} onClick={onSend}>
              ➤
            </button>
          </div>

          <div className={styles.disclaimer}>
            This is A.I. and not a real person. Treat everything it says as
            fiction.
          </div>
        </footer>
      </section>

      {!isMobile && rightSidebarOpen && (
        <aside className={styles.right}>{settingsPanel}</aside>
      )}

      {isMobile && (
        <>
          <div
            className={clsx(styles["mobile-settings-overlay"], {
              [styles.open]: mobileSettingsOpen,
            })}
            onClick={() => setMobileSettingsOpen(false)}
          >
            <div
              className={styles["mobile-settings-drawer"]}
              onClick={(event) => event.stopPropagation()}
            >
              {settingsPanel}
            </div>
          </div>
        </>
      )}

      {showLorebook && (
        <LorebookViewer
          characterId={character.id}
          onClose={() => setShowLorebook(false)}
        />
      )}

      {fixingMessage && (
        <LoreFixModal
          characterId={character.id}
          characterName={character.name}
          message={fixingMessage.content}
          onClose={() => setFixingMessage(null)}
          onSaved={() =>
            setLoreCount(
              readEffectiveLorebookEntries(
                character.id,
                character.name,
                CHARACTER_DIRECTORY,
              ).length,
            )
          }
        />
      )}
    </div>
  );
}
