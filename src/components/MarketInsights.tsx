import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, AlertTriangle, Lightbulb, Target, Zap } from 'lucide-react';
import type { MarketGap, CompetitiveAnalysis } from '@/lib/openai';

interface MarketInsightsProps {
  marketGaps: MarketGap[];
  competitiveAnalysis: CompetitiveAnalysis;
  searchSuggestion?: string | null;
}

export const MarketInsights = ({ 
  marketGaps, 
  competitiveAnalysis, 
  searchSuggestion 
}: MarketInsightsProps) => {
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
        
        {marketGaps.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center">
                No specific market gaps identified for this search. Try a more specific query.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {marketGaps.map((gap) => (
              <Card key={gap.id} className="relative overflow-hidden">
                <div 
                  className={`absolute top-0 left-0 w-1 h-full ${getGapSizeColor(gap.gapSize)}`}
                ></div>
                <CardHeader className="pl-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{gap.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {gap.description}
                      </CardDescription>
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
            ))}
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
              {competitiveAnalysis.oversaturatedAreas.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No oversaturated areas identified
                </p>
              ) : (
                <div className="space-y-2">
                  {competitiveAnalysis.oversaturatedAreas.map((area, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-2 p-2 bg-red-50 rounded-lg border-l-2 border-red-500"
                    >
                      <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
                      <span className="text-sm text-red-700">{area}</span>
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
              {competitiveAnalysis.underservedAreas.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No underserved areas identified
                </p>
              ) : (
                <div className="space-y-2">
                  {competitiveAnalysis.underservedAreas.map((area, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border-l-2 border-green-500"
                    >
                      <Target className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-green-700">{area}</span>
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
                {competitiveAnalysis.emergingTrends.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No emerging trends identified
                  </p>
                ) : (
                  competitiveAnalysis.emergingTrends.map((trend, index) => (
                    <Badge key={index} variant="default" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
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
                {competitiveAnalysis.riskFactors.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No specific risk factors identified
                  </p>
                ) : (
                  competitiveAnalysis.riskFactors.map((risk, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-2 text-sm text-orange-700"
                    >
                      <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                      {risk}
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