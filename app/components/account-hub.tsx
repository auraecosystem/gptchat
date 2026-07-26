import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { useLocation, useNavigate } from "react-router-dom";
import { Path } from "../constant";
import { listHistoryCharacters } from "../data/scene-chat";
import { useMobileScreen } from "../utils";
import { TelloriaSidebar } from "./telloria-sidebar";
import styles from "./account-hub.module.scss";

const DIRECT_MESSAGES = [
  {
    id: "nora",
    name: "Nora",
    avatar: "N",
    preview: "That remix was beautiful. Can I feature it?",
    time: "9m",
    unread: 2,
  },
  {
    id: "lace",
    name: "Lace Story",
    avatar: "L",
    preview: "I left notes on the rooftop scene.",
    time: "3h",
    unread: 0,
  },
  {
    id: "aiko",
    name: "Aiko Frames",
    avatar: "A",
    preview: "The new character card is ready.",
    time: "1d",
    unread: 0,
  },
];

function AccountShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const isMobile = useMobileScreen();
  return (
    <div className={styles.page}>
      {!isMobile && <TelloriaSidebar />}
      <main className={styles.main}>
        <header className={styles.header}>
          {isMobile && (
            <button onClick={() => navigate(Path.Profile)}>←</button>
          )}
          <div>
            <span>ACCOUNT</span>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}

function InboxPage() {
  const navigate = useNavigate();
  const chats = useMemo(() => listHistoryCharacters(), []);
  const [tab, setTab] = useState<"chats" | "messages">("chats");
  const [query, setQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(DIRECT_MESSAGES[0].id);
  const [draft, setDraft] = useState("");
  const [sent, setSent] = useState<string[]>([]);

  const filteredChats = chats.filter((chat) =>
    `${chat.name} ${chat.creator}`.toLowerCase().includes(query.toLowerCase()),
  );
  const filteredMessages = DIRECT_MESSAGES.filter((message) =>
    `${message.name} ${message.preview}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const selected =
    DIRECT_MESSAGES.find((message) => message.id === selectedMessage) ??
    DIRECT_MESSAGES[0];

  const send = () => {
    const value = draft.trim();
    if (!value) return;
    setSent((messages) => [...messages, value]);
    setDraft("");
  };

  return (
    <AccountShell
      title="Inbox"
      subtitle="Character chats and creator messages in one place."
    >
      <div
        className={styles.inboxTabs}
        role="tablist"
        aria-label="Inbox sections"
      >
        <button
          role="tab"
          aria-selected={tab === "chats"}
          className={clsx({ [styles.active]: tab === "chats" })}
          onClick={() => setTab("chats")}
        >
          Chats
        </button>
        <button
          role="tab"
          aria-selected={tab === "messages"}
          className={clsx({ [styles.active]: tab === "messages" })}
          onClick={() => setTab("messages")}
        >
          Messages
          <span>
            {DIRECT_MESSAGES.reduce((sum, message) => sum + message.unread, 0)}
          </span>
        </button>
      </div>

      <label className={styles.search}>
        <span>⌕</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={tab === "chats" ? "Search chats" : "Search messages"}
        />
      </label>

      {tab === "chats" ? (
        <section className={styles.chatList}>
          {filteredChats.map((chat, index) => (
            <button
              key={chat.id}
              onClick={() => navigate(`${Path.SceneChat}/${chat.id}`)}
            >
              <img src={chat.avatar} alt="" />
              <span>
                <b>{chat.name}</b>
                <small>
                  {index === 0
                    ? "We paused right before the reveal…"
                    : chat.openingLine}
                </small>
              </span>
              <span className={styles.chatMeta}>
                <small>{index + 2}h</small>
                {index < 2 && <b>{index + 1}</b>}
              </span>
            </button>
          ))}
        </section>
      ) : (
        <section className={styles.messageLayout}>
          <div className={styles.messageList}>
            {filteredMessages.map((message) => (
              <button
                key={message.id}
                className={clsx({
                  [styles.active]: selected.id === message.id,
                })}
                onClick={() => setSelectedMessage(message.id)}
              >
                <span className={styles.messageAvatar}>{message.avatar}</span>
                <span>
                  <b>{message.name}</b>
                  <small>{message.preview}</small>
                </span>
                <em>{message.time}</em>
              </button>
            ))}
          </div>
          <div className={styles.conversation}>
            <header>
              <span className={styles.messageAvatar}>{selected.avatar}</span>
              <div>
                <b>{selected.name}</b>
                <small>Creator</small>
              </div>
            </header>
            <div className={styles.messages}>
              <p>{selected.preview}</p>
              <p className={styles.mine}>
                Absolutely—please credit the original character.
              </p>
              {sent.map((message, index) => (
                <p key={`${message}-${index}`} className={styles.mine}>
                  {message}
                </p>
              ))}
            </div>
            <footer>
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") send();
                }}
                placeholder={`Message ${selected.name}`}
              />
              <button onClick={send}>Send</button>
            </footer>
          </div>
        </section>
      )}
    </AccountShell>
  );
}

const MODEL_NAMES = [
  "Telloria Fast",
  "Telloria Story",
  "GPT",
  "Claude",
  "Gemini",
];

function MembershipPage() {
  const navigate = useNavigate();
  return (
    <AccountShell
      title="Membership"
      subtitle="Your plan, credits, limits, and unlocked models."
    >
      <section className={styles.membershipCard}>
        <div className={styles.planIdentity}>
          <span>♛</span>
          <div>
            <small>CURRENT PLAN</small>
            <h2>Free</h2>
            <p>Upgrade anytime. Your local stories stay yours.</p>
          </div>
          <button onClick={() => navigate(Path.Subscribe)}>
            Compare plans
          </button>
        </div>
        <div className={styles.membershipGrid}>
          <button
            className={styles.creditTile}
            onClick={() => navigate(Path.Credits)}
          >
            <span aria-hidden="true">✦</span>
            <strong>
              36 <small>/ 100</small>
            </strong>
            <p>Daily credits</p>
            <i>
              <span style={{ width: "36%" }} />
            </i>
            <b>View credits →</b>
          </button>
          <div className={styles.limitTiles}>
            <div>
              <strong>5</strong>
              <span>Images / day</span>
            </div>
            <div>
              <strong>0</strong>
              <span>Videos / day</span>
            </div>
            <div>
              <strong>5</strong>
              <span>Voice / day</span>
            </div>
            <div>
              <strong>3</strong>
              <span>Characters</span>
            </div>
          </div>
        </div>
        <div className={styles.models}>
          <small>AVAILABLE MODELS</small>
          <div>
            {MODEL_NAMES.map((name, index) => (
              <span key={name} className={clsx({ [styles.locked]: index > 1 })}>
                {index > 1 ? "◇ " : "✓ "}
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.upgradeCard}>
        <div>
          <small>RECOMMENDED</small>
          <h2>Go Tale+ Pro</h2>
          <p>More memory, premium models, voice, images, and no ads.</p>
        </div>
        <ul>
          <li>100 daily credits</li>
          <li>Extended memory</li>
          <li>Premium models</li>
          <li>30 image generations</li>
        </ul>
        <button onClick={() => navigate(Path.Subscribe)}>
          Explore Tale+ →
        </button>
      </section>
    </AccountShell>
  );
}

const CREDIT_PACKS = [
  { credits: 100, price: "$2.99" },
  { credits: 500, price: "$9.99", popular: true },
  { credits: 1200, price: "$19.99" },
];

function CreditsPage() {
  const [balance, setBalance] = useState(36);
  const [notice, setNotice] = useState("");

  const previewPurchase = (credits: number) => {
    setBalance((value) => value + credits);
    setNotice(`${credits} preview credits added locally. No payment was made.`);
  };

  return (
    <AccountShell
      title="Credits"
      subtitle="Track usage and preview optional credit packs."
    >
      <section className={styles.balanceCard}>
        <small>AVAILABLE BALANCE</small>
        <h2>
          <span aria-hidden="true">✦</span> {balance}
        </h2>
        <p>
          Daily credits refill automatically. Preview packs remain on this
          device.
        </p>
      </section>
      {notice && (
        <div className={styles.notice} role="status">
          {notice}
        </div>
      )}
      <section className={styles.creditPacks}>
        {CREDIT_PACKS.map((pack) => (
          <article
            key={pack.credits}
            className={clsx({ [styles.popular]: pack.popular })}
          >
            {pack.popular && <small>MOST POPULAR</small>}
            <h2>{pack.credits}</h2>
            <p>credits</p>
            <strong>{pack.price}</strong>
            <button onClick={() => previewPurchase(pack.credits)}>
              Preview purchase
            </button>
          </article>
        ))}
      </section>
      <section className={styles.history}>
        <h2>Recent activity</h2>
        <div>
          <span>Character message</span>
          <b>−1</b>
        </div>
        <div>
          <span>Daily refill</span>
          <b className={styles.positive}>+100</b>
        </div>
        <div>
          <span>Image generation</span>
          <b>−5</b>
        </div>
      </section>
    </AccountShell>
  );
}

type Preferences = {
  language: string;
  autoplay: boolean;
  reducedMotion: boolean;
  matureContent: boolean;
  notifications: boolean;
};

const DEFAULT_PREFERENCES: Preferences = {
  language: "English",
  autoplay: false,
  reducedMotion: false,
  matureContent: false,
  notifications: true,
};

function SettingsPage() {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const value = window.localStorage.getItem("telloria-web-preferences");
      if (value) setPreferences(JSON.parse(value) as Preferences);
    } catch {
      setPreferences(DEFAULT_PREFERENCES);
    }
  }, []);

  const update = <K extends keyof Preferences>(
    key: K,
    value: Preferences[K],
  ) => {
    setSaved(false);
    setPreferences((current) => ({ ...current, [key]: value }));
  };

  const save = () => {
    window.localStorage.setItem(
      "telloria-web-preferences",
      JSON.stringify(preferences),
    );
    setSaved(true);
  };

  return (
    <AccountShell
      title="Settings"
      subtitle="Account, content, accessibility, and model preferences."
    >
      <div className={styles.settingsLayout}>
        <section className={styles.settingsGroup}>
          <small>GENERAL</small>
          <label>
            <span>
              <b>Language</b>
              <small>Telloria interface language</small>
            </span>
            <select
              value={preferences.language}
              onChange={(event) => update("language", event.target.value)}
            >
              <option>English</option>
              <option>简体中文</option>
              <option>日本語</option>
              <option>한국어</option>
            </select>
          </label>
          <Toggle
            label="Auto-play voice"
            hint="Play character voice responses automatically"
            checked={preferences.autoplay}
            onChange={(value) => update("autoplay", value)}
          />
          <Toggle
            label="Reduce motion"
            hint="Limit non-essential interface animation"
            checked={preferences.reducedMotion}
            onChange={(value) => update("reducedMotion", value)}
          />
        </section>
        <section className={styles.settingsGroup}>
          <small>PRIVACY & CONTENT</small>
          <Toggle
            label="Notifications"
            hint="Show local updates and message badges"
            checked={preferences.notifications}
            onChange={(value) => update("notifications", value)}
          />
          <Toggle
            label="Mature content"
            hint="Allow mature public content in discovery"
            checked={preferences.matureContent}
            onChange={(value) => update("matureContent", value)}
          />
        </section>
        <section className={styles.settingsGroup}>
          <small>MODEL & DATA</small>
          <button
            className={styles.settingsLink}
            onClick={() => navigate(Path.AdvancedSettings)}
          >
            <span>
              <b>Advanced model settings</b>
              <small>Providers, models, sync, and local data</small>
            </span>
            <em>→</em>
          </button>
          <button
            className={styles.settingsLink}
            onClick={() => navigate(Path.Membership)}
          >
            <span>
              <b>Membership & usage</b>
              <small>Plan capabilities and credits</small>
            </span>
            <em>→</em>
          </button>
        </section>
        <button className={styles.saveSettings} onClick={save}>
          {saved ? "Saved" : "Save preferences"}
        </button>
      </div>
    </AccountShell>
  );
}

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label>
      <span>
        <b>{label}</b>
        <small>{hint}</small>
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={clsx(styles.switch, { [styles.on]: checked })}
        onClick={() => onChange(!checked)}
      >
        <span />
      </button>
    </label>
  );
}

export function AccountHubPage() {
  const location = useLocation();
  if (location.pathname === Path.Inbox) return <InboxPage />;
  if (location.pathname === Path.Membership) return <MembershipPage />;
  if (location.pathname === Path.Credits) return <CreditsPage />;
  return <SettingsPage />;
}
