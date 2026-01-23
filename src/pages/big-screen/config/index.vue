<template>
    <div class="screen-config">
        <!-- 顶部工具栏 -->
        <div class="config-toolbar">
            <h1>大屏可视化配置</h1>
            <div class="toolbar-actions">
                <button class="btn btn-primary" @click="saveConfig">保存配置</button>
                <button class="btn btn-secondary" @click="previewConfig">预览</button>
                <button class="btn btn-secondary" @click="loadConfigFromLocal">加载配置</button>
                <button class="btn btn-danger" @click="resetConfig">重置</button>
            </div>
        </div>

        <!-- 配置界面主体 -->
        <div class="config-main">
            <!-- 左侧组件库 -->
            <div class="component-library">
                <h2>组件库</h2>
                <div class="library-items">
                    <div
                        v-for="item in componentLibrary"
                        :key="item.id"
                        class="library-item"
                        draggable="true"
                        @dragstart="handleDragStart($event, item.type)"
                    >
                        <div class="item-icon">{{ item.icon }}</div>
                        <div class="item-info">
                            <div class="item-name">{{ item.name }}</div>
                            <div class="item-description">{{ item.description }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 中央画布 -->
            <div class="screen-canvas" ref="canvasRef">
                <div class="canvas-content">
                    <!-- 大屏预览 -->
                    <div class="screen-preview" :class="currentConfig?.theme">
                        <!-- 头部 -->
                        <div class="screen-header">
                            <h1 class="screen-logo">
                                <span>{{ currentConfig?.title || '大屏效果' }}</span>
                            </h1>
                            <div class="screen-header-title">
                                {{ currentConfig?.title || '大屏效果' }}
                            </div>
                        </div>

                        <!-- 主内容区 -->
                        <div
                            class="screen-main"
                            @drop="handleDrop"
                            @dragover="handleDragOver"
                            @dragenter.prevent
                        >
                            <!-- 组件容器 -->
                            <div
                                v-for="component in currentConfig?.components"
                                :key="component.id"
                                class="screen-component"
                                :ref="(el) => setComponentRef(el as HTMLElement, component.id)"
                                :style="{
                                    left: component.position.x + 'px',
                                    top: component.position.y + 'px',
                                    width: component.size.width + 'px',
                                    height: component.size.height + 'px'
                                }"
                                @click="editComponent(component.id)"
                            >
                                <!-- 组件内容 -->
                                <div class="component-content">
                                    <div class="component-name">{{ component.name }}</div>
                                    <div class="component-type">{{ component.type }}</div>
                                </div>

                                <!-- 调整大小手柄 -->
                                <div class="resize-handles">
                                    <div class="resize-handle resize-nw"></div>
                                    <div class="resize-handle resize-n"></div>
                                    <div class="resize-handle resize-ne"></div>
                                    <div class="resize-handle resize-e"></div>
                                    <div class="resize-handle resize-se"></div>
                                    <div class="resize-handle resize-s"></div>
                                    <div class="resize-handle resize-sw"></div>
                                    <div class="resize-handle resize-w"></div>
                                </div>

                                <!-- 组件操作栏 -->
                                <div class="component-actions">
                                    <button class="action-btn" @click="editComponent(component.id)">
                                        编辑
                                    </button>
                                    <button
                                        class="action-btn delete-btn"
                                        @click="deleteComponent(component.id)"
                                    >
                                        删除
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 右侧属性面板 -->
            <div class="property-panel">
                <h2>属性设置</h2>

                <!-- 大屏属性 -->
                <div class="panel-section">
                    <h3>大屏属性</h3>
                    <div class="form-group">
                        <label>大屏名称</label>
                        <input
                            type="text"
                            v-model="configName"
                            @input="updateConfigName"
                            class="form-control"
                        />
                    </div>
                    <div class="form-group">
                        <label>主题</label>
                        <select
                            v-model="configTheme"
                            @change="updateConfigTheme"
                            class="form-control"
                        >
                            <option value="dark">深色主题</option>
                            <option value="light">浅色主题</option>
                            <option value="blue">蓝色主题</option>
                            <option value="green">绿色主题</option>
                            <option value="purple">紫色主题</option>
                        </select>
                    </div>
                </div>

                <!-- 组件属性 -->
                <div v-if="selectedComponent" class="panel-section">
                    <h3>组件属性</h3>
                    <div class="form-group">
                        <label>组件名称</label>
                        <input
                            type="text"
                            v-model="selectedComponent.name"
                            @input="
                                updateComponent(selectedComponent.id, {
                                    name: selectedComponent.name
                                })
                            "
                            class="form-control"
                        />
                    </div>
                    <div class="form-group">
                        <label>组件类型</label>
                        <input
                            type="text"
                            :value="selectedComponent.type"
                            disabled
                            class="form-control disabled"
                        />
                    </div>
                    <div class="form-group">
                        <label>位置</label>
                        <div class="form-row">
                            <input
                                type="number"
                                v-model.number="selectedComponent.position.x"
                                @input="
                                    updateComponentPosition(
                                        selectedComponent.id,
                                        selectedComponent.position
                                    )
                                "
                                class="form-control"
                                placeholder="X"
                            />
                            <input
                                type="number"
                                v-model.number="selectedComponent.position.y"
                                @input="
                                    updateComponentPosition(
                                        selectedComponent.id,
                                        selectedComponent.position
                                    )
                                "
                                class="form-control"
                                placeholder="Y"
                            />
                        </div>
                    </div>
                    <div class="form-group">
                        <label>尺寸</label>
                        <div class="form-row">
                            <input
                                type="number"
                                v-model.number="selectedComponent.size.width"
                                @input="
                                    updateComponentSize(
                                        selectedComponent.id,
                                        selectedComponent.size
                                    )
                                "
                                class="form-control"
                                placeholder="宽度"
                            />
                            <input
                                type="number"
                                v-model.number="selectedComponent.size.height"
                                @input="
                                    updateComponentSize(
                                        selectedComponent.id,
                                        selectedComponent.size
                                    )
                                "
                                class="form-control"
                                placeholder="高度"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- 预览弹框组件 -->
    <PreviewModal :visible="showPreviewModal" :config="currentConfig" @close="closePreviewModal" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useDraggable, useComponentDrag } from '@/hooks/use-draggable';
import { useScreenConfigStore } from '@/stores/pages/screen-config';
import PreviewModal from '@/components/big-screen/PreviewModal.vue';

// 创建configStore实例
const configStore = useScreenConfigStore();

// 响应式数据
const canvasRef = ref<HTMLElement | null>(null);
const draggingComponent = ref<string | null>(null);
const selectedComponentId = ref<string | null>(null);
const componentRefs = ref<Map<string, HTMLElement>>(new Map());
const showPreviewModal = ref(false);

// 使用组件拖拽钩子
const { handleDragStart, handleDrop, handleDragOver } = useComponentDrag((type, x, y) => {
    configStore.addComponent(type, { x, y });
    // 重新初始化拖拽
    setTimeout(() => {
        initComponentDraggable();
    }, 100);
});

// 计算属性
const currentConfig = computed(() => configStore.currentConfig);
const componentLibrary = computed(() => configStore.getComponentLibrary);
const selectedComponent = computed(() => {
    if (!selectedComponentId.value || !currentConfig.value) {
        return null;
    }
    return currentConfig.value.components.find((c) => c.id === selectedComponentId.value) || null;
});
const configName = ref('');
const configTheme = ref('dark');

// 生命周期
onMounted(() => {
    // 加载本地存储的配置
    const savedConfig = configStore.loadFromLocalStorage();
    if (savedConfig) {
        configName.value = savedConfig.name;
        configTheme.value = savedConfig.theme;
    } else {
        // 创建新配置
        const newConfig = configStore.createNewConfig('默认大屏');
        configName.value = newConfig.name;
        configTheme.value = newConfig.theme;
    }

    // 初始化组件拖拽
    initComponentDraggable();
});

// 初始化组件拖拽
const initComponentDraggable = () => {
    componentRefs.value.forEach((el, componentId) => {
        const { draggableRef, bindEvents } = useDraggable({
            onDragEnd: (event, x, y) => {
                configStore.updateComponentPosition(componentId, { x, y });
            },
            onResizeEnd: (event, width, height) => {
                configStore.updateComponentSize(componentId, { width, height });
            },
            restrict: {
                parent: true,
                minWidth: 100,
                minHeight: 100
            }
        });
        draggableRef.value = el;
        // 手动绑定事件监听器
        bindEvents();
    });
};

// 设置组件引用
const setComponentRef = (el: HTMLElement | null, componentId: string) => {
    if (el) {
        componentRefs.value.set(componentId, el);
    } else {
        componentRefs.value.delete(componentId);
    }
};

// 配置相关方法
const saveConfig = () => {
    const saved = configStore.saveConfig();
    if (saved) {
        alert('配置保存成功！');
    }
};

const previewConfig = () => {
    // 打开预览弹框
    showPreviewModal.value = true;
};

const closePreviewModal = () => {
    // 关闭预览弹框
    showPreviewModal.value = false;
};

const loadConfigFromLocal = () => {
    const loaded = configStore.loadFromLocalStorage();
    if (loaded) {
        configName.value = loaded.name;
        configTheme.value = loaded.theme;
        alert('配置加载成功！');
    } else {
        alert('没有找到保存的配置！');
    }
};

const resetConfig = () => {
    if (confirm('确定要重置配置吗？')) {
        configStore.createNewConfig('默认大屏');
        configName.value = '默认大屏';
        configTheme.value = 'dark';
        selectedComponentId.value = null;
    }
};

// 更新配置
const updateConfigName = () => {
    if (currentConfig.value) {
        configStore.updateConfig({ name: configName.value });
    }
};

const updateConfigTheme = () => {
    if (currentConfig.value) {
        configStore.updateTheme(configTheme.value);
    }
};

// 组件相关方法
const editComponent = (componentId: string) => {
    selectedComponentId.value = componentId;
};

const deleteComponent = (componentId: string) => {
    if (confirm('确定要删除这个组件吗？')) {
        configStore.removeComponent(componentId);
        if (selectedComponentId.value === componentId) {
            selectedComponentId.value = null;
        }
    }
};

const updateComponent = (componentId: string, updates: any) => {
    configStore.updateComponent(componentId, updates);
};

const updateComponentPosition = (componentId: string, position: { x: number; y: number }) => {
    configStore.updateComponentPosition(componentId, position);
};

const updateComponentSize = (componentId: string, size: { width: number; height: number }) => {
    configStore.updateComponentSize(componentId, size);
};
</script>

<style lang="scss" scoped>
.screen-config {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #f0f2f5;
}

// 工具栏
.config-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    background-color: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    h1 {
        margin: 0;
        font-size: 20px;
        color: #333;
    }
    .toolbar-actions {
        display: flex;
        gap: 12px;
    }
    .btn {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.3s;
        &.btn-primary {
            background-color: #1890ff;
            color: #fff;
            &:hover {
                background-color: #40a9ff;
            }
        }
        &.btn-secondary {
            background-color: #f0f0f0;
            color: #333;
            &:hover {
                background-color: #e0e0e0;
            }
        }
        &.btn-danger {
            background-color: #ff4d4f;
            color: #fff;
            &:hover {
                background-color: #ff7875;
            }
        }
    }
}

/* 主内容区 */
.config-main {
    flex: 1;
    display: flex;
    overflow: hidden;
}

/* 组件库 */
.component-library {
    width: 300px;
    background-color: #fff;
    border-right: 1px solid #e8e8e8;
    padding: 16px;
    overflow-y: auto;
    h2 {
        margin: 0 0 16px 0;
        font-size: 16px;
        color: #333;
    }
    .library-items {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    .library-item {
        display: flex;
        align-items: center;
        padding: 12px;
        border: 1px solid #e8e8e8;
        border-radius: 4px;
        background-color: #fafafa;
        cursor: grab;
        transition: all 0.3s;
        &:hover {
            background-color: #f0f0f0;
            border-color: #1890ff;
        }
        &:active {
            cursor: grabbing;
        }
        .item-icon {
            font-size: 24px;
            margin-right: 12px;
        }
        .item-info {
            flex: 1;
        }
        .item-name {
            font-size: 14px;
            font-weight: 500;
            color: #333;
            margin-bottom: 4px;
        }
        .item-description {
            font-size: 12px;
            color: #999;
        }
    }
}

/* 画布 */
.screen-canvas {
    flex: 1;
    background-color: #f0f2f5;
    padding: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: auto;
    .canvas-content {
        position: relative;
    }
    .screen-preview {
        width: 1200px;
        height: 800px;
        background-color: #1a1a1a;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        overflow: hidden;
        position: relative;
        &.light {
            background-color: #f5f5f5;
        }
        &.blue {
            background-color: #0a0f1e;
        }
        &.green {
            background-color: #122019;
        }
        &.purple {
            background-color: #1e142d;
        }
    }
    .screen-header {
        height: 72px;
        background-color: rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        padding: 0 24px;
        .screen-logo {
            margin: 0;
            font-size: 18px;
            color: #fff;
        }
        .screen-header-title {
            flex: 1;
            text-align: center;
            font-size: 24px;
            font-weight: 500;
            color: #fff;
        }
    }
    .screen-main {
        flex: 1;
        padding: 24px;
        position: relative;
        min-height: 656px;
    }
    .screen-component {
        position: absolute;
        border: 2px solid #1890ff;
        border-radius: 4px;
        background-color: rgba(24, 144, 255, 0.1);
        cursor: move;
        transition: all 0.3s;
        &:hover {
            box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.5);
        }
        .component-content {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 16px;
            color: #fff;
        }
        .component-name {
            font-size: 16px;
            font-weight: 500;
            margin-bottom: 8px;
        }
        .component-type {
            font-size: 12px;
            color: #999;
        }
        .resize-handles {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
        }
        .resize-handle {
            position: absolute;
            width: 8px;
            height: 8px;
            background-color: #1890ff;
            border: 1px solid #fff;
            pointer-events: auto;
            cursor: nwse-resize;
        }
        .resize-nw {
            top: -4px;
            left: -4px;
            cursor: nwse-resize;
        }
        .resize-n {
            top: -4px;
            left: 50%;
            transform: translateX(-50%);
            cursor: ns-resize;
        }
        .resize-ne {
            top: -4px;
            right: -4px;
            cursor: nesw-resize;
        }
        .resize-e {
            top: 50%;
            right: -4px;
            transform: translateY(-50%);
            cursor: ew-resize;
        }
        .resize-se {
            bottom: -4px;
            right: -4px;
            cursor: nwse-resize;
        }
        .resize-s {
            bottom: -4px;
            left: 50%;
            transform: translateX(-50%);
            cursor: ns-resize;
        }
        .resize-sw {
            bottom: -4px;
            left: -4px;
            cursor: nesw-resize;
        }
        .resize-w {
            top: 50%;
            left: -4px;
            transform: translateY(-50%);
            cursor: ew-resize;
        }
        .component-actions {
            position: absolute;
            top: -32px;
            right: 0;
            display: flex;
            gap: 8px;
            .action-btn {
                padding: 4px 8px;
                border: none;
                border-radius: 4px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.3s;
                &:hover {
                    opacity: 0.8;
                }
                &.delete-btn {
                    background-color: #ff4d4f;
                    color: #fff;
                }
            }
        }
    }
}

/* 属性面板 */
.property-panel {
    width: 300px;
    background-color: #fff;
    border-left: 1px solid #e8e8e8;
    padding: 16px;
    overflow-y: auto;
    h2 {
        margin: 0 0 16px 0;
        font-size: 16px;
        color: #333;
    }
    h3 {
        margin: 0 0 12px 0;
        font-size: 14px;
        color: #666;
    }
    .panel-section {
        margin-bottom: 24px;
        padding-bottom: 16px;
        border-bottom: 1px solid #e8e8e8;
        &:last-child {
            border-bottom: none;
        }
    }
    .form-group {
        margin-bottom: 12px;
        label {
            display: block;
            font-size: 14px;
            color: #666;
            margin-bottom: 4px;
        }
        .form-control {
            width: 100%;
            padding: 8px;
            border: 1px solid #e8e8e8;
            border-radius: 4px;
            font-size: 14px;
            transition: all 0.3s;
            &:focus {
                outline: none;
                border-color: #1890ff;
                box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
            }
            &.disabled {
                background-color: #f5f5f5;
                color: #999;
                cursor: not-allowed;
            }
        }
        .form-row {
            display: flex;
            gap: 8px;
            .form-control {
                flex: 1;
            }
        }
    }
}

/* 画布样式 */
.screen-canvas {
    width: 100%;
    height: 100%;
    background-color: #f0f0f0;
    border-radius: 8px;
    overflow: hidden;
    position: relative;

    .canvas-content {
        width: 100%;
        height: 100%;
    }
}
</style>
