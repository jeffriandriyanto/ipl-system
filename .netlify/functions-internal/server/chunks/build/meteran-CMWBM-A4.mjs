import { _ as _sfc_main$2, $ as $fetch$2 } from '../virtual/entry.mjs';
import { _ as _sfc_main$3 } from './Modal-BK5i0WLm.mjs';
import { u as useTenant } from './useTenant-B7s_AqNz.mjs';
import { _ as _sfc_main$1, a as _sfc_main$4 } from './UploadExcel-D_h9l6i4.mjs';
import { ref, computed, unref, isRef, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
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

//#region app/pages/admin/meteran.vue
var _sfc_main = {
	__name: "meteran",
	__ssrInlineRender: true,
	setup(__props) {
		const { tenantId } = useTenant();
		const selectedPeriode = ref((/* @__PURE__ */ new Date()).toISOString().slice(0, 7));
		const meteranData = ref([]);
		const loading = ref(false);
		const saving = ref(null);
		const showUpload = ref(false);
		const uploadFile = ref(null);
		const uploading = ref(false);
		const templateData = computed(() => {
			return meteranData.value.map((item, index) => {
				const meterAir = item.meteran.find((m) => m.tipe === "meteran") || item.meteran[0];
				return {
					no: index + 1,
					blok: item.blok,
					nomor: item.nomor,
					status_penghuni: item.status_penghuni || "ada",
					pic: item.pic_nama || "",
					meter_lalu: meterAir?.meter_lalu || 0,
					meter_sekarang: "",
					keterangan: ""
				};
			});
		});
		function hitungPakai(meter) {
			if (!meter.meter_sekarang || !meter.meter_lalu) return 0;
			return Math.max(0, meter.meter_sekarang - meter.meter_lalu);
		}
		async function fetchMeteran() {
			loading.value = true;
			try {
				const data = await $fetch$2(`/api/meteran?tenant_id=${tenantId}&periode=${selectedPeriode.value}`);
				meteranData.value = data.data || [];
			} catch (error) {
				console.error("Error fetching meteran:", error);
				alert("Gagal mengambil data meteran");
			} finally {
				loading.value = false;
			}
		}
		async function simpanMeteran(item) {
			saving.value = item.rumah_id;
			try {
				const items = item.meteran.map((m) => ({
					kategori_id: m.kategori_id,
					meter_lalu: m.meter_lalu,
					meter_sekarang: m.meter_sekarang || 0
				}));
				await $fetch$2("/api/meteran", {
					method: "POST",
					body: {
						tenant_id: tenantId,
						periode: selectedPeriode.value,
						rumah_id: item.rumah_id,
						status_penghuni: item.status_penghuni,
						items
					}
				});
				alert("Meteran berhasil disimpan");
			} catch (error) {
				alert(error.data?.message || "Gagal menyimpan meteran");
			} finally {
				saving.value = null;
			}
		}
		async function handleUpload() {
			alert("Fitur upload Excel belum diimplementasikan");
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_DownloadTemplate = _sfc_main$1;
			const _component_UButton = _sfc_main$2;
			const _component_UModal = _sfc_main$3;
			const _component_UploadExcel = _sfc_main$4;
			_push(`<div${ssrRenderAttrs(_attrs)}><div class="flex justify-between items-center mb-6"><h1 class="text-2xl font-bold">Input Meteran</h1><div class="flex gap-2">`);
			_push(ssrRenderComponent(_component_DownloadTemplate, {
				type: "meteran",
				data: unref(templateData),
				filename: `meteran-${unref(selectedPeriode)}`,
				periode: unref(selectedPeriode),
				label: "Download Data Meteran"
			}, null, _parent));
			_push(ssrRenderComponent(_component_UButton, {
				label: "Upload Excel",
				icon: "i-lucide-upload",
				variant: "outline",
				onClick: ($event) => showUpload.value = true
			}, null, _parent));
			_push(`</div></div><div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6"><div class="flex flex-wrap gap-4 items-end"><div><label class="text-sm font-medium mb-1 block">Periode</label><input${ssrRenderAttr("value", unref(selectedPeriode))} type="month" class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"></div>`);
			_push(ssrRenderComponent(_component_UButton, {
				label: "Load Data",
				icon: "i-lucide-refresh-cw",
				loading: unref(loading),
				onClick: fetchMeteran
			}, null, _parent));
			_push(`</div></div>`);
			if (unref(meteranData).length > 0) {
				_push(`<div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"><div class="overflow-x-auto"><table class="w-full"><thead><tr class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700"><th class="text-left p-3 font-semibold text-sm">Blok-No</th><th class="text-left p-3 font-semibold text-sm">PIC</th><th class="text-left p-3 font-semibold text-sm">Status</th><th class="text-left p-3 font-semibold text-sm">Kategori</th><th class="text-left p-3 font-semibold text-sm">Meter Lalu</th><th class="text-left p-3 font-semibold text-sm">Meter Skrg</th><th class="text-left p-3 font-semibold text-sm">Pakai</th><th class="text-left p-3 font-semibold text-sm">Aksi</th></tr></thead><tbody><!--[-->`);
				ssrRenderList(unref(meteranData), (item) => {
					_push(`<!--[--><!--[-->`);
					ssrRenderList(item.meteran, (meter, idx) => {
						_push(`<tr class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">`);
						if (idx === 0) _push(`<td${ssrRenderAttr("rowspan", item.meteran.length)} class="p-3 font-medium">${ssrInterpolate(item.blok)}-${ssrInterpolate(item.nomor)}</td>`);
						else _push(`<!---->`);
						if (idx === 0) _push(`<td${ssrRenderAttr("rowspan", item.meteran.length)} class="p-3 text-sm">${ssrInterpolate(item.pic_nama || "-")}</td>`);
						else _push(`<!---->`);
						if (idx === 0) _push(`<td${ssrRenderAttr("rowspan", item.meteran.length)} class="p-3"><select class="text-sm px-2 py-1 border rounded"><option value="ada"${ssrIncludeBooleanAttr(Array.isArray(item.status_penghuni) ? ssrLooseContain(item.status_penghuni, "ada") : ssrLooseEqual(item.status_penghuni, "ada")) ? " selected" : ""}>Ada</option><option value="kosong"${ssrIncludeBooleanAttr(Array.isArray(item.status_penghuni) ? ssrLooseContain(item.status_penghuni, "kosong") : ssrLooseEqual(item.status_penghuni, "kosong")) ? " selected" : ""}>Kosong</option></select></td>`);
						else _push(`<!---->`);
						_push(`<td class="p-3 text-sm">${ssrInterpolate(meter.kategori_nama)}</td><td class="p-3 text-sm">${ssrInterpolate(meter.meter_lalu)}</td><td class="p-3"><input${ssrRenderAttr("value", meter.meter_sekarang)} type="number"${ssrRenderAttr("min", meter.meter_lalu)} class="w-24 px-2 py-1 border rounded text-sm"${ssrIncludeBooleanAttr(item.status_penghuni === "kosong") ? " disabled" : ""}></td><td class="p-3 text-sm font-medium">${ssrInterpolate(hitungPakai(meter))}</td>`);
						if (idx === 0) {
							_push(`<td${ssrRenderAttr("rowspan", item.meteran.length)} class="p-3">`);
							_push(ssrRenderComponent(_component_UButton, {
								label: "Simpan",
								size: "sm",
								loading: unref(saving) === item.rumah_id,
								onClick: ($event) => simpanMeteran(item)
							}, null, _parent));
							_push(`</td>`);
						} else _push(`<!---->`);
						_push(`</tr>`);
					});
					_push(`<!--]--><!--]-->`);
				});
				_push(`<!--]--></tbody></table></div></div>`);
			} else if (!unref(loading)) _push(`<div class="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center text-gray-500"> Pilih periode dan klik &quot;Load Data&quot; untuk menampilkan data meteran </div>`);
			else _push(`<!---->`);
			_push(ssrRenderComponent(_component_UModal, {
				modelValue: unref(showUpload),
				"onUpdate:modelValue": ($event) => isRef(showUpload) ? showUpload.value = $event : null
			}, {
				body: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="p-6"${_scopeId}><h2 class="text-xl font-bold mb-4"${_scopeId}>Upload Excel Meteran</h2>`);
						_push(ssrRenderComponent(_component_UploadExcel, {
							modelValue: unref(uploadFile),
							"onUpdate:modelValue": ($event) => isRef(uploadFile) ? uploadFile.value = $event : null
						}, null, _parent, _scopeId));
						_push(`<div class="flex justify-end gap-2 mt-4"${_scopeId}>`);
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
						_push(`</div></div>`);
					} else return [createVNode("div", { class: "p-6" }, [
						createVNode("h2", { class: "text-xl font-bold mb-4" }, "Upload Excel Meteran"),
						createVNode(_component_UploadExcel, {
							modelValue: unref(uploadFile),
							"onUpdate:modelValue": ($event) => isRef(uploadFile) ? uploadFile.value = $event : null
						}, null, 8, ["modelValue", "onUpdate:modelValue"]),
						createVNode("div", { class: "flex justify-end gap-2 mt-4" }, [createVNode(_component_UButton, {
							label: "Batal",
							variant: "ghost",
							onClick: ($event) => showUpload.value = false
						}, null, 8, ["onClick"]), createVNode(_component_UButton, {
							label: "Upload",
							loading: unref(uploading),
							onClick: handleUpload
						}, null, 8, ["loading"])])
					])];
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/meteran.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=meteran-CMWBM-A4.mjs.map
