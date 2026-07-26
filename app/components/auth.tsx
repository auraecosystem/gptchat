import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn } from "next-auth/react";
import { Path } from "../constant";
import { showToast } from "./ui-lib";
import styles from "./auth.module.scss";

type AuthStep =
  | "closed"
  | "email"
  | "login-password"
  | "verify-code"
  | "set-password";
type UiLang = "en" | "zh-CN";

type StoredUser = {
  password: string;
  createdAt: string;
};

type StoredUsers = Record<string, StoredUser>;

const USERS_STORAGE_KEY = "telloria-auth-users";
const DOMAIN_HINTS = ["@gmail.com", "@icloud.com", "@hotmail.com"];

function getUsers(): StoredUsers {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as StoredUsers;
  } catch {
    return {};
  }
}

function saveUsers(users: StoredUsers) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function detectLanguage(): UiLang {
  if (typeof navigator === "undefined") return "en";
  return navigator.language.toLowerCase().startsWith("zh") ? "zh-CN" : "en";
}

const content = {
  en: {
    brand: "(telloria.ai)",
    subtitle: "AI Interactive Stories",
    heroTitle: "Chat with Millions of AI Characters",
    intro: "Visit millions of characters and start in seconds.",
    features: [
      "Chat with Millions of AI Character",
      "Adaptive Story Writing",
      "Endless Worlds to Explore",
      "Less Filter with Best AI Models",
      "Immersive Interactive Visuals",
    ],
    google: "Continue with Google",
    apple: "Continue with Apple",
    other: "Other options",
    emailTitle: "Enter email",
    emailHint:
      "Existing email signs in. New email continues with verification.",
    emailPlaceholder: "Continue with Email",
    passwordPlaceholder: "Enter password",
    codePlaceholder: "Enter email verification code",
    sendCode: "Send code",
    continue: "Continue",
    verify: "Verify",
    setPassword: "Join",
    back: "Back",
    agreementPrefix: "By continuing, you agree to our ",
    terms: "Terms",
    and: " and acknowledge our ",
    privacy: "Privacy Policy",
    errors: {
      invalidEmail: "Please enter a valid email.",
      emptyPassword: "Password must be at least 6 characters.",
      badPassword: "Incorrect password.",
      badCode: "Verification code is incorrect.",
    },
    done: {
      codeSent: "Verification code sent (demo): ",
      signedIn: "Signed in successfully.",
      registered: "Account created successfully.",
      oauthSoon: "OAuth entry is ready. Backend can be connected next.",
    },
  },
  "zh-CN": {
    brand: "(telloria.ai)",
    subtitle: "AI 互动故事",
    heroTitle: "与数百万 AI 角色对话",
    intro: "访问千万级角色，10 秒完成进入。",
    features: [
      "Chat with Millions of AI Character",
      "Adaptive Story Writing",
      "Endless Worlds to Explore",
      "Less Filter with Best AI Models",
      "Immersive Interactive Visuals",
    ],
    google: "使用 Google 继续",
    apple: "使用 Apple 继续",
    other: "Other options",
    emailTitle: "输入邮箱",
    emailHint: "邮箱存在则登录，不存在则验证码注册。",
    emailPlaceholder: "使用电子邮件继续",
    passwordPlaceholder: "输入密码",
    codePlaceholder: "输入邮件验证码",
    sendCode: "发送验证码",
    continue: "继续",
    verify: "验证",
    setPassword: "加入",
    back: "返回",
    agreementPrefix: "继续即表示你同意我们的",
    terms: "条款",
    and: "并确认我们的",
    privacy: "隐私政策",
    errors: {
      invalidEmail: "请输入有效邮箱。",
      emptyPassword: "密码至少 6 位。",
      badPassword: "密码错误。",
      badCode: "验证码不正确。",
    },
    done: {
      codeSent: "验证码已发送（演示）: ",
      signedIn: "登录成功。",
      registered: "注册成功。",
      oauthSoon: "OAuth 入口已就绪，可继续接后端。",
    },
  },
};

export function AuthPage() {
  const navigate = useNavigate();
  const [lang, setLang] = useState<UiLang>("en");
  const [step, setStep] = useState<AuthStep>("closed");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [featureIndex, setFeatureIndex] = useState(0);

  const t = useMemo(() => content[lang], [lang]);
  const activeFeature = t.features[featureIndex % t.features.length];

  useEffect(() => {
    const applySystemLanguage = () => {
      const next = detectLanguage();
      setLang(next);
      document.documentElement.lang = next === "zh-CN" ? "zh-CN" : "en";
    };
    applySystemLanguage();
    window.addEventListener("languagechange", applySystemLanguage);
    return () =>
      window.removeEventListener("languagechange", applySystemLanguage);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setFeatureIndex((v) => (v + 1) % t.features.length);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [t.features.length]);

  const backToEmail = () => {
    setStep("email");
    setPassword("");
    setInputCode("");
  };

  const onContinueEmail = () => {
    const normalizedEmail = email.trim().toLowerCase();
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
    if (!isEmailValid) {
      showToast(t.errors.invalidEmail);
      return;
    }
    const users = getUsers();
    if (users[normalizedEmail]) {
      setStep("login-password");
      return;
    }
    setStep("verify-code");
  };

  const onSendCode = () => {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setVerificationCode(code);
    showToast(t.done.codeSent + code, undefined, 5000);
  };

  const onVerifyCode = () => {
    if (!verificationCode) {
      onSendCode();
      return;
    }
    if (inputCode.trim() !== verificationCode) {
      showToast(t.errors.badCode);
      return;
    }
    setStep("set-password");
  };

  const onLoginWithPassword = () => {
    const normalizedEmail = email.trim().toLowerCase();
    const users = getUsers();
    const user = users[normalizedEmail];
    if (!user || user.password !== password) {
      showToast(t.errors.badPassword);
      return;
    }
    showToast(t.done.signedIn);
    navigate(Path.Home);
  };

  const onSetPassword = () => {
    if (password.trim().length < 6) {
      showToast(t.errors.emptyPassword);
      return;
    }
    const normalizedEmail = email.trim().toLowerCase();
    const users = getUsers();
    users[normalizedEmail] = {
      password,
      createdAt: new Date().toISOString(),
    };
    saveUsers(users);
    showToast(t.done.registered);
    navigate(Path.Home);
  };

  const fillDomain = (domain: string) => {
    if (email.includes("@")) return;
    setEmail(`${email}${domain}`);
  };

  const startOAuth = async (provider: "google" | "apple") => {
    if (typeof window === "undefined") return;
    const callbackUrl = `${window.location.origin}/`;
    await signIn(provider, { callbackUrl });
  };

  const renderFlowCard = () => {
    if (step === "closed") return null;
    return (
      <div className={styles["email-flow"]}>
        <div className={styles["flow-top"]}>
          {step !== "email" && (
            <button className={styles["back-button"]} onClick={backToEmail}>
              ←
            </button>
          )}
          <div className={styles["flow-title"]}>{t.emailTitle}</div>
        </div>
        <div className={styles["flow-hint"]}>{t.emailHint}</div>

        <input
          className={styles["flow-input"]}
          type="email"
          placeholder={t.emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          disabled={step !== "email"}
        />

        {step === "email" && (
          <div className={styles["domain-list"]}>
            {DOMAIN_HINTS.map((domain) => (
              <button
                key={domain}
                className={styles["domain-pill"]}
                onClick={() => fillDomain(domain)}
              >
                {domain}
              </button>
            ))}
          </div>
        )}

        {(step === "login-password" || step === "set-password") && (
          <input
            className={styles["flow-input"]}
            type="password"
            placeholder={t.passwordPlaceholder}
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
        )}

        {step === "verify-code" && (
          <div className={styles["flow-row"]}>
            <input
              className={styles["flow-input"]}
              type="text"
              placeholder={t.codePlaceholder}
              value={inputCode}
              onChange={(e) => setInputCode(e.currentTarget.value)}
            />
            <button className={styles["flow-secondary"]} onClick={onSendCode}>
              {t.sendCode}
            </button>
          </div>
        )}

        {step === "email" && (
          <button className={styles["flow-primary"]} onClick={onContinueEmail}>
            {t.continue}
          </button>
        )}
        {step === "login-password" && (
          <button
            className={styles["flow-primary"]}
            onClick={onLoginWithPassword}
          >
            {t.continue}
          </button>
        )}
        {step === "verify-code" && (
          <button className={styles["flow-primary"]} onClick={onVerifyCode}>
            {t.verify}
          </button>
        )}
        {step === "set-password" && (
          <button className={styles["flow-primary"]} onClick={onSetPassword}>
            {t.setPassword}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className={styles["auth-page"]} data-flow-open={step !== "closed"}>
      <div className={styles["orbit-ring-one"]}></div>
      <div className={styles["orbit-ring-two"]}></div>
      <div className={styles["avatar-chip-a"]}>⚔</div>
      <div className={styles["avatar-chip-b"]}>🧙</div>
      <div className={styles["avatar-chip-c"]}>🤖</div>

      <header className={styles["top-bar"]}>
        <div className={styles["brand"]}>{t.brand}</div>
        <div className={styles["top-actions"]}>
          <button className={styles["top-action"]}>Sign up</button>
          <button className={styles["top-action"]}>Log in</button>
        </div>
      </header>

      <main className={styles["stage"]}>
        <section className={styles["desktop-area"]}>
          <div className={styles["login-column"]}>
            <div className={styles["login-card"]}>
              <h2>{t.heroTitle}</h2>
              <p>{t.intro}</p>

              <button
                className={styles["social-button"]}
                onClick={() => startOAuth("google")}
              >
                <span className={styles["social-icon"]}>G</span>
                {t.google}
              </button>
              <button
                className={styles["social-button"]}
                onClick={() => startOAuth("apple")}
              >
                <span className={styles["social-icon"]}></span>
                {t.apple}
              </button>
              <button
                className={styles["other-options"]}
                onClick={() => setStep(step === "closed" ? "email" : "closed")}
              >
                {t.other}
              </button>

              {renderFlowCard()}

              <p className={styles["agreement"]}>
                {t.agreementPrefix}
                <a href="#" onClick={(e) => e.preventDefault()}>
                  {t.terms}
                </a>
                {t.and}
                <a href="#" onClick={(e) => e.preventDefault()}>
                  {t.privacy}
                </a>
              </p>
            </div>
          </div>

          <div className={styles["media-panel"]}>
            <div className={styles["media-glow"]}></div>
            <div className={styles["desktop-hero-text"]}>
              <h1>{activeFeature}</h1>
            </div>
          </div>
        </section>

        <div className={styles["mobile-hero-text"]}>
          <h1>{activeFeature}</h1>
        </div>

        <section className={styles["mobile-sheet"]}>
          <button
            className={styles["social-button"]}
            onClick={() => startOAuth("apple")}
          >
            <span className={styles["social-icon"]}></span>
            {t.apple}
          </button>
          <button
            className={styles["social-button"]}
            onClick={() => startOAuth("google")}
          >
            <span className={styles["social-icon"]}>G</span>
            {t.google}
          </button>
          <button
            className={styles["other-options"]}
            onClick={() => setStep(step === "closed" ? "email" : "closed")}
          >
            {t.other}
          </button>

          {renderFlowCard()}

          <p className={styles["agreement"]}>
            {t.agreementPrefix}
            <a href="#" onClick={(e) => e.preventDefault()}>
              {t.terms}
            </a>
            {t.and}
            <a href="#" onClick={(e) => e.preventDefault()}>
              {t.privacy}
            </a>
          </p>
        </section>
      </main>

      <footer className={styles.footer}>copyright Appkon.com</footer>
    </div>
  );
}
