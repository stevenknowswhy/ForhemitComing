"use client";

import { lazy, Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ClientOnly } from "@/components/ClientOnly";
import "@forhemit/shared/styles/beyond-balance-sheet.css";

const TwoMinuteCheckModal = lazy(() =>
  import("@/app/home/intake").then((mod) => ({ default: mod.TwoMinuteCheckModal }))
);

export function EmployeesPayPageClient() {
  const router = useRouter();
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [showTwoMinuteCheck, setShowTwoMinuteCheck] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.08 }
    );

    document.querySelectorAll(".bbs-section").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bbs-wrapper">
      <div className="bbs-background"></div>

      <main className="bbs-main">
        {/* Hero + answer block */}
        <section id="hero" className={`bbs-section bbs-hero ${visibleSections.has("hero") ? "visible" : ""}`}>
          <div className="container">
            <div className="bbs-eyebrow">Essay</div>
            <p className="bbs-subhead" style={{ fontSize: "1rem", marginBottom: "1rem" }}>
              Published November 22, 2026 · By Stefano Stokes, Founder &amp; CEO
            </p>
            <h1 className="bbs-title">How do your employees actually pay for the company?</h1>
            <div className="bbs-content">
              <p className="bbs-lead">
                Your employees don&apos;t pay out of pocket, and they don&apos;t take
                personal loans. The buyer is an ESOP trust, created for them. A bank
                lends part of the price, you carry a note for the rest, and the
                company repays both from its own future profits. The business buys
                itself — and you get full price for it.
              </p>
            </div>
          </div>
        </section>

        {/* The buyer isn't a person. It's a trust. */}
        <section id="buyer" className={`bbs-section ${visibleSections.has("buyer") ? "visible" : ""}`}>
          <div className="container">
            <div className="bbs-label">The buyer</div>
            <h2 className="bbs-section-title">The buyer isn&apos;t a person. It&apos;s a trust.</h2>
            <div className="bbs-content">
              <p>
                When founders picture selling to their employees, they picture twenty
                people pooling savings and signing loan papers. That picture is why
                most of them never ask the next question.
              </p>
              <p>
                The actual buyer is a trust — an ESOP trust, created for the
                employees. The trust buys your shares. Your people don&apos;t write
                checks, don&apos;t pledge their houses, and don&apos;t take on personal
                debt. They receive ownership through the trust, over time, as the
                purchase is paid off. The risk sits with the transaction, where it
                belongs — not on your machinist&apos;s mortgage.
              </p>
            </div>
          </div>
        </section>

        {/* Where the money comes from */}
        <section id="money" className={`bbs-section ${visibleSections.has("money") ? "visible" : ""}`}>
          <div className="container">
            <div className="bbs-label">The money</div>
            <h2 className="bbs-section-title">Where the money comes from</h2>
            <div className="bbs-content">
              <p>
                The trust doesn&apos;t have money. It borrows it, the way any buyer does.
              </p>
              <p>
                Part of the price comes from outside financing — a bank loan, in some
                cases an SBA-backed loan. The rest is typically a note from you: the
                seller note. You lend the trust the balance of your own price, on
                paper, at closing.
              </p>
              <p>
                Then the company goes back to work. Its profits service the bank loan
                and pay down your note. Read that again, because it is the whole
                mechanism: <strong>the business buys itself, out of money it earns
                after the sale.</strong> Your employees &quot;pay for the company&quot; the
                only way they ever could — by running it well, as owners, for the
                years after you leave.
              </p>
            </div>
          </div>
        </section>

        {/* What you receive, and when */}
        <section id="receive" className={`bbs-section ${visibleSections.has("receive") ? "visible" : ""}`}>
          <div className="container">
            <div className="bbs-label">Your price</div>
            <h2 className="bbs-section-title">What you receive, and when</h2>
            <div className="bbs-content">
              <p>
                The price is not negotiated against a buyer&apos;s appetite. It is set by
                an independent valuation — fair market value, established by an
                appraiser who owes the number to the facts, not to either side of the
                table.
              </p>
              <p>
                You receive the financed portion at close. The seller-note portion
                arrives as payments over the following years, on a schedule set at
                closing. That is the honest shape of it: not one wire on one day, but
                a price set by independent valuation and paid on a timeline you can
                see in writing before you sign anything.
              </p>
              <p>
                And if your sale qualifies, Section 1042 lets you defer the
                capital-gains tax on it. Deferral is the word — the tax is postponed,
                not forgiven, and any advisor who tells you &quot;tax-free&quot; is selling
                you something.
              </p>
            </div>
            <blockquote className="bbs-pull-quote">
              Nobody at your company writes a check. The company pays for itself, out
              of the work it was already going to do.
            </blockquote>
            <p className="bbs-subhead" style={{ fontSize: "1rem", marginTop: "1rem" }}>
              — Stefano Stokes, Founder &amp; CEO
            </p>
          </div>
        </section>

        {/* What it costs */}
        <section id="costs" className={`bbs-section ${visibleSections.has("costs") ? "visible" : ""}`}>
          <div className="container">
            <div className="bbs-label">The cost</div>
            <h2 className="bbs-section-title">What it costs</h2>
            <div className="bbs-content">
              <p>
                Two different things get called &quot;the cost,&quot; and they should never
                be blurred.
              </p>
              <p>
                Forhemit&apos;s fee for building the purchase — our Custom Services — is
                3–5% of the company&apos;s valuation. That is our fee, and only our fee.
              </p>
              <p>
                The transaction also needs partners: lawyers, the independent
                valuation, the trustee who represents your employees, a feasibility
                study. Those are separate, and they are paid to them, not to us. At
                2026 market rates (NCEO): legal $50–150k, valuation $20–50k, trustee
                $25–70k, feasibility $25–50k. We publish these numbers because a
                founder who can see the whole stack can judge the whole stack —
                including us.
              </p>
            </div>
          </div>
        </section>

        {/* Who runs it, and how long it takes */}
        <section id="running" className={`bbs-section ${visibleSections.has("running") ? "visible" : ""}`}>
          <div className="container">
            <div className="bbs-label">The job</div>
            <h2 className="bbs-section-title">Who runs it, and how long it takes</h2>
            <div className="bbs-content">
              <p>
                An ESOP purchase is a financing, a valuation, a legal structure, and a
                handover, all closing on the same day. Somebody has to run it as one
                job. That is the whole of what Forhemit does — and after close, you
                stay available on call for 4–12 months, not hands-on, while the new
                owners find their feet.
              </p>
              <p>
                From the day your documents are ready, the purchase is built in 120
                days. Not &quot;someday,&quot; not a listing that expires: 120 days from
                Documents-Ready.
              </p>
            </div>
          </div>
        </section>

        {/* The honest part */}
        <section id="honest" className={`bbs-section ${visibleSections.has("honest") ? "visible" : ""}`}>
          <div className="container">
            <div className="bbs-label">The screen</div>
            <h2 className="bbs-section-title">The honest part: sometimes it doesn&apos;t pencil</h2>
            <div className="bbs-content">
              <p>
                This only works for a company that can carry it. Ours is a clear
                screen, and we&apos;d rather say it here than waste your year: $3M+ in
                revenue, 20+ verifiable U.S. employees, profitable, and a controlling
                stake of 51% or more to sell. Below that, the financing strains, the
                note gets risky, and the honest answer is that a different exit serves
                you better. We will tell you that in the first conversation if it&apos;s
                true.
              </p>
              <p>
                If you are above the line, the next step is the 2-Minute Check — the
                same screen, run on your numbers, before anyone sells you anything.
              </p>
            </div>
          </div>
        </section>

        {/* Closing: the 2-Minute Check + author bio */}
        <section id="closer" className={`bbs-section bbs-closer ${visibleSections.has("closer") ? "visible" : ""}`}>
          <div className="container">
            <div className="closer-box">
              <button
                type="button"
                className="bbs-cta-btn"
                onClick={() => setShowTwoMinuteCheck(true)}
              >
                Start the 2-Minute Check →
              </button>
              <p className="closer-sub" style={{ marginTop: "2rem" }}>
                Stefano Stokes is the Founder &amp; CEO of Forhemit, an
                employee-ownership succession firm. Forhemit was founded in 2026, and
                we say so. He leads every engagement personally.
              </p>
            </div>
          </div>
        </section>
      </main>

      <ClientOnly fallback={null}>
        {showTwoMinuteCheck && (
          <Suspense fallback={null}>
            <TwoMinuteCheckModal
              isOpen={showTwoMinuteCheck}
              onClose={() => setShowTwoMinuteCheck(false)}
              onPassProceed={() => {
                setShowTwoMinuteCheck(false);
                router.push("/four-month-path");
              }}
            />
          </Suspense>
        )}
      </ClientOnly>
    </div>
  );
}
