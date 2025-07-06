# OAuth Authentication Setup Guide

This guide explains how to configure OAuth providers in your Supabase project to enable social authentication.

## Supported Providers

The application currently supports the following OAuth providers:
- ✅ Google
- ✅ GitHub  
- ✅ Discord
- ✅ Twitter (X)

## Supabase Configuration

### 1. Access Supabase Dashboard
1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Authentication > Providers**

### 2. Configure Google OAuth

1. **Enable Google Provider** in Supabase
2. **Create Google OAuth App**:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing one
   - Enable Google+ API
   - Go to **Credentials > Create Credentials > OAuth client ID**
   - Choose **Web application**
   - Add authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret

3. **Configure in Supabase**:
   ```
   Client ID: [Your Google Client ID]
   Client Secret: [Your Google Client Secret]
   Redirect URL: https://your-project.supabase.co/auth/v1/callback
   ```

### 3. Configure GitHub OAuth

1. **Enable GitHub Provider** in Supabase
2. **Create GitHub OAuth App**:
   - Go to GitHub **Settings > Developer settings > OAuth Apps**
   - Click **New OAuth App**
   - Set Authorization callback URL: `https://your-project.supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret

3. **Configure in Supabase**:
   ```
   Client ID: [Your GitHub Client ID]
   Client Secret: [Your GitHub Client Secret]
   Redirect URL: https://your-project.supabase.co/auth/v1/callback
   ```

### 4. Configure Discord OAuth

1. **Enable Discord Provider** in Supabase
2. **Create Discord OAuth App**:
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Click **New Application**
   - Go to **OAuth2** section
   - Add redirect URI: `https://your-project.supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret

3. **Configure in Supabase**:
   ```
   Client ID: [Your Discord Client ID]
   Client Secret: [Your Discord Client Secret]
   Redirect URL: https://your-project.supabase.co/auth/v1/callback
   ```

### 5. Configure Twitter OAuth

1. **Enable Twitter Provider** in Supabase
2. **Create Twitter OAuth App**:
   - Go to [Twitter Developer Portal](https://developer.twitter.com)
   - Create a new app
   - Enable OAuth 2.0
   - Add callback URL: `https://your-project.supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret

3. **Configure in Supabase**:
   ```
   Client ID: [Your Twitter Client ID]
   Client Secret: [Your Twitter Client Secret]
   Redirect URL: https://your-project.supabase.co/auth/v1/callback
   ```

## Application Configuration

### Enabling/Disabling Providers

You can control which OAuth providers are shown to users by editing `src/lib/auth-config.ts`:

```typescript
export const authProviders: AuthProvider[] = [
  {
    id: 'google',
    name: 'Google',
    enabled: true, // Set to false to disable
    icon: 'google',
    color: 'text-red-500',
  },
  // ... other providers
];
```

### Customizing Redirect URLs

The application uses `/auth/callback` as the redirect route. You can modify this in:
- `src/hooks/useAuth.tsx` - Update the `redirectTo` option in OAuth methods
- `src/App.tsx` - Update the route path
- `src/components/AuthCallback.tsx` - The callback handler component

## Testing OAuth Flow

1. **Start your development server**: `npm run dev`
2. **Navigate to**: `http://localhost:8080/login` or `http://localhost:8080/signup`
3. **Click on any OAuth provider button**
4. **Complete the OAuth flow** on the provider's website
5. **You should be redirected back** to your application and logged in

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI"**
   - Ensure the redirect URI in your OAuth app matches exactly: `https://your-project.supabase.co/auth/v1/callback`
   - Check that you're using the correct Supabase project URL

2. **"Provider not configured"**
   - Verify the provider is enabled in Supabase Dashboard
   - Check that Client ID and Client Secret are correctly entered

3. **"Callback error"**
   - Check browser console for detailed error messages
   - Verify the `/auth/callback` route is properly configured

4. **Development vs Production**
   - Make sure to update OAuth app settings when deploying to production
   - Update redirect URIs to match your production domain

## Security Considerations

- Never commit OAuth client secrets to version control
- Use environment variables for sensitive configuration
- Regularly rotate OAuth client secrets
- Monitor OAuth provider usage and logs
- Implement proper error handling for failed authentications

## Adding New Providers

To add additional OAuth providers:

1. **Check Supabase supported providers** in the dashboard
2. **Add provider methods** to `src/hooks/useAuth.tsx`
3. **Create provider icons** in `src/components/SocialAuth.tsx`
4. **Update the configuration** in `src/lib/auth-config.ts`
5. **Test the integration** thoroughly

## Support

If you encounter issues:
- Check the [Supabase Auth documentation](https://supabase.com/docs/guides/auth)
- Review provider-specific OAuth documentation
- Check the browser console for error messages
- Verify network requests in browser dev tools