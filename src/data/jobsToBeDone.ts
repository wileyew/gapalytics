export interface JobToBeDone {
  id: string;
  title: string;
  description: string;
  industry: string;
  painPoints: string[];
  requiredFunctionalities: string[];
  marketSize: string;
  profitPotential: {
    revenue: string;
    margin: string;
    timeToMarket: string;
  };
  competitionLevel: 'Low' | 'Medium' | 'High';
  sources: string[];
  difficulty: 'Low' | 'Medium' | 'High';
  tags: string[];
}

export const jobsToBeDone: JobToBeDone[] = [
  {
    id: '1',
    title: 'Seamless Multi-Device Photo Organization',
    description: 'Users struggle to organize and sync photos across multiple devices and cloud services without losing quality or metadata.',
    industry: 'Consumer Technology',
    painPoints: [
      'Photos scattered across multiple devices',
      'Inconsistent metadata and organization',
      'Quality loss during transfers',
      'Complex cloud service management'
    ],
    requiredFunctionalities: [
      'Cross-platform sync engine',
      'AI-powered photo categorization',
      'Metadata preservation',
      'Universal cloud service integration',
      'Smart duplicate detection'
    ],
    marketSize: '$12.8B (Digital Asset Management)',
    profitPotential: {
      revenue: '$50M ARR potential',
      margin: '75-85%',
      timeToMarket: '12-18 months'
    },
    competitionLevel: 'Medium',
    sources: [
      'McKinsey Digital Consumer Trends 2024',
      'IDC Cloud Storage Market Report',
      'UserVoice Community Feedback'
    ],
    difficulty: 'High',
    tags: ['AI', 'Cloud', 'Consumer', 'Mobile']
  },
  {
    id: '2',
    title: 'Real-Time Construction Progress Tracking',
    description: 'Construction managers need better visibility into project progress with automated milestone tracking and stakeholder communication.',
    industry: 'Construction Technology',
    painPoints: [
      'Manual progress reporting',
      'Delayed issue identification',
      'Poor stakeholder communication',
      'Inaccurate timeline predictions'
    ],
    requiredFunctionalities: [
      'Computer vision progress monitoring',
      'IoT sensor integration',
      'Automated reporting dashboard',
      'Predictive analytics engine',
      'Multi-stakeholder communication hub'
    ],
    marketSize: '$2.4B (Construction Management Software)',
    profitPotential: {
      revenue: '$25M ARR potential',
      margin: '60-70%',
      timeToMarket: '18-24 months'
    },
    competitionLevel: 'Low',
    sources: [
      'Construction Industry Institute Report',
      'McKinsey Construction Technology',
      'Dodge Data & Analytics'
    ],
    difficulty: 'High',
    tags: ['IoT', 'Computer Vision', 'B2B', 'Analytics']
  },
  {
    id: '3',
    title: 'Hyper-Local Community Skills Marketplace',
    description: 'Neighborhoods need better ways to share skills and services within walking distance, creating stronger local communities.',
    industry: 'Sharing Economy',
    painPoints: [
      'Unknown neighbor skills and services',
      'Over-reliance on distant service providers',
      'Weak community connections',
      'High service costs for simple tasks'
    ],
    requiredFunctionalities: [
      'Hyperlocal matching algorithm',
      'Skill verification system',
      'Micro-payment processing',
      'Community reputation engine',
      'Offline-first mobile app'
    ],
    marketSize: '$400M (Hyperlocal Services)',
    profitPotential: {
      revenue: '$15M ARR potential',
      margin: '80-90%',
      timeToMarket: '8-12 months'
    },
    competitionLevel: 'Low',
    sources: [
      'Pew Research Community Studies',
      'Local Commerce Report 2024',
      'NextDoor Community Insights'
    ],
    difficulty: 'Medium',
    tags: ['Community', 'Mobile', 'Payments', 'Social']
  },
  {
    id: '4',
    title: 'Intelligent Meeting Preparation Assistant',
    description: 'Professionals waste hours preparing for meetings without context about attendees, shared history, and optimal discussion points.',
    industry: 'Business Productivity',
    painPoints: [
      'Time wasted on meeting prep',
      'Lack of attendee context',
      'Forgotten previous discussions',
      'Inefficient meeting outcomes'
    ],
    requiredFunctionalities: [
      'Calendar integration API',
      'Contact intelligence engine',
      'Meeting history analysis',
      'Agenda optimization AI',
      'Real-time collaboration tools'
    ],
    marketSize: '$46.8B (Business Productivity Software)',
    profitPotential: {
      revenue: '$35M ARR potential',
      margin: '70-80%',
      timeToMarket: '6-9 months'
    },
    competitionLevel: 'Medium',
    sources: [
      'Harvard Business Review Productivity Studies',
      'Microsoft Workplace Analytics',
      'Gartner Productivity Software Report'
    ],
    difficulty: 'Medium',
    tags: ['AI', 'Productivity', 'B2B', 'SaaS']
  },
  {
    id: '5',
    title: 'Personalized Learning Path Generator',
    description: 'Students need AI-driven learning paths that adapt to their pace, style, and career goals beyond traditional course structures.',
    industry: 'Education Technology',
    painPoints: [
      'One-size-fits-all education',
      'Unclear learning progression',
      'Lack of career alignment',
      'Poor retention rates'
    ],
    requiredFunctionalities: [
      'Adaptive learning algorithm',
      'Skills gap analysis engine',
      'Career pathway mapping',
      'Multi-format content delivery',
      'Progress analytics dashboard'
    ],
    marketSize: '$404B (Global Education Market)',
    profitPotential: {
      revenue: '$100M ARR potential',
      margin: '65-75%',
      timeToMarket: '12-15 months'
    },
    competitionLevel: 'High',
    sources: [
      'EdTech Market Analysis 2024',
      'UNESCO Learning Crisis Report',
      'Coursera Learner Outcome Studies'
    ],
    difficulty: 'High',
    tags: ['AI', 'Education', 'Analytics', 'Personalization']
  },
  {
    id: '6',
    title: 'Automated Small Business Compliance Manager',
    description: 'Small businesses struggle with constantly changing regulations and compliance requirements across multiple jurisdictions.',
    industry: 'RegTech',
    painPoints: [
      'Complex regulatory landscape',
      'High compliance costs',
      'Frequent regulation changes',
      'Risk of penalties and fines'
    ],
    requiredFunctionalities: [
      'Regulatory change monitoring',
      'Automated compliance checking',
      'Multi-jurisdiction support',
      'Document generation engine',
      'Risk assessment dashboard'
    ],
    marketSize: '$10.6B (RegTech Market)',
    profitPotential: {
      revenue: '$40M ARR potential',
      margin: '75-85%',
      timeToMarket: '15-20 months'
    },
    competitionLevel: 'Medium',
    sources: [
      'Thomson Reuters Regulatory Intelligence',
      'PwC RegTech Report 2024',
      'Small Business Administration Studies'
    ],
    difficulty: 'High',
    tags: ['RegTech', 'AI', 'B2B', 'Automation']
  }
];

export const industries = Array.from(new Set(jobsToBeDone.map(job => job.industry)));
export const tags = Array.from(new Set(jobsToBeDone.flatMap(job => job.tags)));