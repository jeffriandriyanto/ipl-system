<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Tutup Buku</h1>
    </div>

    <!-- Info -->
    <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 rounded-lg p-4 mb-6">
      <div class="flex items-start gap-3">
        <UIcon name="i-lucide-info" class="text-blue-600 text-xl mt-0.5" />
        <div>
          <p class="font-semibold text-blue-800">Alur Periode</p>
          <p class="text-sm text-blue-700 mt-1">
            <span class="font-medium">Draft</span> → Input meteran & generate tagihan → 
            <span class="font-medium">Publish</span> → Warga bisa cek tagihan → 
            <span class="font-medium">Tutup</span> → Data terkunci
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
              :class="statusClass(item.status)"
            >
              {{ statusLabel(item.status) }}
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

          <!-- Action Buttons -->
          <div class="mt-4 pt-4 border-t flex justify-between items-center">
            <p class="text-sm text-gray-500">
              <template v-if="item.status === 'draft'">
                Status: Draft (belum visible untuk warga)
              </template>
              <template v-else-if="item.status === 'published'">
                Dipublish • Belum ditutup
              </template>
              <template v-else>
                Ditutup pada: {{ formatDate(item.ditutup_pada) }}
              </template>
            </p>

            <div class="flex gap-2">
              <!-- Publish Button (only for draft) -->
              <UButton
                v-if="item.status === 'draft'"
                label="Publish"
                icon="i-lucide-send"
                color="green"
                :loading="processing === item.periode + '-publish'"
                @click="publishPeriode(item)"
              />

              <!-- Tutup Button (only for published) -->
              <UButton
                v-if="item.status === 'published'"
                label="Tutup Buku"
                icon="i-lucide-lock"
                color="red"
                :loading="processing === item.periode + '-tutup'"
                @click="tutupBuku(item)"
              />

              <!-- Status indicator for closed -->
              <span v-if="item.status === 'ditutup'" class="flex items-center gap-1 text-sm text-gray-500">
                <UIcon name="i-lucide-lock" class="text-green-600" />
                Terkunci
              </span>
            </div>
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

const { tenantId } = useTenant()
const periodes = ref([])
const processing = ref(null)

const { formatRupiah } = useBilling()

const months = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

function formatPeriode(periode) {
  const [year, month] = periode.split('-')
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

function statusClass(status) {
  switch (status) {
    case 'draft': return 'bg-yellow-100 text-yellow-800'
    case 'published': return 'bg-blue-100 text-blue-800'
    case 'ditutup': return 'bg-gray-100 text-gray-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

function statusLabel(status) {
  switch (status) {
    case 'draft': return 'Draft'
    case 'published': return 'Published'
    case 'ditutup': return 'Ditutup'
    default: return status
  }
}

async function fetchPeriodes() {
  try {
    const data = await $fetch(`/api/tutup-buku?tenant_id=${tenantId}`)
    periodes.value = data
  } catch (error) {
    console.error('Error fetching periodes:', error)
  }
}

async function publishPeriode(item) {
  const confirmed = confirm(
    `Publish tagihan periode ${formatPeriode(item.periode)}?\n\n` +
    `Setelah publish, warga sudah bisa melihat tagihan mereka.`
  )

  if (!confirmed) return

  processing.value = item.periode + '-publish'
  try {
    const result = await $fetch(`/api/tutup-buku/${item.periode}/action`, {
      method: 'POST',
      body: { tenant_id: tenantId, action: 'publish' }
    })
    alert(result.message)
    await fetchPeriodes()
  } catch (error) {
    alert(error.data?.message || 'Gagal publish periode')
  } finally {
    processing.value = null
  }
}

async function tutupBuku(item) {
  const confirmed = confirm(
    `Tutup buku periode ${formatPeriode(item.periode)}?\n\n` +
    `Tindakan ini TIDAK BISA dibatalkan! Data akan terkunci permanen.`
  )

  if (!confirmed) return

  processing.value = item.periode + '-tutup'
  try {
    const result = await $fetch(`/api/tutup-buku/${item.periode}/action`, {
      method: 'POST',
      body: { tenant_id: tenantId, action: 'tutup' }
    })
    alert(result.message)
    await fetchPeriodes()
  } catch (error) {
    alert(error.data?.message || 'Gagal menutup periode')
  } finally {
    processing.value = null
  }
}

onMounted(() => {
  fetchPeriodes()
})
</script>
