import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendSignal } from '../data/mockData';

interface ChartPanelProps {
  signals: TrendSignal[];
}

const getChartColor = (type: string) => {
  switch (type) {
    case 'SNS':
      return '#f472b6'; // 핑크
    case 'Retail':
      return '#fb7185'; // 로즈
    case 'Review':
      return '#fda4af'; // 코랄 핑크
    default:
      return '#64748b';
  }
};

export default function ChartPanel({ signals }: ChartPanelProps) {
  return (
    <div className="grid grid-cols-3 gap-4 mt-4 pb-4">
      {signals.map((signal) => {
        const color = getChartColor(signal.type);
        return (
          <div key={signal.type} className="bg-gradient-to-br from-rose-950/20 to-pink-950/20 backdrop-blur-sm rounded-lg p-3 border border-rose-800/30">
            <h4 className="text-sm font-semibold text-slate-300 mb-2 text-center">
              {signal.type}
            </h4>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={signal.data}>
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                  axisLine={{ stroke: '#475569' }}
                  tickLine={{ stroke: '#475569' }}
                />
                <YAxis
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                  axisLine={{ stroke: '#475569' }}
                  tickLine={{ stroke: '#475569' }}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    color: '#e2e8f0',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={2}
                  dot={{ fill: color, r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      })}
    </div>
  );
}

