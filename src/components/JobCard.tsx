import { JobToBeDone } from '@/data/jobsToBeDone';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock, Users, DollarSign } from 'lucide-react';

interface JobCardProps {
  job: JobToBeDone;
  onClick?: (job: JobToBeDone) => void;
}

export const JobCard = ({ job, onClick }: JobCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Low': return 'bg-apple-green/10 text-apple-green border-apple-green/20';
      case 'Medium': return 'bg-apple-orange/10 text-apple-orange border-apple-orange/20';
      case 'High': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getCompetitionColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-apple-green';
      case 'Medium': return 'text-apple-orange';
      case 'High': return 'text-red-600';
      default: return 'text-apple-gray';
    }
  };

  return (
    <Card 
      className="p-6 bg-gradient-card border-0 shadow-card hover:shadow-hover hover:scale-[1.02] transition-all duration-apple cursor-pointer group relative overflow-hidden"
      onClick={() => onClick?.(job)}
    >
      {/* Click indicator */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
      </div>
      <div className="space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-apple">
              {job.title}
            </h3>
            <Badge 
              variant="outline" 
              className={`${getDifficultyColor(job.difficulty)} whitespace-nowrap`}
            >
              {job.difficulty} Difficulty
            </Badge>
          </div>
        </div>

        {/* Desired Outcome */}
        <div className="mb-2">
          <p className="text-xs font-semibold text-apple-blue uppercase tracking-wide mb-1">Desired Outcome</p>
          <p className="text-muted-foreground text-sm leading-relaxed">{job.description}</p>
        </div>

        {/* Features to Build */}
        <div className="mb-2">
          <p className="text-xs font-semibold text-apple-green uppercase tracking-wide mb-1">Features to Build</p>
          <ul className="list-disc list-inside text-sm text-foreground">
            {job.requiredFunctionalities.map((feature, idx) => (
              <li key={idx}>{feature}</li>
            ))}
          </ul>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-apple-green" />
            <div>
              <p className="text-sm font-medium text-foreground">{job.profitPotential.revenue}</p>
              <p className="text-xs text-muted-foreground">Revenue Potential</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-apple-blue" />
            <div>
              <p className="text-sm font-medium text-foreground">{job.profitPotential.timeToMarket}</p>
              <p className="text-xs text-muted-foreground">Time to Market</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-apple-orange" />
            <div>
              <p className="text-sm font-medium text-foreground">{job.marketSize}</p>
              <p className="text-xs text-muted-foreground">Market Size</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className={`h-4 w-4 ${getCompetitionColor(job.competitionLevel)}`} />
            <div>
              <p className={`text-sm font-medium ${getCompetitionColor(job.competitionLevel)}`}>
                {job.competitionLevel}
              </p>
              <p className="text-xs text-muted-foreground">Competition</p>
            </div>
          </div>
        </div>

                  {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {job.tags.slice(0, 4).map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="text-xs bg-apple-light-gray text-apple-gray border-0"
              >
                {tag}
              </Badge>
            ))}
            {job.tags.length > 4 && (
              <Badge 
                variant="secondary" 
                className="text-xs bg-apple-light-gray text-apple-gray border-0"
              >
                +{job.tags.length - 4} more
              </Badge>
            )}
          </div>

          {/* Click to view details hint */}
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-muted-foreground text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Click to view detailed analysis →
            </p>
          </div>
      </div>
    </Card>
  );
};