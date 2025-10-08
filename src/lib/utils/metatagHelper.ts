const defaultTitle = 'Mangaloom — Baca Komik Manga, Manhwa & Manhua Gratis';
const defaultDescription =
	'Mangaloom — baca komik manga, manhwa, dan manhua secara gratis. Temukan ratusan judul terbaru dan klasik, update harian, dan antarmuka yang ringan untuk pengalaman membaca terbaik.';
export function layoutMetadata(
	title: string = defaultTitle,
	description: string = defaultDescription
) {
	return {
		title: title,
		description: description,
		keywords: [
			'Mangaloom',
			'baca komik',
			'manga',
			'manhwa',
			'manhua',
			'komik gratis',
			'baca manga online'
		],
		author: 'Ifqy Gifha Azhar & Team Mangaloom',
		follow: true,
		language: 'id',

		og: {
			siteName: 'Mangaloom',
			type: 'website',
			image: [
				{
					url: '/og-image.png',
					alt: 'Mangaloom — Baca Komik Manga, Manhwa & Manhua Gratis'
				}
			]
		},
		x: {
			card: 'summary_large_image',
			image: [
				{
					url: '/og-image.png',
					alt: 'Mangaloom — Baca Komik Manga, Manhwa & Manhua Gratis'
				}
			]
		}
	};
}
