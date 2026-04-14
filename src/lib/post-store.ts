import { mockData } from "@/mock";
import type { Post } from "@/services/post";

import { prisma } from "./prisma";

const DEFAULT_POST_ID = 1;

function getDefaultPost(): Post {
  return {
    title: mockData.title,
    html: mockData.html,
    json: mockData.json,
    cover: mockData.cover,
    author: mockData.author,
    readingTime: mockData.readingTime,
    createdAt: mockData.createdAt,
  };
}

function mapRecordToPost(record: {
  title: string;
  html: string;
  json: unknown;
  cover: string;
  author: string;
  readingTime: number;
  createdAt: string;
}): Post {
  return {
    title: record.title,
    html: record.html,
    json: record.json as Post["json"],
    cover: record.cover,
    author: record.author,
    readingTime: record.readingTime,
    createdAt: record.createdAt,
  };
}

export async function getPersistedPost(): Promise<Post> {
  const existing = await prisma.post.findUnique({
    where: { id: DEFAULT_POST_ID },
  });

  if (existing) {
    return mapRecordToPost(existing);
  }

  const fallback = getDefaultPost();
  const created = await prisma.post.create({
    data: {
      id: DEFAULT_POST_ID,
      title: fallback.title,
      html: fallback.html,
      json: fallback.json,
      cover: fallback.cover,
      author: fallback.author,
      readingTime: fallback.readingTime,
      createdAt: fallback.createdAt,
    },
  });

  return mapRecordToPost(created);
}

export async function savePersistedPost(data: Partial<Post>): Promise<Post> {
  const current = await getPersistedPost();
  const merged: Post = {
    ...current,
    ...data,
    json: data.json ?? current.json,
  };

  const saved = await prisma.post.upsert({
    where: { id: DEFAULT_POST_ID },
    update: {
      title: merged.title,
      html: merged.html,
      json: merged.json,
      cover: merged.cover,
      author: merged.author,
      readingTime: merged.readingTime,
      createdAt: merged.createdAt,
    },
    create: {
      id: DEFAULT_POST_ID,
      title: merged.title,
      html: merged.html,
      json: merged.json,
      cover: merged.cover,
      author: merged.author,
      readingTime: merged.readingTime,
      createdAt: merged.createdAt,
    },
  });

  return mapRecordToPost(saved);
}
