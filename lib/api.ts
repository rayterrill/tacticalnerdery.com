import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { remark } from "remark"
import html from "remark-html"

const postsDirectory = path.join(process.cwd(), "content/posts")

export type Post = {
  slug: string
  title: string
  date: string
  excerpt?: string
  coverImage?: string
  content: string
}

export function getPostBySlug(slug: string): Post | undefined {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`)
    const fileContents = fs.readFileSync(fullPath, "utf8")
    const { data, content } = matter(fileContents)

    // Convert markdown to HTML
    const processedContent = remark().use(html).processSync(content).toString()

    return {
      slug,
      title: data.title,
      date: data.date,
      excerpt: data.excerpt,
      coverImage: data.coverImage,
      content: processedContent,
    }
  } catch (error) {
    return undefined
  }
}

export function getAllPosts(): Post[] {
  // Create the directory if it doesn't exist
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true })

    // Create a sample post if no posts exist
    const samplePost = `---
title: 'Welcome to My Blog'
date: '${new Date().toISOString()}'
excerpt: 'This is my first blog post using Next.js and Markdown'
coverImage: '/placeholder.svg?height=600&width=1200'
---

# Welcome to My Blog!

This is a sample blog post written in Markdown. You can edit this file or create new ones in the \`content/posts\` directory.

## Features

- **Markdown Support**: Write your posts in Markdown
- **Static Generation**: All pages are statically generated for fast loading
- **Responsive Design**: Looks great on all devices
- **SEO Friendly**: Good for search engines

## Code Example

\`\`\`javascript
function greeting(name) {
  return \`Hello, \${name}!\`;
}

console.log(greeting('World'));
\`\`\`

## Next Steps

1. Edit this post
2. Create new posts
3. Customize the design
4. Deploy your blog
`
    fs.writeFileSync(path.join(postsDirectory, "welcome.md"), samplePost)
  }

  // Get all post files
  const fileNames = fs.readdirSync(postsDirectory)

  const allPosts = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      // Remove ".md" from file name to get slug
      const slug = fileName.replace(/\.md$/, "")

      // Get post data
      const post = getPostBySlug(slug)

      return post
    })
    .filter((post): post is Post => post !== undefined)
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))

  return allPosts
}
