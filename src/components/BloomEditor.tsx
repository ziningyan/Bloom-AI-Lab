import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Wand2, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Download, 
  Layers, 
  Palette,
  Sparkles,
  Loader2,
  X,
  Upload,
  Check,
  BookOpen,
  ExternalLink
} from 'lucide-react';
import { Stage, Layer, Rect, Circle, Image as KonvaImage, Transformer } from 'react-konva';
import useImage from 'use-image';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'motion/react';
import { CanvasElement, GeneratedImage, ElementType, GalleryItem, SpeciesCase } from '../types';
import { useBloom } from '../context/BloomContext';

const URL_IMAGE_MAP: Record<string, string> = {
  flower: 'https://i.postimg.cc/HL2kx56b/lai-kan-wo-de-xin-zuo-pin-1-bu-yuan-tou-lu-xing-ming-de-liang-sheng-lai-zi-xiao-hong-shu-wang-ye-ban.jpg',
  leaf: 'https://i.postimg.cc/tTswfZm3/jie-ping2026-03-27-shang-wu11-20-46.png',
  stem: 'https://i.postimg.cc/tg5M7d8B/jie-ping2026-03-27-shang-wu11-20-51.png',
};

const CanvasImage = ({ element, isSelected, onSelect, onChange }: { 
  element: CanvasElement; 
  isSelected: boolean; 
  onSelect: () => void;
  onChange: (newAttrs: Partial<CanvasElement>) => void;
}) => {
  const [img] = useImage(element.imageUrl || '');
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <KonvaImage
        image={img}
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...element}
        draggable
        onDragEnd={(e) => {
          onChange({
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
            rotation: node.rotation(),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

const CanvasShape = ({ element, isSelected, onSelect, onChange }: { 
  element: CanvasElement; 
  isSelected: boolean; 
  onSelect: () => void;
  onChange: (newAttrs: Partial<CanvasElement>) => void;
}) => {
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const ShapeComponent = element.type === 'flower' ? Circle : Rect;

  return (
    <>
      <ShapeComponent
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...element}
        draggable
        onDragEnd={(e) => {
          onChange({
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
            rotation: node.rotation(),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

export default function BloomEditor({ 
  onBack, 
  onViewGallery, 
  onViewArchive 
}: { 
  onBack: () => void;
  onViewGallery?: () => void;
  onViewArchive?: () => void;
}) {
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [gallery, setGallery] = useState<GeneratedImage[]>([]);
  const [activeTab, setActiveTab] = useState<'generate' | 'gallery' | 'layers'>('generate');
  const [canvasColor, setCanvasColor] = useState('#0a0a0a');
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [publishTarget, setPublishTarget] = useState<'gallery' | 'archive' | null>(null);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isGeneratingElement, setIsGeneratingElement] = useState<ElementType | null>(null);
  
  const { publishToGallery, publishToArchive } = useBloom();
  const stageRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth - 100;
        const containerHeight = containerRef.current.offsetHeight - 100;
        
        // Target 4:5 aspect ratio
        let width = containerWidth;
        let height = width * (5/4);
        
        if (height > containerHeight) {
          height = containerHeight;
          width = height * (4/5);
        }

        setStageSize({ width, height });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: `A sci-fi frosted glass botanical element, futuristic sci-fi aesthetic, holographic textures, frosted glass morphism, high detail, isolated on black background, cyberpunk botanical illustration, ${prompt}` }],
        },
        config: {
          imageConfig: { aspectRatio: "1:1" }
        }
      });

      let imageUrl = '';
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }

      if (imageUrl) {
        const newImg: GeneratedImage = {
          id: Math.random().toString(36).substr(2, 9),
          url: imageUrl,
          prompt,
          timestamp: Date.now(),
        };
        setGallery(prev => [newImg, ...prev]);
        setActiveTab('gallery');
      }
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const addElement = (type: ElementType, imageUrl?: string) => {
    const newElement: CanvasElement = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      x: stageSize.width / 2 - 300,
      y: stageSize.height / 2 - 300,
      width: 600,
      height: 600,
      rotation: 0,
      fill: type === 'flower' ? '#ffffff' : '#888888',
      imageUrl: imageUrl || (type === 'image' ? undefined : URL_IMAGE_MAP[type]),
      zIndex: elements.length,
    };
    setElements([...elements, newElement]);
    setSelectedId(newElement.id);
  };

  const generateAndAddElement = async (type: ElementType) => {
    if (isGeneratingElement) return;
    
    setIsGeneratingElement(type);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const promptMap = {
        flower: "A single artistic botanical illustration of a futuristic sci-fi flower, frosted glass morphism style, high detail, transparent petals, glowing holographic core, isolated on black background",
        leaf: "A single artistic botanical illustration of a futuristic sci-fi leaf, frosted glass morphism style, high detail, translucent veins, organic holographic curves, isolated on black background",
        stem: "A single artistic botanical illustration of a futuristic sci-fi plant stem, frosted glass morphism style, high detail, neon mycelium patterns, organic structure, isolated on black background",
        image: "A futuristic sci-fi botanical element, frosted glass style"
      };

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: promptMap[type] || `A futuristic botanical ${type}` }],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1"
          }
        }
      });

      let imageUrl = '';
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }

      if (imageUrl) {
        addElement(type, imageUrl);
      } else {
        // Fallback if AI fails
        addElement(type);
      }
    } catch (error) {
      console.error('Element generation failed:', error);
      addElement(type);
    } finally {
      setIsGeneratingElement(null);
    }
  };

  const updateElement = (id: string, newAttrs: Partial<CanvasElement>) => {
    setElements(elements.map(el => el.id === id ? { ...el, ...newAttrs } : el));
  };

  const deleteElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
    setSelectedId(null);
  };

  const handleExport = () => {
    if (stageRef.current) {
      const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = 'bloom-design.png';
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePublish = () => {
    if (!stageRef.current) return;
    setIsPublishModalOpen(true);
  };

  const confirmPublish = async () => {
    if (!stageRef.current || !publishTarget) return;
    
    setIsPublishing(true);
    try {
      const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 });
      
      if (publishTarget === 'gallery') {
        publishToGallery({
          title: prompt || '未命名设计',
          description: '由用户在 Bloom 设计室创作。',
          imageUrl: dataURL,
          artist: '匿名创作者',
          tags: ['用户创作', '新物种']
        });
      } else {
        // AI Vision for Archive Title and Description
        let aiTitle = prompt || '新演化实体';
        let aiDescription = '这是一份由用户通过神经引擎演化而来的新物种档案。';
        
        try {
          const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
          const base64Data = dataURL.split(',')[1];
          
          const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: [
              {
                parts: [
                  { text: "Analyze this botanical design and provide a poetic, artistic Chinese title (e.g., '绽放向日葵') and a short scientific description in Chinese. Format: Title: [Title] Description: [Description]" },
                  { inlineData: { data: base64Data, mimeType: 'image/png' } }
                ]
              }
            ]
          });

          const text = response.text;
          const titleMatch = text.match(/Title:\s*(.*)/i);
          const descMatch = text.match(/Description:\s*(.*)/i);
          
          if (titleMatch) aiTitle = titleMatch[1].trim();
          if (descMatch) aiDescription = descMatch[1].trim();
        } catch (e) {
          console.error('AI Vision failed for archive:', e);
        }

        publishToArchive({
          title: aiTitle,
          category: '用户演化',
          image: dataURL,
          stats: { stability: '88%', growth: '未知', energy: 'Stable' },
          description: aiDescription,
          technicalData: {
            dnaResonance: '55.5 Hz',
            neuralComplexity: 'Level 4',
            quantumState: 'User-Defined',
            originSector: 'Personal-Lab'
          }
        });
      }

      setPublishSuccess(true);
    } catch (error) {
      console.error('Publish failed:', error);
    } finally {
      setIsPublishing(false);
    }
  };

  const closePublishModal = () => {
    setIsPublishModalOpen(false);
    // Reset success state after animation finishes
    setTimeout(() => {
      setPublishSuccess(false);
      setPublishTarget(null);
    }, 300);
  };

  return (
    <div className="flex h-screen w-full bg-[#050505] text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 border-r border-white/10 flex flex-col liquid-glass-strong z-20">
        <div className="p-6 flex items-center gap-4 border-bottom border-white/10">
          <button 
            onClick={onBack}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-display font-bold tracking-tighter">设计工作室</h1>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          {[
            { id: 'generate', icon: Wand2, label: 'AI' },
            { id: 'gallery', icon: ImageIcon, label: '画廊' },
            { id: 'layers', icon: Layers, label: '图层' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-4 flex flex-col items-center gap-1 transition-colors ${
                activeTab === tab.id ? 'text-white bg-white/5' : 'text-white/40 hover:text-white/60'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span className="text-[10px] font-display font-bold uppercase tracking-[0.2em]">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'generate' && (
              <motion.div
                key="generate"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-display font-bold text-white/30 uppercase tracking-[0.2em]">提示词</label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="描述你的花卉愿景..."
                    className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-white/30 transition-colors resize-none"
                  />
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full py-4 bg-white text-black rounded-xl font-display font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isGenerating ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Sparkles className="h-5 w-5" />
                  )}
                  {isGenerating ? '正在生成...' : '生成设计'}
                </button>
              </motion.div>
            )}

            {activeTab === 'gallery' && (
              <motion.div
                key="gallery"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-display font-bold text-white/30 uppercase tracking-[0.2em]">你的画廊</span>
                  <label className="p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer">
                    <Plus className="h-4 w-4" />
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            const newImg: GeneratedImage = {
                              id: Math.random().toString(36).substr(2, 9),
                              url: ev.target?.result as string,
                              prompt: '上传的图片',
                              timestamp: Date.now(),
                            };
                            setGallery(prev => [newImg, ...prev]);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {gallery.length === 0 ? (
                    <div className="col-span-2 py-20 text-center text-white/30">
                      <ImageIcon className="h-10 w-10 mx-auto mb-4 opacity-20" />
                      <p className="text-sm">暂无设计</p>
                    </div>
                  ) : (
                    gallery.map(img => (
                      <div 
                        key={img.id}
                        className="group relative aspect-square rounded-xl overflow-hidden liquid-glass cursor-pointer"
                        onClick={() => addElement('image', img.url)}
                      >
                        <img src={img.url} alt={img.prompt} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Plus className="h-6 w-6" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'layers' && (
              <motion.div
                key="layers"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-2"
              >
                {elements.length === 0 ? (
                  <div className="py-20 text-center text-white/30">
                    <Layers className="h-10 w-10 mx-auto mb-4 opacity-20" />
                    <p className="text-sm">画布为空</p>
                  </div>
                ) : (
                  [...elements].reverse().map(el => (
                    <div 
                      key={el.id}
                      onClick={() => setSelectedId(el.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-colors cursor-pointer ${
                        selectedId === el.id ? 'bg-white/10' : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden">
                        {el.imageUrl ? (
                          <img src={el.imageUrl} className="w-full h-full object-cover" />
                        ) : (
                          <div className="h-4 w-4 rounded-full bg-white/20" />
                        )}
                      </div>
                      <span className="flex-1 text-[10px] font-display font-bold uppercase tracking-[0.2em] truncate">
                        {el.type} {el.id.substr(0, 4)}
                      </span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteElement(el.id);
                        }}
                        className="p-2 text-white/30 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick Tools */}
        <div className="p-6 border-t border-white/10 grid grid-cols-3 gap-2">
          <button 
            onClick={() => generateAndAddElement('flower')} 
            disabled={!!isGeneratingElement}
            className="liquid-glass p-3 rounded-xl flex flex-col items-center gap-1 hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            {isGeneratingElement === 'flower' ? (
              <Loader2 className="h-4 w-4 animate-spin text-white/40" />
            ) : (
              <div className="h-4 w-4 rounded-full bg-white/40" />
            )}
            <span className="text-[8px] font-display font-bold uppercase tracking-widest">花朵</span>
          </button>
          <button 
            onClick={() => generateAndAddElement('leaf')} 
            disabled={!!isGeneratingElement}
            className="liquid-glass p-3 rounded-xl flex flex-col items-center gap-1 hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            {isGeneratingElement === 'leaf' ? (
              <Loader2 className="h-4 w-4 animate-spin text-white/40" />
            ) : (
              <div className="h-4 w-2 rounded-full bg-white/40 rotate-45" />
            )}
            <span className="text-[8px] font-display font-bold uppercase tracking-widest">叶子</span>
          </button>
          <button 
            onClick={() => generateAndAddElement('stem')} 
            disabled={!!isGeneratingElement}
            className="liquid-glass p-3 rounded-xl flex flex-col items-center gap-1 hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            {isGeneratingElement === 'stem' ? (
              <Loader2 className="h-4 w-4 animate-spin text-white/40" />
            ) : (
              <div className="h-4 w-1 bg-white/40" />
            )}
            <span className="text-[8px] font-display font-bold uppercase tracking-widest">茎</span>
          </button>
        </div>
      </aside>

      {/* Canvas Area */}
      <main className="flex-1 relative flex flex-col">
        {/* Toolbar */}
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 z-10 liquid-glass">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Palette className="h-4 w-4 text-white/40" />
              <input 
                type="color" 
                value={canvasColor}
                onChange={(e) => setCanvasColor(e.target.value)}
                className="w-6 h-6 rounded-full bg-transparent border-none cursor-pointer"
              />
            </div>
            <div className="h-4 w-[1px] bg-white/10" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-display font-bold text-white/30 uppercase tracking-[0.2em]">缩放</span>
              <span className="text-xs font-mono font-medium">100%</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={handlePublish}
              className="liquid-glass-strong px-6 py-2 rounded-full text-xs font-display font-bold uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all"
            >
              <Upload className="h-4 w-4" />
              发布作品
            </button>
            <button 
              onClick={handleExport}
              className="liquid-glass px-6 py-2 rounded-full text-xs font-display font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-white/5 transition-all"
            >
              <Download className="h-4 w-4" />
              导出设计
            </button>
          </div>
        </header>

        {/* Stage */}
        <div 
          ref={containerRef}
          className="flex-1 bg-black overflow-hidden flex items-center justify-center p-12"
          onClick={() => setSelectedId(null)}
        >
          <div 
            className="shadow-2xl rounded-2xl overflow-hidden"
            style={{ backgroundColor: canvasColor }}
            onClick={(e) => e.stopPropagation()}
          >
            <Stage
              width={stageSize.width}
              height={stageSize.height}
              ref={stageRef}
              onMouseDown={(e) => {
                if (e.target === e.target.getStage()) {
                  setSelectedId(null);
                }
              }}
            >
              <Layer>
                <Rect 
                  width={stageSize.width} 
                  height={stageSize.height} 
                  fill={canvasColor} 
                />
                {elements.map((el) => {
                  if (el.type === 'image' || el.imageUrl) {
                    return (
                      <CanvasImage
                        key={el.id}
                        element={el}
                        isSelected={el.id === selectedId}
                        onSelect={() => setSelectedId(el.id)}
                        onChange={(newAttrs) => updateElement(el.id, newAttrs)}
                      />
                    );
                  }
                  return (
                    <CanvasShape
                      key={el.id}
                      element={el}
                      isSelected={el.id === selectedId}
                      onSelect={() => setSelectedId(el.id)}
                      onChange={(newAttrs) => updateElement(el.id, newAttrs)}
                    />
                  );
                })}
              </Layer>
            </Stage>
          </div>
        </div>

        {/* Selection Info */}
        {selectedId && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 liquid-glass-strong rounded-2xl p-4 flex items-center gap-6 z-10"
          >
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-display font-bold text-white/30 uppercase tracking-[0.2em]">位置</span>
              <div className="flex gap-2 text-[10px] font-mono">
                <span className="bg-white/5 px-2 py-1 rounded border border-white/5">X: {Math.round(elements.find(e => e.id === selectedId)?.x || 0)}</span>
                <span className="bg-white/5 px-2 py-1 rounded border border-white/5">Y: {Math.round(elements.find(e => e.id === selectedId)?.y || 0)}</span>
              </div>
            </div>
            <div className="h-4 w-[1px] bg-white/10" />
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-display font-bold text-white/30 uppercase tracking-[0.2em]">颜色</span>
              <input 
                type="color" 
                value={elements.find(e => e.id === selectedId)?.fill || '#ffffff'}
                onChange={(e) => updateElement(selectedId, { fill: e.target.value })}
                className="w-6 h-6 rounded-full bg-transparent border-none cursor-pointer"
              />
            </div>
            <div className="h-4 w-[1px] bg-white/10" />
            <button 
              onClick={async () => {
                if (!selectedId) return;
                const el = elements.find(e => e.id === selectedId);
                if (!el) return;
                
                setIsGenerating(true);
                try {
                  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
                  const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash-image',
                    contents: {
                      parts: [{ text: `A new version of this floral element: ${el.type}, liquid glass morphism style, botanical, highly detailed` }],
                    },
                    config: { imageConfig: { aspectRatio: "1:1" } }
                  });

                  let imageUrl = '';
                  for (const part of response.candidates?.[0]?.content?.parts || []) {
                    if (part.inlineData) {
                      imageUrl = `data:image/png;base64,${part.inlineData.data}`;
                      break;
                    }
                  }

                  if (imageUrl) {
                    updateElement(selectedId, { imageUrl, type: 'image' });
                  }
                } catch (error) {
                  console.error('Re-imagine failed:', error);
                } finally {
                  setIsGenerating(false);
                }
              }}
              disabled={isGenerating}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
              <span className="text-[10px] font-display font-bold uppercase tracking-[0.2em]">重新构想</span>
            </button>
            <div className="h-4 w-[1px] bg-white/10" />
            <button 
              onClick={() => deleteElement(selectedId)}
              className="p-2 text-white/40 hover:text-red-400 transition-colors"
            >
              <Trash2 className="h-5 w-5" />
            </button>
            <button 
              onClick={() => setSelectedId(null)}
              className="p-2 text-white/40 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        )}

        {/* Publish Modal */}
        <AnimatePresence>
          {isPublishModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closePublishModal}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-md liquid-glass-strong rounded-[2.5rem] p-8 overflow-hidden"
              >
                {publishSuccess ? (
                  <div className="py-12 text-center">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20 text-green-400">
                      <Check className="h-10 w-10" />
                    </div>
                    <h3 className="text-2xl font-display font-bold tracking-tight">发布成功！</h3>
                    <p className="mt-2 text-white/50">您的作品已成功同步到 {publishTarget === 'gallery' ? '艺术展览馆' : '生长档案'}。</p>
                    
                    <div className="mt-10 flex flex-col gap-3">
                      <button 
                        onClick={() => {
                          if (publishTarget === 'gallery') onViewGallery?.();
                          else onViewArchive?.();
                        }}
                        className="w-full liquid-glass-strong py-4 rounded-2xl font-display font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                      >
                        <ExternalLink className="h-4 w-4" />
                        立即去查看
                      </button>
                      <button 
                        onClick={closePublishModal}
                        className="w-full py-4 rounded-2xl font-display font-bold uppercase tracking-widest text-[10px] text-white/30 hover:text-white transition-colors"
                      >
                        留在编辑器
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-display font-bold tracking-tight">发布作品</h3>
                      <button onClick={closePublishModal} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <p className="text-sm text-white/50 mb-6">请选择您想要发布到的目标位置：</p>
                      
                      <button 
                        onClick={() => setPublishTarget('gallery')}
                        className={`w-full flex items-center gap-4 p-6 rounded-3xl border-2 transition-all ${
                          publishTarget === 'gallery' ? 'border-white bg-white/10' : 'border-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="h-12 w-12 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                          <Sparkles className="h-6 w-6" />
                        </div>
                        <div className="text-left">
                          <span className="block font-display font-bold uppercase tracking-widest text-xs">艺术展览馆</span>
                          <span className="text-[10px] text-white/40">展示您的艺术创意，供全球用户欣赏</span>
                        </div>
                      </button>

                      <button 
                        onClick={() => setPublishTarget('archive')}
                        className={`w-full flex items-center gap-4 p-6 rounded-3xl border-2 transition-all ${
                          publishTarget === 'archive' ? 'border-white bg-white/10' : 'border-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="h-12 w-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                          <BookOpen className="h-6 w-6" />
                        </div>
                        <div className="text-left">
                          <span className="block font-display font-bold uppercase tracking-widest text-xs">生长档案</span>
                          <span className="text-[10px] text-white/40">作为新物种记录，包含详细的演化数据</span>
                        </div>
                      </button>
                    </div>

                    <button 
                      disabled={!publishTarget || isPublishing}
                      onClick={confirmPublish}
                      className="w-full mt-8 liquid-glass-strong py-4 rounded-2xl font-display font-bold uppercase tracking-widest text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                    >
                      {isPublishing ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          正在分析并发布...
                        </>
                      ) : (
                        '确认发布'
                      )}
                    </button>
                  </>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
