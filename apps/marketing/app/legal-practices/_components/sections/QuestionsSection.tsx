"use client";

import Image from "next/image";

export function QuestionsSection() {
  return (
    <section className="legal-section questions-section">
      <div className="container">
        <div className="section-header" data-animate="fade-up">
          <h2>Raise it first, and the whole option set is open</h2>
          <p className="section-intro">
            Put succession on the table before any broker, buyer, or letter of intent exists,
            and the conversation is a different one.
          </p>
        </div>

        <div className="questions-visual">
          {/* Question 1 - Image Left, Text Right */}
          <div className="question-row" data-animate="fade-up">
            <div className="question-image">
              <Image
                src="https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDeEk3OSLE239wP7JIxTHYvlCMa8pdWbngVFGq"
                alt="Business owner considering sale"
                width={3389}
                height={5088}
                sizes="(max-width: 900px) 100vw, 50vw"
              />
              <div className="question-image-overlay" />
            </div>
            <div className="question-content">
              <span className="question-label">The option founders never hear</span>
              <p className="question-text">
                Employee ownership is the option most founders never hear:{" "}
                <strong>
                  the employees buy 100% of the company, at a full price set by an independent
                  appraiser who works for neither side, in 120 days from Documents-Ready.
                </strong>{" "}
                Where the transaction qualifies, §1042 can provide tax-deferred treatment for
                eligible capital gains.
              </p>
            </div>
          </div>

          {/* Question 2 - Text Left, Image Right */}
          <div className="question-row reverse" data-animate="fade-up" data-delay="150">
            <div className="question-content">
              <span className="question-label">On the founder&apos;s timing</span>
              <p className="question-text">
                <strong>
                  Your client can get some of their exit money now, be available to the company
                  for a transition of 4 to 12 months after close — and after that, leave on
                  their own timing, not a buyer&apos;s.
                </strong>
              </p>
              <p className="question-text">
                We coordinate — never replace — the legal work of an ESOP transition: plan and
                trust documents with ERISA counsel, transaction documents, and the compliance
                calendar for DOL and IRS requirements.
              </p>
            </div>
            <div className="question-image">
              <Image
                src="https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDdGxJ5CeLAZPcI2XFHu8ORonq6MaQyfrGUBxS"
                alt="A business meeting"
                width={1835}
                height={2725}
                sizes="(max-width: 900px) 100vw, 50vw"
              />
              <div className="question-image-overlay" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
