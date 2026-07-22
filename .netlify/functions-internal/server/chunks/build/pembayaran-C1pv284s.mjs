import { _ as _sfc_main$2, $ as $fetch$2 } from '../virtual/entry.mjs';
import { _ as _sfc_main$3 } from './Modal-BK5i0WLm.mjs';
import { u as useTenant } from './useTenant-B7s_AqNz.mjs';
import { u as useBilling } from './useBilling-CKDam3tl.mjs';
import { _ as _sfc_main$1, a as _sfc_main$4 } from './UploadExcel-D_h9l6i4.mjs';
import { ref, reactive, computed, watch, unref, isRef, withCtx, createVNode, withModifiers, withDirectives, vModelText, vModelSelect, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
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

//#region app/pages/admin/pembayaran.vue
var _sfc_main = {
	__name: "pembayaran",
	__ssrInlineRender: true,
	setup(__props) {
		const { tenantId } = useTenant();
		const inputMode = ref("single");
		const rumahList = ref([]);
		const availablePeriodes = ref([]);
		const unpaidPeriodes = ref([]);
		const pembayaranList = ref([]);
		const selectedTagihan = ref(null);
		const saving = ref(false);
		const showUpload = ref(false);
		const uploadFile = ref(null);
		const uploading = ref(false);
		const uploadData = ref([]);
		const filterPeriode = ref("");
		const form = reactive({
			rumah_id: "",
			periode: "",
			jumlah: 0,
			tanggal: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
			metode: "transfer",
			keterangan: ""
		});
		const multiForm = reactive({
			rumah_id: "",
			jumlah: 0,
			tanggal: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
			metode: "transfer",
			keterangan: "",
			periodes: []
		});
		const showEditForm = ref(false);
		const editingId = ref(null);
		const editForm = reactive({
			rumah: "",
			periode: "",
			jumlah: 0,
			tanggal: "",
			metode: "transfer",
			keterangan: ""
		});
		const { formatRupiah, getStatusColor, getStatusText } = useBilling();
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
			return new Date(date).toLocaleDateString("id-ID", {
				day: "numeric",
				month: "long",
				year: "numeric"
			});
		}
		const allocationPreview = computed(() => {
			if (!multiForm.periodes.length || !multiForm.jumlah) return [];
			let sisa = multiForm.jumlah;
			const allocations = [];
			const sortedPeriodes = [...multiForm.periodes].sort();
			for (const periode of sortedPeriodes) {
				const tagihan = unpaidPeriodes.value.find((t) => t.periode === periode);
				if (!tagihan) continue;
				const alokasi = Math.min(sisa, tagihan.sisa);
				allocations.push({
					periode,
					alokasi
				});
				sisa -= alokasi;
			}
			return allocations;
		});
		const totalAlokasi = computed(() => {
			return allocationPreview.value.reduce((sum, a) => sum + a.alokasi, 0);
		});
		const sisaBayar = computed(() => {
			return Math.max(0, multiForm.jumlah - totalAlokasi.value);
		});
		async function fetchPembayaran() {
			try {
				const params = new URLSearchParams({ tenant_id: tenantId });
				if (filterPeriode.value) params.append("periode", filterPeriode.value);
				const data = await $fetch$2(`/api/pembayaran?${params}`);
				pembayaranList.value = data;
			} catch (error) {
				console.error("Error fetching pembayaran:", error);
			}
		}
		async function fetchTagihanInfo() {
			if (!form.rumah_id || !form.periode) {
				selectedTagihan.value = null;
				return;
			}
			try {
				const tagihan = (await $fetch$2(`/api/tagihan?tenant_id=${tenantId}&periode=${form.periode}`)).data?.find((t) => t.rumah_id === form.rumah_id);
				selectedTagihan.value = tagihan || null;
				if (tagihan) {
					const sisa = Math.max(0, tagihan.total_tagihan - tagihan.total_bayar);
					form.jumlah = sisa;
				}
			} catch (error) {
				console.error("Error fetching tagihan info:", error);
			}
		}
		function handleUploadParsed(data) {
			uploadData.value = data;
		}
		async function handleUpload() {
			if (uploadData.value.length === 0) {
				alert("Tidak ada data untuk diupload");
				return;
			}
			uploading.value = true;
			try {
				let success = 0;
				let failed = 0;
				for (const row of uploadData.value) try {
					const rumah = rumahList.value.find((r) => r.blok === row["BLOK"] && r.nomor === String(row["NO RUMAH"]));
					if (!rumah) {
						failed++;
						continue;
					}
					await $fetch$2("/api/pembayaran", {
						method: "POST",
						body: {
							tenant_id: tenantId,
							rumah_id: rumah.id,
							periode: row["PERIODE"],
							jumlah: row["BAYAR RP"],
							tanggal: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
							metode: row["METODE"] || "transfer",
							keterangan: row["KETERANGAN"] || ""
						}
					});
					success++;
				} catch {
					failed++;
				}
				alert(`Upload selesai: ${success} berhasil, ${failed} gagal`);
				showUpload.value = false;
				uploadFile.value = null;
				uploadData.value = [];
				await fetchPembayaran();
			} catch (error) {
				alert("Gagal upload pembayaran");
			} finally {
				uploading.value = false;
			}
		}
		function openEditForm(item) {
			editingId.value = item.id;
			editForm.rumah = `${item.rumah?.blok}-${item.rumah?.nomor}`;
			editForm.periode = formatPeriode(item.periode);
			editForm.jumlah = item.jumlah;
			editForm.tanggal = new Date(item.tanggal).toISOString().slice(0, 10);
			editForm.metode = item.metode;
			editForm.keterangan = item.keterangan || "";
			showEditForm.value = true;
		}
		async function handleEdit() {
			saving.value = true;
			try {
				await $fetch$2(`/api/pembayaran/${editingId.value}`, {
					method: "PUT",
					body: {
						jumlah: editForm.jumlah,
						tanggal: editForm.tanggal,
						metode: editForm.metode,
						keterangan: editForm.keterangan
					}
				});
				showEditForm.value = false;
				alert("Pembayaran berhasil diupdate");
				await fetchPembayaran();
			} catch (error) {
				alert(error.data?.message || "Gagal mengupdate pembayaran");
			} finally {
				saving.value = false;
			}
		}
		async function deletePembayaran(item) {
			if (!confirm(`Hapus pembayaran ${item.rumah?.blok}-${item.rumah?.nomor} periode ${formatPeriode(item.periode)} sebesar ${formatRupiah(item.jumlah)}?`)) return;
			try {
				await $fetch$2(`/api/pembayaran/${item.id}`, { method: "DELETE" });
				alert("Pembayaran berhasil dihapus");
				await fetchPembayaran();
			} catch (error) {
				alert(error.data?.message || "Gagal menghapus pembayaran");
			}
		}
		watch(() => [form.rumah_id, form.periode], () => {
			fetchTagihanInfo();
		});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_DownloadTemplate = _sfc_main$1;
			const _component_UButton = _sfc_main$2;
			const _component_UModal = _sfc_main$3;
			const _component_UploadExcel = _sfc_main$4;
			_push(`<div${ssrRenderAttrs(_attrs)}><div class="flex justify-between items-center mb-6"><h1 class="text-2xl font-bold">Input Pembayaran</h1><div class="flex gap-2">`);
			_push(ssrRenderComponent(_component_DownloadTemplate, { type: "pembayaran" }, null, _parent));
			_push(ssrRenderComponent(_component_UButton, {
				label: "Upload Excel",
				icon: "i-lucide-upload",
				variant: "outline",
				onClick: ($event) => showUpload.value = true
			}, null, _parent));
			_push(`</div></div><div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6"><div class="flex gap-2 mb-4"><button class="${ssrRenderClass([unref(inputMode) === "single" ? "bg-primary-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300", "px-4 py-2 rounded-lg text-sm font-medium transition-colors"])}"> Single Periode </button><button class="${ssrRenderClass([unref(inputMode) === "multi" ? "bg-primary-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300", "px-4 py-2 rounded-lg text-sm font-medium transition-colors"])}"> Multi Periode </button></div>`);
			if (unref(inputMode) === "single") {
				_push(`<form class="space-y-4"><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="text-sm font-medium mb-1 block">Rumah</label><select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" required><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).rumah_id) ? ssrLooseContain(unref(form).rumah_id, "") : ssrLooseEqual(unref(form).rumah_id, "")) ? " selected" : ""}>Pilih Rumah</option><!--[-->`);
				ssrRenderList(unref(rumahList), (r) => {
					_push(`<option${ssrRenderAttr("value", r.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).rumah_id) ? ssrLooseContain(unref(form).rumah_id, r.id) : ssrLooseEqual(unref(form).rumah_id, r.id)) ? " selected" : ""}>${ssrInterpolate(r.blok)}-${ssrInterpolate(r.nomor)} (${ssrInterpolate(r.pic_nama || "-")}) </option>`);
				});
				_push(`<!--]--></select></div><div><label class="text-sm font-medium mb-1 block">Periode</label><select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" required><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(form).periode) ? ssrLooseContain(unref(form).periode, "") : ssrLooseEqual(unref(form).periode, "")) ? " selected" : ""}>Pilih Periode</option><!--[-->`);
				ssrRenderList(unref(availablePeriodes), (p) => {
					_push(`<option${ssrRenderAttr("value", p.periode)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).periode) ? ssrLooseContain(unref(form).periode, p.periode) : ssrLooseEqual(unref(form).periode, p.periode)) ? " selected" : ""}>${ssrInterpolate(formatPeriode(p.periode))}</option>`);
				});
				_push(`<!--]--></select></div><div><label class="text-sm font-medium mb-1 block">Jumlah Bayar (Rp)</label><input${ssrRenderAttr("value", unref(form).jumlah)} type="number" placeholder="0" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" required></div><div><label class="text-sm font-medium mb-1 block">Tanggal Bayar</label><input${ssrRenderAttr("value", unref(form).tanggal)} type="date" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" required></div><div><label class="text-sm font-medium mb-1 block">Metode</label><select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"><option value="transfer"${ssrIncludeBooleanAttr(Array.isArray(unref(form).metode) ? ssrLooseContain(unref(form).metode, "transfer") : ssrLooseEqual(unref(form).metode, "transfer")) ? " selected" : ""}>Transfer</option><option value="cash"${ssrIncludeBooleanAttr(Array.isArray(unref(form).metode) ? ssrLooseContain(unref(form).metode, "cash") : ssrLooseEqual(unref(form).metode, "cash")) ? " selected" : ""}>Cash</option></select></div><div><label class="text-sm font-medium mb-1 block">Keterangan</label><input${ssrRenderAttr("value", unref(form).keterangan)} type="text" placeholder="Opsional" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"></div></div>`);
				if (unref(selectedTagihan)) _push(`<div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"><div class="grid grid-cols-2 md:grid-cols-4 gap-4"><div><p class="text-sm text-gray-500">Total Tagihan</p><p class="text-lg font-bold">${ssrInterpolate(unref(formatRupiah)(unref(selectedTagihan).total_tagihan))}</p></div><div><p class="text-sm text-gray-500">Sudah Bayar</p><p class="text-lg font-bold">${ssrInterpolate(unref(formatRupiah)(unref(selectedTagihan).total_bayar))}</p></div><div><p class="text-sm text-gray-500">Sisa Tagihan</p><p class="text-lg font-bold text-red-600">${ssrInterpolate(unref(formatRupiah)(Math.max(0, unref(selectedTagihan).total_tagihan - unref(selectedTagihan).total_bayar)))}</p></div><div><p class="text-sm text-gray-500">Status</p><span class="${ssrRenderClass([unref(getStatusColor)(unref(selectedTagihan).status), "px-2 py-1 rounded-full text-xs font-medium"])}">${ssrInterpolate(unref(getStatusText)(unref(selectedTagihan).status))}</span></div></div></div>`);
				else _push(`<!---->`);
				_push(`<div class="flex justify-end">`);
				_push(ssrRenderComponent(_component_UButton, {
					type: "submit",
					label: "Simpan Pembayaran",
					icon: "i-lucide-check",
					loading: unref(saving),
					disabled: !unref(form).rumah_id || !unref(form).periode || !unref(form).jumlah
				}, null, _parent));
				_push(`</div></form>`);
			} else _push(`<!---->`);
			if (unref(inputMode) === "multi") {
				_push(`<form class="space-y-4"><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="text-sm font-medium mb-1 block">Rumah</label><select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" required><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(multiForm).rumah_id) ? ssrLooseContain(unref(multiForm).rumah_id, "") : ssrLooseEqual(unref(multiForm).rumah_id, "")) ? " selected" : ""}>Pilih Rumah</option><!--[-->`);
				ssrRenderList(unref(rumahList), (r) => {
					_push(`<option${ssrRenderAttr("value", r.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(multiForm).rumah_id) ? ssrLooseContain(unref(multiForm).rumah_id, r.id) : ssrLooseEqual(unref(multiForm).rumah_id, r.id)) ? " selected" : ""}>${ssrInterpolate(r.blok)}-${ssrInterpolate(r.nomor)} (${ssrInterpolate(r.pic_nama || "-")}) </option>`);
				});
				_push(`<!--]--></select></div><div><label class="text-sm font-medium mb-1 block">Total Bayar (Rp)</label><input${ssrRenderAttr("value", unref(multiForm).jumlah)} type="number" placeholder="0" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" required></div><div><label class="text-sm font-medium mb-1 block">Tanggal Bayar</label><input${ssrRenderAttr("value", unref(multiForm).tanggal)} type="date" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" required></div><div><label class="text-sm font-medium mb-1 block">Metode</label><select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"><option value="transfer"${ssrIncludeBooleanAttr(Array.isArray(unref(multiForm).metode) ? ssrLooseContain(unref(multiForm).metode, "transfer") : ssrLooseEqual(unref(multiForm).metode, "transfer")) ? " selected" : ""}>Transfer</option><option value="cash"${ssrIncludeBooleanAttr(Array.isArray(unref(multiForm).metode) ? ssrLooseContain(unref(multiForm).metode, "cash") : ssrLooseEqual(unref(multiForm).metode, "cash")) ? " selected" : ""}>Cash</option></select></div></div><div><label class="text-sm font-medium mb-1 block">Keterangan</label><input${ssrRenderAttr("value", unref(multiForm).keterangan)} type="text" placeholder="Opsional" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"></div>`);
				if (unref(unpaidPeriodes).length > 0) {
					_push(`<div><label class="text-sm font-medium mb-2 block">Pilih Periode yang Akan Dibayar:</label><div class="space-y-2"><!--[-->`);
					ssrRenderList(unref(unpaidPeriodes), (item) => {
						_push(`<label class="${ssrRenderClass([{ "border-primary-500 bg-primary-50 dark:bg-primary-900/20": unref(multiForm).periodes.includes(item.periode) }, "flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"])}"><input type="checkbox"${ssrRenderAttr("value", item.periode)}${ssrIncludeBooleanAttr(Array.isArray(unref(multiForm).periodes) ? ssrLooseContain(unref(multiForm).periodes, item.periode) : unref(multiForm).periodes) ? " checked" : ""} class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"><div class="flex-1"><p class="font-medium">${ssrInterpolate(formatPeriode(item.periode))}</p><p class="text-sm text-gray-500"> Tagihan: ${ssrInterpolate(unref(formatRupiah)(item.total_tagihan))} | Sudah Bayar: ${ssrInterpolate(unref(formatRupiah)(item.total_bayar))} | <span class="text-red-600 font-medium">Kurang: ${ssrInterpolate(unref(formatRupiah)(item.sisa))}</span></p></div></label>`);
					});
					_push(`<!--]--></div></div>`);
				} else _push(`<!---->`);
				if (unref(multiForm).periodes.length > 0 && unref(multiForm).jumlah > 0) {
					_push(`<div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg"><p class="font-semibold text-blue-800 dark:text-blue-200 mb-2">Alokasi Pembayaran:</p><div class="space-y-1"><!--[-->`);
					ssrRenderList(unref(allocationPreview), (alloc) => {
						_push(`<div class="flex justify-between text-sm"><span>${ssrInterpolate(formatPeriode(alloc.periode))}</span><span class="font-medium">${ssrInterpolate(unref(formatRupiah)(alloc.alokasi))}</span></div>`);
					});
					_push(`<!--]--><div class="pt-2 mt-2 border-t border-blue-200 dark:border-blue-700 flex justify-between font-semibold"><span>Total</span><span>${ssrInterpolate(unref(formatRupiah)(unref(totalAlokasi)))}</span></div>`);
					if (unref(sisaBayar) > 0) _push(`<div class="flex justify-between text-sm text-orange-600"><span>Sisa (Saldo Lebih)</span><span>${ssrInterpolate(unref(formatRupiah)(unref(sisaBayar)))}</span></div>`);
					else _push(`<!---->`);
					_push(`</div></div>`);
				} else _push(`<!---->`);
				_push(`<div class="flex justify-end">`);
				_push(ssrRenderComponent(_component_UButton, {
					type: "submit",
					label: "Simpan Pembayaran Multi-Periode",
					icon: "i-lucide-check",
					loading: unref(saving),
					disabled: unref(multiForm).periodes.length === 0 || !unref(multiForm).jumlah
				}, null, _parent));
				_push(`</div></form>`);
			} else _push(`<!---->`);
			_push(`</div><div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"><div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between"><h2 class="text-lg font-semibold">Riwayat Pembayaran</h2><select class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filterPeriode)) ? ssrLooseContain(unref(filterPeriode), "") : ssrLooseEqual(unref(filterPeriode), "")) ? " selected" : ""}>Semua Periode</option><!--[-->`);
			ssrRenderList(unref(availablePeriodes), (p) => {
				_push(`<option${ssrRenderAttr("value", p.periode)}${ssrIncludeBooleanAttr(Array.isArray(unref(filterPeriode)) ? ssrLooseContain(unref(filterPeriode), p.periode) : ssrLooseEqual(unref(filterPeriode), p.periode)) ? " selected" : ""}>${ssrInterpolate(formatPeriode(p.periode))}</option>`);
			});
			_push(`<!--]--></select></div><div class="overflow-x-auto"><table class="w-full"><thead><tr class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700"><th class="text-left p-3 font-semibold text-sm">Tanggal</th><th class="text-left p-3 font-semibold text-sm">Rumah</th><th class="text-left p-3 font-semibold text-sm">Periode</th><th class="text-right p-3 font-semibold text-sm">Jumlah</th><th class="text-left p-3 font-semibold text-sm">Metode</th><th class="text-left p-3 font-semibold text-sm">Keterangan</th><th class="text-center p-3 font-semibold text-sm">Aksi</th></tr></thead><tbody><!--[-->`);
			ssrRenderList(unref(pembayaranList), (item) => {
				_push(`<tr class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"><td class="p-3 text-sm">${ssrInterpolate(formatDate(item.tanggal))}</td><td class="p-3 font-medium">${ssrInterpolate(item.rumah?.blok)}-${ssrInterpolate(item.rumah?.nomor)}</td><td class="p-3 text-sm">${ssrInterpolate(formatPeriode(item.periode))}</td><td class="p-3 text-sm text-right font-medium">${ssrInterpolate(unref(formatRupiah)(item.jumlah))}</td><td class="p-3"><span class="${ssrRenderClass([item.metode === "transfer" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800", "px-2 py-1 rounded-full text-xs font-medium"])}">${ssrInterpolate(item.metode)}</span></td><td class="p-3 text-sm text-gray-500">${ssrInterpolate(item.keterangan || "-")}</td><td class="p-3"><div class="flex justify-center gap-1">`);
				_push(ssrRenderComponent(_component_UButton, {
					icon: "i-lucide-edit",
					variant: "ghost",
					size: "xs",
					onClick: ($event) => openEditForm(item)
				}, null, _parent));
				_push(ssrRenderComponent(_component_UButton, {
					icon: "i-lucide-trash-2",
					variant: "ghost",
					color: "red",
					size: "xs",
					onClick: ($event) => deletePembayaran(item)
				}, null, _parent));
				_push(`</div></td></tr>`);
			});
			_push(`<!--]--></tbody></table></div>`);
			if (unref(pembayaranList).length === 0) _push(`<div class="p-8 text-center text-gray-500"> Belum ada pembayaran </div>`);
			else _push(`<!---->`);
			_push(`</div>`);
			_push(ssrRenderComponent(_component_UModal, {
				open: unref(showEditForm),
				"onUpdate:open": ($event) => isRef(showEditForm) ? showEditForm.value = $event : null,
				title: "Edit Pembayaran"
			}, {
				body: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<form class="space-y-4"${_scopeId}><div${_scopeId}><label class="text-sm font-medium mb-1 block"${_scopeId}>Rumah</label><input${ssrRenderAttr("value", unref(editForm).rumah)} type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" disabled${_scopeId}></div><div${_scopeId}><label class="text-sm font-medium mb-1 block"${_scopeId}>Periode</label><input${ssrRenderAttr("value", unref(editForm).periode)} type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" disabled${_scopeId}></div><div${_scopeId}><label class="text-sm font-medium mb-1 block"${_scopeId}>Jumlah Bayar (Rp)</label><input${ssrRenderAttr("value", unref(editForm).jumlah)} type="number" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" required${_scopeId}></div><div${_scopeId}><label class="text-sm font-medium mb-1 block"${_scopeId}>Tanggal Bayar</label><input${ssrRenderAttr("value", unref(editForm).tanggal)} type="date" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" required${_scopeId}></div><div${_scopeId}><label class="text-sm font-medium mb-1 block"${_scopeId}>Metode</label><select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"${_scopeId}><option value="transfer"${ssrIncludeBooleanAttr(Array.isArray(unref(editForm).metode) ? ssrLooseContain(unref(editForm).metode, "transfer") : ssrLooseEqual(unref(editForm).metode, "transfer")) ? " selected" : ""}${_scopeId}>Transfer</option><option value="cash"${ssrIncludeBooleanAttr(Array.isArray(unref(editForm).metode) ? ssrLooseContain(unref(editForm).metode, "cash") : ssrLooseEqual(unref(editForm).metode, "cash")) ? " selected" : ""}${_scopeId}>Cash</option></select></div><div${_scopeId}><label class="text-sm font-medium mb-1 block"${_scopeId}>Keterangan</label><input${ssrRenderAttr("value", unref(editForm).keterangan)} type="text" placeholder="Opsional" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"${_scopeId}></div></form>`);
					else return [createVNode("form", {
						onSubmit: withModifiers(handleEdit, ["prevent"]),
						class: "space-y-4"
					}, [
						createVNode("div", null, [createVNode("label", { class: "text-sm font-medium mb-1 block" }, "Rumah"), createVNode("input", {
							value: unref(editForm).rumah,
							type: "text",
							class: "w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100",
							disabled: ""
						}, null, 8, ["value"])]),
						createVNode("div", null, [createVNode("label", { class: "text-sm font-medium mb-1 block" }, "Periode"), createVNode("input", {
							value: unref(editForm).periode,
							type: "text",
							class: "w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100",
							disabled: ""
						}, null, 8, ["value"])]),
						createVNode("div", null, [createVNode("label", { class: "text-sm font-medium mb-1 block" }, "Jumlah Bayar (Rp)"), withDirectives(createVNode("input", {
							"onUpdate:modelValue": ($event) => unref(editForm).jumlah = $event,
							type: "number",
							class: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500",
							required: ""
						}, null, 8, ["onUpdate:modelValue"]), [[
							vModelText,
							unref(editForm).jumlah,
							void 0,
							{ number: true }
						]])]),
						createVNode("div", null, [createVNode("label", { class: "text-sm font-medium mb-1 block" }, "Tanggal Bayar"), withDirectives(createVNode("input", {
							"onUpdate:modelValue": ($event) => unref(editForm).tanggal = $event,
							type: "date",
							class: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500",
							required: ""
						}, null, 8, ["onUpdate:modelValue"]), [[vModelText, unref(editForm).tanggal]])]),
						createVNode("div", null, [createVNode("label", { class: "text-sm font-medium mb-1 block" }, "Metode"), withDirectives(createVNode("select", {
							"onUpdate:modelValue": ($event) => unref(editForm).metode = $event,
							class: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
						}, [createVNode("option", { value: "transfer" }, "Transfer"), createVNode("option", { value: "cash" }, "Cash")], 8, ["onUpdate:modelValue"]), [[vModelSelect, unref(editForm).metode]])]),
						createVNode("div", null, [createVNode("label", { class: "text-sm font-medium mb-1 block" }, "Keterangan"), withDirectives(createVNode("input", {
							"onUpdate:modelValue": ($event) => unref(editForm).keterangan = $event,
							type: "text",
							placeholder: "Opsional",
							class: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
						}, null, 8, ["onUpdate:modelValue"]), [[vModelText, unref(editForm).keterangan]])])
					], 32)];
				}),
				footer: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="flex justify-end gap-2"${_scopeId}>`);
						_push(ssrRenderComponent(_component_UButton, {
							label: "Batal",
							variant: "ghost",
							onClick: ($event) => showEditForm.value = false
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_component_UButton, {
							label: "Simpan",
							loading: unref(saving),
							onClick: handleEdit
						}, null, _parent, _scopeId));
						_push(`</div>`);
					} else return [createVNode("div", { class: "flex justify-end gap-2" }, [createVNode(_component_UButton, {
						label: "Batal",
						variant: "ghost",
						onClick: ($event) => showEditForm.value = false
					}, null, 8, ["onClick"]), createVNode(_component_UButton, {
						label: "Simpan",
						loading: unref(saving),
						onClick: handleEdit
					}, null, 8, ["loading"])])];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_UModal, {
				open: unref(showUpload),
				"onUpdate:open": ($event) => isRef(showUpload) ? showUpload.value = $event : null,
				title: "Upload Excel Pembayaran"
			}, {
				body: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_component_UploadExcel, {
						modelValue: unref(uploadFile),
						"onUpdate:modelValue": ($event) => isRef(uploadFile) ? uploadFile.value = $event : null,
						onParsed: handleUploadParsed
					}, null, _parent, _scopeId));
					else return [createVNode(_component_UploadExcel, {
						modelValue: unref(uploadFile),
						"onUpdate:modelValue": ($event) => isRef(uploadFile) ? uploadFile.value = $event : null,
						onParsed: handleUploadParsed
					}, null, 8, ["modelValue", "onUpdate:modelValue"])];
				}),
				footer: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="flex justify-end gap-2"${_scopeId}>`);
						_push(ssrRenderComponent(_component_UButton, {
							label: "Batal",
							variant: "ghost",
							onClick: ($event) => showUpload.value = false
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(_component_UButton, {
							label: "Upload",
							loading: unref(uploading),
							onClick: handleUpload
						}, null, _parent, _scopeId));
						_push(`</div>`);
					} else return [createVNode("div", { class: "flex justify-end gap-2" }, [createVNode(_component_UButton, {
						label: "Batal",
						variant: "ghost",
						onClick: ($event) => showUpload.value = false
					}, null, 8, ["onClick"]), createVNode(_component_UButton, {
						label: "Upload",
						loading: unref(uploading),
						onClick: handleUpload
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/pembayaran.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=pembayaran-C1pv284s.mjs.map
