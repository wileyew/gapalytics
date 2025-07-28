
import React, { FC, useState, useMemo } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { JobCard } from '@/components/JobCard';
import { JobDetails } from '@/components/JobDetails';
import { Header } from '@/components/Header';
import { MarketHeatmap } from '@/components/MarketHeatmap';
import { MarketInsights } from '@/components/MarketInsights';
import { IndustryDrillDown } from '@/components/IndustryDrillDown';
import { TechnologyDrillDown } from '@/components/TechnologyDrillDown';
import { jobsToBeDone, JobToBeDone, industries, tags } from '@/data/jobsToBeDone';
import { analyzeSearchQuery, type SearchAnalysis, type MarketGap, type HeatmapData } from '@/lib/openai';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Lightbulb, Target, DollarSign, BarChart3, Brain } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import heroImage from '@/assets/hero-opportunities.jpg';

const Index: FC = () => {
  const [selectedJob, setSelectedJob] = useState<JobToBeDone | null>(null);
  const [searchAnalysis, setSearchAnalysis] = useState<SearchAnalysis | null>(null);
  const [previousSearchAnalysis, setPreviousSearchAnalysis] = useState<SearchAnalysis | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('opportunities');
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [selectedGap, setSelectedGap] = useState<MarketGap | null>(null);
  const [selectedIndustryDrillDown, setSelectedIndustryDrillDown] = useState<string | null>(null);
  const [selectedTechnologyDrillDown, setSelectedTechnologyDrillDown] = useState<string | null>(null);
  const [lastSearchQuery, setLastSearchQuery] = useState<string>('');
  const [showingAllOpportunities, setShowingAllOpportunities] = useState<boolean>(true);

  // Compute industry insights
  const industryInsights = useMemo(() => {
    if (!searchAnalysis?.heatmapData?.length) return [];
    // Dedupe by industry
    const map = new Map<string, HeatmapData>();
    searchAnalysis.heatmapData.forEach(item => {
      if (!map.has(item.industry)) {
        map.set(item.industry, item);
      }
    });
    return Array.from(map.values()).map(item => {
      const unsolvedJobs = jobsToBeDone.filter(
        job =>
          job.industry === item.industry &&
          !searchAnalysis.relevantOpportunities?.some(ro => ro.id === job.id)
      );
      const revenuePotential = unsolvedJobs.reduce(
        (sum, job) => sum + parseFloat(job.profitPotential.revenue.replace(/[^0-9.]/g, '')),
        0
      );
      return {
        industry: item.industry,
        leadingCompanies: [], // Property doesn't exist on HeatmapData
        unsolvedJobs,
        revenuePotential,
      };
    });
  }, [searchAnalysis]);

  // Filter jobs by search and industry/tag filters
  const filteredJobs = useMemo<JobToBeDone[]>(() => {
    const base = showingAllOpportunities
      ? jobsToBeDone
      : searchAnalysis?.relevantOpportunities || [];
    return base.filter(
      job =>
        (!selectedIndustry || job.industry === selectedIndustry) &&
        (!selectedTag || job.tags.includes(selectedTag))
    );
  }, [showingAllOpportunities, searchAnalysis, selectedIndustry, selectedTag]);

  const isShowingSearchResults = useMemo<boolean>(
    () => hasSearched && !!searchAnalysis?.relevantOpportunities?.length,
    [hasSearched, searchAnalysis]
  );

  const totalCount = jobsToBeDone.length;
  const resultsCount = searchAnalysis?.relevantOpportunities?.length || 0;

  // Search handler
  const handleSearch = async (query: string) => {
    // Clear previous industry cards immediately
    setSearchAnalysis(prev => (prev ? { ...prev, heatmapData: [] } : null));
    setIsSearching(true);
    setHasSearched(true);
    setLastSearchQuery(query);
    if (searchAnalysis) setPreviousSearchAnalysis(searchAnalysis);
    try {
      const analysis = await analyzeSearchQuery(query, jobsToBeDone);
      const hasHeat = !!analysis.heatmapData?.length;
      const hasGaps = !!analysis.marketGaps?.length;

      if (!analysis.relevantOpportunities?.length && !hasHeat && !hasGaps) {
        toast({
          variant: 'destructive',
          title: 'No results found',
          description: `No opportunities found for "${query}".`,
        });
        if (previousSearchAnalysis) {
          setSearchAnalysis(previousSearchAnalysis);
        } else {
          setSearchAnalysis({
            relevantOpportunities: jobsToBeDone,
            heatmapData: [],
            marketGaps: [],
            competitiveAnalysis: {
              oversaturatedAreas: [],
              underservedAreas: [],
              emergingTrends: [],
              riskFactors: [],
            },
            searchSuggestion: `Try "AI-powered ${query}"`,
          });
          setShowingAllOpportunities(true);
        }
        setActiveTab('opportunities');
      } else {
        setSearchAnalysis({ ...analysis, heatmapData: analysis.heatmapData || [] });
        setShowingAllOpportunities(false);
        setSelectedIndustry('');
        setSelectedTag('');
        setSelectedGap(null);
        setActiveTab(hasHeat ? 'heatmap' : hasGaps ? 'insights' : 'opportunities');
        toast({
          title: 'Search complete',
          description: `${analysis.relevantOpportunities?.length || 0} opportunities found.`,
        });
      }
    } catch {
      toast({ variant: 'destructive', title: 'Search failed', description: 'Please try again.' });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero relative">
      <Header />
      <div
        className="absolute inset-0 bg-cover bg-center opacity-5"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <main className="relative px-4 pt-16 pb-24 max-w-7xl mx-auto">
        {/* Hero & Search */}
        <section className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Gapalytics
            </span>
            <br />
            Market Gap Analysis
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Discover untapped opportunities with AI insights.
          </p>
        </section>
        <section className="max-w-4xl mx-auto mb-16">
          <SearchBar onSearch={handleSearch} isLoading={isSearching} />
        </section>

        {/* Stats */}
        <section className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
          <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-card">
            <Target className="h-6 w-6 text-apple-blue mx-auto" />
            <p className="mt-2 text-2xl font-bold text-center">{totalCount}</p>
            <p className="text-sm text-muted-foreground text-center">
              Opportunities
            </p>
          </Card>
          <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-card">
            <TrendingUp className="h-6 w-6 text-apple-green mx-auto" />
            <p className="mt-2 text-2xl font-bold text-center">
              ${jobsToBeDone
                .reduce(
                  (sum, j) => sum + parseFloat(j.marketSize.replace(/[^0-9.]/g, '')),
                  0
                )
                .toFixed(1)}
              B
            </p>
            <p className="text-sm text-muted-foreground text-center">
              Market Value
            </p>
          </Card>
          <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-card">
            <DollarSign className="h-6 w-6 text-apple-orange mx-auto" />
            <p className="mt-2 text-2xl font-bold text-center">
              $
              {(
                jobsToBeDone.reduce(
                  (sum, j) =>
                    sum + parseFloat(j.profitPotential.revenue.replace(/[^0-9.]/g, '')),
                  0
                ) / totalCount
              ).toFixed(0)}
              M
            </p>
            <p className="text-sm text-muted-foreground text-center">
              Avg Revenue
            </p>
          </Card>
          <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-card">
            <Lightbulb className="h-6 w-6 text-primary mx-auto" />
            <p className="mt-2 text-2xl font-bold text-center">
              {industries.length}
            </p>
            <p className="text-sm text-muted-foreground text-center">
              Industries
            </p>
          </Card>
        </section>

        {/* Tabs */}
        <section className="px-4">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="max-w-7xl mx-auto"
          >
            <TabsList className="grid grid-cols-3 mb-8">
              {showingAllOpportunities && (
                <TabsTrigger value="opportunities">
                  Opportunities
                  {isShowingSearchResults && <Badge>{resultsCount}</Badge>}
                </TabsTrigger>
              )}
              {searchAnalysis?.heatmapData?.length > 0 && (
                <TabsTrigger value="heatmap">
                  Market Heatmap
                  <Badge>{searchAnalysis.heatmapData.length}</Badge>
                </TabsTrigger>
              )}
              <TabsTrigger value="insights">
                AI Insights
                {searchAnalysis?.marketGaps?.length ? (
                  <Badge>{searchAnalysis.marketGaps.length}</Badge>
                ) : null}
              </TabsTrigger>
            </TabsList>

            {/* Opportunities Tab */}
            {showingAllOpportunities && (
              <TabsContent value="opportunities">
                {industryInsights.length > 0 && (
                  <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">
                      Industry Overviews
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {industryInsights.map(insight => (
                        <Card
                          key={insight.industry}
                          className="p-6 bg-white/90 shadow-card"
                        >
                          <h3 className="text-xl font-bold mb-2">
                            {insight.industry}
                          </h3>
                          <p className="text-sm mb-1">
                            Leading: {insight.leadingCompanies.join(', ')}
                          </p>
                          <p className="text-sm mb-2">
                            Unsolved: {insight.unsolvedJobs.length}
                          </p>
                          <p className="font-medium">
                            Revenue: ${insight.revenuePotential.toFixed(0)}M
                          </p>
                        </Card>
                      ))}
                    </div>
                  </section>
                )}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredJobs.map(job => (
                    <JobCard key={job.id} job={job} onClick={setSelectedJob} />
                  ))}
                </div>
              </TabsContent>
            )}

            {/* Heatmap Tab */}
            {searchAnalysis?.heatmapData?.length > 0 && (
              <TabsContent value="heatmap">
                <MarketHeatmap
                  data={searchAnalysis.heatmapData}
                  title="Market Heatmap"
                />

                {/* Companies and their competitive advantages/weaknesses for each heatmap item */}
                <section className="mt-8">
                  <h2 className="text-2xl font-semibold mb-4">Companies by Heatmap Area</h2>
                  <div className="space-y-8">
                    {searchAnalysis.heatmapData.map((item, idx) => {
                      // Find all jobs in this area
                      const jobs = jobsToBeDone.filter(job =>
                        job.industry === item.industry &&
                        (job.title === item.opportunity || job.title.toLowerCase().includes(item.opportunity.toLowerCase()))
                      );
                      // Collect all competitors, deduped by name
                      const competitorsMap = new Map();
                      jobs.forEach(job => {
                        job.competitors.forEach(comp => {
                          if (!competitorsMap.has(comp.name)) {
                            competitorsMap.set(comp.name, comp);
                          }
                        });
                      });
                      const competitors = Array.from(competitorsMap.values());
                      return (
                        <Card key={item.industry + item.opportunity + idx} className="p-6 bg-white/90 shadow-card">
                          <h3 className="text-lg font-bold mb-4">{item.industry} — {item.opportunity}</h3>
                          {competitors.length > 0 ? (
                            <div className="space-y-6">
                              {competitors.map((comp, cidx) => (
                                <div key={comp.name + cidx} className="border-b pb-4 last:border-b-0 last:pb-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-base">{comp.name}</span>
                                    <span className="text-xs text-muted-foreground">{comp.marketShare ? `(${comp.marketShare} market share)` : ''}</span>
                                  </div>
                                  <div className="text-sm text-muted-foreground mb-2">{comp.description}</div>
                                  <div className="flex flex-wrap gap-4">
                                    <div>
                                      <div className="font-medium text-green-700 mb-1">Competitive Advantage</div>
                                      <ul className="list-disc list-inside text-sm text-green-800">
                                        {comp.strengths.map((s, i) => (
                                          <li key={i}>{s}</li>
                                        ))}
                                      </ul>
                                    </div>
                                    <div>
                                      <div className="font-medium text-red-700 mb-1">Not Solving For</div>
                                      <ul className="list-disc list-inside text-sm text-red-800">
                                        {comp.weaknesses.map((w, i) => (
                                          <li key={i}>{w}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted-foreground text-sm">No companies found for this area.</p>
                          )}
                        </Card>
                      );
                    })}
                  </div>
                </section>
              </TabsContent>
            )}

            {/* Insights Tab */}
            <TabsContent value="insights">
              <MarketInsights
                marketGaps={searchAnalysis?.marketGaps || []}
                competitiveAnalysis={searchAnalysis?.competitiveAnalysis || { oversaturatedAreas: [], underservedAreas: [], emergingTrends: [], riskFactors: [] }}
                allJobs={jobsToBeDone}
                onGapClick={() => {}}
                onCompetitiveAreaClick={() => {}}
                {...(showingAllOpportunities && searchAnalysis?.searchSuggestion ? { searchSuggestion: searchAnalysis.searchSuggestion } : {})}
              />
            </TabsContent>
          </Tabs>
        </section>

        {/* Modals */}
        {selectedJob && (
          <JobDetails job={selectedJob} onClose={() => setSelectedJob(null)} />
        )}
        {selectedIndustryDrillDown && (
          <IndustryDrillDown
            industry={selectedIndustryDrillDown}
            jobs={jobsToBeDone.filter(j => j.industry === selectedIndustryDrillDown)}
            onClose={() => setSelectedIndustryDrillDown(null)}
          />
        )}
        {selectedTechnologyDrillDown && (
          <TechnologyDrillDown
            technology={selectedTechnologyDrillDown}
            jobs={jobsToBeDone.filter(j =>
              j.tags.includes(selectedTechnologyDrillDown)
            )}
            onClose={() => setSelectedTechnologyDrillDown(null)}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
