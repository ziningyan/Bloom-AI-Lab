import { useState } from "react";
import { 
  Sparkles, 
  Download, 
  Wand2, 
  BookOpen, 
  ArrowRight, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Menu,
  Plus,
  Volume2,
  VolumeX
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useRef, useEffect } from "react";
import BloomEditor from "./components/BloomEditor";
import BloomGallery from "./components/BloomGallery";
import BloomAbout from "./components/BloomAbout";
import BloomProcessing from "./components/BloomProcessing";
import BloomArchive from "./components/BloomArchive";

import { BloomProvider } from "./context/BloomContext";

export default function App() {
  return (
    <BloomProvider>
      <AppContent />
    </BloomProvider>
  );
}

function AppContent() {
  const [view, setView] = useState<'hero' | 'editor' | 'gallery' | 'about' | 'processing' | 'archive'>('hero');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEcosystemModalOpen, setIsEcosystemModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      if (!isMuted) {
        audioRef.current.play().catch(err => {
          console.log("Autoplay prevented:", err);
          setIsMuted(true);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isMuted]);

  const toggleMusic = () => {
    setIsMuted(!isMuted);
  };

  const NavOverlay = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl"
    >
      <button 
        onClick={() => setIsMenuOpen(false)}
        className="absolute top-8 right-8 p-4 text-white/40 hover:text-white transition-colors"
      >
        <Plus className="h-8 w-8 rotate-45" />
      </button>
      <nav className="flex flex-col items-center gap-8">
        {[
          { id: 'hero', label: '首页' },
          { id: 'editor', label: '设计工作室' },
          { id: 'gallery', label: '展览馆' },
          { id: 'about', label: '我们的愿景' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setView(item.id as any);
              setIsMenuOpen(false);
            }}
            className={`text-6xl font-display font-bold tracking-tighter transition-all hover:scale-110 ${
              view === item.id ? 'text-white' : 'text-white/30 hover:text-white/60'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </motion.div>
  );

  return (
    <div className="bg-black min-h-screen">
      <AnimatePresence>
        {isMenuOpen && <NavOverlay />}
      </AnimatePresence>

      <audio 
        ref={audioRef}
        src="https://assets.mixkit.co/music/preview/mixkit-dreaming-big-31.mp3" 
        loop
      />

      <AnimatePresence>
        {isEcosystemModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEcosystemModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm liquid-glass-strong rounded-[3rem] p-10 text-center overflow-hidden"
            >
              {/* Decorative elements */}
              <div className="absolute -top-24 -left-24 h-48 w-48 bg-purple-500/20 blur-[60px] rounded-full"></div>
              <div className="absolute -bottom-24 -right-24 h-48 w-48 bg-blue-500/20 blur-[60px] rounded-full"></div>

              <button 
                onClick={() => setIsEcosystemModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-white/40 hover:text-white transition-colors"
              >
                <Plus className="h-6 w-6 rotate-45" />
              </button>

              <div className="relative z-10">
                <div className="mb-8 flex flex-col items-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-display font-bold tracking-tight">AI Lab 社区</h3>
                  <p className="mt-2 text-xs font-display font-bold uppercase tracking-widest text-white/40">扫码加入我们的生态系统</p>
                </div>

                <div className="relative mx-auto aspect-square w-full max-w-[240px] overflow-hidden rounded-3xl bg-white p-4 shadow-[0_0_50px_-10px_rgba(255,255,255,0.3)]">
                  <img 
                    src="https://i.postimg.cc/g0zKtx2V/20260327-113426.jpg" 
                    alt="AI Lab Group QR Code" 
                    className="h-full w-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle overlay to make it feel more integrated */}
                  <div className="absolute inset-0 pointer-events-none border-[12px] border-white rounded-3xl"></div>
                </div>

                <div className="mt-10 space-y-4">
                  <p className="text-sm leading-relaxed text-white/60">
                    在微信中扫描上方二维码，加入我们的创作者社群，获取最新动态与独家资源。
                  </p>
                  <div className="h-[1px] w-full bg-white/10"></div>
                  <div className="flex items-center justify-center gap-2 text-[10px] font-display font-bold uppercase tracking-[0.2em] text-white/30">
                    <span>Bloom AI Lab</span>
                    <div className="h-1 w-1 rounded-full bg-white/30"></div>
                    <span>Ecosystem</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {view === 'hero' && (
          <motion.main 
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative min-h-screen w-full overflow-hidden font-sans text-white selection:bg-white/20"
          >
            {/* Background Image with Motion */}
            <motion.div
              initial={{ scale: 1.15 }}
              animate={{ 
                scale: [1.15, 1.3, 1.15],
                rotate: [0, 3, 0, -3, 0],
                x: [0, 30, 0, -30, 0],
                y: [0, -30, 0, 30, 0]
              }}
              transition={{ 
                duration: 50, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="absolute inset-0 z-0 h-full w-full opacity-50"
            >
              <img
                src="https://i.postimg.cc/fT8LDYgx/lai-kan-wo-de-xin-zuo-pin-4-bu-yuan-tou-lu-xing-ming-de-liang-sheng-lai-zi-xiao-hong-shu-wang-ye-ban.jpg"
                alt="Background Art"
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {/* Space Effects Layer */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              {/* Dynamic Starfield */}
              {[...Array(100)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-[1px] w-[1px] bg-white rounded-full"
                  initial={{ 
                    x: Math.random() * 2000, 
                    y: Math.random() * 2000,
                    opacity: Math.random() * 0.7,
                    scale: Math.random() * 1.5
                  }}
                  animate={{ 
                    opacity: [0.2, 0.8, 0.2],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{ 
                    duration: 2 + Math.random() * 4, 
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: Math.random() * 5
                  }}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                />
              ))}

              {/* Floating Space Dust / Particles */}
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={`dust-${i}`}
                  className="absolute h-1 w-1 bg-white/20 rounded-full blur-[1px]"
                  initial={{ 
                    x: Math.random() * 100 + "%", 
                    y: Math.random() * 100 + "%",
                    opacity: 0
                  }}
                  animate={{ 
                    x: [null, (Math.random() - 0.5) * 200 + "px"],
                    y: [null, (Math.random() - 0.5) * 200 + "px"],
                    opacity: [0, 0.3, 0],
                  }}
                  transition={{ 
                    duration: 10 + Math.random() * 20, 
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              ))}

              {/* Nebula Glows */}
              <div className="absolute top-1/4 left-1/4 h-96 w-96 bg-purple-500/10 blur-[150px] rounded-full animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 h-[500px] w-[500px] bg-blue-500/10 blur-[180px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
              
              {/* Left Panel */}
              <section className="relative flex w-full flex-col p-4 lg:w-[52%] lg:p-6">
                <div className="liquid-glass-strong absolute inset-4 flex flex-col rounded-3xl p-6 lg:inset-6 lg:p-10">
                  
                  {/* Navigation */}
                    <nav className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img 
                          src="https://i.postimg.cc/HL2kx56b/lai-kan-wo-de-xin-zuo-pin-1-bu-yuan-tou-lu-xing-ming-de-liang-sheng-lai-zi-xiao-hong-shu-wang-ye-ban.jpg" 
                          alt="Bloom Logo" 
                          className="h-8 w-8 rounded-lg object-cover border border-white/10"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-2xl font-display font-bold tracking-tighter">bloom</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={toggleMusic}
                          className="liquid-glass p-2 rounded-full transition-all hover:scale-110 active:scale-95 text-white/60 hover:text-white"
                        >
                          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        </button>
                        <button 
                          onClick={() => setIsMenuOpen(true)}
                          className="liquid-glass group flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-transform hover:scale-105 active:scale-95"
                        >
                          <span>菜单</span>
                          <Menu className="h-4 w-4" />
                        </button>
                      </div>
                    </nav>

                  {/* Hero Center */}
                  <div className="flex flex-1 flex-col items-center justify-center text-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                      className="mb-14 relative"
                    >
                      {/* Ambient Glow Backdrop */}
                      <div className="absolute inset-0 -z-10 bg-white/20 blur-[100px] rounded-full scale-150 opacity-30 animate-pulse"></div>
                      
                      <img 
                        src="https://i.postimg.cc/HL2kx56b/lai-kan-wo-de-xin-zuo-pin-1-bu-yuan-tou-lu-xing-ming-de-liang-sheng-lai-zi-xiao-hong-shu-wang-ye-ban.jpg" 
                        alt="Bloom Hero Logo" 
                        className="h-48 w-48 rounded-[4rem] object-cover shadow-[0_0_100px_-20px_rgba(255,255,255,0.6)] border border-white/50 transition-all duration-1000 hover:scale-110 hover:-rotate-3 cursor-pointer"
                        referrerPolicy="no-referrer"
                      />
                    </motion.div>

                    <motion.h1 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                      className="max-w-2xl text-6xl font-display font-bold tracking-[-0.06em] text-white lg:text-8xl leading-[0.9]"
                    >
                      <span className="font-serif italic text-white/80 font-light">Bloom AI Lab</span>
                    </motion.h1>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                      className="mt-10 flex flex-col items-center gap-8"
                    >
                      <button 
                        onClick={() => setView('editor')}
                        className="liquid-glass-strong group flex items-center gap-4 rounded-full py-2 pl-6 pr-2 transition-transform hover:scale-105 active:scale-95"
                      >
                        <span className="text-lg font-display font-bold tracking-tight">立即探索</span>
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </button>

                      <div className="flex flex-wrap justify-center gap-3">
                        {["艺术画廊", "AI 生成", "3D 结构"].map((pill) => (
                          <span 
                            key={pill} 
                            className="liquid-glass rounded-full px-4 py-1.5 text-[10px] font-display font-bold uppercase tracking-widest text-white/80 transition-transform hover:scale-105"
                          >
                            {pill}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  {/* Bottom Quote */}
                  <footer className="mt-auto pt-10">
                    <div className="flex flex-col items-center gap-4 text-center">
                      <span className="text-[10px] font-display font-bold tracking-[0.3em] text-white/50 uppercase">远见设计</span>
                      <p className="max-w-md text-lg leading-relaxed">
                        <span className="font-serif italic text-white/90">“我们想象了一个</span>{" "}
                        <span className="text-white/70">没有终点的境界。”</span>
                      </p>
                      <div className="flex items-center gap-4 w-full max-w-xs">
                        <div className="h-[1px] flex-1 bg-white/10"></div>
                        <span className="text-[10px] font-display font-bold tracking-widest text-white/40 uppercase">马可·奥勒留</span>
                        <div className="h-[1px] flex-1 bg-white/10"></div>
                      </div>
                    </div>
                  </footer>
                </div>
              </section>

              {/* Right Panel */}
              <section className="hidden w-full flex-col p-4 lg:flex lg:w-[48%] lg:p-6">
                {/* Top Bar */}
                <div className="flex items-center justify-between gap-4">
                  <div className="liquid-glass flex items-center gap-1 rounded-full p-1 pr-4">
                    <div className="flex items-center gap-1 px-2">
                      {[Twitter, Linkedin, Instagram].map((Icon, i) => (
                        <a 
                          key={i} 
                          href="#" 
                          className="flex h-8 w-8 items-center justify-center rounded-full text-white transition-all hover:bg-white/10 hover:text-white/80"
                        >
                          <Icon className="h-4 w-4" />
                        </a>
                      ))}
                    </div>
                    <div className="h-4 w-[1px] bg-white/10"></div>
                    <ArrowRight className="ml-2 h-4 w-4 text-white/60" />
                  </div>

                  <button className="liquid-glass flex items-center gap-3 rounded-full py-1.5 pl-4 pr-1.5 transition-transform hover:scale-105 active:scale-95">
                    <span className="text-sm font-display font-medium tracking-tight">账户</span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                      <Sparkles className="h-4 w-4" />
                    </div>
                  </button>
                </div>

                {/* Community Card */}
                <div className="mt-12 flex justify-end">
                  <button 
                    onClick={() => setIsEcosystemModalOpen(true)}
                    className="liquid-glass w-56 rounded-2xl p-5 text-left transition-transform hover:scale-105 active:scale-95"
                  >
                    <h3 className="mb-2 text-sm font-display font-bold uppercase tracking-widest">进入我们的生态系统</h3>
                    <p className="text-xs leading-relaxed text-white/60">
                      加入一个由远见卓识的艺术家组成的社区，重新定义花卉建筑的边界。
                    </p>
                  </button>
                </div>

                {/* Bottom Feature Section */}
                <div className="mt-auto">
                  <div className="liquid-glass rounded-[2.5rem] p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div 
                        onClick={() => setView('processing')}
                        className="liquid-glass cursor-pointer rounded-3xl p-6 transition-transform hover:scale-105"
                      >
                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                          <Wand2 className="h-5 w-5" />
                        </div>
                        <h4 className="mb-1 text-sm font-display font-bold tracking-tight">处理中</h4>
                        <p className="text-[10px] text-white/50 uppercase tracking-widest">神经引擎 v2</p>
                      </div>
                      
                      <div 
                        onClick={() => setView('archive')}
                        className="liquid-glass cursor-pointer rounded-3xl p-6 transition-transform hover:scale-105"
                      >
                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <h4 className="mb-1 text-sm font-display font-bold tracking-tight">生长档案</h4>
                        <p className="text-[10px] text-white/50 uppercase tracking-widest">120万个物种</p>
                      </div>
                    </div>

                    <div 
                      onClick={() => setView('editor')}
                      className="liquid-glass mt-4 flex cursor-pointer items-center gap-4 rounded-3xl p-4 transition-transform hover:scale-105"
                    >
                      <img 
                        src="https://i.postimg.cc/HL2kx56b/lai-kan-wo-de-xin-zuo-pin-1-bu-yuan-tou-lu-xing-ming-de-liang-sheng-lai-zi-xiao-hong-shu-wang-ye-ban.jpg" 
                        alt="Plant Sculpting" 
                        className="h-16 w-24 rounded-xl object-cover border border-white/10"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-display font-bold tracking-tight">高级植物雕刻</h4>
                        <p className="text-[10px] font-display font-bold uppercase tracking-widest text-white/40">程序化生成工具</p>
                      </div>
                      <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-transform hover:scale-110 active:scale-90">
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </motion.main>
        )}

        {view === 'editor' && (
          <motion.div
            key="editor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <BloomEditor 
              onBack={() => setView('hero')} 
              onViewGallery={() => setView('gallery')}
              onViewArchive={() => setView('archive')}
            />
          </motion.div>
        )}

        {view === 'gallery' && (
          <motion.div
            key="gallery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <BloomGallery onBack={() => setView('hero')} onEnterEditor={() => setView('editor')} />
          </motion.div>
        )}

        {view === 'about' && (
          <motion.div
            key="about"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <BloomAbout onBack={() => setView('hero')} />
          </motion.div>
        )}

        {view === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <BloomProcessing onBack={() => setView('hero')} />
          </motion.div>
        )}

        {view === 'archive' && (
          <motion.div
            key="archive"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <BloomArchive onBack={() => setView('hero')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
