import { defineStore } from 'pinia';
import darkIcon from '@/pages/big-screen/assets/screen/qiehuan_dark.png';
import lightIcon from '@/pages/big-screen/assets/screen/qiehuan_light.png';

export enum ScreenThemeEnum {
    Dark = 'dark',
    Light = 'light',
    Blue = 'blue',
    Green = 'green',
    Purple = 'purple'
}
export interface ScreenThemeParams {
    label: string;
    value: ScreenThemeEnum;
    icon?: string;
}

export const useScreenStore = defineStore('screen', {
    state: () => ({
        title: '大屏可视化',
        theme: ScreenThemeEnum.Dark
    }),
    getters: {
        getIconThemes(): ScreenThemeParams[] {
            return this.getAllThemes.filter((item) => !!item.icon);
        },
        getAllThemes(): ScreenThemeParams[] {
            return [
                {
                    value: ScreenThemeEnum.Dark,
                    label: '深色主题',
                    icon: darkIcon
                },
                {
                    value: ScreenThemeEnum.Light,
                    label: '浅色主题',
                    icon: lightIcon
                },
                {
                    value: ScreenThemeEnum.Blue,
                    label: '蓝色主题'
                },
                {
                    value: ScreenThemeEnum.Green,
                    label: '绿色主题'
                },
                {
                    value: ScreenThemeEnum.Purple,
                    label: '紫色主题'
                }
            ];
        },
        getCurrentThemeData(): ScreenThemeParams {
            return (
                this.getAllThemes.find((item) => item.value === this.theme) || this.getAllThemes[0]
            );
        }
    },
    actions: {
        setTheme(value: ScreenThemeEnum) {
            this.theme = value;
        }
    }
});
