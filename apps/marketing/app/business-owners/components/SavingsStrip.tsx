export function SavingsStrip() {
  return (
    <div className="bo-savings-strip">
      <div className="bo-savings-item">
        <div className="bo-savings-num">$0</div>
        <div className="bo-savings-label">Broker commission</div>
        <div className="bo-savings-sub">
          We aren&rsquo;t brokers. We coordinate the transaction&mdash;saving you
          4&ndash;8% of your sale price at closing.
        </div>
      </div>
      <div className="bo-savings-item">
        <div className="bo-savings-num">$0</div>
        <div className="bo-savings-label">Capital gains tax (&sect;1042)</div>
        <div className="bo-savings-sub">
          C-corp sellers who reinvest proceeds into QRS securities pay no
          federal capital gains. On a $10M deal, that&rsquo;s $2.38M+ back in
          your pocket.
        </div>
      </div>
      <div className="bo-savings-item">
        <div className="bo-savings-num">4 mo</div>
        <div className="bo-savings-label">vs. 12–18 months traditional</div>
        <div className="bo-savings-sub">
          The fastest path to a funded exit that preserves your legacy. 
          No contingency drama. The ESOP trust is the buyer—deal certainty 
          is structurally higher once the numbers work.
        </div>
      </div>
    </div>
  );
}
