export const placeholder = ''

export const metadata = { title: 'Not Found' }

export default function NotFound() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
        <p className="text-gray-600 mt-2">The page you are looking for does not exist.</p>
      </div>
    </main>
  )
} 