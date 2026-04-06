/** Build /contact URL with optional pre-filled progressive form fields (see ContactFormExperience). */

export function contactHrefFromBlogPathway(pathway: string): string {
  const params = new URLSearchParams();

  switch (pathway) {
    case "founders":
      params.set("contactType", "business-owner");
      params.set("interest", "esop-transition");
      break;
    case "attorneys":
      params.set("contactType", "partner");
      params.set("interest", "legal");
      break;
    case "lenders":
      params.set("contactType", "partner");
      params.set("interest", "lending");
      break;
    case "cpas":
      params.set("contactType", "partner");
      params.set("interest", "accounting");
      break;
    case "employees":
      params.set("contactType", "website-visitor");
      params.set("interest", "general");
      break;
    case "all":
    default:
      return "/contact";
  }

  return `/contact?${params.toString()}`;
}
