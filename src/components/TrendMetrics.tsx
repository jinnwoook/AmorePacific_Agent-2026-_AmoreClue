import { TrendMetric } from '../data/mockData';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TrendMetricsProps {
  metrics: TrendMetric[];
}

export default function TrendMetrics({ metrics }: TrendMetricsProps) {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return TrendingUp;
      case 'down':
        return TrendingDown;
      default:
        return Minus;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-rose-600';
      case 'down':
        return 'text-blue-600';
      default:
        return 'text-slate-600';
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3 pb-2">
      {metrics.map((metric, index) => {
        const Icon = getTrendIcon(metric.trend);
        const colorClass = getTrendColor(metric.trend);
        
        return (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white/95 backdrop-blur-sm border border-slate-200/80 rounded-lg p-3"
          >
            <div className="flex items-start justify-between mb-2">
              <p className="text-xs text-slate-900 font-bold leading-tight">{metric.label}</p>
              <Icon className={`w-4 h-4 ${colorClass} flex-shrink-0`} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-slate-900">
                {metric.value}
              </span>
              <span className="text-xs text-slate-700 font-semibold">{metric.unit}</span>
            </div>
            <div className={`text-xs mt-1 font-semibold flex items-center gap-1 ${
              metric.trend === 'up' ? 'text-rose-600' : 
              metric.trend === 'down' ? 'text-blue-600' : 
              'text-slate-600'
            }`}>
              <Icon className="w-3 h-3" />
              <span>
                {metric.change > 0 ? '+' : ''}{metric.change}% vs 전월
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

