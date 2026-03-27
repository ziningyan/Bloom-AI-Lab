import { motion } from "motion/react";
import { ArrowLeft, Cpu, Zap, Activity, Layers, Loader2, CheckCircle2 } from "lucide-react";

interface BloomProcessingProps {
  onBack: () => void;
}

export default function BloomProcessing({ onBack }: BloomProcessingProps) {
  const steps = [
    { id: 1, label: "神经元初始化", status: "completed", time: "0.2s" },
    { id: 2, label: "花卉拓扑分析", status: "completed", time: "1.4s" },
    { id: 3, label: "程序化纹理合成", status: "processing", time: "进行中" },
    { id: 4, label: "环境光影渲染", status: "pending", time: "等待中" },
    { id: 5, label: "最终张量优化", status: "pending", time: "等待中" },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black font-sans text-white">
      {/* Background Glows */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 bg-purple-600/10 blur-[200px] rounded-full"></div>
        <div className="absolute top-0 right-0 h-[600px] w-[600px] bg-blue-600/5 blur-[150px] rounded-full"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-12 lg:px-12">
        {/* Header */}
        <header className="mb-16 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="liquid-glass flex items-center gap-3 rounded-full py-2 pl-3 pr-6 transition-transform hover:scale-105 active:scale-95"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
              <ArrowLeft className="h-4 w-4" />
            </div>
            <span className="text-sm font-display font-bold uppercase tracking-widest">返回工作室</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-display font-bold uppercase tracking-[0.3em] text-white/40">系统状态</span>
              <span className="text-sm font-display font-bold text-green-400">神经引擎 V2 在线</span>
            </div>
            <div className="h-10 w-10 rounded-full border border-green-500/30 bg-green-500/10 flex items-center justify-center">
              <Activity className="h-5 w-5 text-green-400 animate-pulse" />
            </div>
          </div>
        </header>

        <main className="grid gap-12 lg:grid-cols-12">
          {/* Left: Processing Status */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="liquid-glass-strong rounded-[3rem] p-8 lg:p-12"
            >
              <div className="mb-12 flex items-center gap-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/5 border border-white/10">
                  <Cpu className="h-10 w-10 text-purple-400" />
                </div>
                <div>
                  <h1 className="text-4xl font-display font-bold tracking-tight lg:text-5xl">正在处理</h1>
                  <p className="mt-2 text-lg text-white/50">正在通过 Bloom 神经引擎合成您的视觉构思...</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-16">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-display font-bold uppercase tracking-widest text-white/60">总进度</span>
                  <span className="text-2xl font-display font-bold">42%</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-white/5 p-1">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "42%" }}
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500 shadow-[0_0_20px_rgba(168,85,247,0.5)]"
                  />
                </div>
              </div>

              {/* Steps List */}
              <div className="space-y-4">
                {steps.map((step, i) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`flex items-center justify-between rounded-2xl border p-4 transition-colors ${
                      step.status === 'processing' 
                        ? 'border-purple-500/30 bg-purple-500/5' 
                        : 'border-white/5 bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {step.status === 'completed' && <CheckCircle2 className="h-5 w-5 text-green-400" />}
                      {step.status === 'processing' && <Loader2 className="h-5 w-5 text-purple-400 animate-spin" />}
                      {step.status === 'pending' && <div className="h-5 w-5 rounded-full border-2 border-white/20" />}
                      <span className={`font-display font-bold tracking-tight ${
                        step.status === 'pending' ? 'text-white/30' : 'text-white'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                    <span className={`text-xs font-mono ${
                      step.status === 'processing' ? 'text-purple-400' : 'text-white/40'
                    }`}>
                      {step.time}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: Technical Specs */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="liquid-glass rounded-[2.5rem] p-8"
            >
              <h3 className="mb-8 flex items-center gap-3 text-lg font-display font-bold uppercase tracking-widest">
                <Zap className="h-5 w-5 text-yellow-400" />
                性能指标
              </h3>
              
              <div className="space-y-6">
                {[
                  { label: "GPU 利用率", value: "88%", color: "bg-purple-500" },
                  { label: "张量核心频率", value: "2.4 GHz", color: "bg-blue-500" },
                  { label: "内存占用", value: "12.4 GB", color: "bg-green-500" },
                  { label: "预测延迟", value: "12ms", color: "bg-yellow-500" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="mb-2 flex justify-between text-xs font-display font-bold uppercase tracking-widest text-white/50">
                      <span>{stat.label}</span>
                      <span className="text-white">{stat.value}</span>
                    </div>
                    <div className="h-1 w-full rounded-full bg-white/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: stat.value.includes('%') ? stat.value : "70%" }}
                        className={`h-full rounded-full ${stat.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="liquid-glass rounded-[2.5rem] p-8"
            >
              <h3 className="mb-6 flex items-center gap-3 text-lg font-display font-bold uppercase tracking-widest">
                <Layers className="h-5 w-5 text-blue-400" />
                架构层级
              </h3>
              <div className="relative h-48 w-full">
                {/* Visual representation of layers */}
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute left-1/2 -translate-x-1/2 rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm"
                    style={{
                      width: `${100 - i * 15}%`,
                      height: '40px',
                      top: `${i * 30}px`,
                      zIndex: 10 - i
                    }}
                    animate={{ 
                      y: [0, -5, 0],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      delay: i * 0.5 
                    }}
                  />
                ))}
              </div>
              <p className="mt-4 text-center text-xs text-white/40 font-display font-bold uppercase tracking-widest">
                深度残差网络层: 152 层
              </p>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
