import { ColorScheme } from '../types';

// 定义各种配色方案
const colorSchemes: Record<ColorScheme, string[]> = {
  original: [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
  ],
  rainbow: [
    '#FF6B6B', '#FF8E53', '#FFCE54', '#86C775', '#4ECDC4',
    '#45B7D1', '#96CEB4', '#C493DE', '#F78FBA', '#FF6B9D',
    '#FF9F68', '#FFD166', '#8AC926', '#1982C4', '#6A4C93'
  ],
  pastel: [
    '#FFADAD', '#FFD6A5', '#FDFFB6', '#CAFFBF', '#9BF6FF',
    '#A0C4FF', '#BDB2FF', '#FFC6FF', '#F8EDE3', '#E0E1DD',
    '#DBE2EF', '#ECE4E1', '#F9E7D9', '#E8D2CE', '#D3E0DC'
  ],
  professional: [
    '#2D3142', '#4F5D75', '#BFC0C0', '#EF8354', '#6F9EAF',
    '#5D5C61', '#7395AE', '#557A95', '#B1A296', '#5D5C61',
    '#374151', '#4B5563', '#6B7280', '#9CA3AF', '#D1D5DB'
  ],
  warm: [
    '#FF6B6B', '#FF8E53', '#FFCE54', '#F7DC6F', '#F8C471',
    '#E67E22', '#D35400', '#F39C12', '#F1C40F', '#F4D03F',
    '#EB984E', '#DC7633', '#E59866', '#F0B27A', '#F5CBA7'
  ],
  cool: [
    '#45B7D1', '#4ECDC4', '#96CEB4', '#85C1E9', '#5DADE2',
    '#3498DB', '#2980B9', '#8E44AD', '#9B59B6', '#AF7AC5',
    '#A569BD', '#5499C7', '#5DADE2', '#85C1E9', '#AED6F1'
  ]
};

// 根据课程名称生成稳定的哈希值
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// 根据配色方案和课程名称获取颜色
export function getColorForCourse(courseName: string, colorScheme: ColorScheme): string {
  // 如果是原始配色方案，则返回原始颜色（如果存在）
  if (colorScheme === 'original') {
    // 这里我们假定原始颜色已经存在于课程数据中
    // 如果没有，则使用默认配色方案
  }
  
  // 获取配色方案
  const scheme = colorSchemes[colorScheme];
  
  // 使用课程名称生成稳定的哈希值
  const hash = hashString(courseName);
  
  // 使用哈希值选择颜色
  const index = hash % scheme.length;
  
  return scheme[index];
}

// 获取所有可用的配色方案名称
export function getAvailableColorSchemes(): { id: ColorScheme; name: string }[] {
  return [
    { id: 'original', name: 'Original' },
    { id: 'rainbow', name: 'Rainbow' },
    { id: 'pastel', name: 'Pastel' },
    { id: 'professional', name: 'Professional' },
    { id: 'warm', name: 'Warm' },
    { id: 'cool', name: 'Cool' }
  ];
}