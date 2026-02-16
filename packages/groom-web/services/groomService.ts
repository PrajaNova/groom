import { fetchAPI } from "./api";

export type RenderBlog = {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string | null;
  readTime: number | null;
  imageSeed: string;
  category: string | null;
  format: string;
  author: string | null;
  publishedAt: Date | null;
};

export interface Confession {
  id: string;
  content: string;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateConfessionData {
  content: string;
  isAnonymous?: boolean;
}

class GroomService {
  // Blog methods
  async getBlogs(): Promise<RenderBlog[]> {
    return fetchAPI("/api/blogs", { cache: "no-store" });
  }

  async getBlogBySlug(slug: string): Promise<RenderBlog> {
    return fetchAPI(`/api/blogs/${slug}`, { cache: "no-store" });
  }

  // Confession methods
  async getConfessions(): Promise<Confession[]> {
    return fetchAPI("/api/confessions", { cache: "no-store" });
  }

  async createConfession(data: CreateConfessionData): Promise<Confession> {
    return fetchAPI("/api/confessions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // JaaS Token
  async getJaasToken(
    meetingId: string,
  ): Promise<{ token: string; appId: string }> {
    return fetchAPI("/api/jaas/token", {
      method: "POST",
      body: JSON.stringify({ meetingId }),
    });
  }
}

export default new GroomService();
