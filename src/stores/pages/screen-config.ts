import { defineStore } from 'pinia';
import { ScreenConfig, ScreenComponent, ComponentLibraryItem } from '@/types/screen-config';
import { v4 as uuidv4 } from 'uuid';

// 组件库定义
const componentLibrary: ComponentLibraryItem[] = [
    {
        id: 'chart-line',
        type: 'chart-line',
        name: '折线图',
        description: '用于展示数据趋势',
        icon: '📈',
        defaultProps: {
            title: '折线图',
            data: []
        }
    },
    {
        id: 'chart-bar',
        type: 'chart-bar',
        name: '柱状图',
        description: '用于比较不同类别的数据',
        icon: '📊',
        defaultProps: {
            title: '柱状图',
            data: []
        }
    },
    {
        id: 'chart-pie',
        type: 'chart-pie',
        name: '饼图',
        description: '用于展示部分与整体的关系',
        icon: '🥧',
        defaultProps: {
            title: '饼图',
            data: []
        }
    },
    {
        id: 'map',
        type: 'map',
        name: '地图',
        description: '用于展示地理数据',
        icon: '🗺️',
        defaultProps: {
            title: '地图',
            data: []
        }
    },
    {
        id: 'number',
        type: 'number',
        name: '数字卡片',
        description: '用于展示关键数字',
        icon: '🔢',
        defaultProps: {
            title: '数字卡片',
            value: 0
        }
    },
    {
        id: 'text',
        type: 'text',
        name: '文本',
        description: '用于展示文本信息',
        icon: '📝',
        defaultProps: {
            content: '文本内容'
        }
    }
];

export const useScreenConfigStore = defineStore('screenConfig', {
    state: () => ({
        // 当前配置
        currentConfig: null as ScreenConfig | null,
        // 组件库
        componentLibrary,
        // 配置历史
        configHistory: [] as ScreenConfig[],
        // 是否处于编辑模式
        isEditMode: false
    }),
    getters: {
        // 获取当前配置的组件列表
        getComponents: (state) => state.currentConfig?.components || [],
        // 获取组件库
        getComponentLibrary: (state) => state.componentLibrary
    },
    actions: {
        // 创建新配置
        createNewConfig(name: string) {
            const newConfig: ScreenConfig = {
                id: uuidv4(),
                name,
                components: [],
                theme: 'dark',
                title: name,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            this.currentConfig = newConfig;
            this.configHistory.push(newConfig);
            return newConfig;
        },

        // 加载配置
        loadConfig(config: ScreenConfig) {
            this.currentConfig = config;
        },

        // 保存配置
        saveConfig() {
            if (this.currentConfig) {
                this.currentConfig.updatedAt = new Date().toISOString();
                // 这里可以添加保存到本地存储或服务器的逻辑
                localStorage.setItem('screenConfig', JSON.stringify(this.currentConfig));
                return this.currentConfig;
            }
            return null;
        },

        // 从本地存储加载配置
        loadFromLocalStorage() {
            const savedConfig = localStorage.getItem('screenConfig');
            if (savedConfig) {
                try {
                    const config = JSON.parse(savedConfig) as ScreenConfig;
                    this.loadConfig(config);
                    return config;
                } catch (error) {
                    console.error('Failed to load config from localStorage:', error);
                }
            }
            return null;
        },

        // 添加组件
        addComponent(type: string, position: { x: number; y: number }) {
            if (!this.currentConfig) return null;

            const libraryItem = this.componentLibrary.find((item) => item.type === type);
            if (!libraryItem) return null;

            const newComponent: ScreenComponent = {
                id: uuidv4(),
                type,
                name: libraryItem.name,
                position,
                size: {
                    width: 200,
                    height: 200
                },
                props: { ...libraryItem.defaultProps },
                visible: true
            };

            this.currentConfig.components.push(newComponent);
            this.saveConfig();
            return newComponent;
        },

        // 更新组件
        updateComponent(id: string, updates: Partial<ScreenComponent>) {
            if (!this.currentConfig) return false;

            const index = this.currentConfig.components.findIndex((comp) => comp.id === id);
            if (index === -1) return false;

            this.currentConfig.components[index] = {
                ...this.currentConfig.components[index],
                ...updates
            };
            this.saveConfig();
            return true;
        },

        // 删除组件
        removeComponent(id: string) {
            if (!this.currentConfig) return false;

            const index = this.currentConfig.components.findIndex((comp) => comp.id === id);
            if (index === -1) return false;

            this.currentConfig.components.splice(index, 1);
            this.saveConfig();
            return true;
        },

        // 更新组件位置
        updateComponentPosition(id: string, position: { x: number; y: number }) {
            return this.updateComponent(id, { position });
        },

        // 更新组件尺寸
        updateComponentSize(id: string, size: { width: number; height: number }) {
            return this.updateComponent(id, { size });
        },

        // 更新主题
        updateTheme(theme: string) {
            if (this.currentConfig) {
                this.currentConfig.theme = theme;
                this.saveConfig();
                return true;
            }
            return false;
        },

        // 更新标题
        updateTitle(title: string) {
            if (this.currentConfig) {
                this.currentConfig.title = title;
                this.saveConfig();
                return true;
            }
            return false;
        },

        // 更新配置
        updateConfig(updates: Partial<ScreenConfig>) {
            if (this.currentConfig) {
                this.currentConfig = {
                    ...this.currentConfig,
                    ...updates
                };
                this.saveConfig();
                return true;
            }
            return false;
        },

        // 设置编辑模式
        setEditMode(isEdit: boolean) {
            this.isEditMode = isEdit;
        }
    }
});
