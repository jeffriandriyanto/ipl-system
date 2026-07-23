import { _ as _sfc_main$1, r as _sfc_main$2 } from '../virtual/entry.mjs';
import { u as useTenant } from './useTenant-B7s_AqNz.mjs';
import { u as useAuth } from './useAuth-BH_veuXo.mjs';
import { computed, reactive, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent, ssrRenderStyle, ssrRenderSlot } from 'vue/server-renderer';
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
import '@supabase/supabase-js';

//#region app/layouts/admin.vue
var _sfc_main = {
	__name: "admin",
	__ssrInlineRender: true,
	setup(__props) {
		const { tenantNama } = useTenant();
		const currentPeriode = computed(() => {
			const now = /* @__PURE__ */ new Date();
			return `${[
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
			][now.getMonth()]} ${now.getFullYear()}`;
		});
		const openGroups = reactive({
			"Master Data": true,
			"Transaksi": true
		});
		const menuItems = [
			{
				to: "/admin",
				label: "Dashboard",
				icon: "i-lucide-layout-dashboard"
			},
			{
				label: "Master Data",
				icon: "i-lucide-database",
				children: [
					{
						to: "/admin/kategori",
						label: "Kategori Iuran",
						icon: "i-lucide-tag"
					},
					{
						to: "/admin/rumah",
						label: "Data Rumah",
						icon: "i-lucide-home"
					},
					{
						to: "/admin/users",
						label: "User Management",
						icon: "i-lucide-users"
					}
				]
			},
			{
				label: "Transaksi",
				icon: "i-lucide-arrow-left-right",
				children: [
					{
						to: "/admin/meteran",
						label: "Input Meteran",
						icon: "i-lucide-gauge"
					},
					{
						to: "/admin/pembayaran",
						label: "Pembayaran",
						icon: "i-lucide-credit-card"
					},
					{
						to: "/admin/kas",
						label: "Kas Masuk/Keluar",
						icon: "i-lucide-wallet"
					},
					{
						to: "/admin/saldo-lebih",
						label: "Saldo Lebih",
						icon: "i-lucide-trending-up"
					}
				]
			},
			{
				to: "/admin/tutup-buku",
				label: "Tutup Buku",
				icon: "i-lucide-lock"
			},
			{
				to: "/admin/laporan",
				label: "Laporan",
				icon: "i-lucide-bar-chart-3"
			},
			{
				to: "/admin/audit-log",
				label: "Audit Log",
				icon: "i-lucide-file-text"
			},
			{
				to: "/admin/settings",
				label: "Pengaturan",
				icon: "i-lucide-settings"
			}
		];
		function toggleSidebar() {}
		async function handleLogout() {
			const { logout } = useAuth();
			await logout();
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UButton = _sfc_main$1;
			const _component_UIcon = _sfc_main$2;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50 dark:bg-gray-900" }, _attrs))}><aside class="fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform -translate-x-full lg:translate-x-0"><div class="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700"><h1 class="text-xl font-bold text-green-600">${ssrInterpolate(unref(tenantNama))}</h1></div><nav class="p-4 space-y-1 overflow-y-auto h-[calc(100vh-8rem)]"><!--[-->`);
			ssrRenderList(menuItems, (item) => {
				_push(`<!--[-->`);
				if (!item.children) _push(ssrRenderComponent(_component_UButton, {
					to: item.to,
					icon: item.icon,
					label: item.label,
					variant: "ghost",
					class: "w-full justify-start"
				}, null, _parent));
				else {
					_push(`<div><button class="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"><span class="flex items-center gap-2">`);
					_push(ssrRenderComponent(_component_UIcon, {
						name: item.icon,
						class: "w-4 h-4"
					}, null, _parent));
					_push(` ${ssrInterpolate(item.label)}</span>`);
					_push(ssrRenderComponent(_component_UIcon, {
						name: "i-lucide-chevron-down",
						class: ["w-4 h-4 transition-transform", { "-rotate-90": !unref(openGroups)[item.label] }]
					}, null, _parent));
					_push(`</button><div class="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-2" style="${ssrRenderStyle(unref(openGroups)[item.label] ? null : { display: "none" })}"><!--[-->`);
					ssrRenderList(item.children, (child) => {
						_push(ssrRenderComponent(_component_UButton, {
							key: child.to,
							to: child.to,
							icon: child.icon,
							label: child.label,
							variant: "ghost",
							size: "sm",
							class: "w-full justify-start"
						}, null, _parent));
					});
					_push(`<!--]--></div></div>`);
				}
				_push(`<!--]-->`);
			});
			_push(`<!--]--></nav><div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">`);
			_push(ssrRenderComponent(_component_UButton, {
				icon: "i-lucide-log-out",
				label: "Logout",
				variant: "ghost",
				color: "red",
				class: "w-full justify-start",
				onClick: handleLogout
			}, null, _parent));
			_push(`</div></aside><div class="lg:ml-64"><header class="sticky top-0 z-30 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 lg:px-6">`);
			_push(ssrRenderComponent(_component_UButton, {
				icon: "i-lucide-menu",
				variant: "ghost",
				class: "lg:hidden",
				onClick: toggleSidebar
			}, null, _parent));
			_push(`<div class="flex items-center gap-4"><span class="text-sm text-gray-500">Periode: ${ssrInterpolate(unref(currentPeriode))}</span>`);
			_push(ssrRenderComponent(_component_UButton, {
				icon: "i-lucide-bell",
				variant: "ghost"
			}, null, _parent));
			_push(`<div class="flex items-center gap-2"><div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">`);
			_push(ssrRenderComponent(_component_UIcon, {
				name: "i-lucide-user",
				class: "text-green-600"
			}, null, _parent));
			_push(`</div><span class="text-sm font-medium">Admin</span></div></div></header><main class="p-4 lg:p-6">`);
			ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
			_push(`</main></div></div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/admin.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=admin-DHJQ0vLi.mjs.map
