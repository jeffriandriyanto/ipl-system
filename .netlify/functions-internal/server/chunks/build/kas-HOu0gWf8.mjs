import { _ as _sfc_main$1, $ as $fetch$2 } from '../virtual/entry.mjs';
import { _ as _sfc_main$2 } from './Modal-BK5i0WLm.mjs';
import { u as useTenant } from './useTenant-B7s_AqNz.mjs';
import { u as useBilling } from './useBilling-CKDam3tl.mjs';
import { ref, reactive, unref, isRef, withCtx, createVNode, withModifiers, withDirectives, vModelSelect, vModelText, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderAttr, ssrRenderList } from 'vue/server-renderer';
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

//#region app/pages/admin/kas.vue
var _sfc_main = {
	__name: "kas",
	__ssrInlineRender: true,
	setup(__props) {
		const { tenantId } = useTenant();
		const kasList = ref([]);
		const summary = ref({
			total_masuk: 0,
			total_keluar: 0,
			saldo: 0
		});
		const showForm = ref(false);
		const saving = ref(false);
		const filterTipe = ref("");
		const filterBulan = ref((/* @__PURE__ */ new Date()).toISOString().slice(0, 7));
		const form = reactive({
			tipe: "masuk",
			kategori: "iuran",
			jumlah: 0,
			tanggal: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
			keterangan: ""
		});
		const { formatRupiah } = useBilling();
		function formatDate(date) {
			return new Date(date).toLocaleDateString("id-ID", {
				day: "numeric",
				month: "long",
				year: "numeric"
			});
		}
		async function fetchKas() {
			try {
				let url = `/api/kas?tenant_id=${tenantId}`;
				if (filterTipe.value) url += `&tipe=${filterTipe.value}`;
				if (filterBulan.value) url += `&bulan=${filterBulan.value}`;
				const data = await $fetch$2(url);
				kasList.value = data.data || [];
				summary.value = data.summary || {
					total_masuk: 0,
					total_keluar: 0,
					saldo: 0
				};
			} catch (error) {
				console.error("Error fetching kas:", error);
			}
		}
		function openForm() {
			form.tipe = "masuk";
			form.kategori = "iuran";
			form.jumlah = 0;
			form.tanggal = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
			form.keterangan = "";
			showForm.value = true;
		}
		function closeForm() {
			showForm.value = false;
		}
		async function handleSubmit() {
			saving.value = true;
			try {
				await $fetch$2("/api/kas", {
					method: "POST",
					body: {
						...form,
						tenant_id: tenantId
					}
				});
				closeForm();
				await fetchKas();
			} catch (error) {
				alert(error.data?.message || "Gagal menyimpan transaksi");
			} finally {
				saving.value = false;
			}
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UButton = _sfc_main$1;
			const _component_UModal = _sfc_main$2;
			_push(`<div${ssrRenderAttrs(_attrs)}><div class="flex justify-between items-center mb-6"><h1 class="text-2xl font-bold">Kas Masuk/Keluar</h1>`);
			_push(ssrRenderComponent(_component_UButton, {
				label: "Tambah Transaksi",
				icon: "i-lucide-plus",
				onClick: ($event) => openForm()
			}, null, _parent));
			_push(`</div><div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"><div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4"><p class="text-sm text-gray-500">Kas Masuk</p><p class="text-2xl font-bold text-green-600">${ssrInterpolate(unref(formatRupiah)(unref(summary).total_masuk))}</p></div><div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-4"><p class="text-sm text-gray-500">Kas Keluar</p><p class="text-2xl font-bold text-red-600">${ssrInterpolate(unref(formatRupiah)(unref(summary).total_keluar))}</p></div><div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4"><p class="text-sm text-gray-500">Saldo</p><p class="${ssrRenderClass([unref(summary).saldo >= 0 ? "text-blue-600" : "text-red-600", "text-2xl font-bold"])}">${ssrInterpolate(unref(formatRupiah)(unref(summary).saldo))}</p></div></div><div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6"><div class="flex flex-wrap gap-4"><div><label class="text-sm font-medium mb-1 block">Tipe</label><select class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filterTipe)) ? ssrLooseContain(unref(filterTipe), "") : ssrLooseEqual(unref(filterTipe), "")) ? " selected" : ""}>Semua</option><option value="masuk"${ssrIncludeBooleanAttr(Array.isArray(unref(filterTipe)) ? ssrLooseContain(unref(filterTipe), "masuk") : ssrLooseEqual(unref(filterTipe), "masuk")) ? " selected" : ""}>Kas Masuk</option><option value="keluar"${ssrIncludeBooleanAttr(Array.isArray(unref(filterTipe)) ? ssrLooseContain(unref(filterTipe), "keluar") : ssrLooseEqual(unref(filterTipe), "keluar")) ? " selected" : ""}>Kas Keluar</option></select></div><div><label class="text-sm font-medium mb-1 block">Bulan</label><input${ssrRenderAttr("value", unref(filterBulan))} type="month" class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"></div><div class="flex items-end">`);
			_push(ssrRenderComponent(_component_UButton, {
				label: "Filter",
				icon: "i-lucide-filter",
				onClick: fetchKas
			}, null, _parent));
			_push(`</div></div></div><div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"><div class="overflow-x-auto"><table class="w-full"><thead><tr class="border-b border-gray-200 dark:border-gray-700"><th class="text-left p-4 font-semibold">Tanggal</th><th class="text-left p-4 font-semibold">Tipe</th><th class="text-left p-4 font-semibold">Kategori</th><th class="text-left p-4 font-semibold">Keterangan</th><th class="text-right p-4 font-semibold">Jumlah</th></tr></thead><tbody><!--[-->`);
			ssrRenderList(unref(kasList), (item) => {
				_push(`<tr class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"><td class="p-4 text-sm">${ssrInterpolate(formatDate(item.tanggal))}</td><td class="p-4"><span class="${ssrRenderClass([item.tipe === "masuk" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800", "px-2 py-1 rounded-full text-xs font-medium"])}">${ssrInterpolate(item.tipe === "masuk" ? "Masuk" : "Keluar")}</span></td><td class="p-4 text-sm capitalize">${ssrInterpolate(item.kategori)}</td><td class="p-4 text-sm">${ssrInterpolate(item.keterangan || "-")}</td><td class="${ssrRenderClass([item.tipe === "masuk" ? "text-green-600" : "text-red-600", "p-4 text-right font-medium"])}">${ssrInterpolate(item.tipe === "masuk" ? "+" : "-")} ${ssrInterpolate(unref(formatRupiah)(item.jumlah))}</td></tr>`);
			});
			_push(`<!--]--></tbody></table></div>`);
			if (unref(kasList).length === 0) _push(`<div class="p-8 text-center text-gray-500"> Belum ada transaksi kas </div>`);
			else _push(`<!---->`);
			_push(`</div>`);
			_push(ssrRenderComponent(_component_UModal, {
				open: unref(showForm),
				"onUpdate:open": ($event) => isRef(showForm) ? showForm.value = $event : null,
				title: "Tambah Transaksi Kas"
			}, {
				body: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<form class="space-y-4"${_scopeId}><div${_scopeId}><label class="block text-sm font-medium mb-1"${_scopeId}>Tipe</label><select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"${_scopeId}><option value="masuk"${ssrIncludeBooleanAttr(Array.isArray(unref(form).tipe) ? ssrLooseContain(unref(form).tipe, "masuk") : ssrLooseEqual(unref(form).tipe, "masuk")) ? " selected" : ""}${_scopeId}>Kas Masuk</option><option value="keluar"${ssrIncludeBooleanAttr(Array.isArray(unref(form).tipe) ? ssrLooseContain(unref(form).tipe, "keluar") : ssrLooseEqual(unref(form).tipe, "keluar")) ? " selected" : ""}${_scopeId}>Kas Keluar</option></select></div><div${_scopeId}><label class="block text-sm font-medium mb-1"${_scopeId}>Kategori</label><select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"${_scopeId}><option value="iuran"${ssrIncludeBooleanAttr(Array.isArray(unref(form).kategori) ? ssrLooseContain(unref(form).kategori, "iuran") : ssrLooseEqual(unref(form).kategori, "iuran")) ? " selected" : ""}${_scopeId}>Iuran</option><option value="donasi"${ssrIncludeBooleanAttr(Array.isArray(unref(form).kategori) ? ssrLooseContain(unref(form).kategori, "donasi") : ssrLooseEqual(unref(form).kategori, "donasi")) ? " selected" : ""}${_scopeId}>Donasi</option><option value="operasional"${ssrIncludeBooleanAttr(Array.isArray(unref(form).kategori) ? ssrLooseContain(unref(form).kategori, "operasional") : ssrLooseEqual(unref(form).kategori, "operasional")) ? " selected" : ""}${_scopeId}>Operasional</option><option value="lainnya"${ssrIncludeBooleanAttr(Array.isArray(unref(form).kategori) ? ssrLooseContain(unref(form).kategori, "lainnya") : ssrLooseEqual(unref(form).kategori, "lainnya")) ? " selected" : ""}${_scopeId}>Lainnya</option></select></div><div${_scopeId}><label class="block text-sm font-medium mb-1"${_scopeId}>Jumlah (Rp)</label><input${ssrRenderAttr("value", unref(form).jumlah)} type="number" placeholder="0" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" required${_scopeId}></div><div${_scopeId}><label class="block text-sm font-medium mb-1"${_scopeId}>Tanggal</label><input${ssrRenderAttr("value", unref(form).tanggal)} type="date" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" required${_scopeId}></div><div${_scopeId}><label class="block text-sm font-medium mb-1"${_scopeId}>Keterangan</label><textarea placeholder="Keterangan transaksi" rows="2" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"${_scopeId}>${ssrInterpolate(unref(form).keterangan)}</textarea></div></form>`);
					else return [createVNode("form", {
						onSubmit: withModifiers(handleSubmit, ["prevent"]),
						class: "space-y-4"
					}, [
						createVNode("div", null, [createVNode("label", { class: "block text-sm font-medium mb-1" }, "Tipe"), withDirectives(createVNode("select", {
							"onUpdate:modelValue": ($event) => unref(form).tipe = $event,
							class: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
						}, [createVNode("option", { value: "masuk" }, "Kas Masuk"), createVNode("option", { value: "keluar" }, "Kas Keluar")], 8, ["onUpdate:modelValue"]), [[vModelSelect, unref(form).tipe]])]),
						createVNode("div", null, [createVNode("label", { class: "block text-sm font-medium mb-1" }, "Kategori"), withDirectives(createVNode("select", {
							"onUpdate:modelValue": ($event) => unref(form).kategori = $event,
							class: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
						}, [
							createVNode("option", { value: "iuran" }, "Iuran"),
							createVNode("option", { value: "donasi" }, "Donasi"),
							createVNode("option", { value: "operasional" }, "Operasional"),
							createVNode("option", { value: "lainnya" }, "Lainnya")
						], 8, ["onUpdate:modelValue"]), [[vModelSelect, unref(form).kategori]])]),
						createVNode("div", null, [createVNode("label", { class: "block text-sm font-medium mb-1" }, "Jumlah (Rp)"), withDirectives(createVNode("input", {
							"onUpdate:modelValue": ($event) => unref(form).jumlah = $event,
							type: "number",
							placeholder: "0",
							class: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500",
							required: ""
						}, null, 8, ["onUpdate:modelValue"]), [[
							vModelText,
							unref(form).jumlah,
							void 0,
							{ number: true }
						]])]),
						createVNode("div", null, [createVNode("label", { class: "block text-sm font-medium mb-1" }, "Tanggal"), withDirectives(createVNode("input", {
							"onUpdate:modelValue": ($event) => unref(form).tanggal = $event,
							type: "date",
							class: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500",
							required: ""
						}, null, 8, ["onUpdate:modelValue"]), [[vModelText, unref(form).tanggal]])]),
						createVNode("div", null, [createVNode("label", { class: "block text-sm font-medium mb-1" }, "Keterangan"), withDirectives(createVNode("textarea", {
							"onUpdate:modelValue": ($event) => unref(form).keterangan = $event,
							placeholder: "Keterangan transaksi",
							rows: "2",
							class: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
						}, null, 8, ["onUpdate:modelValue"]), [[vModelText, unref(form).keterangan]])])
					], 32)];
				}),
				footer: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="flex justify-end gap-2"${_scopeId}>`);
						_push(ssrRenderComponent(_component_UButton, {
							label: "Batal",
							variant: "ghost",
							onClick: closeForm
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_component_UButton, {
							label: "Simpan",
							loading: unref(saving),
							onClick: handleSubmit
						}, null, _parent, _scopeId));
						_push(`</div>`);
					} else return [createVNode("div", { class: "flex justify-end gap-2" }, [createVNode(_component_UButton, {
						label: "Batal",
						variant: "ghost",
						onClick: closeForm
					}), createVNode(_component_UButton, {
						label: "Simpan",
						loading: unref(saving),
						onClick: handleSubmit
					}, null, 8, ["loading"])])];
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/kas.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=kas-HOu0gWf8.mjs.map
