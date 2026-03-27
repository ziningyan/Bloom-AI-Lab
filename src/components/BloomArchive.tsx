import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Search, Filter, Share2, Heart, Info, Zap, X, Shield, Activity, Dna, Globe, Cpu, Download } from "lucide-react";

import { useBloom } from "../context/BloomContext";
import { SpeciesCase } from "../types";

interface BloomArchiveProps {
  onBack: () => void;
}

export default function BloomArchive({ onBack }: BloomArchiveProps) {
  const [selectedCase, setSelectedCase] = useState<SpeciesCase | null>(null);
  const { archiveItems } = useBloom();

  const handleDownload = (url: string, title: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const DetailView = ({ item }: { item: SpeciesCase }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8"
    >
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
        onClick={() => setSelectedCase(null)}
      />
      
      <div className="liquid-glass-strong relative z-10 grid h-full max-h-[900px] w-full max-w-6xl overflow-hidden rounded-[3rem] lg:grid-cols-2">
          <div className="absolute top-8 left-8 z-20 flex gap-2">
            <button 
              onClick={() => handleDownload(item.image, item.title)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-transform hover:scale-110 active:scale-90"
            >
              <Download className="h-6 w-6" />
            </button>
            <button 
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-transform hover:scale-110 active:scale-90"
            >
              <Share2 className="h-6 w-6" />
            </button>
          </div>

          <button 
            onClick={() => setSelectedCase(null)}
            className="absolute right-8 top-8 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-transform hover:scale-110 active:scale-90"
          >
            <X className="h-6 w-6" />
          </button>

        {/* Left: Visual */}
        <div className="relative h-full overflow-hidden bg-white/5">
          <img 
            src={item.image} 
            alt={item.title}
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          
          <div className="absolute bottom-12 left-12 right-12">
            <span className="liquid-glass-strong mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
              {item.category}
            </span>
            <h2 className="text-5xl font-display font-bold tracking-tight lg:text-7xl">{item.title}</h2>
          </div>
        </div>

        {/* Right: Data */}
        <div className="flex flex-col overflow-y-auto p-8 lg:p-16">
          <div className="mb-12">
            <h3 className="mb-4 text-sm font-display font-bold uppercase tracking-[0.3em] text-white/40">物种描述</h3>
            <p className="text-xl leading-relaxed text-white/80 font-serif italic">
              {item.description}
            </p>
          </div>

          <div className="mb-12 grid grid-cols-3 gap-6">
            <div className="liquid-glass rounded-3xl p-6 text-center">
              <Shield className="mx-auto mb-3 h-6 w-6 text-blue-400" />
              <span className="block text-[10px] font-display font-bold uppercase tracking-widest text-white/30">稳定性</span>
              <span className="text-xl font-display font-bold">{item.stats.stability}</span>
            </div>
            <div className="liquid-glass rounded-3xl p-6 text-center">
              <Activity className="mx-auto mb-3 h-6 w-6 text-purple-400" />
              <span className="block text-[10px] font-display font-bold uppercase tracking-widest text-white/30">生长周期</span>
              <span className="text-xl font-display font-bold">{item.stats.growth}</span>
            </div>
            <div className="liquid-glass rounded-3xl p-6 text-center">
              <Zap className="mx-auto mb-3 h-6 w-6 text-yellow-400" />
              <span className="block text-[10px] font-display font-bold uppercase tracking-widest text-white/30">能量级</span>
              <span className="text-xl font-display font-bold">{item.stats.energy}</span>
            </div>
          </div>

          <div className="space-y-10">
            <section>
              <h3 className="mb-6 text-sm font-display font-bold uppercase tracking-[0.3em] text-white/40">神经架构指标</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  { label: "DNA 共振频率", value: item.technicalData?.dnaResonance, icon: Dna },
                  { label: "神经复杂度", value: item.technicalData?.neuralComplexity, icon: Cpu },
                  { label: "量子叠加态", value: item.technicalData?.quantumState, icon: Activity },
                  { label: "起源星区", value: item.technicalData?.originSector, icon: Globe },
                ].map((tech) => (
                  <div key={tech.label} className="flex items-center justify-between rounded-2xl bg-white/5 p-4 border border-white/5">
                    <div className="flex items-center gap-3">
                      <tech.icon className="h-4 w-4 text-white/40" />
                      <span className="text-sm font-display font-bold tracking-tight text-white/60">{tech.label}</span>
                    </div>
                    <span className="text-sm font-mono text-white">{tech.value}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="mb-6 text-sm font-display font-bold uppercase tracking-[0.3em] text-white/40">生长日志 (最近记录)</h3>
              <div className="space-y-4">
                {[
                  { date: "2026.03.25", event: "初步形态稳定化完成", status: "Success" },
                  { date: "2026.03.20", event: "检测到异常量子波动，已自动校准", status: "Warning" },
                  { date: "2026.03.15", event: "种子层级初始化", status: "Success" },
                ].map((log, i) => (
                  <div key={i} className="flex items-start gap-4 rounded-2xl bg-white/5 p-4">
                    <div className={`mt-1 h-2 w-2 rounded-full ${log.status === 'Success' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="text-xs font-mono text-white/40">{log.date}</span>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${log.status === 'Success' ? 'text-green-400' : 'text-yellow-400'}`}>
                          {log.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-white/80">{log.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="mb-6 text-sm font-display font-bold uppercase tracking-[0.3em] text-white/40">基因序列片段</h3>
              <div className="rounded-2xl bg-black/40 p-4 font-mono text-[10px] leading-relaxed text-purple-400/60 break-all border border-white/5">
                ATGC{Math.random().toString(36).substring(2, 15).toUpperCase()}
                GCTA{Math.random().toString(36).substring(2, 15).toUpperCase()}
                TTAG{Math.random().toString(36).substring(2, 15).toUpperCase()}
                CCGA{Math.random().toString(36).substring(2, 15).toUpperCase()}
                {Math.random().toString(36).substring(2, 15).toUpperCase()}
              </div>
            </section>
          </div>

          <div className="mt-auto pt-12">
            <button className="liquid-glass-strong w-full rounded-2xl py-4 text-sm font-display font-bold uppercase tracking-widest transition-transform hover:scale-[1.02] active:scale-[0.98]">
              导出物种 DNA 序列
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black font-sans text-white">
      <AnimatePresence>
        {selectedCase && <DetailView item={selectedCase} />}
      </AnimatePresence>

      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 h-[600px] w-[600px] bg-blue-500/5 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-0 right-1/4 h-[600px] w-[600px] bg-purple-500/5 blur-[150px] rounded-full"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-12 lg:px-12">
        {/* Header */}
        <header className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={onBack}
              className="liquid-glass flex h-12 w-12 items-center justify-center rounded-full transition-transform hover:scale-110 active:scale-90"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-4xl font-display font-bold tracking-tight lg:text-5xl">生长档案</h1>
              <p className="mt-1 text-white/40 font-display font-bold uppercase tracking-widest text-xs">1,240,892 个已发现物种</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="liquid-glass flex h-12 items-center gap-3 rounded-full px-6">
              <Search className="h-4 w-4 text-white/40" />
              <input 
                type="text" 
                placeholder="搜索物种或编号..." 
                className="bg-transparent text-sm outline-none placeholder:text-white/20"
              />
            </div>
            <button className="liquid-glass flex h-12 w-12 items-center justify-center rounded-full transition-colors hover:bg-white/10">
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Case Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {archiveItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedCase(item)}
              className="liquid-glass group cursor-pointer overflow-hidden rounded-[2.5rem] p-3 transition-all hover:bg-white/5"
            >
              <div className="relative w-full aspect-[4/5] overflow-hidden rounded-[2rem] bg-white/5">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                {item.category === '用户演化' && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-blue-500/20 backdrop-blur-md border border-blue-500/20 text-blue-400 text-[10px] font-display font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                      新物种
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                
                {/* Overlay Controls */}
                <div className="absolute bottom-6 left-6 right-6 flex translate-y-4 items-center justify-between opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); /* Handle like */ }}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20"
                    >
                      <Heart className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        handleDownload(item.image, item.title);
                      }}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); /* Handle share */ }}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedCase(item); }}
                    className="liquid-glass-strong flex h-10 items-center gap-2 rounded-full px-4 text-xs font-bold uppercase tracking-widest"
                  >
                    查看详情
                  </button>
                </div>

                <div className="absolute top-4 left-4">
                  <span className="liquid-glass-strong rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                    {item.category}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-xl font-display font-bold tracking-tight">{item.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-white/50 leading-relaxed">
                  {item.description}
                </p>
                
                <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-display font-bold uppercase tracking-widest text-white/30">稳定性</span>
                    <span className="text-sm font-display font-bold text-blue-400">{item.stats.stability}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-display font-bold uppercase tracking-widest text-white/30">生长周期</span>
                    <span className="text-sm font-display font-bold text-purple-400">{item.stats.growth}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-display font-bold uppercase tracking-widest text-white/30">能量级</span>
                    <span className="text-sm font-display font-bold text-yellow-400">{item.stats.energy}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Info */}
        <footer className="mt-20 flex flex-col items-center gap-6 border-t border-white/5 pt-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
            <Info className="h-6 w-6 text-white/20" />
          </div>
          <p className="max-w-2xl text-sm text-white/40 leading-relaxed">
            所有档案均由 Bloom 神经引擎实时同步。由于量子波动的不可预测性，某些物种的稳定性指标可能会随观测者的意识状态而发生微调。
          </p>
          <div className="flex items-center gap-2 text-[10px] font-display font-bold uppercase tracking-[0.3em] text-white/20">
            <Zap className="h-3 w-3" />
            数据最后更新于: 2026.03.27
          </div>
        </footer>
      </div>
    </div>
  );
}
