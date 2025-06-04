import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';

export const BottomNav = () => {
  const router = useRouter();
  const currentPath = router.pathname;

  const navItems = [
    {
      path: '/feed',
      label: 'Feed',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      path: '/explore',
      label: 'Explore',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      path: '/create',
      label: 'Create',
      icon: (
        <div className="relative">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
      ),
      isCreate: true,
    },
    {
      path: '/profile',
      label: 'Profile',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full relative ${
                item.isCreate ? 'mx-4' : ''
              }`}
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col items-center justify-center ${
                  item.isCreate
                    ? 'bg-cyan-500 rounded-xl px-6 py-2'
                    : ''
                }`}
              >
                <div className={`${
                  isActive && !item.isCreate ? 'text-cyan-500' : 'text-gray-400'
                } ${item.isCreate ? 'text-white' : ''}`}>
                  {item.icon}
                </div>
                {!item.isCreate && (
                  <span className={`text-xs mt-1 ${
                    isActive ? 'text-cyan-500' : 'text-gray-400'
                  }`}>
                    {item.label}
                  </span>
                )}
              </motion.div>
              
              {isActive && !item.isCreate && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-cyan-500 rounded-full"
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}; 