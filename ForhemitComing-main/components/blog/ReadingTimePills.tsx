"use client";

interface ReadingTimePillsProps {
  overview: number;
  deepDive: number;
  methodology: number;
}

export function ReadingTimePills({ overview, deepDive, methodology }: ReadingTimePillsProps) {
  const pills = [
    { label: `Overview (${overview}s)`, href: '#overview' },
    { label: `Deep Dive (${deepDive} min)`, href: '#narrative' },
    { label: `Full Methodology (${methodology} min)`, href: '#methodology' },
  ];

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      console.log('[Analytics] Reading time pill clicked:', { href });
    }
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {pills.map((pill) => (
        <a
          key={pill.href}
          href={pill.href}
          onClick={(e) => handleClick(e, pill.href)}
          className="
            px-3 py-1.5 rounded-full text-sm font-medium
            bg-parchment text-stone border border-border-light
            hover:bg-sage hover:text-white hover:border-sage
            transition-all duration-200
          "
        >
          {pill.label}
        </a>
      ))}
    </div>
  );
}
