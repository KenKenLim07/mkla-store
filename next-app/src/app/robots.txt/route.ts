export function GET() {
  const content = `User-agent: *\nAllow: /\nSitemap: https://mklacreations.example.com/sitemap.xml\n`
  return new Response(content, { headers: { 'Content-Type': 'text/plain' } })
} 