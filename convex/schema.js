import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        userName: v.string(),
        email: v.string(),
        imageUrl: v.string()
    }),
    pdfFile: defineTable({
        fileId: v.string(),
        storageId: v.string(),
        fileName: v.string(),
        fileUrl: v.string(),
        createdBy: v.string()
    }),
    documents: defineTable({
        embedding: v.array(v.number()),        // The document embedding vector
        text: v.string(),                      // The document text
        metadata: v.object({
            fileId: v.string(),               // The fileId as part of the metadata
            // You can add more metadata fields if necessary
        }),
    }).vectorIndex("byEmbedding", {
        vectorField: "embedding",              // The vector field used for similarity search
        dimensions: 768,                       // Dimensionality of the embedding (e.g., 768 for "text-embedding-004")
    }),
    notes:defineTable({
        fileId:v.string(),
        notes:v.any(),
        createdBy:v.string()
    })
});
