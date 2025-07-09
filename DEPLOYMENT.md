# 🚀 AWS Amplify Deployment Guide

## Prerequisites
- AWS Account
- GitHub repository with your code
- OpenAI API key

## Step 1: Prepare Your Repository

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for AWS Amplify deployment"
   git push origin main
   ```

2. **Ensure your repository includes:**
   - `package.json`
   - `vite.config.ts`
   - `amplify.yml`
   - `src/` directory
   - All component files

## Step 2: AWS Amplify Console Setup

1. **Sign in to AWS Console**
   - Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
   - Sign in with your AWS account

2. **Create New App**
   - Click "New app" → "Host web app"
   - Choose "GitHub" as your repository source
   - Click "Continue"

3. **Connect Repository**
   - Authorize AWS Amplify to access your GitHub account
   - Select your repository: `apple-vision-quest`
   - Select the branch: `main`
   - Click "Next"

4. **Configure Build Settings**
   - Build settings should auto-detect from `amplify.yml`
   - Verify the settings match:
     - Build command: `npm run build`
     - Output directory: `dist`
   - Click "Next"

5. **Review and Deploy**
   - Review the configuration
   - Click "Save and deploy"

## Step 3: Configure Environment Variables

1. **In Amplify Console**
   - Go to your app → "Environment variables"
   - Click "Manage variables"

2. **Add Environment Variables**
   ```
   VITE_OPENAI_API_KEY = your_actual_openai_api_key_here
   ```

3. **Save and Redeploy**
   - Click "Save"
   - Amplify will automatically trigger a new build

## Step 4: Custom Domain (Optional)

1. **Add Custom Domain**
   - Go to "Domain management"
   - Click "Add domain"
   - Enter your domain name
   - Follow the DNS configuration instructions

2. **SSL Certificate**
   - Amplify automatically provisions SSL certificates
   - Wait for certificate validation (can take up to 24 hours)

## Step 5: Monitor and Maintain

1. **Monitor Builds**
   - Check build logs in Amplify Console
   - Set up notifications for build failures

2. **Environment Variables**
   - Keep your API keys secure
   - Rotate keys regularly
   - Use different keys for staging/production

## Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check build logs in Amplify Console
   - Verify all dependencies are in `package.json`
   - Ensure `amplify.yml` is correct

2. **Environment Variables Not Working**
   - Verify variable names start with `VITE_`
   - Redeploy after adding variables
   - Check browser console for errors

3. **API Calls Failing**
   - Verify OpenAI API key is correct
   - Check CORS settings
   - Ensure API key has sufficient credits

### Performance Optimization:

1. **Enable Caching**
   - Amplify automatically caches static assets
   - Configure CDN settings if needed

2. **Monitor Performance**
   - Use AWS CloudWatch for monitoring
   - Set up alerts for performance issues

## Security Best Practices

1. **Environment Variables**
   - Never commit API keys to Git
   - Use Amplify environment variables
   - Rotate keys regularly

2. **API Security**
   - Implement rate limiting
   - Monitor API usage
   - Set up alerts for unusual activity

## Cost Optimization

1. **Monitor Usage**
   - Check Amplify usage in AWS Console
   - Set up billing alerts

2. **Optimize Builds**
   - Use build caching
   - Minimize build time
   - Clean up unused resources

## Support

- **AWS Amplify Documentation**: https://docs.aws.amazon.com/amplify/
- **AWS Support**: Available with paid plans
- **Community**: AWS Amplify Discord and forums 