import OpenAI from 'openai';
import type { JobToBeDone } from '@/data/jobsToBeDone';

// Initialize OpenAI client - in production, this should come from environment variables
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'sk-placeholder',
  dangerouslyAllowBrowser: true
});

export interface SearchAnalysis {
  relevantOpportunities: JobToBeDone[];
  marketGaps: MarketGap[];
  searchSuggestion: string | null;
  heatmapData: HeatmapData[];
  competitiveAnalysis: CompetitiveAnalysis;
}

export interface MarketGap {
  id: string;
  title: string;
  description: string;
  gapSize: number; // 1-10 scale
  urgency: number; // 1-10 scale
  difficulty: number; // 1-10 scale
  industry: string;
  estimatedMarketSize: string;
  keyInsights: string[];
}

export interface HeatmapData {
  industry: string;
  opportunity: string;
  intensity: number; // 0-100 scale
  revenue: number;
  competition: number;
  x: number;
  y: number;
}

export interface CompetitiveAnalysis {
  oversaturatedAreas: string[];
  underservedAreas: string[];
  emergingTrends: string[];
  riskFactors: string[];
}

export const analyzeSearchQuery = async (
  query: string,
  existingOpportunities: JobToBeDone[]
): Promise<SearchAnalysis> => {
  try {
    // Check if the query is too generic or could be improved
    const isGoodQuery = await evaluateQueryQuality(query);
    
    // Generate market analysis based on the query
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a market research expert analyzing business opportunities and market gaps. 
          Given a search query, analyze the market landscape and identify opportunities, gaps, and provide insights.
          
          Respond with a JSON object containing:
          - relevantOpportunities: Array of opportunity IDs that match the query
          - marketGaps: Array of market gap objects with: id, title, description, gapSize (1-10), urgency (1-10), difficulty (1-10), industry, estimatedMarketSize, keyInsights (array of strings)
          - searchSuggestion: Better search suggestion if the original query is too generic (null if query is good)
          - heatmapData: Array of heatmap objects with: industry, opportunity, intensity (0-100), revenue (number), competition (0-100), x, y coordinates
          - competitiveAnalysis: Object with: oversaturatedAreas (array), underservedAreas (array), emergingTrends (array), riskFactors (array)
          
          Existing opportunities data: ${JSON.stringify(existingOpportunities, null, 2)}`
        },
        {
          role: "user",
          content: `Analyze this market search query: "${query}". 
          
          Provide insights on:
          1. Which existing opportunities are most relevant
          2. New market gaps that might exist in this area
          3. A better search suggestion if the query is too generic
          4. Heatmap data showing opportunity intensity across different dimensions
          5. Competitive landscape analysis
          
          Focus on actionable insights and quantifiable market opportunities.`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    const analysis = JSON.parse(response);
    
    // Filter existing opportunities based on AI analysis
    const relevantOpportunities = existingOpportunities.filter(opp => 
      analysis.relevantOpportunities?.includes(opp.id) || 
      scoreOpportunityRelevance(query, opp) > 0.6
    );

    // Validate and transform marketGaps if they're simple strings
    let marketGaps = Array.isArray(analysis.marketGaps) ? analysis.marketGaps.map((gap, index) => {
      if (typeof gap === 'string') {
        // Transform simple string to proper MarketGap object
        return {
          id: `gap-${index + 1}`,
          title: gap,
          description: `Market opportunity for ${gap.toLowerCase()}`,
          gapSize: 7,
          urgency: 6,
          difficulty: 5,
          industry: relevantOpportunities[0]?.industry || 'Technology',
          estimatedMarketSize: '$2.5B',
          keyInsights: ['Growing market demand', 'Technology enablers available']
        };
      }
      return gap;
    }) : [];
    
    // Generate fallback market gaps if none provided
    if (marketGaps.length === 0 && relevantOpportunities.length > 0) {
      marketGaps = [
        {
          id: 'gap-1',
          title: `Enhanced ${query} Solutions`,
          description: `Market opportunity for improved solutions in the ${query} space`,
          gapSize: 7,
          urgency: 6,
          difficulty: 5,
          industry: relevantOpportunities[0]?.industry || 'Technology',
          estimatedMarketSize: '$2.5B',
          keyInsights: [
            'Limited current solutions',
            'Growing market demand',
            'Technology enablers available'
          ]
        }
      ];
    }

    // Validate and transform heatmapData if it has wrong structure
    const heatmapData = Array.isArray(analysis.heatmapData) ? analysis.heatmapData.map((item, index) => {
      if (item.dimension) {
        // Transform dimension-based data to proper HeatmapData
        return {
          industry: 'Technology',
          opportunity: item.dimension,
          intensity: item.intensity * 10, // Scale 0-10 to 0-100
          revenue: item.intensity * 1000000, // Convert to revenue estimate
          competition: 50, // Default competition level
          x: index % 5,
          y: Math.floor(index / 5)
        };
      }
      return item;
    }) : [];

    // Validate competitiveAnalysis
    const competitiveAnalysis = typeof analysis.competitiveAnalysis === 'string' ? {
      oversaturatedAreas: ['General market'],
      underservedAreas: ['Specialized solutions'],
      emergingTrends: ['AI Integration', 'Automation'],
      riskFactors: ['Market competition', 'Technology changes']
    } : (analysis.competitiveAnalysis || {
      oversaturatedAreas: [],
      underservedAreas: [],
      emergingTrends: [],
      riskFactors: []
    });

    // Always generate heatmap data - either from API or fallback
    const finalHeatmapData = heatmapData.length > 0 ? heatmapData : generateFallbackHeatmapData(relevantOpportunities);
    
    console.log('Final heatmap data:', finalHeatmapData); // Debug log
    
    return {
      relevantOpportunities,
      marketGaps,
      searchSuggestion: !isGoodQuery ? analysis.searchSuggestion : null,
      heatmapData: finalHeatmapData,
      competitiveAnalysis
    };

  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Fallback to enhanced keyword matching if OpenAI fails
    return fallbackAnalysis(query, existingOpportunities);
  }
};

const evaluateQueryQuality = async (query: string): Promise<boolean> => {
  if (query.length < 10 || query.split(' ').length < 3) {
    return false;
  }
  
  // Check for generic terms
  const genericTerms = ['business', 'opportunity', 'market', 'idea', 'startup'];
  const isGeneric = genericTerms.some(term => 
    query.toLowerCase().includes(term) && query.split(' ').length < 5
  );
  
  return !isGeneric;
};

const scoreOpportunityRelevance = (query: string, opportunity: JobToBeDone): number => {
  const queryWords = query.toLowerCase().split(' ');
  let score = 0;
  
  // Check title relevance
  queryWords.forEach(word => {
    if (opportunity.title.toLowerCase().includes(word)) score += 0.3;
    if (opportunity.description.toLowerCase().includes(word)) score += 0.2;
    if (opportunity.industry.toLowerCase().includes(word)) score += 0.2;
    if (opportunity.tags.some(tag => tag.toLowerCase().includes(word))) score += 0.1;
    if (opportunity.painPoints.some(point => point.toLowerCase().includes(word))) score += 0.15;
  });
  
  return Math.min(score, 1);
};

const generateFallbackHeatmapData = (opportunities: JobToBeDone[]): HeatmapData[] => {
  return opportunities.map((opp, index) => {
    const revenue = parseFloat(opp.profitPotential.revenue.replace(/[^0-9.]/g, ''));
    const competitionScore = opp.competitionLevel === 'Low' ? 30 : 
                           opp.competitionLevel === 'Medium' ? 60 : 90;
    
    return {
      industry: opp.industry,
      opportunity: opp.title,
      intensity: Math.min(100, revenue * 2),
      revenue,
      competition: competitionScore,
      x: index % 5,
      y: Math.floor(index / 5)
    };
  });
};

const fallbackAnalysis = (query: string, opportunities: JobToBeDone[]): SearchAnalysis => {
  const keywords = query.toLowerCase().split(' ');
  
  const relevantOpportunities = opportunities.filter(opp => 
    scoreOpportunityRelevance(query, opp) > 0.3
  );

  const heatmapData = generateFallbackHeatmapData(relevantOpportunities);
  
  // Generate simple market gap suggestions
  const mainKeywords = query.split(' ').filter(Boolean).slice(0, 5).join(' ');
  const marketGaps: MarketGap[] = [
    {
      id: 'gap-1',
      title: mainKeywords,
      description: `Market gap in ${mainKeywords}`,
      gapSize: 7,
      urgency: 6,
      difficulty: 5,
      industry: relevantOpportunities[0]?.industry || 'Technology',
      estimatedMarketSize: '$2.5B',
      keyInsights: [
        'Limited current solutions',
        'Growing market demand',
        'Technology enablers available'
      ]
    }
  ];

  return {
    relevantOpportunities,
    marketGaps,
    searchSuggestion: keywords.length < 3 ? 
      `Try searching for more specific terms like "AI-powered ${query} for small businesses"` : null,
    heatmapData,
    competitiveAnalysis: {
      oversaturatedAreas: ['Consumer Apps', 'Basic SaaS'],
      underservedAreas: ['Enterprise AI', 'Vertical-specific tools'],
      emergingTrends: ['AI Integration', 'Sustainability', 'Remote Work'],
      riskFactors: ['Market saturation', 'Technology changes', 'Regulatory shifts']
    }
  };
};

export const generateSearchSuggestions = async (partialQuery: string): Promise<string[]> => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a market research assistant. Generate 3-5 specific, actionable search suggestions for market opportunity analysis based on a partial query."
        },
        {
          role: "user",
          content: `Generate search suggestions for: "${partialQuery}". Make them specific and focused on business opportunities.`
        }
      ],
      temperature: 0.8,
      max_tokens: 200
    });

    const response = completion.choices[0]?.message?.content;
    if (response) {
      return response.split('\n').filter(line => line.trim()).slice(0, 5);
    }
  } catch (error) {
    console.error('Error generating suggestions:', error);
  }
  
  // Fallback suggestions
  return [
    `AI-powered ${partialQuery} automation`,
    `${partialQuery} for small businesses`,
    `Mobile ${partialQuery} solutions`,
    `Enterprise ${partialQuery} management`,
    `Sustainable ${partialQuery} alternatives`
  ];
};