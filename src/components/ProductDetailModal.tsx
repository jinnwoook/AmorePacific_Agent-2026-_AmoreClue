import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, TrendingUp, Star } from 'lucide-react';

interface BestSellerProduct {
  id: string;
  name: string;
  brand: string;
  image?: string;
  salesRank: number;
  rating: number;
  reviewCount: number;
  popularityScore: number;
}

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  keyword: string;
  platform: string;
  products: BestSellerProduct[];
  additionalInfo: string;
}

export default function ProductDetailModal({ 
  isOpen, 
  onClose, 
  keyword, 
  platform, 
  products, 
  additionalInfo 
}: ProductDetailModalProps) {
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
            <div className="bg-white rounded-2xl p-6 max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto border-2 border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{keyword}</h3>
                  <p className="text-sm text-slate-600">{platform} 인기 키워드</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              <div className="space-y-4">
                {/* 베스트 셀러 제품 */}
                <div>
                  <h4 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    베스트 셀러 제품
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {products.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-slate-50 border border-slate-200 rounded-lg p-4"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          {product.image ? (
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-20 h-20 object-cover rounded-lg border border-slate-200"
                            />
                          ) : (
                            <div className="w-20 h-20 bg-slate-200 rounded-lg flex items-center justify-center">
                              <Package className="w-10 h-10 text-slate-400" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-xs text-slate-500 mb-1">{product.brand}</div>
                            <div className="text-sm font-semibold text-slate-900 truncate">{product.name}</div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-blue-600" />
                            <span className="text-xs text-slate-700">판매 순위: {product.salesRank}위</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs text-slate-700">평점: {product.rating}/5.0</span>
                            <span className="text-xs text-slate-500">({product.reviewCount.toLocaleString()}개 리뷰)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-blue-600">인기 지수: {product.popularityScore}%</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* 부가 설명 */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-slate-900 mb-2">관련 인기 지표 설명</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">{additionalInfo}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

