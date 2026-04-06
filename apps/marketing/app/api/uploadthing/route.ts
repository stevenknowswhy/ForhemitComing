import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "@/uploadthing";

export const dynamic = "force-dynamic";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
