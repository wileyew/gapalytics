import { useMemo } from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { HeatmapData } from '@/lib/openai';

interface MarketHeatmapProps {
  data: HeatmapData[];
  title?: string;
}

interface HeatmapPoint extends HeatmapData {
  size: number;
  color: string;
}

export const MarketHeatmap = ({ data, title = "Market Opportunity Heatmap" }: MarketHeatmapProps) => {
  const heatmapPoints = useMemo(() => {
    return data.map((point, index): HeatmapPoint => {
      // Handle different data structures from API
      let processedPoint = point;
      
      // If the point has 'dimension' property (from API response), transform it
      if ('dimension' in point && typeof point.dimension === 'string') {
        processedPoint = {
          industry: 'Technology',
          opportunity: point.dimension,
          intensity: (point.intensity || 0) * 10, // Scale 0-10 to 0-100
          revenue: (point.intensity || 0) * 1000000, // Convert to revenue estimate
          competition: 50, // Default competition level
          x: index % 5,
          y: Math.floor(index / 5)
        };
      }
      
      // Ensure all required properties exist with fallbacks
      const safePoint = {
        industry: processedPoint.industry || 'Technology',
        opportunity: processedPoint.opportunity || `Opportunity ${index + 1}`,
        intensity: processedPoint.intensity || 50,
        revenue: processedPoint.revenue || 1000000,
        competition: processedPoint.competition || 50,
        x: processedPoint.x ?? (index % 5),
        y: processedPoint.y ?? Math.floor(index / 5)
      };
      
      // Size based on revenue potential
      const size = Math.max(50, Math.min(300, safePoint.revenue * 8));
      
      // Color based on opportunity intensity
      const getColor = (intensity: number): string => {
        if (intensity >= 80) return '#ef4444'; // Red - High opportunity
        if (intensity >= 60) return '#f97316'; // Orange - Medium-high
        if (intensity >= 40) return '#eab308'; // Yellow - Medium
        if (intensity >= 20) return '#22c55e'; // Green - Low-medium
        return '#3b82f6'; // Blue - Low
      };
      
      return {
        ...safePoint,
        size,
        color: getColor(safePoint.intensity)
      };
    });
  }, [data]);

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: HeatmapPoint }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border max-w-xs">
          <h4 className="font-semibold text-sm mb-2">{data.opportunity}</h4>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Industry:</span>
              <Badge variant="outline" className="text-xs">{data.industry}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Revenue Potential:</span>
              <span className="font-medium">${data.revenue}M</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Competition:</span>
              <span className="font-medium">{data.competition}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Opportunity Score:</span>
              <span className="font-medium">{data.intensity}/100</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const getIntensityLabel = (intensity: number): string => {
    if (intensity >= 80) return 'High Opportunity';
    if (intensity >= 60) return 'Medium-High';
    if (intensity >= 40) return 'Medium';
    if (intensity >= 20) return 'Low-Medium';
    return 'Low Opportunity';
  };

  const legend = [
    { color: '#ef4444', label: 'High Opportunity (80-100)', range: '80-100' },
    { color: '#f97316', label: 'Medium-High (60-79)', range: '60-79' },
    { color: '#eab308', label: 'Medium (40-59)', range: '40-59' },
    { color: '#22c55e', label: 'Low-Medium (20-39)', range: '20-39' },
    { color: '#3b82f6', label: 'Low Opportunity (0-19)', range: '0-19' }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-red-500 rounded"></div>
          {title}
        </CardTitle>
        <CardDescription>
          Bubble size represents revenue potential. Color intensity shows market opportunity score.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Legend */}
          <div className="flex flex-wrap gap-3 justify-center">
            {legend.map((item) => (
              <div key={item.range} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-xs text-muted-foreground">{item.range}</span>
              </div>
            ))}
          </div>
          
          {/* Heatmap */}
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{
                  top: 20,
                  right: 20,
                  bottom: 20,
                  left: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  type="number" 
                  dataKey="revenue" 
                  name="Revenue Potential ($M)"
                  domain={['dataMin - 5', 'dataMax + 5']}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="competition" 
                  name="Competition Level (%)"
                  domain={[0, 100]}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Scatter name="Opportunities" data={heatmapPoints}>
                  {heatmapPoints.map((point, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={point.color}
                      r={Math.sqrt(point.size / Math.PI)}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          
          {/* Key Insights */}
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
              <h4 className="font-semibold text-green-800 mb-2">Sweet Spot Opportunities</h4>
              <p className="text-sm text-green-700">
                Look for large bubbles in the upper-left quadrant: high revenue potential with low competition.
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-semibold text-blue-800 mb-2">Market Gaps</h4>
              <p className="text-sm text-blue-700">
                Red/orange bubbles indicate high-opportunity areas. Consider innovation in these spaces.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};