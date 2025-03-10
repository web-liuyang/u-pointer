/// <reference types='@dcloudio/uni-app-x' />
import "@vue/runtime-core";

export {};

declare module "@vue/runtime-core" {
	type Hooks = App.AppInstance & Page.PageInstance;

	interface ComponentCustomOptions extends Hooks {}
}

// declare module "vue" {
// 	interface AllowedComponentProps {
// 		age: number;
// 	}
// }
