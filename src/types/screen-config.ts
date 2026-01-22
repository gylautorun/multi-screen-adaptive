// 大屏配置相关类型定义

// 组件位置接口
export interface ComponentPosition {
  x: number;
  y: number;
}

// 组件尺寸接口
export interface ComponentSize {
  width: number;
  height: number;
}

// 大屏组件接口
export interface ScreenComponent {
  id: string;
  type: string; // 组件类型
  name: string; // 组件名称
  position: ComponentPosition;
  size: ComponentSize;
  props: Record<string, any>; // 组件属性
  visible: boolean; // 是否可见
}

// 大屏配置接口
export interface ScreenConfig {
  id: string;
  name: string;
  components: ScreenComponent[];
  theme: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

// 组件库项接口
export interface ComponentLibraryItem {
  id: string;
  type: string;
  name: string;
  description: string;
  icon: string;
  defaultProps: Record<string, any>;
}
