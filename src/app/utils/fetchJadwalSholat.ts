// Utility to fetch jadwal sholat from API (e.g. https://api.myquran.com/v2/sholat/jadwal)
// You can adjust the endpoint and params as needed

export async function fetchJadwalSholat(kota: string, tanggal: string) {
  // Example API: https://api.myquran.com/v2/sholat/jadwal/kota/703/tanggal/2024-05-26
  // kota: id kota, tanggal: yyyy-mm-dd
  const url = `https://api.myquran.com/v2/sholat/jadwal/kota/${kota}/tanggal/${tanggal}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Gagal mengambil jadwal sholat')
  const data = await res.json()
  // data.data.jadwal: { subuh, dzuhur, ashar, maghrib, isya }
  return data.data.jadwal
}
