import React, { FC, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertTriangle,
  BarChart3,
<<<<<<< HEAD
=======
  Building,
>>>>>>> 076f79a (fixing merge changes.)
  ExternalLink,
  Lightbulb,
  Search,
  Target,
  TrendingUp,
  TrendingUpIcon,
<<<<<<< HEAD
=======
  Users,
>>>>>>> 076f79a (fixing merge changes.)
  Download,
  FileText,
} from 'lucide-react';
import type { MarketGap, CompetitiveAnalysis } from '@/lib/openai';
import type { JobToBeDone, Competitor } from '@/data/jobsToBeDone';
import { generateCompetitiveTechPDF, generateSimplePDF } from '@/lib/pdf-generator';
<<<<<<< HEAD
import { generateUnsolvedProblemsRoadmap } from '@/lib/openai';
=======
>>>>>>> 076f79a (fixing merge changes.)

interface MarketInsightsProps {
  marketGaps: (MarketGap | string)[];
  competitiveAnalysis: CompetitiveAnalysis | string;
  searchSuggestion?: string | null;
  allJobs?: JobToBeDone[];
  relevantJobs?: JobToBeDone[];
  searchQuery?: string;
  onGapClick?: (gap: MarketGap) => void;
  onCompetitiveAreaClick?: (
    area: string,
    type: 'oversaturated' | 'underserved' | 'trend' | 'risk'
  ) => void;
}

export const MarketInsights: FC<MarketInsightsProps> = ({
  marketGaps,
  competitiveAnalysis,
  searchSuggestion,
  allJobs = [],
  relevantJobs = [],
  searchQuery = '',
  onGapClick,
  onCompetitiveAreaClick,
}) => {


  // Normalize gaps
  const processedMarketGaps = marketGaps.map((gap, idx) =>
    typeof gap === 'string'
      ? ({
          id: `gap-${idx + 1}`,
          title: gap,
          description: `Market gap in ${gap.toLowerCase()}`,
          gapSize: 7,
          urgency: 6,
          difficulty: 5,
          industry: 'Technology',
          estimatedMarketSize: '$2.5B',
          keyInsights: ['Growing market demand', 'Technology enablers available'],
        } as MarketGap)
      : gap
  );

  // Normalize analysis
  const analysis: CompetitiveAnalysis =
    typeof competitiveAnalysis === 'string'
      ? {
          oversaturatedAreas: ['General market'],
          underservedAreas: ['Specialized solutions'],
          emergingTrends: ['AI Integration', 'Automation'],
          riskFactors: ['Market competition', 'Technology changes'],
        }
      : competitiveAnalysis;

  const getRelatedJobs = (gap: MarketGap) => {
    const keys = gap.title.toLowerCase().split(' ');
    const descWords = gap.description.toLowerCase().split(' ');
    const pool = relevantJobs.length ? relevantJobs : allJobs;
    return pool.filter((job) => {
      const txt = `${job.title} ${job.description} ${job.industry} ${job.tags.join(' ')}`.toLowerCase();
      const pains = job.painPoints.join(' ').toLowerCase();
      return (
        keys.some((k) => txt.includes(k) || pains.includes(k)) ||
        descWords.some((w) => txt.includes(w) || pains.includes(w))
      );
    });
  };

  const getCompetitorsForArea = (area: string): Competitor[] => {
    const term = area.toLowerCase();
    const pool = relevantJobs.length ? relevantJobs : allJobs;
    const all = pool.flatMap((job) => job.competitors.filter((c) =>
      c.name.toLowerCase().includes(term) || job.industry.toLowerCase().includes(term)
    ));
    const unique = all.filter((c, i, arr) => arr.findIndex((x) => x.name === c.name) === i);
    return unique.slice(0, 6);
  };



  const getDifficultyColor = (d: number) =>
    d >= 8 ? 'text-red-600' : d >= 6 ? 'text-orange-600' : d >= 4 ? 'text-yellow-600' : 'text-green-600';
  const getGapSizeColor = (s: number) =>
    s >= 8 ? 'bg-red-500' : s >= 6 ? 'bg-orange-500' : s >= 4 ? 'bg-yellow-500' : 'bg-green-500';

  // Generate PDF for unsolved problems roadmap
  const handleGeneratePDF = async () => {
    const processedGaps = processedMarketGaps.filter(gap => typeof gap !== 'string') as MarketGap[];
    
    if (processedGaps.length === 0) {
      alert('No market gaps available for PDF generation');
      return;
    }

    // Show loading state
    const button = document.querySelector('[data-pdf-button]') as HTMLButtonElement;
    const originalText = button?.textContent;
    if (button) {
      button.disabled = true;
      button.textContent = 'Generating Unsolved Problems Roadmap...';
    }

    try {
      // Generate unsolved problems roadmap using GPT
      const productRoadmap = await generateUnsolvedProblemsRoadmap(
        processedGaps, 
        searchQuery, 
        relevantJobs, 
        relevantJobs.flatMap(job => job.competitors)
      );

      const totalMarketSize = processedGaps.reduce((sum, gap) => {
        const marketSize = gap.estimatedMarketSize.replace(/[^0-9.]/g, '');
        return sum + parseFloat(marketSize || '0');
      }, 0);

      const content = {
        title: 'Strategic Product Roadmap: Addressing Unsolved Problems',
        marketGaps: processedGaps,
        totalMarketSize: `$${totalMarketSize.toFixed(1)}B`,
        generatedDate: new Date().toLocaleDateString(),
        productRoadmap,
        searchQuery
      };

      // Try to use the advanced PDF generator first, fallback to simple HTML
      try {
        generateCompetitiveTechPDF(content);
      } catch (error) {
        console.warn('Advanced PDF generation failed, using fallback:', error);
        generateSimplePDF(content);
      }
    } catch (error) {
      console.error('Error generating unsolved problems roadmap:', error);
      alert('Failed to generate unsolved problems roadmap. Please try again.');
    } finally {
      // Restore button state
      if (button) {
        button.disabled = false;
        button.textContent = originalText || 'Get Unsolved Problems Roadmap';
      }
    }
  };

<<<<<<< HEAD

=======
  // Handle competitive area click
  const handleCompetitiveAreaClick = (area: string, type: 'oversaturated' | 'underserved' | 'trend' | 'risk') => {
    setSelectedCompetitiveArea({ area, type });
    setIsCompetitorDialogOpen(true);
    onCompetitiveAreaClick?.(area, type);
  };

  const getDifficultyColor = (d: number) =>
    d >= 8 ? 'text-red-600' : d >= 6 ? 'text-orange-600' : d >= 4 ? 'text-yellow-600' : 'text-green-600';
  const getGapSizeColor = (s: number) =>
    s >= 8 ? 'bg-red-500' : s >= 6 ? 'bg-orange-500' : s >= 4 ? 'bg-yellow-500' : 'bg-green-500';

  // Generate PDF for competitive tech development
  const handleGeneratePDF = () => {
    const processedGaps = processedMarketGaps.filter(gap => typeof gap !== 'string') as MarketGap[];
    
    if (processedGaps.length === 0) {
      alert('No market gaps available for PDF generation');
      return;
    }

    const totalMarketSize = processedGaps.reduce((sum, gap) => {
      const marketSize = gap.estimatedMarketSize.replace(/[^0-9.]/g, '');
      return sum + parseFloat(marketSize || '0');
    }, 0);

    const content = {
      title: 'Competitive Tech Development Strategy',
      marketGaps: processedGaps,
      totalMarketSize: `$${totalMarketSize.toFixed(1)}B`,
      generatedDate: new Date().toLocaleDateString()
    };

    // Try to use the advanced PDF generator first, fallback to simple HTML
    try {
      generateCompetitiveTechPDF(content);
    } catch (error) {
      console.warn('Advanced PDF generation failed, using fallback:', error);
      generateSimplePDF(content);
    }
  };
>>>>>>> 076f79a (fixing merge changes.)

  return (
    <div className="space-y-6">
      {/* Search Suggestion */}
      {searchSuggestion && relevantJobs.length > 0 && (
        <Alert className="border-blue-200 bg-blue-50 flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Suggestion:</strong> {searchSuggestion}
          </AlertDescription>
        </Alert>
      )}

      {/* Market Gaps */}
      {processedMarketGaps.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Identified Market Gaps
          </h3>

<<<<<<< HEAD
          {/* Gap Analysis */}
          {(() => {
            const themes = [...new Set(processedMarketGaps.map((g) => g.description))];
            const features = [
              ...new Set(
                processedMarketGaps.flatMap((g) => g.keyInsights.filter((i) =>
                  /solution|feature/i.test(i)
                ))
              ),
            ];
            return themes.length || features.length;
          })() && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Market Gap Analysis</h4>
=======
      {/* Competitor Companies by Industry */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Building className="h-5 w-5 text-green-600" />
          Competitor Companies
        </h3>
        {
          (() => {
            // Group competitors by industry
            const industryMap = new Map<string, Competitor[]>();
            allJobs.forEach(job => {
              if (!industryMap.has(job.industry)) industryMap.set(job.industry, []);
              job.competitors.forEach((comp: Competitor) => {
                industryMap.get(job.industry)!.push(comp);
              });
            });
            return Array.from(industryMap.entries()).map(([industry, competitors]) => {
              // Deduplicate by company name
              const uniqueCompetitors: Competitor[] = Array.from(new Map(competitors.map(c => [c.name, c])).values());
              return (
                <div key={industry} className="mb-4">
                  <h4 className="text-lg font-bold mb-2">{industry}</h4>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {uniqueCompetitors.map((comp, idx) => (
                      <Card key={comp.name + idx} className="p-4 flex flex-col gap-2">
                        <div className="font-semibold">{comp.name}</div>
                        <div className="text-sm text-muted-foreground">{comp.marketShare ? `Market Share: ${comp.marketShare}` : 'Market Share: N/A'}</div>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            });
          })()
        }
      </div>

      {/* Competitive Analysis */}
      {analysis && (
        <section className="space-y-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            Competitive Landscape
          </h3>
          <div className="grid gap-4">
            {/* Oversaturated */}
            {analysis.oversaturatedAreas.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" /> Oversaturated Areas
                  </CardTitle>
                  <CardDescription>High competition markets</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analysis.oversaturatedAreas.map((area, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 p-2 bg-red-50 rounded-lg border-l-2 border-red-500 cursor-pointer hover:bg-red-100"
                        onClick={() => handleCompetitiveAreaClick(area, 'oversaturated')}
                      >
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-red-700">{area}</span>
                        <ExternalLink className="h-3 w-3 text-red-500 ml-auto" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            {/* Underserved */}
            {analysis.underservedAreas.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" /> Underserved Areas
                  </CardTitle>
                  <CardDescription>Opportunity markets</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analysis.underservedAreas.map((area, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border-l-2 border-green-500 cursor-pointer hover:bg-green-100"
                        onClick={() => handleCompetitiveAreaClick(area, 'underserved')}
                      >
                        <Target className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-700">{area}</span>
                        <ExternalLink className="h-3 w-3 text-green-500 ml-auto" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            {/* Trends */}
            {analysis.emergingTrends.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUpIcon className="h-5 w-5 text-blue-500" /> Emerging Trends
                  </CardTitle>
                  <CardDescription>Growth drivers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analysis.emergingTrends.map((trend, i) => (
                      <Badge
                        key={i}
                        variant="default"
                        className="cursor-pointer"
                        onClick={() => handleCompetitiveAreaClick(trend, 'trend')}
                      >
                        {trend}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            {/* Risks */}
            {analysis.riskFactors.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" /> Risk Factors
                  </CardTitle>
                  <CardDescription>Potential challenges</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analysis.riskFactors.map((risk, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg cursor-pointer hover:bg-orange-100"
                        onClick={() => handleCompetitiveAreaClick(risk, 'risk')}
                      >
                        <span className="w-2 h-2 bg-orange-500 rounded-full" />
                        <span className="text-sm text-orange-700">{risk}</span>
                        <ExternalLink className="h-3 w-3 text-orange-500 ml-auto" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      )}

      {/* Competitor Companies */}
      {/** Companies by industry - only show relevant to search **/}
      {relevantJobs.length > 0 && (
        (relevantJobs).some((j) => j.competitors.length > 0)
      ) && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Building className="h-5 w-5 text-green-600" /> Competitor Companies
              <span className="text-sm text-muted-foreground">(Based on Search)</span>
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGeneratePDF}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              <FileText className="h-4 w-4" />
              Download Tech Strategy
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(
              relevantJobs
                .reduce((map, job) => {
                  (map[job.industry] ??= []).push(...job.competitors);
                  return map;
                }, {} as Record<string, Competitor[]>)
            ).map(([industry, comps]) => {
              const unique = Object.values(
                comps.reduce((m, c) => ({ ...m, [c.name]: c }), {})
              ) as Competitor[];
              return (
                <div key={industry}>
                  <h4 className="font-bold text-lg mb-2">{industry}</h4>
                  <div className="grid gap-4">
                    {unique.map((c, idx) => (
                      <Card key={idx} className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-semibold">{c.name}</div>
                          <Badge variant="outline" className="text-xs">
                            {c.marketShare ?? 'N/A'}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{c.description}</p>
                        <div className="text-xs text-green-600 mb-2">
                          <strong>Strengths:</strong>{' '}{c.strengths.slice(0,2).join(', ')}
                        </div>
                        <div className="text-xs text-red-600">
                          <strong>Weaknesses:</strong>{' '}{c.weaknesses.slice(0,2).join(', ')}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Show all competitors only when no search is active */}
      {relevantJobs.length === 0 && (
        (allJobs).some((j) => j.competitors.length > 0)
      ) && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Building className="h-5 w-5 text-green-600" /> All Competitor Companies
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGeneratePDF}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              <FileText className="h-4 w-4" />
              Download Tech Strategy
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(
              allJobs
                .reduce((map, job) => {
                  (map[job.industry] ??= []).push(...job.competitors);
                  return map;
                }, {} as Record<string, Competitor[]>)
            ).map(([industry, comps]) => {
              const unique = Object.values(
                comps.reduce((m, c) => ({ ...m, [c.name]: c }), {})
              ) as Competitor[];
              return (
                <div key={industry}>
                  <h4 className="font-bold text-lg mb-2">{industry}</h4>
                  <div className="grid gap-4">
                    {unique.map((c, idx) => (
                      <Card key={idx} className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-semibold">{c.name}</div>
                          <Badge variant="outline" className="text-xs">
                            {c.marketShare ?? 'N/A'}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{c.description}</p>
                        <div className="text-xs text-green-600 mb-2">
                          <strong>Strengths:</strong>{' '}{c.strengths.slice(0,2).join(', ')}
                        </div>
                        <div className="text-xs text-red-600">
                          <strong>Weaknesses:</strong>{' '}{c.weaknesses.slice(0,2).join(', ')}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Search Suggestions */}
      {searchSuggestion && relevantJobs.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Search className="h-5 w-5 text-indigo-600" /> Suggested Searches
          </h3>
          <Card>
            <CardContent>
              {searchSuggestion.split('\n').map((s, i) => (
                <Button key={i} variant="ghost" className="w-full text-left">
                  {s}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Competitor Analysis Dialog */}
      <Dialog open={isCompetitorDialogOpen} onOpenChange={setIsCompetitorDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedCompetitiveArea?.type === 'oversaturated' && <AlertTriangle className="h-5 w-5 text-red-500" />}
              {selectedCompetitiveArea?.type === 'underserved' && <Target className="h-5 w-5 text-green-500" />}
              {selectedCompetitiveArea?.type === 'trend' && <TrendingUp className="h-5 w-5 text-blue-500" />}
              {selectedCompetitiveArea?.type === 'risk' && <AlertTriangle className="h-5 w-5 text-orange-500" />}
              Competitive Analysis: {selectedCompetitiveArea?.area}
            </DialogTitle>
            <DialogDescription>
              Detailed competitive landscape and market analysis for {selectedCompetitiveArea?.area}
            </DialogDescription>
          </DialogHeader>
          
          {selectedCompetitiveArea && (
            <div className="space-y-6">
              {/* Market Analysis */}
>>>>>>> 076f79a (fixing merge changes.)
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-blue-700">What's Not Being Solved:</h5>
                  <ul className="mt-1 text-sm text-blue-600 space-y-1">
                    {Array.from(new Set(processedMarketGaps.map((g) => g.description)))
                      .slice(0, 3)
                      .map((t, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>{t}</span>
                        </li>
                      ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-green-700">Product Functionality Needed:</h5>
                  <ul className="mt-1 text-sm text-green-600 space-y-1">
                    {Array.from(new Set(
                      processedMarketGaps.flatMap((g) => g.keyInsights)
                    ))
                      .slice(0, 3)
                      .map((f, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span>{f}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-4">
            {processedMarketGaps.map((g) => {
              const related = getRelatedJobs(g);
              return (
                <Card
                  key={g.id}
                  className="relative overflow-hidden hover:shadow-lg transition duration-150 cursor-pointer"
                  onClick={() => onGapClick?.(g)}
                >
                  <div className={`absolute top-0 left-0 w-1 h-full ${getGapSizeColor(g.gapSize)}`} />
                  <CardHeader className="pl-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{g.title}</CardTitle>
                          {onGapClick && <ExternalLink className="h-4 w-4 text-muted-foreground" />}
                        </div>
                        <CardDescription className="mt-1">{g.description}</CardDescription>

                      </div>
                      <Badge variant="outline">{g.industry}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pl-6">
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Market Size</p>
                        <p className="text-lg font-semibold text-green-600">{g.estimatedMarketSize}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Gap Intensity</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Progress value={g.gapSize * 10} className="flex-1" />
                          <span className="text-sm font-medium">{g.gapSize}/10</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Difficulty</p>
                        <p className={`text-lg font-semibold ${getDifficultyColor(g.difficulty)}`}>{g.difficulty}/10</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Key Insights</p>
                      <div className="flex flex-wrap gap-2">
                        {g.keyInsights.map((ins, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">{ins}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* Product Roadmap Button */}
      {processedMarketGaps.length > 0 && (
        <section className="space-y-4">
          <div className="flex justify-center">
            <Button
              variant="default"
              size="lg"
              onClick={handleGeneratePDF}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
              data-pdf-button
            >
              <Download className="h-5 w-5" />
              <FileText className="h-5 w-5" />
              Get Unsolved Problems Roadmap
            </Button>
          </div>
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Generate a strategic product roadmap focused on what's not being solved and the functionality needed
            </p>
            <p className="text-xs text-orange-600 font-medium">
              ⚠️ This roadmap contains strategic suggestions that should be adapted to your platform's specific needs
            </p>
          </div>
        </section>
      )}

      {/* Competitive Analysis */}
      {analysis && (
        <section className="space-y-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            Competitive Landscape
          </h3>
          <div className="grid gap-4">
            {/* Oversaturated */}
            {analysis.oversaturatedAreas.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" /> Oversaturated Areas
                  </CardTitle>
                  <CardDescription>High competition markets</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analysis.oversaturatedAreas.map((area, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 p-2 bg-red-50 rounded-lg border-l-2 border-red-500 cursor-pointer hover:bg-red-100"

                      >
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-red-700">{area}</span>
                        <ExternalLink className="h-3 w-3 text-red-500 ml-auto" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            {/* Underserved */}
            {analysis.underservedAreas.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" /> Underserved Areas
                  </CardTitle>
                  <CardDescription>Opportunity markets</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analysis.underservedAreas.map((area, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border-l-2 border-green-500 cursor-pointer hover:bg-green-100"

                      >
                        <Target className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-700">{area}</span>
                        <ExternalLink className="h-3 w-3 text-green-500 ml-auto" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            {/* Trends */}
            {analysis.emergingTrends.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUpIcon className="h-5 w-5 text-blue-500" /> Emerging Trends
                  </CardTitle>
                  <CardDescription>Growth drivers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analysis.emergingTrends.map((trend, i) => (
                      <Badge
                        key={i}
                        variant="default"
                        className="cursor-pointer"

                      >
                        {trend}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            {/* Risks */}
            {analysis.riskFactors.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" /> Risk Factors
                  </CardTitle>
                  <CardDescription>Potential challenges</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analysis.riskFactors.map((risk, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg cursor-pointer hover:bg-orange-100"

                      >
                        <span className="w-2 h-2 bg-orange-500 rounded-full" />
                        <span className="text-sm text-orange-700">{risk}</span>
                        <ExternalLink className="h-3 w-3 text-orange-500 ml-auto" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      )}





      {/* Search Suggestions */}
      {searchSuggestion && relevantJobs.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Search className="h-5 w-5 text-indigo-600" /> Suggested Searches
          </h3>
          <Card>
            <CardContent>
              {searchSuggestion.split('\n').map((s, i) => (
                <Button key={i} variant="ghost" className="w-full text-left">
                  {s}
                </Button>
              ))}
            </CardContent>
          </Card>
        </section>
      )}




    </div>
  );
};
