import { useState, useMemo } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { JobCard } from '@/components/JobCard';
import { JobDetails } from '@/components/JobDetails';
import { Header } from '@/components/Header';
import { MarketHeatmap } from '@/components/MarketHeatmap';
import { MarketInsights } from '@/components/MarketInsights';
import { jobsToBeDone, JobToBeDone, industries, tags } from '@/data/jobsToBeDone';
import { analyzeSearchQuery, type SearchAnalysis } from '@/lib/openai';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Lightbulb, Target, DollarSign, BarChart3, Brain } from 'lucide-react';
import heroImage from '@/assets/hero-opportunities.jpg';

const Index = () => {
  const [selectedJob, setSelectedJob] = useState<JobToBeDone | null>(null);
  const [searchAnalysis, setSearchAnalysis] = useState<SearchAnalysis | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('opportunities');
  const [hasSearched, setHasSearched] = useState(false);

  const filteredJobs = useMemo(() => {
    let filtered = searchAnalysis?.relevantOpportunities.length ? 
      searchAnalysis.relevantOpportunities : jobsToBeDone;
    
    if (selectedIndustry) {
      filtered = filtered.filter(job => job.industry === selectedIndustry);
    }
    
    if (selectedTag) {
      filtered = filtered.filter(job => job.tags.includes(selectedTag));
    }
    
    return filtered;
  }, [searchAnalysis, selectedIndustry, selectedTag]);

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    setHasSearched(true);
    
    try {
      const analysis = await analyzeSearchQuery(query, jobsToBeDone);
      setSearchAnalysis(analysis);
      
      // Auto-switch to heatmap tab if we have good data
      if (analysis.heatmapData.length > 0) {
        setActiveTab('heatmap');
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
                Gaplytics
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
              <TabsTrigger value="opportunities" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Opportunities
              </TabsTrigger>
              <TabsTrigger value="heatmap" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Market Heatmap
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                AI Insights
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
                        className="cursor-pointer"
                        onClick={() => setSelectedIndustry(industry === selectedIndustry ? '' : industry)}
                      >
                        {industry}
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
                        className="cursor-pointer"
                        onClick={() => setSelectedTag(tag === selectedTag ? '' : tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

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
                />
              ) : (
                <Card className="p-12 text-center">
                  <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No AI Insights Available</h3>
                  <p className="text-muted-foreground mb-4">
                    Search for market opportunities to get AI-powered insights, gap analysis, and competitive intelligence.
                  </p>
                </Card>
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
    </div>
  );
};

export default Index;
