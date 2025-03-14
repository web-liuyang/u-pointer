<script lang="ts" setup>
import { ref } from "vue";
import type { Pointer, EventTypeMap } from "./pointer-events";
import {
	PointerclickEvent,
	PointerdownEvent,
	PointerupEvent,
	PointermoveEvent,
	PointercancelEvent,
	PointerwheelEvent,
} from "./pointer-events";
import { getPointersByMouse, getPointersByTouch, getPointersByWheel } from "./utils";

const isPC = uni.getSystemInfoSync().deviceType === "pc";

defineOptions({
	name: "u-pointer",
});

const emit = defineEmits<{
	<T extends keyof EventTypeMap>(name: T, event: EventTypeMap[T]): void;
}>();

// 其实在 UniEvent 中是有 currentTarget 来表示当前组件的,
// 但是有 BUG 实际上并不是当前组件, 所以用此变量打个补丁
const uPointer = ref<UniViewElement | null>(null);

const PRESS_TIMEOUT = 300; // 0ms - 300ms
const DB_PRESS_TIMEOUT = 500; // 300ms - 500ms
const LONG_PRESS_TIMEOUT = 500; // 500ms - 1000ms

/** 只要按下一直存在 */
let pressedPointers: Map<Pointer["id"], Pointer> = new Map();
/** 超时后会被移除掉 */
let preonclickPointers: Map<Pointer["id"], number> = new Map();

/////////////////////////////////////////////////////
///////////////                       ///////////////
///////////////         Mobile        ///////////////
///////////////                       ///////////////
/////////////////////////////////////////////////////

const onTouchstart = (e: UniTouchEvent) => {
	const pointers: Pointer[] = getPointersByTouch(e);
	onpointerdown(pointers, e);
};

const onTouchmove = (e: UniTouchEvent) => {
	const pointers: Pointer[] = getPointersByTouch(e);
	onpointermove(pointers, e);
};

const onTouchend = (e: UniTouchEvent) => {
	const pointers: Pointer[] = getPointersByTouch(e);
	onpointerup(pointers, e);
};

const onTouchcancel = (e: UniTouchEvent) => {
	const pointers: Pointer[] = getPointersByTouch(e);
	onpointercancel(pointers, e);
};

/////////////////////////////////////////////////////
///////////////                       ///////////////
///////////////           PC          ///////////////
///////////////                       ///////////////
/////////////////////////////////////////////////////

function onMousedown(e: MouseEvent) {
	// 防止在H5中触发
	if (!isPC) return;

	const pointers: Pointer[] = getPointersByMouse(e);
	onpointerdown(pointers, e);

	window.addEventListener("mousemove", onMousemove);
	window.addEventListener("mouseup", onMouseup);
}

function onMousemove(e: MouseEvent) {
	if (!isPC) return;

	const pointers: Pointer[] = getPointersByMouse(e);
	onpointermove(pointers, e);
}

function onMouseup(e: MouseEvent) {
	if (!isPC) return;

	window.removeEventListener("mousemove", onMousemove);
	window.removeEventListener("mouseup", onMouseup);

	const pointers: Pointer[] = getPointersByMouse(e);
	onpointerup(pointers, e);
}

const onWheel = (e: WheelEvent) => {
	if (!isPC) return;

	const pointers: Pointer[] = getPointersByWheel(e);
	onpointerwheel(pointers, e);
};

/////////////////////////////////////////////////////
///////////////                       ///////////////
///////////////        事件触发        ///////////////
///////////////                       ///////////////
/////////////////////////////////////////////////////

async function onpointerdown(pointers: Pointer[], e: UniTouchEvent | MouseEvent): Promise<void> {
	for (const pointer of pointers) {
		const curRect = await uPointer.value?.getBoundingClientRectAsync();
		if (!curRect) continue;
		// 没有在范围内
		if (
			!(
				pointer.x >= curRect.left &&
				pointer.x <= curRect.left + curRect.width &&
				pointer.y >= curRect.top &&
				pointer.y <= curRect.top + curRect.height
			)
		)
			continue;

		const pointerdown = new PointerdownEvent(pointer, e);
		if (pressedPointers.has(pointer.id) || preonclickPointers.has(pointer.id)) continue;

		emit("onpointerdown", pointerdown);
		pressedPointers.set(pointer.id, pointer);
		preonclickPointers.set(pointer.id, pointerdown.timestamp);

		setTimeout(() => {
			// 超时取消 click
			const timestamp = preonclickPointers.get(pointer.id);
			if (timestamp === pointerdown.timestamp) {
				preonclickPointers.delete(pointer.id);
			}
		}, PRESS_TIMEOUT);
	}
}

function onpointermove(pointers: Pointer[], e: UniTouchEvent | MouseEvent) {
	const _tempPressedPointers = new Map(pressedPointers);
	pressedPointers.clear();

	for (const pointer of pointers) {
		const pressedPointer = _tempPressedPointers.get(pointer.id);
		if (pressedPointer) {
			pointer;
			const deltaX = pointer.x - pressedPointer.x;
			const deltaY = pointer.y - pressedPointer.y;

			const pointermove = new PointermoveEvent({ ...pointer, delta: { x: deltaX, y: deltaY } }, e);
			emit("onpointermove", pointermove);
			pressedPointers.set(pointer.id, pointer);
			preonclickPointers.delete(pointer.id);
		}
	}
}

function onpointerup(pointers: Pointer[], e: UniTouchEvent | MouseEvent) {
	const _tempPressedPointers = [...pressedPointers.values()];
	pressedPointers.clear();

	for (const pointer of _tempPressedPointers) {
		// 这里与Touch是反的
		// Mouse 会返回已经抬起的指针
		// Touch不会返回已经抬起的指针
		// 所以需要取反
		const isPressed = isPC ? pointers.some(t => t.id !== pointer.id) : pointers.some(t => t.id === pointer.id);
		if (!isPressed) {
			const pointerup = new PointerupEvent(pointer, e);
			emit("onpointerup", pointerup);

			if (preonclickPointers.has(pointer.id)) {
				preonclickPointers.delete(pointer.id);
				const click = new PointerclickEvent(pointer, e);
				emit("onpointerclick", click);
			}
		} else {
			pressedPointers.set(pointer.id, pointer);
		}
	}
}

function onpointercancel(pointers: Pointer[], e: UniTouchEvent | MouseEvent) {
	const _tempPressedPointers = [...pressedPointers.values()];
	pressedPointers.clear();

	for (const pointer of _tempPressedPointers) {
		const isPressed = pointers.some(t => t.id === pointer.id);
		if (!isPressed) {
			const pointercancel = new PointercancelEvent(pointer, e);
			emit("onpointercancel", pointercancel);

			if (preonclickPointers.has(pointer.id)) {
				preonclickPointers.delete(pointer.id);
				const click = new PointerclickEvent(pointer, e);
				emit("onpointerclick", click);
			}
		} else {
			pressedPointers.set(pointer.id, pointer);
		}
	}
}

function onpointerwheel(pointers: Pointer[], e: WheelEvent) {
	for (const pointer of pointers) {
		const pointerwheel = new PointerwheelEvent(pointer, e);
		emit("onpointerwheel", pointerwheel);
	}
}
</script>

<template>
	<view
		ref="uPointer"
		@touchstart="onTouchstart"
		@touchmove="onTouchmove"
		@touchcancel="onTouchcancel"
		@touchend="onTouchend"
		@mousedown="onMousedown"
		@wheel="onWheel"
	>
		<slot />
	</view>
</template>
