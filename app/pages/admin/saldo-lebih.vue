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
            Saldo lebih bisa dikurangi dari tagihan bulan berikutnya.
          </p>
        </div>
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
              <th class="text-left p-4 font-semibold">Periode</th>
              <th class="text-right p-4 font-semibold">Tagihan</th>
              <th class="text-right p-4 font-semibold">Bayar</th>
              <th class="text-right p-4 font-semibold">Saldo Lebih</th>
              <th class="text-center p-4 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in saldoList"
              :key="item.id"
              class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td class="p-4 font-medium">{{ item.blok }}-{{ item.nomor_rumah }}</td>
              <td class="p-4 text-sm">{{ item.pic_nama || '-' }}</td>
              <td class="p-4 text-sm">{{ item.periode }}</td>
              <td class="p-4 text-right">{{ formatRupiah(item.total_tagihan) }}</td>
              <td class="p-4 text-right text-green-600">{{ formatRupiah(item.total_bayar) }}</td>
              <td class="p-4 text-right font-bold text-blue-600">{{ formatRupiah(item.saldo_lebih) }}</td>
              <td class="p-4 text-center">
                <UButton
                  label="Kurangi Tagihan"
                  size="sm"
                  variant="outline"
                  @click="adjustSaldo(item)"
                />
              </td>
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

const tenantId = 'waris1'

const saldoList = ref([])

const { formatRupiah } = useBilling()

async function fetchSaldoLebih() {
  try {
    // Fetch all tagihan with status 'lebih'
    const data = await $fetch(`/api/tagihan?tenant_id=${tenantId}&status=lebih`)
    saldoList.value = data.data || []
  } catch (error) {
    console.error('Error fetching saldo lebih:', error)
  }
}

function adjustSaldo(item) {
  // TODO: implement adjust saldo
  alert('Fitur adjust saldo belum diimplementasikan')
}

onMounted(() => {
  fetchSaldoLebih()
})
</script>
