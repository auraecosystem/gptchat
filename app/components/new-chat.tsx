import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Path } from "../constant";
import { useChatStore } from "../store";
import { TelloriaSidebar } from "./telloria-sidebar";
import { useMobileScreen } from "../utils";
import styles from "./new-chat.module.scss";

const CREATE_OPTIONS = [
  {
    id: "character",
    icon: "◉",
    eyebrow: "PERSONALITY",
    title: "Create a character",
    description: "Define a voice, opening line, avatar, and world lore.",
    action: "Open character studio",
  },
  {
    id: "scene",
    icon: "◇",
    eyebrow: "VISUAL STORY",
    title: "Create a scene",
    description:
      "Turn a conversation beat into an image or short visual moment.",
    action: "Open Scene",
  },
  {
    id: "import",
    icon: "⇧",
    eyebrow: "CHARACTER CARD",
    title: "Import a character",
    description:
      "Bring in a JSON or PNG character card and review it before saving.",
    action: "Choose a file",
  },
  {
    id: "blank",
    icon: "+",
    eyebrow: "OPEN CANVAS",
    title: "Start a blank chat",
    description: "Skip setup and begin with Telloria's default assistant.",
    action: "Start now",
  },
] as const;

export function NewChat() {
  const navigate = useNavigate();
  const chatStore = useChatStore();
  const isMobile = useMobileScreen();
  const fileInput = useRef<HTMLInputElement>(null);
  const [importedFile, setImportedFile] = useState("");

  const startBlank = () => {
    chatStore.newSession();
    navigate(Path.Chat);
  };

  const activate = (id: (typeof CREATE_OPTIONS)[number]["id"]) => {
    if (id === "character") return navigate(Path.Masks);
    if (id === "scene") return navigate(Path.Scene);
    if (id === "import") return fileInput.current?.click();
    startBlank();
  };

  return (
    <div className={styles.page}>
      {!isMobile && <TelloriaSidebar />}
      <main className={styles.main}>
        <header className={styles.header}>
          <button onClick={() => navigate(Path.Explore)}>←</button>
          <div>
            <span>CREATE</span>
            <h1>What will you bring to life?</h1>
            <p>Choose a starting point. You can refine every detail later.</p>
          </div>
        </header>

        {importedFile && (
          <section className={styles.importState} aria-live="polite">
            <span>✓</span>
            <div>
              <b>{importedFile}</b>
              <small>Ready to review in the character studio.</small>
            </div>
            <button onClick={() => navigate(Path.Masks)}>Review import</button>
          </section>
        )}

        <section className={styles.grid}>
          {CREATE_OPTIONS.map((option, index) => (
            <button
              key={option.id}
              className={styles.card}
              onClick={() => activate(option.id)}
            >
              <span className={styles.number}>0{index + 1}</span>
              <span className={styles.icon}>{option.icon}</span>
              <small>{option.eyebrow}</small>
              <h2>{option.title}</h2>
              <p>{option.description}</p>
              <strong>{option.action} →</strong>
            </button>
          ))}
        </section>

        <input
          ref={fileInput}
          className={styles.fileInput}
          type="file"
          accept=".json,.png,application/json,image/png"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) setImportedFile(file.name);
          }}
        />
      </main>
    </div>
  );
}
