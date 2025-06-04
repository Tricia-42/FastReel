# FastReel Refactor Implementation Plan

## Phase 1: Layout Architecture (Day 1-2)

### 1.1 Create App Layout Component
```typescript
// src/layouts/AppLayout.tsx
interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="flex h-screen bg-black">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden md:flex" />
      
      {/* Main Content */}
      <main className="flex-1 relative">
        {children}
      </main>
      
      {/* Mobile Bottom Nav - Only on mobile */}
      <MobileNav className="md:hidden" />
      
      {/* Floating Create Button */}
      <CreateButton />
    </div>
  );
};
```

### 1.2 Sidebar Component (Desktop)
```typescript
// src/layouts/Sidebar.tsx
const Sidebar = () => {
  return (
    <aside className="w-[220px] bg-gray-900 border-r border-gray-800">
      <div className="p-4">
        <Logo />
      </div>
      
      <nav className="mt-8">
        <NavItem icon={Home} label="For You" href="/feed" />
        <NavItem icon={Users} label="Following" href="/feed?filter=following" />
        <NavItem icon={Compass} label="Explore" href="/explore" />
        <NavItem icon={User} label="Profile" href="/profile" />
      </nav>
      
      <div className="absolute bottom-0 w-full p-4">
        <UserInfo />
      </div>
    </aside>
  );
};
```

### 1.3 Update _app.tsx
```typescript
// pages/_app.tsx
function MyApp({ Component, pageProps }: AppProps) {
  // Pages can opt out of layout
  const getLayout = Component.getLayout || ((page) => (
    <AppLayout>{page}</AppLayout>
  ));

  return (
    <SessionProvider session={pageProps.session}>
      {getLayout(<Component {...pageProps} />)}
    </SessionProvider>
  );
}
```

## Phase 2: Responsive Design (Day 2-3)

### 2.1 Breakpoint System
```scss
// styles/breakpoints.scss
$mobile: 640px;
$tablet: 768px;
$desktop: 1024px;
$wide: 1280px;

// Tailwind config
module.exports = {
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
    }
  }
}
```

### 2.2 Feed Layout Adjustments
```typescript
// Mobile: Full screen vertical
// Tablet: Centered with padding
// Desktop: Max-width with sidebar space

<div className="
  w-full md:max-w-[600px] lg:max-w-[800px] 
  mx-auto h-full
">
  <FeedView />
</div>
```

## Phase 3: Create Flow Modal (Day 3-4)

### 3.1 Create Modal Component
```typescript
// src/features/create/CreateModal.tsx
export const CreateModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'record' | 'review' | 'publish'>('record');
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-[500px] mx-auto">
        {step === 'record' && <RecordStep onNext={() => setStep('review')} />}
        {step === 'review' && <ReviewStep onNext={() => setStep('publish')} />}
        {step === 'publish' && <PublishStep onComplete={onClose} />}
      </div>
    </Modal>
  );
};
```

### 3.2 Replace Create Page
```typescript
// Remove pages/create.tsx
// Add create modal trigger to AppLayout
const [showCreate, setShowCreate] = useState(false);

<CreateButton onClick={() => setShowCreate(true)} />
<CreateModal isOpen={showCreate} onClose={() => setShowCreate(false)} />
```

## Phase 4: State Management (Day 4-5)

### 4.1 Feed State Context
```typescript
// src/contexts/FeedContext.tsx
interface FeedState {
  currentIndex: number;
  reels: Reel[];
  isPlaying: boolean;
}

export const FeedProvider = ({ children }) => {
  const [state, setState] = useState<FeedState>({
    currentIndex: 0,
    reels: [],
    isPlaying: true,
  });
  
  return (
    <FeedContext.Provider value={{ state, setState }}>
      {children}
    </FeedContext.Provider>
  );
};
```

### 4.2 Persist State During Navigation
```typescript
// Wrap app with FeedProvider
// Maintain video position when switching pages
```

## Phase 5: Performance Optimizations (Day 5-6)

### 5.1 Video Preloading
```typescript
// src/hooks/useVideoPreload.ts
export const useVideoPreload = (reels: Reel[], currentIndex: number) => {
  useEffect(() => {
    // Preload next 2 videos
    const preloadIndexes = [currentIndex + 1, currentIndex + 2];
    
    preloadIndexes.forEach(index => {
      if (reels[index]) {
        const video = document.createElement('video');
        video.src = reels[index].videoUrl;
        video.load();
      }
    });
  }, [currentIndex, reels]);
};
```

### 5.2 Intersection Observer
```typescript
// Pause videos when off-screen
const { ref, inView } = useInView({
  threshold: 0.5,
});

useEffect(() => {
  if (videoRef.current) {
    if (inView) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  }
}, [inView]);
```

## Migration Checklist

- [ ] Create layout components
- [ ] Update _app.tsx with layout wrapper
- [ ] Add responsive breakpoints
- [ ] Convert BottomNav to Sidebar
- [ ] Implement CreateModal
- [ ] Remove create page
- [ ] Add FeedContext
- [ ] Update all pages to use new layout
- [ ] Add video preloading
- [ ] Implement intersection observer
- [ ] Test on mobile/tablet/desktop
- [ ] Fix any layout issues
- [ ] Performance testing

## Testing Matrix

| Feature | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Navigation | Bottom Nav | Sidebar | Sidebar |
| Feed Width | 100% | 600px | 800px |
| Create Flow | Modal | Modal | Modal |
| Video Size | Full | Centered | Centered |
| Transitions | Smooth | Smooth | Smooth |

## Success Metrics

1. **Performance**
   - Feed loads < 1s
   - Smooth 60fps scrolling
   - Videos preload seamlessly

2. **UX**
   - No page reloads during navigation
   - Consistent layout across devices
   - Natural create flow

3. **Code Quality**
   - Reduced component complexity
   - Better separation of concerns
   - Easier to maintain 