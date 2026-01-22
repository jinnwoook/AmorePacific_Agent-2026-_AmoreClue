import { motion, AnimatePresence } from 'framer-motion';
import { BubbleItem, TrendEvidence } from '../data/mockData';
import { Sparkles, TrendingUp, MessageSquare, BarChart3, Percent, Lightbulb } from 'lucide-react';

interface TrendEvidencePanelProps {
  selectedItem: BubbleItem | null;
  country: string;
}

export default function TrendEvidencePanel({ selectedItem, country }: TrendEvidencePanelProps) {
  if (!selectedItem || !selectedItem.evidence) {
    return (
      <div className="bg-gradient-to-br from-slate-950/40 to-slate-900/40 backdrop-blur-sm border border-slate-800/30 rounded-xl p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-slate-400" />
          <h3 className="text-white font-semibold text-lg">AI 근거 설명</h3>
        </div>
        <p className="text-slate-500 italic text-sm">
          리더보드 항목을 클릭하여 트렌드 근거를 확인하세요
        </p>
      </div>
    );
  }

  const evidence: TrendEvidence = selectedItem.evidence;
  const { numericalEvidence } = evidence;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-amber-950/40 to-yellow-950/40 backdrop-blur-sm border border-amber-800/30 rounded-xl p-6 shadow-xl"
    >
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-amber-300" />
        <h3 className="text-white font-semibold text-lg">AI 근거 설명</h3>
        <span className="ml-auto text-xs text-amber-300/70 bg-amber-900/30 px-2 py-1 rounded border border-amber-800/30">
          {selectedItem.name}
        </span>
      </div>

      {/* AI 근거 설명 */}
      <div className="mb-6">
        <div className="flex items-start gap-2 mb-2">
          <Lightbulb className="w-4 h-4 text-amber-300 mt-0.5 flex-shrink-0" />
          <h4 className="text-amber-200 font-medium text-sm">왜 트렌드인가?</h4>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed pl-6">
          {evidence.aiExplanation}
        </p>
      </div>

      {/* 리뷰 추세 */}
      <div className="mb-6">
        <div className="flex items-start gap-2 mb-2">
          <MessageSquare className="w-4 h-4 text-amber-300 mt-0.5 flex-shrink-0" />
          <h4 className="text-amber-200 font-medium text-sm">리뷰 추세 요약</h4>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed pl-6">
          {evidence.reviewTrend}
        </p>
      </div>

      {/* 수치적 근거 */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="w-4 h-4 text-amber-300" />
          <h4 className="text-amber-200 font-medium text-sm">수치적 근거</h4>
        </div>
        <div className="grid grid-cols-2 gap-3 pl-6">
          <div className="bg-amber-900/20 border border-amber-800/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-3 h-3 text-amber-300" />
              <span className="text-xs text-slate-400">SNS 언급</span>
            </div>
            <p className="text-amber-200 font-semibold text-lg">
              {numericalEvidence.snsMentions.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500">건</p>
          </div>
          
          <div className="bg-amber-900/20 border border-amber-800/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare className="w-3 h-3 text-amber-300" />
              <span className="text-xs text-slate-400">리뷰 개수</span>
            </div>
            <p className="text-amber-200 font-semibold text-lg">
              {numericalEvidence.reviewCount.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500">건</p>
          </div>
          
          <div className="bg-amber-900/20 border border-amber-800/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Percent className="w-3 h-3 text-amber-300" />
              <span className="text-xs text-slate-400">성장률</span>
            </div>
            <p className="text-amber-200 font-semibold text-lg">
              +{numericalEvidence.growthRate}%
            </p>
            <p className="text-xs text-slate-500">전월 대비</p>
          </div>
          
          <div className="bg-amber-900/20 border border-amber-800/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-3 h-3 text-amber-300" />
              <span className="text-xs text-slate-400">시장 점유율</span>
            </div>
            <p className="text-amber-200 font-semibold text-lg">
              {numericalEvidence.marketShare}%
            </p>
            <p className="text-xs text-slate-500">현재 시장</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

