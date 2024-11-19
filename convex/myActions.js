"use node";

import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";

import { action } from "./_generated/server.js";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { v } from "convex/values";
;

// Ingest text and generate embeddings

export const ingest = action({
    args: {
      splitText: v.any(),  // This expects an array of text chunks.
      fileId: v.string(),
    },
    handler: async (ctx, args) => {
      // Ensure the metadata is passed correctly with the fileId
      await ConvexVectorStore.fromTexts(
        args.splitText,
        args.splitText.map(() => ({ fileId: args.fileId })),  // Apply fileId to metadata for each text chunk
        new GoogleGenerativeAIEmbeddings({
          apiKey: 'AIzaSyAHROmOx-nsKLlGCkehveENTc8tI46ueNc',
          model: "text-embedding-004", // 768 dimensions
          taskType: TaskType.RETRIEVAL_DOCUMENT,
          title: "Document title",
        }),
        { ctx }
      );
      return "completed";
    },
  });

export const search = action({
    args: {
        query: v.string(),
        fileId: v.string()
    },
    handler: async (ctx, args) => {
        const vectorStore = new ConvexVectorStore(new GoogleGenerativeAIEmbeddings({
            apiKey: 'AIzaSyDA-IRrtycI-ZtyZCq_ICTJ54CkdwRLaoc',
            model: "text-embedding-004", // 768 dimensions
            taskType: TaskType.RETRIEVAL_DOCUMENT,
            title: "Document title",
        }), { ctx });

        const resultOne = (await vectorStore.similaritySearch(args.query, 1)).
        filter(q=>q.metadata.fileId==args.fileId);
        console.log('resultOne ',resultOne);
        return JSON.stringify(resultOne);
    },
});