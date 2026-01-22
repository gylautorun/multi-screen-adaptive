import { ref, onMounted, onBeforeUnmount, Ref } from 'vue';

interface DraggableOptions {
    onDragStart?: (event: MouseEvent, x: number, y: number) => void;
    onDragMove?: (event: MouseEvent, x: number, y: number) => void;
    onDragEnd?: (event: MouseEvent, x: number, y: number) => void;
    onResizeStart?: (event: MouseEvent, width: number, height: number) => void;
    onResizeMove?: (event: MouseEvent, width: number, height: number) => void;
    onResizeEnd?: (event: MouseEvent, width: number, height: number) => void;
    restrict?: {
        parent?: boolean;
        minWidth?: number;
        minHeight?: number;
    };
}

interface DraggableReturn {
    draggableRef: Ref<HTMLElement | null>;
    isDragging: Ref<boolean>;
    isResizing: Ref<boolean>;
    bindEvents: () => void;
    unbindEvents: () => void;
}

export const useDraggable = (options: DraggableOptions = {}): DraggableReturn => {
    const draggableRef = ref<HTMLElement | null>(null);
    const isDragging = ref(false);
    const isResizing = ref(false);

    let startX = 0;
    let startY = 0;
    let startWidth = 0;
    let startHeight = 0;
    let startLeft = 0;
    let startTop = 0;
    let resizeHandle: string | null = null;

    const handleMouseDown = (event: MouseEvent) => {
        if (!draggableRef.value) return;

        // 检查是否点击了调整大小的手柄
        const target = event.target as HTMLElement;
        if (target.classList.contains('resize-handle')) {
            startResize(event, target);
            return;
        }

        // 开始拖拽
        startDrag(event);
    };

    const startDrag = (event: MouseEvent) => {
        if (!draggableRef.value) return;

        isDragging.value = true;
        startX = event.clientX;
        startY = event.clientY;

        const rect = draggableRef.value.getBoundingClientRect();
        const parentRect = draggableRef.value.parentElement?.getBoundingClientRect() || {
            left: 0,
            top: 0
        };

        startLeft = rect.left - parentRect.left;
        startTop = rect.top - parentRect.top;

        // 阻止默认行为
        event.preventDefault();

        // 添加事件监听器
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        // 触发拖拽开始事件
        if (options.onDragStart) {
            options.onDragStart(event, startLeft, startTop);
        }
    };

    const startResize = (event: MouseEvent, handle: HTMLElement) => {
        if (!draggableRef.value) return;

        isResizing.value = true;
        startX = event.clientX;
        startY = event.clientY;

        const rect = draggableRef.value.getBoundingClientRect();
        startWidth = rect.width;
        startHeight = rect.height;
        startLeft = rect.left;
        startTop = rect.top;

        // 确定调整大小的手柄类型
        if (handle.classList.contains('resize-nw')) resizeHandle = 'nw';
        else if (handle.classList.contains('resize-n')) resizeHandle = 'n';
        else if (handle.classList.contains('resize-ne')) resizeHandle = 'ne';
        else if (handle.classList.contains('resize-e')) resizeHandle = 'e';
        else if (handle.classList.contains('resize-se')) resizeHandle = 'se';
        else if (handle.classList.contains('resize-s')) resizeHandle = 's';
        else if (handle.classList.contains('resize-sw')) resizeHandle = 'sw';
        else if (handle.classList.contains('resize-w')) resizeHandle = 'w';

        // 阻止默认行为
        event.preventDefault();

        // 添加事件监听器
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        // 触发调整大小开始事件
        if (options.onResizeStart) {
            options.onResizeStart(event, startWidth, startHeight);
        }
    };

    const handleMouseMove = (event: MouseEvent) => {
        if (!draggableRef.value) return;

        if (isDragging.value) {
            drag(event);
        } else if (isResizing.value) {
            resize(event);
        }
    };

    const drag = (event: MouseEvent) => {
        if (!draggableRef.value) return;

        const dx = event.clientX - startX;
        const dy = event.clientY - startY;

        let newLeft = startLeft + dx;
        let newTop = startTop + dy;

        // 限制边界
        if (options.restrict?.parent) {
            const parent = draggableRef.value.parentElement;
            if (parent) {
                const parentRect = parent.getBoundingClientRect();
                const elementRect = draggableRef.value.getBoundingClientRect();

                // 确保元素不超出父容器
                if (newLeft < 0) {
                    newLeft = 0;
                }
                if (newTop < 0) {
                    newTop = 0;
                }
                if (newLeft + elementRect.width > parentRect.width) {
                    newLeft = parentRect.width - elementRect.width;
                }
                if (newTop + elementRect.height > parentRect.height) {
                    newTop = parentRect.height - elementRect.height;
                }
            }
        }

        // 更新位置
        draggableRef.value.style.left = `${newLeft}px`;
        draggableRef.value.style.top = `${newTop}px`;

        // 触发拖拽移动事件
        if (options.onDragMove) {
            options.onDragMove(event, newLeft, newTop);
        }
    };

    const resize = (event: MouseEvent) => {
        if (!draggableRef.value || !resizeHandle) return;

        const dx = event.clientX - startX;
        const dy = event.clientY - startY;

        let newWidth = startWidth;
        let newHeight = startHeight;
        let newLeft = startLeft;
        let newTop = startTop;

        // 根据调整大小的手柄类型计算新的尺寸和位置
        switch (resizeHandle) {
            case 'nw':
                newWidth = startWidth - dx;
                newHeight = startHeight - dy;
                newLeft = startLeft + dx;
                newTop = startTop + dy;
                break;
            case 'n':
                newHeight = startHeight - dy;
                newTop = startTop + dy;
                break;
            case 'ne':
                newWidth = startWidth + dx;
                newHeight = startHeight - dy;
                newTop = startTop + dy;
                break;
            case 'e':
                newWidth = startWidth + dx;
                break;
            case 'se':
                newWidth = startWidth + dx;
                newHeight = startHeight + dy;
                break;
            case 's':
                newHeight = startHeight + dy;
                break;
            case 'sw':
                newWidth = startWidth - dx;
                newHeight = startHeight + dy;
                newLeft = startLeft + dx;
                break;
            case 'w':
                newWidth = startWidth - dx;
                newLeft = startLeft + dx;
                break;
        }

        // 限制最小尺寸
        const minWidth = options.restrict?.minWidth || 100;
        const minHeight = options.restrict?.minHeight || 100;

        newWidth = Math.max(newWidth, minWidth);
        newHeight = Math.max(newHeight, minHeight);

        // 限制边界
        if (options.restrict?.parent) {
            const parent = draggableRef.value.parentElement;
            if (parent) {
                const parentRect = parent.getBoundingClientRect();
                const elementRect = draggableRef.value.getBoundingClientRect();
                const parentLeft = parentRect.left;
                const parentTop = parentRect.top;

                // 确保元素不超出父容器
                if (newLeft < parentLeft) {
                    newLeft = parentLeft;
                    if (resizeHandle.includes('w')) {
                        newWidth = startWidth + dx;
                    }
                }
                if (newTop < parentTop) {
                    newTop = parentTop;
                    if (resizeHandle.includes('n')) {
                        newHeight = startHeight + dy;
                    }
                }
                if (newLeft + newWidth > parentLeft + parentRect.width) {
                    newWidth = parentLeft + parentRect.width - newLeft;
                }
                if (newTop + newHeight > parentTop + parentRect.height) {
                    newHeight = parentTop + parentRect.height - newTop;
                }
            }
        }

        // 转换为相对位置
        const parentRect = draggableRef.value.parentElement?.getBoundingClientRect() || {
            left: 0,
            top: 0
        };
        const relativeLeft = newLeft - parentRect.left;
        const relativeTop = newTop - parentRect.top;

        // 更新尺寸和位置
        draggableRef.value.style.width = `${newWidth}px`;
        draggableRef.value.style.height = `${newHeight}px`;
        draggableRef.value.style.left = `${relativeLeft}px`;
        draggableRef.value.style.top = `${relativeTop}px`;

        // 触发调整大小移动事件
        if (options.onResizeMove) {
            options.onResizeMove(event, newWidth, newHeight);
        }
    };

    const handleMouseUp = (event: MouseEvent) => {
        if (!draggableRef.value) return;

        if (isDragging.value) {
            isDragging.value = false;

            // 计算最终位置
            const rect = draggableRef.value.getBoundingClientRect();
            const parentRect = draggableRef.value.parentElement?.getBoundingClientRect() || {
                left: 0,
                top: 0
            };
            const finalLeft = rect.left - parentRect.left;
            const finalTop = rect.top - parentRect.top;

            // 触发拖拽结束事件
            if (options.onDragEnd) {
                options.onDragEnd(event, finalLeft, finalTop);
            }
        } else if (isResizing.value) {
            isResizing.value = false;
            resizeHandle = null;

            // 计算最终尺寸
            const rect = draggableRef.value.getBoundingClientRect();
            const finalWidth = rect.width;
            const finalHeight = rect.height;

            // 触发调整大小结束事件
            if (options.onResizeEnd) {
                options.onResizeEnd(event, finalWidth, finalHeight);
            }
        }

        // 移除事件监听器
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    // 绑定事件监听器
    const bindEvents = () => {
        if (draggableRef.value) {
            draggableRef.value.addEventListener('mousedown', handleMouseDown);
        }
    };

    // 解绑事件监听器
    const unbindEvents = () => {
        if (draggableRef.value) {
            draggableRef.value.removeEventListener('mousedown', handleMouseDown);
        }
    };

    onMounted(() => {
        bindEvents();
    });

    onBeforeUnmount(() => {
        unbindEvents();
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    });

    return {
        draggableRef,
        isDragging,
        isResizing,
        bindEvents,
        unbindEvents
    };
};

// 用于组件库拖拽的钩子
export const useComponentDrag = (onDrop: (type: string, x: number, y: number) => void) => {
    const dragRefs = ref<Map<string, HTMLElement>>(new Map());

    const handleDragStart = (event: DragEvent, type: string) => {
        if (event.dataTransfer) {
            event.dataTransfer.setData('text/plain', type);
        }
    };

    const handleDrop = (event: DragEvent) => {
        event.preventDefault();

        if (!event.dataTransfer) return;

        const type = event.dataTransfer.getData('text/plain');
        if (!type) return;

        const dropZone = event.currentTarget as HTMLElement;
        const rect = dropZone.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // 调用放置回调
        onDrop(type, x, y);
    };

    const handleDragOver = (event: DragEvent) => {
        event.preventDefault();
    };

    return {
        dragRefs,
        handleDragStart,
        handleDrop,
        handleDragOver
    };
};
