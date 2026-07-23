import { r as _sfc_main$1, _ as _sfc_main$2, $ as $fetch$2 } from '../virtual/entry.mjs';
import { u as useTenant } from './useTenant-B7s_AqNz.mjs';
import { u as useBilling } from './useBilling-CKDam3tl.mjs';
import { ref, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
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

//#region app/pages/admin/tutup-buku.vue
var _sfc_main = {
	__name: "tutup-buku",
	__ssrInlineRender: true,
	setup(__props) {
		const { tenantId } = useTenant();
		const periodes = ref([]);
		const processing = ref(null);
		const { formatRupiah } = useBilling();
		const months = [
			"Januari",
			"Februari",
			"Maret",
			"April",
			"Mei",
			"Juni",
			"Juli",
			"Agustus",
			"September",
			"Oktober",
			"November",
			"Desember"
		];
		function formatPeriode(periode) {
			const [year, month] = periode.split("-");
			return `${months[parseInt(month) - 1]} ${year}`;
		}
		function formatDate(date) {
			if (!date) return "-";
			return new Date(date).toLocaleDateString("id-ID", {
				day: "numeric",
				month: "long",
				year: "numeric",
				hour: "2-digit",
				minute: "2-digit"
			});
		}
		function statusClass(status) {
			switch (status) {
				case "draft": return "bg-yellow-100 text-yellow-800";
				case "published": return "bg-blue-100 text-blue-800";
				case "ditutup": return "bg-gray-100 text-gray-800";
				default: return "bg-gray-100 text-gray-800";
			}
		}
		function statusLabel(status) {
			switch (status) {
				case "draft": return "Draft";
				case "published": return "Published";
				case "ditutup": return "Ditutup";
				default: return status;
			}
		}
		async function fetchPeriodes() {
			try {
				const data = await $fetch$2(`/api/tutup-buku?tenant_id=${tenantId}`);
				periodes.value = data;
			} catch (error) {
				console.error("Error fetching periodes:", error);
			}
		}
		async function publishPeriode(item) {
			if (!confirm(`Publish tagihan periode ${formatPeriode(item.periode)}?\n\nSetelah publish, warga sudah bisa melihat tagihan mereka.`)) return;
			processing.value = item.periode + "-publish";
			try {
				const result = await $fetch$2(`/api/tutup-buku/${item.periode}/action`, {
					method: "POST",
					body: {
						tenant_id: tenantId,
						action: "publish"
					}
				});
				alert(result.message);
				await fetchPeriodes();
			} catch (error) {
				alert(error.data?.message || "Gagal publish periode");
			} finally {
				processing.value = null;
			}
		}
		async function tutupBuku(item) {
			if (!confirm(`Tutup buku periode ${formatPeriode(item.periode)}?\n\nTindakan ini TIDAK BISA dibatalkan! Data akan terkunci permanen.`)) return;
			processing.value = item.periode + "-tutup";
			try {
				const result = await $fetch$2(`/api/tutup-buku/${item.periode}/action`, {
					method: "POST",
					body: {
						tenant_id: tenantId,
						action: "tutup"
					}
				});
				alert(result.message);
				await fetchPeriodes();
			} catch (error) {
				alert(error.data?.message || "Gagal menutup periode");
			} finally {
				processing.value = null;
			}
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UIcon = _sfc_main$1;
			const _component_UButton = _sfc_main$2;
			_push(`<div${ssrRenderAttrs(_attrs)}><div class="flex justify-between items-center mb-6"><h1 class="text-2xl font-bold">Tutup Buku</h1></div><div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 rounded-lg p-4 mb-6"><div class="flex items-start gap-3">`);
			_push(ssrRenderComponent(_component_UIcon, {
				name: "i-lucide-info",
				class: "text-blue-600 text-xl mt-0.5"
			}, null, _parent));
			_push(`<div><p class="font-semibold text-blue-800">Alur Periode</p><p class="text-sm text-blue-700 mt-1"><span class="font-medium">Draft</span> → Input meteran &amp; generate tagihan → <span class="font-medium">Publish</span> → Warga bisa cek tagihan → <span class="font-medium">Tutup</span> → Data terkunci </p></div></div></div><div class="space-y-4"><!--[-->`);
			ssrRenderList(unref(periodes), (item) => {
				_push(`<div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"><div class="p-6"><div class="flex justify-between items-start"><div><h3 class="text-lg font-bold">${ssrInterpolate(formatPeriode(item.periode))}</h3><p class="text-sm text-gray-500 mt-1">${ssrInterpolate(item.jumlah_rumah)} rumah • ${ssrInterpolate(item.jumlah_lunas)} lunas • ${ssrInterpolate(item.jumlah_belum)} belum </p></div><span class="${ssrRenderClass([statusClass(item.status), "px-3 py-1 rounded-full text-sm font-medium"])}">${ssrInterpolate(statusLabel(item.status))}</span></div><div class="grid grid-cols-3 gap-4 mt-4"><div><p class="text-sm text-gray-500">Total Tagihan</p><p class="font-semibold">${ssrInterpolate(unref(formatRupiah)(item.total_tagihan))}</p></div><div><p class="text-sm text-gray-500">Total Bayar</p><p class="font-semibold text-green-600">${ssrInterpolate(unref(formatRupiah)(item.total_bayar))}</p></div><div><p class="text-sm text-gray-500">Selisih</p><p class="${ssrRenderClass([item.total_selisih >= 0 ? "text-green-600" : "text-red-600", "font-semibold"])}">${ssrInterpolate(unref(formatRupiah)(item.total_selisih))}</p></div></div><div class="mt-4 pt-4 border-t flex justify-between items-center"><p class="text-sm text-gray-500">`);
				if (item.status === "draft") _push(`<!--[--> Status: Draft (belum visible untuk warga) <!--]-->`);
				else if (item.status === "published") _push(`<!--[--> Dipublish • Belum ditutup <!--]-->`);
				else _push(`<!--[--> Ditutup pada: ${ssrInterpolate(formatDate(item.ditutup_pada))}<!--]-->`);
				_push(`</p><div class="flex gap-2">`);
				if (item.status === "draft") _push(ssrRenderComponent(_component_UButton, {
					label: "Publish",
					icon: "i-lucide-send",
					color: "green",
					loading: unref(processing) === item.periode + "-publish",
					onClick: ($event) => publishPeriode(item)
				}, null, _parent));
				else _push(`<!---->`);
				if (item.status === "published") _push(ssrRenderComponent(_component_UButton, {
					label: "Tutup Buku",
					icon: "i-lucide-lock",
					color: "red",
					loading: unref(processing) === item.periode + "-tutup",
					onClick: ($event) => tutupBuku(item)
				}, null, _parent));
				else _push(`<!---->`);
				if (item.status === "ditutup") {
					_push(`<span class="flex items-center gap-1 text-sm text-gray-500">`);
					_push(ssrRenderComponent(_component_UIcon, {
						name: "i-lucide-lock",
						class: "text-green-600"
					}, null, _parent));
					_push(` Terkunci </span>`);
				} else _push(`<!---->`);
				_push(`</div></div></div></div>`);
			});
			_push(`<!--]--></div>`);
			if (unref(periodes).length === 0) _push(`<div class="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center text-gray-500"> Belum ada periode </div>`);
			else _push(`<!---->`);
			_push(`</div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/tutup-buku.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=tutup-buku-CtsM429-.mjs.map
