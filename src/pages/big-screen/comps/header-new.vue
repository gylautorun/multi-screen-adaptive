<template>
    <div class="big-screen-header">
        <h1 class="big-screen-logo">
            <span>大屏效果</span>
        </h1>
        <div class="big-screen-header-title">{{ store.title }}</div>
        <div class="big-screen-header-right">
            <div class="theme-select">
                <div class="custom-select" @click="toggleDropdown">
                    <span class="selected-value">{{ getSelectedThemeLabel }}</span>
                    <span class="select-arrow">▼</span>
                    <ul class="select-dropdown" v-show="isDropdownOpen">
                        <li
                            v-for="theme in allThemes"
                            :key="theme.value"
                            :value="theme.value"
                            @click="selectTheme(theme.value)"
                        >
                            {{ theme.label }}
                        </li>
                    </ul>
                </div>
            </div>
            <span class="datetime">{{ currentTime }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import dayjs from 'dayjs';
import { useScreenStore, ScreenThemeEnum } from '@/stores/pages/screen';
const store = useScreenStore();

const allThemes = computed(() => store.getAllThemes);
const selectedTheme = computed(() => store.theme);
const isDropdownOpen = ref(false);

// 获取当前选中主题的标签
const getSelectedThemeLabel = computed(() => {
    const theme = allThemes.value.find((item) => item.value === selectedTheme.value);
    return theme ? theme.label : '';
});

// 切换下拉菜单显示状态
const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value;
};

// 选择主题
const selectTheme = (value: ScreenThemeEnum) => {
    store.setTheme(value);
    isDropdownOpen.value = false;
};

// 点击外部关闭下拉菜单
const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.custom-select')) {
        isDropdownOpen.value = false;
    }
};

const currentTime = ref('');
const timeId = ref();
function startTime() {
    timeId.value = setTimeout(() => {
        currentTime.value = dayjs().format('YYYY-MM-DD HH:mm:ss');
        startTime();
    }, 1000);
}

onMounted(() => {
    startTime();
    document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
    clearTimeout(timeId.value);
    document.removeEventListener('click', handleClickOutside);
});
</script>

<style lang="scss" scoped>
.big-screen-header {
    // 使用screen.scale-size函数计算缩放后的尺寸
    --header-title-width: #{screen.scale-size(487px)};
    --header-title-letter-spacing: #{screen.scale-size(7px)};
    --header-title-text-shadow: 0px #{screen.scale-size(2px)} #{screen.scale-size(20px)}
        rgba(222, 171, 155, 0.6);

    position: relative;
    z-index: 10;
    width: 100%;
    height: var(--big-header-height);
    background-image: url('../assets/screen/header_border_dark.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    animation: fade 3s;
    &-title {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: var(--header-title-width);
        height: var(--big-header-height);
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: var(--big-font-title);
        font-weight: 500;
        letter-spacing: var(--header-title-letter-spacing);
        text-shadow: var(--header-title-text-shadow);
    }
    .big-screen-logo {
        display: flex;
        align-items: center;
        height: calc(var(--big-header-height) - var(--big-gap-small));
    }
    &-right {
        display: flex;
        align-items: center;
        position: absolute;
        right: 0px;
        top: 50%;
        transform: translateY(-80%);
        img {
            width: var(--big-icon-size);
            margin-right: var(--big-icon-margin);
            cursor: pointer;
            transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            &:hover {
                transform: scale(1.2);
            }
        }
        .theme-select {
            margin-right: var(--big-icon-margin);
            .custom-select {
                position: relative;
                display: inline-block;
                cursor: pointer;
                .selected-value {
                    display: inline-block;
                    padding: #{screen.scale-size(4px)} #{screen.scale-size(8px)};
                    font-size: var(--big-font-size);
                    border: 1px solid var(--big-border-color);
                    border-radius: var(--big-border-radius);
                    background-color: var(--big-block-bg);
                    color: var(--big-screen-text-color);
                    min-width: #{screen.scale-size(120px)};
                    transition: all 0.3s ease;
                    &:hover {
                        border-color: var(--big-primary-color);
                    }
                }
                .select-arrow {
                    position: absolute;
                    right: #{screen.scale-size(8px)};
                    top: 50%;
                    transform: translateY(-50%);
                    font-size: #{screen.scale-size(10px)};
                    color: var(--big-screen-text-color);
                    transition: transform 0.3s ease;
                }
                .select-dropdown {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    width: 100%;
                    margin: 0;
                    padding: 0;
                    list-style: none;
                    border: 1px solid var(--big-border-color);
                    border-radius: var(--big-border-radius);
                    background-color: var(--big-block-bg);
                    color: var(--big-screen-text-color);
                    z-index: 1000;
                    max-height: #{screen.scale-size(200px)};
                    overflow-y: auto;
                    li {
                        padding: #{screen.scale-size(4px)} #{screen.scale-size(8px)};
                        font-size: var(--big-font-size);
                        cursor: pointer;
                        transition: all 0.3s ease;
                        &:hover {
                            background-color: rgba(255, 255, 255, 0.1);
                            border-left: 3px solid var(--big-primary-color);
                        }
                    }
                }
            }
        }
        .datetime {
            font-size: var(--big-font-size);
            color: var(--big-screen-text-color);
        }
    }
}

@keyframes fade {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}
</style>
