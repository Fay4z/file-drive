import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUser } from "./users";

async function hasAccessToOrg(ctx, tokenIdentifier, orgId) {
  const user = await getUser(ctx, tokenIdentifier);
  const hasAccess =
    user.orgIds.includes(orgId) || user.tokenIdentifier.includes(orgId);
  return hasAccess;
}

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const createFiles = mutation({
  args: {
    title: v.string(),
    orgId: v.string(),
    fileId: v.id("_storage"),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be signed in to create a file");
    }

    const hasAccess = await hasAccessToOrg(
      ctx,
      identity.tokenIdentifier,
      args.orgId
    );

    if (!hasAccess) {
      throw new ConvexError("you do not have access to this org");
    }
    await ctx.db.insert("files", {
      title: args.title,
      orgId: args.orgId,
      fileId: args.fileId,
    });
  },
});

export const getFiles = query({
  args: {
    orgId: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const hasAccess = await hasAccessToOrg(
      ctx,
      identity.tokenIdentifier,
      args.orgId
    );
    if (!hasAccess) {
      return [];
    }
    return await ctx.db
      .query("files")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .collect();
  },
});

export const deleteFile = mutation({
  args: {
    fileId: v.id("files"),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be signed in to delete a file");
    }

    const file = await ctx.db.get(args.fileId);

    if (!file) {
      throw new ConvexError("file not found");
    }

    const hasAccess = await hasAccessToOrg(
      ctx,
      identity.tokenIdentifier,
      file.orgId
    );

    if (!hasAccess) {
      throw new ConvexError("you do not have access to this org");
    }

    await ctx.db.delete(args.fileId);
  },
});
