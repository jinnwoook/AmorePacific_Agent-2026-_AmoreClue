import { motion } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';
import { OverseasProduct } from './OverseasProductList';
import { DomesticProduct } from './DomesticProductList';
import { useState, useEffect } from 'react';

interface ProductComparisonProps {
  overseasProduct: OverseasProduct | null;
  domesticProduct: DomesticProduct | null;
}

interface ComparisonResult {
  overseasSummary: string;
  domesticSummary: string;
  overallComparison: string;
  overseasImage?: string;
  domesticImage?: string;
}

export default function ProductComparison({ overseasProduct, domesticProduct }: ProductComparisonProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);

  useEffect(() => {
    if (overseasProduct && domesticProduct) {
      setIsAnalyzing(true);
      // AI 분석 시뮬레이션
      setTimeout(() => {
        const result: ComparisonResult = {
          overseasSummary: `${overseasProduct.name}은(는) ${overseasProduct.brand}의 대표 제품으로, ${overseasProduct.category} 카테고리에서 높은 인기를 얻고 있습니다. 해외 시장에서 검증된 성분과 제형을 바탕으로 안정적인 효과를 제공하며, 소비자 만족도가 높은 것으로 나타났습니다.`,
          domesticSummary: `${domesticProduct.name}은(는) ${domesticProduct.brand}의 인기 제품으로, 한국 시장에서 강력한 입지를 구축하고 있습니다. 국내 소비자들의 피부 특성에 맞춘 맞춤형 포뮬레이션과 뛰어난 사용감으로 높은 평가를 받고 있습니다.`,
          overallComparison: `두 제품을 종합적으로 비교 분석한 결과, ${overseasProduct.name}은 해외 시장에서 검증된 성분 조합과 안정성을 강점으로 하며, ${domesticProduct.name}은 한국 소비자들의 피부 특성에 최적화된 포뮬레이션과 사용감을 강점으로 합니다. 시장 포지셔닝 측면에서 ${overseasProduct.name}은 글로벌 브랜드 파워와 검증된 효능을, ${domesticProduct.name}은 국내 시장 이해도와 소비자 친화적 접근을 각각 강조하고 있습니다. 가격 대비 효과 측면에서는 두 제품 모두 각자의 시장에서 우수한 평가를 받고 있으며, 타겟 고객층과 사용 목적에 따라 선택이 달라질 수 있습니다.`,
          overseasImage: overseasProduct.image,
          domesticImage: domesticProduct.image,
        };
        setComparisonResult(result);
        setIsAnalyzing(false);
      }, 2000);
    } else {
      setComparisonResult(null);
    }
  }, [overseasProduct, domesticProduct]);

  if (!overseasProduct || !domesticProduct) {
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-slate-200/80 rounded-xl p-6 shadow-xl h-full flex items-center justify-center">
        <p className="text-slate-500 text-center">
          해외 인기 제품과 한국 인기 제품을 각각 선택하면<br />
          AI 비교 분석 결과가 표시됩니다.
        </p>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-slate-200/80 rounded-xl p-6 shadow-xl h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-rose-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-700 font-semibold">AI 비교 분석 중...</p>
          <p className="text-slate-500 text-sm mt-2">두 제품을 종합적으로 분석하고 있습니다.</p>
        </div>
      </div>
    );
  }

  if (!comparisonResult) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/95 backdrop-blur-sm border border-slate-200/80 rounded-xl p-6 shadow-xl h-full flex flex-col overflow-y-auto"
    >
      <div className="flex items-center gap-2 mb-6 flex-shrink-0">
        <Sparkles className="w-5 h-5 text-rose-600" />
        <h3 className="text-slate-900 font-bold text-xl">AI 비교 분석</h3>
      </div>

      <div className="space-y-6 flex-1">
        {/* 해외 제품 요약 */}
        <div className="bg-blue-50/80 border border-blue-200 rounded-lg p-5">
          <h4 className="text-blue-900 font-bold text-lg mb-3 flex items-center gap-2">
            <span>🌍</span>
            {overseasProduct.name}
          </h4>
          {comparisonResult.overseasImage ? (
            <img 
              src={comparisonResult.overseasImage} 
              alt={overseasProduct.name}
              className="w-32 h-32 object-cover rounded-lg mb-3 border border-blue-200"
            />
          ) : (
            <div className="w-32 h-32 bg-blue-200 rounded-lg mb-3 flex items-center justify-center">
              <span className="text-blue-600 text-4xl">🌍</span>
            </div>
          )}
          <p className="text-slate-800 leading-relaxed text-sm">
            {comparisonResult.overseasSummary}
          </p>
        </div>

        {/* 한국 제품 요약 */}
        <div className="bg-rose-50/80 border border-rose-200 rounded-lg p-5">
          <h4 className="text-rose-900 font-bold text-lg mb-3 flex items-center gap-2">
            <span>🇰🇷</span>
            {domesticProduct.name}
          </h4>
          {comparisonResult.domesticImage ? (
            <img 
              src={comparisonResult.domesticImage} 
              alt={domesticProduct.name}
              className="w-32 h-32 object-cover rounded-lg mb-3 border border-rose-200"
            />
          ) : (
            <div className="w-32 h-32 bg-rose-200 rounded-lg mb-3 flex items-center justify-center">
              <span className="text-rose-600 text-4xl">🇰🇷</span>
            </div>
          )}
          <p className="text-slate-800 leading-relaxed text-sm">
            {comparisonResult.domesticSummary}
          </p>
        </div>

        {/* 종합 비교 */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-100/80 border border-slate-300 rounded-lg p-5">
          <h4 className="text-slate-900 font-bold text-lg mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-600" />
            종합 비교 분석
          </h4>
          <p className="text-slate-800 leading-relaxed text-sm">
            {comparisonResult.overallComparison}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

