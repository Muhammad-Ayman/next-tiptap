import { type JSONContent } from "@tiptap/react";

import { mockData } from "@/mock";

export type Post = {
  title: string;
  html: string;
  json: JSONContent;
  cover: string;
  author: string;
  readingTime: number;
  createdAt: string;
};

const getPost = async (): Promise<Post> => {
  try {
    const response = await fetch("/api/post", {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      console.warn("Failed to fetch persisted post, using mock data");
      return mockData as Post;
    }

    return (await response.json()) as Post;
  } catch (error) {
    console.error("Failed to fetch persisted post:", error);
    return mockData as Post;
  }
};

const savePost = async (data: Partial<Post>): Promise<void> => {
  try {
    const response = await fetch("/api/post", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.warn("Failed to save persisted post");
    }
  } catch (error) {
    console.error("Failed to save persisted post:", error);
  }
};

const postService = {
  get: getPost,
  save: savePost,
};

export default postService;
