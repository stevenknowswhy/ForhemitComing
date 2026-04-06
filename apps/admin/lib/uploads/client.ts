/**
 * Sole import site for @uploadthing/react in this app.
 * UI and features import UploadButton / UploadDropzone from here only
 * (see HARMONIZATION_PLAN.md — UploadThing abstraction).
 */
import { generateUploadButton, generateUploadDropzone } from "@uploadthing/react";
import type { OurFileRouter } from "@/uploadthing";

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
