import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { ReportResult } from '../data/mockData';

interface ReportViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportResult: ReportResult | null;
}

export default function ReportViewModal({ isOpen, onClose, reportResult }: ReportViewModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (reportResult?.content) {
      await navigator.clipboard.writeText(reportResult.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!reportResult) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white/98 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
              {/* 헤더 */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200 flex-shrink-0 bg-gradient-to-r from-rose-50 to-pink-50">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-1">
                    {reportResult.type === 'marketing' && '📢 마케팅 캠페인 전략'}
                    {reportResult.type === 'npd' && '🧪 신제품 기획(BM)'}
                    {reportResult.type === 'overseas' && '✈️ 해외 진출 전략'}
                  </h2>
                  <p className="text-sm text-slate-600">✨ AI 맞춤형 인사이트</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2 bg-rose-100 hover:bg-rose-200 border border-rose-300 rounded-lg text-slate-900 text-sm font-medium flex items-center gap-2 transition-all"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        복사됨
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        복사
                      </>
                    )}
                  </button>
                  <button
                    onClick={onClose}
                    className="text-slate-600 hover:text-slate-900 transition-colors p-2"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              {/* 내용 */}
              <div className="flex-1 overflow-y-auto p-8 bg-white">
                <div className="max-w-none">
                  <div className="text-slate-900 text-base leading-relaxed whitespace-pre-wrap font-sans space-y-6">
                    {reportResult.content.split('\n\n').map((paragraph, idx) => {
                      // Agent Insight 제목
                      if (paragraph.trim() === 'Agent Insight') {
                        return (
                          <h1 key={idx} className="text-3xl font-bold text-slate-900 mb-6 pb-4 border-b-2 border-rose-300">
                            {paragraph}
                          </h1>
                        );
                      }
                      // Market Precedent 섹션
                      if (paragraph.trim() === 'Market Precedent') {
                        return (
                          <h2 key={idx} className="text-2xl font-bold text-slate-900 mt-8 mb-4 text-rose-600">
                            {paragraph}
                          </h2>
                        );
                      }
                      // Agent Conclusion 섹션
                      if (paragraph.trim() === 'Agent Conclusion') {
                        return (
                          <h2 key={idx} className="text-2xl font-bold text-slate-900 mt-8 mb-4 text-rose-600">
                            {paragraph}
                          </h2>
                        );
                      }
                      // 번호가 있는 리스트 항목 (1. 2. 3.)
                      if (paragraph.match(/^\d+\.\s/)) {
                        const parts = paragraph.split(/\n/);
                        const title = parts[0];
                        const content = parts.slice(1).join('\n');
                        return (
                          <div key={idx} className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-5 border-l-4 border-rose-400 shadow-sm">
                            <h3 className="font-bold text-slate-900 mb-3 text-lg">{title}</h3>
                            <p className="text-slate-700 leading-relaxed">{content || ''}</p>
                          </div>
                        );
                      }
                      // 불릿 포인트 리스트 (•)
                      if (paragraph.includes('•')) {
                        return (
                          <div key={idx} className="space-y-3 bg-slate-50 rounded-lg p-4">
                            {paragraph.split('\n').map((line, lineIdx) => {
                              if (line.trim().startsWith('•')) {
                                return (
                                  <div key={lineIdx} className="flex items-start gap-3">
                                    <span className="text-rose-500 font-bold mt-1 text-lg">•</span>
                                    <span className="text-slate-700 flex-1 leading-relaxed">{line.replace(/^•\s*/, '')}</span>
                                  </div>
                                );
                              }
                              if (line.trim()) {
                                return <p key={lineIdx} className="text-slate-700 font-semibold mt-2">{line}</p>;
                              }
                              return null;
                            })}
                          </div>
                        );
                      }
                      // 일반 텍스트 (첫 문단 등)
                      if (paragraph.trim() && !paragraph.match(/^[가-힣\s]+$/) || paragraph.length > 50) {
                        return (
                          <p key={idx} className="text-slate-700 leading-relaxed text-base">
                            {paragraph}
                          </p>
                        );
                      }
                      // 섹션 제목 (짧은 텍스트)
                      if (paragraph.match(/^[가-힣\s]+$/) && paragraph.length < 50) {
                        return (
                          <h3 key={idx} className="text-lg font-bold text-slate-900 mt-4 mb-2">
                            {paragraph}
                          </h3>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

