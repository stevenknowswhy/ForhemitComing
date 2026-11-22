import Image from "next/image";
import { Mail, Linkedin } from "lucide-react";

const lead = {
  name: "Stefano Stokes",
  title: "Founder & CEO",
  image:
    "https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDMAmOxFsP54wZ3MdlKIGHYbcXi6ROrhpmgC1x",
  email: "stefano@forhemit.com",
  linkedin: "https://www.linkedin.com/in/stefanostokes",
};

const commitments = [
  {
    title: "We tell you if it's not a fit.",
    text: "If your business doesn't meet the standard, we say so at the start — and name what would have to change.",
  },
  {
    title: "The price is set independently.",
    text: "An independent appraiser sets fair market value — one who works for neither side. Neither Forhemit nor the owner sets the price.",
  },
  {
    title: "We stay after the close.",
    text: "After closing, we're available on call for 4 to 12 months — check-ins, introductions, and questions — while the new employee-owners settle in.",
  },
];

export function TeamSection() {
  return (
    <section className="py-16 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="grid gap-6 lg:grid-cols-[1fr_200px] lg:gap-12 xl:grid-cols-[1fr_240px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="max-w-2xl space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-5xl/none">
                One accountable lead
              </h2>
              <p className="text-muted-foreground md:text-xl">
                Forhemit has one principal. I&apos;m the person you speak with first, the person
                who leads your transition, and the person accountable for coordinating the work
                through closing and handover.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-card rounded-lg border">
            <div className="relative h-80 w-full overflow-hidden rounded-t-lg">
              <Image
                src={lead.image}
                alt={`Picture of ${lead.name}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover object-top rounded-t-lg"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-medium">{lead.name}</h3>
              <p className="text-muted-foreground text-sm">{lead.title}</p>
              <div className="flex gap-3 mt-2">
                <a
                  href={`/contact?interest=general&message=${encodeURIComponent(`Inquiry about team member: ${lead.name} (${lead.title})`)}`}
                  className="touch-target-icon text-muted-foreground hover:text-foreground active:scale-[0.92] active:opacity-70 transition-all"
                  aria-label={`Contact us about ${lead.name}`}
                >
                  <Mail className="w-5 h-5" />
                </a>
                <a
                  href={lead.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="touch-target-icon text-muted-foreground hover:text-foreground active:scale-[0.92] active:opacity-70 transition-all"
                  aria-label={`LinkedIn profile of ${lead.name}`}
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          {commitments.map((commitment) => (
            <div
              key={commitment.title}
              className="bg-card rounded-lg border p-6 flex flex-col justify-center"
            >
              <h3 className="text-lg font-medium">{commitment.title}</h3>
              <p className="text-muted-foreground text-sm mt-2">{commitment.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
