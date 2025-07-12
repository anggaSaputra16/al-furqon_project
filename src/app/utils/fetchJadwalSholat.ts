export interface JadwalSholat {
  tanggal: string
  imsak: string
  subuh: string
  terbit: string
  dhuha: string
  dzuhur: string
  ashar: string
  maghrib: string
  isya: string
}
export async function fetchJadwalSholat(kota: string, tanggal: string) {
  const url = `https://api.myquran.com/v2/sholat/jadwal/${kota}/${tanggal}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Gagal mengambil jadwal sholat')
  const data = await res.json()
  return data.data.jadwal
}
