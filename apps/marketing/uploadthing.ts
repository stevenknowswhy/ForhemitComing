import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .onUploadComplete(async ({ file }) => {
      // Upload complete — file URL available in UploadThing dashboard
    }),
  resumeUploader: f({ 
    "application/pdf": { maxFileSize: "8MB" },
    "application/msword": { maxFileSize: "8MB" },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { maxFileSize: "8MB" }
  })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
