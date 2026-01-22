import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { SNSTopIngredient, Country } from '../data/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, Music, Youtube, ShoppingBag, Store, Sparkles, Loader2 } from 'lucide-react';
import { getIntegratedAIAnalysis } from '../data/leaderboardData';
import { useState, useEffect } from 'react';

interface SNSTopChartProps {
  data: SNSTopIngredient[];
  country?: Country;
}

const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case 'Instagram':
      return Instagram;
    case 'TikTok':
      return Music;
    case 'YouTube':
      return Youtube;
    case 'Amazon':
      return ShoppingBag;
    case 'Shopee':
      return ShoppingBag;
    case 'Cosme':
      return Store;
    default:
      return Instagram;
  }
};

const getPlatformColor = (platform: string) => {
  switch (platform) {
    case 'Instagram':
      return { gradient: 'from-pink-500 to-rose-500', bar: '#ec4899' };
    case 'TikTok':
      return { gradient: 'from-cyan-500 to-blue-500', bar: '#06b6d4' };
    case 'YouTube':
      return { gradient: 'from-red-500 to-rose-500', bar: '#ef4444' };
    case 'Amazon':
      return { gradient: 'from-orange-500 to-amber-500', bar: '#f97316' };
    case 'Shopee':
      return { gradient: 'from-orange-500 to-red-500', bar: '#f97316' };
    case 'Cosme':
      return { gradient: 'from-pink-500 to-purple-500', bar: '#a855f7' };
    default:
      return { gradient: 'from-pink-500 to-rose-500', bar: '#ec4899' };
  }
};

export default function SNSTopChart({ data, country }: SNSTopChartProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysisData, setAnalysisData] = useState<{ summary: string; insights: string[]; recommendations: string[] } | null>(null);

  useEffect(() => {
    // 로딩 효과 시뮬레이션
    setIsAnalyzing(true);
    const timer = setTimeout(() => {
      if (country && data.length > 0) {
        const analysis = getIntegratedAIAnalysis(data, country);
        setAnalysisData(analysis);
        setIsAnalyzing(false);
      }
    }, 1500); // 1.5초 로딩

    return () => clearTimeout(timer);
  }, [data, country]);

  return (
    <div className="space-y-4">
      {/* 플랫폼별 차트 */}
      {data.map((platformData, index) => {
        const Icon = getPlatformIcon(platformData.platform);
        const colors = getPlatformColor(platformData.platform);
        
        return (
          <motion.div
            key={platformData.platform}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/95 backdrop-blur-sm border border-slate-200/80 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <Icon className="w-5 h-5 text-rose-600" />
              <h4 className="text-slate-900 font-bold text-base">{platformData.platform}</h4>
              <span className="text-xs text-slate-700 font-semibold">인기 키워드 순위</span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={platformData.keywords} layout="vertical">
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fill: '#1e293b', fontSize: 12, fontWeight: 'bold' }}
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.98)',
                    border: '1px solid rgba(251, 113, 133, 0.5)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    padding: '8px 12px',
                  }}
                  labelStyle={{
                    color: '#fda4af',
                    fontWeight: 'bold',
                    marginBottom: '4px',
                  }}
                  formatter={(value: number, name: string, props: any) => {
                    const changeText = props.payload.change > 0 ? `+${props.payload.change}` : `${props.payload.change}`;
                    const typeText = props.payload.type === 'ingredient' ? '성분' : props.payload.type === 'formula' ? '제형' : '효과';
                    return [`${value}% (${changeText}%)`, `${typeText} - 언급량`];
                  }}
                  itemStyle={{
                    color: '#ffffff',
                    fontWeight: 'bold',
                  }}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                  {platformData.keywords.map((entry, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={colors.bar}
                      opacity={0.8 - idx * 0.1}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        );
      })}

      {/* 통합 AI 분석 섹션 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: data.length * 0.1 + 0.2 }}
        className="bg-white/95 backdrop-blur-sm border border-slate-200/80 rounded-xl p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-rose-600" />
          <h4 className="text-slate-900 font-bold text-base">종합 AI 분석</h4>
        </div>

        <AnimatePresence mode="wait">
          {isAnalyzing ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-8"
            >
              <Loader2 className="w-8 h-8 text-rose-600 animate-spin mb-3" />
              <p className="text-sm text-slate-600 font-medium">AI 분석 중...</p>
              <p className="text-xs text-slate-500 mt-1">플랫폼 데이터를 종합 분석하고 있습니다</p>
            </motion.div>
          ) : analysisData ? (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* 종합 요약 */}
              <div>
                <p className="text-sm text-slate-900 leading-relaxed font-medium">
                  {analysisData.summary}
                </p>
              </div>

              {/* 핵심 인사이트 */}
              {analysisData.insights.length > 0 && (
                <div className="pt-3 border-t border-slate-200">
                  <h5 className="text-sm font-bold text-slate-900 mb-2">핵심 인사이트</h5>
                  <ul className="space-y-2">
                    {analysisData.insights.map((insight, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-start gap-2 text-xs text-slate-900"
                      >
                        <span className="text-rose-600 font-bold mt-0.5">•</span>
                        <span className="leading-relaxed">{insight}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 전략 제안 */}
              {analysisData.recommendations.length > 0 && (
                <div className="pt-3 border-t border-slate-200">
                  <h5 className="text-sm font-bold text-slate-900 mb-2">전략 제안</h5>
                  <ul className="space-y-2">
                    {analysisData.recommendations.map((rec, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (analysisData.insights.length + idx) * 0.1 }}
                        className="flex items-start gap-2 text-xs text-slate-900"
                      >
                        <span className="text-emerald-600 font-bold mt-0.5">→</span>
                        <span className="leading-relaxed">{rec}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

