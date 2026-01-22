import { motion } from 'framer-motion';
import { ReviewKeywords } from '../data/mockData';
import { ThumbsUp, ThumbsDown, TrendingUp, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';

interface ReviewKeywordsPanelProps {
  keywords: ReviewKeywords | null;
  itemName: string;
  isCombination?: boolean; // 꿀조합인지 여부
}

export default function ReviewKeywordsPanel({ keywords, itemName, isCombination = false }: ReviewKeywordsPanelProps) {
  if (!keywords) {
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-slate-200/80 rounded-xl p-6 shadow-xl">
        <p className="text-slate-900 italic text-sm text-center">
          리더보드 항목을 클릭하여 리뷰 키워드를 확인하세요
        </p>
      </div>
    );
  }

  // 꿀조합일 때는 다른 키워드 표시
  const displayKeywords = isCombination ? {
    positive: [
      { keyword: '완벽한 조합', count: Math.floor(keywords.positive[0]?.count || 100) * 1.2 },
      { keyword: '시너지 효과', count: Math.floor(keywords.positive[0]?.count || 100) * 1.1 },
      { keyword: '함께 사용 추천', count: Math.floor(keywords.positive[0]?.count || 100) * 0.9 },
      { keyword: '조합 만족도', count: Math.floor(keywords.positive[0]?.count || 100) * 0.8 },
      { keyword: '효과 배가', count: Math.floor(keywords.positive[0]?.count || 100) * 0.7 },
      { keyword: '상호 보완', count: Math.floor(keywords.positive[0]?.count || 100) * 0.6 },
      { keyword: '조합 완성도', count: Math.floor(keywords.positive[0]?.count || 100) * 0.5 },
    ],
    negative: [
      { keyword: '조합 부적합', count: Math.floor(keywords.negative[0]?.count || 20) * 1.1 },
      { keyword: '효과 중복', count: Math.floor(keywords.negative[0]?.count || 20) * 0.9 },
      { keyword: '사용법 복잡', count: Math.floor(keywords.negative[0]?.count || 20) * 0.8 },
      { keyword: '가격 부담', count: Math.floor(keywords.negative[0]?.count || 20) * 0.7 },
      { keyword: '효과 미미', count: Math.floor(keywords.negative[0]?.count || 20) * 0.6 },
    ]
  } : keywords;

  // 차트 데이터 준비
  const positiveData = displayKeywords.positive
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .map(item => ({ keyword: item.keyword, count: item.count, type: 'positive' }));

  const negativeData = displayKeywords.negative
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .map(item => ({ keyword: item.keyword, count: item.count, type: 'negative' }));

  // AI 분석 요약 생성 (다양한 변형)
  const generateAISummary = () => {
    const topPositive = displayKeywords.positive.slice(0, 3).map(k => k.keyword);
    const topNegative = displayKeywords.negative.slice(0, 3).map(k => k.keyword);
    const positiveTotal = displayKeywords.positive.reduce((sum, k) => sum + k.count, 0);
    const negativeTotal = displayKeywords.negative.reduce((sum, k) => sum + k.count, 0);
    const sentimentRatio = positiveTotal / (positiveTotal + negativeTotal);
    
    // 항목 이름 기반으로 다양한 변형 선택
    const hash = itemName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const variantIndex = hash % 3; // 3가지 변형 중 선택
    
    let summary = '';
    let insights = [];
    
    if (isCombination) {
      const summaries = [
        [
          `${itemName} 조합에 대한 소비자 리뷰를 종합 분석한 결과, "${topPositive[0]}" 키워드가 ${Math.round(positiveTotal / (positiveTotal + negativeTotal) * 100)}%의 높은 비율로 언급되었습니다. `,
          `특히 "${topPositive[1]}"와 "${topPositive[2]}" 피드백이 함께 나타나며, 조합의 시너지 효과에 대한 긍정적 인식이 두드러집니다. `,
        ],
        [
          `리뷰 데이터 분석 결과, ${itemName} 조합에서 "${topPositive.join('", "')}" 등의 긍정적 평가가 주를 이루고 있습니다. `,
          `소비자들은 조합 사용 후 체감 효과와 만족도에 대해 높은 점수를 주었으며, 재구매 의향도 상당히 높게 나타났습니다. `,
        ],
        [
          `${itemName}에 대한 ${displayKeywords.positive.length}개 긍정 키워드와 ${displayKeywords.negative.length}개 부정 키워드를 비교 분석한 결과, `,
          `긍정적 피드백이 압도적으로 우세하며, "${topPositive[0]}" 관련 언급이 전체의 ${Math.round((displayKeywords.positive[0]?.count || 0) / positiveTotal * 100)}%를 차지하고 있습니다. `,
        ],
      ];
      
      const insightsList = [
        [
          sentimentRatio > 0.7 ? ['시너지 효과 인식', '높은 조합 만족도', '재구매 의향 강함'] :
          sentimentRatio > 0.5 ? ['전반적 긍정 평가', '일부 개선 여지', '시너지 기대'] :
          ['조합 최적화 필요', '사용자 피드백 반영', '효과 검증 필요'],
        ],
        [
          sentimentRatio > 0.7 ? ['효과 배가 인식', '조합 완성도 높음', '추천 의향 강함'] :
          sentimentRatio > 0.5 ? ['긍정적 경향', '개선 포인트 존재', '잠재력 확인'] :
          ['사용법 개선 필요', '효과 검증 필요', '조합 재검토'],
        ],
        [
          sentimentRatio > 0.7 ? ['우수한 조합 평가', '높은 신뢰도', '시장 반응 긍정'] :
          sentimentRatio > 0.5 ? ['안정적 평가', '부분적 개선', '지속 관찰 필요'] :
          ['피드백 분석 필요', '조합 재구성 검토', '사용자 경험 개선'],
        ],
      ];
      
      summary = summaries[variantIndex][0] + summaries[variantIndex][1];
      insights = insightsList[variantIndex][sentimentRatio > 0.7 ? 0 : sentimentRatio > 0.5 ? 1 : 2];
      
      if (sentimentRatio <= 0.5) {
        summary += `다만 "${topNegative.join('", "')}" 등의 부정적 피드백도 일부 존재하여, 이 부분에 대한 개선이 필요할 것으로 보입니다. `;
      }
    } else {
      const summaries = [
        [
          `${itemName}에 대한 리뷰 키워드 분석 결과, 소비자들은 주로 "${topPositive.join('", "')}" 등의 긍정적 피드백을 보였습니다. `,
          sentimentRatio > 0.7 
            ? `전반적인 만족도가 매우 높으며, 효과와 사용감에 대한 긍정적 평가가 두드러집니다. 특히 ${topPositive[0]} 관련 언급이 전체 긍정 리뷰의 ${Math.round((displayKeywords.positive[0]?.count || 0) / positiveTotal * 100)}%를 차지하고 있습니다. `
            : sentimentRatio > 0.5
            ? `긍정적 평가가 부정적 평가보다 우세하나, "${topNegative.join('", "')}" 등의 피드백도 일부 존재합니다. `
            : `부정적 피드백이 상대적으로 높게 나타나며, "${topNegative.join('", "')}" 등의 이슈가 주요 관심사입니다. `,
        ],
        [
          `리뷰 데이터를 종합 분석한 결과, ${itemName}에 대한 소비자 인식은 전반적으로 `,
          sentimentRatio > 0.7 
            ? `매우 긍정적인 것으로 나타났습니다. "${topPositive[0]}" 키워드가 ${displayKeywords.positive[0]?.count || 0}건 언급되어 가장 높은 비중을 차지했으며, 효과에 대한 만족도가 특히 높게 나타났습니다. `
            : sentimentRatio > 0.5
            ? `긍정적인 편입니다. 다만 "${topNegative[0]}" 관련 피드백도 ${displayKeywords.negative[0]?.count || 0}건 확인되어, 이 부분에 대한 개선이 필요할 수 있습니다. `
            : `개선이 필요한 것으로 보입니다. "${topNegative.join('", "')}" 등의 부정적 키워드가 상대적으로 높은 비율을 차지하고 있어 주의가 필요합니다. `,
        ],
        [
          `${itemName}의 리뷰 키워드 패턴을 분석한 결과, `,
          sentimentRatio > 0.7 
            ? `긍정적 평가가 압도적으로 우세합니다. "${topPositive[0]}"와 "${topPositive[1]}" 키워드가 함께 자주 언급되며, 소비자 만족도가 매우 높은 것으로 나타났습니다. `
            : sentimentRatio > 0.5
            ? `긍정적 평가가 다수를 차지하지만, "${topNegative[0]}" 관련 피드백도 일정 비율로 존재합니다. 전반적으로는 긍정적이지만 개선 여지가 있는 것으로 분석됩니다. `
            : `부정적 피드백의 비중이 상대적으로 높게 나타났습니다. "${topNegative.join('", "')}" 등의 이슈가 주요 관심사로 부각되고 있어, 이에 대한 대응이 필요할 것으로 보입니다. `,
        ],
      ];
      
      const insightsList = [
        [
          sentimentRatio > 0.7 ? ['높은 소비자 만족도', '효과에 대한 긍정적 인식', '재구매 의향 강함'] :
          sentimentRatio > 0.5 ? ['전반적으로 긍정적 평가', '일부 개선 필요 영역 존재', '안정적 트렌드'] :
          ['개선이 필요한 항목', '사용자 경험 최적화 필요', '피드백 반영 필요'],
        ],
        [
          sentimentRatio > 0.7 ? ['우수한 제품 평가', '높은 신뢰도', '시장 반응 긍정'] :
          sentimentRatio > 0.5 ? ['긍정적 경향 유지', '부분적 개선 여지', '지속 관찰 필요'] :
          ['피드백 분석 필요', '제품 개선 검토', '사용자 니즈 재확인'],
        ],
        [
          sentimentRatio > 0.7 ? ['강력한 긍정 신호', '시장 선호도 높음', '브랜드 신뢰도 상승'] :
          sentimentRatio > 0.5 ? ['안정적 시장 반응', '개선 포인트 확인', '잠재력 인정'] :
          ['시장 반응 주의', '제품 재검토 필요', '사용자 피드백 집중 분석'],
        ],
      ];
      
      summary = summaries[variantIndex][0] + summaries[variantIndex][1];
      insights = insightsList[variantIndex][sentimentRatio > 0.7 ? 0 : sentimentRatio > 0.5 ? 1 : 2];
    }
    
    summary += `주요 인사이트로는 ${insights.join(', ')} 등이 도출되었습니다.`;
    
    return { summary, sentimentRatio, insights };
  };

  const aiAnalysis = generateAISummary();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/95 backdrop-blur-sm border border-slate-200/80 rounded-xl p-6 shadow-xl"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-900 font-bold text-xl flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-rose-600" />
          AI 리뷰 키워드 분석
        </h3>
        <span className="text-xs text-slate-900 bg-slate-200 px-2 py-1 rounded border border-slate-400 font-semibold">
          {itemName}
        </span>
      </div>

      <div className="space-y-6">
        {/* 긍정 리뷰 키워드 */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ThumbsUp className="w-4 h-4 text-emerald-400" />
            <h4 className="text-slate-900 font-bold text-base">긍정 리뷰 키워드</h4>
          </div>
          <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-lg p-4">
            <ResponsiveContainer width="100%" height={Math.min(300, positiveData.length * 30)}>
              <BarChart data={positiveData} layout="vertical" margin={{ top: 5, right: 10, bottom: 5, left: 80 }}>
                <XAxis type="number" tick={{ fontSize: 10, fill: '#1e293b', fontWeight: 'bold' }} />
                <YAxis 
                  dataKey="keyword" 
                  type="category" 
                  tick={{ fontSize: 11, fill: '#1e293b', fontWeight: 'bold' }}
                  width={70}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(30, 41, 59, 0.95)', 
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                  itemStyle={{ color: '#ffffff' }}
                  labelStyle={{ color: '#ffffff' }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {positiveData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#10b981" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-3 flex flex-wrap gap-2">
              {displayKeywords.positive.slice(0, 5).map((item, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-emerald-300 border border-emerald-400 rounded-md text-xs text-slate-900 font-bold"
                >
                  #{item.keyword}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 부정 리뷰 키워드 */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ThumbsDown className="w-4 h-4 text-rose-400" />
            <h4 className="text-slate-900 font-bold text-base">부정 리뷰 키워드</h4>
          </div>
          <div className="bg-rose-50/80 border border-rose-200/80 rounded-lg p-4">
            <ResponsiveContainer width="100%" height={Math.min(300, negativeData.length * 30)}>
              <BarChart data={negativeData} layout="vertical" margin={{ top: 5, right: 10, bottom: 5, left: 80 }}>
                <XAxis type="number" tick={{ fontSize: 10, fill: '#1e293b', fontWeight: 'bold' }} />
                <YAxis 
                  dataKey="keyword" 
                  type="category" 
                  tick={{ fontSize: 11, fill: '#1e293b', fontWeight: 'bold' }}
                  width={70}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(30, 41, 59, 0.95)', 
                    border: '1px solid rgba(244, 63, 94, 0.3)',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                  itemStyle={{ color: '#ffffff' }}
                  labelStyle={{ color: '#ffffff' }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {negativeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#f43f5e" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-3 flex flex-wrap gap-2">
              {displayKeywords.negative.slice(0, 5).map((item, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-rose-300 border border-rose-400 rounded-md text-xs text-slate-900 font-bold"
                >
                  #{item.keyword}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* AI 분석 요약 */}
        <div className="mt-6 pt-6 border-t border-slate-300">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-rose-600" />
            <h4 className="text-slate-900 font-bold text-base">종합 AI 분석 요약</h4>
          </div>
          <div className="bg-gradient-to-br from-slate-50 to-slate-100/80 border border-slate-300/80 rounded-lg p-5">
            <div className="space-y-3">
              <p className="text-slate-900 leading-relaxed text-sm">
                {aiAnalysis.summary}
              </p>
              <div className="flex items-center gap-2 pt-2 border-t border-slate-300">
                <span className="text-xs text-slate-700 font-semibold">주요 인사이트:</span>
                <div className="flex flex-wrap gap-2">
                  {aiAnalysis.insights.map((insight, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-rose-100 border border-rose-300 rounded-md text-xs text-slate-900 font-semibold"
                    >
                      {insight}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-xs text-slate-700 font-medium">
                    긍정 비율: {Math.round(aiAnalysis.sentimentRatio * 100)}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                  <span className="text-xs text-slate-700 font-medium">
                    부정 비율: {Math.round((1 - aiAnalysis.sentimentRatio) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

