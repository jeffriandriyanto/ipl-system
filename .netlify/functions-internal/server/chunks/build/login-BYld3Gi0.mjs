import { u as useAuth } from './useAuth-BH_veuXo.mjs';
import { reactive, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrIncludeBooleanAttr, ssrInterpolate } from 'vue/server-renderer';
import '../virtual/entry.mjs';
import 'nostics';
import 'nostics/formatters/ansi';
import '../nitro/nitro.mjs';
import '@prisma/client';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@iconify/utils';
import 'consola';
import 'vue-router';
import 'unhead/plugins';
import 'unhead/utils';
import '@iconify/vue';
import '@iconify/utils/lib/css/icon';
import 'perfect-debounce';
import '@vueuse/core';
import 'tailwind-variants';
import '@vueuse/shared';
import 'tailwindcss/colors';
import '@supabase/supabase-js';

//#region app/pages/login.vue
var _sfc_main = {
	__name: "login",
	__ssrInlineRender: true,
	setup(__props) {
		const form = reactive({
			email: "",
			password: ""
		});
		const loading = ref(false);
		const error = ref("");
		useAuth();
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900" }, _attrs))}><div class="w-full max-w-md"><div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"><div class="text-center mb-8"><h1 class="text-2xl font-bold text-primary-600">IPL System</h1><p class="text-gray-500 mt-2">Login ke panel admin</p></div><form class="space-y-4"><div><label class="block text-sm font-medium mb-1">Email</label><input${ssrRenderAttr("value", unref(form).email)} type="email" placeholder="email@example.com" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" required></div><div><label class="block text-sm font-medium mb-1">Password</label><input${ssrRenderAttr("value", unref(form).password)} type="password" placeholder="••••••••" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" required></div><button type="submit"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} class="w-full py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50">${ssrInterpolate(unref(loading) ? "Loading..." : "Login")}</button></form>`);
			if (unref(error)) _push(`<div class="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">${ssrInterpolate(unref(error))}</div>`);
			else _push(`<!---->`);
			_push(`</div></div></div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=login-BYld3Gi0.mjs.map
