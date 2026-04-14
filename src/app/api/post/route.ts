import { NextResponse } from "next/server";

import { getPersistedPost, savePersistedPost } from "@/lib/post-store";
import type { Post } from "@/services/post";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const post = await getPersistedPost();
    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error("Failed to get post:", error);
    return NextResponse.json({ message: "Failed to get post" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const payload = (await request.json()) as Partial<Post>;
    const post = await savePersistedPost(payload);

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error("Failed to save post:", error);
    return NextResponse.json({ message: "Failed to save post" }, { status: 500 });
  }
}
