import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Sparkles, Share2, Heart, ExternalLink, Download } from 'lucide-react';

interface BloomGalleryProps {
  onBack: () => void;
  onEnterEditor: () => void;
}

import { useBloom } from '../context/BloomContext';

export default function BloomGallery({ onBack, onEnterEditor }: BloomGalleryProps) {
  const { galleryItems } = useBloom();

  const handleDownload = (url: string, title: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen w-full bg-black text-white font-sans selection:bg-white/20">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 p-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <button 
            onClick={onBack}
            className="liquid-glass group flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-transform hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-display font-bold uppercase tracking-widest text-[10px]">返回首页</span>
          </button>

          <div className="flex items-center gap-4">
            <span className="text-2xl font-display font-bold tracking-tighter">bloom 画廊</span>
            <div className="h-6 w-[1px] bg-white/10"></div>
            <button 
              onClick={onEnterEditor}
              className="liquid-glass-strong group flex items-center gap-2 rounded-full px-4 py-2 text-xs font-display font-bold uppercase tracking-widest transition-transform hover:scale-105 active:scale-95"
            >
              <Sparkles className="h-4 w-4" />
              <span>创建你的设计</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-6">
        <div className="mx-auto max-w-7xl">
          {/* Intro Section */}
          <div className="mb-20 text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-6xl font-display font-bold tracking-tighter lg:text-8xl leading-[0.9]"
            >
              <span className="font-serif italic text-white/80 font-light">艺术展览</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mx-auto mt-6 max-w-2xl text-lg text-white/50"
            >
              探索由我们的神经引擎生成的精选花卉建筑。
              每一件作品都是有机灵感与算法精准度的独特交汇。
            </motion.p>
          </div>

          {/* Masonry-like Grid */}
          <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
            {galleryItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="liquid-glass group mb-6 break-inside-avoid overflow-hidden rounded-3xl p-4 transition-all hover:scale-[1.02]"
              >
                <div className="relative w-full aspect-[4/5] overflow-hidden rounded-2xl bg-white/5">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  {item.artist === '匿名创作者' && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-white/20 backdrop-blur-md border border-white/20 text-white text-[10px] font-display font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                        新作品
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <div className="flex gap-2">
                        <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 backdrop-blur-md transition-transform hover:scale-110">
                          <Heart className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(item.imageUrl, item.title);
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 backdrop-blur-md transition-transform hover:scale-110"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 backdrop-blur-md transition-transform hover:scale-110">
                          <Share2 className="h-4 w-4" />
                        </button>
                      </div>
                      <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 backdrop-blur-md transition-transform hover:scale-110">
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-display font-bold tracking-tight">{item.title}</h3>
                    <span className="text-[10px] tracking-[0.2em] font-display font-bold text-white/30 uppercase">{item.artist}</span>
                  </div>
                  <p className="mt-2 text-sm text-white/60 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.tags.map(tag => (
                      <span key={tag} className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-display font-bold text-white/30 uppercase tracking-[0.2em]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Load More / Footer */}
          <div className="mt-20 flex flex-col items-center gap-6">
            <div className="h-[1px] w-24 bg-white/10"></div>
            <p className="text-[10px] font-display font-bold text-white/20 uppercase tracking-[0.3em]">展览结束</p>
            <button 
              onClick={onEnterEditor}
              className="liquid-glass mt-4 flex items-center gap-4 rounded-full py-4 px-10 transition-transform hover:scale-105 active:scale-95"
            >
              <span className="text-xl font-display font-bold tracking-tighter">开始你自己的创作</span>
              <ArrowLeft className="h-5 w-5 rotate-180" />
            </button>
          </div>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-3">
            <span className="text-xl font-semibold tracking-tighter">bloom</span>
            <span className="text-xs text-white/30">© 2026 AI 花卉设计</span>
          </div>
          <div className="flex gap-8 text-xs text-white/40 uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">隐私政策</a>
            <a href="#" className="hover:text-white transition-colors">服务条款</a>
            <a href="#" className="hover:text-white transition-colors">联系我们</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
