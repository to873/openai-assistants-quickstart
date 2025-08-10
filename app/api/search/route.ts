import { NextResponse } from 'next/server';
import { queryVectorStore } from '../../../lib/pinecone';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const query = url.searchParams.get('query');
  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }
  try {
    const results = await queryVectorStore(query, 5);
    const snippets = results.map((r: any) => (r.metadata?.text as string) ?? '');
    return NextResponse.json({ snippets });
  } catch (err) {
    console.error('Error querying vector store', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
