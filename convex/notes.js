import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const Addnotes = mutation({
    args: {
        fileId: v.string(),
        notes: v.any(),
        createdBy: v.string(),
    },
    handler: async (ctx, args) => {
        // Default notes to an empty string if undefined
        const notes = typeof args.notes === "string" ? args.notes : "";


        const record = await ctx.db
            .query("notes")
            .filter((q) => q.eq(q.field("fileId"), args.fileId))
            .collect();

        if (record?.length === 0) {
            await ctx.db.insert("notes", {
                fileId: args.fileId,
                notes,
                createdBy: args.createdBy,
            });
        } else {
            await ctx.db.patch(record[0]._id, { notes });
        }
    },
});


 export const GetNotes = query({
    args: {
        fileId: v.string()
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.query('notes')
            .filter(q => q.eq(q.field('fileId'), args.fileId))
            .collect();
        return result[0]?.notes;
    }
});
