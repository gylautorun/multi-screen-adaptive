import { defineStore } from 'pinia';
import { GlobalState } from '@/stores/type';
import piniaPersistConfig from '@/config/pinia-persist';

// defineStore 调用后返回一个函数，调用该函数获得 Store 实体
export const useGlobalStore = defineStore({
    // id: 必须的，在所有 Store 中唯一
    id: 'global',
    state: (): GlobalState => ({
        // 刷新页面
        refreshPage: true,
        // 全局loading
        loading: false,
        language: 'zh_CN'
    }),
    getters: {
        // 类 mobx computed
        // active():boolean {
        //     return this.showSider;
        // },
    },
    actions: {
        // Set GlobalState
        setGlobalState(key: keyof GlobalState, val: unknown) {
            this.$patch({ [key]: val });
        }
    },
    persist: piniaPersistConfig('global')
});
