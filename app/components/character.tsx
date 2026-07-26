import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { useLocation, useNavigate } from "react-router-dom";
import { Path } from "../constant";
import { readLorebook } from "../data/lorebook";
import { getCharacterById } from "../data/scene-chat";
import { useMobileScreen } from "../utils";
import { LoreBadge, LorebookEditorPage, LorebookViewer } from "./lorebook";
import { TelloriaSidebar } from "./telloria-sidebar";
import styles from "./character.module.scss";

function parseCharacterRoute(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  return {
    id: decodeURIComponent(parts[1] ?? "miko"),
    section: parts[2] ?? "",
  };
}

export function CharacterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMobileScreen();
  const route = useMemo(
    () => parseCharacterRoute(location.pathname),
    [location.pathname],
  );
  const character = useMemo(() => getCharacterById(route.id), [route.id]);
  const [following, setFollowing] = useState(false);
  const [showLorebook, setShowLorebook] = useState(false);
  const [loreCount, setLoreCount] = useState(0);

  useEffect(() => {
    setLoreCount(
      readLorebook(character.id, character.name).entries.filter(
        (entry) => entry.enabled,
      ).length,
    );
  }, [character.id, character.name, location.pathname]);

  if (route.section === "lorebook") {
    return <LorebookEditorPage characterId={character.id} />;
  }

  return (
    <div className={styles.page}>
      {!isMobile && <TelloriaSidebar />}
      <main className={styles.main}>
        <button className={styles.back} onClick={() => navigate(Path.Explore)}>
          ← Back
        </button>

        <section className={styles.hero}>
          <img src={character.cover} alt="" className={styles.cover} />
          <div className={styles.scrim} />
          <div className={styles.heroContent}>
            <img
              src={character.avatar}
              alt={character.name}
              className={styles.avatar}
            />
            <div className={styles.identity}>
              <span>AI CHARACTER</span>
              <h1>{character.name}</h1>
              <p>by {character.creator}</p>
              <div className={styles.tags}>
                <span>Story</span>
                <span>Roleplay</span>
                <span>English</span>
              </div>
            </div>
            <div className={styles.actions}>
              <button
                className={styles.primary}
                onClick={() => navigate(`${Path.SceneChat}/${character.id}`)}
              >
                Start chat
              </button>
              <button
                className={clsx({ [styles.following]: following })}
                onClick={() => setFollowing((value) => !value)}
              >
                {following ? "Following" : "Follow"}
              </button>
              <button aria-label="Share character">↗</button>
            </div>
          </div>
        </section>

        <div className={styles.body}>
          <section className={styles.about}>
            <div className={styles.sectionTitle}>
              <div>
                <small>ABOUT</small>
                <h2>Meet {character.name}</h2>
              </div>
              <LoreBadge
                count={loreCount}
                onClick={() => setShowLorebook(true)}
              />
            </div>
            <p>{character.summary}</p>
            <blockquote>“{character.openingLine}”</blockquote>
            <div className={styles.stats}>
              <div>
                <strong>{character.followers}</strong>
                <span>followers</span>
              </div>
              <div>
                <strong>128K</strong>
                <span>chats</span>
              </div>
              <div>
                <strong>9.7K</strong>
                <span>likes</span>
              </div>
            </div>
          </section>

          <aside className={styles.creator}>
            <small>CREATOR</small>
            <div>
              <span>{character.creator.slice(1, 2).toUpperCase()}</span>
              <div>
                <h2>{character.creator}</h2>
                <p>Stories that remember the quiet details.</p>
              </div>
            </div>
            <button
              onClick={() =>
                navigate(`${Path.Profile}/${character.creator.slice(1)}`)
              }
            >
              View profile
            </button>
          </aside>
        </div>

        <section className={styles.prompt}>
          <div>
            <small>READY WHEN YOU ARE</small>
            <h2>Begin with the opening line—or change the story.</h2>
          </div>
          <button onClick={() => navigate(`${Path.SceneChat}/${character.id}`)}>
            Chat with {character.name} →
          </button>
        </section>
      </main>

      {showLorebook && (
        <LorebookViewer
          characterId={character.id}
          onClose={() => setShowLorebook(false)}
        />
      )}
    </div>
  );
}
