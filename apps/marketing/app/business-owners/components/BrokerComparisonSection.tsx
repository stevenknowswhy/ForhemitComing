export function BrokerComparisonSection() {
  return (
    <section className="business-owners-section bo-broker-section">
      <div className="container">
        <p className="bo-comp-eyebrow">Brokers &amp; the ESOP path</p>
        <h2 className="bo-comp-title">
          Good brokers create real value.
          <br />
          We offer a different path.
        </h2>

        <div className="bo-broker-value">
          <p className="bo-comp-body">
            A skilled business broker brings genuine advantages: access to a
            competitive buyer pool, experience negotiating deal terms,
            confidential marketing that protects your brand, and the ability to
            create bidding tension that can push your headline price higher.
            For owners who want maximum optionality on the open market, the
            right broker earns their fee many times over.
          </p>
          <p className="bo-comp-body">
            But not every owner wants&mdash;or needs&mdash;that process. If you
            already know you want your team to carry the business forward, or if
            you haven&rsquo;t found a broker who understands ESOP transactions,
            or if you simply want to compare the after-tax math before deciding,
            we offer a direct path: we coordinate the full transaction&mdash;bank,
            attorney, valuation, trustee, and operational transition&mdash;and the
            buyer is your own team, funded by an SBA bank loan.
          </p>
          <p className="bo-comp-body bo-comp-body-note">
            <strong>Already working with a broker?</strong> We&rsquo;re happy to
            collaborate. Many brokers refer owners to us when an ESOP is the
            right structure, and we can work alongside your existing advisor to
            make sure you&rsquo;re comparing all your options with real numbers.
          </p>
        </div>

        <table className="bo-comp-table">
          <thead>
            <tr>
              <th style={{ width: "32%" }}>What matters to you</th>
              <th className="bo-col-us">With Forhemit</th>
              <th className="bo-col-broker">
                Traditional sale via broker
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="bo-row-label">Commission to advisor</td>
              <td className="bo-col-us bo-green">
                $0 broker commission
                <br />
                <span className="bo-comp-fine">
                  Forhemit structuring fee at closing
                </span>
              </td>
              <td className="bo-col-broker">
                4&ndash;8% of sale price
                <br />
                <span className="bo-comp-fine">
                  $400K&ndash;$800K on a $10M deal
                </span>
              </td>
            </tr>
            <tr>
              <td className="bo-row-label">Capital gains tax</td>
              <td className="bo-col-us bo-green">
                $0 federal CGT (&sect;1042 election)
                <br />
                <span className="bo-comp-fine">
                  Requires C-corp status + QRS reinvestment
                </span>
              </td>
              <td className="bo-col-broker">
                23.8% federal + state
                <br />
                <span className="bo-comp-fine">
                  $2.38M+ on a $10M gain (FL: no state tax)
                </span>
              </td>
            </tr>
            <tr>
              <td className="bo-row-label">Who is the buyer</td>
              <td className="bo-col-us">
                Your employees, funded by SBA bank loan
              </td>
              <td className="bo-col-broker">
                Unknown third party, PE fund, or competitor
              </td>
            </tr>
            <tr>
              <td className="bo-row-label">Earnouts / contingencies</td>
              <td className="bo-col-us bo-green">None. Price is locked.</td>
              <td className="bo-col-broker">
                Common. PE buyers routinely use earnouts tied to post-close
                performance.
              </td>
            </tr>
            <tr>
              <td className="bo-row-label">Employees after close</td>
              <td className="bo-col-us">
                Become owners. Retain jobs, culture, continuity.
              </td>
              <td className="bo-col-broker">
                Depends on buyer. Strategic acquirers may retain; PE often
                restructures.
              </td>
            </tr>
            <tr>
              <td className="bo-row-label">Your personal guarantee</td>
              <td className="bo-col-us bo-green">
                None. Loan is between bank and ESOP trust.
              </td>
              <td className="bo-col-broker">
                Individual SBA buyers require seller PG.
              </td>
            </tr>
            <tr>
              <td className="bo-row-label">Deal coordination</td>
              <td className="bo-col-us">
                One team, one timeline. We quarterback everything.
              </td>
              <td className="bo-col-broker">
                Broker manages buyer intros; you coordinate legal, accounting,
                and diligence teams.
              </td>
            </tr>
          </tbody>
        </table>

        <MathBlock />
      </div>
    </section>
  );
}

function MathBlock() {
  return (
    <div className="bo-math-block">
      <div className="bo-math-block-label">
        $10M Deal&mdash;What You Actually Keep
      </div>
      <div className="bo-math-cols">
        <div>
          <div className="bo-math-col-title bo-math-col-brand">
            Forhemit ESOP&mdash;Florida seller
          </div>
          <MathRow label="Sale price" value="$10,000,000" />
          <MathRow label="Broker commission" value="—" variant="pos" />
          <MathRow
            label="Forhemit structuring fee"
            value="− $120,000"
            variant="neg"
          />
          <MathRow
            label="ESOP legal + trustee"
            value="− $95,000"
            variant="neg"
          />
          <MathRow
            label="Federal capital gains tax (§1042)"
            value="$0"
            variant="pos"
          />
          <MathRow label="Florida state tax" value="$0" variant="pos" />
          <div className="bo-math-total">
            <span className="bo-math-total-label">Net to seller</span>
            <span className="bo-math-total-val">$9,785,000</span>
          </div>
        </div>
        <div>
          <div className="bo-math-col-title">
            PE/Strategic buyer via broker
          </div>
          <MathRow label="Sale price" value="$10,000,000" />
          <MathRow
            label="Broker commission (6%)"
            value="− $600,000"
            variant="neg"
          />
          <MathRow label="M&A legal fees" value="− $150,000" variant="neg" />
          <MathRow
            label="QofE / diligence"
            value="− $60,000"
            variant="neg"
          />
          <MathRow
            label="Federal capital gains (23.8%)"
            value="− $2,380,000"
            variant="neg"
          />
          <MathRow label="Florida state tax" value="$0" variant="pos" />
          <div className="bo-math-total">
            <span className="bo-math-total-label">Net to seller</span>
            <span className="bo-math-total-val bo-math-total-muted">
              $6,810,000
            </span>
          </div>
        </div>
      </div>
      <p className="bo-math-note">
        Assumptions: $10M Florida sale, full gain (zero basis), C-corp seller
        electing &sect;1042, QRS reinvestment. &sect;1042 tax deferral applies
        to the full gain only with proper reinvestment&mdash;your CPA must
        confirm eligibility. Forhemit fee is illustrative; final fees depend on
        transaction complexity. A traditional sale may produce a higher headline
        price through competitive bidding&mdash;the right path depends on your
        priorities.{" "}
        <strong>
          On the same headline number, the ESOP seller keeps $2,975,000 more
          after tax.
        </strong>
      </p>
    </div>
  );
}

function MathRow({
  label,
  value,
  variant,
}: {
  label: string;
  value: string;
  variant?: "neg" | "pos";
}) {
  return (
    <div className="bo-math-row">
      <span className="bo-math-row-label">{label}</span>
      <span
        className={`bo-math-row-val ${variant === "neg" ? "bo-math-neg" : ""} ${variant === "pos" ? "bo-math-pos" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
