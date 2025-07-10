import { useState } from 'react';
import { JobToBeDone, industries, Competitor } from '@/data/jobsToBeDone';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { JobCard } from '@/components/JobCard';
import { JobDetails } from '@/components/JobDetails';
import { 
  Building, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target, 
  Zap, 
  ArrowLeft,
  BarChart3,
  Lightbulb,
  Shield,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface IndustryDrillDownProps {
  industry: string;
  jobs: JobToBeDone[];
  onClose: () => void;
}

export const IndustryDrillDown = ({ industry, jobs, onClose }: IndustryDrillDownProps) => {
  const [selectedJob, setSelectedJob] = useState<JobToBeDone | null>(null);
  const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor | null>(null);
  const [isCompetitorDialogOpen, setIsCompetitorDialogOpen] = useState(false);
  const [isOversaturatedOpen, setIsOversaturatedOpen] = useState(false);
  const [isUnderservedOpen, setIsUnderservedOpen] = useState(false);
  const [isEmergingOpen, setIsEmergingOpen] = useState(false);

  // Calculate industry statistics
  const totalMarketValue = jobs.reduce((acc, job) => {
    const value = parseFloat(job.marketSize.replace(/[^0-9.]/g, ''));
    return acc + value;
  }, 0);

  const avgRevenuePotential = jobs.reduce((acc, job) => {
    const value = parseFloat(job.profitPotential.revenue.replace(/[^0-9.]/g, ''));
    return acc + value;
  }, 0) / jobs.length;

  const competitionBreakdown = jobs.reduce((acc, job) => {
    acc[job.competitionLevel] = (acc[job.competitionLevel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get all competitors in this industry
  const allCompetitors = jobs.flatMap(job => job.competitors);
  const uniqueCompetitors = allCompetitors.filter((competitor, index, self) => 
    index === self.findIndex(c => c.name === competitor.name)
  );

  // Get all technologies used in this industry
  const allTechnologies = [...new Set(jobs.flatMap(job => job.technologyRequirements))];

  // Get all customer segments
  const allCustomerSegments = [...new Set(jobs.flatMap(job => job.customerSegments))];

  // Get all market trends
  const allMarketTrends = [...new Set(jobs.flatMap(job => job.marketTrends))];

  // Categorize competitors and opportunities
  const categorizeCompetitiveLandscape = () => {
    // Oversaturated areas - high competition opportunities
    const oversaturatedJobs = jobs.filter(job => job.competitionLevel === 'High');
    const oversaturatedCompetitors = oversaturatedJobs.flatMap(job => job.competitors);
    
    // Underserved areas - low competition opportunities
    const underservedJobs = jobs.filter(job => job.competitionLevel === 'Low');
    const underservedCompetitors = underservedJobs.flatMap(job => job.competitors);
    
    // Emerging trends - medium competition with growth potential
    const emergingJobs = jobs.filter(job => job.competitionLevel === 'Medium');
    const emergingCompetitors = emergingJobs.flatMap(job => job.competitors);
    
    return {
      oversaturated: {
        jobs: oversaturatedJobs,
        competitors: oversaturatedCompetitors.filter((competitor, index, self) => 
          index === self.findIndex(c => c.name === competitor.name)
        )
      },
      underserved: {
        jobs: underservedJobs,
        competitors: underservedCompetitors.filter((competitor, index, self) => 
          index === self.findIndex(c => c.name === competitor.name)
        )
      },
      emerging: {
        jobs: emergingJobs,
        competitors: emergingCompetitors.filter((competitor, index, self) => 
          index === self.findIndex(c => c.name === competitor.name)
        )
      }
    };
  };

  const competitiveLandscape = categorizeCompetitiveLandscape();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="max-w-7xl w-full max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-apple">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Opportunities
                </Button>
              </div>
              <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
                <Building className="h-8 w-8 text-blue-600" />
                {industry}
              </h1>
              <p className="text-lg text-muted-foreground">
                Industry Analysis & Market Opportunities
              </p>
            </div>
          </div>

          {/* Industry Overview Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{jobs.length}</p>
                  <p className="text-sm text-blue-700">Opportunities</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <div className="flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-foreground">${totalMarketValue.toFixed(1)}B</p>
                  <p className="text-sm text-green-700">Market Value</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold text-foreground">${avgRevenuePotential.toFixed(0)}M</p>
                  <p className="text-sm text-orange-700">Avg Revenue</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{uniqueCompetitors.length}</p>
                  <p className="text-sm text-purple-700">Competitors</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Competitive Landscape Analysis */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-blue-600" />
              Competitive Landscape Analysis
            </h2>
            
            {/* Oversaturated Areas */}
            <Collapsible open={isOversaturatedOpen} onOpenChange={setIsOversaturatedOpen} className="mb-4">
              <CollapsibleTrigger asChild>
                <Card className="p-4 border-red-200 bg-red-50 hover:bg-red-100 cursor-pointer transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <div>
                        <h3 className="font-semibold text-red-800">Oversaturated Areas</h3>
                        <p className="text-sm text-red-700">
                          {competitiveLandscape.oversaturated.jobs.length} opportunities, {competitiveLandscape.oversaturated.competitors.length} competitors
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-red-600 border-red-300">
                        High Competition
                      </Badge>
                      {isOversaturatedOpen ? (
                        <ChevronDown className="h-4 w-4 text-red-600" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  </div>
                </Card>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-2 space-y-4">
                  {/* Competitors */}
                  <div>
                    <h4 className="font-medium text-sm text-red-800 mb-2">Key Competitors</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {competitiveLandscape.oversaturated.competitors.map((competitor, index) => (
                        <Card 
                          key={index} 
                          className="p-3 border-red-200 bg-white hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => {
                            setSelectedCompetitor(competitor);
                            setIsCompetitorDialogOpen(true);
                          }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h5 className="font-semibold text-sm">{competitor.name}</h5>
                              <p className="text-xs text-muted-foreground">{competitor.description}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {competitor.marketShare}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            <div className="flex items-center gap-1 mb-1">
                              <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                              <span>{competitor.strengths[0]}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                              <span>{competitor.weaknesses[0]}</span>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                  
                  {/* Opportunities */}
                  <div>
                    <h4 className="font-medium text-sm text-red-800 mb-2">High Competition Opportunities</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {competitiveLandscape.oversaturated.jobs.map((job) => (
                        <Card key={job.id} className="p-3 border-red-200 bg-white hover:shadow-md transition-shadow cursor-pointer"
                              onClick={() => setSelectedJob(job)}>
                          <div className="flex items-start justify-between mb-2">
                            <h5 className="font-semibold text-sm">{job.title}</h5>
                            <Badge variant="outline" className="text-xs text-red-600 border-red-300">
                              {job.competitionLevel}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{job.description}</p>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Revenue: {job.profitPotential.revenue}</span>
                            <span>Market: {job.marketSize}</span>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Underserved Areas */}
            <Collapsible open={isUnderservedOpen} onOpenChange={setIsUnderservedOpen} className="mb-4">
              <CollapsibleTrigger asChild>
                <Card className="p-4 border-green-200 bg-green-50 hover:bg-green-100 cursor-pointer transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <h3 className="font-semibold text-green-800">Underserved Areas</h3>
                        <p className="text-sm text-green-700">
                          {competitiveLandscape.underserved.jobs.length} opportunities, {competitiveLandscape.underserved.competitors.length} competitors
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-green-600 border-green-300">
                        Low Competition
                      </Badge>
                      {isUnderservedOpen ? (
                        <ChevronDown className="h-4 w-4 text-green-600" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                  </div>
                </Card>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-2 space-y-4">
                  {/* Competitors */}
                  <div>
                    <h4 className="font-medium text-sm text-green-800 mb-2">Key Competitors</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {competitiveLandscape.underserved.competitors.map((competitor, index) => (
                        <Card 
                          key={index} 
                          className="p-3 border-green-200 bg-white hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => {
                            setSelectedCompetitor(competitor);
                            setIsCompetitorDialogOpen(true);
                          }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h5 className="font-semibold text-sm">{competitor.name}</h5>
                              <p className="text-xs text-muted-foreground">{competitor.description}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {competitor.marketShare}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            <div className="flex items-center gap-1 mb-1">
                              <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                              <span>{competitor.strengths[0]}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                              <span>{competitor.weaknesses[0]}</span>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                  
                  {/* Opportunities */}
                  <div>
                    <h4 className="font-medium text-sm text-green-800 mb-2">Low Competition Opportunities</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {competitiveLandscape.underserved.jobs.map((job) => (
                        <Card key={job.id} className="p-3 border-green-200 bg-white hover:shadow-md transition-shadow cursor-pointer"
                              onClick={() => setSelectedJob(job)}>
                          <div className="flex items-start justify-between mb-2">
                            <h5 className="font-semibold text-sm">{job.title}</h5>
                            <Badge variant="outline" className="text-xs text-green-600 border-green-300">
                              {job.competitionLevel}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{job.description}</p>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Revenue: {job.profitPotential.revenue}</span>
                            <span>Market: {job.marketSize}</span>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Emerging Trends */}
            <Collapsible open={isEmergingOpen} onOpenChange={setIsEmergingOpen} className="mb-4">
              <CollapsibleTrigger asChild>
                <Card className="p-4 border-orange-200 bg-orange-50 hover:bg-orange-100 cursor-pointer transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-orange-600" />
                      <div>
                        <h3 className="font-semibold text-orange-800">Emerging Trends</h3>
                        <p className="text-sm text-orange-700">
                          {competitiveLandscape.emerging.jobs.length} opportunities, {competitiveLandscape.emerging.competitors.length} competitors
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-orange-600 border-orange-300">
                        Medium Competition
                      </Badge>
                      {isEmergingOpen ? (
                        <ChevronDown className="h-4 w-4 text-orange-600" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-orange-600" />
                      )}
                    </div>
                  </div>
                </Card>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-2 space-y-4">
                  {/* Competitors */}
                  <div>
                    <h4 className="font-medium text-sm text-orange-800 mb-2">Key Competitors</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {competitiveLandscape.emerging.competitors.map((competitor, index) => (
                        <Card 
                          key={index} 
                          className="p-3 border-orange-200 bg-white hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => {
                            setSelectedCompetitor(competitor);
                            setIsCompetitorDialogOpen(true);
                          }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h5 className="font-semibold text-sm">{competitor.name}</h5>
                              <p className="text-xs text-muted-foreground">{competitor.description}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {competitor.marketShare}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            <div className="flex items-center gap-1 mb-1">
                              <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                              <span>{competitor.strengths[0]}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                              <span>{competitor.weaknesses[0]}</span>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                  
                  {/* Opportunities */}
                  <div>
                    <h4 className="font-medium text-sm text-orange-800 mb-2">Emerging Opportunities</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {competitiveLandscape.emerging.jobs.map((job) => (
                        <Card key={job.id} className="p-3 border-orange-200 bg-white hover:shadow-md transition-shadow cursor-pointer"
                              onClick={() => setSelectedJob(job)}>
                          <div className="flex items-start justify-between mb-2">
                            <h5 className="font-semibold text-sm">{job.title}</h5>
                            <Badge variant="outline" className="text-xs text-orange-600 border-orange-300">
                              {job.competitionLevel}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{job.description}</p>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Revenue: {job.profitPotential.revenue}</span>
                            <span>Market: {job.marketSize}</span>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Key Competitors */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Building className="h-6 w-6 text-blue-600" />
              Key Competitors
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {uniqueCompetitors.slice(0, 6).map((competitor, index) => (
                <Card 
                  key={index} 
                  className="p-4 border hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedCompetitor(competitor);
                    setIsCompetitorDialogOpen(true);
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-sm">{competitor.name}</h4>
                      <p className="text-xs text-muted-foreground">{competitor.description}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {competitor.marketShare}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="font-medium text-green-700 mb-1">Top Strength</div>
                      <div className="text-muted-foreground">{competitor.strengths[0]}</div>
                    </div>
                    
                    <div>
                      <div className="font-medium text-red-700 mb-1">Key Weakness</div>
                      <div className="text-muted-foreground">{competitor.weaknesses[0]}</div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
                      <span>Founded: {competitor.founded || 'N/A'}</span>
                      <span>{competitor.funding || 'Private'}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Technology Stack */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Zap className="h-6 w-6 text-blue-600" />
              Technology Requirements
            </h2>
            <div className="flex flex-wrap gap-2">
              {allTechnologies.map((tech, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {/* Customer Segments */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Users className="h-6 w-6 text-blue-600" />
              Target Customer Segments
            </h2>
            <div className="grid gap-3">
              {allCustomerSegments.map((segment, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <Users className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <p className="text-foreground">{segment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Market Trends */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              Market Trends
            </h2>
            <div className="grid gap-3">
              {allMarketTrends.map((trend, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                  <TrendingUp className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-foreground">{trend}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Industry Opportunities */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-blue-600" />
              Market Opportunities
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onClick={setSelectedJob}
                />
              ))}
            </div>
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

      {/* Competitor Details Dialog */}
      <Dialog open={isCompetitorDialogOpen} onOpenChange={setIsCompetitorDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-600" />
              {selectedCompetitor?.name}
            </DialogTitle>
            <DialogDescription>
              Detailed competitive analysis for {selectedCompetitor?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedCompetitor && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="font-semibold">Company Overview</h4>
                <p className="text-sm text-muted-foreground">{selectedCompetitor.description}</p>
                <div className="flex justify-between text-sm">
                  <span>Market Share: <strong>{selectedCompetitor.marketShare}</strong></span>
                  <span>Founded: <strong>{selectedCompetitor.founded || 'N/A'}</strong></span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-green-700 mb-2">Strengths</h4>
                  <ul className="space-y-1 text-sm">
                    {selectedCompetitor.strengths.map((strength: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-red-700 mb-2">Weaknesses</h4>
                  <ul className="space-y-1 text-sm">
                    {selectedCompetitor.weaknesses.map((weakness: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Strategic Insights</h4>
                <p className="text-sm text-blue-700">
                  {selectedCompetitor.marketShare.includes('45') || selectedCompetitor.marketShare.includes('35') 
                    ? 'Market leader with significant competitive advantages. Focus on differentiation and innovation to compete effectively.'
                    : selectedCompetitor.marketShare.includes('25') || selectedCompetitor.marketShare.includes('20')
                    ? 'Established player with strong market position. Consider partnerships or acquisition opportunities.'
                    : 'Emerging competitor with growth potential. Monitor their development and market expansion strategies.'
                  }
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}; 