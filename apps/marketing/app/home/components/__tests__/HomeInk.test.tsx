import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { HomeInkHeader } from "../HomeInkHeader";
import { HomeInkHero } from "../HomeInkHero";
import { HomeInkSections } from "../HomeInkSections";
import { HomeInkFooter } from "../HomeInkFooter";
import { HomeInkEffects } from "../HomeInkEffects";
import BenefitsPage from "../../../benefits/page";
import HowWeDoItDifferentlyPage from "../../../how-we-do-it-differently/page";

// The modal provider pulls next/navigation + modal CSS chains; the ink
// components only need its CTA openers, so stub the hook.
vi.mock("../HomeModalProvider", () => ({
  useHomeModals: () => ({
    openTwoMinuteCheck: vi.fn(),
    openIntake: vi.fn(),
  }),
  HomeModalProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

function renderInk() {
  return render(
    <div className="home-ink">
      <HomeInkHeader />
      <HomeInkHero />
      <HomeInkSections />
      <HomeInkFooter />
    </div>,
  );
}

describe("HomeInk (DeepBook-ink homepage, 2026-11-27)", () => {
  it("announcement banner links to /benefits with Stefano's text", () => {
    renderInk();
    const banner = screen.getByRole("link", { name: /See why employees love us!/ });
    expect(banner.getAttribute("href")).toBe("/benefits");
  });

  it("pill nav: one-line wordmark, four links, gold Check pill", () => {
    const { container } = renderInk();
    expect(screen.getAllByText("FORHEMIT").length).toBeGreaterThan(0);
    const nav = container.querySelector(".ink-nav");
    expect(nav).not.toBeNull();
    const gold = Array.from(container.querySelectorAll(".ink-gold")).map((el) => el.textContent);
    expect(gold).toEqual(["Take the 2-Minute Check", "Take the 2-Minute Check"]);
  });

  it("hero: ruled headline, third-option subhead, dual CTAs, fine print, video", () => {
    const { container } = renderInk();
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "Sell Your Business to Your Employees",
    );
    expect(container.textContent).toContain(
      "The third option. Not a broker. Not private equity. Your own people.",
    );
    expect(screen.getByRole("button", { name: /I’m a business owner/ })).toBeTruthy();
    expect(screen.getByRole("link", { name: /I’m a professional/ }).getAttribute("href")).toBe(
      "/#professionals",
    );
    expect(container.textContent).toContain(
      "Free 2-Minute Check · No obligation · No personal guarantee",
    );
    // F2: src + poster live on the <video> element itself (no <source> child).
    const video = container.querySelector(".ink-hero-video");
    expect(video?.getAttribute("src")).toBe(
      "https://videos.pexels.com/video-files/8643577/8643577-hd_1920_1080_24fps.mp4",
    );
    expect(video?.getAttribute("poster")).toBe("/images/hero-employees.jpg");
    expect(video?.querySelector("source")).toBeNull();
    // Hero audience CTAs are NOT gold — gold is reserved for the Check buttons.
    const owner = screen.getByRole("button", { name: /I’m a business owner/ });
    expect(owner.className).not.toContain("ink-gold");
  });

  it("counters carry exactly the four ruled numbers", () => {
    const { container } = renderInk();
    const counts = Array.from(container.querySelectorAll("[data-count]")).map((el) =>
      el.getAttribute("data-count"),
    );
    expect(counts).toEqual(["120", "4", "100", "3000"]);
    expect(container.textContent).toContain("employee-owned at close — your people own it all");
    expect(container.textContent).toContain("Self Guided, flat — the map, the documents, the support");
  });

  it("comparison: three paths with the employees card featured", () => {
    renderInk();
    expect(screen.getByRole("heading", { name: "Every owner hears two options. There are three." })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Sell to a broker or stranger" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Sell to private equity" })).toBeTruthy();
    const featured = screen.getByRole("heading", { name: "Sell to your employees" }).closest("article");
    expect(featured?.className).toContain("ink-featured");
  });

  it("proof cards link to the prototype's anchors", () => {
    renderInk();
    expect(screen.getByRole("link", { name: /The cost test/ }).getAttribute("href")).toBe("#cost-test");
    expect(screen.getByRole("link", { name: /Documents-Ready, defined/ }).getAttribute("href")).toBe(
      "#documents-ready",
    );
    expect(screen.getByRole("link", { name: /The Evidence Register/ }).getAttribute("href")).toBe("#evidence");
  });

  it("how it works heading is Stefano's exact edit", () => {
    renderInk();
    expect(screen.getByRole("heading", { name: "Four steps. Four Months." })).toBeTruthy();
    for (const step of ["2-Minute Check", "Company Fit", "Application", "120-day transition"]) {
      expect(screen.getByRole("heading", { name: step })).toBeTruthy();
    }
  });

  it("terms section carries Stefano's final copy", () => {
    const { container } = renderInk();
    expect(screen.getByRole("heading", { name: "Leave on your own terms, in your own time." })).toBeTruthy();
    expect(container.textContent).toContain(
      "Leave now or 5 years from now. It’s your decision and you have a plan in place for your business to continue being successful after you decide to step away from the chair.",
    );
    expect(screen.getByRole("heading", { name: "You keep control" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "A roadmap you approve" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "A timeline you choose" })).toBeTruthy();
    expect(container.textContent).toContain("CEO and Chairman of the Board");
  });

  it("founder statement is three blocks with the Different link", () => {
    const { container } = renderInk();
    const blocks = container.querySelectorAll(".ink-statement-grid > *");
    expect(blocks.length).toBe(3);
    expect(blocks[0].textContent).toBe("Forhemit was founded in 2026.");
    expect(blocks[1].textContent).toBe("We are disrupting an industry of gatekeepers.");
    expect(blocks[1].querySelector(".ink-accent")?.textContent).toBe("gatekeepers");
    expect(blocks[2].textContent).toContain(
      "We started in 2026 because we saw how the process was long, disjointed, and expensive because of delays and avoidable complications.",
    );
    const link = screen.getByRole("link", { name: /Find Out How We’re Different/ });
    expect(link.getAttribute("href")).toBe("/how-we-do-it-differently");
  });

  it("closing: 'This is free.' sits left of the gold button, phone below", () => {
    renderInk();
    expect(screen.getByRole("heading", { name: "Find out if the third option fits." })).toBeTruthy();
    const free = screen.getByText("This is free.");
    const buttons = screen.getAllByRole("button", { name: "Take the 2-Minute Check" });
    const closingBtn = buttons[buttons.length - 1];
    expect(closingBtn.className).toContain("ink-gold");
    // Free text precedes the closing button in DOM order (same row, left side).
    expect(
      free.compareDocumentPosition(closingBtn) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    const phoneLinks = screen.getAllByRole("link", { name: "(510) 405-4330" });
    expect(phoneLinks.length).toBe(2); // closing section + footer
    phoneLinks.forEach((l) => expect(l.getAttribute("href")).toBe("tel:+15104054330"));
  });

  it("footer carries the canonical phone and email", () => {
    renderInk();
    expect(
      screen.getByRole("link", { name: "Stefano.stokes@forhemit.com" }).getAttribute("href"),
    ).toBe("mailto:Stefano.stokes@forhemit.com");
  });

  it("canonical language: Section 1042 is never called tax-free", () => {
    const { container } = renderInk();
    expect(container.textContent?.toLowerCase()).not.toContain("tax-free");
    expect(container.textContent?.toLowerCase()).not.toContain("tax free");
  });
});

describe("Fix pass 2026-11-27 (F1/F4/F5)", () => {
  // The subpages mount HomeInkEffects, which reads matchMedia — jsdom has
  // none, so stub the non-reduced-motion case for this block.
  beforeEach(() => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    );
  });
  // import.meta.url is not a file URL under this vitest setup; resolve the
  // stylesheet from whichever cwd the suite runs in (app dir or repo root).
  const cssPath = [
    join(process.cwd(), "app/home/styles/home-ink.css"),
    join(process.cwd(), "apps/marketing/app/home/styles/home-ink.css"),
  ].find((p) => existsSync(p));
  if (!cssPath) throw new Error("home-ink.css not found from cwd " + process.cwd());
  const css = readFileSync(cssPath, "utf-8");

  it("F1: ink headings declare their own family and per-surface colors", () => {
    // Base rule beats the global dark-serif element rule (0-1-1 > 0-0-1).
    expect(css).toMatch(/\.home-ink h1,\s*\.home-ink h2,\s*\.home-ink h3,\s*\.home-ink h4\s*{[^}]*font-family:[^}]*color: var\(--ink-text\)/);
    expect(css).toContain(".home-ink .ink-hero h1 { color: var(--ink-paper); }");
    expect(css).toMatch(/\.home-ink \.ink-dark h1,\s*\.home-ink \.ink-dark h2,\s*\.home-ink \.ink-dark h3\s*{\s*color: var\(--ink-paper\);/);
    expect(css).toContain(".home-ink .ink-compare-card.ink-featured h3 { color: var(--ink-paper); }");
    // Hero carries the poster frame as a CSS background fallback (F2).
    expect(css).toContain('url("/images/hero-employees.jpg")');
  });

  it("F3: reveal fades are ≤500ms", () => {
    const durations = Array.from(css.matchAll(/\.ink-reveal[^{]*{[^}]*transition: opacity (0\.\d+)s/g)).map(
      (m) => parseFloat(m[1]),
    );
    expect(durations.length).toBeGreaterThan(0);
    durations.forEach((d) => expect(d).toBeLessThanOrEqual(0.5));
  });

  it("F5: founder statement carries id=about and the nav About link targets it", () => {
    const { container } = renderInk();
    expect(container.querySelector(".ink-statement")?.getAttribute("id")).toBe("about");
    const aboutLinks = screen.getAllByRole("link", { name: "About" });
    expect(aboutLinks.length).toBeGreaterThan(0);
    aboutLinks.forEach((l) => expect(l.getAttribute("href")).toBe("/#about"));
  });

  it("F4: /benefits renders its headline and the closing pattern", () => {
    const { container } = render(<BenefitsPage />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("See why employees love us");
    expect(container.textContent).toContain("An ownership stake in the company you work for");
    expect(container.textContent).toContain("Retirement wealth, built at work");
    expect(container.textContent).toContain("This is free.");
    expect(container.textContent?.toLowerCase()).not.toContain("tax-free");
  });

  it("F4: /how-we-do-it-differently renders its headline, fees, and deferral language", () => {
    const { container } = render(<HowWeDoItDifferentlyPage />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "No gatekeepers. Everything in the open.",
    );
    expect(container.textContent).toContain("$3,000");
    expect(container.textContent).toContain("120-day clock");
    expect(container.textContent).toContain("tax-deferred");
    expect(container.textContent?.toLowerCase()).not.toContain("tax-free");
  });
});

describe("HomeInkEffects (reduced motion)", () => {
  it("reveals everything immediately, keeps counter finals, removes the video", () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockImplementation((query: string) => ({
        matches: query.includes("prefers-reduced-motion"),
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    );
    const { container } = render(
      <div className="home-ink">
        <HomeInkHero />
        <HomeInkSections />
        <HomeInkEffects />
      </div>,
    );
    const reveals = container.querySelectorAll(".ink-reveal");
    expect(reveals.length).toBeGreaterThan(0);
    reveals.forEach((el) => expect(el.classList.contains("ink-in")).toBe(true));
    expect(container.querySelector(".ink-hero-video")).toBeNull();
    const counts = Array.from(container.querySelectorAll("[data-count]")).map(
      (el) => el.textContent,
    );
    expect(counts).toEqual(["120", "4", "100", "3,000"]);
    vi.unstubAllGlobals();
  });
});
