import { readonly, ref } from 'vue';

//#region app/config/tenant.ts
var tenantConfig = {
	id: "waris1",
	nama: "IPL Perumahan Waris 1",
	slug: "waris1",
	domain: "ipl-system.netlify.app",
	logo: null,
	primary_color: "#16A34A",
	secondary_color: "#15803D",
	footer_text: "© 2026 IPL Perumahan Waris 1",
	kontak: "0812xxxx",
	alamat: "Perumahan Waris 1",
	status: "aktif"
};
//#endregion
//#region app/composables/useTenant.ts
var useTenant = () => {
	return {
		tenant: readonly(ref(tenantConfig)),
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
	};
};

export { useTenant as u };
//# sourceMappingURL=useTenant-B7s_AqNz.mjs.map
