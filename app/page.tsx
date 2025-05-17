import Link from "next/link"
import { getAllPosts } from "@/lib/api"
import { formatDate } from "@/lib/utils"

export default function Home() {
  const posts = getAllPosts()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">My Blog</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.slug} href={`/posts/${post.slug}`} className="block group">
            <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {post.coverImage && (
                <div className="aspect-video w-full bg-gray-100 relative">
                  <img
                    src={post.coverImage || "/placeholder.svg"}
                    alt={post.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              <div className="p-4">
                <p className="text-sm text-gray-500 mb-2">{formatDate(post.date)}</p>
                <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">{post.title}</h2>
                <p className="text-gray-600 line-clamp-2">{post.excerpt}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
