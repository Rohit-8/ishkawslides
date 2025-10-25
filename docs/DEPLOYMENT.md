# Deployment Guide

## Overview

This guide covers deploying the MagicSlides AI application to various cloud platforms and environments. The application consists of a Node.js backend and a React frontend that can be deployed separately or together.

## Prerequisites

- Git repository with your code
- Cloud platform account (AWS, Google Cloud, Azure, etc.)
- Domain name (optional but recommended)
- SSL certificate (for production)

## Backend Deployment

### Option 1: Heroku (Recommended for beginners)

1. **Prepare for Deployment**
   ```bash
   cd backend
   
   # Create Procfile
   echo "web: node dist/index.js" > Procfile
   
   # Ensure build script exists in package.json
   npm run build
   ```

2. **Deploy to Heroku**
   ```bash
   # Install Heroku CLI
   # Login to Heroku
   heroku login
   
   # Create app
   heroku create magicslides-api
   
   # Set environment variables
   heroku config:set GEMINI_API_KEY=your_api_key
   heroku config:set NODE_ENV=production
   heroku config:set CORS_ORIGIN=https://your-frontend-domain.com
   
   # Deploy
   git subtree push --prefix backend heroku main
   ```

### Option 2: DigitalOcean App Platform

1. **Create App**
   - Go to DigitalOcean Apps
   - Connect your GitHub repository
   - Select backend folder as source

2. **Configure Build**
   ```yaml
   # .do/app.yaml
   name: magicslides-backend
   services:
   - name: api
     source_dir: /backend
     github:
       repo: your-username/magicslides
       branch: main
     run_command: npm start
     build_command: npm run build
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
     envs:
     - key: GEMINI_API_KEY
       value: your_api_key
       type: SECRET
     - key: NODE_ENV
       value: production
     - key: CORS_ORIGIN
       value: https://your-frontend-domain.com
   ```

### Option 3: AWS EC2

1. **Launch EC2 Instance**
   - Choose Ubuntu 20.04 LTS
   - Select t2.micro for free tier
   - Configure security groups (port 80, 443, 22)

2. **Setup Server**
   ```bash
   # Connect to instance
   ssh -i your-key.pem ubuntu@your-instance-ip
   
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   
   # Clone repository
   git clone https://github.com/your-username/magicslides.git
   cd magicslides/backend
   
   # Install dependencies
   npm install
   
   # Build application
   npm run build
   
   # Create environment file
   nano .env
   ```

3. **Configure PM2**
   ```bash
   # Create ecosystem file
   cat > ecosystem.config.js << EOF
   module.exports = {
     apps: [{
       name: 'magicslides-api',
       script: 'dist/index.js',
       instances: 'max',
       exec_mode: 'cluster',
       env: {
         NODE_ENV: 'production',
         PORT: 3001
       }
     }]
   }
   EOF
   
   # Start application
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

4. **Setup Nginx**
   ```bash
   # Install Nginx
   sudo apt install nginx -y
   
   # Create server block
   sudo nano /etc/nginx/sites-available/magicslides
   ```
   
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   
   ```bash
   # Enable site
   sudo ln -s /etc/nginx/sites-available/magicslides /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### Option 4: Docker Deployment

1. **Create Dockerfile**
   ```dockerfile
   # backend/Dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   
   # Copy package files
   COPY package*.json ./
   RUN npm ci --only=production
   
   # Copy source code
   COPY . .
   
   # Build application
   RUN npm run build
   
   # Create non-root user
   RUN addgroup -g 1001 -S nodejs
   RUN adduser -S nodejs -u 1001
   
   # Change ownership
   RUN chown -R nodejs:nodejs /app
   USER nodejs
   
   EXPOSE 3001
   
   CMD ["node", "dist/index.js"]
   ```

2. **Build and Run**
   ```bash
   # Build image
   docker build -t magicslides-backend .
   
   # Run container
   docker run -d \
     --name magicslides-api \
     -p 3001:3001 \
     -e GEMINI_API_KEY=your_api_key \
     -e NODE_ENV=production \
     magicslides-backend
   ```

## Frontend Deployment

### Option 1: Netlify (Recommended)

1. **Prepare Build**
   ```bash
   cd frontend
   
   # Create _redirects file for SPA routing
   echo "/*    /index.html   200" > public/_redirects
   
   # Update environment variables
   echo "REACT_APP_API_URL=https://your-api-domain.com" > .env.production
   ```

2. **Deploy via Git**
   - Connect GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `build`
   - Add environment variables in Netlify dashboard

3. **Manual Deploy**
   ```bash
   # Build locally
   npm run build
   
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Login and deploy
   netlify login
   netlify deploy --prod --dir=build
   ```

### Option 2: Vercel

1. **Deploy with Vercel CLI**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Login and deploy
   vercel login
   cd frontend
   vercel --prod
   ```

2. **Configure vercel.json**
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ],
     "env": {
       "REACT_APP_API_URL": "https://your-api-domain.com"
     }
   }
   ```

### Option 3: AWS S3 + CloudFront

1. **Build Application**
   ```bash
   cd frontend
   REACT_APP_API_URL=https://your-api-domain.com npm run build
   ```

2. **Create S3 Bucket**
   ```bash
   # Install AWS CLI
   aws configure
   
   # Create bucket
   aws s3 mb s3://magicslides-frontend
   
   # Enable static website hosting
   aws s3 website s3://magicslides-frontend \
     --index-document index.html \
     --error-document index.html
   ```

3. **Upload Files**
   ```bash
   # Sync build files
   aws s3 sync build/ s3://magicslides-frontend --delete
   
   # Set bucket policy for public read
   aws s3api put-bucket-policy \
     --bucket magicslides-frontend \
     --policy file://bucket-policy.json
   ```

4. **Setup CloudFront**
   ```json
   {
     "Comment": "MagicSlides Frontend Distribution",
     "DefaultRootObject": "index.html",
     "Origins": [{
       "Id": "S3-magicslides-frontend",
       "DomainName": "magicslides-frontend.s3.amazonaws.com",
       "S3OriginConfig": {
         "OriginAccessIdentity": ""
       }
     }],
     "DefaultCacheBehavior": {
       "TargetOriginId": "S3-magicslides-frontend",
       "ViewerProtocolPolicy": "redirect-to-https",
       "CustomErrorResponses": [{
         "ErrorCode": 404,
         "ResponseCode": 200,
         "ResponsePagePath": "/index.html"
       }]
     }
   }
   ```

## Full Stack Deployment

### Option 1: Single Server Setup

1. **Server Configuration**
   ```bash
   # Install dependencies
   sudo apt update
   sudo apt install nodejs npm nginx certbot python3-certbot-nginx -y
   
   # Clone repository
   git clone https://github.com/your-username/magicslides.git
   cd magicslides
   ```

2. **Build Applications**
   ```bash
   # Build backend
   cd backend
   npm install
   npm run build
   
   # Build frontend
   cd ../frontend
   REACT_APP_API_URL=https://yourdomain.com npm run build
   ```

3. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       # Frontend
       location / {
           root /path/to/magicslides/frontend/build;
           try_files $uri $uri/ /index.html;
       }
       
       # Backend API
       location /api {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
       
       # WebSocket
       location /socket.io {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "upgrade";
       }
   }
   ```

### Option 2: Docker Compose

1. **Create docker-compose.yml**
   ```yaml
   version: '3.8'
   
   services:
     backend:
       build: ./backend
       environment:
         - GEMINI_API_KEY=${GEMINI_API_KEY}
         - NODE_ENV=production
         - CORS_ORIGIN=https://yourdomain.com
       volumes:
         - ./backend/uploads:/app/uploads
       networks:
         - app-network
   
     frontend:
       build: ./frontend
       environment:
         - REACT_APP_API_URL=https://yourdomain.com
       networks:
         - app-network
   
     nginx:
       image: nginx:alpine
       ports:
         - "80:80"
         - "443:443"
       volumes:
         - ./nginx.conf:/etc/nginx/nginx.conf
         - ./ssl:/etc/nginx/ssl
       depends_on:
         - backend
         - frontend
       networks:
         - app-network
   
   networks:
     app-network:
       driver: bridge
   ```

2. **Deploy**
   ```bash
   # Create environment file
   echo "GEMINI_API_KEY=your_api_key" > .env
   
   # Deploy
   docker-compose up -d
   ```

## SSL/HTTPS Setup

### Using Let's Encrypt (Certbot)

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Using CloudFlare

1. Set up CloudFlare account
2. Add your domain
3. Update nameservers
4. Enable SSL/TLS encryption
5. Set SSL mode to "Full (strict)"

## Environment Variables

### Production Environment Variables

**Backend (.env)**
```env
GEMINI_API_KEY=your_production_api_key
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://yourdomain.com
UPLOAD_PATH=/app/uploads
MAX_FILE_SIZE=10485760
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000
LOG_LEVEL=info
```

**Frontend (.env.production)**
```env
REACT_APP_API_URL=https://yourdomain.com
REACT_APP_SOCKET_URL=https://yourdomain.com
REACT_APP_ENVIRONMENT=production
```

## Monitoring and Logging

### Backend Monitoring

1. **PM2 Monitoring**
   ```bash
   # Monitor processes
   pm2 monit
   
   # View logs
   pm2 logs magicslides-api
   
   # Restart app
   pm2 restart magicslides-api
   ```

2. **Log Management**
   ```bash
   # Rotate logs
   pm2 install pm2-logrotate
   pm2 set pm2-logrotate:max_size 10M
   pm2 set pm2-logrotate:retain 30
   ```

### Health Checks

1. **API Health Check**
   ```bash
   # Test endpoint
   curl https://yourdomain.com/health
   ```

2. **Uptime Monitoring**
   - Use services like UptimeRobot
   - Monitor /health endpoint
   - Set up alerts for downtime

## Performance Optimization

### Backend Optimization

1. **Enable Compression**
   ```javascript
   // Add to Express app
   const compression = require('compression');
   app.use(compression());
   ```

2. **Caching**
   ```javascript
   // Redis caching
   const redis = require('redis');
   const client = redis.createClient();
   
   // Cache frequently accessed data
   app.get('/api/suggestions', async (req, res) => {
     const cached = await client.get('suggestions');
     if (cached) return res.json(JSON.parse(cached));
     
     // Fetch and cache
     const suggestions = await getSuggestions();
     await client.setex('suggestions', 3600, JSON.stringify(suggestions));
     res.json(suggestions);
   });
   ```

### Frontend Optimization

1. **Code Splitting**
   ```javascript
   // Lazy load components
   const PresentationPreview = React.lazy(() => 
     import('./components/PresentationPreview')
   );
   ```

2. **CDN Optimization**
   ```html
   <!-- Preload critical resources -->
   <link rel="preload" href="/api/chat/suggestions" as="fetch" crossorigin>
   ```

## Backup and Recovery

### Database Backup
```bash
# If using database, create backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"

# Create backup
mongodump --out $BACKUP_DIR/backup_$DATE

# Compress
tar -czf $BACKUP_DIR/backup_$DATE.tar.gz $BACKUP_DIR/backup_$DATE
rm -rf $BACKUP_DIR/backup_$DATE

# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +7 -delete
```

### File Backup
```bash
# Backup uploads directory
rsync -av /app/uploads/ /backups/uploads/
```

## Security Checklist

- [ ] Enable HTTPS with valid SSL certificate
- [ ] Set secure CORS origins
- [ ] Enable rate limiting
- [ ] Use environment variables for secrets
- [ ] Keep dependencies updated
- [ ] Enable security headers
- [ ] Monitor for vulnerabilities
- [ ] Regular security audits
- [ ] Backup sensitive data
- [ ] Monitor logs for suspicious activity

## Troubleshooting

### Common Deployment Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Review build logs for specific errors

2. **API Connection Issues**
   - Verify CORS settings
   - Check firewall rules
   - Test API endpoints directly

3. **WebSocket Problems**
   - Ensure proxy passes WebSocket upgrade headers
   - Check for connection timeouts
   - Verify Socket.io configuration

4. **Performance Issues**
   - Monitor server resources
   - Optimize database queries
   - Enable caching
   - Use CDN for static assets

### Debugging Commands

```bash
# Check server status
systemctl status nginx
pm2 status

# View logs
tail -f /var/log/nginx/error.log
pm2 logs magicslides-api

# Test connectivity
curl -I https://yourdomain.com/health
telnet yourdomain.com 80

# Check SSL certificate
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com
```

## Scaling Considerations

### Horizontal Scaling
- Use load balancers (nginx, HAProxy)
- Deploy multiple backend instances
- Implement session affinity for WebSocket connections
- Use Redis for shared session storage

### Vertical Scaling
- Increase server resources (CPU, RAM)
- Optimize application performance
- Use clustering for Node.js processes

### Database Scaling
- Implement connection pooling
- Use read replicas for read-heavy operations
- Consider database sharding for large datasets