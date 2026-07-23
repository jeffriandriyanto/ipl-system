import { _ as _sfc_main$1, $ as $fetch$2 } from '../virtual/entry.mjs';
import { _ as _sfc_main$2 } from './Modal-BK5i0WLm.mjs';
import { u as useTenant } from './useTenant-B7s_AqNz.mjs';
import { ref, unref, isRef, withCtx, openBlock, createBlock, createVNode, toDisplayString, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
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
import './utils-pnmB2GYd.mjs';
import 'aria-hidden';

//#region app/pages/admin/audit-log.vue
var _sfc_main = {
	__name: "audit-log",
	__ssrInlineRender: true,
	setup(__props) {
		const { tenantId } = useTenant();
		const logs = ref([]);
		const pagination = ref({
			page: 1,
			limit: 50,
			total: 0,
			totalPages: 0
		});
		const filterKoleksi = ref("");
		const showDetailModal = ref(false);
		const selectedLog = ref(null);
		function formatDateTime(date) {
			return new Date(date).toLocaleString("id-ID", {
				day: "numeric",
				month: "short",
				year: "numeric",
				hour: "2-digit",
				minute: "2-digit"
			});
		}
		async function fetchLogs() {
			try {
				let url = `/api/audit-log?tenant_id=${tenantId}&page=${pagination.value.page}&limit=${pagination.value.limit}`;
				if (filterKoleksi.value) url += `&koleksi=${filterKoleksi.value}`;
				const data = await $fetch$2(url);
				logs.value = data.data || [];
				pagination.value = data.pagination || {
					page: 1,
					limit: 50,
					total: 0,
					totalPages: 0
				};
			} catch (error) {
				console.error("Error fetching audit logs:", error);
			}
		}
		function changePage(page) {
			pagination.value.page = page;
			fetchLogs();
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UButton = _sfc_main$1;
			const _component_UModal = _sfc_main$2;
			_push(`<div${ssrRenderAttrs(_attrs)}><div class="flex justify-between items-center mb-6"><h1 class="text-2xl font-bold">Audit Log</h1></div><div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6"><div class="flex flex-wrap gap-4"><div><label class="text-sm font-medium mb-1 block">Koleksi</label><select class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filterKoleksi)) ? ssrLooseContain(unref(filterKoleksi), "") : ssrLooseEqual(unref(filterKoleksi), "")) ? " selected" : ""}>Semua</option><option value="rumah"${ssrIncludeBooleanAttr(Array.isArray(unref(filterKoleksi)) ? ssrLooseContain(unref(filterKoleksi), "rumah") : ssrLooseEqual(unref(filterKoleksi), "rumah")) ? " selected" : ""}>Rumah</option><option value="tagihan"${ssrIncludeBooleanAttr(Array.isArray(unref(filterKoleksi)) ? ssrLooseContain(unref(filterKoleksi), "tagihan") : ssrLooseEqual(unref(filterKoleksi), "tagihan")) ? " selected" : ""}>Tagihan</option><option value="pembayaran"${ssrIncludeBooleanAttr(Array.isArray(unref(filterKoleksi)) ? ssrLooseContain(unref(filterKoleksi), "pembayaran") : ssrLooseEqual(unref(filterKoleksi), "pembayaran")) ? " selected" : ""}>Pembayaran</option><option value="kategori_iuran"${ssrIncludeBooleanAttr(Array.isArray(unref(filterKoleksi)) ? ssrLooseContain(unref(filterKoleksi), "kategori_iuran") : ssrLooseEqual(unref(filterKoleksi), "kategori_iuran")) ? " selected" : ""}>Kategori Iuran</option><option value="user"${ssrIncludeBooleanAttr(Array.isArray(unref(filterKoleksi)) ? ssrLooseContain(unref(filterKoleksi), "user") : ssrLooseEqual(unref(filterKoleksi), "user")) ? " selected" : ""}>User</option><option value="kas_transaksi"${ssrIncludeBooleanAttr(Array.isArray(unref(filterKoleksi)) ? ssrLooseContain(unref(filterKoleksi), "kas_transaksi") : ssrLooseEqual(unref(filterKoleksi), "kas_transaksi")) ? " selected" : ""}>Kas</option></select></div><div class="flex items-end">`);
			_push(ssrRenderComponent(_component_UButton, {
				label: "Filter",
				icon: "i-lucide-filter",
				onClick: fetchLogs
			}, null, _parent));
			_push(`</div></div></div><div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"><div class="overflow-x-auto"><table class="w-full"><thead><tr class="border-b border-gray-200 dark:border-gray-700"><th class="text-left p-4 font-semibold">Waktu</th><th class="text-left p-4 font-semibold">User</th><th class="text-left p-4 font-semibold">Aksi</th><th class="text-left p-4 font-semibold">Koleksi</th><th class="text-left p-4 font-semibold">Dokumen</th><th class="text-left p-4 font-semibold">Detail</th></tr></thead><tbody><!--[-->`);
			ssrRenderList(unref(logs), (item) => {
				_push(`<tr class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"><td class="p-4 text-sm">${ssrInterpolate(formatDateTime(item.timestamp))}</td><td class="p-4 text-sm">${ssrInterpolate(item.user_nama)}</td><td class="p-4"><span class="${ssrRenderClass([{
					"bg-green-100 text-green-800": item.aksi === "create",
					"bg-blue-100 text-blue-800": item.aksi === "update",
					"bg-red-100 text-red-800": item.aksi === "delete"
				}, "px-2 py-1 rounded-full text-xs font-medium"])}">${ssrInterpolate(item.aksi)}</span></td><td class="p-4 text-sm capitalize">${ssrInterpolate(item.koleksi)}</td><td class="p-4 text-sm font-mono">${ssrInterpolate(item.dokumen_id)}</td><td class="p-4">`);
				if (item.perubahan) _push(`<button class="text-primary-600 hover:underline text-sm"> Lihat </button>`);
				else _push(`<span class="text-gray-400 text-sm">-</span>`);
				_push(`</td></tr>`);
			});
			_push(`<!--]--></tbody></table></div>`);
			if (unref(logs).length === 0) _push(`<div class="p-8 text-center text-gray-500"> Belum ada audit log </div>`);
			else _push(`<!---->`);
			_push(`</div>`);
			if (unref(pagination).totalPages > 1) {
				_push(`<div class="flex justify-center gap-2 mt-6">`);
				_push(ssrRenderComponent(_component_UButton, {
					label: "Sebelumnya",
					disabled: unref(pagination).page <= 1,
					onClick: ($event) => changePage(unref(pagination).page - 1)
				}, null, _parent));
				_push(`<span class="px-4 py-2 text-sm"> Halaman ${ssrInterpolate(unref(pagination).page)} dari ${ssrInterpolate(unref(pagination).totalPages)}</span>`);
				_push(ssrRenderComponent(_component_UButton, {
					label: "Selanjutnya",
					disabled: unref(pagination).page >= unref(pagination).totalPages,
					onClick: ($event) => changePage(unref(pagination).page + 1)
				}, null, _parent));
				_push(`</div>`);
			} else _push(`<!---->`);
			_push(ssrRenderComponent(_component_UModal, {
				open: unref(showDetailModal),
				"onUpdate:open": ($event) => isRef(showDetailModal) ? showDetailModal.value = $event : null,
				title: "Detail Perubahan"
			}, {
				body: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) if (unref(selectedLog)) _push(`<div class="space-y-4"${_scopeId}><div${_scopeId}><p class="text-sm font-medium text-gray-500"${_scopeId}>Sebelum</p><pre class="mt-1 p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm overflow-auto"${_scopeId}>${ssrInterpolate(JSON.stringify(unref(selectedLog).perubahan?.before, null, 2))}</pre></div><div${_scopeId}><p class="text-sm font-medium text-gray-500"${_scopeId}>Sesudah</p><pre class="mt-1 p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm overflow-auto"${_scopeId}>${ssrInterpolate(JSON.stringify(unref(selectedLog).perubahan?.after, null, 2))}</pre></div></div>`);
					else _push(`<!---->`);
					else return [unref(selectedLog) ? (openBlock(), createBlock("div", {
						key: 0,
						class: "space-y-4"
					}, [createVNode("div", null, [createVNode("p", { class: "text-sm font-medium text-gray-500" }, "Sebelum"), createVNode("pre", { class: "mt-1 p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm overflow-auto" }, toDisplayString(JSON.stringify(unref(selectedLog).perubahan?.before, null, 2)), 1)]), createVNode("div", null, [createVNode("p", { class: "text-sm font-medium text-gray-500" }, "Sesudah"), createVNode("pre", { class: "mt-1 p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm overflow-auto" }, toDisplayString(JSON.stringify(unref(selectedLog).perubahan?.after, null, 2)), 1)])])) : createCommentVNode("", true)];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/audit-log.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=audit-log-CnEivngx.mjs.map
