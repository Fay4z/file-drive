import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  files: defineTable({ title: v.string(), orgId: v.string() }).index(
    "by_orgId",
    ["orgId"]
  ),
});
