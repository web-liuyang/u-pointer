import { defineConfig } from "vite";
// @ts-expect-error uni vite version mismatching
import uni from "@dcloudio/vite-plugin-uni";

export default defineConfig({
	plugins: [uni()],
});
