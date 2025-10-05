export function timeAgo(date: Date): string {
	const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

	let interval = seconds / 31536000; // 1 tahun = 31,536,000 detik
	if (interval > 1) {
		return Math.floor(interval) + ' tahun yang lalu';
	}
	interval = seconds / 2592000; // 1 bulan = 2,592,000 detik
	if (interval > 1) {
		return Math.floor(interval) + ' bulan yang lalu';
	}
	interval = seconds / 86400; // 1 hari = 86,400 detik
	if (interval > 1) {
		return Math.floor(interval) + ' hari yang lalu';
	}
	interval = seconds / 3600; // 1 jam = 3,600 detik
	if (interval > 1) {
		return Math.floor(interval) + ' jam yang lalu';
	}
	interval = seconds / 60; // 1 menit = 60 detik
	if (interval > 1) {
		return Math.floor(interval) + ' menit yang lalu';
	}
	return 'Baru saja';
}
