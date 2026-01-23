<template>
    <el-dialog
        v-model="dialogVisible"
        title="大屏预览"
        width="90vw"
        height="90vh"
        :close-on-click-modal="true"
        @close="close"
        custom-class="preview-dialog"
    >
        <div class="preview-content">
            <div class="screen-preview" :class="config?.theme">
                <!-- 头部 -->
                <div class="screen-header">
                    <h1 class="screen-logo">
                        <span>{{ config?.title || '大屏效果' }}</span>
                    </h1>
                    <div class="screen-header-title">
                        {{ config?.title || '大屏效果' }}
                    </div>
                </div>

                <!-- 主内容区 -->
                <div class="screen-main">
                    <!-- 组件容器 -->
                    <div
                        v-for="component in config?.components"
                        :key="component.id"
                        class="screen-component"
                        :style="{
                            left: component.position.x + 'px',
                            top: component.position.y + 'px',
                            width: component.size.width + 'px',
                            height: component.size.height + 'px'
                        }"
                    >
                        <div class="component-content">
                            <div class="component-name">{{ component.name }}</div>
                            <div class="component-type">{{ component.type }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ScreenConfig } from '@/types/screen-config';

const props = defineProps<{
    visible: boolean;
    config: ScreenConfig | null;
}>();

const emit = defineEmits<{
    (e: 'close'): void;
}>();

const dialogVisible = computed({
    get: () => props.visible,
    set: (val) => {
        if (!val) {
            emit('close');
        }
    }
});

const close = () => {
    emit('close');
};
</script>

<style lang="scss" scoped>
/* 预览弹框样式 */
.preview-dialog {
    .el-dialog__header {
        padding: 16px 24px;
        border-bottom: 1px solid #e8e8e8;
    }

    .el-dialog__title {
        font-size: 18px;
        color: #333;
    }

    .el-dialog__body {
        padding: 24px;
        overflow: auto;
        height: calc(100vh - 160px);
    }
}

.preview-content {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    min-height: 800px;

    .screen-preview {
        width: 1200px;
        height: 800px;
        background-color: #1a1a1a;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        overflow: hidden;
        position: relative;
        transition: transform 0.3s;
        margin: 0 auto;

        &:hover {
            transform: scale(1.05);
        }

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
}

/* 组件样式 */
.screen-component {
    position: absolute;
    border: 2px solid #1890ff;
    border-radius: 4px;
    background-color: rgba(24, 144, 255, 0.1);
    cursor: move;
    transition: all 0.3s;

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
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 4px;
    }

    .component-type {
        font-size: 12px;
        opacity: 0.8;
    }
}

/* 大屏头部样式 */
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

/* 大屏主内容区样式 */
.screen-main {
    flex: 1;
    padding: 24px;
    position: relative;
    min-height: 656px;
}
</style>
