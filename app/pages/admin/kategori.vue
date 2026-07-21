<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Kategori Iuran</h1>
      <UButton
        label="Tambah Kategori"
        icon="i-lucide-plus"
        @click="openForm()"
      />
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700">
              <th class="text-left p-4 font-semibold">Nama</th>
              <th class="text-left p-4 font-semibold">Tipe</th>
              <th class="text-left p-4 font-semibold">Tarif</th>
              <th class="text-left p-4 font-semibold">Status</th>
              <th class="text-left p-4 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in kategori"
              :key="item.id"
              class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td class="p-4">{{ item.nama }}</td>
              <td class="p-4">
                <span
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  :class="item.tipe === 'meteran' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'"
                >
                  {{ item.tipe === 'meteran' ? 'Meteran' : 'Flat' }}
                </span>
              </td>
              <td class="p-4">
                <div v-if="item.tipe === 'flat'">
                  {{ formatRupiah(item.tarif_flat) }}
                </div>
                <div v-else>
                  <div>Min: {{ formatRupiah(item.minimum_tarif) }} ({{ item.minimum_kuota }}m³)</div>
                  <div class="text-sm text-gray-500">Extra: {{ formatRupiah(item.tarif_per_m3) }}/m³</div>
                </div>
              </td>
              <td class="p-4">
                <span
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  :class="item.status === 'aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                >
                  {{ item.status === 'aktif' ? 'Aktif' : 'Nonaktif' }}
                </span>
              </td>
              <td class="p-4">
                <div class="flex gap-2">
                  <UButton
                    icon="i-lucide-edit"
                    variant="ghost"
                    size="sm"
                    @click="openForm(item)"
                  />
                  <UButton
                    icon="i-lucide-trash-2"
                    variant="ghost"
                    color="red"
                    size="sm"
                    @click="deleteKategori(item)"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="kategori.length === 0" class="p-8 text-center text-gray-500">
        Belum ada kategori iuran
      </div>
    </div>

    <!-- Form Modal -->
    <UModal v-model:open="showForm" :title="editingKategori ? 'Edit Kategori' : 'Tambah Kategori'">
      <template #body>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Nama Kategori</label>
            <input
              v-model="form.nama"
              type="text"
              placeholder="Contoh: Air, Sampah"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Tipe</label>
            <select
              v-model="form.tipe"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="flat">Flat (tetap)</option>
              <option value="meteran">Meteran (berdasarkan pemakaian)</option>
            </select>
          </div>

          <template v-if="form.tipe === 'flat'">
            <div>
              <label class="block text-sm font-medium mb-1">Tarif Flat (Rp)</label>
              <input
                v-model.number="form.tarif_flat"
                type="number"
                placeholder="25000"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </template>

          <template v-if="form.tipe === 'meteran'">
            <div>
              <label class="block text-sm font-medium mb-1">Minimum Kuota (m³)</label>
              <input
                v-model.number="form.minimum_kuota"
                type="number"
                placeholder="10"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Minimum Tarif (Rp)</label>
              <input
                v-model.number="form.minimum_tarif"
                type="number"
                placeholder="25000"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Tarif per m³ (Rp)</label>
              <input
                v-model.number="form.tarif_per_m3"
                type="number"
                placeholder="3000"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </template>

          <div>
            <label class="block text-sm font-medium mb-1">Status</label>
            <select
              v-model="form.status"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
            </select>
          </div>
        </form>
      </template>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            label="Batal"
            variant="ghost"
            @click="closeForm"
          />
          <UButton
            label="Simpan"
            :loading="saving"
            @click="handleSubmit"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

const { tenantId } = useTenant()

const kategori = ref([])
const showForm = ref(false)
const editingKategori = ref(null)
const saving = ref(false)

const form = reactive({
  nama: '',
  tipe: 'flat',
  tarif_flat: 0,
  tarif_per_m3: 0,
  minimum_kuota: 0,
  minimum_tarif: 0,
  status: 'aktif'
})

const { formatRupiah } = useBilling()

async function fetchKategori() {
  try {
    const data = await $fetch(`/api/kategori?tenant_id=${tenantId}`)
    kategori.value = data
  } catch (error) {
    console.error('Error fetching kategori:', error)
  }
}

function openForm(item = null) {
  editingKategori.value = item
  if (item) {
    form.nama = item.nama
    form.tipe = item.tipe
    form.tarif_flat = item.tarif_flat
    form.tarif_per_m3 = item.tarif_per_m3
    form.minimum_kuota = item.minimum_kuota
    form.minimum_tarif = item.minimum_tarif
    form.status = item.status
  } else {
    form.nama = ''
    form.tipe = 'flat'
    form.tarif_flat = 0
    form.tarif_per_m3 = 0
    form.minimum_kuota = 0
    form.minimum_tarif = 0
    form.status = 'aktif'
  }
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  editingKategori.value = null
}

async function deleteKategori(item) {
  if (!confirm(`Hapus kategori "${item.nama}"?`)) return

  try {
    await $fetch(`/api/kategori/${item.id}`, { method: 'DELETE' })
    await fetchKategori()
  } catch (error) {
    alert(error.data?.message || 'Gagal menghapus kategori')
  }
}

async function handleSubmit() {
  saving.value = true
  try {
    if (editingKategori.value) {
      await $fetch(`/api/kategori/${editingKategori.value.id}`, {
        method: 'PUT',
        body: form
      })
    } else {
      await $fetch('/api/kategori', {
        method: 'POST',
        body: { ...form, tenant_id: tenantId }
      })
    }
    closeForm()
    await fetchKategori()
  } catch (error) {
    alert(error.data?.message || 'Gagal menyimpan kategori')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchKategori()
})
</script>
