import { _ as _sfc_main$1, $ as $fetch$2 } from '../virtual/entry.mjs';
import { _ as _sfc_main$2 } from './Modal-BK5i0WLm.mjs';
import { u as useTenant } from './useTenant-B7s_AqNz.mjs';
import { ref, reactive, unref, isRef, withCtx, createVNode, withModifiers, withDirectives, vModelText, vModelSelect, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
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

//#region app/pages/admin/users.vue
var _sfc_main = {
	__name: "users",
	__ssrInlineRender: true,
	setup(__props) {
		const { tenantId } = useTenant();
		const users = ref([]);
		const showForm = ref(false);
		const editingUser = ref(null);
		const saving = ref(false);
		const form = reactive({
			nama: "",
			email: "",
			role: "petugas",
			telepon: "",
			status: "aktif"
		});
		async function fetchUsers() {
			try {
				const data = await $fetch$2(`/api/users?tenant_id=${tenantId}`);
				users.value = data;
			} catch (error) {
				console.error("Error fetching users:", error);
			}
		}
		function openForm(item = null) {
			editingUser.value = item;
			if (item) {
				form.nama = item.nama;
				form.email = item.email;
				form.role = item.role;
				form.telepon = item.telepon || "";
				form.status = item.status;
			} else {
				form.nama = "";
				form.email = "";
				form.role = "petugas";
				form.telepon = "";
				form.status = "aktif";
			}
			showForm.value = true;
		}
		function closeForm() {
			showForm.value = false;
			editingUser.value = null;
		}
		async function deleteUser(item) {
			if (!confirm(`Hapus user "${item.nama}"?`)) return;
			try {
				await $fetch$2(`/api/users/${item.id}`, { method: "DELETE" });
				await fetchUsers();
			} catch (error) {
				alert(error.data?.message || "Gagal menghapus user");
			}
		}
		async function handleSubmit() {
			saving.value = true;
			try {
				if (editingUser.value) await $fetch$2(`/api/users/${editingUser.value.id}`, {
					method: "PUT",
					body: form
				});
				else await $fetch$2("/api/users", {
					method: "POST",
					body: {
						...form,
						tenant_id: tenantId
					}
				});
				closeForm();
				await fetchUsers();
			} catch (error) {
				alert(error.data?.message || "Gagal menyimpan user");
			} finally {
				saving.value = false;
			}
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UButton = _sfc_main$1;
			const _component_UModal = _sfc_main$2;
			_push(`<div${ssrRenderAttrs(_attrs)}><div class="flex justify-between items-center mb-6"><h1 class="text-2xl font-bold">User Management</h1>`);
			_push(ssrRenderComponent(_component_UButton, {
				label: "Tambah User",
				icon: "i-lucide-plus",
				onClick: ($event) => openForm()
			}, null, _parent));
			_push(`</div><div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"><div class="overflow-x-auto"><table class="w-full"><thead><tr class="border-b border-gray-200 dark:border-gray-700"><th class="text-left p-4 font-semibold">Nama</th><th class="text-left p-4 font-semibold">Email</th><th class="text-left p-4 font-semibold">Role</th><th class="text-left p-4 font-semibold">Telepon</th><th class="text-left p-4 font-semibold">Status</th><th class="text-left p-4 font-semibold">Aksi</th></tr></thead><tbody><!--[-->`);
			ssrRenderList(unref(users), (item) => {
				_push(`<tr class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"><td class="p-4 font-medium">${ssrInterpolate(item.nama)}</td><td class="p-4 text-sm">${ssrInterpolate(item.email)}</td><td class="p-4"><span class="${ssrRenderClass([item.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800", "px-2 py-1 rounded-full text-xs font-medium"])}">${ssrInterpolate(item.role)}</span></td><td class="p-4 text-sm">${ssrInterpolate(item.telepon || "-")}</td><td class="p-4"><span class="${ssrRenderClass([item.status === "aktif" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800", "px-2 py-1 rounded-full text-xs font-medium"])}">${ssrInterpolate(item.status === "aktif" ? "Aktif" : "Nonaktif")}</span></td><td class="p-4"><div class="flex gap-2">`);
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
					onClick: ($event) => deleteUser(item)
				}, null, _parent));
				_push(`</div></td></tr>`);
			});
			_push(`<!--]--></tbody></table></div>`);
			if (unref(users).length === 0) _push(`<div class="p-8 text-center text-gray-500"> Belum ada user </div>`);
			else _push(`<!---->`);
			_push(`</div>`);
			_push(ssrRenderComponent(_component_UModal, {
				open: unref(showForm),
				"onUpdate:open": ($event) => isRef(showForm) ? showForm.value = $event : null,
				title: unref(editingUser) ? "Edit User" : "Tambah User"
			}, {
				body: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<form class="space-y-4"${_scopeId}><div${_scopeId}><label class="block text-sm font-medium mb-1"${_scopeId}>Nama</label><input${ssrRenderAttr("value", unref(form).nama)} type="text" placeholder="Nama lengkap" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" required${_scopeId}></div><div${_scopeId}><label class="block text-sm font-medium mb-1"${_scopeId}>Email</label><input${ssrRenderAttr("value", unref(form).email)} type="email" placeholder="email@example.com" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"${ssrIncludeBooleanAttr(!!unref(editingUser)) ? " disabled" : ""} required${_scopeId}></div><div${_scopeId}><label class="block text-sm font-medium mb-1"${_scopeId}>Role</label><select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"${_scopeId}><option value="admin"${ssrIncludeBooleanAttr(Array.isArray(unref(form).role) ? ssrLooseContain(unref(form).role, "admin") : ssrLooseEqual(unref(form).role, "admin")) ? " selected" : ""}${_scopeId}>Admin</option><option value="petugas"${ssrIncludeBooleanAttr(Array.isArray(unref(form).role) ? ssrLooseContain(unref(form).role, "petugas") : ssrLooseEqual(unref(form).role, "petugas")) ? " selected" : ""}${_scopeId}>Petugas</option></select></div><div${_scopeId}><label class="block text-sm font-medium mb-1"${_scopeId}>Telepon</label><input${ssrRenderAttr("value", unref(form).telepon)} type="text" placeholder="0812xxxx" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"${_scopeId}></div>`);
						if (unref(editingUser)) _push(`<div${_scopeId}><label class="block text-sm font-medium mb-1"${_scopeId}>Status</label><select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"${_scopeId}><option value="aktif"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "aktif") : ssrLooseEqual(unref(form).status, "aktif")) ? " selected" : ""}${_scopeId}>Aktif</option><option value="nonaktif"${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "nonaktif") : ssrLooseEqual(unref(form).status, "nonaktif")) ? " selected" : ""}${_scopeId}>Nonaktif</option></select></div>`);
						else _push(`<!---->`);
						_push(`</form>`);
					} else return [createVNode("form", {
						onSubmit: withModifiers(handleSubmit, ["prevent"]),
						class: "space-y-4"
					}, [
						createVNode("div", null, [createVNode("label", { class: "block text-sm font-medium mb-1" }, "Nama"), withDirectives(createVNode("input", {
							"onUpdate:modelValue": ($event) => unref(form).nama = $event,
							type: "text",
							placeholder: "Nama lengkap",
							class: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500",
							required: ""
						}, null, 8, ["onUpdate:modelValue"]), [[vModelText, unref(form).nama]])]),
						createVNode("div", null, [createVNode("label", { class: "block text-sm font-medium mb-1" }, "Email"), withDirectives(createVNode("input", {
							"onUpdate:modelValue": ($event) => unref(form).email = $event,
							type: "email",
							placeholder: "email@example.com",
							class: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500",
							disabled: !!unref(editingUser),
							required: ""
						}, null, 8, ["onUpdate:modelValue", "disabled"]), [[vModelText, unref(form).email]])]),
						createVNode("div", null, [createVNode("label", { class: "block text-sm font-medium mb-1" }, "Role"), withDirectives(createVNode("select", {
							"onUpdate:modelValue": ($event) => unref(form).role = $event,
							class: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
						}, [createVNode("option", { value: "admin" }, "Admin"), createVNode("option", { value: "petugas" }, "Petugas")], 8, ["onUpdate:modelValue"]), [[vModelSelect, unref(form).role]])]),
						createVNode("div", null, [createVNode("label", { class: "block text-sm font-medium mb-1" }, "Telepon"), withDirectives(createVNode("input", {
							"onUpdate:modelValue": ($event) => unref(form).telepon = $event,
							type: "text",
							placeholder: "0812xxxx",
							class: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
						}, null, 8, ["onUpdate:modelValue"]), [[vModelText, unref(form).telepon]])]),
						unref(editingUser) ? (openBlock(), createBlock("div", { key: 0 }, [createVNode("label", { class: "block text-sm font-medium mb-1" }, "Status"), withDirectives(createVNode("select", {
							"onUpdate:modelValue": ($event) => unref(form).status = $event,
							class: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
						}, [createVNode("option", { value: "aktif" }, "Aktif"), createVNode("option", { value: "nonaktif" }, "Nonaktif")], 8, ["onUpdate:modelValue"]), [[vModelSelect, unref(form).status]])])) : createCommentVNode("", true)
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/users.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=users-8sheoK7h.mjs.map
