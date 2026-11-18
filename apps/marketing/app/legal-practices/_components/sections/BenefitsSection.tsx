"use client";

export function BenefitsSection() {
  return (
    <section className="legal-section benefits-section">
      <div className="container">
        <h2 data-animate="fade-up">What we owe you</h2>

        <div className="benefit-rows">
          {/* Card 01 */}
          <div className="benefit-row" data-animate="fade-up" data-delay="0">
            <div className="benefit-row-header">
              <span className="benefit-row-number">01</span>
              <h3>Your client stays your client</h3>
            </div>
            <div className="benefit-row-content">
              <p>
                You stay counsel of record. Forhemit structures employee-ownership transitions;
                it is not a law firm, it does not provide legal services, and it does not
                compete for the relationship you built. We coordinate the transition around
                your counsel, never instead of it. Forhemit is not a law firm, provides no
                legal services, and enters into no referral-fee or fee-splitting arrangements.
              </p>
            </div>
            <div className="benefit-row-outcome">
              <span className="outcome-label">Commitment</span>
              <span className="outcome-text">
                Counsel of record, from the first conversation to the last
              </span>
            </div>
          </div>

          {/* Card 02 */}
          <div className="benefit-row" data-animate="fade-up" data-delay="100">
            <div className="benefit-row-header">
              <span className="benefit-row-number">02</span>
              <h3>Your client stays unidentified until you say otherwise</h3>
            </div>
            <div className="benefit-row-content">
              <p>
                You can describe a situation without giving us the client&apos;s name. We will
                not contact or identify your client on the basis of a preliminary conversation.
                A named introduction happens only when you and your client are ready, and any
                sharing of information after that is handled within the confidentiality
                arrangements agreed for the engagement.
              </p>
            </div>
            <div className="benefit-row-outcome">
              <span className="outcome-label">Commitment</span>
              <span className="outcome-text">
                No client name is needed for a first conversation
              </span>
            </div>
          </div>

          {/* Card 03 */}
          <div className="benefit-row" data-animate="fade-up" data-delay="200">
            <div className="benefit-row-header">
              <span className="benefit-row-number">03</span>
              <h3>You hear it from us, at every phase</h3>
            </div>
            <div className="benefit-row-content">
              <p>
                With your client&apos;s authorisation, you are told when the introduction
                lands, when the business is screened, when the structure is set, and when it
                closes, and you are consulted before any decision that touches your work.
              </p>
            </div>
            <div className="benefit-row-outcome">
              <span className="outcome-label">Commitment</span>
              <span className="outcome-text">
                Informed at every phase — never caught up after the fact
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
