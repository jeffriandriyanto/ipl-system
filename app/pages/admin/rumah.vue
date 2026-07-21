<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Data Rumah</h1>
      <div class="flex gap-2">
        <DownloadTemplate type="rumah" />
        <UButton
          label="Tambah Rumah"
          icon="i-lucide-plus"
          @click="openForm()"
        />
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
      <div class="flex flex-wrap gap-4">
        <div>
          <label class="text-sm font-medium mb-1 block">Blok</label>
          <select
            v-model="filterBlok"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Semua Blok</option>
            <option v-for="b in blokOptions" :key="b" :value="b">{{ b }}</option>
          </select>
        </div>
        <div>
          <label class="text-sm font-medium mb-1 block">Status</label>
          <select
            v-model="filterStatus"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Semua</option>
            <option value="aktif">Aktif</option>
            <option value="nonaktif">Nonaktif</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700">
              <th class="text-left p-4 font-semibold">Blok-Nomor</th>
              <th class="text-left p-4 font-semibold">Tipe</th>
              <th class="text-left p-4 font-semibold">PIC</th>
              <th class="text-left p-4 font-semibold">Telepon</th>
              <th class="text-left p-4 font-semibold">Status</th>
              <th class="text-left p-4 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in filteredRumah"
              :key="item.id"
              class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td class="p-4 font-medium">{{ item.blok }}-{{ item.nomor }}</td>
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
              <td class="p-4">{{ item.pic_nama || '-' }}</td>
              <td class="p-4">{{ item.pic_telepon || '-' }}</td>
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
                    @click="deleteRumah(item)"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredRumah.length === 0" class="p-8 text-center text-gray-500">
        Tidak ada data rumah
      </div>
    </div>

    <!-- Form Modal -->
    <UModal v-model:open="showForm" :title="editingRumah ? 'Edit Rumah' : 'Tambah Rumah'" :ui="{ content: 'max-w-2xl' }">
      <template #body>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Blok</label>
              <input
                v-model="form.blok"
                type="text"
                placeholder="A"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Nomor</label>
              <input
                v-model="form.nomor"
                type="text"
                placeholder="1"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Tipe</label>
            <select
              v-model="form.tipe"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="pribadi">Pribadi</option>
              <option value="kontrakan">Kontrakan</option>
              <option value="fasum">Fasum</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Alamat</label>
            <input
              v-model="form.alamat"
              type="text"
              placeholder="Alamat lengkap (opsional)"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">PIC (Penanggung Jawab)</label>
              <input
                v-model="form.pic_nama"
                type="text"
                placeholder="Nama PIC"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Telepon PIC</label>
              <input
                v-model="form.pic_telepon"
                type="text"
                placeholder="0812xxxx"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Pemilik Rumah</label>
              <input
                v-model="form.pemilik_nama"
                type="text"
                placeholder="Nama pemilik (opsional)"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Telepon Pemilik</label>
              <input
                v-model="form.pemilik_telepon"
                type="text"
                placeholder="0812xxxx (opsional)"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Kategori Iuran</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="kat in kategoriList"
                :key="kat.id"
                type="button"
                class="px-3 py-1 rounded-full text-sm font-medium border transition-colors"
                :class="form.kategori_iuran.includes(kat.id) 
                  ? 'bg-primary-600 text-white border-primary-600' 
                  : 'bg-white text-gray-700 border-gray-300 hover:border-primary-500'"
                @click="toggleKategori(kat.id)"
              >
                {{ kat.nama }}
              </button>
            </div>
          </div>

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

          <div>
            <label class="block text-sm font-medium mb-1">Keterangan</label>
            <textarea
              v-model="form.keterangan"
              placeholder="Keterangan (opsional)"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
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

const tenantId = 'waris1'

const rumah = ref([])
const kategoriList = ref([])
const showForm = ref(false)
const editingRumah = ref(null)
const saving = ref(false)
const filterBlok = ref('')
const filterStatus = ref('')

const form = reactive({
  blok: '',
  nomor: '',
  tipe: 'pribadi',
  alamat: '',
  pic_nama: '',
  pic_telepon: '',
  pic_email: '',
  pemilik_nama: '',
  pemilik_telepon: '',
  kategori_iuran: [],
  status: 'aktif',
  keterangan: ''
})

const blokOptions = computed(() => {
  return [...new Set(rumah.value.map(r => r.blok))].sort()
})

const filteredRumah = computed(() => {
  let result = rumah.value
  if (filterBlok.value) {
    result = result.filter(r => r.blok === filterBlok.value)
  }
  if (filterStatus.value) {
    result = result.filter(r => r.status === filterStatus.value)
  }
  return result
})

async function fetchRumah() {
  try {
    const data = await $fetch(`/api/rumah?tenant_id=${tenantId}`)
    rumah.value = data
  } catch (error) {
    console.error('Error fetching rumah:', error)
  }
}

async function fetchKategori() {
  try {
    const data = await $fetch(`/api/kategori?tenant_id=${tenantId}`)
    kategoriList.value = data
  } catch (error) {
    console.error('Error fetching kategori:', error)
  }
}

function toggleKategori(katId) {
  const index = form.kategori_iuran.indexOf(katId)
  if (index === -1) {
    form.kategori_iuran.push(katId)
  } else {
    form.kategori_iuran.splice(index, 1)
  }
}

function openForm(item = null) {
  editingRumah.value = item
  if (item) {
    form.blok = item.blok
    form.nomor = item.nomor
    form.tipe = item.tipe
    form.alamat = item.alamat || ''
    form.pic_nama = item.pic_nama || ''
    form.pic_telepon = item.pic_telepon || ''
    form.pic_email = item.pic_email || ''
    form.pemilik_nama = item.pemilik_nama || ''
    form.pemilik_telepon = item.pemilik_telepon || ''
    form.kategori_iuran = item.kategori_iuran || []
    form.status = item.status
    form.keterangan = item.keterangan || ''
  } else {
    form.blok = ''
    form.nomor = ''
    form.tipe = 'pribadi'
    form.alamat = ''
    form.pic_nama = ''
    form.pic_telepon = ''
    form.pic_email = ''
    form.pemilik_nama = ''
    form.pemilik_telepon = ''
    form.kategori_iuran = []
    form.status = 'aktif'
    form.keterangan = ''
  }
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  editingRumah.value = null
}

async function deleteRumah(item) {
  if (!confirm(`Hapus rumah ${item.blok}-${item.nomor}?`)) return

  try {
    await $fetch(`/api/rumah/${item.id}`, { method: 'DELETE' })
    await fetchRumah()
  } catch (error) {
    alert(error.data?.message || 'Gagal menghapus rumah')
  }
}

async function handleSubmit() {
  saving.value = true
  try {
    if (editingRumah.value) {
      await $fetch(`/api/rumah/${editingRumah.value.id}`, {
        method: 'PUT',
        body: form
      })
    } else {
      await $fetch('/api/rumah', {
        method: 'POST',
        body: { ...form, tenant_id: tenantId }
      })
    }
    closeForm()
    await fetchRumah()
  } catch (error) {
    alert(error.data?.message || 'Gagal menyimpan rumah')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchRumah()
  fetchKategori()
})
</script>
