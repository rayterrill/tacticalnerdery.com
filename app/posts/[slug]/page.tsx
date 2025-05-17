import { getAllPosts, getPostBySlug } from "@/lib/api"
import { formatDate } from "@/lib/utils"
import { notFound } from "next/navigation"

// Generate static paths for all blog posts
export async function generateStaticParams() {
  const posts = getAllPosts()

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
  }
}

export default function Post({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <article>
        <header className="mb-8">
          <p className="text-gray-500 mb-2">{formatDate(post.date)}</p>
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          {post.excerpt && <p className="text-xl text-gray-600">{post.excerpt}</p>}
          {post.coverImage && (
            <div className="mt-6 aspect-video w-full bg-gray-100 relative rounded-lg overflow-hidden">
              <img
                src={post.coverImage || "/placeholder.svg"}
                alt={post.title}
                className="object-cover w-full h-full"
              />
            </div>
          )}
        </header>

        <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </div>
  )
}
