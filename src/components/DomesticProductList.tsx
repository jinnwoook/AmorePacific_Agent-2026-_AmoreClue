import { motion } from 'framer-motion';
import { Package } from 'lucide-react';

export interface DomesticProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  image?: string;
}

interface DomesticProductListProps {
  products: DomesticProduct[];
  selectedProduct: DomesticProduct | null;
  onSelectProduct: (product: DomesticProduct) => void;
}

export default function DomesticProductList({ products, selectedProduct, onSelectProduct }: DomesticProductListProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/95 backdrop-blur-sm border border-slate-200/80 rounded-xl p-6 shadow-xl h-full flex flex-col"
    >
      <div className="flex items-center gap-2 mb-4 flex-shrink-0">
        <Package className="w-5 h-5 text-rose-600" />
        <h3 className="text-slate-900 font-bold text-xl">한국 인기 제품 리스트</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-3">
        {products.map((product, index) => (
          <motion.button
            key={product.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelectProduct(product)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              selectedProduct?.id === product.id
                ? 'border-rose-500 bg-rose-50 shadow-md'
                : 'border-slate-200 bg-slate-50 hover:border-rose-300 hover:bg-rose-50/50'
            }`}
          >
            <div className="flex items-center gap-3">
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg border border-slate-200"
                />
              ) : (
                <div className="w-16 h-16 bg-slate-200 rounded-lg flex items-center justify-center">
                  <Package className="w-8 h-8 text-slate-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm text-slate-500 mb-1">{product.brand}</div>
                <div className="text-base font-semibold text-slate-900 truncate">{product.name}</div>
                <div className="text-xs text-slate-600 mt-1">{product.category}</div>
              </div>
              {selectedProduct?.id === product.id && (
                <div className="w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

