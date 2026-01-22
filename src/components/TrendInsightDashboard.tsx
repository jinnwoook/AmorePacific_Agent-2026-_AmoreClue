import { useState, useEffect, useRef } from 'react';
import { singleKeywordData, reportResults, ReportResult, snsTopIngredients, trendMetrics, TrendMetric, Country, countryThemes, BubbleItem, TrendItem, generateReport } from '../data/mockData';
import { getSNSTopKeywordsByCountry } from '../data/leaderboardData';
import { getCountryTrendData as getCountryData, getCountryBubbleData as getCountryBubble } from '../data/countryData';
import TrendCard from './TrendCard';
import InsightPanel from './InsightPanel';
import TrendVisualization from './TrendVisualization';
import SegmentedLeaderboard from './SegmentedLeaderboard';
import ReportModal from './ReportModal';
import ReportViewModal from './ReportViewModal';
import SNSTopChart from './SNSTopChart';
import TrendMetrics from './TrendMetrics';
import InfoTooltip from './InfoTooltip';
import ReviewKeywordsPanel from './ReviewKeywordsPanel';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Loader2, Sparkles } from 'lucide-react';

type TabType = 'single' | 'combination';

export default function TrendInsightDashboard() {
  const [country, setCountry] = useState<Country>('usa');
  const [activeTab, setActiveTab] = useState<TabType>('combination');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);
  const [selectedTrendMetrics, setSelectedTrendMetrics] = useState<TrendMetric[] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportResult, setReportResult] = useState<ReportResult | null>(null);
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);
  const [selectedBubbleItem, setSelectedBubbleItem] = useState<BubbleItem | null>(null);
  const [selectedTrendItem, setSelectedTrendItem] = useState<TrendItem | null>(null);
  const [selectedBubbleItemRank, setSelectedBubbleItemRank] = useState<number | undefined>(undefined);
  const [selectedBubbleItemType, setSelectedBubbleItemType] = useState<'ingredient' | 'formula' | 'effect' | 'combined' | undefined>(undefined);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
    };

    if (isCountryDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCountryDropdownOpen]);

  const isOverseas = true; // 항상 해외 모드
  const theme = countryThemes[country];
  
  // 국가별 데이터 가져오기
  const currentTrendData = getCountryData(country);
  const currentBubbleData = getCountryBubble(country);
  const currentData = activeTab === 'single' ? singleKeywordData : currentTrendData;

  const handleToggle = (index: number) => {
    const newExpandedIndex = expandedIndex === index ? null : index;
    setExpandedIndex(newExpandedIndex);
    
    // 선택된 아이템의 인사이트 텍스트 및 지표 업데이트
    if (newExpandedIndex !== null) {
      const selectedItem = currentData[newExpandedIndex];
      setSelectedInsight(selectedItem.insightText);
      setSelectedTrendMetrics(selectedItem.metrics || null);
    } else {
      setSelectedInsight(null);
      setSelectedTrendMetrics(null);
    }
  };

  const handleReportSelect = (type: 'marketing' | 'npd' | 'overseas') => {
    // 로딩 시작
    setIsGeneratingInsight(true);
    
    // 시뮬레이션: 약간의 딜레이 후 결과 표시
    setTimeout(() => {
      const report = generateReport(type, selectedBubbleItem, country);
      setReportResult(report);
      setIsGeneratingInsight(false);
      setIsReportModalOpen(true);
    }, 2000);
  };

  // 국가별 배경 색상 (화장품 회사 스타일 - 부드러운 파스텔 톤)
  const getCountryBgGradient = () => {
    const bgColors: Record<Country, { base: string; gradient: string; radial: string }> = {
      domestic: { 
        base: 'bg-rose-50', // 부드러운 분홍 파스텔
        gradient: 'from-rose-50 via-pink-50/80 to-rose-50', 
        radial: 'rgba(251, 207, 232, 0.3)' // 분홍 톤
      },
      usa: { 
        base: 'bg-blue-50', // 부드러운 파란 파스텔
        gradient: 'from-blue-50 via-indigo-50/80 to-blue-50', 
        radial: 'rgba(219, 234, 254, 0.3)' // 파란 톤
      },
      japan: { 
        base: 'bg-amber-50', // 부드러운 베이지/크림 파스텔
        gradient: 'from-amber-50 via-yellow-50/80 to-amber-50', 
        radial: 'rgba(254, 243, 199, 0.3)' // 베이지 톤
      },
      singapore: { 
        base: 'bg-emerald-50', // 부드러운 민트 파스텔
        gradient: 'from-emerald-50 via-teal-50/80 to-emerald-50', 
        radial: 'rgba(209, 250, 229, 0.3)' // 민트 톤
      },
      malaysia: { 
        base: 'bg-orange-50', // 부드러운 코랄 파스텔
        gradient: 'from-orange-50 via-rose-50/80 to-orange-50', 
        radial: 'rgba(255, 237, 213, 0.3)' // 코랄 톤
      },
      indonesia: { 
        base: 'bg-purple-50', // 부드러운 라벤더 파스텔
        gradient: 'from-purple-50 via-violet-50/80 to-purple-50', 
        radial: 'rgba(243, 232, 255, 0.3)' // 라벤더 톤
      },
    };
    return bgColors[country];
  };

  const bgStyle = getCountryBgGradient();

  return (
    <div className={`h-screen ${bgStyle.base} relative overflow-hidden flex flex-col transition-all duration-500`}>
      {/* 배경 그라데이션 효과 - 국가별 파스텔 톤 */}
      <div className={`fixed inset-0 bg-gradient-to-br ${bgStyle.gradient} pointer-events-none transition-all duration-500`} />
      <div className={`fixed inset-0 bg-[radial-gradient(circle_at_30%_20%,${bgStyle.radial},transparent_70%)] pointer-events-none transition-all duration-500`} />
      
      <div className="flex-1 flex flex-col p-4 gap-4 relative z-10 overflow-hidden">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-shrink-0"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <img 
                src="/images/amore_clue.jpg" 
                alt="AMORE CLUE Logo" 
                className="w-12 h-12 object-contain rounded-lg"
              />
              <div>
                <h1 className={`text-3xl font-bold mb-1 bg-clip-text text-transparent transition-all duration-500 flex items-center gap-2 ${
                  isOverseas 
                    ? `bg-gradient-to-r ${theme.gradient}` 
                    : 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600'
                }`}>
                  <span>✨</span>
                  <span>AMORE CLUE</span>
                  <span>✨</span>
                </h1>
                <p className="text-sm text-slate-600">
                  화장품 산업 트렌드 분석 대시보드
                </p>
              </div>
            </div>
            
            {/* 국가 선택 드롭박스 */}
            <div className="relative" ref={countryDropdownRef}>
              <span className="text-sm text-slate-600 mr-2">국가 선택:</span>
              <div className="relative inline-block">
                <button
                  onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 bg-gradient-to-r ${countryThemes[country].gradient} text-white shadow-md hover:shadow-lg`}
                >
                  <span>{countryThemes[country].flag}</span>
                  <span>{countryThemes[country].name}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isCountryDropdownOpen && (
                  <div className="absolute top-full mt-2 right-0 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg shadow-xl z-50 min-w-[160px]">
                    {(['usa', 'japan', 'singapore', 'malaysia', 'indonesia'] as Country[]).map((c) => {
                      const countryTheme = countryThemes[c];
                      return (
                        <button
                          key={c}
                          onClick={() => {
                            setCountry(c);
                            setExpandedIndex(null);
                            setSelectedInsight(null);
                            setSelectedTrendMetrics(null);
                            setSelectedBubbleItem(null);
                            setIsCountryDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-2.5 text-sm font-medium transition-all flex items-center gap-2 hover:bg-slate-100 ${
                            country === c
                              ? `bg-gradient-to-r ${countryTheme.gradient} text-white`
                              : 'text-slate-700'
                          } ${c === 'usa' ? 'rounded-t-lg' : ''} ${c === 'indonesia' ? 'rounded-b-lg' : ''}`}
                        >
                          <span>{countryTheme.flag}</span>
                          <span>{countryTheme.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
        
        <div className="flex-1 flex gap-4 overflow-hidden min-h-0">
          {/* 좌측 패널: 트렌드 발견 (70%) */}
          <div className="flex-1 flex flex-col min-w-0" style={{ width: '70%' }}>
            <div className="flex-1 backdrop-blur-sm rounded-xl p-4 shadow-xl flex flex-col overflow-y-auto transition-all duration-500 bg-white/80 border border-slate-200">
              {/* 탭 전환 */}
              <div className="flex gap-2 mb-4 flex-shrink-0">
                <button
                  onClick={() => {
                    setActiveTab('single');
                    setExpandedIndex(null);
                    setSelectedInsight(null);
                    setSelectedTrendMetrics(null);
                  }}
                  className={`px-5 py-2 rounded-lg font-medium transition-all text-sm ${
                    activeTab === 'single'
                      ? `bg-gradient-to-r ${theme.gradient} text-white shadow-lg`
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                  }`}
                >
                  🔥 핵심 키워드 (Single)
                </button>
                <button
                  onClick={() => {
                    setActiveTab('combination');
                    setExpandedIndex(null);
                    setSelectedInsight(null);
                    setSelectedTrendMetrics(null);
                  }}
                  className={`px-5 py-2 rounded-lg font-medium transition-all text-sm ${
                    activeTab === 'combination'
                      ? `bg-gradient-to-r ${theme.gradient} text-white shadow-lg`
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                  }`}
                >
                  🧩 꿀조합 (Combination)
                </button>
              </div>

              {/* 메인 콘텐츠 영역 */}
              <div className="grid grid-cols-12 gap-4">
                {/* 리더보드 (5/12) */}
                <div className="col-span-5 flex flex-col min-w-0">
                  {activeTab === 'single' ? (
                    <SegmentedLeaderboard 
                      data={currentBubbleData} 
                      region={country === 'domestic' ? 'domestic' : 'overseas'}
                      country={country}
                      onSelectItem={(item, rank, type) => {
                        setSelectedBubbleItem(item);
                        setSelectedBubbleItemRank(rank);
                        setSelectedBubbleItemType(type);
                        setSelectedTrendItem(null); // 꿀조합에서 리더보드 항목 클릭 시 꿀조합 선택 해제
                        setExpandedIndex(null);
                        setSelectedInsight(null);
                        setSelectedTrendMetrics(null);
                      }}
                    />
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mb-3 flex-shrink-0">
                        <h2 className="text-lg font-semibold text-slate-800">꿀조합 리더보드</h2>
                        <InfoTooltip
                          title="꿀조합 가이드"
                          description="여러 성분, 제형, 기능이 조합된 트렌드를 보여줍니다. 각 조합이 왜 효과적인지 SNS, 리테일, 리뷰 데이터로 검증된 트렌드입니다."
                          usage="기획팀: 신제품 개발 시 참고 / 마케팅팀: 캠페인 메시지 개발 / R&D: 성분 조합 연구"
                          terms={[
                            { term: '🌱 Early Trend', meaning: 'SNS 중심으로 초기 관심 신호가 관찰되는 단계 (구매·리뷰 데이터는 제한적)' },
                            { term: '📈 Growing Trend', meaning: 'SNS 관심 증가와 함께 구매 지표가 동반 상승하는 단계 (Action 가능성 검토 구간)' },
                            { term: '🚀 Actionable Trend', meaning: '관심·구매·리뷰 지표가 모두 정합성을 보이며 실무 의사결정에 즉시 활용 가능한 단계' },
                            { term: '📉 Cooling', meaning: '하락세인 트렌드 - 인기가 감소하고 있는 트렌드' },
                            { term: '🚀 Actionable Trend', meaning: '즉시 활용 가능한 검증된 트렌드' },
                            { term: '🌱 Early Signal', meaning: '초기 단계의 유망 트렌드' },
                          ]}
                        />
                      </div>
                      <div className="space-y-0">
                        {currentData.map((item, index) => (
                          <TrendCard
                            key={`${activeTab}-${item.rank}`}
                            item={item}
                            isExpanded={expandedIndex === index}
                            onToggle={() => {
                              // 드롭다운 제거로 인해 onToggle은 사용하지 않음
                            }}
                            onClick={() => {
                              setSelectedTrendItem(item);
                              setSelectedBubbleItem(null);
                              setSelectedBubbleItemRank(undefined);
                              setSelectedBubbleItemType(undefined);
                              setExpandedIndex(null); // 확장 상태 초기화
                            }}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* 리뷰 키워드 패널 (3/12) */}
                <div className="col-span-3 flex flex-col min-w-0">
                  <ReviewKeywordsPanel
                    keywords={selectedBubbleItem?.reviewKeywords || selectedTrendItem?.reviewKeywords || null}
                    itemName={selectedBubbleItem?.name || selectedTrendItem?.combination || ''}
                    isCombination={!!selectedTrendItem}
                  />
                </div>

                {/* SNS Top Chart & Metrics (4/12) */}
                <div className="col-span-4 flex flex-col gap-3 min-w-0">
                  <div className="flex-shrink-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-base font-semibold text-slate-800">SNS 플랫폼별 Top 성분, 제형, 효과</h3>
                      <InfoTooltip
                        title="SNS 차트 가이드"
                        description="국가별 주요 SNS 플랫폼에서 인기 키워드(성분, 제형, 효과) Top 5를 보여줍니다."
                        usage="플랫폼별 타겟 고객층 파악 / 채널별 마케팅 전략 수립 / 키워드별 SNS 트렌드 비교"
                      />
                    </div>
                    <SNSTopChart data={getSNSTopKeywordsByCountry(country)} country={country} />
                  </div>
                  <div className="flex flex-col border-t border-slate-200 pt-3">
                    <div className="flex items-center gap-2 mb-2 flex-shrink-0">
                      <h3 className="text-base font-semibold text-slate-800">
                        {selectedTrendMetrics ? '선택한 트렌드 지표' : '전체 시장 지표'}
                      </h3>
                      <InfoTooltip
                        title="트렌드 지표 가이드"
                        description="트렌드를 선택하면 해당 트렌드의 상세 지표가 표시됩니다. 선택하지 않으면 전체 시장 지표가 표시됩니다."
                        usage="트렌드 클릭: 해당 트렌드 지표 확인 / 미선택: 전체 시장 동향 파악"
                      />
                    </div>
                    <div>
                      <TrendMetrics metrics={selectedTrendMetrics || trendMetrics} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 우측 패널: AI 근거 (30%) */}
          <div className="flex-shrink-0 flex flex-col min-w-0" style={{ width: '30%' }}>
            <InsightPanel
              selectedInsight={selectedInsight}
              selectedBubbleItem={selectedBubbleItem}
              selectedTrendItem={selectedTrendItem}
              selectedBubbleItemRank={selectedBubbleItemRank}
              selectedBubbleItemType={selectedBubbleItemType}
              onOpenModal={() => setIsModalOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* 보고서 생성 모달 */}
      <ReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleReportSelect}
      />
      
      {/* AI 인사이트 생성 중 로딩 모달 */}
      <AnimatePresence>
        {isGeneratingInsight && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            />
            
            {/* Loading Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-gradient-to-br from-rose-950/95 to-pink-950/95 backdrop-blur-xl border border-rose-800/50 rounded-2xl p-12 max-w-md w-full shadow-2xl text-center">
                <div className="flex flex-col items-center justify-center gap-6">
                  <div className="relative">
                    <Loader2 className="w-16 h-16 text-rose-400 animate-spin" />
                    <Sparkles className="w-8 h-8 text-pink-400 absolute -top-2 -right-2 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      AI 인사이트 생성 중
                    </h3>
                    <p className="text-slate-400 text-sm">
                      선택하신 목적에 맞는 맞춤형 인사이트를 생성하고 있습니다...
                    </p>
                  </div>
                  <div className="flex gap-2 mt-4 justify-center">
                    <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 보고서 표시 모달 */}
      <ReportViewModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        reportResult={reportResult}
      />
    </div>
  );
}

