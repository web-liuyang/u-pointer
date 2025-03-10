# u-pointer

### 介绍

消除 **uni** 中组件事件触发的[各端异性](https://doc.dcloud.net.cn/uni-app-x/component/common.html#%E7%BB%84%E4%BB%B6%E5%85%A8%E5%B1%80%E4%BA%8B%E4%BB%B6), 统一事件处理, 减轻负担

### u-pointer

#### 事件

| **u-pointer 事件名** | uni 事件名              | 描述                                   |
| -------------------- | ----------------------- | -------------------------------------- |
| @onpointerclick      | @click\|tap             | 在元素上按下并抬起触发                 |
| @onpointerdown       | @mousedown\|@touchstart | 在元素上按下触发                       |
| @onpointermove       | @mousemove\|@touchmove  | 在元素上按下并移动时触发               |
| @onpointerup         | @mouseup\|touchend      | 在元素上按下并抬起时触发               |
| @onpointercancel     | @touchcancel            | 在元素上动作被打断，如来电提醒，弹窗等 |
| @onpointerwheel      | 无                      | 鼠标滚轮                               |

#### 类型

| **事件名**       | 类型                            |
| ---------------- | ------------------------------- |
| @onpointerclick  | (e: PointerclickEvent) => void  |
| @onpointerdown   | (e: PointerdownEvent) => void   |
| @onpointermove   | (e: PointermoveEvent) => void   |
| @onpointerup     | (e: PointerupEvent) => void     |
| @onpointercancel | (e: PointercancelEvent) => void |
| @onpointerwheel  | (e: PointerwheelEvent) => void  |

#### 使用方法

```vue
<template>
	<u-pointer
		@onpointerclick="pointerclick"
		@onpointerdown="pointerdown"
		@onpointermove="pointermove"
		@onpointerup="pointerup"
		@onpointerwheel="pointerwheel"
	>
		<view>Click Me</view>
	</u-pointer>
</template>
```

### u-pointer-root

#### 事件

此组件一般放在 **根节点** 下, **组件上无任何事件** 但有一个 **globalPointer** 的全局指针监听器, 回调类型与 **u-pointer** 事件保持一致.

使用方法类似于 **document.addEventListener**, 只不过需要换成 **globalPointer.addEventListener** 来监听事件.

#### 使用方法

```vue
<script lang="ts" setup>
import { onMounted, onUnmounted } from "vue";
import { PointerdownEvent, globalPointer } from "@/uni_modules/u-pointer";
function pointerdown(event: PointerdownEvent): void {
	console.log("pointerdown", event);
}

onMounted(() => {
	globalPointer.addEventListener("onpointerdown", pointerdown);
});

onUnmounted(() => {
	globalPointer.removeEventListener("onpointerdown", pointerdown);
});
</script>

<template>
	<u-pointer-root>
		<view>Click Me</view>
	</u-pointer-root>
</template>
```

### 注意事项

1. **@onpointerclick** 事件在按下后 **移动指针** 或 **按下超过 300ms** 不会触发.
1. **@onpointerup** 事件触发后会立即触发 **@onpointerclick** . 此处是已知问题, 但不会影响使用, 只是触发队列不一致, 后面反馈的人多了或有空的话会补上.

### TODO

1. [ ] @onpointerdbclick 双击事件
2. [ ] @onpointerlongclick 长按事件
3. [ ] stopPropagation 阻止当前事件的进一步传播
4. [ ] preventDefault 阻止当前事件的默认行为
