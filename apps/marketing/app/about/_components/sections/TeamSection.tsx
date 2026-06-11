import Image from "next/image";

export function TeamSection() {
  const teamMembers = [
    {
      name: "Stefano Stokes",
      title: "Senior Managing Partner",
      image:
        "https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDMAmOxFsP54wZ3MdlKIGHYbcXi6ROrhpmgC1x"
    },
    {
      name: "Lena Carter",
      title: "Director, Private Equity",
      image:
        "https://xdjt53kfvx.ufs.sh/f/cAVKl903gHqF8jvaT0MuDEPsjO39fLSiyQYHJz5c2vqnTg64"
    },
    {
      name: "Daniel Morgan",
      title: "Business Development Manager",
      image:
        "https://xdjt53kfvx.ufs.sh/f/cAVKl903gHqF3u2zW9lWByw3Aq1t90KI5T6lcPeijoUQvr8V"
    },
    {
      name: "Ejaz Ahmed",
      title: "Operations Lead",
      image:
        "https://618ukecvpc.ufs.sh/f/ZsUJalzMdXfDkqluSzTiFjEIVDdqcMbun9pyXLi8vQUtwY1o"
    }
  ];

  return (
    <section className="py-16 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="grid gap-6 lg:grid-cols-[1fr_200px] lg:gap-12 xl:grid-cols-[1fr_240px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="max-w-2xl space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-5xl/none">
                Our team
              </h2>
              <p className="text-muted-foreground md:text-xl">
                We craft solutions that amplify key characteristics, achieving a harmonious balance
                of function and intent. Through careful analysis and collaborative engagement, our
                spaces transcend the conventional.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-card rounded-lg border">
              <div className="relative h-80 w-full overflow-hidden rounded-t-lg">
                <Image
                  src={member.image}
                  alt={`Picture of ${member.name}`}
                  fill
                  className="object-cover object-top rounded-t-lg"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium">{member.name}</h3>
                <p className="text-muted-foreground text-sm">{member.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
