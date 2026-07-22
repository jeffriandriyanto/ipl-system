import { _ as _sfc_main$2, r as _sfc_main$3, $ as $fetch$2 } from '../virtual/entry.mjs';
import { u as useTenant } from './useTenant-B7s_AqNz.mjs';
import { u as useExcel } from './useExcel-BaqBrefF.mjs';
import { ref, mergeProps, unref, computed, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttrs, ssrRenderClass, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';

//#region app/components/DownloadTemplate.vue
var _sfc_main$1 = {
	__name: "DownloadTemplate",
	__ssrInlineRender: true,
	props: {
		type: {
			type: String,
			required: true,
			validator: (value) => [
				"rumah",
				"meteran",
				"pembayaran"
			].includes(value)
		},
		label: {
			type: String,
			default: "Download Template"
		},
		data: {
			type: Array,
			default: () => []
		},
		filename: {
			type: String,
			default: ""
		},
		periode: {
			type: String,
			default: ""
		}
	},
	setup(__props) {
		const props = __props;
		const { downloadTemplate } = useExcel();
		const { tenantId } = useTenant();
		const downloading = ref(false);
		async function fetchMeteranData() {
			downloading.value = true;
			try {
				const rumahList = await $fetch$2(`/api/rumah?tenant_id=${tenantId}&status=aktif`);
				let meteranMap = /* @__PURE__ */ new Map();
				if (props.periode) try {
					const tagihanData = await $fetch$2(`/api/tagihan?tenant_id=${tenantId}&periode=${props.periode}`);
					for (const t of tagihanData.data || []) for (const item of t.items || []) if (item.tipe === "meteran") meteranMap.set(t.rumah_id, {
						meter_lalu: item.meter_sekarang || 0,
						status_penghuni: t.status_penghuni
					});
				} catch {}
				return rumahList.map((r, index) => {
					const meterInfo = meteranMap.get(r.id);
					return {
						no: index + 1,
						blok: r.blok,
						nomor: r.nomor,
						status_penghuni: meterInfo?.status_penghuni || "ada",
						pic: r.pic_nama || "",
						meter_lalu: meterInfo?.meter_lalu || 0,
						meter_sekarang: "",
						keterangan: ""
					};
				});
			} catch (error) {
				console.error("Error fetching meteran data:", error);
				return [];
			} finally {
				downloading.value = false;
			}
		}
		async function handleDownload() {
			const template = {
				rumah: {
					headers: [
						{
							key: "no",
							label: "NO"
						},
						{
							key: "blok",
							label: "BLOK"
						},
						{
							key: "nomor",
							label: "NO RUMAH"
						},
						{
							key: "tipe",
							label: "TIPE"
						},
						{
							key: "status",
							label: "STATUS"
						},
						{
							key: "pic_nama",
							label: "PIC"
						},
						{
							key: "pic_telepon",
							label: "TELEPON"
						},
						{
							key: "kategori",
							label: "KATEGORI IURAN"
						},
						{
							key: "keterangan",
							label: "KETERANGAN"
						}
					],
					sample: [
						{
							no: 1,
							blok: "A",
							nomor: "1",
							tipe: "pribadi",
							status: "aktif",
							pic_nama: "Budi",
							pic_telepon: "081211111111",
							kategori: "air,sampah",
							keterangan: ""
						},
						{
							no: 2,
							blok: "A",
							nomor: "2",
							tipe: "kontrakan",
							status: "aktif",
							pic_nama: "Andi",
							pic_telepon: "081222222222",
							kategori: "air,sampah",
							keterangan: "Dikontrakkan"
						},
						{
							no: 3,
							blok: "FASUM",
							nomor: "1",
							tipe: "fasum",
							status: "aktif",
							pic_nama: "Pengurus",
							pic_telepon: "081233333333",
							kategori: "air",
							keterangan: "Masjid"
						}
					]
				},
				meteran: {
					headers: [
						{
							key: "no",
							label: "NO"
						},
						{
							key: "blok",
							label: "BLOK"
						},
						{
							key: "nomor",
							label: "NO RUMAH"
						},
						{
							key: "status_penghuni",
							label: "STATUS PENGHUNI"
						},
						{
							key: "pic",
							label: "PIC BULAN INI"
						},
						{
							key: "meter_lalu",
							label: "METER LALU"
						},
						{
							key: "meter_sekarang",
							label: "METER SKRG"
						},
						{
							key: "keterangan",
							label: "KETERANGAN"
						}
					],
					sample: [{
						no: 1,
						blok: "A",
						nomor: "1",
						status_penghuni: "ada",
						pic: "Budi",
						meter_lalu: 100,
						meter_sekarang: "",
						keterangan: ""
					}, {
						no: 2,
						blok: "A",
						nomor: "2",
						status_penghuni: "kosong",
						pic: "-",
						meter_lalu: 50,
						meter_sekarang: 50,
						keterangan: "Kontrakan kosong"
					}]
				},
				pembayaran: {
					headers: [
						{
							key: "no",
							label: "NO"
						},
						{
							key: "blok",
							label: "BLOK"
						},
						{
							key: "nomor",
							label: "NO RUMAH"
						},
						{
							key: "periode",
							label: "PERIODE"
						},
						{
							key: "jumlah",
							label: "BAYAR RP"
						},
						{
							key: "metode",
							label: "METODE"
						},
						{
							key: "keterangan",
							label: "KETERANGAN"
						}
					],
					sample: [{
						no: 1,
						blok: "A",
						nomor: "1",
						periode: "2026-07",
						jumlah: 5e4,
						metode: "transfer",
						keterangan: "Transfer BCA"
					}, {
						no: 2,
						blok: "A",
						nomor: "2",
						periode: "2026-07",
						jumlah: 65e3,
						metode: "cash",
						keterangan: ""
					}]
				}
			}[props.type];
			if (!template) return;
			let exportData = props.data;
			if (props.type === "meteran" && exportData.length === 0) exportData = await fetchMeteranData();
			if (exportData.length === 0) exportData = template.sample;
			const filename = props.filename || props.type;
			downloadTemplate(template.headers, filename, exportData);
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(_sfc_main$2, mergeProps({
				label: __props.label,
				icon: "i-lucide-download",
				variant: "outline",
				loading: unref(downloading),
				onClick: handleDownload
			}, _attrs), null, _parent));
		};
	}
};
var _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/DownloadTemplate.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
//#endregion
//#region app/components/UploadExcel.vue
var _sfc_main = {
	__name: "UploadExcel",
	__ssrInlineRender: true,
	props: { modelValue: {
		type: File,
		default: null
	} },
	emits: ["update:modelValue", "parsed"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const fileInput = ref(null);
		const isDragging = ref(false);
		const file = computed(() => props.modelValue);
		const parsedData = ref([]);
		const parsedHeaders = ref([]);
		const fileSize = computed(() => {
			if (!file.value) return "";
			const bytes = file.value.size;
			if (bytes < 1024) return bytes + " B";
			if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
			return (bytes / (1024 * 1024)).toFixed(1) + " MB";
		});
		function removeFile() {
			emit("update:modelValue", null);
			parsedData.value = [];
			parsedHeaders.value = [];
			if (fileInput.value) fileInput.value.value = "";
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UIcon = _sfc_main$3;
			const _component_UButton = _sfc_main$2;
			_push(`<div${ssrRenderAttrs(_attrs)}><div class="${ssrRenderClass([{ "border-primary-500 bg-primary-50": unref(isDragging) }, "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary-400 transition-colors"])}">`);
			_push(ssrRenderComponent(_component_UIcon, {
				name: "i-lucide-upload",
				class: "text-3xl text-gray-400 mb-2"
			}, null, _parent));
			_push(`<p class="text-sm text-gray-500"> Drag &amp; drop file Excel atau <span class="text-primary-500">klik untuk pilih</span></p><p class="text-xs text-gray-400 mt-1">.xlsx, .xls</p></div><input type="file" accept=".xlsx,.xls" class="hidden">`);
			if (unref(file)) {
				_push(`<div class="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-between"><div class="flex items-center gap-2">`);
				_push(ssrRenderComponent(_component_UIcon, {
					name: "i-lucide-file-spreadsheet",
					class: "text-green-600"
				}, null, _parent));
				_push(`<span class="text-sm">${ssrInterpolate(unref(file).name)}</span><span class="text-xs text-gray-400">(${ssrInterpolate(unref(fileSize))})</span></div>`);
				_push(ssrRenderComponent(_component_UButton, {
					icon: "i-lucide-x",
					variant: "ghost",
					size: "xs",
					onClick: removeFile
				}, null, _parent));
				_push(`</div>`);
			} else _push(`<!---->`);
			if (unref(parsedData).length > 0) {
				_push(`<div class="mt-4"><p class="text-sm font-medium mb-2">Preview (${ssrInterpolate(unref(parsedData).length)} baris):</p><div class="max-h-48 overflow-auto border rounded-lg"><table class="w-full text-sm"><thead><tr class="bg-gray-100 dark:bg-gray-700"><!--[-->`);
				ssrRenderList(unref(parsedHeaders), (header) => {
					_push(`<th class="p-2 text-left text-xs font-medium">${ssrInterpolate(header)}</th>`);
				});
				_push(`<!--]--></tr></thead><tbody><!--[-->`);
				ssrRenderList(unref(parsedData).slice(0, 5), (row, idx) => {
					_push(`<tr class="border-t"><!--[-->`);
					ssrRenderList(unref(parsedHeaders), (header) => {
						_push(`<td class="p-2 text-xs">${ssrInterpolate(row[header] || "-")}</td>`);
					});
					_push(`<!--]--></tr>`);
				});
				_push(`<!--]--></tbody></table></div>`);
				if (unref(parsedData).length > 5) _push(`<p class="text-xs text-gray-400 mt-1"> Menampilkan 5 dari ${ssrInterpolate(unref(parsedData).length)} baris </p>`);
				else _push(`<!---->`);
				_push(`</div>`);
			} else _push(`<!---->`);
			_push(`</div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UploadExcel.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main$1 as _, _sfc_main as a };
//# sourceMappingURL=UploadExcel-D_h9l6i4.mjs.map
