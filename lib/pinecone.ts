import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';

const pineconeApiKey = process.env.PINECONE_API_KEY as string;
const pineconeEnvironment = process.env.PINECONE_ENVIRONMENT as string;
const pineconeIndexName = process.env.PINECONE_INDEX_NAME as string;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY as string });

const pinecone = new Pinecone({
  environment: pineconeEnvironment,
  apiKey: pineconeApiKey,
});

export async function embedText(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text,
  });
  return response.data[0].embedding;
}

export async function queryVectorStore(query: string, topK = 5) {
  const vector = await embedText(query);
  const index = pinecone.Index(pineconeIndexName);
  const queryResponse = await index.query({
    topK,
    vector,
    includeMetadata: true,
    includeValues: false,
  });
  return (
    queryResponse.matches?.map((match) => ({
      id: match.id,
      score: match.score,
      metadata: match.metadata as { text: string },
    })) ?? []
  );
}

export async function upsertDocuments(documents: { id: string; text: string; metadata?: any }[]) {
  const index = pinecone.Index(pineconeIndexName);
  const vectors = await Promise.all(
    documents.map(async (doc) => ({
      id: doc.id,
      values: await embedText(doc.text),
      metadata: doc.metadata ?? {},
    })),
  );
  await index.upsert({ upsertRequest: { vectors } });
}
