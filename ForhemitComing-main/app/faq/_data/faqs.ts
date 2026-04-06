export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQSection {
  title: string;
  eyebrow: string;
  items: FAQItem[];
}

export const faqSections: FAQSection[] = [
  {
    title: "For Business Owners & Founders",
    eyebrow: "Selling Your Business",
    items: [
      {
        question: "What makes Forhemit different from a traditional private equity buyer?",
        answer:
          'Traditional private equity built its reputation on leverage and liquidation—buying companies, cutting costs to the bone, and flipping them a few years later. Forhemit is a California public benefit corporation built on Continuity of Operations (COOP). We structure employee-ownership (ESOP) transitions and post-close stewardship—not a quick flip. Your team becomes the buyer through the plan; we help harden operations so the business lasts for generations.',
      },
      {
        question: "What happens to my employees after I sell?",
        answer:
          "They become the owners. We utilize an Employee Stock Ownership Plan (ESOP) to transition the equity of the company to the people who helped you build it. We believe the highest valuation of a company is unlocked when everyone is in the game. Your team keeps their jobs, your leadership pipeline is preserved, and your employees gain a powerful wealth-building tool that protects them against economic shifts.",
      },
      {
        question: "Will I be forced to walk away immediately?",
        answer:
          'No. A proper handover is a delicate architectural process, not an abrupt liquidity event. We view departing founders as strategic architects. We work with you to institutionalize your "tribal knowledge" and build a seamless succession plan. Depending on the structure of the sale, mechanisms like our Legacy Bond align our financial success with your mentorship, ensuring you get paid as the company proves it can thrive under the newly empowered team.',
      },
      {
        question: "Will my company be relocated or rebranded?",
        answer:
          "Your brand, culture, and community roots are the very assets we are investing in. We do not absorb your company into a faceless corporate conglomerate or relocate your facilities to save a few pennies. We operate as a holding company that provides top-tier resilience systems, disaster preparedness frameworks, and financial training, all while keeping your company's local identity entirely intact.",
      },
      {
        question:
          "My business is highly complex and operates under strict regulatory and compliance requirements. Are you equipped to handle that level of operational difficulty?",
        answer:
          "Complexity and compliance are where we are most at home. Our founder, Stefano, built his career in disaster policy planning and response for the City and County of San Francisco. In that role, he engineered continuity of operations and emergency frameworks not just for a 40,000-person municipal workforce, but for the city's 800,000 residents. When you are responsible for the survival and resilience of a major city under crisis conditions, navigating strict regulatory environments, multi-agency compliance, and massive operational complexity becomes second nature. We bring that exact municipal-grade precision and systems-level thinking to your business. We don't shy away from heavily regulated or complicated industries—we actively seek them out because our entire model is built to master, manage, and protect them.",
      },
      {
        question:
          'This sounds like an overwhelming amount of work. How can we possibly plan for every single black swan event or disaster?',
        answer:
          "You don't have to. In fact, trying to write a specific plan for every possible crisis is the biggest trap in disaster preparedness. If you try to predict every specific scenario—a facility fire, a cyberattack, a frozen bank account, or the sudden departure of a key executive—you will exhaust your team and still be unprepared for the one thing you didn't predict. Our Continuity of Operations (COOP) framework does not plan for the incident; we plan for the impact. We focus purely on fortifying the six critical pillars of your business: your Financials, People, Place (Facilities), Technology, Tools, and Vendors. It doesn't matter why your technology went down, or why your facility is temporarily inaccessible. What matters is that we have a pre-engineered system to keep your business running when any of those six pillars are compromised. By focusing on the operational impact rather than the infinite causes, we build a hardened, highly efficient system without overwhelming your day-to-day operations.",
      },
    ],
  },
  {
    title: "For Lenders, Brokers, & Capital Partners",
    eyebrow: "Partnership",
    items: [
      {
        question: "What is your core investment thesis?",
        answer:
          "We invest in the continuity of profitable, lower-middle-market, founder-led businesses. By converting these acquisitions into 100% S-Corp ESOPs, we unlock a powerful structural tax arbitrage: the operating company pays zero federal income tax. This creates a massive free-cash-flow shield, allowing for safer debt service, higher operational reinvestment, and superior downside protection compared to highly leveraged traditional buyouts.",
      },
      {
        question: "How does Forhemit mitigate operational risk post-close?",
        answer:
          "We approach risk through the lens of municipal-grade disaster preparedness. Traditional PE relies on financial engineering; we rely on resilience engineering. Every company in our portfolio undergoes a rigorous Continuity of Operations (COOP) implementation. We institutionalize succession planning, secure IT and supply chain vulnerabilities, and maintain a 24-hour audit-ready data room. We de-risk the asset by ensuring it can survive economic shocks, leadership changes, and systemic disruptions.",
      },
      {
        question: "What is your target acquisition profile?",
        answer:
          'We look for stable, proven businesses with $2M to $10M in EBITDA, typically facing a founder succession cliff. We are not turnaround investors betting on lottery tickets; we invest in the "fortress." We want companies with strong local roots, dedicated workforces, and consistent cash flows that can be optimized through the alignment of employee ownership.',
      },
      {
        question: "How do you align incentives between labor and capital?",
        answer:
          "As a Public Benefit Corporation, our mandate is to prove that when workers win, investors win. We utilize dedicated C-suite oversight at the holding-company level whose sole focus is maintaining the social contract and ownership culture within our portfolio. By tying management success metrics directly to employee retention and wage stability, we eliminate agency risk and build a deeply aligned, low-turnover workforce that protects our lenders' and LPs' capital.",
      },
      {
        question:
          "Aren't you just an additional layer on an already complex deal? What exactly do you bring to the table for a lender?",
        answer:
          "Financial models are critical, but they are ultimately lagging indicators—they only tell you what has already happened. By the time an operational issue finally bleeds into the balance sheet or financial statements, the damage is already done and your options to correct it are severely limited. What we bring to the table is a proactive operational layer that engages with risks long before they reach the P&L. We act as your early warning system on the ground. By applying our Continuity of Operations (COOP) frameworks, we identify and resolve structural vulnerabilities—such as a single point of failure in the supply chain, an undocumented process, or a gap in succession planning—while you still have every option available. It is the operational equivalent of extinguishing a spark instead of fighting a four-alarm fire. We don't just add a layer of management; we engineer the on-the-ground resilience that protects your capital.",
      },
      {
        question:
          "Won't bringing you in just complicate the deal for my seller? I'm just trying to get this business sold.",
        answer:
          "We actually make your job easier by giving your seller the ultimate negotiating leverage. We do this through a two-prong strategy. First, we don't stop you from doing what you do best: taking the company to the open market to hunt for the highest possible bidder. What we provide is your Option B: a rock-solid, market-rate floor offer. Because our employee-ownership model comes with significant structural tax advantages for the seller, our 'floor' offer often nets out just as strong—if not stronger—than a traditional buyer's premium. This gives your seller absolute power at the negotiating table. When they sit down with a traditional buyer, they never have to accept bad terms out of desperation, because they know they already have a guaranteed, legacy-preserving exit in hand. And if the broader market dries up, or if a traditional buyer falls through at the 11th hour, your seller is completely protected. They still get to exit on their terms, the employees are taken care of, and you still get the deal closed.",
      },
    ],
  },
  {
    title: "For Employees",
    eyebrow: "Your Future",
    items: [
      {
        question: "What does it mean that Forhemit acquired our company?",
        answer:
          'It means your future just became much more secure. Unlike traditional buyouts that often look for "synergies" (which usually means layoffs), Forhemit buys companies specifically to transition them to employee ownership. Our goal is to protect the legacy of the founder by empowering the people who actually run the business every day: you.',
      },
      {
        question: "Will there be mass layoffs or new management coming in to tell us what to do?",
        answer:
          "No. We assume the company is already successful, which is why we bought it. We don't bring in 'new blood' to fix what isn't broken, and we don't believe in cutting staff to inflate short-term profits. Our job is to support your existing management team and provide the tools, training, and systems needed to make your jobs easier and more secure.",
      },
      {
        question: 'What does it mean to be an "Employee Owner"?',
        answer:
          "Through our Employee Stock Ownership Plan (ESOP), you will earn a genuine stake in the financial success of the company. As the company grows and succeeds, so does the value of your shares. This isn't something you have to buy into with your own savings; it is a benefit earned through your continued dedication and hard work. It transforms your daily effort from just earning a paycheck into building long-term personal wealth.",
      },
      {
        question: "Will my day-to-day job change?",
        answer:
          "Your core responsibilities will remain the same, but the culture will evolve. We practice open-book management and prioritize financial literacy. We want to teach you how the business makes money, how your specific role impacts the bottom line, and how to think like an owner. You can expect more transparency, more communication, and a much larger voice in the future of the place you work.",
      },
    ],
  },
];
