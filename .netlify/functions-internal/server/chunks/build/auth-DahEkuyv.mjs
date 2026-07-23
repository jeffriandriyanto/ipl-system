import { d as defineNuxtRouteMiddleware } from '../virtual/entry.mjs';
import 'nostics';
import 'nostics/formatters/ansi';
import 'vue';
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
import 'vue/server-renderer';
import '@vueuse/core';
import 'tailwind-variants';
import '@vueuse/shared';
import 'tailwindcss/colors';

//#region app/middleware/auth.ts
var auth_default = defineNuxtRouteMiddleware((to) => {
	if (to.path === "/cek-tagihan" || to.path === "/login" || to.path === "/") return;
});

export { auth_default as default };
//# sourceMappingURL=auth-DahEkuyv.mjs.map
