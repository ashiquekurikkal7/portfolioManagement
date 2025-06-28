# Deployment Guide

This guide covers deployment options for the Portfolio Management System, including production builds, environment configuration, and platform-specific instructions.

## 🏗️ Production Build

### Prerequisites
- Node.js 18+ installed
- All dependencies installed (`npm install`)
- Environment variables configured

### Build Process

1. **Create production build**
   ```bash
   npm run build
   ```

2. **Preview production build locally**
   ```bash
   npm run preview
   ```

The build process will:
- Optimize and minify all assets
- Generate static files in the `dist/` directory
- Create source maps for debugging
- Optimize bundle splitting

## 🌐 Deployment Options

### 1. Vercel (Recommended)

Vercel provides excellent performance and easy deployment for React applications.

#### Setup
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? [your-account]
# - Link to existing project? N
# - What's your project's name? portfolio-management-system
# - In which directory is your code located? ./
# - Want to override the settings? N
```

#### Configuration
Create `vercel.json` in the root directory:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "env": {
    "VITE_API_BASE_URL": "https://your-api-domain.com"
  }
}
```

#### Environment Variables
Set in Vercel dashboard:
- `VITE_API_BASE_URL`
- `VITE_APP_NAME`
- `VITE_APP_VERSION`

### 2. Netlify

Netlify offers continuous deployment and form handling.

#### Setup
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy

# Follow the prompts and deploy to production
netlify deploy --prod
```

#### Configuration
Create `netlify.toml` in the root directory:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  VITE_API_BASE_URL = "https://your-api-domain.com"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. AWS S3 + CloudFront

For enterprise deployments with custom domain and CDN.

#### Setup
```bash
# Install AWS CLI
aws configure

# Create S3 bucket
aws s3 mb s3://your-portfolio-app

# Upload build files
aws s3 sync dist/ s3://your-portfolio-app --delete

# Configure CloudFront distribution
# (Use AWS Console or CloudFormation)
```

#### Configuration
Create `aws-deploy.sh`:
```bash
#!/bin/bash
echo "Building application..."
npm run build

echo "Uploading to S3..."
aws s3 sync dist/ s3://your-portfolio-app --delete

echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"

echo "Deployment complete!"
```

### 4. Docker

For containerized deployments.

#### Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf
```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Gzip compression
        gzip on;
        gzip_vary on;
        gzip_min_length 1024;
        gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

#### Build and Run
```bash
# Build Docker image
docker build -t portfolio-management-system .

# Run container
docker run -p 80:80 portfolio-management-system
```

### 5. GitHub Pages

For simple static hosting.

#### Setup
1. Add to `package.json`:
   ```json
   {
     "homepage": "https://yourusername.github.io/portfolio-management-system",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

2. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

3. Deploy:
   ```bash
   npm run deploy
   ```

## 🔧 Environment Configuration

### Production Environment Variables

Create `.env.production`:
```env
VITE_API_BASE_URL=https://your-api-domain.com
VITE_APP_NAME=Portfolio Management System
VITE_APP_VERSION=1.0.0
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_MONITORING=true
```

### Environment-Specific Builds

```bash
# Development
npm run dev

# Staging
npm run build:staging

# Production
npm run build:prod
```

Add to `package.json`:
```json
{
  "scripts": {
    "build:staging": "vite build --mode staging",
    "build:prod": "vite build --mode production"
  }
}
```

## 🔒 Security Configuration

### Content Security Policy

Add to `index.html`:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' 'unsafe-eval'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data: https:; 
               font-src 'self' data:;">
```

### HTTPS Configuration

For production deployments:
- Enable HTTPS redirects
- Configure SSL certificates
- Set secure headers

### API Security

- Use environment variables for API keys
- Implement CORS properly
- Set up rate limiting
- Configure authentication

## 📊 Performance Optimization

### Build Optimization

1. **Code Splitting**
   - Routes are automatically code-split
   - Large dependencies are separated

2. **Asset Optimization**
   - Images are optimized
   - CSS is minified
   - JavaScript is tree-shaken

3. **Caching Strategy**
   - Static assets cached for 1 year
   - HTML files cached for short periods
   - API responses cached appropriately

### Monitoring

1. **Performance Monitoring**
   - Core Web Vitals tracking
   - Error tracking
   - User analytics

2. **Health Checks**
   - API endpoint monitoring
   - System resource monitoring
   - Error rate tracking

## 🚀 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### Environment Secrets

Set up in your deployment platform:
- `VERCEL_TOKEN`
- `ORG_ID`
- `PROJECT_ID`
- `API_BASE_URL`

## 🔍 Post-Deployment Checklist

### Functionality Testing
- [ ] All pages load correctly
- [ ] Navigation works properly
- [ ] Forms submit successfully
- [ ] Data displays correctly
- [ ] Error handling works

### Performance Testing
- [ ] Page load times are acceptable
- [ ] Images load properly
- [ ] API calls work correctly
- [ ] Caching is working

### Security Testing
- [ ] HTTPS is enabled
- [ ] Security headers are set
- [ ] No sensitive data in client code
- [ ] API endpoints are secure

### Monitoring Setup
- [ ] Error tracking is configured
- [ ] Performance monitoring is active
- [ ] Analytics are working
- [ ] Health checks are set up

## 🆘 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **Routing Issues**
   - Ensure SPA routing is configured
   - Check for 404 redirects to index.html

3. **API Connection Issues**
   - Verify environment variables
   - Check CORS configuration
   - Test API endpoints directly

4. **Performance Issues**
   - Check bundle size
   - Optimize images
   - Enable compression

### Support

For deployment issues:
1. Check the platform-specific documentation
2. Review build logs
3. Test locally with production build
4. Contact platform support if needed

---

**Happy Deploying! 🚀** 