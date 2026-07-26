import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { useLocation, useNavigate } from "react-router-dom";
import { Path } from "../constant";
import { getCharacterById } from "../data/scene-chat";
import { useMobileScreen } from "../utils";
import {
  TelloriaNavIcon,
  TelloriaSidebar,
  type TelloriaNavIconName,
} from "./telloria-sidebar";
import styles from "./parity-hub.module.scss";

type Game = {
  id: string;
  icon: string;
  title: string;
  description: string;
  players: string;
  prompt: string;
};

const GAMES: Game[] = [
  {
    id: "turtle-soup",
    icon: "🥣",
    title: "Turtle Soup",
    description: "Solve an impossible story with yes-or-no questions.",
    players: "2–8 players",
    prompt:
      "A traveler enters a restaurant, tastes one spoonful of soup, and starts crying.",
  },
  {
    id: "undercover",
    icon: "🕵️",
    title: "Undercover",
    description: "Find the player whose secret word does not belong.",
    players: "4–10 players",
    prompt:
      "Describe your word without saying it. One player received a different clue.",
  },
  {
    id: "truth-dare",
    icon: "🎲",
    title: "Truth or Dare",
    description: "A playful AI host keeps every round moving.",
    players: "2–8 players",
    prompt:
      "Choose truth or dare. Telloria will tune the next challenge to your group.",
  },
  {
    id: "dnd",
    icon: "🐉",
    title: "D&D Adventure",
    description: "Build a party and enter a living campaign.",
    players: "1–6 players",
    prompt:
      "The last lantern in the city just went dark. Your party hears wings overhead.",
  },
  {
    id: "detective",
    icon: "🔎",
    title: "Detective Files",
    description: "Interrogate suspects and connect the evidence.",
    players: "1–5 players",
    prompt:
      "The gallery alarm never sounded, yet the painting vanished during a locked-room gala.",
  },
  {
    id: "pictionary",
    icon: "🎨",
    title: "AI Pictionary",
    description: "Describe, guess, and race the image clock.",
    players: "2–8 players",
    prompt:
      "A new visual clue is ready. You have sixty seconds to guess the hidden phrase.",
  },
];

type Rarity = "UR" | "SSR" | "SR" | "R";

type GachaItem = {
  id: string;
  title: string;
  character: string;
  rarity: Rarity;
  image: string;
};

const GACHA_ITEMS: GachaItem[] = [
  {
    id: "moonlit-miko",
    title: "Moonlit Promise",
    character: "Miko",
    rarity: "UR",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "neon-taehyung",
    title: "After Midnight",
    character: "Kim Taehyung",
    rarity: "SSR",
    image:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "academy-koharu",
    title: "Unsent Letter",
    character: "Koharu",
    rarity: "SR",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "rooftop-jake",
    title: "Rooftop Bet",
    character: "Jake",
    rarity: "R",
    image:
      "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=900&q=85",
  },
];

const ACTIVITIES = [
  {
    id: "publish",
    actor: "Nora",
    avatar: "N",
    text: "published a new character",
    title: "The Timekeeper",
    time: "12 min",
    target: Path.Explore,
    scope: "following",
  },
  {
    id: "remix",
    actor: "Lace Story",
    avatar: "L",
    text: "remixed your scene",
    title: "The rooftop bet now starts in a thunderstorm",
    time: "48 min",
    target: Path.Scene,
    scope: "mentions",
  },
  {
    id: "collection",
    actor: "Telloria Studio",
    avatar: "T",
    text: "added a scene to the featured collection",
    title: "A quiet station and one missed train",
    time: "2 hr",
    target: Path.Scene,
    scope: "following",
  },
  {
    id: "like",
    actor: "Aiko",
    avatar: "A",
    text: "liked your character",
    title: "Koharu",
    time: "5 hr",
    target: `${Path.Profile}/aiko`,
    scope: "mentions",
  },
];

const PUBLIC_HUBS: Record<
  string,
  {
    eyebrow: string;
    title: string;
    description: string;
    cards: { title: string; description: string; meta: string; target: Path }[];
  }
> = {
  [Path.Resources]: {
    eyebrow: "LEARN",
    title: "Resources",
    description:
      "Guides for creating, playing, and telling better living stories.",
    cards: [
      {
        title: "Creator guide",
        description:
          "Shape a strong opening, personality, and memorable voice.",
        meta: "8 min read",
        target: Path.NewChat,
      },
      {
        title: "Scene handbook",
        description: "Turn a conversation beat into a visual story moment.",
        meta: "6 min read",
        target: Path.Scene,
      },
      {
        title: "Safety & privacy",
        description: "Understand local data, sharing, and content controls.",
        meta: "4 min read",
        target: Path.Privacy,
      },
      {
        title: "Support",
        description:
          "Troubleshoot the web experience and find the right help channel.",
        meta: "Help center",
        target: Path.Support,
      },
      {
        title: "Download",
        description:
          "Install Telloria as a web app or add it to your device home screen.",
        meta: "Web app",
        target: Path.Download,
      },
    ],
  },
  [Path.Changelog]: {
    eyebrow: "WHAT'S NEW",
    title: "Telloria updates",
    description: "A running record of improvements to the web experience.",
    cards: [
      {
        title: "Cuddler parity foundation",
        description: "Explore, responsive cards, and unified navigation.",
        meta: "2026-07-26",
        target: Path.Explore,
      },
      {
        title: "Living scene conversations",
        description: "Scene chat, modes, image moments, and creator profiles.",
        meta: "2026-07-25",
        target: Path.Scene,
      },
      {
        title: "Tale+ membership",
        description: "A clearer membership and local credits preview.",
        meta: "2026-07-24",
        target: Path.Subscribe,
      },
    ],
  },
  [Path.Download]: {
    eyebrow: "TELLORIA EVERYWHERE",
    title: "Get the web app",
    description:
      "Install Telloria from your browser for a focused, app-like experience.",
    cards: [
      {
        title: "Install on desktop",
        description:
          "Use your browser's Install App action to open Telloria in its own window.",
        meta: "Chrome · Edge",
        target: Path.Explore,
      },
      {
        title: "Add to Home Screen",
        description:
          "Open the Share menu in Safari or Chrome and add Telloria to your home screen.",
        meta: "iOS · Android",
        target: Path.Explore,
      },
      {
        title: "Use in browser",
        description:
          "Nothing to install—your stories and preferences remain available locally.",
        meta: "Recommended",
        target: Path.Explore,
      },
    ],
  },
  [Path.Support]: {
    eyebrow: "HELP CENTER",
    title: "How can we help?",
    description: "Quick paths for common Telloria Web questions.",
    cards: [
      {
        title: "Chat and model setup",
        description:
          "Configure providers, models, access keys, and advanced generation behavior.",
        meta: "Configuration",
        target: Path.AdvancedSettings,
      },
      {
        title: "Account and membership",
        description:
          "Review local profile settings, plan capabilities, and preview credits.",
        meta: "Account",
        target: Path.Membership,
      },
      {
        title: "Safety and privacy",
        description:
          "Understand what stays local and which actions contact model providers.",
        meta: "Privacy",
        target: Path.Privacy,
      },
    ],
  },
};

const POLICY_CONTENT: Record<
  string,
  {
    eyebrow: string;
    title: string;
    updated: string;
    sections: { title: string; body: string }[];
  }
> = {
  [Path.Privacy]: {
    eyebrow: "LEGAL",
    title: "Privacy",
    updated: "Last updated July 26, 2026",
    sections: [
      {
        title: "Local-first data",
        body: "Telloria Web stores chats, lorebooks, preferences, preview credits, and simulated social state in your browser unless you explicitly configure a synchronization provider.",
      },
      {
        title: "Model providers",
        body: "When you send a model request, the message and required conversation context are transmitted to the provider you selected. Telloria does not route requests through Cuddler services.",
      },
      {
        title: "No Cuddler account coupling",
        body: "Telloria does not use Cuddler production cookies, accounts, payment systems, databases, or private APIs. The products share observable Web interaction patterns only.",
      },
      {
        title: "Your controls",
        body: "You can export or clear browser data from advanced settings. Browser storage, provider retention, and synchronization services remain subject to their own controls and policies.",
      },
    ],
  },
  [Path.Terms]: {
    eyebrow: "LEGAL",
    title: "Terms",
    updated: "Last updated July 26, 2026",
    sections: [
      {
        title: "Fictional experience",
        body: "Telloria characters are AI-generated fictional experiences, not real people or professional advisors. Outputs may be inaccurate or unexpected.",
      },
      {
        title: "Acceptable use",
        body: "Do not use Telloria to violate law, impersonate people deceptively, exploit minors, infringe rights, or distribute harmful or unauthorized material.",
      },
      {
        title: "Your content",
        body: "You remain responsible for prompts, imported character cards, world lore, and shared creations. Only publish material you have the right to use.",
      },
      {
        title: "Preview states",
        body: "Local memberships, credit purchases, follows, notifications, and messages in this parity build are product previews unless an action clearly identifies a connected service.",
      },
    ],
  },
};

function MobileNavigation() {
  const navigate = useNavigate();
  const items: { label: string; icon: TelloriaNavIconName; target: string }[] =
    [
      { label: "Explore", icon: "explore", target: Path.Explore },
      { label: "Scene", icon: "scene", target: Path.Scene },
      { label: "Create", icon: "create", target: Path.NewChat },
      { label: "Inbox", icon: "chats", target: Path.Inbox },
      { label: "Profile", icon: "profile", target: Path.Profile },
    ];

  return (
    <nav className={styles.mobileNav} aria-label="Primary navigation">
      {items.map((item) => (
        <button
          key={item.label}
          className={clsx({ [styles.createNav]: item.label === "Create" })}
          onClick={() => navigate(item.target)}
        >
          <TelloriaNavIcon name={item.icon} />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  const isMobile = useMobileScreen();
  return (
    <div className={styles.page}>
      {!isMobile && <TelloriaSidebar />}
      <main className={styles.main}>{children}</main>
      {isMobile && <MobileNavigation />}
    </div>
  );
}

function GamesPage() {
  const navigate = useNavigate();
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const activeGame = GAMES.find((game) => game.id === activeGameId) ?? null;

  useEffect(() => {
    setActiveGameId(window.localStorage.getItem("telloria-active-game"));
  }, []);

  const start = (game: Game) => {
    window.localStorage.setItem("telloria-active-game", game.id);
    setActiveGameId(game.id);
  };

  const leave = () => {
    window.localStorage.removeItem("telloria-active-game");
    setActiveGameId(null);
  };

  return (
    <PageShell>
      <header className={styles.header}>
        <span>PLAY TOGETHER</span>
        <h1>Game rooms</h1>
        <p>
          AI-hosted social games that start instantly and remember your room.
        </p>
      </header>

      {activeGame && (
        <section className={styles.room} aria-live="polite">
          <div className={styles.roomIcon}>{activeGame.icon}</div>
          <div>
            <small>ROOM IN PROGRESS</small>
            <h2>{activeGame.title}</h2>
            <p>{activeGame.prompt}</p>
          </div>
          <div className={styles.roomActions}>
            <button onClick={() => navigate(`${Path.SceneChat}/miko`)}>
              Continue room
            </button>
            <button onClick={leave}>Leave</button>
          </div>
        </section>
      )}

      <section className={styles.sectionHeading}>
        <div>
          <h2>{activeGame ? "Start another game" : "Choose a game"}</h2>
          <p>Your room stays on this device until you leave it.</p>
        </div>
      </section>

      <section className={styles.gameGrid}>
        {GAMES.map((game) => (
          <article key={game.id} className={styles.gameCard}>
            <div className={styles.gameIcon}>{game.icon}</div>
            <div>
              <small>{game.players}</small>
              <h2>{game.title}</h2>
              <p>{game.description}</p>
            </div>
            <button onClick={() => start(game)}>
              {activeGameId === game.id ? "Restart" : "Start game"} →
            </button>
          </article>
        ))}
      </section>
    </PageShell>
  );
}

function GachaPage() {
  const [tickets, setTickets] = useState(1);
  const [shards, setShards] = useState(240);
  const [collection, setCollection] = useState<GachaItem[]>([GACHA_ITEMS[2]]);
  const [reveal, setReveal] = useState<GachaItem | null>(null);
  const [showOdds, setShowOdds] = useState(false);
  const [claimed, setClaimed] = useState(false);

  const pull = () => {
    if (tickets > 0) {
      setTickets((value) => value - 1);
    } else if (shards >= 100) {
      setShards((value) => value - 100);
    } else {
      return;
    }
    const reward =
      GACHA_ITEMS[(collection.length + tickets + shards) % GACHA_ITEMS.length];
    setReveal(reward);
    setCollection((items) =>
      items.some((item) => item.id === reward.id) ? items : [reward, ...items],
    );
  };

  const claimDaily = () => {
    setTickets((value) => value + 1);
    setClaimed(true);
  };

  return (
    <PageShell>
      <header className={clsx(styles.header, styles.gachaHeader)}>
        <div>
          <span>COLLECT STORY MOMENTS</span>
          <h1>Gacha</h1>
          <p>Build an album from the moments and companions you discover.</p>
        </div>
        <div className={styles.wallet}>
          <b>🎟 {tickets}</b>
          <b>◆ {shards}</b>
          <button onClick={() => setShowOdds(true)}>ⓘ Odds</button>
        </div>
      </header>

      {!claimed && (
        <button className={styles.dailyTicket} onClick={claimDaily}>
          <span>🎁</span>
          <span>
            <b>Your daily free ticket is ready</b>
            <small>Claim once per day on this device</small>
          </span>
          <strong>Claim</strong>
        </button>
      )}

      <section className={styles.banner}>
        <div>
          <small>STANDARD BANNER</small>
          <h2>Story Moments</h2>
          <p>Every reveal becomes part of your local collection.</p>
        </div>
        <button onClick={pull} disabled={tickets === 0 && shards < 100}>
          {tickets > 0 ? "Use 1 ticket" : "Use 100 shards"}
        </button>
      </section>

      <section className={styles.sectionHeading}>
        <div>
          <h2>Your album</h2>
          <p>
            {collection.length} of {GACHA_ITEMS.length} moments discovered
          </p>
        </div>
        <div className={styles.rarityChips}>
          {(["UR", "SSR", "SR", "R"] as Rarity[]).map((rarity) => (
            <span key={rarity}>
              {rarity} ·{" "}
              {collection.filter((item) => item.rarity === rarity).length}
            </span>
          ))}
        </div>
      </section>

      <section className={styles.albumGrid}>
        {GACHA_ITEMS.map((item) => {
          const owned = collection.some((entry) => entry.id === item.id);
          return (
            <article
              key={item.id}
              className={clsx(styles.albumCard, { [styles.locked]: !owned })}
            >
              <img
                src={item.image}
                alt={owned ? item.title : "Undiscovered story moment"}
              />
              <span>{item.rarity}</span>
              <div>
                <h2>{owned ? item.title : "Undiscovered"}</h2>
                <p>
                  {owned ? item.character : "Reveal this moment to unlock it"}
                </p>
              </div>
            </article>
          );
        })}
      </section>

      {showOdds && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setShowOdds(false)}
        >
          <section
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="odds-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className={styles.modalClose}
              onClick={() => setShowOdds(false)}
            >
              ×
            </button>
            <h2 id="odds-title">Reveal probability</h2>
            <p>
              Every pull is independent. Duplicate moments remain in your
              history.
            </p>
            <dl>
              <div>
                <dt>UR</dt>
                <dd>3%</dd>
              </div>
              <div>
                <dt>SSR</dt>
                <dd>12%</dd>
              </div>
              <div>
                <dt>SR</dt>
                <dd>30%</dd>
              </div>
              <div>
                <dt>R</dt>
                <dd>55%</dd>
              </div>
            </dl>
          </section>
        </div>
      )}

      {reveal && (
        <div className={styles.modalBackdrop}>
          <section
            className={clsx(styles.modal, styles.revealModal)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="reveal-title"
          >
            <small>NEW REVEAL · {reveal.rarity}</small>
            <img src={reveal.image} alt={reveal.title} />
            <h2 id="reveal-title">{reveal.title}</h2>
            <p>{reveal.character}</p>
            <button
              className={styles.primaryButton}
              onClick={() => setReveal(null)}
            >
              Add to album
            </button>
          </section>
        </div>
      )}
    </PageShell>
  );
}

function ActivityPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"all" | "following" | "mentions">("all");
  const [read, setRead] = useState<string[]>([]);
  const visible = ACTIVITIES.filter(
    (item) => tab === "all" || item.scope === tab,
  );

  const openActivity = (id: string, target: string) => {
    setRead((items) => (items.includes(id) ? items : [...items, id]));
    navigate(target);
  };

  return (
    <PageShell>
      <header className={styles.header}>
        <span>COMMUNITY</span>
        <h1>Activity</h1>
        <p>
          New stories, remixes, reactions, and creators from across Telloria.
        </p>
      </header>

      <div className={styles.tabs} role="tablist" aria-label="Activity filters">
        {(["all", "following", "mentions"] as const).map((item) => (
          <button
            key={item}
            role="tab"
            aria-selected={tab === item}
            className={clsx({ [styles.active]: tab === item })}
            onClick={() => setTab(item)}
          >
            {item[0].toUpperCase() + item.slice(1)}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <section className={styles.emptyState}>
          <span>✦</span>
          <h2>Nothing new yet</h2>
          <p>Follow creators or publish a story to build your activity feed.</p>
          <button onClick={() => navigate(Path.Explore)}>
            Explore creators
          </button>
        </section>
      ) : (
        <section className={styles.activityList}>
          {visible.map((item) => (
            <button
              key={item.id}
              className={clsx(styles.activityItem, {
                [styles.read]: read.includes(item.id),
              })}
              onClick={() => openActivity(item.id, item.target)}
            >
              <span className={styles.activityAvatar}>{item.avatar}</span>
              <span>
                <b>{item.actor}</b> {item.text}
                <strong>{item.title}</strong>
              </span>
              <small>{item.time}</small>
            </button>
          ))}
        </section>
      )}
    </PageShell>
  );
}

function PublicHubPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const config = useMemo(
    () => PUBLIC_HUBS[location.pathname] ?? PUBLIC_HUBS[Path.Resources],
    [location.pathname],
  );
  const policy = POLICY_CONTENT[location.pathname];

  if (policy) {
    return (
      <PageShell>
        <article className={styles.policy}>
          <header className={styles.header}>
            <span>{policy.eyebrow}</span>
            <h1>{policy.title}</h1>
            <p>{policy.updated}</p>
          </header>
          {policy.sections.map((section) => (
            <section key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </section>
          ))}
          <footer>
            <button onClick={() => navigate(Path.Terms)}>Terms</button>
            <button onClick={() => navigate(Path.Privacy)}>Privacy</button>
            <button onClick={() => navigate(Path.Support)}>Support</button>
          </footer>
        </article>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <header className={styles.header}>
        <span>{config.eyebrow}</span>
        <h1>{config.title}</h1>
        <p>{config.description}</p>
      </header>
      <section className={styles.publicGrid}>
        {config.cards.map((card, index) => (
          <article key={card.title} className={styles.publicCard}>
            <div aria-hidden="true">{String(index + 1).padStart(2, "0")}</div>
            <small>{card.meta}</small>
            <h2>{card.title}</h2>
            <p>{card.description}</p>
            <button onClick={() => navigate(card.target)}>Open →</button>
          </article>
        ))}
      </section>
    </PageShell>
  );
}

export function ParityHubPage() {
  const location = useLocation();
  if (location.pathname === Path.Games) return <GamesPage />;
  if (location.pathname === Path.Gacha) return <GachaPage />;
  if (location.pathname === Path.Feed) return <ActivityPage />;
  return <PublicHubPage />;
}
