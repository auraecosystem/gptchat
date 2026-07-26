import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { Path } from "../constant";
import { listHistoryCharacters } from "../data/scene-chat";
import styles from "./explore.module.scss";

export type TelloriaMenuItem =
  | "explore"
  | "games"
  | "scene"
  | "gacha"
  | "feed"
  | "profile";
export type TelloriaNavIconName =
  | "explore"
  | "games"
  | "scene"
  | "gacha"
  | "feed"
  | "profile"
  | "setting"
  | "create"
  | "chats";

const MENU_ITEMS: {
  key: TelloriaMenuItem;
  label: string;
  icon: TelloriaNavIconName;
}[] = [
  { key: "explore", label: "Explore", icon: "explore" },
  { key: "games", label: "Game rooms", icon: "games" },
  { key: "scene", label: "Scene", icon: "scene" },
  { key: "gacha", label: "Gacha", icon: "gacha" },
  { key: "feed", label: "Activity", icon: "feed" },
  { key: "profile", label: "Profile", icon: "profile" },
];

const CHAT_SEEDS = listHistoryCharacters();

function resolveMenu(pathname: string): TelloriaMenuItem {
  if (pathname === Path.Scene || pathname.startsWith(Path.SceneChat + "/")) {
    return "scene";
  }
  if (pathname === Path.Games) return "games";
  if (pathname === Path.Gacha) return "gacha";
  if (pathname === Path.Feed) return "feed";
  if (pathname === Path.Profile || pathname.startsWith(Path.Profile + "/")) {
    return "profile";
  }
  if (
    pathname === Path.Settings ||
    pathname === Path.Membership ||
    pathname === Path.Credits ||
    pathname === Path.Inbox ||
    pathname.startsWith(Path.AdvancedSettings)
  ) {
    return "profile";
  }
  if (pathname === Path.Home || pathname === Path.Explore) return "explore";
  if (pathname.startsWith(Path.Character + "/")) return "explore";
  return "explore";
}

export function TelloriaNavIcon(props: {
  name: TelloriaNavIconName;
  className?: string;
}) {
  const common = {
    className: props.className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (props.name) {
    case "explore":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.5 9.5L15 9l-.5 5.5-5.5.5.5-5.5Z" />
        </svg>
      );
    case "scene":
      return (
        <svg {...common}>
          <rect x="4.5" y="4.5" width="15" height="15" rx="3" />
          <path d="M8 15l3-3 2 2 3-4" />
          <circle cx="9" cy="9" r="1" />
        </svg>
      );
    case "games":
      return (
        <svg {...common}>
          <path d="M8 9h8a5 5 0 0 1 4.6 6.9l-.6 1.5a2.4 2.4 0 0 1-4 .8l-1.3-1.7H9.3L8 18.2a2.4 2.4 0 0 1-4-.8l-.6-1.5A5 5 0 0 1 8 9Z" />
          <path d="M8 12v3M6.5 13.5h3M15.5 13h.01M18 15h.01" />
        </svg>
      );
    case "gacha":
      return (
        <svg {...common}>
          <path d="m12 3 1.5 4.2L18 8.5l-4.5 1.3L12 14l-1.5-4.2L6 8.5l4.5-1.3L12 3Z" />
          <path d="m18.5 14 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z" />
        </svg>
      );
    case "feed":
      return (
        <svg {...common}>
          <path d="M3 12h4l2-6 4 12 2-6h6" />
        </svg>
      );
    case "profile":
      return (
        <svg {...common}>
          <circle cx="12" cy="8.5" r="3.2" />
          <path d="M5 18c1.6-2.6 4-4 7-4s5.4 1.4 7 4" />
        </svg>
      );
    case "setting":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="2.6" />
          <path d="M19 12h2M3 12h2M12 3v2M12 19v2M17.2 6.8l1.4-1.4M5.4 18.6l1.4-1.4M6.8 6.8L5.4 5.4M18.6 18.6l-1.4-1.4" />
        </svg>
      );
    case "create":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v8M8 12h8" />
        </svg>
      );
    case "chats":
      return (
        <svg {...common}>
          <path d="M6.5 17.5H5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-7l-4 3v-3Z" />
        </svg>
      );
  }
}

export function TelloriaSidebar(props: {
  className?: string;
  onNavigate?: () => void;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [chatQuery, setChatQuery] = useState("");

  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.getPropertyValue("--sidebar-width");
    root.style.setProperty("--sidebar-width", "288px");
    return () => {
      if (previous) {
        root.style.setProperty("--sidebar-width", previous);
      } else {
        root.style.removeProperty("--sidebar-width");
      }
    };
  }, []);

  const activeMenu = resolveMenu(location.pathname);

  const filteredChats = useMemo(() => {
    const keyword = chatQuery.trim().toLowerCase();
    return CHAT_SEEDS.filter((item) =>
      `${item.name} ${item.creator}`.toLowerCase().includes(keyword),
    );
  }, [chatQuery]);

  const go = (path: string) => {
    props.onNavigate?.();
    navigate(path);
  };

  const onMenuClick = (menu: TelloriaMenuItem) => {
    if (menu === "explore") {
      go(Path.Explore);
      return;
    }
    if (menu === "scene") {
      go(Path.Scene);
      return;
    }
    if (menu === "games") {
      go(Path.Games);
      return;
    }
    if (menu === "gacha") {
      go(Path.Gacha);
      return;
    }
    if (menu === "feed") {
      go(Path.Feed);
      return;
    }
    go(Path.Profile);
  };

  return (
    <aside className={clsx(styles.sidebar, props.className)}>
      <div className={styles["brand-wrap"]}>
        <button
          className={styles["brand-home-btn"]}
          onClick={() => go(Path.Explore)}
        >
          <div className={styles.brand}>Telloria</div>
        </button>
      </div>

      <div className={styles.divider} />

      <div className={styles["action-group"]}>
        <button
          className={styles["primary-action"]}
          onClick={() => go(Path.NewChat)}
        >
          Create
        </button>
        <button
          className={styles["upgrade-action"]}
          onClick={() => go(Path.Subscribe)}
        >
          Upgrade to Tale+
        </button>
      </div>

      <div className={styles.divider} />

      <div className={styles["menu-group"]}>
        {MENU_ITEMS.map(({ key, label, icon }) => (
          <button
            key={key}
            aria-current={activeMenu === key ? "page" : undefined}
            className={clsx(styles["menu-item"], {
              [styles.active]: activeMenu === key,
            })}
            onClick={() => onMenuClick(key)}
          >
            <TelloriaNavIcon name={icon} className={styles["menu-icon"]} />
            {label}
          </button>
        ))}
      </div>

      <div className={styles["sidebar-scroll-zone"]}>
        <div className={styles.divider} />

        <div className={styles["sidebar-search"]}>
          <input
            value={chatQuery}
            onChange={(event) => setChatQuery(event.target.value)}
            placeholder="Search chats"
          />
        </div>

        <div className={styles.divider} />

        <div className={styles["chat-list"]}>
          {filteredChats.map((chat, idx) => (
            <button
              key={chat.id}
              className={styles["chat-item"]}
              onClick={() => go(`${Path.SceneChat}/${chat.id}`)}
            >
              <span className={styles["chat-avatar"]}>
                {chat.name.charAt(0)}
              </span>
              <span className={styles["chat-name"]}>{chat.name}</span>
              <span className={styles["chat-dot"]}>{(idx % 9) + 1}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles["sidebar-bottom"]}>
        <div className={styles["bottom-menu"]}>
          <button onClick={() => go(Path.Resources)}>▣ Resources</button>
          <button onClick={() => go(Path.Changelog)}>✦ What&apos;s new</button>
        </div>
        <div className={styles["bottom-dock"]}>
          <a href="https://discord.com" target="_blank" rel="noreferrer">
            Discord
          </a>
          <button onClick={() => go(Path.Download)}>App</button>
        </div>
      </div>
    </aside>
  );
}
