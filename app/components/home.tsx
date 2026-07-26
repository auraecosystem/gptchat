"use client";

require("../polyfill");

import { useEffect, useState } from "react";
import styles from "./home.module.scss";

import LogoIcon from "../icons/logo.svg";
import LoadingIcon from "../icons/three-dots.svg";

import { getCSSVar, useMobileScreen } from "../utils";

import dynamic from "next/dynamic";
import { Path, SlotID } from "../constant";
import { ErrorBoundary } from "./error";

import { getISOLang, getLang } from "../locales";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { SideBar } from "./sidebar";
import { TelloriaSidebar } from "./telloria-sidebar";
import { useAppConfig } from "../store/config";
import { AuthPage } from "./auth";
import { ExplorePage } from "./explore";
import { getClientConfig } from "../config/client";
import { type ClientApi, getClientApi } from "../client/api";
import { useAccessStore } from "../store";
import clsx from "clsx";
import { initializeMcpSystem, isMcpEnabled } from "../mcp/actions";

export function Loading(props: { noLogo?: boolean }) {
  return (
    <div className={clsx("no-dark", styles["loading-content"])}>
      {!props.noLogo && (
        <div className={styles["loading-brand"]}>
          <LogoIcon className={styles["loading-brand-logo"]} />
          <span>Telloria</span>
        </div>
      )}
      <LoadingIcon />
    </div>
  );
}

const Artifacts = dynamic(async () => (await import("./artifacts")).Artifacts, {
  loading: () => <Loading noLogo />,
});

const Settings = dynamic(async () => (await import("./settings")).Settings, {
  loading: () => <Loading noLogo />,
});

const Chat = dynamic(async () => (await import("./chat")).Chat, {
  loading: () => <Loading noLogo />,
});

const NewChat = dynamic(async () => (await import("./new-chat")).NewChat, {
  loading: () => <Loading noLogo />,
});

const MaskPage = dynamic(async () => (await import("./mask")).MaskPage, {
  loading: () => <Loading noLogo />,
});

const PluginPage = dynamic(async () => (await import("./plugin")).PluginPage, {
  loading: () => <Loading noLogo />,
});

const SearchChat = dynamic(
  async () => (await import("./search-chat")).SearchChatPage,
  {
    loading: () => <Loading noLogo />,
  },
);

const Sd = dynamic(async () => (await import("./sd")).Sd, {
  loading: () => <Loading noLogo />,
});

const McpMarketPage = dynamic(
  async () => (await import("./mcp-market")).McpMarketPage,
  {
    loading: () => <Loading noLogo />,
  },
);

const ScenePage = dynamic(async () => (await import("./scene")).ScenePage, {
  loading: () => <Loading noLogo />,
});

const SceneChatPage = dynamic(
  async () => (await import("./scene-chat")).SceneChatPage,
  {
    loading: () => <Loading noLogo />,
  },
);

const ProfilePage = dynamic(
  async () => (await import("./profile")).ProfilePage,
  {
    loading: () => <Loading noLogo />,
  },
);

const CharacterPage = dynamic(
  async () => (await import("./character")).CharacterPage,
  {
    loading: () => <Loading noLogo />,
  },
);

const SubscribePage = dynamic(
  async () => (await import("./subscribe")).SubscribePage,
  {
    loading: () => <Loading noLogo />,
  },
);

const ParityHubPage = dynamic(
  async () => (await import("./parity-hub")).ParityHubPage,
  {
    loading: () => <Loading noLogo />,
  },
);

const AccountHubPage = dynamic(
  async () => (await import("./account-hub")).AccountHubPage,
  {
    loading: () => <Loading noLogo />,
  },
);

export function useSwitchTheme() {
  const config = useAppConfig();

  useEffect(() => {
    document.body.classList.remove("light");
    document.body.classList.remove("dark");

    if (config.theme === "dark") {
      document.body.classList.add("dark");
    } else if (config.theme === "light") {
      document.body.classList.add("light");
    }

    const metaDescriptionDark = document.querySelector(
      'meta[name="theme-color"][media*="dark"]',
    );
    const metaDescriptionLight = document.querySelector(
      'meta[name="theme-color"][media*="light"]',
    );

    if (config.theme === "auto") {
      metaDescriptionDark?.setAttribute("content", "#151515");
      metaDescriptionLight?.setAttribute("content", "#fafafa");
    } else {
      const themeColor = getCSSVar("--theme-color");
      metaDescriptionDark?.setAttribute("content", themeColor);
      metaDescriptionLight?.setAttribute("content", themeColor);
    }
  }, [config.theme]);
}

function useHtmlLang() {
  useEffect(() => {
    const lang = getISOLang();
    const htmlLang = document.documentElement.lang;

    if (lang !== htmlLang) {
      document.documentElement.lang = lang;
    }
  }, []);
}

const useHasHydrated = () => {
  const [hasHydrated, setHasHydrated] = useState<boolean>(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  return hasHydrated;
};

const loadAsyncGoogleFont = () => {
  const linkEl = document.createElement("link");
  const proxyFontUrl = "/google-fonts";
  const remoteFontUrl = "https://fonts.googleapis.com";
  const googleFontUrl =
    getClientConfig()?.buildMode === "export" ? remoteFontUrl : proxyFontUrl;
  linkEl.rel = "stylesheet";
  linkEl.href =
    googleFontUrl +
    "/css2?family=" +
    encodeURIComponent("Noto Sans:wght@300;400;700;900") +
    "&display=swap";
  document.head.appendChild(linkEl);
};

export function WindowContent(props: { children: React.ReactNode }) {
  return (
    <div className={styles["window-content"]} id={SlotID.AppBody}>
      {props?.children}
    </div>
  );
}

function Screen() {
  const config = useAppConfig();
  const location = useLocation();
  const isArtifact = location.pathname.includes(Path.Artifacts);
  const isHome =
    location.pathname === Path.Home || location.pathname === Path.Explore;
  const isScene = location.pathname === Path.Scene;
  const isSceneChat = location.pathname.startsWith(Path.SceneChat + "/");
  const isProfile =
    location.pathname === Path.Profile ||
    location.pathname.startsWith(Path.Profile + "/");
  const isCharacter = location.pathname.startsWith(Path.Character + "/");
  const isCreate = location.pathname === Path.NewChat;
  const isAccountHub = [
    Path.Inbox,
    Path.Membership,
    Path.Credits,
    Path.Settings,
  ].includes(location.pathname as Path);
  const isSubscribe = location.pathname === Path.Subscribe;
  const isParityHub = [
    Path.Games,
    Path.Gacha,
    Path.Feed,
    Path.Resources,
    Path.Changelog,
    Path.Download,
    Path.Support,
    Path.Privacy,
    Path.Terms,
  ].includes(location.pathname as Path);
  const isAuth = location.pathname === Path.Auth;
  const isSd = location.pathname === Path.Sd;
  const isSdNew = location.pathname === Path.SdNew;

  const isMobileScreen = useMobileScreen();
  const isImmersive =
    isAuth ||
    isHome ||
    isScene ||
    isSubscribe ||
    isSceneChat ||
    isProfile ||
    isCharacter ||
    isCreate ||
    isAccountHub ||
    isParityHub;
  const shouldTightBorder =
    getClientConfig()?.isApp || (config.tightBorder && !isMobileScreen);

  useEffect(() => {
    loadAsyncGoogleFont();
  }, []);

  if (isArtifact) {
    return (
      <Routes>
        <Route path="/artifacts/:id" element={<Artifacts />} />
      </Routes>
    );
  }
  const renderContent = () => {
    if (isAuth) return <AuthPage />;
    if (isHome) return <ExplorePage />;
    if (isScene) return <ScenePage />;
    if (isSceneChat) return <SceneChatPage />;
    if (isProfile) return <ProfilePage />;
    if (isCharacter) return <CharacterPage />;
    if (isCreate) return <NewChat />;
    if (isAccountHub) return <AccountHubPage />;
    if (isSubscribe) return <SubscribePage />;
    if (isParityHub) return <ParityHubPage />;
    if (isSd) return <Sd />;
    if (isSdNew) return <Sd />;
    return (
      <>
        {isMobileScreen ? (
          <SideBar
            className={clsx({
              [styles["sidebar-show"]]: isHome,
            })}
          />
        ) : (
          <TelloriaSidebar />
        )}
        <WindowContent>
          <Routes>
            <Route path={Path.Home} element={<Chat />} />
            <Route path={Path.NewChat} element={<NewChat />} />
            <Route path={Path.Masks} element={<MaskPage />} />
            <Route path={Path.Plugins} element={<PluginPage />} />
            <Route path={Path.SearchChat} element={<SearchChat />} />
            <Route path={Path.Chat} element={<Chat />} />
            <Route path={Path.AdvancedSettings} element={<Settings />} />
            <Route path={Path.McpMarket} element={<McpMarketPage />} />
          </Routes>
        </WindowContent>
      </>
    );
  };

  return (
    <div
      id="telloria-main"
      tabIndex={-1}
      className={clsx(styles.container, {
        [styles["tight-container"]]: shouldTightBorder,
        [styles["immersive-container"]]: isImmersive,
        [styles["rtl-screen"]]: getLang() === "ar",
      })}
    >
      {renderContent()}
    </div>
  );
}

export function useLoadData() {
  const config = useAppConfig();

  const api: ClientApi = getClientApi(config.modelConfig.providerName);

  useEffect(() => {
    (async () => {
      const models = await api.llm.models();
      config.mergeModels(models);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export function Home() {
  useSwitchTheme();
  useLoadData();
  useHtmlLang();

  useEffect(() => {
    console.log("[Config] got config from build time", getClientConfig());
    useAccessStore.getState().fetch();

    const initMcp = async () => {
      try {
        const enabled = await isMcpEnabled();
        if (enabled) {
          console.log("[MCP] initializing...");
          await initializeMcpSystem();
          console.log("[MCP] initialized");
        }
      } catch (err) {
        console.error("[MCP] failed to initialize:", err);
      }
    };
    initMcp();
  }, []);

  if (!useHasHydrated()) {
    return <Loading />;
  }

  return (
    <ErrorBoundary>
      <a className={styles["skip-link"]} href="#telloria-main">
        Skip to main content
      </a>
      <Router>
        <Screen />
      </Router>
    </ErrorBoundary>
  );
}
