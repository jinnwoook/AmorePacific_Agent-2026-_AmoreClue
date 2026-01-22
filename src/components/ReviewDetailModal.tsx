import { motion, AnimatePresence } from 'framer-motion';
import { X, Instagram, Music, Youtube, ShoppingBag, Store } from 'lucide-react';

interface ReviewDetail {
  keyword: string;
  review: string;
  platform: 'Instagram' | 'TikTok' | 'YouTube' | 'Amazon' | 'Shopee' | 'Cosme' | 'Naver' | 'Kakao';
  author: string;
  date: string;
  additionalInfo: string;
  isPositive: boolean;
}

interface ReviewDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewDetail: ReviewDetail | null;
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
    case 'Shopee':
      return ShoppingBag;
    case 'Cosme':
    case 'Naver':
    case 'Kakao':
      return Store;
    default:
      return Instagram;
  }
};

const getPlatformColor = (platform: string) => {
  switch (platform) {
    case 'Instagram':
      return 'text-pink-500';
    case 'TikTok':
      return 'text-cyan-500';
    case 'YouTube':
      return 'text-red-500';
    case 'Amazon':
    case 'Shopee':
      return 'text-orange-500';
    case 'Cosme':
    case 'Naver':
    case 'Kakao':
      return 'text-purple-500';
    default:
      return 'text-slate-500';
  }
};

export default function ReviewDetailModal({ isOpen, onClose, reviewDetail }: ReviewDetailModalProps) {
  if (!reviewDetail) return null;

  const Icon = getPlatformIcon(reviewDetail.platform);
  const platformColor = getPlatformColor(reviewDetail.platform);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto ${
              reviewDetail.isPositive ? 'border-2 border-emerald-200' : 'border-2 border-rose-200'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${reviewDetail.isPositive ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                    <Icon className={`w-6 h-6 ${platformColor}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{reviewDetail.keyword}</h3>
                    <p className="text-sm text-slate-600">{reviewDetail.platform}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              <div className="space-y-4">
                {/* 원본 리뷰 */}
                <div className={`p-4 rounded-lg ${reviewDetail.isPositive ? 'bg-emerald-50 border border-emerald-200' : 'bg-rose-50 border border-rose-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-slate-700">원본 리뷰</span>
                    <span className="text-xs text-slate-500">by {reviewDetail.author}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500">{reviewDetail.date}</span>
                  </div>
                  <p className="text-slate-900 leading-relaxed">{reviewDetail.review}</p>
                </div>

                {/* 부가 설명 */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-slate-900 mb-2">부가 설명</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">{reviewDetail.additionalInfo}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

