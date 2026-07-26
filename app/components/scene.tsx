import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { Path } from "../constant";
import { useMobileScreen } from "../utils";
import { showToast } from "./ui-lib";
import { TelloriaSidebar } from "./telloria-sidebar";
import styles from "./scene.module.scss";

type BottomTab = "home" | "scene" | "create" | "chats" | "profile";
type SceneKind = "video" | "image";
type FeedTab = "foryou" | "following" | "recent";
type SceneCategory = "all" | "drama" | "manga" | "video" | "scene";

type SceneItem = {
  id: string;
  title: string;
  creator: string;
  tag: string;
  likes: number;
  kind: SceneKind;
  category: Exclude<SceneCategory, "all">;
  mediaUrl: string;
  posterUrl: string;
};

const BOTTOM_TABS: { key: BottomTab; label: string; icon: string }[] = [
  { key: "home", label: "Explore", icon: "⌂" },
  { key: "scene", label: "Scene", icon: "◈" },
  { key: "create", label: "Create", icon: "+" },
  { key: "chats", label: "Inbox", icon: "◌" },
  { key: "profile", label: "Profile", icon: "◯" },
];

const TAGS = ["For You", "Romance", "Fantasy", "School", "Action", "Drama"];
const FEED_TABS: { key: FeedTab; label: string }[] = [
  { key: "foryou", label: "For You" },
  { key: "following", label: "Following" },
  { key: "recent", label: "Recent" },
];
const CATEGORIES: { key: SceneCategory; label: string }[] = [
  { key: "all", label: "All" },
  { key: "drama", label: "Drama" },
  { key: "manga", label: "Manga" },
  { key: "video", label: "Video" },
  { key: "scene", label: "Scene" },
];

const TITLES = [
  "Moonlit Platform",
  "Wrong Number, Right Story",
  "After-School Secret",
  "Orbiting Hearts",
  "Echoes in Neon Rain",
  "Letters From Tomorrow",
  "Campus Countdown",
  "Midnight Rooftop",
  "Parallel Summer",
  "Velvet Rehearsal",
];

const CREATORS = [
  "@telloria_edit",
  "@lace.story",
  "@scenehouse",
  "@aiko.frames",
  "@urban.plot",
  "@nora.tales",
  "@mintstudio",
  "@cinema.text",
];

const VIDEO_POOL = [
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm",
  "https://www.w3schools.com/html/mov_bbb.mp4",
];

const IMAGE_POOL = [
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=900&q=80",
];

function compactCount(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return `${value}`;
}

function buildSceneItems(start: number, count: number): SceneItem[] {
  return Array.from({ length: count }, (_, idx) => {
    const seed = start + idx;
    const isImage = seed % 3 === 0;
    const mediaUrl = isImage
      ? IMAGE_POOL[seed % IMAGE_POOL.length]
      : VIDEO_POOL[seed % VIDEO_POOL.length];
    const posterUrl = IMAGE_POOL[(seed + 2) % IMAGE_POOL.length];

    return {
      id: `scene-${seed}`,
      title: TITLES[seed % TITLES.length],
      creator: CREATORS[seed % CREATORS.length],
      tag: TAGS[seed % TAGS.length],
      likes: 3200 + ((seed * 19_373) % 580_000),
      kind: isImage ? "image" : "video",
      category: (["scene", "drama", "manga", "video"] as const)[seed % 4],
      mediaUrl,
      posterUrl,
    };
  });
}

export function ScenePage() {
  const navigate = useNavigate();
  const isMobile = useMobileScreen();

  const feedRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<BottomTab>("scene");
  const [feedTab, setFeedTab] = useState<FeedTab>("foryou");
  const [category, setCategory] = useState<SceneCategory>("all");
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<SceneItem[]>(() => buildSceneItems(0, 48));
  const [visibleCount, setVisibleCount] = useState(24);
  const [overlayIndex, setOverlayIndex] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const filteredItems = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    const scoped =
      feedTab === "following"
        ? items.filter((item) =>
            ["@telloria_edit", "@lace.story", "@aiko.frames"].includes(
              item.creator,
            ),
          )
        : feedTab === "recent"
        ? [...items].reverse()
        : items;
    return scoped.filter((item) => {
      if (category !== "all" && item.category !== category) return false;
      if (!keyword) return true;
      return `${item.title} ${item.creator} ${item.tag} ${item.category}`
        .toLowerCase()
        .includes(keyword);
    });
  }, [category, feedTab, items, query]);

  const visibleItems = filteredItems.slice(0, visibleCount);
  const overlayItem =
    overlayIndex === null ? null : filteredItems[overlayIndex] ?? null;

  const appendItems = useCallback(() => {
    setItems((prev) => [...prev, ...buildSceneItems(prev.length, 24)]);
  }, []);

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => prev + (isMobile ? 6 : 12));
  }, [isMobile]);

  useEffect(() => {
    if (query.trim().length > 0) return;
    if (visibleCount + 8 > filteredItems.length) {
      appendItems();
    }
  }, [appendItems, filteredItems.length, query, visibleCount]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    const root = feedRef.current;
    if (!sentinel || !root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { root, rootMargin: "260px 0px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

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
      navigate(Path.Inbox);
      return;
    }
  };

  const onRefresh = () => {
    setItems((prev) => [...buildSceneItems(prev.length + 1000, 12), ...prev]);
    setVisibleCount((prev) => prev + 4);
    showToast("Scene feed refreshed.");
  };

  const openOverlay = (id: string) => {
    const nextIndex = filteredItems.findIndex((item) => item.id === id);
    if (nextIndex >= 0) {
      setOverlayIndex(nextIndex);
    }
  };

  const switchOverlayItem = useCallback(
    (step: number) => {
      setOverlayIndex((prev) => {
        if (prev === null || filteredItems.length === 0) return prev;
        return (prev + step + filteredItems.length) % filteredItems.length;
      });
    },
    [filteredItems],
  );

  useEffect(() => {
    if (overlayIndex === null) return;
    if (filteredItems.length === 0) {
      setOverlayIndex(null);
      return;
    }
    if (overlayIndex >= filteredItems.length) {
      setOverlayIndex(filteredItems.length - 1);
    }
  }, [filteredItems.length, overlayIndex]);

  useEffect(() => {
    if (overlayItem?.kind !== "video") {
      setIsMuted(true);
    }
  }, [overlayItem?.id, overlayItem?.kind]);

  useEffect(() => {
    if (overlayIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp") {
        event.preventDefault();
        switchOverlayItem(-1);
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        switchOverlayItem(1);
      } else if (event.key.toLowerCase() === "m") {
        event.preventDefault();
        setIsMuted((prev) => !prev);
      } else if (event.key === "Escape") {
        event.preventDefault();
        setOverlayIndex(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [overlayIndex, switchOverlayItem]);

  const sidePanel = (
    <TelloriaSidebar onNavigate={() => setMobileDrawerOpen(false)} />
  );

  return (
    <div className={styles["scene-page"]}>
      {!isMobile && sidePanel}

      <section className={styles["content-panel"]}>
        {isMobile && (
          <header className={styles["mobile-header"]}>
            <button
              className={styles["tale-entry"]}
              onClick={() => navigate(Path.Subscribe)}
            >
              Tale+
            </button>
            <div className={styles["mobile-title"]}>Scene</div>
            <button
              className={styles["drawer-toggle"]}
              onClick={() => setMobileDrawerOpen(true)}
            >
              ☰
            </button>
          </header>
        )}

        <div className={styles["content-scroll"]} ref={feedRef}>
          {!isMobile && (
            <div className={styles["scene-head"]}>
              <div className={styles["scene-head-copy"]}>
                <h1>Telloria Scene</h1>
                <p>
                  Scroll the stream, then open any card for an immersive full
                  overlay experience.
                </p>
              </div>
              <div className={styles["scene-head-actions"]}>
                <button onClick={onRefresh}>Refresh Feed</button>
                <button
                  onClick={() => showToast("Trending panel is coming soon.")}
                >
                  Trending
                </button>
              </div>
            </div>
          )}

          <div className={styles["search-row"]}>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Global search in Scene"
            />
            <button onClick={onRefresh}>Refresh</button>
          </div>

          <div className={styles["feed-controls"]}>
            <div
              className={styles["feed-tabs"]}
              role="tablist"
              aria-label="Scene feed"
            >
              {FEED_TABS.map((tab) => (
                <button
                  key={tab.key}
                  role="tab"
                  aria-selected={feedTab === tab.key}
                  className={clsx({ [styles.active]: feedTab === tab.key })}
                  onClick={() => {
                    setFeedTab(tab.key);
                    setVisibleCount(24);
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {feedTab === "foryou" && (
              <div className={styles.categories} aria-label="Scene category">
                {CATEGORIES.map((item) => (
                  <button
                    key={item.key}
                    aria-pressed={category === item.key}
                    className={clsx({ [styles.active]: category === item.key })}
                    onClick={() => {
                      setCategory(item.key);
                      setVisibleCount(24);
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {visibleItems.length === 0 ? (
            <section className={styles["empty-feed"]}>
              <span>◇</span>
              <h2>No scenes found</h2>
              <p>Try another category or clear your search.</p>
              <button
                onClick={() => {
                  setQuery("");
                  setCategory("all");
                  setFeedTab("foryou");
                }}
              >
                Reset filters
              </button>
            </section>
          ) : (
            <div
              className={clsx(styles.feed, {
                [styles["mobile-feed"]]: isMobile,
              })}
            >
              {visibleItems.map((item) => (
                <article
                  key={item.id}
                  className={styles.card}
                  onClick={() => openOverlay(item.id)}
                >
                  <div className={styles.media}>
                    {item.kind === "video" ? (
                      <video
                        src={item.mediaUrl}
                        poster={item.posterUrl}
                        muted
                        autoPlay
                        loop
                        playsInline
                        preload="metadata"
                      />
                    ) : (
                      <img
                        src={item.mediaUrl}
                        alt={item.title}
                        loading="lazy"
                      />
                    )}
                    <span className={styles.badge}>{item.category}</span>
                  </div>
                  <div className={styles["card-meta"]}>
                    <h3>{item.title}</h3>
                    <p>{item.creator}</p>
                    <small>
                      #{item.tag} · {compactCount(item.likes)} likes
                    </small>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div ref={sentinelRef} className={styles.sentinel}>
            Loading more scenes...
          </div>
        </div>
      </section>

      <div
        className={clsx(styles.overlay, {
          [styles.open]: !!overlayItem,
        })}
        onClick={() => setOverlayIndex(null)}
      >
        {overlayItem && (
          <div
            className={styles["overlay-shell"]}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className={styles["overlay-close"]}
              onClick={() => setOverlayIndex(null)}
            >
              ✕
            </button>

            <button
              className={styles["switch-up"]}
              onClick={() => switchOverlayItem(-1)}
            >
              ↑
            </button>
            <button
              className={styles["switch-down"]}
              onClick={() => switchOverlayItem(1)}
            >
              ↓
            </button>

            <div className={styles["overlay-media"]}>
              {overlayItem.kind === "video" ? (
                <video
                  key={overlayItem.id}
                  src={overlayItem.mediaUrl}
                  poster={overlayItem.posterUrl}
                  autoPlay
                  loop
                  playsInline
                  controls
                  muted={isMuted}
                />
              ) : (
                <img src={overlayItem.mediaUrl} alt={overlayItem.title} />
              )}
            </div>

            <div className={styles["overlay-meta"]}>
              <h2>{overlayItem.title}</h2>
              <p>{overlayItem.creator}</p>
              <small>
                #{overlayItem.tag} · {compactCount(overlayItem.likes)} likes
              </small>
              <div className={styles["overlay-actions"]}>
                <button onClick={() => navigate(`${Path.SceneChat}/miko`)}>
                  Start story
                </button>
                <button
                  onClick={() => {
                    showToast(`Remixing “${overlayItem.title}”`);
                    navigate(Path.NewChat);
                  }}
                >
                  Remix
                </button>
              </div>
            </div>

            {overlayItem.kind === "video" && (
              <button
                className={styles["mute-toggle"]}
                onClick={() => setIsMuted((prev) => !prev)}
              >
                {isMuted ? "Unmute" : "Mute"}
              </button>
            )}

            <div className={styles.hint}>↑/↓ 切换 · M 静音 · ESC 关闭</div>
          </div>
        )}
      </div>

      {isMobile && (
        <>
          <nav className={styles["mobile-bottom"]}>
            {BOTTOM_TABS.map((tab) => (
              <button
                key={tab.key}
                className={clsx(styles["bottom-tab"], {
                  [styles.active]: activeTab === tab.key,
                  [styles["create-tab"]]: tab.key === "create",
                })}
                onClick={() => onBottomTabClick(tab.key)}
              >
                <span>{tab.icon}</span>
                <small>{tab.label}</small>
              </button>
            ))}
          </nav>

          <div
            className={clsx(styles["mobile-overlay"], {
              [styles.open]: mobileDrawerOpen,
            })}
            onClick={() => setMobileDrawerOpen(false)}
          >
            <div
              className={styles["mobile-drawer"]}
              onClick={(event) => event.stopPropagation()}
            >
              {sidePanel}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
