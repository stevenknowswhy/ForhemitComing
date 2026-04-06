"use client";

export function QuestionsSection() {
  return (
    <section className="legal-section questions-section">
      <div className="container">
        <div className="section-header" data-animate="fade-up">
          <h2>Two Scenarios Worth Considering</h2>
          <p className="section-intro">Hard questions about continuity, control, and your firm&apos;s future.</p>
        </div>

        <div className="questions-visual">
          {/* Question 1 - Image Left, Text Right */}
          <div className="question-row" data-animate="fade-up">
            <div className="question-image">
              <img
                src="https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDeEk3OSLE239wP7JIxTHYvlCMa8pdWbngVFGq"
                alt="Business owner considering sale"
              />
              <div className="question-image-overlay" />
            </div>
            <div className="question-content">
              <span className="question-label">Scenario One</span>
              <p className="question-text">
                If your largest privately held client signed a letter of intent to sell tomorrow,{" "}
                <strong>
                  would you be leading the deal — or reading about it in a press release drafted by
                  someone else?
                </strong>
              </p>
            </div>
          </div>

          {/* Question 2 - Text Left, Image Right */}
          <div className="question-row reverse" data-animate="fade-up" data-delay="150">
            <div className="question-content">
              <span className="question-label">Scenario Two</span>
              <p className="question-text">
                If a private equity buyer walks in,{" "}
                <strong>
                  how much of that client&apos;s legal work will follow their preferred counsel out the
                  door?
                </strong>
              </p>
            </div>
            <div className="question-image">
              <img
                src="https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDdGxJ5CeLAZPcI2XFHu8ORonq6MaQyfrGUBxS"
                alt="Private equity meeting"
              />
              <div className="question-image-overlay" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
