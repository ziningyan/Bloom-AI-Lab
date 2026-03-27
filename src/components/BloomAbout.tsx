import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Sparkles, Wand2, BookOpen, Download, Plus, Twitter, Linkedin, Instagram, ArrowRight } from 'lucide-react';

interface BloomAboutProps {
  onBack: () => void;
}

export default function BloomAbout({ onBack }: BloomAboutProps) {
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
            <span className="text-2xl font-display font-bold tracking-tighter">bloom 关于</span>
            <div className="h-6 w-[1px] bg-white/10"></div>
            <button className="liquid-glass flex items-center gap-3 rounded-full py-1.5 pl-4 pr-1.5 transition-transform hover:scale-105 active:scale-95">
              <span className="text-sm font-display font-medium tracking-tight">账户</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                <Sparkles className="h-4 w-4" />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-6">
        <div className="mx-auto max-w-4xl">
          {/* Hero Section */}
          <section className="mb-32 text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-6xl font-display font-bold tracking-tighter lg:text-8xl leading-[0.9]"
            >
              <span className="font-serif italic text-white/80 font-light">核心愿景</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mx-auto mt-10 max-w-2xl text-xl text-white/60 leading-relaxed"
            >
              Bloom 是一个由 AI 驱动的花卉设计平台，它弥合了有机美与数字创新之间的鸿沟。
              我们相信，艺术表达将通过神经智能得到无限放大。
            </motion.p>
          </section>

          {/* Core Values */}
          <section className="mb-32 grid grid-cols-1 gap-8 md:grid-cols-2">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="liquid-glass rounded-3xl p-8"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                <Wand2 className="h-6 w-6" />
              </div>
              <h3 className="mb-4 text-2xl font-display font-bold tracking-tight">神经生成</h3>
              <p className="text-white/50 leading-relaxed text-sm">
                我们的专有 AI 模型经过数百万种植物结构的训练，
                让您能够生成既具有生物灵感又在数学上完美的设计。
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="liquid-glass rounded-3xl p-8"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="mb-4 text-2xl font-display font-bold tracking-tight">生长档案</h3>
              <p className="text-white/50 leading-relaxed text-sm">
                访问庞大的植物物种和数字纹理库。
                Bloom 提供的工具让您能够实时雕刻、操纵和演化您的花卉创作。
              </p>
            </motion.div>
          </section>

          {/* Technology Section */}
          <section className="mb-32">
            <div className="liquid-glass-strong rounded-[3rem] p-12 overflow-hidden relative">
              <div className="relative z-10">
                <h3 className="mb-8 text-3xl font-display font-bold tracking-tight">核心技术</h3>
                <div className="space-y-8">
                  <div className="flex items-start gap-6">
                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-bold font-display">1</div>
                    <div>
                      <h4 className="mb-2 text-lg font-display font-bold tracking-tight">液态玻璃引擎</h4>
                      <p className="text-white/50 text-sm">我们的自定义渲染管线创造了 Bloom 的标志性美学，融合了透明度、折射和有机运动。</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-6">
                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-bold font-display">2</div>
                    <div>
                      <h4 className="mb-2 text-lg font-display font-bold tracking-tight">神经种子 v2.4</h4>
                      <p className="text-white/50 text-sm">驱动图像生成和“重新构想”功能的核心 AI 模型，专门针对植物建筑进行训练。</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-6">
                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-bold font-display">3</div>
                    <div>
                      <h4 className="mb-2 text-lg font-display font-bold tracking-tight">程序化雕刻</h4>
                      <p className="text-white/50 text-sm">强大的画布引擎，允许对复杂的植物结构进行非破坏性编辑 and 实时操纵。</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative Background Element */}
              <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-white/5 blur-3xl"></div>
            </div>
          </section>

          {/* Team / Ecosystem */}
          <section className="mb-32 text-center">
            <h3 className="mb-12 text-3xl font-display font-bold tracking-tight">进入我们的生态系统</h3>
            <div className="flex flex-wrap justify-center gap-6">
              {[Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="liquid-glass flex h-16 w-16 items-center justify-center rounded-full text-white transition-all hover:scale-110 hover:bg-white/10"
                >
                  <Icon className="h-6 w-6" />
                </a>
              ))}
            </div>
            <p className="mt-10 text-white/40 text-sm font-display font-bold uppercase tracking-[0.2em]">
              加入 120 万+ 重新定义花卉建筑边界的远见艺术家。
            </p>
          </section>

          {/* CTA */}
          <section className="text-center">
            <button 
              onClick={onBack}
              className="liquid-glass-strong group flex items-center gap-4 rounded-full py-4 pl-10 pr-4 transition-transform hover:scale-105 active:scale-95"
            >
              <span className="text-2xl font-display font-bold tracking-tighter">开始设计</span>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
                <ArrowRight className="h-6 w-6" />
              </div>
            </button>
          </section>
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
