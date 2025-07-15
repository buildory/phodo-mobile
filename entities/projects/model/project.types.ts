import { z } from "zod";
import {
  ProjectSchema,
  ProjectListParamsSchema,
  ConceptImagesSchema,
  ApplicantSchema,
  CreateApplicantParamsSchema,
} from "./project.schema";

export type Project = z.infer<typeof ProjectSchema>;
export type ProjectListParams = z.infer<typeof ProjectListParamsSchema>;
export type ConceptImages = z.infer<typeof ConceptImagesSchema>;
export type Applicant = z.infer<typeof ApplicantSchema>;
export type CreateApplicantParams = z.infer<typeof CreateApplicantParamsSchema>;
