import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  children: ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* 侧边栏切换按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-1/2 -translate-y-1/2 z-50 bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-r-lg shadow-lg transition-colors"
      >
        {isOpen ? '<' : '>'}
      </button>

      {/* 侧边栏内容 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed left-0 top-0 h-full w-1/3 bg-gray-900 shadow-xl z-40 overflow-y-auto"
          >
            <div className="p-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};