export interface Competitor {
  name: string;
  description: string;
  marketShare: string;
  strengths: string[];
  weaknesses: string[];
  funding?: string;
  founded?: string;
}

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
  competitors: Competitor[];
  sources: string[];
  difficulty: 'Low' | 'Medium' | 'High';
  tags: string[];
  marketTrends: string[];
  regulatoryEnvironment: string;
  technologyRequirements: string[];
  customerSegments: string[];
  goToMarketStrategy: string[];
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
    tags: ['AI', 'Cloud', 'Consumer', 'Mobile'],
    competitors: [
      {
        name: 'Google Photos',
        description: 'AI-powered photo organization with unlimited storage',
        marketShare: '45%',
        strengths: ['Strong AI capabilities', 'Unlimited storage', 'Google ecosystem integration'],
        weaknesses: ['Privacy concerns', 'Limited metadata preservation', 'Complex organization'],
        funding: 'Google subsidiary',
        founded: '2015'
      },
      {
        name: 'Apple Photos',
        description: 'Native iOS photo management with iCloud sync',
        marketShare: '30%',
        strengths: ['Seamless iOS integration', 'Strong privacy', 'High quality preservation'],
        weaknesses: ['Limited cross-platform', 'Expensive storage', 'Basic organization'],
        funding: 'Apple subsidiary',
        founded: '2015'
      },
      {
        name: 'Dropbox',
        description: 'Cloud storage with basic photo organization',
        marketShare: '15%',
        strengths: ['Cross-platform', 'Reliable sync', 'Business focus'],
        weaknesses: ['Limited AI features', 'Expensive', 'Basic photo tools'],
        funding: 'Public company',
        founded: '2007'
      }
    ],
    marketTrends: [
      'Growing demand for AI-powered organization',
      'Increasing photo storage needs',
      'Rising privacy concerns',
      'Cross-platform compatibility demand'
    ],
    regulatoryEnvironment: 'Data privacy regulations (GDPR, CCPA) apply to photo storage and processing',
    technologyRequirements: [
      'AI/ML for photo recognition',
      'Cloud storage infrastructure',
      'Cross-platform development',
      'Data encryption and security'
    ],
    customerSegments: [
      'Professional photographers',
      'Families with large photo collections',
      'Businesses with visual assets',
      'Social media content creators'
    ],
    goToMarketStrategy: [
      'Freemium model with premium features',
      'Partnerships with device manufacturers',
      'Social media marketing',
      'Referral programs'
    ]
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
    tags: ['IoT', 'Computer Vision', 'B2B', 'Analytics'],
    competitors: [
      {
        name: 'Procore',
        description: 'Construction project management platform',
        marketShare: '25%',
        strengths: ['Comprehensive project management', 'Strong enterprise features', 'Large customer base'],
        weaknesses: ['Complex implementation', 'High cost', 'Limited real-time tracking'],
        funding: 'Public company',
        founded: '2002'
      },
      {
        name: 'PlanGrid',
        description: 'Construction productivity software',
        marketShare: '15%',
        strengths: ['Mobile-first approach', 'Easy to use', 'Good field collaboration'],
        weaknesses: ['Limited analytics', 'Basic reporting', 'No IoT integration'],
        funding: 'Acquired by Autodesk',
        founded: '2011'
      },
      {
        name: 'Bentley Systems',
        description: 'Infrastructure engineering software',
        marketShare: '20%',
        strengths: ['Advanced 3D modeling', 'Industry expertise', 'Comprehensive solutions'],
        weaknesses: ['Expensive', 'Complex learning curve', 'Limited mobile support'],
        funding: 'Public company',
        founded: '1984'
      }
    ],
    marketTrends: [
      'Increasing adoption of IoT in construction',
      'Growing demand for real-time monitoring',
      'Rising focus on safety and compliance',
      'Digital transformation in construction'
    ],
    regulatoryEnvironment: 'Construction safety regulations and building codes vary by jurisdiction',
    technologyRequirements: [
      'IoT sensor networks',
      'Computer vision and AI',
      'Cloud infrastructure',
      'Mobile applications'
    ],
    customerSegments: [
      'General contractors',
      'Construction managers',
      'Project owners',
      'Subcontractors'
    ],
    goToMarketStrategy: [
      'Direct sales to construction companies',
      'Partnerships with equipment manufacturers',
      'Industry trade shows',
      'Pilot programs with large contractors'
    ]
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
    tags: ['Community', 'Mobile', 'Payments', 'Social'],
    competitors: [
      {
        name: 'Nextdoor',
        description: 'Hyperlocal social networking platform',
        marketShare: '40%',
        strengths: ['Large user base', 'Strong community focus', 'Local advertising'],
        weaknesses: ['Limited service marketplace', 'No skill verification', 'Basic functionality'],
        funding: 'Public company',
        founded: '2010'
      },
      {
        name: 'TaskRabbit',
        description: 'On-demand task and service marketplace',
        marketShare: '25%',
        strengths: ['Verified service providers', 'Wide service range', 'Established brand'],
        weaknesses: ['Not hyperlocal', 'High fees', 'Limited community aspect'],
        funding: 'Acquired by IKEA',
        founded: '2008'
      },
      {
        name: 'Craigslist',
        description: 'Classified advertisements website',
        marketShare: '20%',
        strengths: ['Free to use', 'Large reach', 'Simple interface'],
        weaknesses: ['No verification', 'Safety concerns', 'Outdated design'],
        funding: 'Private company',
        founded: '1995'
      }
    ],
    marketTrends: [
      'Growing demand for local services',
      'Increasing community engagement',
      'Rising trust in peer-to-peer services',
      'Mobile-first local commerce'
    ],
    regulatoryEnvironment: 'Local business licensing and payment processing regulations apply',
    technologyRequirements: [
      'Mobile app development',
      'Payment processing',
      'Location services',
      'Identity verification'
    ],
    customerSegments: [
      'Local communities',
      'Small service providers',
      'Homeowners',
      'Young professionals'
    ],
    goToMarketStrategy: [
      'Community-based marketing',
      'Local partnerships',
      'Social media engagement',
      'Referral incentives'
    ]
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
    tags: ['AI', 'Productivity', 'B2B', 'SaaS'],
    competitors: [
      {
        name: 'Microsoft Teams',
        description: 'Collaboration platform with meeting features',
        marketShare: '35%',
        strengths: ['Microsoft ecosystem integration', 'Enterprise features', 'Video conferencing'],
        weaknesses: ['Limited AI assistance', 'Complex interface', 'Poor meeting prep tools'],
        funding: 'Microsoft subsidiary',
        founded: '2017'
      },
      {
        name: 'Zoom',
        description: 'Video conferencing platform',
        marketShare: '30%',
        strengths: ['Easy to use', 'Reliable video', 'Large user base'],
        weaknesses: ['No meeting preparation', 'Limited collaboration', 'Security concerns'],
        funding: 'Public company',
        founded: '2011'
      },
      {
        name: 'Slack',
        description: 'Team communication platform',
        marketShare: '20%',
        strengths: ['Great messaging', 'App integrations', 'Team collaboration'],
        weaknesses: ['No meeting features', 'Limited AI', 'Poor meeting context'],
        funding: 'Acquired by Salesforce',
        founded: '2009'
      }
    ],
    marketTrends: [
      'Growing remote work adoption',
      'Increasing demand for AI assistance',
      'Rising focus on meeting productivity',
      'Integration of AI in workplace tools'
    ],
    regulatoryEnvironment: 'Data privacy regulations apply to workplace communication and AI processing',
    technologyRequirements: [
      'AI/ML for meeting analysis',
      'Calendar integration APIs',
      'Natural language processing',
      'Cloud infrastructure'
    ],
    customerSegments: [
      'Enterprise companies',
      'Remote teams',
      'Sales professionals',
      'Project managers'
    ],
    goToMarketStrategy: [
      'Enterprise sales',
      'Freemium model',
      'Integration partnerships',
      'Content marketing'
    ]
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
    competitors: [
      {
        name: 'Coursera',
        description: 'Online learning platform with courses from top universities',
        marketShare: '30%',
        strengths: ['High-quality content', 'University partnerships', 'Large course library'],
        weaknesses: ['Limited personalization', 'Fixed course structure', 'No adaptive learning'],
        funding: 'Public company',
        founded: '2012'
      },
      {
        name: 'Udemy',
        description: 'Online learning marketplace with diverse course offerings',
        marketShare: '25%',
        strengths: ['Large course variety', 'Affordable pricing', 'Instructor marketplace'],
        weaknesses: ['Inconsistent quality', 'No structured paths', 'Limited career focus'],
        funding: 'Public company',
        founded: '2010'
      },
      {
        name: 'Duolingo',
        description: 'Language learning app with gamified approach',
        marketShare: '20%',
        strengths: ['Gamification', 'Mobile-first', 'Free tier available'],
        weaknesses: ['Limited to languages', 'No career alignment', 'Basic personalization'],
        funding: 'Public company',
        founded: '2011'
      }
    ],
    sources: [
      'EdTech Market Analysis 2024',
      'UNESCO Learning Crisis Report',
      'Coursera Learner Outcome Studies'
    ],
    difficulty: 'High',
    tags: ['AI', 'Education', 'Analytics', 'Personalization'],
    marketTrends: [
      'Growing demand for personalized learning',
      'Increasing focus on skills-based education',
      'Rising adoption of AI in education',
      'Shift toward lifelong learning'
    ],
    regulatoryEnvironment: 'Education regulations vary by country, with data privacy laws applying to student information',
    technologyRequirements: [
      'AI/ML for adaptive learning',
      'Learning analytics platform',
      'Content management system',
      'Mobile and web applications'
    ],
    customerSegments: [
      'University students',
      'Working professionals',
      'K-12 students',
      'Corporate training departments'
    ],
    goToMarketStrategy: [
      'Partnerships with educational institutions',
      'Freemium model with premium features',
      'Corporate learning partnerships',
      'Content marketing and thought leadership'
    ]
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
    competitors: [
      {
        name: 'Thomson Reuters',
        description: 'Professional information services and compliance solutions',
        marketShare: '35%',
        strengths: ['Comprehensive regulatory database', 'Industry expertise', 'Global reach'],
        weaknesses: ['Expensive', 'Complex implementation', 'Limited automation'],
        funding: 'Public company',
        founded: '1851'
      },
      {
        name: 'Wolters Kluwer',
        description: 'Professional information and software solutions',
        marketShare: '25%',
        strengths: ['Strong compliance tools', 'Multi-industry coverage', 'Established brand'],
        weaknesses: ['High cost', 'Limited AI features', 'Complex user interface'],
        funding: 'Public company',
        founded: '1987'
      },
      {
        name: 'ComplyAdvantage',
        description: 'AI-powered financial crime detection platform',
        marketShare: '15%',
        strengths: ['AI-powered automation', 'Real-time monitoring', 'Cost-effective'],
        weaknesses: ['Limited scope', 'Newer company', 'Smaller customer base'],
        funding: 'Series C',
        founded: '2014'
      }
    ],
    sources: [
      'Thomson Reuters Regulatory Intelligence',
      'PwC RegTech Report 2024',
      'Small Business Administration Studies'
    ],
    difficulty: 'High',
    tags: ['RegTech', 'AI', 'B2B', 'Automation'],
    marketTrends: [
      'Increasing regulatory complexity',
      'Growing demand for automation',
      'Rising compliance costs',
      'AI adoption in compliance'
    ],
    regulatoryEnvironment: 'Compliance with financial regulations, data privacy laws, and industry-specific requirements',
    technologyRequirements: [
      'AI/ML for regulatory analysis',
      'Natural language processing',
      'Document automation',
      'Cloud infrastructure'
    ],
    customerSegments: [
      'Small businesses',
      'Financial services firms',
      'Healthcare providers',
      'Manufacturing companies'
    ],
    goToMarketStrategy: [
      'Direct sales to small businesses',
      'Partnerships with accounting firms',
      'Industry-specific compliance packages',
      'Educational content marketing'
    ]
  }
];

export const industries = Array.from(new Set(jobsToBeDone.map(job => job.industry)));
export const tags = Array.from(new Set(jobsToBeDone.flatMap(job => job.tags)));