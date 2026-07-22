import { r as _sfc_main$1, _ as _sfc_main$2 } from '../virtual/entry.mjs';
import { u as useTenant } from './useTenant-B7s_AqNz.mjs';
import { u as useBilling } from './useBilling-CKDam3tl.mjs';
import { computed, ref, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderStyle, ssrRenderList } from 'vue/server-renderer';
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

//#region app/pages/admin/index.vue
var _sfc_main = {
	__name: "index",
	__ssrInlineRender: true,
	setup(__props) {
		useTenant();
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
		const currentPeriode = computed(() => {
			const now = /* @__PURE__ */ new Date();
			return `${months[now.getMonth()]} ${now.getFullYear()}`;
		});
		const stats = ref({
			totalRumah: 0,
			rumahAktif: 0,
			sudahBayar: 0,
			belumBayar: 0,
			totalTagihan: 0,
			totalTerkumpul: 0
		});
		const kasSummary = ref({
			total_masuk: 0,
			total_keluar: 0,
			saldo: 0
		});
		const recentPayments = ref([]);
		const persenBayar = computed(() => {
			const total = stats.value.sudahBayar + stats.value.belumBayar;
			if (total === 0) return 0;
			return Math.round(stats.value.sudahBayar / total * 100);
		});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UIcon = _sfc_main$1;
			const _component_UButton = _sfc_main$2;
			_push(`<div${ssrRenderAttrs(_attrs)}><div class="flex justify-between items-center mb-6"><h1 class="text-2xl font-bold">Dashboard</h1><div class="text-sm text-gray-500"> Periode: ${ssrInterpolate(unref(currentPeriode))}</div></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"><div class="bg-white dark:bg-gray-800 rounded-xl shadow p-5"><div class="flex items-center justify-between"><div><p class="text-sm text-gray-500">Total Rumah</p><p class="text-3xl font-bold text-gray-800">${ssrInterpolate(unref(stats).totalRumah)}</p><p class="text-xs text-gray-400 mt-1">${ssrInterpolate(unref(stats).rumahAktif)} aktif</p></div><div class="p-3 bg-blue-100 rounded-xl">`);
			_push(ssrRenderComponent(_component_UIcon, {
				name: "i-lucide-home",
				class: "text-blue-600 text-2xl"
			}, null, _parent));
			_push(`</div></div></div><div class="bg-white dark:bg-gray-800 rounded-xl shadow p-5"><div class="flex items-center justify-between"><div><p class="text-sm text-gray-500">Sudah Bayar</p><p class="text-3xl font-bold text-green-600">${ssrInterpolate(unref(stats).sudahBayar)}</p><p class="text-xs text-gray-400 mt-1">${ssrInterpolate(unref(persenBayar))}% lunas</p></div><div class="p-3 bg-green-100 rounded-xl">`);
			_push(ssrRenderComponent(_component_UIcon, {
				name: "i-lucide-check-circle",
				class: "text-green-600 text-2xl"
			}, null, _parent));
			_push(`</div></div></div><div class="bg-white dark:bg-gray-800 rounded-xl shadow p-5"><div class="flex items-center justify-between"><div><p class="text-sm text-gray-500">Belum Bayar</p><p class="text-3xl font-bold text-red-600">${ssrInterpolate(unref(stats).belumBayar)}</p><p class="text-xs text-gray-400 mt-1">perlu ditagih</p></div><div class="p-3 bg-red-100 rounded-xl">`);
			_push(ssrRenderComponent(_component_UIcon, {
				name: "i-lucide-alert-circle",
				class: "text-red-600 text-2xl"
			}, null, _parent));
			_push(`</div></div></div><div class="bg-white dark:bg-gray-800 rounded-xl shadow p-5"><div class="flex items-center justify-between"><div><p class="text-sm text-gray-500">Total Terkumpul</p><p class="text-2xl font-bold text-purple-600">${ssrInterpolate(unref(formatRupiah)(unref(stats).totalTerkumpul))}</p><p class="text-xs text-gray-400 mt-1">dari ${ssrInterpolate(unref(formatRupiah)(unref(stats).totalTagihan))}</p></div><div class="p-3 bg-purple-100 rounded-xl">`);
			_push(ssrRenderComponent(_component_UIcon, {
				name: "i-lucide-wallet",
				class: "text-purple-600 text-2xl"
			}, null, _parent));
			_push(`</div></div></div></div><div class="bg-white dark:bg-gray-800 rounded-xl shadow p-5 mb-6"><div class="flex justify-between items-center mb-2"><span class="text-sm font-medium text-gray-700">Progress Pembayaran</span><span class="text-sm font-bold text-green-600">${ssrInterpolate(unref(persenBayar))}%</span></div><div class="w-full bg-gray-200 rounded-full h-4"><div class="bg-green-600 h-4 rounded-full transition-all duration-500" style="${ssrRenderStyle({ width: unref(persenBayar) + "%" })}"></div></div><div class="flex justify-between mt-2 text-xs text-gray-500"><span>${ssrInterpolate(unref(stats).sudahBayar)} lunas</span><span>${ssrInterpolate(unref(stats).belumBayar)} belum</span></div></div><div class="grid grid-cols-1 lg:grid-cols-2 gap-6"><div class="bg-white dark:bg-gray-800 rounded-xl shadow p-5"><h2 class="text-lg font-semibold mb-4 flex items-center gap-2">`);
			_push(ssrRenderComponent(_component_UIcon, {
				name: "i-lucide-zap",
				class: "text-yellow-500"
			}, null, _parent));
			_push(` Aksi Cepat </h2><div class="grid grid-cols-2 gap-3">`);
			_push(ssrRenderComponent(_component_UButton, {
				to: "/admin/meteran",
				label: "Input Meteran",
				icon: "i-lucide-gauge",
				color: "green",
				variant: "outline",
				block: ""
			}, null, _parent));
			_push(ssrRenderComponent(_component_UButton, {
				to: "/admin/pembayaran",
				label: "Input Pembayaran",
				icon: "i-lucide-credit-card",
				color: "green",
				variant: "outline",
				block: ""
			}, null, _parent));
			_push(ssrRenderComponent(_component_UButton, {
				to: "/admin/kas",
				label: "Kas Masuk/Keluar",
				icon: "i-lucide-wallet",
				color: "green",
				variant: "outline",
				block: ""
			}, null, _parent));
			_push(ssrRenderComponent(_component_UButton, {
				to: "/admin/laporan",
				label: "Lihat Laporan",
				icon: "i-lucide-bar-chart-3",
				color: "green",
				variant: "outline",
				block: ""
			}, null, _parent));
			_push(ssrRenderComponent(_component_UButton, {
				to: "/admin/tutup-buku",
				label: "Tutup Buku",
				icon: "i-lucide-lock",
				color: "green",
				variant: "outline",
				block: ""
			}, null, _parent));
			_push(ssrRenderComponent(_component_UButton, {
				to: "/admin/rumah",
				label: "Data Rumah",
				icon: "i-lucide-home",
				color: "green",
				variant: "outline",
				block: ""
			}, null, _parent));
			_push(`</div></div><div class="bg-white dark:bg-gray-800 rounded-xl shadow p-5"><h2 class="text-lg font-semibold mb-4 flex items-center gap-2">`);
			_push(ssrRenderComponent(_component_UIcon, {
				name: "i-lucide-trending-up",
				class: "text-green-500"
			}, null, _parent));
			_push(` Ringkasan Kas Bulan Ini </h2><div class="space-y-4"><div class="flex justify-between items-center p-3 bg-green-50 rounded-lg"><div class="flex items-center gap-2">`);
			_push(ssrRenderComponent(_component_UIcon, {
				name: "i-lucide-arrow-down-left",
				class: "text-green-600"
			}, null, _parent));
			_push(`<span class="text-sm text-black font-medium">Kas Masuk</span></div><span class="font-bold text-green-600">${ssrInterpolate(unref(formatRupiah)(unref(kasSummary).total_masuk))}</span></div><div class="flex justify-between items-center p-3 bg-red-50 rounded-lg"><div class="flex items-center gap-2">`);
			_push(ssrRenderComponent(_component_UIcon, {
				name: "i-lucide-arrow-up-right",
				class: "text-red-600"
			}, null, _parent));
			_push(`<span class="text-sm text-black font-medium">Kas Keluar</span></div><span class="font-bold text-red-600">${ssrInterpolate(unref(formatRupiah)(unref(kasSummary).total_keluar))}</span></div><div class="flex justify-between items-center p-3 bg-blue-50 rounded-lg border-2 border-blue-200"><div class="flex items-center gap-2">`);
			_push(ssrRenderComponent(_component_UIcon, {
				name: "i-lucide-wallet",
				class: "text-blue-600"
			}, null, _parent));
			_push(`<span class="font-medium text-black">Saldo Kas</span></div><span class="font-bold text-blue-600 text-lg">${ssrInterpolate(unref(formatRupiah)(unref(kasSummary).saldo))}</span></div></div></div></div><div class="bg-white dark:bg-gray-800 rounded-xl shadow p-5 mt-6"><h2 class="text-lg font-semibold mb-4 flex items-center gap-2">`);
			_push(ssrRenderComponent(_component_UIcon, {
				name: "i-lucide-clock",
				class: "text-blue-500"
			}, null, _parent));
			_push(` Pembayaran Terbaru </h2>`);
			if (unref(recentPayments).length > 0) {
				_push(`<div class="space-y-3"><!--[-->`);
				ssrRenderList(unref(recentPayments), (payment) => {
					_push(`<div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"><div class="flex items-center gap-3"><div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">`);
					_push(ssrRenderComponent(_component_UIcon, {
						name: "i-lucide-check",
						class: "text-green-600"
					}, null, _parent));
					_push(`</div><div><p class="font-medium">${ssrInterpolate(payment.blok)}-${ssrInterpolate(payment.nomor)}</p><p class="text-sm text-gray-500">${ssrInterpolate(payment.periode)} • ${ssrInterpolate(payment.metode)}</p></div></div><span class="font-bold text-green-600">${ssrInterpolate(unref(formatRupiah)(payment.jumlah))}</span></div>`);
				});
				_push(`<!--]--></div>`);
			} else _push(`<div class="text-center text-gray-500 py-8"> Belum ada pembayaran </div>`);
			_push(`</div></div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=admin-Cb8dLtOM.mjs.map
