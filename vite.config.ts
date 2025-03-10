import { defineConfig, PluginOption } from "vite";
// @ts-expect-error uni vite version mismatching
import uni from "@dcloudio/vite-plugin-uni";

const uPointerPlugin = (): PluginOption => {
	return {
		name: "uPointerPlugin",
		enforce: "pre",
		transform(code, id, options) {
			const newCode = code
				.replace(/from "u-pointer"/g, `from "@/uni_modules/u-pointer/index"`);

			return newCode;
		},
	};
};

export default defineConfig({
	plugins: [uni(), uPointerPlugin()],
});
