# Deployment Guide - Mikela Store

## Production Readiness Checklist

### ✅ Security
- [x] Environment variable validation
- [x] Input sanitization
- [x] Security headers in nginx
- [x] Content Security Policy
- [x] Rate limiting utilities
- [x] HTTPS-only configuration

### ✅ Performance
- [x] Code splitting with lazy loading
- [x] React.memo for component optimization
- [x] Image lazy loading and error handling
- [x] Gzip compression
- [x] Asset caching
- [x] Bundle analysis tools

### ✅ Reliability
- [x] TypeScript strict mode
- [x] Error boundaries
- [x] Structured logging
- [x] Health checks
- [x] Graceful error handling

## Environment Setup

### Required Environment Variables

Create a `.env` file with:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Production Environment Variables

For production, ensure:
- Use production Supabase project
- Enable Row Level Security (RLS) in Supabase
- Configure proper CORS settings
- Set up proper database indexes

## Deployment Options

### Option 1: Docker Deployment (Recommended)

1. **Build and deploy:**
   ```bash
   npm run docker:build
   npm run deploy:prod
   ```

2. **Access application:**
   - Open http://localhost (or your domain)
   - Health check: http://localhost/health

### Option 2: Static Hosting (Netlify, Vercel, etc.)

1. **Build the application:**
   ```bash
   npm run test:build
   ```

2. **Deploy the `dist` folder**

3. **Configure redirects for SPA:**
   ```
   /*    /index.html   200
   ```

### Option 3: Self-hosted with nginx

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Copy to web server:**
   ```bash
   cp -r dist/* /var/www/html/
   ```

3. **Configure nginx with provided config**

## Production Monitoring

### Health Checks
- **Endpoint:** `/health`
- **Expected Response:** `200 OK` with "healthy"

### Performance Monitoring
- Use browser dev tools for Core Web Vitals
- Monitor bundle size with `npm run build:analyze`
- Check lighthouse scores regularly

### Error Monitoring
- Browser console for client-side errors
- Server logs for deployment issues
- Monitor Supabase dashboard for database performance

## Security Considerations

### Content Security Policy
- Configured to allow Supabase domains
- Blocks inline scripts except where necessary
- Images allowed from Supabase storage

### Rate Limiting
- Implemented client-side for user actions
- Consider server-side rate limiting for API endpoints

### HTTPS
- Always use HTTPS in production
- Configure proper SSL/TLS certificates
- Use HSTS headers

## Database Security (Supabase)

### Row Level Security (RLS)
Enable RLS and create policies:

```sql
-- Products table (public read)
CREATE POLICY "Products are viewable by everyone" ON products
FOR SELECT USING (true);

-- Orders table (users can only see their own)
CREATE POLICY "Users can view own orders" ON orders
FOR SELECT USING (auth.uid()::text = user_id);

-- Admin-only operations
CREATE POLICY "Admins can manage all" ON products
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

## Performance Optimization

### Code Splitting
- Lazy loading implemented for all route components
- Vendor chunks separated for better caching
- Component-level code splitting with React.memo

### Image Optimization
- Lazy loading with skeleton placeholders
- Error handling for failed images
- Proper aspect ratios to prevent layout shift

### Caching Strategy
- Static assets: 1 year cache
- HTML: No cache (for SPA updates)
- API responses: Consider Supabase caching

## Troubleshooting

### Common Issues

1. **Environment Variables Not Found**
   - Check `.env` file exists and is properly formatted
   - Ensure all required variables are set
   - Restart development server after changes

2. **Build Failures**
   - Run `npm run type-check` to catch TypeScript errors
   - Check for ESLint errors with `npm run lint`
   - Ensure all dependencies are installed

3. **Docker Issues**
   - Ensure Docker is running
   - Check port 80 is not in use
   - Review docker logs for error details

4. **Supabase Connection Issues**
   - Verify URL and API key are correct
   - Check network connectivity
   - Review CORS settings in Supabase dashboard

### Performance Issues

1. **Slow Loading**
   - Check bundle size with analyzer
   - Review network tab for large assets
   - Consider implementing service worker

2. **Memory Leaks**
   - Review useEffect cleanup functions
   - Check for unclosed subscriptions
   - Monitor browser memory usage

## Maintenance

### Regular Updates
- Update dependencies monthly
- Monitor security advisories
- Keep Docker base images updated

### Monitoring
- Set up uptime monitoring
- Monitor Core Web Vitals
- Review error logs regularly

### Backup Strategy
- Database backups via Supabase
- Code repository backups
- Environment configuration backups

## Support

For deployment issues:
1. Check logs first
2. Review this documentation
3. Check Supabase status page
4. Contact development team

---

**Last Updated:** December 2024
**Version:** 1.0.0