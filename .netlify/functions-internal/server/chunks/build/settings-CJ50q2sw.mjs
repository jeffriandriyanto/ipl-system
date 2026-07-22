import { _ as _sfc_main$1 } from '../virtual/entry.mjs';
import { u as useTenant } from './useTenant-B7s_AqNz.mjs';
import { ref, reactive, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrRenderComponent } from 'vue/server-renderer';
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
import 'node:async_hooks';
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

//#region app/pages/admin/settings.vue
var _sfc_main = {
	__name: "settings",
	__ssrInlineRender: true,
	setup(__props) {
		const { tenantId, tenantDomain } = useTenant();
		const activeTab = ref("umum");
		const saving = ref(false);
		const savingWhiteLabel = ref(false);
		const tabs = [
			{
				id: "umum",
				label: "Umum"
			},
			{
				id: "whitelabel",
				label: "White-Label"
			},
			{
				id: "info",
				label: "Info Sistem"
			}
		];
		const form = reactive({
			nama_aplikasi: "IPL Perumahan Waris 1",
			nama_perumahan: "Perumahan Waris 1",
			alamat: "",
			kontak: "",
			payment_info: ""
		});
		const whiteLabel = reactive({
			logo: "",
			primary_color: "#16A34A",
			secondary_color: "#15803D",
			footer_text: "© 2026 IPL Perumahan Waris 1",
			domain: "ipl-system.netlify.app"
		});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UButton = _sfc_main$1;
			_push(`<div${ssrRenderAttrs(_attrs)}><div class="flex justify-between items-center mb-6"><h1 class="text-2xl font-bold">Pengaturan</h1></div><div class="flex gap-2 mb-6"><!--[-->`);
			ssrRenderList(tabs, (tab) => {
				_push(`<button class="${ssrRenderClass([unref(activeTab) === tab.id ? "bg-green-600 text-white" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700", "px-4 py-2 rounded-lg text-sm font-medium transition-colors"])}">${ssrInterpolate(tab.label)}</button>`);
			});
			_push(`<!--]--></div>`);
			if (unref(activeTab) === "umum") {
				_push(`<div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6"><h2 class="text-lg font-semibold mb-4">Informasi Perumahan</h2><form class="space-y-4"><div><label class="block text-sm font-medium mb-1">Nama Aplikasi</label><input${ssrRenderAttr("value", unref(form).nama_aplikasi)} type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium mb-1">Nama Perumahan</label><input${ssrRenderAttr("value", unref(form).nama_perumahan)} type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium mb-1">Alamat</label><textarea rows="2" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">${ssrInterpolate(unref(form).alamat)}</textarea></div><div><label class="block text-sm font-medium mb-1">Kontak</label><input${ssrRenderAttr("value", unref(form).kontak)} type="text" placeholder="0812xxxx" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium mb-1">Info Pembayaran</label><textarea rows="3" placeholder="Transfer ke BCA xxx a.n Bendahara" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">${ssrInterpolate(unref(form).payment_info)}</textarea><p class="text-xs text-gray-500 mt-1">Info ini akan tampil di halaman cek tagihan warga</p></div><div class="pt-4">`);
				_push(ssrRenderComponent(_component_UButton, {
					type: "submit",
					label: "Simpan",
					color: "green",
					loading: unref(saving)
				}, null, _parent));
				_push(`</div></form></div>`);
			} else _push(`<!---->`);
			if (unref(activeTab) === "whitelabel") {
				_push(`<div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6"><h2 class="text-lg font-semibold mb-4">White-Label Configuration</h2><form class="space-y-4"><div><label class="block text-sm font-medium mb-1">Logo URL</label><input${ssrRenderAttr("value", unref(whiteLabel).logo)} type="url" placeholder="https://example.com/logo.png" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"><p class="text-xs text-gray-500 mt-1">URL gambar logo perumahan</p></div><div class="grid grid-cols-2 gap-4"><div><label class="block text-sm font-medium mb-1">Warna Primer</label><div class="flex gap-2"><input${ssrRenderAttr("value", unref(whiteLabel).primary_color)} type="color" class="w-10 h-10 border rounded cursor-pointer"><input${ssrRenderAttr("value", unref(whiteLabel).primary_color)} type="text" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div></div><div><label class="block text-sm font-medium mb-1">Warna Sekunder</label><div class="flex gap-2"><input${ssrRenderAttr("value", unref(whiteLabel).secondary_color)} type="color" class="w-10 h-10 border rounded cursor-pointer"><input${ssrRenderAttr("value", unref(whiteLabel).secondary_color)} type="text" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div></div></div><div><label class="block text-sm font-medium mb-1">Footer Text</label><input${ssrRenderAttr("value", unref(whiteLabel).footer_text)} type="text" placeholder="© 2026 Perumahan xxx" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"></div><div><label class="block text-sm font-medium mb-1">Domain</label><input${ssrRenderAttr("value", unref(whiteLabel).domain)} type="text" disabled class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 cursor-not-allowed"><p class="text-xs text-gray-500 mt-1">Domain tidak bisa diubah</p></div><div class="pt-4">`);
				_push(ssrRenderComponent(_component_UButton, {
					type: "submit",
					label: "Simpan",
					color: "green",
					loading: unref(savingWhiteLabel)
				}, null, _parent));
				_push(`</div></form></div>`);
			} else _push(`<!---->`);
			if (unref(activeTab) === "info") _push(`<div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6"><h2 class="text-lg font-semibold mb-4">Informasi Sistem</h2><div class="space-y-3"><div class="flex justify-between py-2 border-b"><span class="text-gray-500">Tenant ID</span><span class="font-mono">${ssrInterpolate(unref(tenantId))}</span></div><div class="flex justify-between py-2 border-b"><span class="text-gray-500">Domain</span><span class="font-mono">${ssrInterpolate(unref(tenantDomain))}</span></div><div class="flex justify-between py-2 border-b"><span class="text-gray-500">Database</span><span>Supabase PostgreSQL</span></div><div class="flex justify-between py-2 border-b"><span class="text-gray-500">Framework</span><span>Nuxt 4 + Nuxt UI</span></div><div class="flex justify-between py-2 border-b"><span class="text-gray-500">Versi</span><span>1.0.0</span></div></div></div>`);
			else _push(`<!---->`);
			_push(`</div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/settings.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=settings-CJ50q2sw.mjs.map
