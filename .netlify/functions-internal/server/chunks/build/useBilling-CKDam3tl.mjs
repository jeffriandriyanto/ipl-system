//#region app/composables/useBilling.ts
var useBilling = () => {
	const formatRupiah = (amount) => {
		return new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(amount);
	};
	const parseRupiah = (rupiah) => {
		return parseInt(rupiah.replace(/[^0-9]/g, ""), 10) || 0;
	};
	const hitungMeteran = (meterLalu, meterSekarang, minimumKuota, minimumTarif, tarifPerM3) => {
		const pemakaian = meterSekarang - meterLalu;
		if (pemakaian < 0) return 0;
		if (pemakaian <= minimumKuota) return minimumTarif;
		return minimumTarif + (pemakaian - minimumKuota) * tarifPerM3;
	};
	const getStatusColor = (status) => {
		switch (status) {
			case "lunas": return "text-green-600 bg-green-100";
			case "belum_bayar": return "text-red-600 bg-red-100";
			case "kurang": return "text-yellow-600 bg-yellow-100";
			case "lebih": return "text-blue-600 bg-blue-100";
			default: return "text-gray-600 bg-gray-100";
		}
	};
	const getStatusText = (status, selisih) => {
		switch (status) {
			case "lunas": return "LUNAS";
			case "belum_bayar": return "BELUM LUNAS";
			case "kurang": return `KURANG ${formatRupiah(Math.abs(selisih || 0))}`;
			case "lebih": return "LEBIH BAYAR";
			default: return status;
		}
	};
	return {
		formatRupiah,
		parseRupiah,
		hitungMeteran,
		getStatusColor,
		getStatusText
	};
};

export { useBilling as u };
//# sourceMappingURL=useBilling-CKDam3tl.mjs.map
