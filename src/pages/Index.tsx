import { useState, useMemo } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { JobCard } from '@/components/JobCard';
import { JobDetails } from '@/components/JobDetails';
import { Header } from '@/components/Header';
import { jobsToBeDone, JobToBeDone, industries, tags } from '@/data/jobsToBeDone';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { TrendingUp, Lightbulb, Target, DollarSign } from 'lucide-react';
import heroImage from '@/assets/hero-opportunities.jpg';

const Index = () => {
  const [selectedJob, setSelectedJob] = useState<JobToBeDone | null>(null);
  const [searchResults, setSearchResults] = useState<JobToBeDone[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');

  const filteredJobs = useMemo(() => {
    let filtered = searchResults.length > 0 ? searchResults : jobsToBeDone;
    
    if (selectedIndustry) {
      filtered = filtered.filter(job => job.industry === selectedIndustry);
    }
    
    if (selectedTag) {
      filtered = filtered.filter(job => job.tags.includes(selectedTag));
    }
    
    return filtered;
  }, [searchResults, selectedIndustry, selectedTag]);

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    
    // Simulate AI search with simple keyword matching
    await new Promise(resolve => setTimeout(resolve, 1500));
    
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
    
    setSearchResults(results);
    setIsSearching(false);
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
            <SearchBar onSearch={handleSearch} />
            {isSearching && (
              <p className="mt-4 text-muted-foreground">AI is analyzing opportunities...</p>
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

      {/* Filters */}
      <div className="px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-4 justify-center mb-8">
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
          
          <div className="flex flex-wrap gap-4 justify-center mb-12">
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
      </div>

      {/* Jobs Grid */}
      <div className="px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          {filteredJobs.length === 0 && searchResults.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">No opportunities found matching your criteria.</p>
            </div>
          )}
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onClick={setSelectedJob}
              />
            ))}
          </div>
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
