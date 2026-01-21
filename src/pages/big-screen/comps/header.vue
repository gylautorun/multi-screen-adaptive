<template>
    <div class="big-screen-header">
        <h1 class="big-screen-logo">
            <span>大屏效果</span>
        </h1>
        <div class="big-screen-header-title">{{ store.title }}</div>
        <div class="big-screen-header-right">
            <!-- <img :src="githubIcon" /> -->
            <img class="theme-change" :src="icon" @click="handleChangeTheme" />
            <span class="datetime">{{ currentTime }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import dayjs from 'dayjs';
import { useScreenStore, ScreenThemeParams } from '@/stores/pages/screen';
const store = useScreenStore();

const singleThemes = computed(() => store.getIconThemes);
const activeIndex = ref(0);
const icon = computed(() => store.getCurrentThemeData.icon);
const currentTime = ref('');
const timeId = ref();

function handleChangeTheme() {
    const index = ++activeIndex.value % singleThemes.value.length;
    activeIndex.value = index;
    store.setTheme(singleThemes.value[index].value);
    // store.$patch({
    //     theme: store.theme === 'dark' ? 'light' : 'dark'
    // });
}

function startTime() {
    timeId.value = setTimeout(() => {
        currentTime.value = dayjs().format('YYYY-MM-DD HH:mm:ss');
        startTime();
    }, 1000);
}

onBeforeUnmount(() => {
    clearTimeout(timeId.value);
});

startTime();
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
    }
    .theme-change {
        width: var(--big-icon-size);
        margin-right: var(--big-icon-margin);
        cursor: pointer;
        transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        &:hover {
            transform: scale(1.2);
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
