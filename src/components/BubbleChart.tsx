import { ScatterChart, Scatter, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, ZAxis } from 'recharts';
import { BubbleItem } from '../data/mockData';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface BubbleChartProps {
  data: BubbleItem[];
}

const getBubbleColor = (type: string) => {
  switch (type) {
    case 'ingredient':
      return { fill: '#f472b6', stroke: '#ec4899', glow: 'rgba(244, 114, 182, 0.4)' }; // 핑크
    case 'formula':
      return { fill: '#fb7185', stroke: '#f43f5e', glow: 'rgba(251, 113, 133, 0.4)' }; // 로즈
    case 'effect':
      return { fill: '#fda4af', stroke: '#fb7185', glow: 'rgba(253, 164, 175, 0.4)' }; // 코랄 핑크
    default:
      return { fill: '#64748b', stroke: '#475569', glow: 'rgba(100, 116, 139, 0.4)' };
  }
};

// 버블 크기를 픽셀로 변환하는 함수
const sizeToRadius = (size: number, minSize: number, maxSize: number, minRadius: number, maxRadius: number) => {
  const ratio = (size - minSize) / (maxSize - minSize);
  return minRadius + (maxRadius - minRadius) * ratio;
};

export default function BubbleChart({ data }: BubbleChartProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [chartSize, setChartSize] = useState({ width: 0, height: 0 });

  const minSize = Math.min(...data.map(d => d.size));
  const maxSize = Math.max(...data.map(d => d.size));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-rose-950/40 to-pink-950/40 backdrop-blur-sm rounded-xl p-4 border border-rose-500/30 h-full flex flex-col shadow-2xl"
    >
      <div className="flex-shrink-0 mb-3">
        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
          <span className="text-2xl">✨</span>
          <span className="bg-gradient-to-r from-rose-300 to-pink-300 bg-clip-text text-transparent">
            키워드 시너지 맵
          </span>
        </h3>
        <div className="flex gap-3 mb-3 text-xs">
          <div className="flex items-center gap-2 px-2 py-1 bg-pink-500/20 rounded-lg border border-pink-500/30">
            <div className="w-3 h-3 rounded-full bg-pink-400 shadow-lg shadow-pink-400/70 animate-pulse"></div>
            <span className="text-rose-200 font-medium">성분</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-1 bg-rose-500/20 rounded-lg border border-rose-500/30">
            <div className="w-3 h-3 rounded-full bg-rose-500 shadow-lg shadow-rose-500/70 animate-pulse"></div>
            <span className="text-rose-200 font-medium">제형</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-1 bg-pink-300/20 rounded-lg border border-pink-300/30">
            <div className="w-3 h-3 rounded-full bg-pink-300 shadow-lg shadow-pink-300/70 animate-pulse"></div>
            <span className="text-rose-200 font-medium">효과</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 relative min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
            onMouseMove={(e) => {
              if (e?.activePayload?.[0]?.payload) {
                const item = e.activePayload[0].payload as BubbleItem;
                setHoveredItem(item.id);
              }
            }}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {/* 배경 그리드 */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(251, 113, 133, 0.1)" strokeWidth="1"/>
              </pattern>
              {data.map((item, index) => {
                const colors = getBubbleColor(item.type);
                return (
                  <filter key={`glow-${index}`} id={`glow-${index}`}>
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                );
              })}
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" opacity={0.3} />
            
            <XAxis
              type="number"
              dataKey="x"
              domain={[0, 100]}
              tick={false}
              axisLine={false}
            />
            <YAxis
              type="number"
              dataKey="y"
              domain={[0, 100]}
              tick={false}
              axisLine={false}
            />
            <ZAxis type="number" dataKey="size" range={[100, 500]} />
            
            <Tooltip
              cursor={{ strokeDasharray: '3 3', stroke: 'rgba(251, 113, 133, 0.5)' }}
              content={({ active, payload }) => {
                if (active && payload && payload[0]) {
                  const data = payload[0].payload as BubbleItem;
                  const colors = getBubbleColor(data.type);
                  return (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-gradient-to-br from-rose-900/98 to-pink-900/98 backdrop-blur-md border-2 border-rose-400/50 rounded-xl p-4 shadow-2xl"
                      style={{ boxShadow: `0 0 20px ${colors.glow}` }}
                    >
                      <p className="text-white font-bold text-base mb-1">{data.name}</p>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.fill }}></div>
                        <p className="text-rose-200 text-sm">인기도: <span className="font-semibold text-rose-100">{data.value}%</span></p>
                      </div>
                      <p className="text-rose-300/70 text-xs mt-2">트렌드 영향력: {data.size}</p>
                    </motion.div>
                  );
                }
                return null;
              }}
            />
            
            <Scatter data={data} fill="#8884d8" shape="circle">
              {data.map((entry, index) => {
                const colors = getBubbleColor(entry.type);
                const isHovered = hoveredItem === entry.id;
                const radius = sizeToRadius(entry.size, minSize, maxSize, 50, 250);
                
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors.fill}
                    stroke={colors.stroke}
                    strokeWidth={isHovered ? 3 : 2}
                    opacity={isHovered ? 1 : 0.85}
                    style={{
                      filter: isHovered ? `drop-shadow(0 0 15px ${colors.glow})` : `drop-shadow(0 0 8px ${colors.glow})`,
                      transition: 'all 0.3s ease',
                    }}
                  />
                );
              })}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        
        {/* 커스텀 레이블 오버레이 */}
        <div className="absolute inset-0 pointer-events-none">
          {data.map((item) => {
            const colors = getBubbleColor(item.type);
            const radius = sizeToRadius(item.size, minSize, maxSize, 50, 250);
            const x = (item.x / 100) * 100;
            const y = (1 - item.y / 100) * 100;
            const isHovered = hoveredItem === item.id;
            
            return (
              <motion.div
                key={`label-${item.id}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: isHovered ? 1 : 0.7,
                  scale: isHovered ? 1.1 : 1,
                }}
                transition={{ duration: 0.2 }}
                className="absolute"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'none',
                }}
              >
                <div
                  className="text-center"
                  style={{
                    marginTop: `-${radius + 15}px`,
                  }}
                >
                  <div
                    className="px-2 py-1 rounded-md text-xs font-bold text-white whitespace-nowrap"
                    style={{
                      backgroundColor: `${colors.fill}dd`,
                      border: `1px solid ${colors.stroke}`,
                      boxShadow: `0 2px 8px ${colors.glow}`,
                    }}
                  >
                    {item.name}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      {/* 하단 설명 */}
      <div className="flex-shrink-0 mt-3 pt-3 border-t border-rose-500/20">
        <div className="flex items-center justify-center gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-rose-400"></div>
            <span className="text-rose-200/70">작은 버블</span>
          </div>
          <span className="text-rose-400/50">→</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-pink-400"></div>
            <span className="text-rose-200/70">큰 버블</span>
          </div>
          <span className="text-rose-400/50 mx-2">|</span>
          <span className="text-rose-300/80 font-medium">버블 크기 = 트렌드 영향력</span>
        </div>
      </div>
    </motion.div>
  );
}

