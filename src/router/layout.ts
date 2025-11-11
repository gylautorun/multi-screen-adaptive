import { Router } from 'vue-router';

// 布局预设配置
export const LAYOUT_PRESETS = {
    // 仅内容模式 - 只显示内容区域
    contentOnly: {}
    // 其他模式不存在
} as const;

export type LayoutPreset = keyof typeof LAYOUT_PRESETS;

/**
 * 布局控制路由守卫
 * 根据路由元数据自动设置全局布局状态
 */
export function setupLayoutGuard(router: Router) {
    router.beforeEach((to, from, next) => {
        // const globalStore = useGlobalStore();

        // 获取路由元数据
        // const meta = to.meta as any;

        // if 判断修改预设值逻辑
        next();
    });
}
