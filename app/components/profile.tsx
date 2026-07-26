import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";

import { Path } from "../constant";
import { useMobileScreen } from "../utils";
import { showToast } from "./ui-lib";
import {
  TelloriaNavIcon,
  TelloriaSidebar,
  type TelloriaNavIconName,
} from "./telloria-sidebar";
import {
  CURRENT_USER_ID,
  GUEST_FEATURES,
  OWNER_FEATURES,
  PROFILE_TABS,
  formatCompact,
  getProfileAssets,
  getProfileUserById,
  type ProfileAssetTab,
} from "../data/profile";
import { listHistoryCharacters } from "../data/scene-chat";
import styles from "./profile.module.scss";

type BottomTab = "home" | "scene" | "create" | "profile" | "chats";

const BOTTOM_TABS: {
  key: BottomTab;
  label: string;
  icon: TelloriaNavIconName;
}[] = [
  { key: "home", label: "Home", icon: "explore" },
  { key: "scene", label: "Scene", icon: "scene" },
  { key: "create", label: "Create", icon: "create" },
  { key: "profile", label: "Profile", icon: "profile" },
  { key: "chats", label: "Chats", icon: "chats" },
];

function parseProfileId(pathname: string) {
  const prefix = `${Path.Profile}/`;
  if (!pathname.startsWith(prefix)) return "";
  return decodeURIComponent(pathname.slice(prefix.length).split("/")[0] ?? "");
}

export function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMobileScreen();

  const [assetTab, setAssetTab] = useState<ProfileAssetTab>("character");
  const [activeBottom, setActiveBottom] = useState<BottomTab>("profile");
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [profileBio, setProfileBio] = useState("");

  const viewedProfileId = useMemo(() => {
    const parsed = parseProfileId(location.pathname);
    return parsed || CURRENT_USER_ID;
  }, [location.pathname]);

  const user = useMemo(
    () => getProfileUserById(viewedProfileId),
    [viewedProfileId],
  );
  const isOwner = viewedProfileId === CURRENT_USER_ID;

  const assetItems = useMemo(
    () => getProfileAssets(user.id, assetTab),
    [assetTab, user.id],
  );

  const firstChatCharacter = useMemo(() => {
    return listHistoryCharacters()[0]?.id ?? "miko";
  }, []);

  useEffect(() => {
    setAssetTab("character");
    setIsFollowing(false);
    setDisplayName(user.name);
    setProfileBio(user.bio);
  }, [user.id]);

  const featureItems = isOwner ? OWNER_FEATURES : GUEST_FEATURES;

  const onBottomTabClick = (tab: BottomTab) => {
    setActiveBottom(tab);
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
    }
  };

  const onFeatureClick = (featureId: string) => {
    if (featureId === "settings") {
      navigate(Path.Settings);
      return;
    }
    if (featureId === "membership") {
      navigate(Path.Membership);
      return;
    }
    if (featureId === "wallet") {
      navigate(Path.Credits);
      return;
    }
    if (featureId === "inbox") {
      navigate(Path.Inbox);
      return;
    }
    if (featureId === "drafts") {
      navigate(Path.NewChat);
      return;
    }
    if (featureId === "follow") {
      setIsFollowing((prev) => !prev);
      return;
    }
    showToast("This feature will be connected soon.");
  };

  const sidePanel = (
    <TelloriaSidebar onNavigate={() => setMobileDrawerOpen(false)} />
  );

  return (
    <div className={styles.page}>
      {!isMobile && sidePanel}

      <section className={styles.content}>
        {isMobile && (
          <header className={styles["mobile-top"]}>
            {!isOwner && (
              <button
                className={styles["mobile-icon"]}
                onClick={() => navigate(Path.Profile)}
              >
                ←
              </button>
            )}
            <div className={styles["mobile-name"]}>
              {displayName || user.name}
            </div>
            <div className={styles["mobile-actions"]}>
              <button className={styles["mobile-icon"]}>C</button>
              <button className={styles["mobile-icon"]}>⌕</button>
              <button className={styles["mobile-icon"]}>◌</button>
              <button
                className={styles["mobile-icon"]}
                onClick={() => setMobileDrawerOpen(true)}
              >
                ☰
              </button>
            </div>
          </header>
        )}

        <div className={styles["content-scroll"]}>
          <section className={styles["profile-block"]}>
            <img className={styles.avatar} src={user.avatar} alt={user.name} />
            <h1>{displayName || user.name}</h1>
            <p>{user.handle}</p>

            <div className={styles.stats}>
              <div>
                <strong>{formatCompact(user.followers)}</strong>
                <span>followers</span>
              </div>
              <div>
                <strong>
                  {formatCompact(isOwner ? user.following : user.interactions)}
                </strong>
                <span>{isOwner ? "following" : "interactions"}</span>
              </div>
              <div>
                <strong>
                  {formatCompact(isOwner ? user.interactions : user.creations)}
                </strong>
                <span>{isOwner ? "interactions" : "creations"}</span>
              </div>
            </div>

            <div className={styles["profile-actions"]}>
              {isOwner ? (
                <>
                  <button onClick={() => setEditOpen(true)}>
                    Edit Profile
                  </button>
                  <button onClick={() => showToast("Profile link copied.")}>
                    Share Profile
                  </button>
                  <button onClick={() => navigate(Path.Settings)}>⚙</button>
                </>
              ) : (
                <>
                  <button onClick={() => setIsFollowing((prev) => !prev)}>
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                  <button onClick={() => showToast("Profile link copied.")}>
                    Share
                  </button>
                  <button onClick={() => showToast("Report submitted.")}>
                    Report
                  </button>
                </>
              )}
            </div>

            <div className={styles.bio}>{profileBio || user.bio}</div>
          </section>

          <section className={styles["feature-block"]}>
            <div className={styles["block-title"]}>Function Navigation</div>
            <div className={styles["feature-grid"]}>
              {featureItems.map((feature) => (
                <button
                  key={feature.id}
                  className={styles["feature-item"]}
                  onClick={() => onFeatureClick(feature.id)}
                >
                  <strong>
                    {feature.id === "follow" && isFollowing
                      ? "Following"
                      : feature.title}
                  </strong>
                  <span>{feature.hint}</span>
                </button>
              ))}
            </div>
          </section>

          <section className={styles["assets-block"]}>
            <div className={styles["block-title"]}>Assets</div>
            <div className={styles.tabs}>
              {PROFILE_TABS.map((tab) => (
                <button
                  key={tab.key}
                  className={clsx(styles.tab, {
                    [styles.active]: assetTab === tab.key,
                  })}
                  onClick={() => setAssetTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className={styles["asset-list"]}>
              {assetItems.map((asset) => (
                <article
                  key={asset.id}
                  className={styles["asset-card"]}
                  onClick={() =>
                    assetTab === "scene"
                      ? navigate(Path.Scene)
                      : navigate(`${Path.Character}/${firstChatCharacter}`)
                  }
                >
                  <img src={asset.cover} alt={asset.title} />
                  <div className={styles["asset-info"]}>
                    <h3>{asset.title}</h3>
                    <p>{asset.subtitle}</p>
                    <div className={styles["asset-meta"]}>
                      <span>{asset.tag}</span>
                      <span>◔ {formatCompact(asset.chats)}</span>
                      <span>♡ {formatCompact(asset.likes)}</span>
                    </div>
                  </div>
                  <button
                    className={styles["asset-more"]}
                    onClick={(event) => {
                      event.stopPropagation();
                      showToast("Asset actions opened.");
                    }}
                  >
                    ⋯
                  </button>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>

      {isMobile && (
        <>
          <nav className={styles["mobile-bottom"]}>
            {BOTTOM_TABS.map((tab) => (
              <button
                key={tab.key}
                className={clsx(styles["bottom-tab"], {
                  [styles.active]: activeBottom === tab.key,
                  [styles["create-tab"]]: tab.key === "create",
                })}
                onClick={() => onBottomTabClick(tab.key)}
              >
                <TelloriaNavIcon
                  name={tab.icon}
                  className={styles["bottom-icon"]}
                />
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

      {editOpen && (
        <div
          className={styles["edit-backdrop"]}
          onClick={() => setEditOpen(false)}
        >
          <section
            className={styles["edit-dialog"]}
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-profile-title"
            onClick={(event) => event.stopPropagation()}
          >
            <header>
              <div>
                <small>PROFILE</small>
                <h2 id="edit-profile-title">Edit profile</h2>
              </div>
              <button
                aria-label="Close edit profile"
                onClick={() => setEditOpen(false)}
              >
                ×
              </button>
            </header>
            <label>
              Display name
              <input
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                maxLength={40}
              />
            </label>
            <label>
              Bio
              <textarea
                value={profileBio}
                onChange={(event) => setProfileBio(event.target.value)}
                maxLength={240}
              />
            </label>
            <button
              className={styles["save-profile"]}
              onClick={() => setEditOpen(false)}
            >
              Save profile
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
