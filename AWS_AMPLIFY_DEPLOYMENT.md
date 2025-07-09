# 🚀 AWS Amplify Deployment Guide for Gaplytics

## 📋 Quick Start Checklist

- [ ] AWS Account created
- [ ] GitHub repository ready
- [ ] OpenAI API key obtained
- [ ] Code pushed to GitHub
- [ ] AWS Amplify Console access

---

## 🛠️ Step-by-Step Deployment Instructions

### **Step 1: Prepare Your Local Environment**

1. **Run the deployment preparation script:**
   ```bash
   ./deploy.sh
   ```

2. **Verify build works locally:**
   ```bash
   npm run build
   ```

3. **Commit and push to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for AWS Amplify deployment"
   git push origin main
   ```

### **Step 2: AWS Amplify Console Setup**

1. **Access AWS Amplify Console**
   - Go to: https://console.aws.amazon.com/amplify/
   - Sign in with your AWS account

2. **Create New Application**
   - Click "New app" → "Host web app"
   - Choose "GitHub" as repository source
   - Click "Continue"

3. **Connect GitHub Repository**
   - Authorize AWS Amplify to access GitHub
   - Select repository: `apple-vision-quest`
   - Select branch: `main`
   - Click "Next"

4. **Configure Build Settings**
   - Build settings should auto-detect from `amplify.yml`
   - Verify:
     - Build command: `npm run build`
     - Output directory: `dist`
   - Click "Next"

5. **Review and Deploy**
   - Review configuration
   - Click "Save and deploy"

### **Step 3: Configure Environment Variables**

1. **In Amplify Console:**
   - Go to your app → "Environment variables"
   - Click "Manage variables"

2. **Add Required Variables:**
   ```
   VITE_OPENAI_API_KEY = your_actual_openai_api_key_here
   ```

3. **Save and Redeploy:**
   - Click "Save"
   - Amplify will auto-trigger new build

### **Step 4: Custom Domain (Optional)**

1. **Add Custom Domain:**
   - Go to "Domain management"
   - Click "Add domain"
   - Enter your domain name
   - Follow DNS configuration

2. **SSL Certificate:**
   - Amplify auto-provisions SSL
   - Wait up to 24 hours for validation

---

## 📁 Required Files for Deployment

Your repository should include:

```
apple-vision-quest/
├── amplify.yml              # Amplify build configuration
├── package.json             # Dependencies and scripts
├── vite.config.ts           # Vite configuration
├── src/                     # Source code
├── public/                  # Static assets
├── .env.production          # Production environment variables
├── DEPLOYMENT.md            # This guide
└── deploy.sh               # Deployment script
```

---

## 🔧 Configuration Files

### **amplify.yml**
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

### **vite.config.ts** (Production Optimized)
```typescript
export default defineConfig(({ mode }) => ({
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-*'],
          charts: ['recharts'],
          openai: ['openai']
        }
      }
    }
  }
}));
```

---

## 🚨 Troubleshooting Common Issues

### **Build Fails**
- **Check build logs** in Amplify Console
- **Verify dependencies** in `package.json`
- **Test locally** with `npm run build`

### **Environment Variables Not Working**
- **Verify naming**: Must start with `VITE_`
- **Redeploy** after adding variables
- **Check browser console** for errors

### **API Calls Failing**
- **Verify OpenAI API key** is correct
- **Check API key credits**
- **Monitor API usage** in OpenAI dashboard

### **Performance Issues**
- **Enable caching** in Amplify settings
- **Optimize bundle size** (already configured)
- **Monitor CloudWatch** metrics

---

## 🔒 Security Best Practices

1. **Environment Variables**
   - Never commit API keys to Git
   - Use Amplify environment variables
   - Rotate keys regularly

2. **API Security**
   - Monitor API usage
   - Set up rate limiting
   - Configure alerts

3. **Access Control**
   - Use IAM roles properly
   - Limit Amplify permissions
   - Monitor access logs

---

## 💰 Cost Optimization

1. **Monitor Usage**
   - Check Amplify usage in AWS Console
   - Set up billing alerts
   - Monitor API costs

2. **Optimize Performance**
   - Use build caching
   - Minimize build time
   - Optimize bundle size

---

## 📊 Monitoring and Maintenance

1. **Set Up Monitoring**
   - AWS CloudWatch for metrics
   - Amplify Console for builds
   - API usage monitoring

2. **Regular Maintenance**
   - Update dependencies
   - Rotate API keys
   - Monitor performance

3. **Backup Strategy**
   - Version control for code
   - Environment variable backups
   - Database backups (if applicable)

---

## 🆘 Support Resources

- **AWS Amplify Docs**: https://docs.aws.amazon.com/amplify/
- **AWS Support**: Available with paid plans
- **Community**: AWS Amplify Discord
- **GitHub Issues**: For code-specific problems

---

## ✅ Deployment Verification

After deployment, verify:

1. **Application loads** without errors
2. **Search functionality** works
3. **API calls** are successful
4. **All tabs** display correctly
5. **Responsive design** works on mobile
6. **Performance** is acceptable

---

## 🎉 Success!

Your Gaplytics application is now deployed on AWS Amplify!

**Next Steps:**
1. Test all functionality
2. Set up monitoring
3. Configure custom domain (optional)
4. Set up CI/CD for future updates

**Remember:** Keep your API keys secure and monitor usage regularly! 