import { _ as _sfc_main$1, $ as $fetch$2 } from '../virtual/entry.mjs';
import { _ as _sfc_main$2 } from './Modal-BK5i0WLm.mjs';
import { u as useTenant } from './useTenant-B7s_AqNz.mjs';
import { u as useBilling } from './useBilling-CKDam3tl.mjs';
import { ref, reactive, unref, isRef, withCtx, createVNode, withModifiers, withDirectives, vModelText, vModelSelect, openBlock, createBlock, createCommentVNode, Fragment, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
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
import './utils-pnmB2GYd.mjs';
import 'aria-hidden';

//#region app/pages/admin/kategori.vue
var _sfc_main = {
	__name: "kategori",
	__ssrInlineRender: true,
	setup(__props) {
		const { tenantId } = useTenant();
		const kategori = ref([]);
		const showForm = ref(false);
		const editingKategori = ref(null);
		const saving = ref(false);
		const form = reactive({
			nama: "",
			tipe: "flat",
			tarif_flat: 0,
			tarif_per_m3: 0,
			minimum_kuota: 0,
			minimum_tarif: 0,
			status: "aktif"
		});
		const { formatRupiah } = useBilling();
		async function fetchKategori() {
			try {
				const data = await $fetch$2(`/api/kategori?tenant_id=${tenantId}`);
				kategori.value = data;
			} catch (error) {
				console.error("Error fetching kategori:", error);
			}
		}
		function openForm(item = null) {
			editingKategori.value = item;
			if (item) {
				form.nama = item.nama;
				form.tipe = item.tipe;
				form.tarif_flat = item.tarif_flat;
				form.tarif_per_m3 = item.tarif_per_m3;
				form.minimum_kuota = item.minimum_kuota;
				form.minimum_tarif = item.minimum_tarif;
				form.status = item.status;
			} else {
				form.nama = "";
				form.tipe = "flat";
				form.tarif_flat = 0;
				form.tarif_per_m3 = 0;
				form.minimum_kuota = 0;
				form.minimum_tarif = 0;
				form.status = "aktif";
			}
			showForm.value = true;
		}
		function closeForm() {
			showForm.value = false;
			editingKategori.value = null;
		}
		async function deleteKategori(item) {
			if (!confirm(`Hapus kategori "${item.nama}"?`)) return;
			try {
				await $fetch$2(`/api/kategori/${item.id}`, { method: "DELETE" });
				await fetchKategori();
			} catch (error) {
				alert(error.data?.message || "Gagal menghapus kategori");
			}
		}
		async function handleSubmit() {
			saving.value = true;
			try {
				if (editingKategori.value) await $fetch$2(`/api/kategori/${editingKategori.value.id}`, {
					method: "PUT",
					body: form
				});
				else await $fetch$2("/api/kategori", {
					method: "POST",
					body: {
						...form,
						tenant_id: tenantId
					}
				});
				closeForm();
				await fetchKategori();
			} catch (error) {
				alert(error.data?.message || "Gagal menyimpan kategori");
			} finally {
				saving.value = false;
			}
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UButton = _sfc_main$1;
			const _component_UModal = _sfc_main$2;
			_push(`<div${ssrRenderAttrs(_attrs)}><div class="flex justify-between items-center mb-6"><h1 class="text-2xl font-bold">Kategori Iuran</h1>`);
			_push(ssrRenderComponent(_component_UButton, {
				label: "Tambah Kategori",
				icon: "i-lucide-plus",
				onClick: ($event) => openForm()
			}, null, _parent));
			_push(`</div><div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"><div class="overflow-x-auto"><table class="w-full"><thead><tr class="border-b border-gray-200 dark:border-gray-700"><th class="text-left p-4 font-semibold">Nama</th><th class="text-left p-4 font-semibold">Tipe</th><th class="text-left p-4 font-semibold">Tarif</th><th class="text-left p-4 font-semibold">Status</th><th class="text-left p-4 font-semibold">Aksi</th></tr></thead><tbody><!--[-->`);
			ssrRenderList(unref(kategori), (item) => {
				_push(`<tr class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"><td class="p-4">${ssrInterpolate(item.nama)}</td><td class="p-4"><span class="${ssrRenderClass([item.tipe === "meteran" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800", "px-2 py-1 rounded-full text-xs font-medium"])}">${ssrInterpolate(item.tipe === "meteran" ? "Meteran" : "Flat")}</span></td><td class="p-4">`);
				if (item.tipe === "flat") _push(`<div>${ssrInterpolate(unref(formatRupiah)(item.tarif_flat))}</div>`);
				else _push(`<div><div>Min: ${ssrInterpolate(unref(formatRupiah)(item.minimum_tarif))} (${ssrInterpolate(item.minimum_kuota)}m³)</div><div class="text-sm text-gray-500">Extra: ${ssrInterpolate(unref(formatRupiah)(item.tarif_per_m3))}/m³</div></div>`);
				_push(`</td><td class="p-4"><span class="${ssrRenderClass([item.status === "aktif" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800", "px-2 py-1 rounded-full text-xs font-medium"])}">${ssrInterpolate(item.status === "aktif" ? "Aktif" : "Nonaktif")}</span></td><td class="p-4"><div class="flex gap-2">`);
				_push(ssrRenderComponent(_component_UButton, {
					icon: "i-lucide-edit",
					variant: "ghost",
					size: "sm",
					onClick: ($event) => openForm(item)
				}, null, _parent));
				_push(ssrRenderComponent(_component_UButton, {
					icon: "i-lucide-trash-2",
					variant: "ghost",
					color: "red",
					size: "sm",
					onClick: ($event) => deleteKategori(item)
				}, null, _parent));
				_push(`</div></td></tr>`);
			});
			_push(`<!--]--></tbody></table></div>`);
			if (unref(kategori).length === 0) _push(`<div class="p-8 text-center text-gray-500"> Belum ada kategori iuran </div>`);
			else _push(`<!---->`);
			_push(`</div>`);
			_push(ssrRenderComponent(_component_UModal, {
				open: unref(showForm),
				"onUpdate:open": ($event) => isRef(showForm) ? showForm.value = $event : null,
				title: unref(editingKategori) ? "Edit Kategori" : "Tambah Kategori"
			}, {
				body: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<form class="space-y-4"${_scopeId}><div${_scopeId}><label class="block text-sm font-medium mb-1"${_scopeId}>Nama Kategori</label><input${ssrRenderAttr("value", unref(form).nama)} type="text" placeholder="Contoh: Air, Sampah" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" required${_scopeId}></div><div${_scopeId}><label class="block text-sm font-medium mb-1"${_scopeId}>Tipe</label><select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"${_scopeId}><option value="flat"${ssrIncludeBooleanAttr(Array.isArray(unref(form).tipe) ? ssrLooseContain(unref(form).tipe, "flat") : ssrLooseEqual(unref(form).tipe, "flat")) ? " selected" : ""}${_scopeId}>Flat (tetap)</option><option value="meteran"${ssrIncludeBooleanAttr(Array.isArray(unref(form).tipe) ? ssrLooseContain(unref(form).tipe, "meteran") : ssrLooseEqual(unref(form).tipe, "meteran")) ? " selected" : ""}${_scopeId}>Meteran (berdasarkan pemakaian)</option></select></div>`);
						if (unref(form).tipe === "flat") _push(`<div${_scopeId}><label class="block text-sm font-medium mb-1"${_scopeId}>Tarif Flat (Rp)</label><input${ssrRenderAttr("value", unref(form).tarif_flat)} type="number" placeholder="25000" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"${_scopeId}></div>`);
						else _push(`<!---->`);
						if (unref(form).tipe === "meteran") _push(`<!--[--><div${_scopeId}><label class="block text-sm font-medium mb-1"${_scopeId}>Minimum Kuota (m³)</label><input${ssrRenderAttr("value", unref(form).minimum_kuota)} type="number" placeholder="10" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"${_scopeId}></div><div${_scopeId}><label class="block text-sm font-medium mb-1"${_scopeId}>Minimum Tarif (Rp)</label><input${ssrRenderAttr("value", unref(form).minimum_tarif)} type="number" placeholder="25000" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"${_scopeId}></div><div${_scopeId}><label class="block text-sm font-medium mb-1"${_scopeId}>Tarif per m³ (Rp)</label><input${ssrRenderAttr("value", unref(form).tarif_per_m3)} type="number" placeholder="3000" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"${_scopeId}></div><!--]-->`);
						else _push(`<!---->`);
						_push(`<div${_scopeId}><label class="block text-sm font-medium mb-1"${_scopeId}>Status</label><select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"${_scopeId}><option value="aktif"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "aktif") : ssrLooseEqual(unref(form).status, "aktif")) ? " selected" : ""}${_scopeId}>Aktif</option><option value="nonaktif"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "nonaktif") : ssrLooseEqual(unref(form).status, "nonaktif")) ? " selected" : ""}${_scopeId}>Nonaktif</option></select></div></form>`);
					} else return [createVNode("form", {
						onSubmit: withModifiers(handleSubmit, ["prevent"]),
						class: "space-y-4"
					}, [
						createVNode("div", null, [createVNode("label", { class: "block text-sm font-medium mb-1" }, "Nama Kategori"), withDirectives(createVNode("input", {
							"onUpdate:modelValue": ($event) => unref(form).nama = $event,
							type: "text",
							placeholder: "Contoh: Air, Sampah",
							class: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500",
							required: ""
						}, null, 8, ["onUpdate:modelValue"]), [[vModelText, unref(form).nama]])]),
						createVNode("div", null, [createVNode("label", { class: "block text-sm font-medium mb-1" }, "Tipe"), withDirectives(createVNode("select", {
							"onUpdate:modelValue": ($event) => unref(form).tipe = $event,
							class: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
						}, [createVNode("option", { value: "flat" }, "Flat (tetap)"), createVNode("option", { value: "meteran" }, "Meteran (berdasarkan pemakaian)")], 8, ["onUpdate:modelValue"]), [[vModelSelect, unref(form).tipe]])]),
						unref(form).tipe === "flat" ? (openBlock(), createBlock("div", { key: 0 }, [createVNode("label", { class: "block text-sm font-medium mb-1" }, "Tarif Flat (Rp)"), withDirectives(createVNode("input", {
							"onUpdate:modelValue": ($event) => unref(form).tarif_flat = $event,
							type: "number",
							placeholder: "25000",
							class: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
						}, null, 8, ["onUpdate:modelValue"]), [[
							vModelText,
							unref(form).tarif_flat,
							void 0,
							{ number: true }
						]])])) : createCommentVNode("", true),
						unref(form).tipe === "meteran" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
							createVNode("div", null, [createVNode("label", { class: "block text-sm font-medium mb-1" }, "Minimum Kuota (m³)"), withDirectives(createVNode("input", {
								"onUpdate:modelValue": ($event) => unref(form).minimum_kuota = $event,
								type: "number",
								placeholder: "10",
								class: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
							}, null, 8, ["onUpdate:modelValue"]), [[
								vModelText,
								unref(form).minimum_kuota,
								void 0,
								{ number: true }
							]])]),
							createVNode("div", null, [createVNode("label", { class: "block text-sm font-medium mb-1" }, "Minimum Tarif (Rp)"), withDirectives(createVNode("input", {
								"onUpdate:modelValue": ($event) => unref(form).minimum_tarif = $event,
								type: "number",
								placeholder: "25000",
								class: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
							}, null, 8, ["onUpdate:modelValue"]), [[
								vModelText,
								unref(form).minimum_tarif,
								void 0,
								{ number: true }
							]])]),
							createVNode("div", null, [createVNode("label", { class: "block text-sm font-medium mb-1" }, "Tarif per m³ (Rp)"), withDirectives(createVNode("input", {
								"onUpdate:modelValue": ($event) => unref(form).tarif_per_m3 = $event,
								type: "number",
								placeholder: "3000",
								class: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
							}, null, 8, ["onUpdate:modelValue"]), [[
								vModelText,
								unref(form).tarif_per_m3,
								void 0,
								{ number: true }
							]])])
						], 64)) : createCommentVNode("", true),
						createVNode("div", null, [createVNode("label", { class: "block text-sm font-medium mb-1" }, "Status"), withDirectives(createVNode("select", {
							"onUpdate:modelValue": ($event) => unref(form).status = $event,
							class: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
						}, [createVNode("option", { value: "aktif" }, "Aktif"), createVNode("option", { value: "nonaktif" }, "Nonaktif")], 8, ["onUpdate:modelValue"]), [[vModelSelect, unref(form).status]])])
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/kategori.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=kategori-C_79y3oH.mjs.map
