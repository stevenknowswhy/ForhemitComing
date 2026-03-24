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
        <div className="bo-savings-num">90&ndash;120</div>
        <div className="bo-savings-label">Days to close</div>
        <div className="bo-savings-sub">
          Competitive with traditional buyers. No contingency drama. The ESOP
          trust is the buyer&mdash;deal certainty is structurally higher once
          the numbers work.
        </div>
      </div>
    </div>
  );
}
