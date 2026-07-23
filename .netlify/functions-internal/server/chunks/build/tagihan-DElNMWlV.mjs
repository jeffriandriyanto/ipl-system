import { _ as _sfc_main$1, $ as $fetch$2 } from '../virtual/entry.mjs';
import { u as useTenant } from './useTenant-B7s_AqNz.mjs';
import { u as useBilling } from './useBilling-CKDam3tl.mjs';
import { ref, computed, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrInterpolate, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
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

//#region app/pages/admin/tagihan.vue
var _sfc_main = {
	__name: "tagihan",
	__ssrInlineRender: true,
	setup(__props) {
		const { tenantId } = useTenant();
		const selectedPeriode = ref((/* @__PURE__ */ new Date()).toISOString().slice(0, 7));
		const filterStatus = ref("");
		const tagihanData = ref([]);
		const summary = ref(null);
		const loading = ref(false);
		const { formatRupiah, getStatusColor, getStatusText } = useBilling();
		const totalTagihan = computed(() => {
			return tagihanData.value.reduce((sum, t) => sum + t.total_tagihan, 0);
		});
		const totalBayar = computed(() => {
			return tagihanData.value.reduce((sum, t) => sum + t.total_bayar, 0);
		});
		const totalSelisih = computed(() => {
			return tagihanData.value.reduce((sum, t) => sum + t.selisih, 0);
		});
		async function fetchTagihan() {
			loading.value = true;
			try {
				let url = `/api/tagihan?tenant_id=${tenantId}&periode=${selectedPeriode.value}`;
				if (filterStatus.value) url += `&status=${filterStatus.value}`;
				const data = await $fetch$2(url);
				tagihanData.value = data.data || [];
				summary.value = data.summary;
			} catch (error) {
				console.error("Error fetching tagihan:", error);
				alert("Gagal mengambil data tagihan");
			} finally {
				loading.value = false;
			}
		}
		function exportExcel() {
			alert("Fitur export Excel belum diimplementasikan");
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UButton = _sfc_main$1;
			_push(`<div${ssrRenderAttrs(_attrs)}><div class="flex justify-between items-center mb-6"><h1 class="text-2xl font-bold">Data Tagihan</h1><div class="flex gap-2">`);
			_push(ssrRenderComponent(_component_UButton, {
				label: "Export Excel",
				icon: "i-lucide-download",
				variant: "outline",
				onClick: exportExcel
			}, null, _parent));
			_push(`</div></div><div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6"><div class="flex flex-wrap gap-4 items-end"><div><label class="text-sm font-medium mb-1 block">Periode</label><input${ssrRenderAttr("value", unref(selectedPeriode))} type="month" class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"></div><div><label class="text-sm font-medium mb-1 block">Status</label><select class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filterStatus)) ? ssrLooseContain(unref(filterStatus), "") : ssrLooseEqual(unref(filterStatus), "")) ? " selected" : ""}>Semua</option><option value="belum_bayar"${ssrIncludeBooleanAttr(Array.isArray(unref(filterStatus)) ? ssrLooseContain(unref(filterStatus), "belum_bayar") : ssrLooseEqual(unref(filterStatus), "belum_bayar")) ? " selected" : ""}>Belum Bayar</option><option value="lunas"${ssrIncludeBooleanAttr(Array.isArray(unref(filterStatus)) ? ssrLooseContain(unref(filterStatus), "lunas") : ssrLooseEqual(unref(filterStatus), "lunas")) ? " selected" : ""}>Lunas</option><option value="kurang"${ssrIncludeBooleanAttr(Array.isArray(unref(filterStatus)) ? ssrLooseContain(unref(filterStatus), "kurang") : ssrLooseEqual(unref(filterStatus), "kurang")) ? " selected" : ""}>Kurang</option><option value="lebih"${ssrIncludeBooleanAttr(Array.isArray(unref(filterStatus)) ? ssrLooseContain(unref(filterStatus), "lebih") : ssrLooseEqual(unref(filterStatus), "lebih")) ? " selected" : ""}>Lebih</option></select></div>`);
			_push(ssrRenderComponent(_component_UButton, {
				label: "Load Data",
				icon: "i-lucide-refresh-cw",
				loading: unref(loading),
				onClick: fetchTagihan
			}, null, _parent));
			_push(`</div>`);
			if (unref(summary)) _push(`<div class="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4"><div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3"><p class="text-sm text-gray-500">Total Rumah</p><p class="text-2xl font-bold">${ssrInterpolate(unref(summary).total_rumah)}</p></div><div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-3"><p class="text-sm text-gray-500">Sudah Bayar</p><p class="text-2xl font-bold text-green-600">${ssrInterpolate(unref(summary).lunas)}</p></div><div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-3"><p class="text-sm text-gray-500">Belum Bayar</p><p class="text-2xl font-bold text-red-600">${ssrInterpolate(unref(summary).belum_lunas)}</p></div><div class="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3"><p class="text-sm text-gray-500">Exempt</p><p class="text-2xl font-bold text-yellow-600">${ssrInterpolate(unref(summary).exempt || 0)}</p></div><div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3"><p class="text-sm text-gray-500">Total Tagihan</p><p class="text-xl font-bold">${ssrInterpolate(unref(formatRupiah)(unref(summary).total_tagihan))}</p></div></div>`);
			else _push(`<!---->`);
			_push(`</div>`);
			if (unref(tagihanData).length > 0) {
				_push(`<div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"><div class="overflow-x-auto"><table class="w-full"><thead><tr class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700"><th class="text-left p-3 font-semibold text-sm">No</th><th class="text-left p-3 font-semibold text-sm">Blok-No</th><th class="text-left p-3 font-semibold text-sm">Status</th><th class="text-center p-3 font-semibold text-sm">Exempt</th><th class="text-left p-3 font-semibold text-sm">Jenis Iuran</th><th class="text-left p-3 font-semibold text-sm">Meter Lalu</th><th class="text-left p-3 font-semibold text-sm">Meter Skrg</th><th class="text-left p-3 font-semibold text-sm">Pakai</th><th class="text-right p-3 font-semibold text-sm">Tagihan</th><th class="text-right p-3 font-semibold text-sm">Bayar</th><th class="text-right p-3 font-semibold text-sm">Selisih</th><th class="text-center p-3 font-semibold text-sm">Status Bayar</th></tr></thead><tbody><!--[-->`);
				ssrRenderList(unref(tagihanData), (item, index) => {
					_push(`<!--[--><!--[-->`);
					ssrRenderList(item.items, (detail, idx) => {
						_push(`<tr class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">`);
						if (idx === 0) _push(`<td${ssrRenderAttr("rowspan", item.items.length)} class="p-3 text-sm">${ssrInterpolate(index + 1)}</td>`);
						else _push(`<!---->`);
						if (idx === 0) _push(`<td${ssrRenderAttr("rowspan", item.items.length)} class="p-3 font-medium">${ssrInterpolate(item.blok)}-${ssrInterpolate(item.nomor_rumah)}</td>`);
						else _push(`<!---->`);
						if (idx === 0) _push(`<td${ssrRenderAttr("rowspan", item.items.length)} class="p-3"><span class="${ssrRenderClass([item.status_penghuni === "ada" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800", "px-2 py-1 rounded-full text-xs font-medium"])}">${ssrInterpolate(item.status_penghuni === "ada" ? "Dihuni" : "Kosong")}</span></td>`);
						else _push(`<!---->`);
						if (idx === 0) _push(`<td${ssrRenderAttr("rowspan", item.items.length)} class="p-3 text-center"><input type="checkbox"${ssrIncludeBooleanAttr(item.is_exempt) ? " checked" : ""} class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"></td>`);
						else _push(`<!---->`);
						_push(`<td class="p-3 text-sm">${ssrInterpolate(detail.kategori_nama)}</td><td class="p-3 text-sm">${ssrInterpolate(detail.meter_lalu || "-")}</td><td class="p-3 text-sm">${ssrInterpolate(detail.meter_sekarang || "-")}</td><td class="p-3 text-sm">${ssrInterpolate(detail.pemakaian || "-")}${ssrInterpolate(detail.tipe === "meteran" ? " m³" : "")}</td><td class="p-3 text-sm text-right">${ssrInterpolate(unref(formatRupiah)(detail.jumlah_tagihan))}</td>`);
						if (idx === 0) _push(`<td${ssrRenderAttr("rowspan", item.items.length)} class="p-3 text-sm text-right font-medium">${ssrInterpolate(unref(formatRupiah)(item.total_bayar))}</td>`);
						else _push(`<!---->`);
						if (idx === 0) _push(`<td${ssrRenderAttr("rowspan", item.items.length)} class="p-3 text-sm text-right"><span class="${ssrRenderClass(item.selisih >= 0 ? "text-green-600" : "text-red-600")}">${ssrInterpolate(item.selisih >= 0 ? "+" : "")}${ssrInterpolate(unref(formatRupiah)(item.selisih))}</span></td>`);
						else _push(`<!---->`);
						if (idx === 0) _push(`<td${ssrRenderAttr("rowspan", item.items.length)} class="p-3 text-center"><span class="${ssrRenderClass([unref(getStatusColor)(item.status), "px-2 py-1 rounded-full text-xs font-medium"])}">${ssrInterpolate(unref(getStatusText)(item.status))}</span></td>`);
						else _push(`<!---->`);
						_push(`</tr>`);
					});
					_push(`<!--]--><!--]-->`);
				});
				_push(`<!--]--></tbody><tfoot><tr class="bg-gray-50 dark:bg-gray-700 font-bold"><td colspan="7" class="p-3 text-right">TOTAL</td><td class="p-3 text-right">${ssrInterpolate(unref(formatRupiah)(unref(totalTagihan)))}</td><td class="p-3 text-right">${ssrInterpolate(unref(formatRupiah)(unref(totalBayar)))}</td><td class="p-3 text-right"><span class="${ssrRenderClass(unref(totalSelisih) >= 0 ? "text-green-600" : "text-red-600")}">${ssrInterpolate(unref(formatRupiah)(unref(totalSelisih)))}</span></td><td></td></tr></tfoot></table></div></div>`);
			} else if (!unref(loading)) _push(`<div class="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center text-gray-500"> Pilih periode dan klik &quot;Load Data&quot; untuk menampilkan tagihan </div>`);
			else _push(`<!---->`);
			_push(`</div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/tagihan.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=tagihan-DElNMWlV.mjs.map
