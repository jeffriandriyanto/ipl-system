<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Tutup Buku</h1>
    </div>

    <!-- Info -->
    <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 rounded-lg p-4 mb-6">
      <div class="flex items-start gap-3">
        <UIcon name="i-lucide-alert-triangle" class="text-yellow-600 text-xl mt-0.5" />
        <div>
          <p class="font-semibold text-yellow-800">Perhatian!</p>
          <p class="text-sm text-yellow-700 mt-1">
            Tutup buku akan mengunci periode dan tidak bisa diubah lagi. 
            Pastikan semua data sudah benar sebelum menutup buku.
          </p>
        </div>
      </div>
    </div>

    <!-- Period List -->
    <div class="space-y-4">
      <div
        v-for="item in periodes"
        :key="item.id"
        class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
      >
        <div class="p-6">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-lg font-bold">{{ formatPeriode(item.periode) }}</h3>
              <p class="text-sm text-gray-500 mt-1">
                {{ item.jumlah_rumah }} rumah • {{ item.jumlah_lunas }} lunas • {{ item.jumlah_belum }} belum
              </p>
            </div>
            <span
              class="px-3 py-1 rounded-full text-sm font-medium"
              :class="item.status === 'ditutup' ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'"
            >
              {{ item.status === 'ditutup' ? 'Ditutup' : 'Draft' }}
            </span>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-3 gap-4 mt-4">
            <div>
              <p class="text-sm text-gray-500">Total Tagihan</p>
              <p class="font-semibold">{{ formatRupiah(item.total_tagihan) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Total Bayar</p>
              <p class="font-semibold text-green-600">{{ formatRupiah(item.total_bayar) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Selisih</p>
              <p class="font-semibold" :class="item.total_selisih >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ formatRupiah(item.total_selisih) }}
              </p>
            </div>
          </div>

          <!-- Action -->
          <div v-if="item.status === 'draft'" class="mt-4 pt-4 border-t">
            <div class="flex justify-between items-center">
              <p class="text-sm text-gray-500">
                Ditutup pada: -
              </p>
              <UButton
                label="Tutup Buku"
                icon="i-lucide-lock"
                color="red"
                :loading="closing === item.periode"
                @click="tutupBuku(item)"
              />
            </div>
          </div>

          <div v-else class="mt-4 pt-4 border-t">
            <p class="text-sm text-gray-500">
              Ditutup pada: {{ formatDate(item.ditutup_pada) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="periodes.length === 0" class="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center text-gray-500">
      Belum ada periode
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

const tenantId = 'waris1'

const periodes = ref([])
const closing = ref(null)

const { formatRupiah } = useBilling()

function formatPeriode(periode) {
  const [year, month] = periode.split('-')
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]
  return `${months[parseInt(month) - 1]} ${year}`
}

function formatDate(date) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

async function fetchPeriodes() {
  try {
    const data = await $fetch(`/api/tutup-buku?tenant_id=${tenantId}`)
    periodes.value = data
  } catch (error) {
    console.error('Error fetching periodes:', error)
  }
}

async function tutupBuku(item) {
  const confirmed = confirm(
    `Anda yakin ingin menutup buku periode ${formatPeriode(item.periode)}?\n\n` +
    `Tindakan ini TIDAK BISA dibatalkan!`
  )

  if (!confirmed) return

  closing.value = item.periode
  try {
    await $fetch(`/api/tutup-buku/${item.periode}`, {
      method: 'POST',
      body: { tenant_id: tenantId }
    })
    alert(`Periode ${formatPeriode(item.periode)} berhasil ditutup`)
    await fetchPeriodes()
  } catch (error) {
    alert(error.data?.message || 'Gagal menutup periode')
  } finally {
    closing.value = null
  }
}

onMounted(() => {
  fetchPeriodes()
})
</script>
