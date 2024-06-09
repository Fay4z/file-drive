import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const fileType = v.union(
  v.literal("image"),
  v.literal("csv"),
  v.literal("pdf")
);

export default defineSchema({
  files: defineTable({
    title: v.string(),
    orgId: v.string(),
    type: fileType,
    fileId: v.id("_storage"),
  }).index("by_orgId", ["orgId"]),
  users: defineTable({
    tokenIdentifier: v.string(),
    orgIds: v.array(v.string()),
  }).index("by_tokenIdentifier", ["tokenIdentifier"]),
});
