import type { EventTypeMap } from "./pointer-events";

/** 事件监听器 */
export class GlobalPointer {
	private _listeners = new Map<keyof EventTypeMap, ((e: EventTypeMap[keyof EventTypeMap]) => void)[]>();

	/**
	 * 添加事件监听器
	 * @param type 事件类型
	 * @param listener 回调函数
	 */
	public addEventListener<K extends keyof EventTypeMap>(type: K, listener: (e: EventTypeMap[K]) => void) {
		if (!this._listeners.has(type)) this._listeners.set(type, []);
		// @ts-expect-error TS 没有推导出此类型，属于TS问题
		this._listeners.get(type)!.push(listener);
	}

	/**
	 * 移除事件监听器
	 * @param type 事件类型
	 * @param listener 回调函数
	 */
	public removeEventListener<K extends keyof EventTypeMap>(type: K, listener: (e: EventTypeMap[K]) => void) {
		if (!this._listeners.has(type)) return;
		const index = this._listeners.get(type)!.findIndex(cb => cb === listener);
		if (index < 0) return;
		this._listeners.get(type)!.splice(index, 1);
	}

	/**
	 * 通知事件
	 * @param type 事件类型
	 * @param event 事件对象
	 */
	public notify<K extends keyof EventTypeMap>(type: K, event: EventTypeMap[K]) {
		if (!this._listeners.has(type)) return;
		for (const listener of this._listeners.get(type)!) {
			listener(event);
		}
	}
}

/** 全局事件监听器 */
export const globalPointer = new GlobalPointer();
