import type { App } from 'vue';

import ElementPlus from 'element-plus';
// 需要注意的是，样式文件需要单独引入
import 'element-plus/dist/index.css';
import 'virtual:uno.css';

import { VueQueryPlugin } from 'vue-query';

export function registerVendor(app: App) {
    app.use(ElementPlus);
    app.use(VueQueryPlugin);
}
