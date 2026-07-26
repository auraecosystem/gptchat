import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { Path } from "../constant";
import { useMobileScreen } from "../utils";
import { showToast } from "./ui-lib";
import {
  TelloriaNavIcon,
  TelloriaSidebar,
  type TelloriaNavIconName,
} from "./telloria-sidebar";
import styles from "./explore.module.scss";

type BottomTab = "home" | "scene" | "create" | "chats" | "profile";
type Feed = "for-you" | "trending" | "new";

type CharacterCard = {
  id: string;
  characterId: string;
  name: string;
  description: string;
  tags: string[];
  chats: number;
  likes: number;
  image: string;
  avatar: string;
  author: string;
  feed: Feed;
};

const TAGS = [
  "All",
  "Anime",
  "Fantasy",
  "Romance",
  "Sci-Fi",
  "Horror",
  "Adventure",
  "Comedy",
  "Drama",
  "Mystery",
  "Action",
  "Historical",
];

const FEEDS: { key: Feed; label: string }[] = [
  { key: "for-you", label: "For You" },
  { key: "trending", label: "Trending" },
  { key: "new", label: "New" },
];

const BASE_CARDS: Omit<CharacterCard, "id" | "chats" | "likes">[] = [
  {
    characterId: "miko",
    name: "Vivian",
    description: "Your roommate is secretly writing AI-powered diary stories.",
    tags: ["Romance", "Drama"],
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=180&q=80",
    author: "Telloria Studio",
    feed: "for-you",
  },
  {
    characterId: "kim-taehyung",
    name: "Atlas Evander",
    description: "A midnight driver who only talks when the city goes quiet.",
    tags: ["Drama", "Mystery"],
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=180&q=80",
    author: "Nocturne",
    feed: "trending",
  },
  {
    characterId: "koharu",
    name: "Sophia",
    description:
      "A sharp mentor who rewrites your choices into better endings.",
    tags: ["Sci-Fi", "Drama"],
    image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=900&q=80",
    avatar:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=180&q=80",
    author: "Telloria Studio",
    feed: "for-you",
  },
  {
    characterId: "bodyguards",
    name: "Evan Borel",
    description: "An elegant strategist from a city where nothing is random.",
    tags: ["Mystery", "Action"],
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=180&q=80",
    author: "Urban Plot",
    feed: "new",
  },
  {
    characterId: "jake",
    name: "Kiro",
    description: "A low-key musician building endless neon worlds with you.",
    tags: ["Anime", "Romance"],
    image:
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=900&q=80",
    avatar:
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=180&q=80",
    author: "Lumi",
    feed: "trending",
  },
  {
    characterId: "your-six-stepsisters",
    name: "Lorna Dane",
    description:
      "A cosmic traveler who can bend stories by asking one question.",
    tags: ["Fantasy", "Adventure"],
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80",
    avatar:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=180&q=80",
    author: "Telloria Studio",
    feed: "for-you",
  },
  {
    characterId: "miko",
    name: "The Six Troublemakers",
    description: "Six rivals, one rooftop, and a bet that changes every path.",
    tags: ["Comedy", "School"],
    image:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=900&q=80",
    avatar:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=180&q=80",
    author: "Lace Story",
    feed: "trending",
  },
  {
    characterId: "koharu",
    name: "Noel",
    description: "A protective knight in a soft world of handwritten magic.",
    tags: ["Fantasy", "Romance"],
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=180&q=80",
    author: "Mint Studio",
    feed: "for-you",
  },
  {
    characterId: "your-six-stepsisters",
    name: "Zero District",
    description: "A hidden school where your first line defines your destiny.",
    tags: ["Sci-Fi", "School"],
    image:
      "https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?auto=format&fit=crop&w=900&q=80",
    avatar:
      "https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?auto=format&fit=crop&w=180&q=80",
    author: "Telloria Studio",
    feed: "new",
  },
  {
    characterId: "kim-taehyung",
    name: "Nora Vale",
    description:
      "A poet who turns your memories into interactive constellations.",
    tags: ["Romance", "Fantasy"],
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=180&q=80",
    author: "Celeste",
    feed: "new",
  },
];

const BOTTOM_TABS: {
  key: BottomTab;
  label: string;
  icon: TelloriaNavIconName;
}[] = [
  { key: "home", label: "Explore", icon: "explore" },
  { key: "scene", label: "Scene", icon: "scene" },
  { key: "create", label: "Create", icon: "create" },
  { key: "chats", label: "Inbox", icon: "chats" },
  { key: "profile", label: "Profile", icon: "profile" },
];

function compactCount(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return `${value}`;
}

function buildCards(start: number, count: number): CharacterCard[] {
  return Array.from({ length: count }, (_, idx) => {
    const seed = start + idx;
    const base = BASE_CARDS[seed % BASE_CARDS.length];
    return {
      ...base,
      id: `card-${seed}`,
      name:
        seed >= BASE_CARDS.length
          ? `${base.name} ${Math.floor(seed / 10) + 1}`
          : base.name,
      chats: 4_900 + ((seed * 37_019) % 8_100_000),
      likes: 320 + ((seed * 9_973) % 3_100_000),
    };
  });
}

function CharacterTile(props: {
  card: CharacterCard;
  compact: boolean;
  onOpen: () => void;
}) {
  const { card, compact, onOpen } = props;

  return (
    <article
      className={clsx(styles.card, { [styles.compact]: compact })}
      onClick={onOpen}
      tabIndex={0}
      role="link"
      aria-label={`Start a story with ${card.name}`}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") onOpen();
      }}
    >
      <div className={styles["card-cover"]}>
        <img src={card.image} alt={card.name} loading="lazy" />
        <button
          type="button"
          className={styles["not-interested"]}
          aria-label={`Not interested in ${card.name}`}
          onClick={(event) => {
            event.stopPropagation();
            showToast(`${card.name} hidden from this session.`);
          }}
        >
          ×
        </button>
      </div>
      <div className={styles["card-info"]}>
        {!compact && (
          <div className={styles["card-author-row"]}>
            <img src={card.avatar} alt="" aria-hidden="true" />
            <div>
              <h3>{card.name}</h3>
              <small>by {card.author}</small>
            </div>
          </div>
        )}
        {compact && <h3>{card.name}</h3>}
        {!compact && <p>{card.description}</p>}
        <div className={styles["card-tags"]}>
          {compact
            ? card.tags.slice(0, 2).join(" / ")
            : card.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}
        </div>
        <div className={styles["card-stats"]}>
          <span>◯ {compactCount(card.chats)}</span>
          <span>♡ {compactCount(card.likes)}</span>
        </div>
      </div>
    </article>
  );
}

export function ExplorePage() {
  const navigate = useNavigate();
  const isMobile = useMobileScreen();

  const feedRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const pullStartRef = useRef<number | null>(null);

  const [activeTag, setActiveTag] = useState("All");
  const [activeFeed, setActiveFeed] = useState<Feed>("for-you");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [cards, setCards] = useState<CharacterCard[]>(() => buildCards(0, 72));
  const [visibleCount, setVisibleCount] = useState(28);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredCards = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return cards.filter((card) => {
      const tagMatch = activeTag === "All" || card.tags.includes(activeTag);
      const feedMatch = !isMobile || card.feed === activeFeed;
      const text = `${card.name} ${card.description} ${card.tags.join(" ")} ${
        card.author
      }`.toLowerCase();
      return tagMatch && feedMatch && (!keyword || text.includes(keyword));
    });
  }, [activeFeed, activeTag, cards, isMobile, query]);

  const visibleCards = filteredCards.slice(0, visibleCount);

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => prev + 12);
  }, []);

  useEffect(() => {
    if (visibleCount + 12 > filteredCards.length) {
      setCards((prev) => [...prev, ...buildCards(prev.length, 36)]);
    }
  }, [filteredCards.length, visibleCount]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    const root = feedRef.current;
    if (!sentinel || !root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { root, rootMargin: "300px 0px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  const openCharacter = (characterId: string) => {
    navigate(`${Path.Character}/${characterId}`);
  };

  const onBottomTabClick = (tab: BottomTab) => {
    if (tab === "home") return navigate(Path.Explore);
    if (tab === "scene") return navigate(Path.Scene);
    if (tab === "create") return navigate(Path.NewChat);
    if (tab === "profile") return navigate(Path.Profile);
    navigate(Path.Inbox);
  };

  const onPullStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!isMobile || event.currentTarget.scrollTop > 0) return;
    pullStartRef.current = event.touches[0]?.clientY ?? null;
  };

  const onPullMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!isMobile || pullStartRef.current === null || isRefreshing) return;
    const currentY = event.touches[0]?.clientY ?? pullStartRef.current;
    setPullDistance(Math.min(84, Math.max(0, currentY - pullStartRef.current)));
  };

  const onPullEnd = () => {
    pullStartRef.current = null;
    if (pullDistance < 64) return setPullDistance(0);
    setIsRefreshing(true);
    setTimeout(() => {
      setCards((prev) => [...buildCards(prev.length + 1200, 12), ...prev]);
      setIsRefreshing(false);
      setPullDistance(0);
      showToast("Explore refreshed.");
    }, 500);
  };

  const renderGrid = (items: CharacterCard[], compact = false) => (
    <div className={styles["feed-grid"]}>
      {items.map((card) => (
        <CharacterTile
          key={card.id}
          card={card}
          compact={compact}
          onOpen={() => openCharacter(card.characterId)}
        />
      ))}
    </div>
  );

  const forYou = cards.filter((card) => card.feed === "for-you").slice(0, 8);
  const trending = cards.filter((card) => card.feed === "trending").slice(0, 8);

  return (
    <div className={styles["explore-page"]}>
      {!isMobile && <TelloriaSidebar />}

      <section className={styles["content-panel"]}>
        {isMobile && (
          <>
            <header className={styles["mobile-header"]}>
              <h1>Explore</h1>
              <button
                className={styles["mobile-search-trigger"]}
                onClick={() => setSearchOpen((open) => !open)}
                aria-label="Search"
              >
                ⌕
              </button>
            </header>
            {searchOpen && (
              <div className={styles["mobile-search"]}>
                <input
                  autoFocus
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search characters..."
                  aria-label="Search characters"
                />
              </div>
            )}
          </>
        )}

        <div
          className={styles["content-scroll"]}
          ref={feedRef}
          onTouchStart={onPullStart}
          onTouchMove={onPullMove}
          onTouchEnd={onPullEnd}
        >
          {isMobile && (
            <div
              className={styles["pull-indicator"]}
              style={{
                height: `${pullDistance}px`,
                opacity: pullDistance > 8 ? 1 : 0,
              }}
            >
              {isRefreshing ? "Refreshing..." : "Pull to refresh"}
            </div>
          )}

          {!isMobile && (
            <h1 className={styles["sr-only"]}>
              Explore AI Characters and Interactive Stories on Telloria
            </h1>
          )}

          <div className={styles["tag-row"]}>
            <div className={styles["tag-scroll"]}>
              {isMobile &&
                FEEDS.map((feed) => (
                  <button
                    key={feed.key}
                    className={clsx(styles["tag-chip"], {
                      [styles.active]:
                        activeFeed === feed.key && activeTag === "All",
                    })}
                    onClick={() => {
                      setActiveFeed(feed.key);
                      setActiveTag("All");
                    }}
                  >
                    {feed.label}
                  </button>
                ))}
              {isMobile && <span className={styles["tag-divider"]} />}
              {TAGS.map((tag) => (
                <button
                  key={tag}
                  className={clsx(styles["tag-chip"], {
                    [styles.active]:
                      activeTag === tag && (!isMobile || tag !== "All"),
                  })}
                  onClick={() => setActiveTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
            {!isMobile && (
              <div className={styles["feed-search"]}>
                <span>⌕</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search characters..."
                  aria-label="Search characters"
                />
              </div>
            )}
          </div>

          {isMobile &&
            activeFeed === "for-you" &&
            activeTag === "All" &&
            !query && (
              <button
                className={styles["game-entry"]}
                onClick={() => navigate(Path.Games)}
              >
                <span className={styles["game-icon"]}>⌘</span>
                <span>
                  <strong>Game rooms</strong>
                  <small>AI hosts · fills the table · starts instantly</small>
                </span>
                <em>Start a game ›</em>
              </button>
            )}

          {isMobile || activeTag !== "All" || query ? (
            renderGrid(visibleCards, isMobile)
          ) : (
            <div className={styles["desktop-sections"]}>
              <section className={styles["feed-section"]}>
                <div className={styles["section-heading"]}>
                  <h2>For You</h2>
                  <p>Based on your recent activity</p>
                </div>
                {renderGrid(forYou)}
              </section>
              <section className={styles["feed-section"]}>
                <div className={styles["section-heading"]}>
                  <h2>Trending</h2>
                  <p>Most active in the last 7 days</p>
                </div>
                {renderGrid(trending)}
              </section>
              <section className={styles["feed-section"]}>
                <div className={styles["section-heading"]}>
                  <h2>Discover</h2>
                  <p>Browse the full library</p>
                </div>
                {renderGrid(visibleCards)}
              </section>
            </div>
          )}

          <div ref={sentinelRef} className={styles.sentinel}>
            Loading more characters...
          </div>
        </div>
      </section>

      {isMobile && (
        <nav className={styles["mobile-bottom"]} aria-label="Primary">
          {BOTTOM_TABS.map((tab) => (
            <button
              key={tab.key}
              className={clsx(styles["bottom-tab"], {
                [styles.active]: tab.key === "home",
              })}
              onClick={() => onBottomTabClick(tab.key)}
              aria-current={tab.key === "home" ? "page" : undefined}
            >
              <TelloriaNavIcon
                name={tab.icon}
                className={styles["bottom-icon"]}
              />
              <small>{tab.label}</small>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
