import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
	imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 5 } })
		.onUploadComplete(async ({ file }: { file: { url: string } }) => {
			// Upload complete — file URL available in UploadThing dashboard
		}),
	resumeUploader: f({
		"application/pdf": { maxFileSize: "8MB", maxFileCount: 3 },
		"application/msword": { maxFileSize: "8MB", maxFileCount: 3 },
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
			maxFileSize: "8MB",
			maxFileCount: 3,
		},
	})
		.onUploadComplete(async ({ file }: { file: { url: string } }) => {
			return { url: file.url };
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
