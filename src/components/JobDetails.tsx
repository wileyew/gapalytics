import { JobToBeDone } from '@/data/jobsToBeDone';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, ExternalLink, CheckCircle, AlertCircle, DollarSign, TrendingUp, Building, Users, Target, Zap, Lightbulb, Shield } from 'lucide-react';

interface JobDetailsProps {
  job: JobToBeDone;
  onClose: () => void;
}

export const JobDetails = ({ job, onClose }: JobDetailsProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-white border-0 shadow-apple">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">{job.title}</h1>
              <p className="text-lg text-muted-foreground">{job.industry}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-apple-gray hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Description */}
          <div className="mb-8">
            <p className="text-lg leading-relaxed text-foreground">{job.description}</p>
          </div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="p-4 bg-gradient-to-br from-apple-green/5 to-apple-green/10 border-apple-green/20">
              <div className="flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-apple-green" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{job.profitPotential.revenue}</p>
                  <p className="text-sm text-apple-green">Revenue Potential</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {job.profitPotential.margin} margin
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-apple-blue/5 to-apple-blue/10 border-apple-blue/20">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-apple-blue" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{job.marketSize.split(' ')[0]}</p>
                  <p className="text-sm text-apple-blue">Market Size</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total Addressable Market
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-apple-orange/5 to-apple-orange/10 border-apple-orange/20">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-8 w-8 text-apple-orange" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{job.competitionLevel}</p>
                  <p className="text-sm text-apple-orange">Competition Level</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {job.profitPotential.timeToMarket} to market
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Pain Points */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-foreground">Key Pain Points</h3>
            <div className="grid gap-3">
              {job.painPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-foreground">{point}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Required Functionalities */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-foreground">Required Product Functionalities</h3>
            <div className="grid gap-3">
              {job.requiredFunctionalities.map((functionality, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-apple-green/5 rounded-lg border border-apple-green/20">
                  <CheckCircle className="h-5 w-5 text-apple-green mt-0.5 flex-shrink-0" />
                  <p className="text-foreground">{functionality}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-foreground">Technologies & Categories</h3>
            <div className="flex flex-wrap gap-2">
              {job.tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="bg-apple-light-gray text-apple-gray border-0 px-3 py-1"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Competitive Landscape */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-600" />
              Competitive Landscape
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {job.competitors.map((competitor, index) => (
                <Card key={index} className="p-4 border hover:shadow-md transition-shadow">
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
                      <div className="font-medium text-green-700 mb-1">Strengths</div>
                      <div className="space-y-1">
                        {competitor.strengths.map((strength, idx) => (
                          <div key={idx} className="flex items-center gap-1">
                            <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                            <span className="text-muted-foreground">{strength}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <div className="font-medium text-red-700 mb-1">Weaknesses</div>
                      <div className="space-y-1">
                        {competitor.weaknesses.map((weakness, idx) => (
                          <div key={idx} className="flex items-center gap-1">
                            <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                            <span className="text-muted-foreground">{weakness}</span>
                          </div>
                        ))}
                      </div>
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

          {/* Market Trends */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Market Trends
            </h3>
            <div className="grid gap-3">
              {job.marketTrends.map((trend, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                  <TrendingUp className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-foreground">{trend}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Technology Requirements */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              Technology Requirements
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.technologyRequirements.map((tech, index) => (
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
            <h3 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              Target Customer Segments
            </h3>
            <div className="grid gap-3">
              {job.customerSegments.map((segment, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <Users className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <p className="text-foreground">{segment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Go-to-Market Strategy */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
              <Target className="h-5 w-5 text-orange-600" />
              Go-to-Market Strategy
            </h3>
            <div className="grid gap-3">
              {job.goToMarketStrategy.map((strategy, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                  <Target className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <p className="text-foreground">{strategy}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Regulatory Environment */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
              <Shield className="h-5 w-5 text-gray-600" />
              Regulatory Environment
            </h3>
            <div className="p-4 bg-gray-50 rounded-lg border">
              <p className="text-foreground">{job.regulatoryEnvironment}</p>
            </div>
          </div>

          {/* Sources */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-foreground">Data Sources</h3>
            <div className="space-y-2">
              {job.sources.map((source, index) => (
                <div key={index} className="flex items-center gap-2 text-muted-foreground">
                  <ExternalLink className="h-4 w-4" />
                  <span>{source}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-6 border-t">
            <Button 
              className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-apple text-lg py-6"
            >
              Start Building This Opportunity
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};