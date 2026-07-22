<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Saldo Lebih</h1>
    </div>

    <!-- Info -->
    <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 rounded-lg p-4 mb-6">
      <div class="flex items-start gap-3">
        <UIcon name="i-lucide-info" class="text-blue-600 text-xl mt-0.5" />
        <div>
          <p class="font-semibold text-blue-800">Informasi</p>
          <p class="text-sm text-blue-700 mt-1">
            Daftar rumah yang memiliki saldo lebih (bayar melebihi tagihan). 
            Saldo lebih akan otomatis dikurangi dari tagihan bulan berikutnya.
          </p>
        </div>
      </div>
    </div>

    <!-- Summary -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
        <p class="text-sm text-gray-500">Total Rumah dengan Saldo Lebih</p>
        <p class="text-2xl font-bold text-green-600">{{ saldoList.length }}</p>
      </div>
      <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <p class="text-sm text-gray-500">Total Saldo Lebih</p>
        <p class="text-2xl font-bold text-blue-600">{{ formatRupiah(totalSaldo) }}</p>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700">
              <th class="text-left p-4 font-semibold">Rumah</th>
              <th class="text-left p-4 font-semibold">PIC</th>
              <th class="text-left p-4 font-semibold">Telepon</th>
              <th class="text-left p-4 font-semibold">Tipe</th>
              <th class="text-right p-4 font-semibold">Saldo Lebih</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in saldoList"
              :key="item.id"
              class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td class="p-4 font-medium">{{ item.blok }}-{{ item.nomor }}</td>
              <td class="p-4 text-sm">{{ item.pic_nama || '-' }}</td>
              <td class="p-4 text-sm">{{ item.pic_telepon || '-' }}</td>
              <td class="p-4">
                <span
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  :class="{
                    'bg-blue-100 text-blue-800': item.tipe === 'pribadi',
                    'bg-purple-100 text-purple-800': item.tipe === 'kontrakan',
                    'bg-gray-100 text-gray-800': item.tipe === 'fasum'
                  }"
                >
                  {{ item.tipe }}
                </span>
              </td>
              <td class="p-4 text-right font-bold text-blue-600">{{ formatRupiah(item.saldo_lebih) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="saldoList.length === 0" class="p-8 text-center text-gray-500">
        Tidak ada rumah dengan saldo lebih
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

const { tenantId } = useTenant()

const saldoList = ref([])

const { formatRupiah } = useBilling()

const totalSaldo = computed(() => {
  return saldoList.value.reduce((sum, r) => sum + r.saldo_lebih, 0)
})

async function fetchSaldoLebih() {
  try {
    const data = await $fetch(`/api/rumah?tenant_id=${tenantId}&has_saldo_lebih=true`)
    saldoList.value = data
  } catch (error) {
    console.error('Error fetching saldo lebih:', error)
  }
}

onMounted(() => {
  fetchSaldoLebih()
})
</script>
