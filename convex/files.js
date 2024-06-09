import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUser } from "./users";
import { fileType } from "./schema";

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
    type: fileType,
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
      type: args.type,
    });
  },
});

export const getFiles = query({
  args: {
    orgId: v.string(),
    query: v.optional(v.string()),
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
    const files = await ctx.db
      .query("files")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .collect();

    const query = args.query;

    if (query) {
      return files.filter((file) =>
        file.title.toLowerCase().includes(query.toLowerCase())
      );
    } else {
      return files;
    }
  },
});

export const deleteFile = mutation({
  args: {
    fileId: v.id("files"),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    console.log("identity", identity);
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

export const getImageUrl = query({
  args: {
    id: v.id("files"),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }
    const file = await ctx.db.get(args.id);
    console.log("file", file);

    if (!file) {
      throw new ConvexError("file not found");
    }

    const url = await ctx.storage.getUrl(file.fileId);
    console.log("url", url);
    return url;
    // if (!file) {
    //   throw new ConvexError("file not found");
    // }

    // const hasAccess = await hasAccessToOrg(
    //   ctx,
    //   identity.tokenIdentifier,
    //   file.orgId
    // );

    // if (!hasAccess) {
    //   throw new ConvexError("you do not have access to this org");
    // }
  },
});
