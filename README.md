# Gaplytics - AI-Powered Market Gap Analysis

## Project Overview

Gapalytics is an intelligent market research platform that uses AI to identify untapped business opportunities and market gaps. The application provides comprehensive market analysis through interactive visualizations, competitive intelligence, and AI-powered insights.

## Key Features

🔍 **AI-Powered Search**: Advanced search with OpenAI integration for intelligent market opportunity discovery  
📊 **Market Heatmaps**: Interactive bubble charts showing opportunity intensity vs. competition levels  
🧠 **AI Insights**: Automated market gap identification and competitive landscape analysis  
📈 **Real-time Suggestions**: Dynamic search recommendations powered by AI  
🎯 **Opportunity Scoring**: Advanced algorithms to score and rank business opportunities  
💡 **Search Optimization**: Intelligent suggestions for better search queries  

## Project info

**URL**: https://lovable.dev/projects/a26566d1-f131-4221-bd5e-69ef22eb5248

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/a26566d1-f131-4221-bd5e-69ef22eb5248) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Set up environment variables (required for AI features)
cp .env.example .env
# Edit .env and add your OpenAI API key

# Step 5: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## OpenAI API Setup

To enable AI-powered features, you'll need an OpenAI API key:

1. **Get API Key**: Visit [OpenAI Platform](https://platform.openai.com/api-keys) and create an API key
2. **Configure Environment**: Copy `.env.example` to `.env` and add your key:
   ```
   VITE_OPENAI_API_KEY=your_actual_api_key_here
   ```
3. **Security Note**: Never commit your actual API key to version control

### API Usage

The application uses OpenAI for:
- **GPT-4**: Advanced market analysis and gap identification
- **GPT-3.5-turbo**: Real-time search suggestions
- **Fallback Mode**: If API fails, the app falls back to enhanced keyword matching

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

### Core Technologies
- **Vite** - Fast build tool and development server
- **TypeScript** - Type-safe JavaScript development
- **React** - Component-based UI framework
- **shadcn-ui** - Modern component library
- **Tailwind CSS** - Utility-first CSS framework

### AI & Data Visualization
- **OpenAI API** - GPT-4 and GPT-3.5 for market analysis
- **Recharts** - Interactive data visualization charts
- **Tanstack Query** - Async state management

### Backend & Authentication
- **Supabase** - Backend-as-a-Service platform
- **React Router** - Client-side routing

## Application Structure

```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   ├── MarketHeatmap.tsx    # Interactive heatmap visualization
│   ├── MarketInsights.tsx   # AI insights and analysis display
│   └── SearchBar.tsx        # Enhanced search with AI suggestions
├── lib/
│   └── openai.ts        # OpenAI API integration
├── pages/
│   └── Index.tsx        # Main application page
└── data/
    └── jobsToBeDone.ts  # Market opportunity data
```

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/a26566d1-f131-4221-bd5e-69ef22eb5248) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
