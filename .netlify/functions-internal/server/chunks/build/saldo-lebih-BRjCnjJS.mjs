import { r as _sfc_main$1 } from '../virtual/entry.mjs';
import { u as useTenant } from './useTenant-B7s_AqNz.mjs';
import { u as useBilling } from './useBilling-CKDam3tl.mjs';
import { ref, computed, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
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

//#region app/pages/admin/saldo-lebih.vue
var _sfc_main = {
	__name: "saldo-lebih",
	__ssrInlineRender: true,
	setup(__props) {
		useTenant();
		const saldoList = ref([]);
		const { formatRupiah } = useBilling();
		const totalSaldo = computed(() => {
			return saldoList.value.reduce((sum, r) => sum + r.saldo_lebih, 0);
		});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UIcon = _sfc_main$1;
			_push(`<div${ssrRenderAttrs(_attrs)}><div class="flex justify-between items-center mb-6"><h1 class="text-2xl font-bold">Saldo Lebih</h1></div><div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 rounded-lg p-4 mb-6"><div class="flex items-start gap-3">`);
			_push(ssrRenderComponent(_component_UIcon, {
				name: "i-lucide-info",
				class: "text-blue-600 text-xl mt-0.5"
			}, null, _parent));
			_push(`<div><p class="font-semibold text-blue-800">Informasi</p><p class="text-sm text-blue-700 mt-1"> Daftar rumah yang memiliki saldo lebih (bayar melebihi tagihan). Saldo lebih akan otomatis dikurangi dari tagihan bulan berikutnya. </p></div></div></div><div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"><div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4"><p class="text-sm text-gray-500">Total Rumah dengan Saldo Lebih</p><p class="text-2xl font-bold text-green-600">${ssrInterpolate(unref(saldoList).length)}</p></div><div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4"><p class="text-sm text-gray-500">Total Saldo Lebih</p><p class="text-2xl font-bold text-blue-600">${ssrInterpolate(unref(formatRupiah)(unref(totalSaldo)))}</p></div></div><div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"><div class="overflow-x-auto"><table class="w-full"><thead><tr class="border-b border-gray-200 dark:border-gray-700"><th class="text-left p-4 font-semibold">Rumah</th><th class="text-left p-4 font-semibold">PIC</th><th class="text-left p-4 font-semibold">Telepon</th><th class="text-left p-4 font-semibold">Tipe</th><th class="text-right p-4 font-semibold">Saldo Lebih</th></tr></thead><tbody><!--[-->`);
			ssrRenderList(unref(saldoList), (item) => {
				_push(`<tr class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"><td class="p-4 font-medium">${ssrInterpolate(item.blok)}-${ssrInterpolate(item.nomor)}</td><td class="p-4 text-sm">${ssrInterpolate(item.pic_nama || "-")}</td><td class="p-4 text-sm">${ssrInterpolate(item.pic_telepon || "-")}</td><td class="p-4"><span class="${ssrRenderClass([{
					"bg-blue-100 text-blue-800": item.tipe === "pribadi",
					"bg-purple-100 text-purple-800": item.tipe === "kontrakan",
					"bg-gray-100 text-gray-800": item.tipe === "fasum"
				}, "px-2 py-1 rounded-full text-xs font-medium"])}">${ssrInterpolate(item.tipe)}</span></td><td class="p-4 text-right font-bold text-blue-600">${ssrInterpolate(unref(formatRupiah)(item.saldo_lebih))}</td></tr>`);
			});
			_push(`<!--]--></tbody></table></div>`);
			if (unref(saldoList).length === 0) _push(`<div class="p-8 text-center text-gray-500"> Tidak ada rumah dengan saldo lebih </div>`);
			else _push(`<!---->`);
			_push(`</div></div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/saldo-lebih.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=saldo-lebih-BRjCnjJS.mjs.map
