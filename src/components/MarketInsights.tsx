import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, AlertTriangle, Lightbulb, Target, Zap, ExternalLink, Users } from 'lucide-react';
import type { MarketGap, CompetitiveAnalysis } from '@/lib/openai';
import type { JobToBeDone } from '@/data/jobsToBeDone';

interface MarketInsightsProps {
  marketGaps: (MarketGap | string)[];
  competitiveAnalysis: CompetitiveAnalysis | string;
  searchSuggestion?: string | null;
  allJobs?: JobToBeDone[];
  onGapClick?: (gap: MarketGap) => void;
  onCompetitiveAreaClick?: (area: string, type: 'oversaturated' | 'underserved' | 'trend' | 'risk') => void;
}

export const MarketInsights = ({ 
  marketGaps, 
  competitiveAnalysis, 
  searchSuggestion,
  allJobs = [],
  onGapClick,
  onCompetitiveAreaClick
}: MarketInsightsProps) => {
  // Transform marketGaps if they're simple strings from API
  const processedMarketGaps = marketGaps.map((gap: MarketGap | string, index) => {
    if (typeof gap === 'string') {
      return {
        id: `gap-${index + 1}`,
        title: gap,
        description: `Market opportunity for ${gap.toLowerCase()}`,
        gapSize: 7,
        urgency: 6,
        difficulty: 5,
        industry: 'Technology',
        estimatedMarketSize: '$2.5B',
        keyInsights: ['Growing market demand', 'Technology enablers available']
      };
    }
    return gap;
  });

  // Ensure competitiveAnalysis has the right structure
  const processedCompetitiveAnalysis = typeof competitiveAnalysis === 'string' ? {
    oversaturatedAreas: ['General market'],
    underservedAreas: ['Specialized solutions'],
    emergingTrends: ['AI Integration', 'Automation'],
    riskFactors: ['Market competition', 'Technology changes']
  } : competitiveAnalysis;

  // Function to find related jobs for a market gap
  const getRelatedJobs = (gap: MarketGap): JobToBeDone[] => {
    const gapKeywords = gap.title.toLowerCase().split(' ');
    const gapDescription = gap.description.toLowerCase();
    
    return allJobs.filter(job => {
      const jobText = `${job.title} ${job.description} ${job.industry} ${job.tags.join(' ')}`.toLowerCase();
      const jobPainPoints = job.painPoints.join(' ').toLowerCase();
      
      // Check if any gap keywords match job content
      const keywordMatch = gapKeywords.some(keyword => 
        jobText.includes(keyword) || jobPainPoints.includes(keyword)
      );
      
      // Check if gap description relates to job
      const descriptionMatch = gapDescription.split(' ').some(word => 
        jobText.includes(word) || jobPainPoints.includes(word)
      );
      
      return keywordMatch || descriptionMatch;
    });
  };
  const getDifficultyColor = (difficulty: number) => {
    if (difficulty >= 8) return 'text-red-600';
    if (difficulty >= 6) return 'text-orange-600';
    if (difficulty >= 4) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getGapSizeColor = (gapSize: number) => {
    if (gapSize >= 8) return 'bg-red-500';
    if (gapSize >= 6) return 'bg-orange-500';
    if (gapSize >= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      {/* Search Suggestion Alert */}
      {searchSuggestion && (
        <Alert className="border-blue-200 bg-blue-50">
          <Lightbulb className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Suggestion for better results:</strong> {searchSuggestion}
          </AlertDescription>
        </Alert>
      )}

      {/* Market Gaps */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-600" />
          Identified Market Gaps
        </h3>
        
        {processedMarketGaps.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center">
                No specific market gaps identified for this search. Try a more specific query.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {processedMarketGaps.map((gap) => {
              const relatedJobs = getRelatedJobs(gap);
              return (
                <Card key={gap.id} className="relative overflow-hidden hover:shadow-hover transition-all duration-apple cursor-pointer" 
                      onClick={() => onGapClick?.(gap)}>
                  <div 
                    className={`absolute top-0 left-0 w-1 h-full ${getGapSizeColor(gap.gapSize)}`}
                  ></div>
                  <CardHeader className="pl-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{gap.title}</CardTitle>
                          {onGapClick && (
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <CardDescription className="mt-1">
                          {gap.description}
                        </CardDescription>
                        {relatedJobs.length > 0 && (
                          <div className="flex items-center gap-2 mt-3">
                            <Users className="h-4 w-4 text-blue-500" />
                            <span className="text-sm text-blue-600">
                              {relatedJobs.length} related opportunity{relatedJobs.length !== 1 ? 'ies' : 'y'}
                            </span>
                          </div>
                        )}
                      </div>
                      <Badge variant="outline" className="ml-4">
                        {gap.industry}
                      </Badge>
                    </div>
                  </CardHeader>
                <CardContent className="pl-6">
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Market Size
                      </label>
                      <div className="text-lg font-semibold text-green-600">
                        {gap.estimatedMarketSize}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Gap Intensity
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={gap.gapSize * 10} className="flex-1" />
                        <span className="text-sm font-medium">{gap.gapSize}/10</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Implementation Difficulty
                      </label>
                      <div className={`text-lg font-semibold ${getDifficultyColor(gap.difficulty)}`}>
                        {gap.difficulty}/10
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                      Key Insights
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {gap.keyInsights.map((insight, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {insight}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          </div>
        )}
      </div>

      {/* Competitive Analysis */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Zap className="h-5 w-5 text-purple-600" />
          Competitive Landscape Analysis
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          {/* Oversaturated Areas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-red-500" />
                Oversaturated Areas
              </CardTitle>
              <CardDescription>
                Markets with high competition - approach with caution
              </CardDescription>
            </CardHeader>
            <CardContent>
              {processedCompetitiveAnalysis.oversaturatedAreas.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No oversaturated areas identified
                </p>
              ) : (
                <div className="space-y-2">
                  {processedCompetitiveAnalysis.oversaturatedAreas.map((area, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-2 p-2 bg-red-50 rounded-lg border-l-2 border-red-500 hover:bg-red-100 cursor-pointer transition-colors"
                      onClick={() => onCompetitiveAreaClick?.(area, 'oversaturated')}
                    >
                      <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
                      <span className="text-sm text-red-700">{area}</span>
                      {onCompetitiveAreaClick && (
                        <ExternalLink className="h-3 w-3 text-red-500 ml-auto" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Underserved Areas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                Underserved Areas
              </CardTitle>
              <CardDescription>
                Markets with opportunity for new solutions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {processedCompetitiveAnalysis.underservedAreas.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No underserved areas identified
                </p>
              ) : (
                <div className="space-y-2">
                  {processedCompetitiveAnalysis.underservedAreas.map((area, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border-l-2 border-green-500 hover:bg-green-100 cursor-pointer transition-colors"
                      onClick={() => onCompetitiveAreaClick?.(area, 'underserved')}
                    >
                      <Target className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-green-700">{area}</span>
                      {onCompetitiveAreaClick && (
                        <ExternalLink className="h-3 w-3 text-green-500 ml-auto" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Emerging Trends and Risk Factors */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                Emerging Trends
              </CardTitle>
              <CardDescription>
                Technologies and trends driving new opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {processedCompetitiveAnalysis.emergingTrends.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No emerging trends identified
                  </p>
                ) : (
                  processedCompetitiveAnalysis.emergingTrends.map((trend, index) => (
                    <Badge 
                      key={index} 
                      variant="default" 
                      className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer"
                      onClick={() => onCompetitiveAreaClick?.(trend, 'trend')}
                    >
                      {trend}
                    </Badge>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                Risk Factors
              </CardTitle>
              <CardDescription>
                Potential challenges and risks to consider
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {processedCompetitiveAnalysis.riskFactors.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No specific risk factors identified
                  </p>
                ) : (
                  processedCompetitiveAnalysis.riskFactors.map((risk, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-2 text-sm text-orange-700 hover:bg-orange-50 p-2 rounded cursor-pointer transition-colors"
                      onClick={() => onCompetitiveAreaClick?.(risk, 'risk')}
                    >
                      <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                      {risk}
                      {onCompetitiveAreaClick && (
                        <ExternalLink className="h-3 w-3 text-orange-500 ml-auto" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};