import { d as defineEventHandler, r as readBody, c as createError, p as prisma } from '../../nitro/nitro.mjs';
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

const index_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { tenant_id, ...data } = body;
  if (!tenant_id) {
    throw createError({
      statusCode: 400,
      message: "tenant_id wajib diisi"
    });
  }
  const tenantFields = ["logo", "primary_color", "secondary_color", "footer_text", "domain"];
  const settingsFields = ["nama_aplikasi", "nama_perumahan", "alamat", "kontak", "payment_info"];
  const tenantData = {};
  const settingsData = {};
  for (const [key, value] of Object.entries(data)) {
    if (tenantFields.includes(key)) {
      tenantData[key] = value;
    } else if (settingsFields.includes(key)) {
      settingsData[key] = value;
    }
  }
  try {
    if (Object.keys(tenantData).length > 0) {
      await prisma.tenant.update({
        where: { id: tenant_id },
        data: tenantData
      });
    }
    if (Object.keys(settingsData).length > 0) {
      const settings = await prisma.settings.upsert({
        where: { tenant_id },
        update: settingsData,
        create: {
          tenant_id,
          nama_aplikasi: settingsData.nama_aplikasi || "IPL System",
          ...settingsData
        }
      });
      return settings;
    }
    return { success: true };
  } catch (error) {
    console.error("Error updating settings:", error);
    throw createError({
      statusCode: 500,
      message: (error == null ? void 0 : error.message) || "Gagal mengupdate pengaturan"
    });
  }
});

export { index_post as default };
//# sourceMappingURL=index6.post.mjs.map
