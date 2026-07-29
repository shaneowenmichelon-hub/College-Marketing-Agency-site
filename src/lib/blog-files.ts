import fs from "node:fs";
import path from "node:path";
import type { ArticleBlock, Post, PostCategory } from "@/lib/content";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

const VALID_CATEGORIES: PostCategory[] = [
  "Campus Strategy",
  "Ambassadors",
  "Influencers",
  "Events",
];

function parseValue(raw: string): string | string[] {
  const value = raw.trim();
  if (value.startsWith("[") && value.endsWith("]")) {
    return value
      .slice(1, -1)
      .split(",")
      .map((item) => item.trim().replace(/^['\"]|['\"]$/g, ""))
      .filter(Boolean);
  }
  return value.replace(/^['\"]|['\"]$/g, "");
}

function parseFrontmatter(source: string): { data: Record<string, string | string[]>; body: string } {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) throw new Error("Blog post is missing YAML frontmatter delimiters");

  const data: Record<string, string | string[]> = {};
  for (const line of match[1].split("\n")) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const index = line.indexOf(":");
    if (index === -1) continue;
    const key = line.slice(0, index).trim();
    const value = line.slice(index + 1).trim();
    data[key] = parseValue(value);
  }

  return { data, body: match[2].trim() };
}

function asString(data: Record<string, string | string[]>, key: string): string {
  const value = data[key];
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Blog post frontmatter field \"${key}\" must be a string`);
  }
  return value.trim();
}

function asStringArray(data: Record<string, string | string[]>, key: string): string[] {
  const value = data[key];
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}

function paragraphToHtml(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, " ")
    .trim();
}

function parseMarkdownBody(markdown: string): ArticleBlock[] {
  const blocks: ArticleBlock[] = [];
  const lines = markdown.split("\n");
  let paragraph: string[] = [];
  let list: { type: "ul" | "ol"; items: string[] } | null = null;

  const flushParagraph = () => {
    if (!paragraph.length) return;
    const html = paragraphToHtml(paragraph.join("\n"));
    if (html) blocks.push({ type: "p", html });
    paragraph = [];
  };

  const flushList = () => {
    if (!list) return;
    blocks.push({ type: list.type, items: list.items.map(paragraphToHtml) });
    list = null;
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    if (line.startsWith("# ")) {
      // The page template renders the post title as the H1.
      flushParagraph();
      flushList();
      continue;
    }

    if (line.startsWith("## ") || line.startsWith("### ")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "h2", text: line.replace(/^#{2,3}\s+/, "") });
      continue;
    }

    const ul = line.match(/^[-*]\s+(.+)$/);
    if (ul) {
      flushParagraph();
      if (!list || list.type !== "ul") {
        flushList();
        list = { type: "ul", items: [] };
      }
      list.items.push(ul[1]);
      continue;
    }

    const ol = line.match(/^\d+\.\s+(.+)$/);
    if (ol) {
      flushParagraph();
      if (!list || list.type !== "ol") {
        flushList();
        list = { type: "ol", items: [] };
      }
      list.items.push(ol[1]);
      continue;
    }

    flushList();
    paragraph.push(line);
  }

  flushParagraph();
  flushList();
  return blocks;
}

export function loadMdxPosts(): Post[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const fullPath = path.join(BLOG_DIR, file);
      const { data, body } = parseFrontmatter(fs.readFileSync(fullPath, "utf8"));
      const category = asString(data, "category") as PostCategory;
      if (!VALID_CATEGORIES.includes(category)) {
        throw new Error(`${file} has invalid category: ${category}`);
      }

      const parsedBody = parseMarkdownBody(body);
      const post: Post = {
        slug: asString(data, "slug"),
        title: asString(data, "title"),
        metaTitle: typeof data.metaTitle === "string" ? data.metaTitle : undefined,
        metaDescription: typeof data.metaDescription === "string" ? data.metaDescription : undefined,
        primaryKeyword: typeof data.primaryKeyword === "string" ? data.primaryKeyword : undefined,
        secondaryKeywords: asStringArray(data, "secondaryKeywords"),
        category,
        services: asStringArray(data, "services") as Post["services"],
        excerpt: asString(data, "excerpt"),
        date: asString(data, "date"),
        author: typeof data.author === "string" ? data.author : undefined,
        ctaService: asString(data, "ctaService") as Post["ctaService"],
        body: parsedBody,
        readingTime: "",
      };
      return post;
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}
