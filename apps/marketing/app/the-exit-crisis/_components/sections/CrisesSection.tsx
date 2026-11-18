"use client";

import Image from "next/image";

export function CrisesSection() {
  return (
    <section className="about-section about-section-dark">
      <div className="container">
        {/* Row 1: Image Left, Text Right */}
        <div className="crisis-row">
          <div className="crisis-image-wrapper">
            <Image
              src="https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDnRzU88SNaoHZhcXfKi2B3O8YTR0lmArFCIVG"
              alt="A train station"
              className="crisis-image"
              width={5760}
              height={3840}
              sizes="(max-width: 900px) 100vw, 50vw"
            />
          </div>
          <div className="crisis-content">
            <h3>The arithmetic nobody shows founders</h3>
            <p>
              Every business owner eventually faces the same quiet question: what
              happens to this company when I stop? For a generation of founders
              now in their sixties and seventies, that question has stopped being
              hypothetical — and the market&apos;s answer is far harsher than most
              of them expect.
            </p>
            <p>
              Start with the arithmetic. In 2022, an estimated 510,000 U.S. small
              businesses exited the market. Ninety-two percent simply closed;
              only five percent sold (McKinsey Institute for Economic Mobility,
              2026). And of the businesses that do go to market, only about
              20–30% actually sell (Exit Planning Institute). Not &quot;sell for
              less than hoped.&quot; Never sell. The listing expires, the broker
              moves on, and the founder — older, with fewer options than when the
              process began — faces the ending they were trying to avoid.
            </p>
            <p>
              Even the &quot;successful&quot; path is grueling. A traditional sale
              process runs a year or more: preparation, listing, diligence,
              negotiation, financing contingencies, closing. Throughout, the
              founder must run the company at full performance — buyers discount
              any dip — while concealing the process from the very employees
              whose work sustains the valuation.
            </p>
          </div>
        </div>

        {/* Row 2: Text Left, Image Right */}
        <div className="crisis-row crisis-row-reverse">
          <div className="crisis-content">
            <h3>Why the buyers aren&apos;t coming</h3>
            <p>
              The shortage is structural, not cyclical. The natural buyers of the
              last century — the ambitious employee, the competitor across town,
              the founder&apos;s own children — have thinned out. Employees rarely
              have the capital or the credit to buy a $10 million company
              personally. Competitors buy selectively. Children, respectfully,
              often choose different lives. What remains is the financial buyer:
              private equity and search funds, disciplined and price-driven,
              interested in the business as an asset class rather than as a
              place where people work.
            </p>
            <p>
              None of this makes financial buyers villains. It makes them what
              they are: buyers with a holding period. The company will be sold
              again, typically within the decade, to a buyer the founder will
              never meet, under terms the founder cannot influence.
            </p>
          </div>
          <div className="crisis-image-wrapper">
            <Image
              src="https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDyGimuSRi39FVNAWGTBJoRwhjb8XIcPd21tnr"
              alt="The Workforce Crisis"
              className="crisis-image"
              width={6000}
              height={4000}
              sizes="(max-width: 900px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Row 3: Image Left, Text Right */}
        <div className="crisis-row">
          <div className="crisis-image-wrapper">
            <Image
              src="https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDLlhK7BU5RqmliJOUfha4pgWxoQEH2FLYC7wM"
              alt="The Community Collapse"
              className="crisis-image"
              width={3130}
              height={2075}
              sizes="(max-width: 900px) 100vw, 50vw"
            />
          </div>
          <div className="crisis-content">
            <h3>The default ending</h3>
            <p>
              When no sale happens, the default is liquidation — and liquidation
              is the worst outcome on the table. Assets sell for cents on the
              dollar. Employees lose their livelihoods on a schedule set by an
              auctioneer. Customers lose a supplier they trusted. The founder
              watches thirty years of goodwill — the uncounted value of the
              business — simply evaporate, because goodwill cannot be sold off a
              loading dock.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
