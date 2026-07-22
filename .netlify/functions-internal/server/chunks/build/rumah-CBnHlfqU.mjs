import { _ as _sfc_main$2, $ as $fetch$2 } from '../virtual/entry.mjs';
import { _ as _sfc_main$3 } from './Modal-BK5i0WLm.mjs';
import { u as useTenant } from './useTenant-B7s_AqNz.mjs';
import { _ as _sfc_main$1, a as _sfc_main$4 } from './UploadExcel-D_h9l6i4.mjs';
import { ref, reactive, computed, unref, isRef, withCtx, createVNode, openBlock, createBlock, toDisplayString, Fragment, renderList, createCommentVNode, withModifiers, withDirectives, vModelText, vModelSelect, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
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
import './useExcel-BaqBrefF.mjs';
import '/Users/exiglosi/Documents/Jeffri/ipl-system/node_modules/xlsx/dist/cpexcel.js';
import 'fs';
import 'stream';

//#region app/pages/admin/rumah.vue
var _sfc_main = {
	__name: "rumah",
	__ssrInlineRender: true,
	setup(__props) {
		const { tenantId } = useTenant();
		const rumah = ref([]);
		const kategoriList = ref([]);
		const showForm = ref(false);
		const editingRumah = ref(null);
		const saving = ref(false);
		const filterBlok = ref("");
		const filterStatus = ref("");
		const showUpload = ref(false);
		const uploadFile = ref(null);
		const uploadData = ref([]);
		const importing = ref(false);
		const importResult = ref(null);
		const form = reactive({
			blok: "",
			nomor: "",
			tipe: "pribadi",
			alamat: "",
			pic_nama: "",
			pic_telepon: "",
			pic_email: "",
			pemilik_nama: "",
			pemilik_telepon: "",
			kategori_iuran: [],
			status: "aktif",
			keterangan: ""
		});
		const blokOptions = computed(() => {
			return [...new Set(rumah.value.map((r) => r.blok))].sort();
		});
		const filteredRumah = computed(() => {
			let result = rumah.value;
			if (filterBlok.value) result = result.filter((r) => r.blok === filterBlok.value);
			if (filterStatus.value) result = result.filter((r) => r.status === filterStatus.value);
			return result;
		});
		async function fetchRumah() {
			try {
				const data = await $fetch$2(`/api/rumah?tenant_id=${tenantId}`);
				rumah.value = data;
			} catch (error) {
				console.error("Error fetching rumah:", error);
			}
		}
		function toggleKategori(katId) {
			const index = form.kategori_iuran.indexOf(katId);
			if (index === -1) form.kategori_iuran.push(katId);
			else form.kategori_iuran.splice(index, 1);
		}
		function openForm(item = null) {
			editingRumah.value = item;
			if (item) {
				form.blok = item.blok;
				form.nomor = item.nomor;
				form.tipe = item.tipe;
				form.alamat = item.alamat || "";
				form.pic_nama = item.pic_nama || "";
				form.pic_telepon = item.pic_telepon || "";
				form.pic_email = item.pic_email || "";
				form.pemilik_nama = item.pemilik_nama || "";
				form.pemilik_telepon = item.pemilik_telepon || "";
				form.kategori_iuran = item.kategori_iuran || [];
				form.status = item.status;
				form.keterangan = item.keterangan || "";
			} else {
				form.blok = "";
				form.nomor = "";
				form.tipe = "pribadi";
				form.alamat = "";
				form.pic_nama = "";
				form.pic_telepon = "";
				form.pic_email = "";
				form.pemilik_nama = "";
				form.pemilik_telepon = "";
				form.kategori_iuran = [];
				form.status = "aktif";
				form.keterangan = "";
			}
			showForm.value = true;
		}
		function closeForm() {
			showForm.value = false;
			editingRumah.value = null;
		}
		async function deleteRumah(item) {
			if (!confirm(`Hapus rumah ${item.blok}-${item.nomor}?`)) return;
			try {
				await $fetch$2(`/api/rumah/${item.id}`, { method: "DELETE" });
				await fetchRumah();
			} catch (error) {
				alert(error.data?.message || "Gagal menghapus rumah");
			}
		}
		async function handleSubmit() {
			saving.value = true;
			try {
				if (editingRumah.value) await $fetch$2(`/api/rumah/${editingRumah.value.id}`, {
					method: "PUT",
					body: form
				});
				else await $fetch$2("/api/rumah", {
					method: "POST",
					body: {
						...form,
						tenant_id: tenantId
					}
				});
				closeForm();
				await fetchRumah();
			} catch (error) {
				alert(error.data?.message || "Gagal menyimpan rumah");
			} finally {
				saving.value = false;
			}
		}
		function onFileParsed(data) {
			uploadData.value = data;
		}
		async function handleImport() {
			if (!uploadData.value.length) return;
			importing.value = true;
			try {
				const result = await $fetch$2("/api/rumah/batch", {
					method: "POST",
					body: {
						tenant_id: tenantId,
						data: uploadData.value
					}
				});
				importResult.value = result;
				await fetchRumah();
			} catch (error) {
				alert(error.data?.message || "Gagal import data");
			} finally {
				importing.value = false;
			}
		}
		function closeUpload() {
			showUpload.value = false;
			uploadFile.value = null;
			uploadData.value = [];
			importResult.value = null;
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_DownloadTemplate = _sfc_main$1;
			const _component_UButton = _sfc_main$2;
			const _component_UModal = _sfc_main$3;
			const _component_UploadExcel = _sfc_main$4;
			_push(`<div${ssrRenderAttrs(_attrs)}><div class="flex justify-between items-center mb-6"><h1 class="text-2xl font-bold">Data Rumah</h1><div class="flex gap-2">`);
			_push(ssrRenderComponent(_component_DownloadTemplate, { type: "rumah" }, null, _parent));
			_push(ssrRenderComponent(_component_UButton, {
				label: "Upload Excel",
				icon: "i-lucide-upload",
				variant: "outline",
				onClick: ($event) => showUpload.value = true
			}, null, _parent));
			_push(ssrRenderComponent(_component_UButton, {
				label: "Tambah Rumah",
				icon: "i-lucide-plus",
				onClick: ($event) => openForm()
			}, null, _parent));
			_push(`</div></div><div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6"><div class="flex flex-wrap gap-4"><div><label class="text-sm font-medium mb-1 block">Blok</label><select class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filterBlok)) ? ssrLooseContain(unref(filterBlok), "") : ssrLooseEqual(unref(filterBlok), "")) ? " selected" : ""}>Semua Blok</option><!--[-->`);
			ssrRenderList(unref(blokOptions), (b) => {
				_push(`<option${ssrRenderAttr("value", b)}${ssrIncludeBooleanAttr(Array.isArray(unref(filterBlok)) ? ssrLooseContain(unref(filterBlok), b) : ssrLooseEqual(unref(filterBlok), b)) ? " selected" : ""}>${ssrInterpolate(b)}</option>`);
			});
			_push(`<!--]--></select></div><div><label class="text-sm font-medium mb-1 block">Status</label><select class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filterStatus)) ? ssrLooseContain(unref(filterStatus), "") : ssrLooseEqual(unref(filterStatus), "")) ? " selected" : ""}>Semua</option><option value="aktif"${ssrIncludeBooleanAttr(Array.isArray(unref(filterStatus)) ? ssrLooseContain(unref(filterStatus), "aktif") : ssrLooseEqual(unref(filterStatus), "aktif")) ? " selected" : ""}>Aktif</option><option value="nonaktif"${ssrIncludeBooleanAttr(Array.isArray(unref(filterStatus)) ? ssrLooseContain(unref(filterStatus), "nonaktif") : ssrLooseEqual(unref(filterStatus), "nonaktif")) ? " selected" : ""}>Nonaktif</option></select></div></div></div><div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"><div class="overflow-x-auto"><table class="w-full"><thead><tr class="border-b border-gray-200 dark:border-gray-700"><th class="text-left p-4 font-semibold">Blok-Nomor</th><th class="text-left p-4 font-semibold">Tipe</th><th class="text-left p-4 font-semibold">PIC</th><th class="text-left p-4 font-semibold">Telepon</th><th class="text-left p-4 font-semibold">Status</th><th class="text-left p-4 font-semibold">Aksi</th></tr></thead><tbody><!--[-->`);
			ssrRenderList(unref(filteredRumah), (item) => {
				_push(`<tr class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"><td class="p-4 font-medium">${ssrInterpolate(item.blok)}-${ssrInterpolate(item.nomor)}</td><td class="p-4"><span class="${ssrRenderClass([{
					"bg-blue-100 text-blue-800": item.tipe === "pribadi",
					"bg-purple-100 text-purple-800": item.tipe === "kontrakan",
					"bg-gray-100 text-gray-800": item.tipe === "fasum"
				}, "px-2 py-1 rounded-full text-xs font-medium"])}">${ssrInterpolate(item.tipe)}</span></td><td class="p-4">${ssrInterpolate(item.pic_nama || "-")}</td><td class="p-4">${ssrInterpolate(item.pic_telepon || "-")}</td><td class="p-4"><span class="${ssrRenderClass([item.status === "aktif" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800", "px-2 py-1 rounded-full text-xs font-medium"])}">${ssrInterpolate(item.status === "aktif" ? "Aktif" : "Nonaktif")}</span></td><td class="p-4"><div class="flex gap-2">`);
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
					onClick: ($event) => deleteRumah(item)
				}, null, _parent));
				_push(`</div></td></tr>`);
			});
			_push(`<!--]--></tbody></table></div>`);
			if (unref(filteredRumah).length === 0) _push(`<div class="p-8 text-center text-gray-500"> Tidak ada data rumah </div>`);
			else _push(`<!---->`);
			_push(`</div>`);
			_push(ssrRenderComponent(_component_UModal, {
				open: unref(showUpload),
				"onUpdate:open": ($event) => isRef(showUpload) ? showUpload.value = $event : null,
				title: "Import Data Rumah",
				ui: { content: "max-w-xl" }
			}, {
				body: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="space-y-4"${_scopeId}><div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-sm text-blue-700 dark:text-blue-300"${_scopeId}><p class="font-medium mb-1"${_scopeId}>Format Excel:</p><p${_scopeId}>BLOK, NO RUMAH, TIPE (pribadi/kontrakan/fasum), STATUS, PIC, TELEPON, KATEGORI IURAN (pisahkan koma), KETERANGAN</p></div>`);
						_push(ssrRenderComponent(_component_UploadExcel, {
							modelValue: unref(uploadFile),
							"onUpdate:modelValue": ($event) => isRef(uploadFile) ? uploadFile.value = $event : null,
							onParsed: onFileParsed
						}, null, _parent, _scopeId));
						if (unref(importResult)) {
							_push(`<div class="${ssrRenderClass([unref(importResult).failed > 0 ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300" : "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300", "rounded-lg p-3 text-sm"])}"${_scopeId}><p class="font-medium"${_scopeId}>Hasil Import:</p><p${_scopeId}>Berhasil: ${ssrInterpolate(unref(importResult).success)} | Gagal: ${ssrInterpolate(unref(importResult).failed)}</p>`);
							if (unref(importResult).errors.length) {
								_push(`<ul class="mt-1 list-disc list-inside text-xs"${_scopeId}><!--[-->`);
								ssrRenderList(unref(importResult).errors.slice(0, 5), (err, i) => {
									_push(`<li${_scopeId}>${ssrInterpolate(err)}</li>`);
								});
								_push(`<!--]-->`);
								if (unref(importResult).errors.length > 5) _push(`<li${_scopeId}>...dan ${ssrInterpolate(unref(importResult).errors.length - 5)} error lainnya</li>`);
								else _push(`<!---->`);
								_push(`</ul>`);
							} else _push(`<!---->`);
							_push(`</div>`);
						} else _push(`<!---->`);
						_push(`</div>`);
					} else return [createVNode("div", { class: "space-y-4" }, [
						createVNode("div", { class: "bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-sm text-blue-700 dark:text-blue-300" }, [createVNode("p", { class: "font-medium mb-1" }, "Format Excel:"), createVNode("p", null, "BLOK, NO RUMAH, TIPE (pribadi/kontrakan/fasum), STATUS, PIC, TELEPON, KATEGORI IURAN (pisahkan koma), KETERANGAN")]),
						createVNode(_component_UploadExcel, {
							modelValue: unref(uploadFile),
							"onUpdate:modelValue": ($event) => isRef(uploadFile) ? uploadFile.value = $event : null,
							onParsed: onFileParsed
						}, null, 8, ["modelValue", "onUpdate:modelValue"]),
						unref(importResult) ? (openBlock(), createBlock("div", {
							key: 0,
							class: ["rounded-lg p-3 text-sm", unref(importResult).failed > 0 ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300" : "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"]
						}, [
							createVNode("p", { class: "font-medium" }, "Hasil Import:"),
							createVNode("p", null, "Berhasil: " + toDisplayString(unref(importResult).success) + " | Gagal: " + toDisplayString(unref(importResult).failed), 1),
							unref(importResult).errors.length ? (openBlock(), createBlock("ul", {
								key: 0,
								class: "mt-1 list-disc list-inside text-xs"
							}, [(openBlock(true), createBlock(Fragment, null, renderList(unref(importResult).errors.slice(0, 5), (err, i) => {
								return openBlock(), createBlock("li", { key: i }, toDisplayString(err), 1);
							}), 128)), unref(importResult).errors.length > 5 ? (openBlock(), createBlock("li", { key: 0 }, "...dan " + toDisplayString(unref(importResult).errors.length - 5) + " error lainnya", 1)) : createCommentVNode("", true)])) : createCommentVNode("", true)
						], 2)) : createCommentVNode("", true)
					])];
				}),
				footer: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="flex justify-end gap-2"${_scopeId}>`);
						_push(ssrRenderComponent(_component_UButton, {
							label: "Batal",
							variant: "ghost",
							onClick: closeUpload
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_component_UButton, {
							label: "Import",
							icon: "i-lucide-upload",
							loading: unref(importing),
							disabled: !unref(uploadData).length,
							onClick: handleImport
						}, null, _parent, _scopeId));
						_push(`</div>`);
					} else return [createVNode("div", { class: "flex justify-end gap-2" }, [createVNode(_component_UButton, {
						label: "Batal",
						variant: "ghost",
						onClick: closeUpload
					}), createVNode(_component_UButton, {
						label: "Import",
						icon: "i-lucide-upload",
						loading: unref(importing),
						disabled: !unref(uploadData).length,
						onClick: handleImport
					}, null, 8, ["loading", "disabled"])])];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_UModal, {
				open: unref(showForm),
				"onUpdate:open": ($event) => isRef(showForm) ? showForm.value = $event : null,
				title: unref(editingRumah) ? "Edit Rumah" : "Tambah Rumah",
				ui: { content: "max-w-2xl" }
			}, {
				body: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<form class="space-y-4"${_scopeId}><div class="grid grid-cols-2 gap-4"${_scopeId}><div${_scopeId}><label class="block text-sm font-medium mb-1"${_scopeId}>Blok</label><input${ssrRenderAttr("value", unref(form).blok)} type="text" placeholder="A" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" required${_scopeId}></div><div${_scopeId}><label class="block text-sm font-medium mb-1"${_scopeId}>Nomor</label><input${ssrRenderAttr("value", unref(form).nomor)} type="text" placeholder="1" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" required${_scopeId}></div></div><div${_scopeId}><label class="block text-sm font-medium mb-1"${_scopeId}>Tipe</label><select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"${_scopeId}><option value="pribadi"${ssrIncludeBooleanAttr(Array.isArray(unref(form).tipe) ? ssrLooseContain(unref(form).tipe, "pribadi") : ssrLooseEqual(unref(form).tipe, "pribadi")) ? " selected" : ""}${_scopeId}>Pribadi</option><option value="kontrakan"${ssrIncludeBooleanAttr(Array.isArray(unref(form).tipe) ? ssrLooseContain(unref(form).tipe, "kontrakan") : ssrLooseEqual(unref(form).tipe, "kontrakan")) ? " selected" : ""}${_scopeId}>Kontrakan</option><option value="fasum"${ssrIncludeBooleanAttr(Array.isArray(unref(form).tipe) ? ssrLooseContain(unref(form).tipe, "fasum") : ssrLooseEqual(unref(form).tipe, "fasum")) ? " selected" : ""}${_scopeId}>Fasum</option></select></div><div${_scopeId}><label class="block text-sm font-medium mb-1"${_scopeId}>Alamat</label><input${ssrRenderAttr("value", unref(form).alamat)} type="text" placeholder="Alamat lengkap (opsional)" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"${_scopeId}></div><div class="grid grid-cols-2 gap-4"${_scopeId}><div${_scopeId}><label class="block text-sm font-medium mb-1"${_scopeId}>PIC (Penanggung Jawab)</label><input${ssrRenderAttr("value", unref(form).pic_nama)} type="text" placeholder="Nama PIC" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"${_scopeId}></div><div${_scopeId}><label class="block text-sm font-medium mb-1"${_scopeId}>Telepon PIC</label><input${ssrRenderAttr("value", unref(form).pic_telepon)} type="text" placeholder="0812xxxx" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"${_scopeId}></div></div><div class="grid grid-cols-2 gap-4"${_scopeId}><div${_scopeId}><label class="block text-sm font-medium mb-1"${_scopeId}>Pemilik Rumah</label><input${ssrRenderAttr("value", unref(form).pemilik_nama)} type="text" placeholder="Nama pemilik (opsional)" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"${_scopeId}></div><div${_scopeId}><label class="block text-sm font-medium mb-1"${_scopeId}>Telepon Pemilik</label><input${ssrRenderAttr("value", unref(form).pemilik_telepon)} type="text" placeholder="0812xxxx (opsional)" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"${_scopeId}></div></div><div${_scopeId}><label class="block text-sm font-medium mb-1"${_scopeId}>Kategori Iuran</label><div class="flex flex-wrap gap-2"${_scopeId}><!--[-->`);
						ssrRenderList(unref(kategoriList), (kat) => {
							_push(`<button type="button" class="${ssrRenderClass([unref(form).kategori_iuran.includes(kat.id) ? "bg-primary-600 text-white border-primary-600" : "bg-white text-gray-700 border-gray-300 hover:border-primary-500", "px-3 py-1 rounded-full text-sm font-medium border transition-colors"])}"${_scopeId}>${ssrInterpolate(kat.nama)}</button>`);
						});
						_push(`<!--]--></div></div><div${_scopeId}><label class="block text-sm font-medium mb-1"${_scopeId}>Status</label><select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"${_scopeId}><option value="aktif"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "aktif") : ssrLooseEqual(unref(form).status, "aktif")) ? " selected" : ""}${_scopeId}>Aktif</option><option value="nonaktif"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "nonaktif") : ssrLooseEqual(unref(form).status, "nonaktif")) ? " selected" : ""}${_scopeId}>Nonaktif</option></select></div><div${_scopeId}><label class="block text-sm font-medium mb-1"${_scopeId}>Keterangan</label><textarea placeholder="Keterangan (opsional)" rows="2" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"${_scopeId}>${ssrInterpolate(unref(form).keterangan)}</textarea></div></form>`);
					} else return [createVNode("form", {
						onSubmit: withModifiers(handleSubmit, ["prevent"]),
						class: "space-y-4"
					}, [
						createVNode("div", { class: "grid grid-cols-2 gap-4" }, [createVNode("div", null, [createVNode("label", { class: "block text-sm font-medium mb-1" }, "Blok"), withDirectives(createVNode("input", {
							"onUpdate:modelValue": ($event) => unref(form).blok = $event,
							type: "text",
							placeholder: "A",
							class: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500",
							required: ""
						}, null, 8, ["onUpdate:modelValue"]), [[vModelText, unref(form).blok]])]), createVNode("div", null, [createVNode("label", { class: "block text-sm font-medium mb-1" }, "Nomor"), withDirectives(createVNode("input", {
							"onUpdate:modelValue": ($event) => unref(form).nomor = $event,
							type: "text",
							placeholder: "1",
							class: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500",
							required: ""
						}, null, 8, ["onUpdate:modelValue"]), [[vModelText, unref(form).nomor]])])]),
						createVNode("div", null, [createVNode("label", { class: "block text-sm font-medium mb-1" }, "Tipe"), withDirectives(createVNode("select", {
							"onUpdate:modelValue": ($event) => unref(form).tipe = $event,
							class: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
						}, [
							createVNode("option", { value: "pribadi" }, "Pribadi"),
							createVNode("option", { value: "kontrakan" }, "Kontrakan"),
							createVNode("option", { value: "fasum" }, "Fasum")
						], 8, ["onUpdate:modelValue"]), [[vModelSelect, unref(form).tipe]])]),
						createVNode("div", null, [createVNode("label", { class: "block text-sm font-medium mb-1" }, "Alamat"), withDirectives(createVNode("input", {
							"onUpdate:modelValue": ($event) => unref(form).alamat = $event,
							type: "text",
							placeholder: "Alamat lengkap (opsional)",
							class: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
						}, null, 8, ["onUpdate:modelValue"]), [[vModelText, unref(form).alamat]])]),
						createVNode("div", { class: "grid grid-cols-2 gap-4" }, [createVNode("div", null, [createVNode("label", { class: "block text-sm font-medium mb-1" }, "PIC (Penanggung Jawab)"), withDirectives(createVNode("input", {
							"onUpdate:modelValue": ($event) => unref(form).pic_nama = $event,
							type: "text",
							placeholder: "Nama PIC",
							class: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
						}, null, 8, ["onUpdate:modelValue"]), [[vModelText, unref(form).pic_nama]])]), createVNode("div", null, [createVNode("label", { class: "block text-sm font-medium mb-1" }, "Telepon PIC"), withDirectives(createVNode("input", {
							"onUpdate:modelValue": ($event) => unref(form).pic_telepon = $event,
							type: "text",
							placeholder: "0812xxxx",
							class: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
						}, null, 8, ["onUpdate:modelValue"]), [[vModelText, unref(form).pic_telepon]])])]),
						createVNode("div", { class: "grid grid-cols-2 gap-4" }, [createVNode("div", null, [createVNode("label", { class: "block text-sm font-medium mb-1" }, "Pemilik Rumah"), withDirectives(createVNode("input", {
							"onUpdate:modelValue": ($event) => unref(form).pemilik_nama = $event,
							type: "text",
							placeholder: "Nama pemilik (opsional)",
							class: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
						}, null, 8, ["onUpdate:modelValue"]), [[vModelText, unref(form).pemilik_nama]])]), createVNode("div", null, [createVNode("label", { class: "block text-sm font-medium mb-1" }, "Telepon Pemilik"), withDirectives(createVNode("input", {
							"onUpdate:modelValue": ($event) => unref(form).pemilik_telepon = $event,
							type: "text",
							placeholder: "0812xxxx (opsional)",
							class: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
						}, null, 8, ["onUpdate:modelValue"]), [[vModelText, unref(form).pemilik_telepon]])])]),
						createVNode("div", null, [createVNode("label", { class: "block text-sm font-medium mb-1" }, "Kategori Iuran"), createVNode("div", { class: "flex flex-wrap gap-2" }, [(openBlock(true), createBlock(Fragment, null, renderList(unref(kategoriList), (kat) => {
							return openBlock(), createBlock("button", {
								key: kat.id,
								type: "button",
								class: ["px-3 py-1 rounded-full text-sm font-medium border transition-colors", unref(form).kategori_iuran.includes(kat.id) ? "bg-primary-600 text-white border-primary-600" : "bg-white text-gray-700 border-gray-300 hover:border-primary-500"],
								onClick: ($event) => toggleKategori(kat.id)
							}, toDisplayString(kat.nama), 11, ["onClick"]);
						}), 128))])]),
						createVNode("div", null, [createVNode("label", { class: "block text-sm font-medium mb-1" }, "Status"), withDirectives(createVNode("select", {
							"onUpdate:modelValue": ($event) => unref(form).status = $event,
							class: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
						}, [createVNode("option", { value: "aktif" }, "Aktif"), createVNode("option", { value: "nonaktif" }, "Nonaktif")], 8, ["onUpdate:modelValue"]), [[vModelSelect, unref(form).status]])]),
						createVNode("div", null, [createVNode("label", { class: "block text-sm font-medium mb-1" }, "Keterangan"), withDirectives(createVNode("textarea", {
							"onUpdate:modelValue": ($event) => unref(form).keterangan = $event,
							placeholder: "Keterangan (opsional)",
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/rumah.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=rumah-CBnHlfqU.mjs.map
