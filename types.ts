
export enum Category {
  Animals = '动物',
  FlowersBirds = '花鸟',
  People = '人物',
  Landscapes = '山水',
  Others = '其他'
}

export interface Embroidery {
  id: string;
  title: string;
  imageUrl: string;
  category: Category;
  description: string;
  needlework: string; // 针法
  displayOrder: number;
  createdAt: number;
}

export interface AIAnalysisResult {
  title: string;
  category: Category;
  description: string;
  needlework: string;
}
