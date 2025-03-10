<script lang="ts" setup>
import type {
	PointerclickEvent,
	PointerdownEvent,
	PointerupEvent,
	PointermoveEvent,
	PointercancelEvent,
	PointerwheelEvent,
} from "../u-pointer/pointer-events";
import uPointer from "../u-pointer/u-pointer.uvue";
import { globalPointer } from "../u-pointer/global-pointer";

defineOptions({
	name: "u-pointer-root",
});

function pointerdown(e: PointerdownEvent) {
	globalPointer.notify("onpointerdown", e);
}

function pointermove(e: PointermoveEvent) {
	globalPointer.notify("onpointermove", e);
}

function pointerup(e: PointerupEvent) {
	globalPointer.notify("onpointerup", e);
}

function pointercancel(e: PointercancelEvent) {
	globalPointer.notify("onpointercancel", e);
}

function pointerclick(e: PointerclickEvent) {
	globalPointer.notify("onpointerclick", e);
}

function pointerwheel(e: PointerwheelEvent) {
	globalPointer.notify("onpointerwheel", e);
}
</script>

<template>
	<u-pointer
		style="height: 100%; width: 100%"
		@onpointerdown="pointerdown"
		@onpointermove="pointermove"
		@onpointerup="pointerup"
		@onpointercancel="pointercancel"
		@onpointerclick="pointerclick"
		@onpointerwheel="pointerwheel"
	>
		<slot />
	</u-pointer>
</template>
