import { tenantConfig } from '~/config/tenant'

export const useTenant = () => {
  const tenant = readonly(ref(tenantConfig))

  return {
    tenant,
    tenantId: tenantConfig.id,
    tenantNama: tenantConfig.nama,
    tenantSlug: tenantConfig.slug,
    tenantDomain: tenantConfig.domain,
    tenantLogo: tenantConfig.logo,
    tenantPrimaryColor: tenantConfig.primary_color,
    tenantSecondaryColor: tenantConfig.secondary_color,
    tenantFooter: tenantConfig.footer_text,
    tenantKontak: tenantConfig.kontak,
    tenantAlamat: tenantConfig.alamat
  }
}
