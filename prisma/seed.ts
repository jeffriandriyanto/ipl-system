import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // 1. Create Tenant
  const tenant = await prisma.tenant.create({
    data: {
      id: 'waris1',
      nama: 'IPL Perumahan Waris 1',
      slug: 'waris1',
      primary_color: '#2563EB',
      secondary_color: '#1E40AF',
      footer_text: '© 2026 IPL Perumahan Waris 1',
      kontak: '0812xxxx',
      domain: 'ipl-system.netlify.app',
      status: 'aktif'
    }
  })
  console.log('✅ Tenant created:', tenant.nama)

  // 2. Create Settings
  const settings = await prisma.settings.create({
    data: {
      tenant_id: tenant.id,
      nama_aplikasi: 'IPL Perumahan Waris 1',
      nama_perumahan: 'Perumahan Waris 1',
      alamat: 'Jl. Perumahan Waris 1',
      kontak: '0812xxxx'
    }
  })
  console.log('✅ Settings created')

  // 3. Create Kategori Iuran
  const kategoriAir = await prisma.kategoriIuran.create({
    data: {
      tenant_id: tenant.id,
      nama: 'Air',
      tipe: 'meteran',
      tarif_per_m3: 3000,
      minimum_kuota: 10,
      minimum_tarif: 25000,
      status: 'aktif'
    }
  })
  console.log('✅ Kategori Air created')

  const kategoriSampah = await prisma.kategoriIuran.create({
    data: {
      tenant_id: tenant.id,
      nama: 'Sampah',
      tipe: 'flat',
      tarif_flat: 25000,
      status: 'aktif'
    }
  })
  console.log('✅ Kategori Sampah created')

  // 4. Create Rumah
  const rumahData = [
    { blok: 'A', nomor: '1', tipe: 'pribadi', pic_nama: 'Budi', pic_telepon: '081211111111' },
    { blok: 'A', nomor: '2', tipe: 'pribadi', pic_nama: 'Andi', pic_telepon: '081222222222' },
    { blok: 'A', nomor: '3', tipe: 'kontrakan', pic_nama: 'Siti', pic_telepon: '081233333333' },
    { blok: 'A', nomor: '1-2', tipe: 'pribadi', pic_nama: 'Dewi', pic_telepon: '081244444444' },
    { blok: 'B', nomor: '1', tipe: 'pribadi', pic_nama: 'Ahmad', pic_telepon: '081255555555' },
    { blok: 'B', nomor: '2', tipe: 'kontrakan', pic_nama: 'Rina', pic_telepon: '081266666666' },
    { blok: 'B', nomor: '3', tipe: 'pribadi', pic_nama: 'Hadi', pic_telepon: '081277777777' },
    { blok: 'C', nomor: '1', tipe: 'pribadi', pic_nama: 'Joko', pic_telepon: '081288888888' },
    { blok: 'C', nomor: '2', tipe: 'pribadi', pic_nama: 'Lina', pic_telepon: '081299999999' },
    { blok: 'FASUM', nomor: '1', tipe: 'fasum', pic_nama: 'Pengurus Masjid', pic_telepon: '081200000000' },
  ]

  for (const data of rumahData) {
    const kategoriIds = data.tipe === 'fasum' 
      ? [kategoriAir.id] 
      : [kategoriAir.id, kategoriSampah.id]

    await prisma.rumah.create({
      data: {
        tenant_id: tenant.id,
        blok: data.blok,
        nomor: data.nomor,
        tipe: data.tipe,
        status: 'aktif',
        pic_nama: data.pic_nama,
        pic_telepon: data.pic_telepon,
        kategori_iuran: kategoriIds
      }
    })
  }
  console.log('✅ 10 Rumah created')

  // 5. Create User (Admin)
  const user = await prisma.user.create({
    data: {
      tenant_id: tenant.id,
      email: 'admin@ipl-waris1.com',
      nama: 'Admin IPL Waris 1',
      role: 'admin',
      status: 'aktif',
      telepon: '0812xxxx'
    }
  })
  console.log('✅ Admin user created:', user.email)

  // 6. Create Periode
  const periode = await prisma.periode.create({
    data: {
      tenant_id: tenant.id,
      periode: '2026-07',
      status: 'draft'
    }
  })
  console.log('✅ Periode created:', periode.periode)

  console.log('\n🎉 Seeding completed!')
  console.log(`   Tenant: ${tenant.nama}`)
  console.log(`   Kategori: ${kategoriAir.nama}, ${kategoriSampah.nama}`)
  console.log(`   Rumah: ${rumahData.length} rumah`)
  console.log(`   User: ${user.email}`)
  console.log(`   Periode: ${periode.periode}`)
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
