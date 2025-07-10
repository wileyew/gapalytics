import { useState, useMemo } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { JobCard } from '@/components/JobCard';
import { JobDetails } from '@/components/JobDetails';
import { Header } from '@/components/Header';
import { MarketHeatmap } from '@/components/MarketHeatmap';
import { MarketInsights } from '@/components/MarketInsights';
import { IndustryDrillDown } from '@/components/IndustryDrillDown';
import { TechnologyDrillDown } from '@/components/TechnologyDrillDown';
import { jobsToBeDone, JobToBeDone, industries, tags } from '@/data/jobsToBeDone';
import { analyzeSearchQuery, type SearchAnalysis, type MarketGap } from '@/lib/openai';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Lightbulb, Target, DollarSign, BarChart3, Brain, ExternalLink } from 'lucide-react';
import heroImage from '@/assets/hero-opportunities.jpg';

const Index = () => {
  const [selectedJob, setSelectedJob] = useState<JobToBeDone | null>(null);
  const [searchAnalysis, setSearchAnalysis] = useState<SearchAnalysis | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('opportunities');
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedGap, setSelectedGap] = useState<MarketGap | null>(null);
  const [selectedIndustryDrillDown, setSelectedIndustryDrillDown] = useState<string | null>(null);
  const [selectedTechnologyDrillDown, setSelectedTechnologyDrillDown] = useState<string | null>(null);

  const filteredJobs = useMemo(() => {
    // If we have search results, use them; otherwise use all jobs
    let filtered = searchAnalysis?.relevantOpportunities && searchAnalysis.relevantOpportunities.length > 0 ? 
      searchAnalysis.relevantOpportunities : jobsToBeDone;
    
    // Apply additional filters only if we're not in a filtered state from API
    if (selectedIndustry && (!searchAnalysis?.relevantOpportunities || searchAnalysis.relevantOpportunities.length === 0)) {
      filtered = filtered.filter(job => job.industry === selectedIndustry);
    }
    
    if (selectedTag && (!searchAnalysis?.relevantOpportunities || searchAnalysis.relevantOpportunities.length === 0)) {
      filtered = filtered.filter(job => job.tags.includes(selectedTag));
    }
    
    return filtered;
  }, [searchAnalysis, selectedIndustry, selectedTag]);

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    setHasSearched(true);
    
    try {
      const analysis = await analyzeSearchQuery(query, jobsToBeDone);
      console.log('Search analysis result:', analysis); // Debug log
      console.log('Heatmap data:', analysis.heatmapData); // Debug heatmap
      console.log('Market gaps:', analysis.marketGaps); // Debug gaps
      console.log('Relevant opportunities:', analysis.relevantOpportunities); // Debug opportunities
      setSearchAnalysis(analysis);
      
      // Reset filters when new search is performed
      setSelectedIndustry('');
      setSelectedTag('');
      setSelectedGap(null);
      
      // Auto-switch to heatmap tab if we have good data, otherwise go to insights
      if (analysis.heatmapData && analysis.heatmapData.length > 0) {
        setActiveTab('heatmap');
      } else if (analysis.marketGaps && analysis.marketGaps.length > 0) {
        setActiveTab('insights');
      } else {
        setActiveTab('opportunities');
      }
    } catch (error) {
      console.error('Search failed:', error);
      // Fallback to simple search
      const keywords = query.toLowerCase().split(' ');
      const results = jobsToBeDone.filter(job => 
        keywords.some(keyword => 
          job.title.toLowerCase().includes(keyword) ||
          job.description.toLowerCase().includes(keyword) ||
          job.tags.some(tag => tag.toLowerCase().includes(keyword)) ||
          job.industry.toLowerCase().includes(keyword) ||
          job.painPoints.some(point => point.toLowerCase().includes(keyword))
        )
      );
      
      setSearchAnalysis({
        relevantOpportunities: results,
        marketGaps: [],
        searchSuggestion: null,
        heatmapData: [],
        competitiveAnalysis: {
          oversaturatedAreas: [],
          underservedAreas: [],
          emergingTrends: [],
          riskFactors: []
        }
      });
    } finally {
      setIsSearching(false);
    }
  };

  const totalMarketValue = jobsToBeDone.reduce((acc, job) => {
    const value = parseFloat(job.marketSize.replace(/[^0-9.]/g, ''));
    return acc + value;
  }, 0);

  const avgRevenuePotential = jobsToBeDone.reduce((acc, job) => {
    const value = parseFloat(job.profitPotential.revenue.replace(/[^0-9.]/g, ''));
    return acc + value;
  }, 0) / jobsToBeDone.length;

  // Generate competitive analysis from opportunities data
  const generateCompetitiveAnalysis = () => {
    const industries = [...new Set(jobsToBeDone.map(job => job.industry))];
    const competitionLevels = jobsToBeDone.map(job => job.competitionLevel);
    
    // Analyze competition levels
    const highCompetition = jobsToBeDone.filter(job => job.competitionLevel === 'High');
    const lowCompetition = jobsToBeDone.filter(job => job.competitionLevel === 'Low');
    
    // Identify oversaturated areas (high competition industries)
    const oversaturatedAreas = [...new Set(highCompetition.map(job => job.industry))];
    
    // Identify underserved areas (low competition industries)
    const underservedAreas = [...new Set(lowCompetition.map(job => job.industry))];
    
    // Extract emerging trends from tags
    const allTags = jobsToBeDone.flatMap(job => job.tags);
    const tagCounts = allTags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const emergingTrends = Object.entries(tagCounts)
      .filter(([_, count]) => count >= 2)
      .map(([tag, _]) => tag);
    
    // Identify risk factors
    const riskFactors = [
      'Market saturation in popular industries',
      'Technology disruption',
      'Regulatory changes',
      'Economic uncertainty'
    ];
    
    return {
      oversaturatedAreas,
      underservedAreas,
      emergingTrends,
      riskFactors
    };
  };

  // Handle market gap click
  const handleGapClick = (gap: MarketGap) => {
    setSelectedGap(gap);
    setActiveTab('opportunities');
    // Filter jobs to show related opportunities
    const gapKeywords = gap.title.toLowerCase().split(' ');
    const relatedJobs = jobsToBeDone.filter(job => {
      const jobText = `${job.title} ${job.description} ${job.industry} ${job.tags.join(' ')}`.toLowerCase();
      return gapKeywords.some(keyword => jobText.includes(keyword));
    });
    setSearchAnalysis(prev => prev ? {
      ...prev,
      relevantOpportunities: relatedJobs
    } : null);
  };

  // Handle competitive area click
  const handleCompetitiveAreaClick = (area: string, type: 'oversaturated' | 'underserved' | 'trend' | 'risk') => {
    setActiveTab('opportunities');
    
    let filteredJobs: JobToBeDone[] = [];
    
    switch (type) {
      case 'oversaturated':
        filteredJobs = jobsToBeDone.filter(job => 
          job.industry === area || job.competitionLevel === 'High'
        );
        break;
      case 'underserved':
        filteredJobs = jobsToBeDone.filter(job => 
          job.industry === area || job.competitionLevel === 'Low'
        );
        break;
      case 'trend':
        filteredJobs = jobsToBeDone.filter(job => 
          job.tags.includes(area)
        );
        break;
      case 'risk':
        // For risk factors, show jobs that might be affected
        filteredJobs = jobsToBeDone.filter(job => 
          job.industry.toLowerCase().includes(area.toLowerCase()) ||
          job.tags.some(tag => tag.toLowerCase().includes(area.toLowerCase()))
        );
        break;
    }
    
    setSearchAnalysis(prev => prev ? {
      ...prev,
      relevantOpportunities: filteredJobs
    } : null);
  };

  // Handle industry drill-down click
  const handleIndustryDrillDown = (industry: string) => {
    setSelectedIndustryDrillDown(industry);
  };

  // Handle technology drill-down click
  const handleTechnologyDrillDown = (technology: string) => {
    setSelectedTechnologyDrillDown(technology);
  };

  return (
    <div className="min-h-screen bg-gradient-hero relative">
      <Header />
      {/* Hero Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-5"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Hero Section */}
      <div className="relative px-4 pt-16 pb-24">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Gapalytics
              </span>
              <br />
              Market Gap Analysis
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover untapped market opportunities with AI-powered insights into customer needs that remain unsolved.
            </p>
          </div>

          {/* Search */}
          <div className="mb-12">
            <SearchBar onSearch={handleSearch} isLoading={isSearching} />
            {isSearching && (
              <div className="flex items-center justify-center mt-6 gap-3">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-muted-foreground">AI is analyzing market opportunities and gaps...</p>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-card">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Target className="h-6 w-6 text-apple-blue" />
                <span className="text-2xl font-bold text-foreground">{jobsToBeDone.length}</span>
              </div>
              <p className="text-sm text-muted-foreground">Identified Opportunities</p>
            </Card>
            
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-card">
              <div className="flex items-center justify-center gap-3 mb-2">
                <TrendingUp className="h-6 w-6 text-apple-green" />
                <span className="text-2xl font-bold text-foreground">${totalMarketValue.toFixed(1)}B</span>
              </div>
              <p className="text-sm text-muted-foreground">Total Market Value</p>
            </Card>
            
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-card">
              <div className="flex items-center justify-center gap-3 mb-2">
                <DollarSign className="h-6 w-6 text-apple-orange" />
                <span className="text-2xl font-bold text-foreground">${avgRevenuePotential.toFixed(0)}M</span>
              </div>
              <p className="text-sm text-muted-foreground">Avg Revenue Potential</p>
            </Card>
            
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-card">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Lightbulb className="h-6 w-6 text-primary" />
                <span className="text-2xl font-bold text-foreground">{industries.length}</span>
              </div>
              <p className="text-sm text-muted-foreground">Industries Covered</p>
            </Card>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger 
                value="opportunities" 
                className="flex items-center gap-2 relative"
              >
                <Target className="h-4 w-4" />
                Opportunities
                {searchAnalysis?.relevantOpportunities && searchAnalysis.relevantOpportunities.length > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs bg-green-100 text-green-700">
                    {searchAnalysis.relevantOpportunities.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="heatmap" 
                className="flex items-center gap-2 relative"
              >
                <BarChart3 className="h-4 w-4" />
                Market Heatmap
                {searchAnalysis?.heatmapData && searchAnalysis.heatmapData.length > 0 ? (
                  <Badge variant="secondary" className="ml-1 text-xs bg-blue-100 text-blue-700">
                    {searchAnalysis.heatmapData.length}
                  </Badge>
                ) : hasSearched && searchAnalysis && (
                  <Badge variant="outline" className="ml-1 text-xs text-muted-foreground">
                    No data
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="insights" 
                className="flex items-center gap-2 relative"
              >
                <Brain className="h-4 w-4" />
                AI Insights
                {searchAnalysis?.marketGaps && searchAnalysis.marketGaps.length > 0 ? (
                  <Badge variant="secondary" className="ml-1 text-xs bg-purple-100 text-purple-700">
                    {searchAnalysis.marketGaps.length}
                  </Badge>
                ) : hasSearched && searchAnalysis && (
                  <Badge variant="outline" className="ml-1 text-xs text-muted-foreground">
                    No data
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="opportunities" className="space-y-6">
              {/* Filters */}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4 justify-center">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm font-medium text-muted-foreground self-center">Industries:</span>
                    <Badge
                      variant={selectedIndustry === '' ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => setSelectedIndustry('')}
                    >
                      All
                    </Badge>
                    {industries.map(industry => (
                      <Badge
                        key={industry}
                        variant={selectedIndustry === industry ? 'default' : 'outline'}
                        className="cursor-pointer hover:shadow-md transition-all duration-200 group"
                        onClick={() => setSelectedIndustry(industry === selectedIndustry ? '' : industry)}
                      >
                        <span>{industry}</span>
                        <ExternalLink 
                          className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleIndustryDrillDown(industry);
                          }}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 justify-center">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm font-medium text-muted-foreground self-center">Technologies:</span>
                    <Badge
                      variant={selectedTag === '' ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => setSelectedTag('')}
                    >
                      All
                    </Badge>
                    {tags.map(tag => (
                      <Badge
                        key={tag}
                        variant={selectedTag === tag ? 'default' : 'outline'}
                        className="cursor-pointer hover:shadow-md transition-all duration-200 group"
                        onClick={() => setSelectedTag(tag === selectedTag ? '' : tag)}
                      >
                        <span>{tag}</span>
                        <ExternalLink 
                          className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTechnologyDrillDown(tag);
                          }}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Selected Gap Indicator */}
              {selectedGap && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-blue-900">Showing opportunities related to: {selectedGap.title}</h3>
                      <p className="text-sm text-blue-700 mt-1">{selectedGap.description}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedGap(null);
                        setSearchAnalysis(null);
                      }}
                      className="text-blue-600 border-blue-300 hover:bg-blue-100"
                    >
                      Clear Filter
                    </Button>
                  </div>
                </div>
              )}

              {/* Jobs Grid */}
              {filteredJobs.length === 0 && hasSearched ? (
                <div className="text-center py-12">
                  <p className="text-xl text-muted-foreground">No opportunities found matching your criteria.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onClick={setSelectedJob}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="heatmap" className="space-y-6">
              {searchAnalysis?.heatmapData && searchAnalysis.heatmapData.length > 0 ? (
                <MarketHeatmap 
                  data={searchAnalysis.heatmapData}
                  title="Market Opportunity Analysis"
                />
              ) : hasSearched ? (
                <Card className="p-12 text-center">
                  <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Heatmap Data Available</h3>
                  <p className="text-muted-foreground mb-4">
                    The search didn't generate heatmap data. Try a more specific search query.
                  </p>
                </Card>
              ) : (
                <Card className="p-12 text-center">
                  <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Heatmap Data Available</h3>
                  <p className="text-muted-foreground mb-4">
                    Perform a search to generate market opportunity heatmaps and visualizations.
                  </p>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              {searchAnalysis ? (
                <MarketInsights
                  marketGaps={searchAnalysis.marketGaps}
                  competitiveAnalysis={searchAnalysis.competitiveAnalysis}
                  searchSuggestion={searchAnalysis.searchSuggestion}
                  allJobs={jobsToBeDone}
                  onGapClick={handleGapClick}
                  onCompetitiveAreaClick={handleCompetitiveAreaClick}
                />
              ) : hasSearched ? (
                <Card className="p-12 text-center">
                  <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No AI Insights Available</h3>
                  <p className="text-muted-foreground mb-4">
                    The search didn't generate insights. Try a more specific search query.
                  </p>
                </Card>
              ) : (
                <div className="space-y-6">
                  <Card className="p-12 text-center">
                    <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No AI Insights Available</h3>
                    <p className="text-muted-foreground mb-4">
                      Search for market opportunities to get AI-powered insights, gap analysis, and competitive intelligence.
                    </p>
                  </Card>
                  
                  {/* Show competitive analysis based on opportunities data */}
                  <MarketInsights
                    marketGaps={[]}
                    competitiveAnalysis={generateCompetitiveAnalysis()}
                    allJobs={jobsToBeDone}
                    onCompetitiveAreaClick={handleCompetitiveAreaClick}
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <JobDetails
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}

      {/* Industry Drill-Down Modal */}
      {selectedIndustryDrillDown && (
        <IndustryDrillDown
          industry={selectedIndustryDrillDown}
          jobs={jobsToBeDone.filter(job => job.industry === selectedIndustryDrillDown)}
          onClose={() => setSelectedIndustryDrillDown(null)}
        />
      )}

      {/* Technology Drill-Down Modal */}
      {selectedTechnologyDrillDown && (
        <TechnologyDrillDown
          technology={selectedTechnologyDrillDown}
          jobs={jobsToBeDone.filter(job => 
            job.technologyRequirements.includes(selectedTechnologyDrillDown) ||
            job.tags.includes(selectedTechnologyDrillDown)
          )}
          onClose={() => setSelectedTechnologyDrillDown(null)}
        />
      )}
    </div>
  );
};

export default Index;
