"use client";

import { Users, Briefcase, Landmark, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const stakeholderGroups = [
  {
    id: "sellers",
    icon: Users,
    title: "Business Sellers",
    subtitle: "For Founders Ready to Exit",
    coreConcern:
      "Minimizing personal workload during transition, ensuring a successful outcome, and protecting their legacy.",
    valueProps: [
      {
        title: 'The "Done-For-You" Knowledge Transfer',
        description:
          "We eliminate the daunting task of figuring out how to pass on decades of implicit knowledge. Through our 8-12 Critical Function Mapping, we do the heavy lifting of interviewing, documenting, and building the operational playbook. Sellers don't have to become transition experts; we extract what they know and systemize it.",
      },
      {
        title: "A Structured, Stress-Free Handoff",
        description:
          "Instead of an abrupt, anxiety-inducing exit at closing, we provide a guided 24-month off-ramp. We ensure the business runs seamlessly without them, allowing them to step away with total peace of mind.",
      },
      {
        title: "Protecting Seller Notes",
        description:
          "Many sellers finance a portion of the ESOP transaction themselves. Our operational stewardship directly protects their financial payout by ensuring the newly employee-owned company remains profitable and capable of servicing that seller note.",
        deeper: true,
      },
    ],
  },
  {
    id: "brokers",
    icon: Briefcase,
    title: "Brokers & M&A Advisors",
    subtitle: "For Transaction Professionals",
    coreConcern:
      "Maintaining credibility, avoiding extra work, and viewing us as a complement rather than a competitor.",
    valueProps: [
      {
        title: 'The "Deal Insurance" Partner',
        description:
          "We do not structure the transaction, value the company, or broker the deal. We are the operational continuity specialists that ensure their beautifully structured deal actually survives the post-close turbulence. We make them look like heroes for bringing a complete, risk-mitigated solution to the table.",
      },
      {
        title: "Accelerating Lender Approval",
        description:
          "By integrating our COOP framework into the pre-close process, we provide lenders with a level of operational de-risking they rarely see. This makes the broker's deal easier to finance and faster to close.",
      },
      {
        title: "Post-Deal Referral Generation",
        description:
          "A failed transition damages a broker's reputation in the market. A phenomenally successful one—where employees thrive and the business grows—turns that company into a powerful, referenceable case study that will drive future seller leads directly back to the broker.",
        deeper: true,
      },
    ],
  },
  {
    id: "lenders",
    icon: Landmark,
    title: "Lenders & Capital Providers",
    subtitle: "For Financial Institutions",
    coreConcern:
      'Regulatory compliance, mitigating financial risk, and ensuring our model isn\'t just "theoretical fluff."',
    valueProps: [
      {
        title: "Pre-Default Observability",
        description:
          "Traditional covenants are lagging indicators; they tell a lender the business is failing after the cash flow has dried up. Our real-time stewardship reporting tracks the health of the 8-12 critical functions, giving lenders leading indicators and early warnings before a financial default ever occurs.",
      },
      {
        title: "Government-Proven Risk Mitigation",
        description:
          "This is not a proprietary, untested startup theory. We are applying the exact Federal Continuity Directive standards used to keep the government running during national crises. It is a rigorous, testable, and auditable framework that perfectly aligns with strict banking regulations.",
      },
      {
        title: "Collateral Preservation in 100% ESOPs",
        description:
          "In a leveraged ESOP, personal guarantees vanish, and the business itself is the sole collateral. Our COOP methodology acts as an operational guarantee. By engineering out single points of failure, we directly protect the asset that secures their loan, fundamentally improving their Loss Given Default (LGD) metrics.",
        deeper: true,
      },
    ],
  },
];

export function ValuePropositionsSection() {
  return (
    <section className="about-section faq-value-props-section">
      <div className="container">
        <div className="faq-value-props-header">
          <span className="about-eyebrow">Tailored Value</span>
          <h2 className="section-title">Tailored Value Propositions</h2>
          <p className="faq-value-props-intro">
            Based on your strategic position, here is how we directly address the specific
            motivations and concerns of each stakeholder group—ensuring we complement rather than
            complicate their goals.
          </p>
        </div>

        <Tabs defaultValue="sellers" className="faq-gallery-tabs-wrapper">
          <TabsList className="faq-gallery-tabs">
            {stakeholderGroups.map((group) => (
              <TabsTrigger
                key={group.id}
                value={group.id}
                className="faq-gallery-tab"
              >
                <group.icon size={24} strokeWidth={1.5} />
                <span className="faq-gallery-tab-title">{group.title}</span>
                <span className="faq-gallery-tab-subtitle">{group.subtitle}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {stakeholderGroups.map((group) => (
            <TabsContent key={group.id} value={group.id} className="faq-value-prop-content">
              <Card className="faq-value-prop-card">
                <CardHeader className="faq-value-prop-card-header">
                  <div className="faq-value-prop-icon">
                    <group.icon size={28} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3>{group.title}</h3>
                    <span className="faq-value-prop-subtitle">{group.subtitle}</span>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="faq-value-prop-concern">
                    <span className="concern-label">Core Concerns</span>
                    <p>{group.coreConcern}</p>
                  </div>

                  <div className="faq-value-prop-list">
                    {group.valueProps.map((prop, index) => (
                      <div
                        key={index}
                        className={`faq-value-prop-item ${prop.deeper ? "deeper" : ""}`}
                      >
                        <div className="value-prop-number">0{index + 1}</div>
                        <div className="value-prop-content">
                          <h4>
                            {prop.title}
                            {prop.deeper && (
                              <Badge variant="outline" className="deeper-badge">
                                Deep Dive
                              </Badge>
                            )}
                          </h4>
                          <p>{prop.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Category Creation Advantage */}
        <div className="faq-category-advantage">
          <div className="category-advantage-icon">
            <Lightbulb size={32} strokeWidth={1.5} />
          </div>
          <h3>The &quot;Category Creation&quot; Advantage</h3>
          <p>
            Beyond addressing immediate concerns, our strongest underlying value proposition across
            all three groups is that we are <strong>shifting the industry standard</strong>. By
            defining &quot;Stewardship Management,&quot; we change the question from{" "}
            <em>&quot;Do we need Forhemit?&quot;</em> to{" "}
            <em>
              &quot;Is it fiscally responsible to finance or sell a company without a 24-month
              operational continuity plan?&quot;
            </em>
          </p>
          <p className="category-advantage-closing">
            When we pitch this, we aren&apos;t just selling a service; we are educating the market
            that the current &quot;set it and leave&quot; industry standard is structurally
            deficient and unnecessarily risky for everyone involved.
          </p>
        </div>
      </div>
    </section>
  );
}
