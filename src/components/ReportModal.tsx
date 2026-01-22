import { motion, AnimatePresence } from 'framer-motion';
import { X, Megaphone, FlaskConical, Plane } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: 'marketing' | 'npd' | 'overseas') => void;
}

export default function ReportModal({ isOpen, onClose, onSelect }: ReportModalProps) {
  const options = [
    {
      type: 'marketing' as const,
      icon: Megaphone,
      title: '마케팅 캠페인용',
      description: '메시지, 타겟팅, 홍보 채널',
      gradient: 'from-rose-500/20 to-pink-500/20',
      borderColor: 'border-rose-500/50',
    },
    {
      type: 'npd' as const,
      icon: FlaskConical,
      title: '신제품 기획(BM)용',
      description: '성분 배합, 제형 컨셉, USP',
      gradient: 'from-pink-500/20 to-rose-500/20',
      borderColor: 'border-pink-500/50',
    },
    {
      type: 'overseas' as const,
      icon: Plane,
      title: '해외 진출 전략용',
      description: '국가별 선호도, 진입 장벽 분석',
      gradient: 'from-purple-500/20 to-pink-500/20',
      borderColor: 'border-purple-500/50',
    },
  ];

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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
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
            <div className="bg-gradient-to-br from-rose-950/95 to-pink-950/95 backdrop-blur-xl border border-rose-800/50 rounded-2xl p-8 max-w-2xl w-full shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  ✨ AI 맞춤형 인사이트 제공
                </h2>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <p className="text-slate-400 mb-6">
                보고서 유형을 선택해주세요
              </p>
              
              <div className="grid grid-cols-1 gap-4">
                {options.map((option) => {
                  const Icon = option.icon;
                  return (
                    <motion.button
                      key={option.type}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onSelect(option.type);
                        onClose();
                      }}
                      className={`relative bg-gradient-to-br ${option.gradient} border-2 ${option.borderColor} rounded-xl p-6 text-left hover:border-opacity-100 transition-all group backdrop-blur-sm`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg bg-slate-800/50 group-hover:scale-110 transition-transform`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-1">
                            {option.title}
                          </h3>
                          <p className="text-slate-400 text-sm">
                            {option.description}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

