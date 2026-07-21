<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Data Rumah</h1>
      <div class="flex gap-2">
        <DownloadTemplate type="rumah" />
        <UButton
          label="Tambah Rumah"
          icon="i-lucide-plus"
          @click="showForm = true"
        />
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
      <div class="flex flex-wrap gap-4">
        <div>
          <label class="text-sm font-medium mb-1 block">Blok</label>
          <USelect
            v-model="filterBlok"
            :options="blokOptions"
            placeholder="Semua Blok"
            class="w-40"
          />
        </div>
        <div>
          <label class="text-sm font-medium mb-1 block">Status</label>
          <USelect
            v-model="filterStatus"
            :options="[
              { label: 'Semua', value: '' },
              { label: 'Aktif', value: 'aktif' },
              { label: 'Nonaktif', value: 'nonaktif' }
            ]"
            class="w-40"
          />
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
                    @click="editRumah(item)"
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
    <UModal v-model="showForm" :ui="{ width: 'max-w-2xl' }">
      <div class="p-6">
        <h2 class="text-xl font-bold mb-4">
          {{ editingRumah ? 'Edit Rumah' : 'Tambah Rumah' }}
        </h2>

        <UForm :state="form" @submit="handleSubmit" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="Blok" name="blok">
              <UInput v-model="form.blok" placeholder="A" />
            </UFormGroup>

            <UFormGroup label="Nomor" name="nomor">
              <UInput v-model="form.nomor" placeholder="1" />
            </UFormGroup>
          </div>

          <UFormGroup label="Tipe" name="tipe">
            <USelect
              v-model="form.tipe"
              :options="[
                { label: 'Pribadi', value: 'pribadi' },
                { label: 'Kontrakan', value: 'kontrakan' },
                { label: 'Fasum', value: 'fasum' }
              ]"
            />
          </UFormGroup>

          <UFormGroup label="Alamat" name="alamat">
            <UInput v-model="form.alamat" placeholder="Alamat lengkap (opsional)" />
          </UFormGroup>

          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="PIC (Penanggung Jawab)" name="pic_nama">
              <UInput v-model="form.pic_nama" placeholder="Nama PIC" />
            </UFormGroup>

            <UFormGroup label="Telepon PIC" name="pic_telepon">
              <UInput v-model="form.pic_telepon" placeholder="0812xxxx" />
            </UFormGroup>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="Pemilik Rumah" name="pemilik_nama">
              <UInput v-model="form.pemilik_nama" placeholder="Nama pemilik (opsional)" />
            </UFormGroup>

            <UFormGroup label="Telepon Pemilik" name="pemilik_telepon">
              <UInput v-model="form.pemilik_telepon" placeholder="0812xxxx (opsional)" />
            </UFormGroup>
          </div>

          <UFormGroup label="Kategori Iuran" name="kategori_iuran">
            <div class="flex flex-wrap gap-2">
              <UButton
                v-for="kat in kategoriList"
                :key="kat.id"
                :label="kat.nama"
                :variant="form.kategori_iuran.includes(kat.id) ? 'solid' : 'outline'"
                size="sm"
                @click="toggleKategori(kat.id)"
              />
            </div>
          </UFormGroup>

          <UFormGroup label="Status" name="status">
            <USelect
              v-model="form.status"
              :options="[
                { label: 'Aktif', value: 'aktif' },
                { label: 'Nonaktif', value: 'nonaktif' }
              ]"
            />
          </UFormGroup>

          <UFormGroup label="Keterangan" name="keterangan">
            <UTextarea v-model="form.keterangan" placeholder="Keterangan (opsional)" />
          </UFormGroup>

          <div class="flex justify-end gap-2 pt-4">
            <UButton
              label="Batal"
              variant="ghost"
              @click="closeForm"
            />
            <UButton
              type="submit"
              label="Simpan"
              :loading="saving"
            />
          </div>
        </UForm>
      </div>
    </UModal>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

const tenantId = 'waris1' // TODO: get from auth context

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

// Computed
const blokOptions = computed(() => {
  const bloks = [...new Set(rumah.value.map(r => r.blok))]
  return [
    { label: 'Semua', value: '' },
    ...bloks.map(b => ({ label: b, value: b }))
  ]
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

// Fetch data
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

// Toggle kategori selection
function toggleKategori(katId) {
  const index = form.kategori_iuran.indexOf(katId)
  if (index === -1) {
    form.kategori_iuran.push(katId)
  } else {
    form.kategori_iuran.splice(index, 1)
  }
}

// Edit rumah
function editRumah(item) {
  editingRumah.value = item
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
  showForm.value = true
}

// Delete rumah
async function deleteRumah(item) {
  if (!confirm(`Hapus rumah ${item.blok}-${item.nomor}?`)) return

  try {
    await $fetch(`/api/rumah/${item.id}`, { method: 'DELETE' })
    await fetchRumah()
  } catch (error) {
    alert(error.data?.message || 'Gagal menghapus rumah')
  }
}

// Submit form
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

// Close form
function closeForm() {
  showForm.value = false
  editingRumah.value = null
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

// Fetch on mount
onMounted(() => {
  fetchRumah()
  fetchKategori()
})
</script>
