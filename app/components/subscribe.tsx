import { useMemo, useState } from "react";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import { Path } from "../constant";
import { useMobileScreen } from "../utils";
import { TelloriaSidebar } from "./telloria-sidebar";
import styles from "./subscribe.module.scss";

type BillingCycle = "monthly" | "quarterly" | "yearly";

type Feature = {
  title: string;
  detail?: string;
};

type Plan = {
  id: "free" | "lite" | "pro" | "ultra";
  title: string;
  subtitle: string;
  monthlyPrice: number;
  featured?: boolean;
  features: Feature[];
};

const CYCLES: {
  id: BillingCycle;
  label: string;
  periodLabel: string;
  multiplier: number;
}[] = [
  { id: "monthly", label: "Monthly", periodLabel: "month", multiplier: 1 },
  {
    id: "quarterly",
    label: "Quarterly",
    periodLabel: "quarter",
    multiplier: 3,
  },
  { id: "yearly", label: "Yearly", periodLabel: "year", multiplier: 12 },
];

const PLANS: Plan[] = [
  {
    id: "free",
    title: "Free",
    subtitle: "Basic access with essential features",
    monthlyPrice: 0,
    features: [
      { title: "10 Daily credits" },
      { title: "1 Free chat models" },
      { title: "5 Daily voice messages" },
      { title: "5 Daily smart replies" },
      { title: "Limited Context Memory" },
    ],
  },
  {
    id: "lite",
    title: "Lite",
    subtitle: "More room for everyday stories",
    monthlyPrice: 4.9,
    features: [
      { title: "40 Daily Credits" },
      { title: "Ad Free Experience" },
      { title: "Extended Context Memory" },
      { title: "10 Daily voice messages" },
      { title: "10 Daily smart replies" },
      { title: "5 Character Slots" },
    ],
  },
  {
    id: "pro",
    title: "Pro",
    subtitle: "Unlock advanced creation features",
    monthlyPrice: 9.9,
    featured: true,
    features: [
      { title: "100 Daily Credits" },
      { title: "Ad Free Experience" },
      { title: "Access to Premium Models" },
      { title: "Unlock Concise Chat Mode" },
      { title: "Extended Context Memory" },
      { title: "Faster Model Response" },
      { title: "Quick Bot Memory Tweaks" },
      { title: "Custom Model Tuning" },
      { title: "30 Daily voice messages" },
      { title: "30 Daily smart replies" },
      { title: "Daily Image Gen Quota" },
      { title: "Unlimited Character Slots" },
      { title: "Early Access" },
      { title: "Plus Support Channel" },
      { title: "Plus Only Visuals" },
    ],
  },
  {
    id: "ultra",
    title: "Ultra",
    subtitle: "Full access to all features for unlimited use",
    monthlyPrice: 19.9,
    features: [
      { title: "Unlock Romantic Chat Mode" },
      {
        title: "300 Daily Credits",
        detail:
          "Deep interactions with our best models, cheaper than buying a la carte.",
      },
      {
        title: "Custom Chat Backgrounds",
        detail:
          "Upload unique backdrops for each character and double your immersion.",
      },
      {
        title: "Max Context Memory",
        detail:
          "Our deepest memory yet that remembers every plot twist and complex relationship detail.",
      },
      {
        title: "Top Priority Model Response",
        detail: "Enjoy a dedicated fast lane for lightning-quick replies.",
      },
      {
        title: "Unlimited Smart Replies",
        detail:
          "One tap, limitless directions, take full control of every dialogue and story arc.",
      },
      {
        title: "Unlimited Daily Voice Messages",
        detail:
          "Hands-free chatting all day, morning wake-ups, midnight talks, and everything in between.",
      },
      {
        title: "30 Daily Image Gen",
        detail: "Explore styles, scenes, and outfits.",
      },
      {
        title: "Access to Premium Models",
        detail:
          "Instant access to six specialty models for storytelling, chain-of-thought reasoning, lifelike simulation, and more.",
      },
      {
        title: "Ad-Free Experience",
        detail: "Pure, immersive chats with absolutely zero ads.",
      },
      {
        title: "Unlimited Chat",
        detail:
          "High-frequency, lag-free conversations whenever inspiration strikes.",
      },
      {
        title: "Custom Model Tuning",
        detail:
          "Set prompt style, tone, length, emotion, and logic. Your model, your rules.",
      },
      {
        title: "Full Bot Memory Builder",
        detail:
          "Craft a rich persona with detailed backstory and layered relationships.",
      },
      {
        title: "Member-Only Visuals",
        detail:
          "Exclusive profile backgrounds and avatar frames that showcase your premium status.",
      },
      {
        title: "Members Support Channel",
        detail:
          "Personalized assistance whenever you need it. Your questions are our top priority.",
      },
      {
        title: "Unlimited Character Slots",
        detail:
          "Create as many companions as you imagine, partners, confidants, idols, or fantasy heroes.",
      },
      {
        title: "Early Access",
        detail:
          "Try new models, features, and interaction modes before anyone else.",
      },
    ],
  },
];

function formatPrice(value: number) {
  if (value === 0) return "0";
  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
}

export function SubscribePage() {
  const navigate = useNavigate();
  const isMobile = useMobileScreen();
  const [cycle, setCycle] = useState<BillingCycle>("monthly");

  const activeCycle = useMemo(
    () => CYCLES.find((item) => item.id === cycle) ?? CYCLES[0],
    [cycle],
  );

  return (
    <div className={styles["subscribe-page"]}>
      {!isMobile && <TelloriaSidebar />}

      <div className={styles["subscribe-main"]}>
        <header className={styles.header}>
          <button
            className={styles["back-button"]}
            onClick={() => navigate(Path.Home)}
          >
            ← Back
          </button>
          <div className={styles.brand}>Tale+</div>
        </header>

        <main className={styles.content}>
          <section className={styles.hero}>
            <h1>Explore Infinite Stories with Tale Plus</h1>
            <p>Get access to everything on Telloria - Cancel Anytime</p>
          </section>

          <section className={styles["billing-switch"]}>
            {CYCLES.map((item) => (
              <button
                key={item.id}
                className={clsx(styles["billing-option"], {
                  [styles.active]: item.id === cycle,
                })}
                onClick={() => setCycle(item.id)}
              >
                {item.label}
              </button>
            ))}
          </section>

          <section className={styles["plans-grid"]}>
            {PLANS.map((plan) => {
              const cyclePrice = Number(
                (plan.monthlyPrice * activeCycle.multiplier).toFixed(1),
              );

              return (
                <article
                  key={plan.id}
                  className={clsx(styles.plan, {
                    [styles.featured]: !!plan.featured,
                  })}
                >
                  <div className={styles["plan-head"]}>
                    <h2>{plan.title}</h2>
                    <p>{plan.subtitle}</p>
                  </div>

                  <div className={styles["plan-price"]}>
                    <span className={styles["price-sign"]}>$</span>
                    <span className={styles["price-value"]}>
                      {formatPrice(cyclePrice)}
                    </span>
                    <span className={styles["price-period"]}>
                      /{activeCycle.periodLabel}
                    </span>
                  </div>

                  <div className={styles["plan-note"]}>
                    {plan.monthlyPrice === 0
                      ? "Always free"
                      : cycle === "monthly"
                      ? `${plan.monthlyPrice.toFixed(1)} dollars /month`
                      : `${plan.monthlyPrice.toFixed(
                          1,
                        )} dollars /month billed ${activeCycle.label.toLowerCase()}`}
                  </div>

                  <ul className={styles.benefits}>
                    {plan.features.map((feature) => (
                      <li key={feature.title}>
                        <span>{feature.title}</span>
                        {feature.detail && <p>{feature.detail}</p>}
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </section>
        </main>
      </div>
    </div>
  );
}
