<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">User Management</h1>
      <UButton
        label="Tambah User"
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
              <th class="text-left p-4 font-semibold">Email</th>
              <th class="text-left p-4 font-semibold">Role</th>
              <th class="text-left p-4 font-semibold">Telepon</th>
              <th class="text-left p-4 font-semibold">Status</th>
              <th class="text-left p-4 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in users"
              :key="item.id"
              class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td class="p-4 font-medium">{{ item.nama }}</td>
              <td class="p-4 text-sm">{{ item.email }}</td>
              <td class="p-4">
                <span
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  :class="item.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'"
                >
                  {{ item.role }}
                </span>
              </td>
              <td class="p-4 text-sm">{{ item.telepon || '-' }}</td>
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
                    @click="deleteUser(item)"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="users.length === 0" class="p-8 text-center text-gray-500">
        Belum ada user
      </div>
    </div>

    <!-- Form Modal -->
    <UModal v-model:open="showForm" :title="editingUser ? 'Edit User' : 'Tambah User'">
      <template #body>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Nama</label>
            <input
              v-model="form.nama"
              type="text"
              placeholder="Nama lengkap"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Email</label>
            <input
              v-model="form.email"
              type="email"
              placeholder="email@example.com"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              :disabled="!!editingUser"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Role</label>
            <select
              v-model="form.role"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="admin">Admin</option>
              <option value="petugas">Petugas</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Telepon</label>
            <input
              v-model="form.telepon"
              type="text"
              placeholder="0812xxxx"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div v-if="editingUser">
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

const users = ref([])
const showForm = ref(false)
const editingUser = ref(null)
const saving = ref(false)

const form = reactive({
  nama: '',
  email: '',
  role: 'petugas',
  telepon: '',
  status: 'aktif'
})

async function fetchUsers() {
  try {
    const data = await $fetch(`/api/users?tenant_id=${tenantId}`)
    users.value = data
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

function openForm(item = null) {
  editingUser.value = item
  if (item) {
    form.nama = item.nama
    form.email = item.email
    form.role = item.role
    form.telepon = item.telepon || ''
    form.status = item.status
  } else {
    form.nama = ''
    form.email = ''
    form.role = 'petugas'
    form.telepon = ''
    form.status = 'aktif'
  }
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  editingUser.value = null
}

async function deleteUser(item) {
  if (!confirm(`Hapus user "${item.nama}"?`)) return

  try {
    await $fetch(`/api/users/${item.id}`, { method: 'DELETE' })
    await fetchUsers()
  } catch (error) {
    alert(error.data?.message || 'Gagal menghapus user')
  }
}

async function handleSubmit() {
  saving.value = true
  try {
    if (editingUser.value) {
      await $fetch(`/api/users/${editingUser.value.id}`, {
        method: 'PUT',
        body: form
      })
    } else {
      await $fetch('/api/users', {
        method: 'POST',
        body: { ...form, tenant_id: tenantId }
      })
    }
    closeForm()
    await fetchUsers()
  } catch (error) {
    alert(error.data?.message || 'Gagal menyimpan user')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchUsers()
})
</script>
