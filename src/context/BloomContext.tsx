import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GalleryItem, SpeciesCase } from '../types';

interface BloomContextType {
  galleryItems: GalleryItem[];
  archiveItems: SpeciesCase[];
  publishToGallery: (item: Omit<GalleryItem, 'id'>) => void;
  publishToArchive: (item: Omit<SpeciesCase, 'id'>) => void;
}

const BloomContext = createContext<BloomContextType | undefined>(undefined);

export const useBloom = () => {
  const context = useContext(BloomContext);
  if (!context) {
    throw new Error('useBloom must be used within a BloomProvider');
  }
  return context;
};

const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: '1',
    title: '水晶兰',
    description: '有机几何与数字透明度的融合。',
    imageUrl: 'https://i.postimg.cc/TYFQPNwC/jie-ping2026-03-27-shang-wu11-14-16.png',
    artist: 'Bloom AI v2.4',
    tags: ['空灵', '结构化']
  },
  {
    id: '2',
    title: '液态蕨类',
    description: '流体动力学应用于植物生长模式。',
    imageUrl: 'https://i.postimg.cc/tTswfZm3/jie-ping2026-03-27-shang-wu11-20-46.png',
    artist: 'Neural Seed',
    tags: ['流体', '有机']
  },
  {
    id: '3',
    title: '霓虹菌丝',
    description: '受地下网络启发的生物发光结构。',
    imageUrl: 'https://i.postimg.cc/tg5M7d8B/jie-ping2026-03-27-shang-wu11-20-51.png',
    artist: 'Bloom AI v2.4',
    tags: ['发光', '网络']
  }
];

const INITIAL_ARCHIVE: SpeciesCase[] = [
  {
    id: 1,
    title: "以太牡丹 (Aether Peony)",
    category: "高维晶体",
    image: "https://i.postimg.cc/fT8LDYgx/lai-kan-wo-de-xin-zuo-pin-4-bu-yuan-tou-lu-xing-ming-de-liang-sheng-lai-zi-xiao-hong-shu-wang-ye-ban.jpg",
    stats: { stability: "98%", growth: "12h", energy: "High" },
    description: "通过量子纠缠合成的半透明花卉，花瓣具有自发光特性。这种植物不依赖光合作用，而是直接从背景辐射中提取能量。",
    technicalData: {
      dnaResonance: "94.2 Hz",
      neuralComplexity: "Level 7",
      quantumState: "Superposed",
      originSector: "Alpha-9"
    }
  },
  {
    id: 2,
    title: "液态星云草 (Nebula Fern)",
    category: "流体动力",
    image: "https://i.postimg.cc/1XPxNY4y/lai-kan-wo-de-xin-zuo-pin-3-bu-yuan-tou-lu-xing-ming-de-liang-sheng-lai-zi-xiao-hong-shu-wang-ye-ban.jpg",
    stats: { stability: "85%", growth: "4h", energy: "Medium" },
    description: "在零重力环境下模拟生成的流体植物，其形态随环境声波波动。它的叶片实际上是高度浓缩的星际气体云。",
    technicalData: {
      dnaResonance: "42.8 Hz",
      neuralComplexity: "Level 4",
      quantumState: "Fluidic",
      originSector: "Nebula-X"
    }
  },
  {
    id: 3,
    title: "分形曼陀罗 (Fractal Mandala)",
    category: "几何结构",
    image: "https://i.postimg.cc/HL2kx56b/lai-kan-wo-de-xin-zuo-pin-1-bu-yuan-tou-lu-xing-ming-de-liang-sheng-lai-zi-xiao-hong-shu-wang-ye-ban.jpg",
    stats: { stability: "99%", growth: "72h", energy: "Extreme" },
    description: "基于曼德博集合生成的无限嵌套花卉，具有完美的数学对称性。每一层花瓣在微观下都包含着完整的植株结构。",
    technicalData: {
      dnaResonance: "108.0 Hz",
      neuralComplexity: "Level 9",
      quantumState: "Recursive",
      originSector: "Geometry-Prime"
    }
  },
  {
    id: 4,
    title: "深渊珊瑚兰 (Abyssal Orchid)",
    category: "生物荧光",
    image: "https://i.postimg.cc/fT8LDYgx/lai-kan-wo-de-xin-zuo-pin-4-bu-yuan-tou-lu-xing-ming-de-liang-sheng-lai-zi-xiao-hong-shu-wang-ye-ban.jpg",
    stats: { stability: "92%", growth: "24h", energy: "Low" },
    description: "模拟深海极端环境生成的耐压植物，能吸收暗物质转化为可见光。它的根系能深入虚拟土壤的底层架构中。",
    technicalData: {
      dnaResonance: "12.5 Hz",
      neuralComplexity: "Level 5",
      quantumState: "Stable",
      originSector: "Deep-Void"
    }
  },
  {
    id: 5,
    title: "等离子向日葵 (Plasma Bloom)",
    category: "能量实体",
    image: "https://i.postimg.cc/1XLRg1bN/Gemini-Generated-Image-ppj1rlppj1rlppj1.png",
    stats: { stability: "70%", growth: "1h", energy: "Critical" },
    description: "由约束等离子体构成的瞬时花卉，是 Bloom 引擎极限性能的体现。它的存在极不稳定，但能释放出巨大的视觉能量。",
    technicalData: {
      dnaResonance: "880.0 Hz",
      neuralComplexity: "Level 8",
      quantumState: "Volatile",
      originSector: "Core-Engine"
    }
  },
  {
    id: 6,
    title: "极光苔藓 (Aurora Moss)",
    category: "大气现象",
    image: "https://i.postimg.cc/L5dLpwvt/jie-ping2026-03-27-shang-wu11-15-13.png",
    stats: { stability: "95%", growth: "48h", energy: "Stable" },
    description: "捕获极光粒子后在虚拟土壤中培育的共生植被。它能随着大气电荷的变化而改变颜色，形成流动的色彩景观。",
    technicalData: {
      dnaResonance: "64.1 Hz",
      neuralComplexity: "Level 3",
      quantumState: "Atmospheric",
      originSector: "Polar-Sky"
    }
  }
];

export const BloomProvider = ({ children }: { children: ReactNode }) => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(INITIAL_GALLERY);
  const [archiveItems, setArchiveItems] = useState<SpeciesCase[]>(INITIAL_ARCHIVE);

  const publishToGallery = (item: Omit<GalleryItem, 'id'>) => {
    const newItem: GalleryItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
    };
    setGalleryItems(prev => [newItem, ...prev]);
  };

  const publishToArchive = (item: Omit<SpeciesCase, 'id'>) => {
    const newItem: SpeciesCase = {
      ...item,
      id: archiveItems.length + 1,
    };
    setArchiveItems(prev => [newItem, ...prev]);
  };

  return (
    <BloomContext.Provider value={{ galleryItems, archiveItems, publishToGallery, publishToArchive }}>
      {children}
    </BloomContext.Provider>
  );
};
