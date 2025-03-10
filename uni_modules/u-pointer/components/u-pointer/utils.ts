import { Pointer } from "./pointer-events";

export function getPointersByTouch(e: UniTouchEvent): Pointer[] {
	const touches = Array.from(e.touches);
	const pointers: Pointer[] = touches.map(t => {
		if (!e.target) {
			// 目前还没有出现过target不存在的情况, 出现此情况再来看如何处理
			throw new Error("no target");
		}

		return {
			id: t.identifier,
			x: t.clientX,
			y: t.clientY,
			pageX: t.pageX,
			pageY: t.pageY,
			screenX: t.screenX,
			screenY: t.screenY,
			target: e.target,
		};
	});

	return pointers;
}

export function getPointersByMouse(e: MouseEvent): Pointer[] {
	if (!e.target) {
		// 目前还没有出现过target不存在的情况, 出现此情况再来看如何处理
		throw new Error("no target");
	}

	const pointers: Pointer[] = [
		{
			id: 0,
			x: e.x,
			y: e.y,
			pageX: e.pageX,
			pageY: e.pageY,
			screenX: e.screenX,
			screenY: e.screenY,
			target: e.target,
		},
	];

	return pointers;
}

export function getPointersByWheel(e: WheelEvent): Pointer[] {
	if (!e.target) {
		// 目前还没有出现过target不存在的情况, 出现此情况再来看如何处理
		throw new Error("no target");
	}

	const pointers: Pointer[] = [
		{
			id: 0,
			x: e.x,
			y: e.y,
			pageX: e.pageX,
			pageY: e.pageY,
			screenX: e.screenX,
			screenY: e.screenY,
			target: e.target,
		},
	];

	return pointers;
}
