import { Sparkles, TrendingUp, MessageSquare, BarChart3, Percent, Lightbulb, Target, Hash, FileText, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { BubbleItem, TrendItem } from '../data/mockData';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { useState, useEffect } from 'react';

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

interface InsightPanelProps {
  selectedInsight: string | null;
  selectedBubbleItem: BubbleItem | null;
  selectedTrendItem: TrendItem | null;
  selectedBubbleItemRank?: number; // 리더보드에서의 등수
  selectedBubbleItemType?: 'ingredient' | 'formula' | 'effect'; // 리더보드 타입
  onOpenModal: () => void;
}

export default function InsightPanel({ selectedInsight, selectedBubbleItem, selectedTrendItem, selectedBubbleItemRank, selectedBubbleItemType, onOpenModal }: InsightPanelProps) {
  const [isSummarized, setIsSummarized] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // TrendItem 또는 BubbleItem에서 evidence 추출
  const evidence = selectedBubbleItem?.evidence || selectedTrendItem?.evidence;
  const itemName = selectedBubbleItem?.name || selectedTrendItem?.combination || '';
  const hasContent = selectedInsight || evidence;

  // 리더보드 항목이 변경되면 AI 분석 중 상태로 설정
  useEffect(() => {
    if (selectedBubbleItem || selectedTrendItem) {
      setIsAnalyzing(true);
      // AI 분석 시뮬레이션을 위한 딜레이 (1.5초)
      const timer = setTimeout(() => {
        setIsAnalyzing(false);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setIsAnalyzing(false);
    }
  }, [selectedBubbleItem, selectedTrendItem]);

  // evidence가 변경되면 요약 상태 초기화
  useEffect(() => {
    setIsSummarized(false);
    setIsGenerating(false);
  }, [evidence]);

  // 차트 데이터 생성
  const getChartData = () => {
    if (!evidence) return null;
    const { numericalEvidence } = evidence;
    
    return {
      mentionGrowth: [
        { period: '2개월 전', value: numericalEvidence.previousMentions || Math.floor(numericalEvidence.snsMentions * 0.7) },
        { period: '1개월 전', value: Math.floor((numericalEvidence.previousMentions || Math.floor(numericalEvidence.snsMentions * 0.7)) * 1.2) },
        { period: '현재', value: numericalEvidence.snsMentions },
      ],
      reviewGrowth: [
        { period: '2개월 전', value: numericalEvidence.previousReviewCount || Math.floor(numericalEvidence.reviewCount * 0.7) },
        { period: '1개월 전', value: Math.floor((numericalEvidence.previousReviewCount || Math.floor(numericalEvidence.reviewCount * 0.7)) * 1.2) },
        { period: '현재', value: numericalEvidence.reviewCount },
      ],
      marketShare: [
        { name: '현재 트렌드', value: numericalEvidence.marketShare },
        { name: '기타', value: 100 - numericalEvidence.marketShare },
      ],
    };
  };

  const chartData = getChartData();

  // 요약 버튼 클릭 핸들러
  const handleSummarize = () => {
    setIsGenerating(true);
    // 생성 중 애니메이션을 위한 딜레이
    setTimeout(() => {
      setIsGenerating(false);
      setIsSummarized(true);
    }, 1500); // 1.5초 딜레이
  };

  // AI 분석 내용 요약 생성
  const generateSummary = (): string => {
    if (!evidence) return '';
    
    const { numericalEvidence, aiExplanation, reviewTrend } = evidence;
    const isCombination = !!selectedTrendItem;
    const trendType = selectedBubbleItem ? '트렌드' : '꿀조합';
    
    // 요약 생성 (3-5문장)
    const summary = isCombination
      ? `${itemName}은 현재 ${trendType}로 주목받고 있습니다. SNS에서 ${numericalEvidence.snsMentions.toLocaleString()}건의 언급과 ${numericalEvidence.reviewCount.toLocaleString()}건의 리뷰가 축적되었으며, 전월 대비 ${numericalEvidence.growthRate}%의 성장률을 보이고 있습니다. 시장 점유율 ${numericalEvidence.marketShare}%를 기록하며, 소비자들은 "시너지 효과가 뛰어나다", "예상보다 효과가 좋다"는 긍정적 피드백을 남기고 있습니다. 이 조합은 SNS, 리테일, 리뷰 3가지 신호에서 모두 상승세를 보이고 있어 즉시 활용 가능한 검증된 ${trendType}입니다. 기획팀은 신제품 개발 시 이 조합을 핵심으로 활용한 제품 개발을 검토할 수 있습니다.`
      : `${itemName}은 현재 ${trendType}로 급성장 중입니다. SNS에서 ${numericalEvidence.snsMentions.toLocaleString()}건의 언급과 ${numericalEvidence.reviewCount.toLocaleString()}건의 리뷰가 축적되었으며, 전월 대비 ${numericalEvidence.growthRate}%의 성장률을 보이고 있습니다. 시장 점유율 ${numericalEvidence.marketShare}%를 기록하며, 소비자들은 "효과가 빠르게 나타났다", "피부 개선이 체감된다"는 긍정적 피드백을 남기고 있습니다. 이 ${trendType}는 SNS, 리테일, 리뷰 3가지 신호에서 모두 상승세를 보이고 있어 즉시 활용 가능한 검증된 트렌드입니다. 기획팀은 신제품 기획 시 ${itemName}을 핵심으로 활용한 제품 개발을 검토할 수 있습니다.`;
    
    return summary;
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* AI 분석 박스 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 bg-white/95 backdrop-blur-sm border border-slate-200/80 rounded-xl p-6 shadow-xl overflow-y-auto"
      >
        {/* 항목 정보 헤더 - 크고 눈에 띄게 */}
        {(selectedBubbleItem || selectedTrendItem) && !isSummarized && (
          <div className="mb-6 pb-4 border-b border-slate-200">
            <div className="flex items-start gap-4">
              {/* 등수 표시 */}
              {selectedBubbleItemRank && (
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/30">
                    <span className="text-white font-bold text-2xl">{selectedBubbleItemRank}</span>
                  </div>
                  <div className="text-center mt-1">
                    <span className="text-xs text-slate-900">등</span>
                  </div>
                </div>
              )}
              {selectedTrendItem && (
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/30">
                    <span className="text-white font-bold text-2xl">{selectedTrendItem.rank}</span>
                  </div>
                  <div className="text-center mt-1">
                    <span className="text-xs text-slate-900">등</span>
                  </div>
                </div>
              )}
              
              {/* 항목 이름 및 타입 */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {selectedBubbleItemType && (
                    <span className={`px-3 py-1.5 rounded-lg border backdrop-blur-sm text-sm font-semibold ${
                      selectedBubbleItemType === 'ingredient' 
                        ? 'bg-pink-400/80 text-slate-900 border-pink-500 font-semibold' 
                        : selectedBubbleItemType === 'formula'
                        ? 'bg-rose-400/80 text-slate-900 border-rose-500 font-semibold'
                        : 'bg-coral-400/80 text-slate-900 border-coral-500 font-semibold'
                    }`}>
                      {selectedBubbleItemType === 'ingredient' ? '🧪 성분' : selectedBubbleItemType === 'formula' ? '💧 제형' : '✨ 효과'}
                    </span>
                  )}
                  {selectedTrendItem && (
                    <span className="px-3 py-1.5 rounded-lg border backdrop-blur-sm text-sm font-semibold bg-purple-400/80 text-slate-900 border-purple-500">
                      🧩 꿀조합
                    </span>
                  )}
                  {selectedBubbleItem?.status && (
                    <span className={`px-3 py-1.5 rounded-lg border backdrop-blur-sm text-sm font-semibold ${
                      selectedBubbleItem.status.includes('Actionable Trend')
                        ? 'bg-orange-400/80 text-slate-900 border-orange-500 font-semibold'
                        : selectedBubbleItem.status.includes('Growing Trend')
                        ? 'bg-emerald-400/80 text-slate-900 border-emerald-500 font-semibold'
                        : selectedBubbleItem.status.includes('Early Trend')
                        ? 'bg-violet-400/80 text-slate-900 border-violet-500 font-semibold'
                        : 'bg-slate-300/80 text-slate-900 border-slate-400 font-semibold'
                    }`}>
                      {selectedBubbleItem.status}
                    </span>
                  )}
                  {selectedTrendItem?.status && (
                    <span className={`px-3 py-1.5 rounded-lg border backdrop-blur-sm text-sm font-semibold ${
                      selectedTrendItem.status.includes('Actionable Trend')
                        ? 'bg-orange-400/80 text-slate-900 border-orange-500 font-semibold'
                        : selectedTrendItem.status.includes('Growing Trend')
                        ? 'bg-emerald-400/80 text-slate-900 border-emerald-500 font-semibold'
                        : selectedTrendItem.status.includes('Early Trend')
                        ? 'bg-violet-400/80 text-slate-900 border-violet-500 font-semibold'
                        : 'bg-slate-300/80 text-slate-900 border-slate-400 font-semibold'
                    }`}>
                      {selectedTrendItem.status}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1">{itemName}</h2>
                {selectedBubbleItemType && (
                  <p className="text-sm text-slate-900">
                    {selectedBubbleItemType === 'ingredient' ? '성분' : selectedBubbleItemType === 'formula' ? '제형' : '효과'} 트렌드 리더보드
                  </p>
                )}
                {selectedTrendItem && (
                  <p className="text-sm text-slate-900">
                    꿀조합 리더보드 · {selectedTrendItem.category}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-900 font-semibold text-lg flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-rose-500" />
            AI 분석
        </h3>
          <div className="flex items-center gap-2">
            {evidence && !isSummarized && !isGenerating && !isAnalyzing && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSummarize}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-100 hover:bg-rose-200 border border-rose-300 rounded-lg text-xs text-slate-900 transition-all flex-shrink-0"
              >
                <FileText className="w-3 h-3" />
                <span>요약</span>
              </motion.button>
            )}
            {isSummarized && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSummarized(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-100 hover:bg-rose-200 border border-rose-300 rounded-lg text-xs text-slate-900 transition-all flex-shrink-0"
              >
                <RotateCcw className="w-3 h-3" />
                <span>되돌아가기</span>
              </motion.button>
            )}
          </div>
        </div>

        {!hasContent ? (
          <div className="min-h-[150px] flex items-center justify-center">
            <p className="text-slate-900 italic">
              리더보드 항목을 클릭하여 트렌드 근거를 확인하세요
            </p>
          </div>
        ) : isAnalyzing ? (
          // AI 분석 중 표시
          <div className="min-h-[300px] flex flex-col items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-rose-500/30 border-t-rose-500 rounded-full mb-4"
            />
            <p className="text-slate-900 text-sm font-medium">AI 분석 중...</p>
            <p className="text-slate-900 text-xs mt-2">트렌드 데이터를 분석하고 있습니다</p>
          </div>
        ) : isGenerating ? (
          // 요약 생성 중 표시
          <div className="min-h-[300px] flex flex-col items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-rose-500/30 border-t-rose-500 rounded-full mb-4"
            />
            <p className="text-slate-900 text-sm font-medium">요약 생성 중...</p>
          </div>
        ) : isSummarized ? (
          // 요약만 표시
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-rose-500" />
                <h4 className="text-slate-900 font-semibold text-base">AI 요약</h4>
              </div>
              <p className="text-slate-900 text-sm leading-relaxed whitespace-pre-line">
                {generateSummary()}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 트렌드 인사이트 */}
            {selectedInsight && (
              <motion.div
              key={selectedInsight}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
                <div className="flex items-start gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                  <h4 className="text-slate-900 font-medium text-sm">트렌드 인사이트</h4>
                </div>
                <p className="text-slate-900 text-sm leading-relaxed pl-6">
              {selectedInsight}
                </p>
              </motion.div>
            )}

            {/* AI 분석 설명 */}
            {evidence && (
              <>
                <div className="border-t border-slate-200 pt-4">
                  <div className="flex items-start gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                    <h4 className="text-slate-900 font-medium text-sm">왜 {selectedBubbleItem ? '트렌드' : '꿀조합'}인가?</h4>
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed pl-6 mb-4">
                    {evidence.aiExplanation}
                  </p>
                </div>

                {/* 리뷰 추세 */}
                <div className="border-t border-slate-200 pt-4">
                  <div className="flex items-start gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                    <h4 className="text-slate-900 font-medium text-sm">리뷰 추세 요약</h4>
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed pl-6 mb-4">
                    {evidence.reviewTrend}
                  </p>
                  
                  {/* 주요 키워드 */}
                  {evidence.keywords && (
                    <div className="pl-6 mt-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Hash className="w-3 h-3 text-rose-500" />
                        <span className="text-xs text-slate-900 font-medium">주요 키워드</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {evidence.keywords.map((keyword, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 bg-rose-300 border border-rose-400 rounded-md text-xs text-slate-900 font-medium"
                          >
                            #{keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 함께 언급된 량 추세 그래프 (꿀조합 클릭 시) */}
                {selectedTrendItem && selectedTrendItem.signals && !selectedBubbleItem && (
                  <div className="border-t border-slate-200 pt-4">
                    <div className="flex items-center gap-2 mb-4">
                      <BarChart3 className="w-4 h-4 text-rose-500" />
                      <h4 className="text-slate-900 font-medium text-sm">함께 언급된 량 추세</h4>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 pl-6">
                      {selectedTrendItem.signals.map((signal) => {
                        const color = getChartColor(signal.type);
                        // 함께 언급된 량 데이터 생성 (기존 데이터를 함께 언급 횟수로 변환)
                        const coMentionData = signal.data.map((d, idx) => ({
                          ...d,
                          value: Math.floor(d.value * (0.6 + idx * 0.05)), // 함께 언급된 횟수로 변환
                        }));
                        const lastValue = coMentionData[coMentionData.length - 1]?.value || 0;
                        
                        return (
                          <div key={signal.type} className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <TrendingUp className="w-3 h-3 text-rose-500" />
                                <span className="text-xs text-slate-900 font-medium">{signal.type} 함께 언급</span>
                              </div>
                              <span className="text-xs text-slate-900 font-semibold">
                                {lastValue.toLocaleString()}건
                              </span>
                            </div>
                            <ResponsiveContainer width="100%" height={120}>
                              <LineChart data={coMentionData}>
                                <XAxis
                                  dataKey="name"
                                  tick={{ fontSize: 9, fill: '#1e293b', fontWeight: 'bold' }}
                                  axisLine={{ stroke: '#475569' }}
                                  tickLine={{ stroke: '#475569' }}
                                />
                                <YAxis
                                  tick={{ fontSize: 9, fill: '#1e293b', fontWeight: 'bold' }}
                                  axisLine={{ stroke: '#475569' }}
                                  tickLine={{ stroke: '#475569' }}
                                />
                                <Tooltip
                                  contentStyle={{
                                    backgroundColor: 'rgba(30, 41, 59, 0.95)',
                                    border: '1px solid rgba(225, 29, 72, 0.3)',
                                    borderRadius: '8px',
                                    color: '#ffffff'
                                  }}
                                  formatter={(value: any) => [`${value.toLocaleString()}건`, '함께 언급']}
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
                  </div>
                )}

                {/* 함께 조합된 제품 수치적 지표 및 예시 (꿀조합 클릭 시, 리더보드 항목 클릭 시 제외) */}
                {selectedTrendItem && !selectedBubbleItem && evidence?.numericalEvidence?.combinationProducts && (
                  <div className="border-t border-slate-200 pt-4">
                    <div className="flex items-center gap-2 mb-4">
                      <BarChart3 className="w-4 h-4 text-rose-500" />
                      <h4 className="text-slate-900 font-medium text-sm">함께 조합된 제품 지표</h4>
                    </div>
                    
                    <div className="pl-6 space-y-4">
                      {/* 함께 언급된 횟수 */}
                      {evidence.numericalEvidence.coMentionCount && (
                        <div className="bg-white/90 border border-slate-200/80 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-3 h-3 text-rose-500" />
                              <span className="text-xs text-slate-900 font-medium">함께 언급된 총 횟수</span>
                            </div>
                            <span className="text-lg text-slate-900 font-semibold">
                              {evidence.numericalEvidence.coMentionCount.toLocaleString()}건
                            </span>
                          </div>
                          <p className="text-xs text-slate-900 mt-2">
                            SNS와 리뷰에서 이 조합이 함께 언급된 총 횟수입니다.
                          </p>
                        </div>
                      )}

                      {/* 함께 조합된 제품 예시 */}
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                        <h5 className="text-sm text-slate-900 font-medium mb-3">함께 조합된 제품 예시</h5>
                        <div className="grid grid-cols-3 gap-3">
                          {evidence.numericalEvidence.combinationProducts?.map((product, idx) => (
                            <div key={idx} className="bg-white border border-slate-200 rounded-lg p-3">
                              {/* 제품 이미지 */}
                              <a 
                                href="https://doctorbio.kr/product/detail.html?product_no=189&gad_source=1&gad_campaignid=23332363891&gbraid=0AAAAApOHv7rRMZmDAcbmhfyCsCnA5AA10&gclid=CjwKCAiAmePKBhAfEiwAU3Ko3HxekBMNVs7mounwCIcot_c-H3f7inX7Tn1zzzfLMTJmhngpkcud9RoCLMMQAvD_BwE"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full h-24 bg-gradient-to-br from-rose-800/20 to-pink-800/20 rounded-lg mb-2 flex items-center justify-center border border-rose-700/30 overflow-hidden relative cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-rose-500/50 hover:border-rose-500 hover:z-10"
                              >
                                {product.imageUrl ? (
                                  <>
                                    <img 
                                      src={product.imageUrl} 
                                      alt={product.name}
                                      className="w-full h-full object-cover"
                                      loading="lazy"
                                      onError={(e) => {
                                        // 이미지 로드 실패 시 플레이스홀더 표시
                                        console.error('이미지 로드 실패:', product.imageUrl);
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        const parent = target.parentElement;
                                        if (parent) {
                                          const placeholder = parent.querySelector('.image-placeholder');
                                          if (placeholder) {
                                            placeholder.classList.remove('hidden');
                                          }
                                        }
                                      }}
                                      onLoad={() => {
                                        // 이미지 로드 성공 시 플레이스홀더 숨기기
                                        const img = document.querySelector(`img[alt="${product.name}"]`) as HTMLImageElement;
                                        if (img) {
                                          const parent = img.parentElement;
                                          if (parent) {
                                            const placeholder = parent.querySelector('.image-placeholder');
                                            if (placeholder) {
                                              placeholder.classList.add('hidden');
                                            }
                                          }
                                        }
                                      }}
                                    />
                                    <div className="image-placeholder absolute inset-0 flex items-center justify-center bg-gradient-to-br from-rose-800/20 to-pink-800/20 hidden">
                                      <span className="text-xs text-rose-300/50">제품 이미지</span>
                                    </div>
                                  </>
                                ) : (
                                  <span className="text-xs text-rose-300/50">제품 이미지</span>
                                )}
                              </a>
                              <div className="text-xs text-slate-900 font-medium mb-1">{product.name}</div>
                              <div className="text-xs text-slate-900 mb-1">{product.brand}</div>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-slate-900">
                                  언급: {product.mentionCount.toLocaleString()}건
                                </span>
                                {product.rating && (
                                  <span className="text-xs text-rose-600">
                                    ⭐ {product.rating.toFixed(1)}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SNS/Retail/Review 추세 그래프 (핵심 키워드 리더보드 항목 클릭 시) */}
                {selectedBubbleItem && (
                  <div className="border-t border-slate-200 pt-4">
                    <div className="flex items-center gap-2 mb-4">
                      <BarChart3 className="w-4 h-4 text-rose-500" />
                      <h4 className="text-slate-900 font-medium text-sm">SNS/Retail/Review 추세</h4>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 pl-6">
                      {['SNS', 'Retail', 'Review'].map((type) => {
                        const color = getChartColor(type);
                        // 동적으로 signals 데이터 생성
                        const baseValue = selectedBubbleItem.value;
                        const signalData = [
                          { name: '2개월 전', value: Math.floor(baseValue * 0.7) },
                          { name: '1개월 전', value: Math.floor(baseValue * 0.85) },
                          { name: '현재', value: baseValue },
                        ];
                        
                        return (
                          <div key={type} className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <TrendingUp className="w-3 h-3 text-rose-500" />
                                <span className="text-xs text-slate-900 font-medium">{type}</span>
                              </div>
                              <span className="text-xs text-slate-900 font-semibold">
                                {baseValue}%
                              </span>
                            </div>
                            <ResponsiveContainer width="100%" height={120}>
                              <LineChart data={signalData}>
                                <XAxis
                                  dataKey="name"
                                  tick={{ fontSize: 9, fill: '#1e293b', fontWeight: 'bold' }}
                                  axisLine={{ stroke: '#475569' }}
                                  tickLine={{ stroke: '#475569' }}
                                />
                                <YAxis
                                  tick={{ fontSize: 9, fill: '#1e293b', fontWeight: 'bold' }}
                                  axisLine={{ stroke: '#475569' }}
                                  tickLine={{ stroke: '#475569' }}
                                  domain={[0, 100]}
                                />
                                <Tooltip
                                  contentStyle={{
                                    backgroundColor: 'rgba(30, 41, 59, 0.95)',
                                    border: '1px solid rgba(225, 29, 72, 0.3)',
                                    borderRadius: '8px',
                                    color: '#ffffff'
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
                  </div>
                )}

                {/* 6개월~1년 트렌드 추세 예측 그래프 */}
                {selectedBubbleItem && (
                  <div className="border-t border-slate-200 pt-4">
                    <div className="flex items-center gap-2 mb-4">
                      <BarChart3 className="w-4 h-4 text-rose-500" />
                      <h4 className="text-slate-900 font-medium text-sm">6개월~1년 트렌드 추세 예측</h4>
                    </div>
                    
                    <div className="pl-6 space-y-4">
                      {/* 예측 그래프 */}
                      <div className="bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-rose-500" />
                            <span className="text-sm text-slate-900 font-semibold">장기 트렌드 예측</span>
                          </div>
                          <span className="text-xs text-slate-600 font-medium">6개월~1년 전망</span>
                        </div>
                        <ResponsiveContainer width="100%" height={200}>
                          <LineChart data={(() => {
                            const baseValue = selectedBubbleItem.value;
                            const months = ['현재', '1개월 후', '2개월 후', '3개월 후', '6개월 후', '9개월 후', '1년 후'];
                            return months.map((month, idx) => {
                              // 점진적 성장 또는 안정화 추세
                              const growthFactor = idx < 3 ? 1.05 + idx * 0.02 : idx < 5 ? 1.1 + (idx - 3) * 0.01 : 1.12;
                              const randomVariation = (Math.random() - 0.5) * 5; // ±2.5% 변동
                              return {
                                name: month,
                                value: Math.min(100, Math.max(0, baseValue * growthFactor + randomVariation)),
                                prediction: baseValue * growthFactor,
                              };
                            });
                          })()}>
                            <XAxis
                              dataKey="name"
                              tick={{ fontSize: 10, fill: '#1e293b', fontWeight: 'bold' }}
                              axisLine={{ stroke: '#475569' }}
                              tickLine={{ stroke: '#475569' }}
                            />
                            <YAxis
                              tick={{ fontSize: 10, fill: '#1e293b', fontWeight: 'bold' }}
                              axisLine={{ stroke: '#475569' }}
                              tickLine={{ stroke: '#475569' }}
                              domain={[0, 100]}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: 'rgba(30, 41, 59, 0.95)',
                                border: '1px solid rgba(225, 29, 72, 0.3)',
                                borderRadius: '8px',
                                color: '#ffffff'
                              }}
                              formatter={(value: any) => [`${value.toFixed(1)}%`, '예측값']}
                            />
                            <Line
                              type="monotone"
                              dataKey="value"
                              stroke="#f43f5e"
                              strokeWidth={3}
                              dot={{ fill: '#f43f5e', r: 4 }}
                              activeDot={{ r: 6 }}
                              strokeDasharray="5 5"
                            />
                            <Line
                              type="monotone"
                              dataKey="prediction"
                              stroke="#ec4899"
                              strokeWidth={2}
                              dot={{ fill: '#ec4899', r: 3 }}
                              strokeDasharray="3 3"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                        <div className="mt-3 flex items-center gap-4 text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-0.5 bg-rose-500"></div>
                            <span className="text-slate-700">예측 추세선</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-0.5 bg-pink-500 border-dashed"></div>
                            <span className="text-slate-700">변동 범위</span>
                          </div>
                        </div>
                      </div>

                      {/* 추세 설명 */}
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                        <h5 className="text-sm font-semibold text-slate-900 mb-2">앞으로의 추세 분석</h5>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          {selectedBubbleItem.name}의 향후 6개월~1년 트렌드를 분석한 결과, 현재 상승세가 지속될 것으로 예상됩니다. 
                          특히 향후 3개월 내에는 {Math.floor(selectedBubbleItem.value * 1.1)}% 수준까지 성장할 것으로 전망되며, 
                          6개월 후에는 {Math.floor(selectedBubbleItem.value * 1.12)}% 수준으로 안정화될 것으로 예측됩니다. 
                          이는 SNS 언급량 증가, 리테일 판매량 상승, 긍정적 리뷰 비율 확대 등 여러 지표가 동반 상승하고 있기 때문입니다. 
                          다만 시장 포화도가 높아질 경우 성장률이 둔화될 수 있으므로, 지속적인 모니터링이 필요합니다.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 수치적 근거 시각화 (리더보드 항목일 때) */}
                {chartData && selectedBubbleItem && (
                  <div className="border-t border-slate-200 pt-4">
                    <div className="flex items-center gap-2 mb-4">
                      <BarChart3 className="w-4 h-4 text-rose-500" />
                      <h4 className="text-slate-900 font-medium text-sm">수치적 근거 시각화</h4>
                    </div>
                    
                    <div className="space-y-4 pl-6">
                      {/* SNS 언급 상승률 */}
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-3 h-3 text-rose-500" />
                            <span className="text-xs text-slate-900 font-medium">SNS 언급 상승률</span>
                          </div>
                          <span className="text-xs text-slate-900 font-semibold">
                            +{evidence.numericalEvidence.growthRate}%
                          </span>
                        </div>
                        <ResponsiveContainer width="100%" height={120}>
                          <LineChart data={chartData.mentionGrowth}>
                            <XAxis dataKey="period" tick={{ fontSize: 10, fill: '#1e293b', fontWeight: 'bold' }} />
                            <YAxis tick={{ fontSize: 10, fill: '#1e293b', fontWeight: 'bold' }} />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'rgba(30, 41, 59, 0.95)', 
                                border: '1px solid rgba(225, 29, 72, 0.3)',
                                borderRadius: '8px',
                                color: '#f1f5f9'
                              }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="value" 
                              stroke="#f43f5e" 
                              strokeWidth={2}
                              dot={{ fill: '#f43f5e', r: 4 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                        <div className="mt-2 text-center">
                          <span className="text-xs text-slate-600">
                            현재: {evidence.numericalEvidence.snsMentions.toLocaleString()}건
                          </span>
                        </div>
                      </div>

                      {/* 리뷰 개수 성장률 */}
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="w-3 h-3 text-rose-500" />
                            <span className="text-xs text-slate-900 font-medium">리뷰 개수 성장률</span>
                          </div>
                          <span className="text-xs text-slate-900 font-semibold">
                            +{evidence.numericalEvidence.growthRate}%
                          </span>
                        </div>
                        <ResponsiveContainer width="100%" height={120}>
                          <BarChart data={chartData.reviewGrowth}>
                            <XAxis dataKey="period" tick={{ fontSize: 10, fill: '#1e293b', fontWeight: 'bold' }} />
                            <YAxis tick={{ fontSize: 10, fill: '#1e293b', fontWeight: 'bold' }} />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'rgba(30, 41, 59, 0.95)', 
                                border: '1px solid rgba(225, 29, 72, 0.3)',
                                borderRadius: '8px',
                                color: '#f1f5f9'
                              }}
                            />
                            <Bar dataKey="value" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                        <div className="mt-2 text-center">
                          <span className="text-xs text-slate-600">
                            현재: {evidence.numericalEvidence.reviewCount.toLocaleString()}건
                          </span>
                        </div>
                      </div>

                      {/* 시장 점유율 */}
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <BarChart3 className="w-3 h-3 text-rose-500" />
                            <span className="text-xs text-slate-900 font-medium">시장 점유율</span>
                          </div>
                          <span className="text-xs text-slate-900 font-semibold">
                            {evidence.numericalEvidence.marketShare}%
                          </span>
                        </div>
                        <ResponsiveContainer width="100%" height={120}>
                          <BarChart data={chartData.marketShare} layout="vertical">
                            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#1e293b', fontWeight: 'bold' }} />
                            <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#1e293b', fontWeight: 'bold' }} />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'rgba(30, 41, 59, 0.95)', 
                                border: '1px solid rgba(225, 29, 72, 0.3)',
                                borderRadius: '8px',
                                color: '#f1f5f9'
                              }}
                            />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                              {chartData.marketShare.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? '#f43f5e' : '#475569'} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                )}

                {/* 행동 강령/활용 방안 */}
                {evidence.actionPlan && (
                  <div className="border-t border-slate-200 pt-4">
                    <div className="flex items-start gap-2 mb-2">
                      <Target className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                      <h4 className="text-slate-900 font-medium text-sm">활용 방안 및 행동 강령</h4>
                    </div>
                    <div className="pl-6">
                      <p className="text-slate-900 text-sm leading-relaxed whitespace-pre-line">
                        {evidence.actionPlan}
                      </p>
                    </div>
                  </div>
                )}
              </>
          )}
        </div>
        )}
      </motion.div>

      {/* 보고서 생성 버튼 */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onOpenModal}
        className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-500/30"
      >
        <Sparkles className="w-5 h-5" />
        <span>✨ AI 맞춤형 인사이트 제공</span>
      </motion.button>
    </div>
  );
}
