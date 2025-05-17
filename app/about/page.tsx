export default function About() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-4xl font-bold mb-6">About</h1>
      <div className="prose prose-lg max-w-none">
        <p>
          Welcome to my blog! This is a statically generated blog built with Next.js. I write about various topics that
          interest me.
        </p>
        <p>This blog is built using:</p>
        <ul>
          <li>Next.js with App Router</li>
          <li>Static Site Generation (SSG)</li>
          <li>Markdown for content</li>
          <li>Tailwind CSS for styling</li>
          <li>Deployed via GitHub Actions</li>
        </ul>
      </div>
    </div>
  )
}
