import sharp from 'sharp';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const imageUrl = url.searchParams.get('url');
	const width = parseInt(url.searchParams.get('w') || '0', 10);
	const height = parseInt(url.searchParams.get('h') || '0', 10);
	const quality = parseInt(url.searchParams.get('q') || '80', 10);
	const format = url.searchParams.get('f') || 'webp';

	if (!imageUrl) {
		return new Response('URL gambar tidak ditemukan', { status: 400 });
	}

	try {
		new URL(imageUrl);
	} catch {
		return new Response('URL gambar tidak valid', { status: 400 });
	}

	try {
		const imageResponse = await fetch(imageUrl, {
			headers: {
				'User-Agent': 'Mozilla/5.0 (compatible; ImageOptimizer/1.0)'
			}
		});

		if (!imageResponse.ok) {
			return new Response('Gagal mengambil gambar', { status: imageResponse.status });
		}

		const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

		let transformer = sharp(imageBuffer);

		if (width > 0 || height > 0) {
			transformer = transformer.resize({
				width: width > 0 ? width : undefined,
				height: height > 0 ? height : undefined,
				fit: 'inside',
				withoutEnlargement: true
			});
		}

		// 👇 DEFAULT CASE = WebP
		let contentType = 'image/webp';
		switch (format.toLowerCase()) {
			case 'jpeg':
			case 'jpg':
				transformer = transformer.jpeg({ quality, progressive: true });
				contentType = 'image/jpeg';
				break;
			case 'png':
				transformer = transformer.png({ quality, progressive: true });
				contentType = 'image/png';
				break;
			case 'avif':
				transformer = transformer.avif({ quality });
				contentType = 'image/avif';
				break;
			case 'webp':
			default:
				transformer = transformer.webp({ quality });
				contentType = 'image/webp';
				break;
		}

		const optimizedImageBuffer = await transformer.toBuffer();

		return new Response(new Uint8Array(optimizedImageBuffer), {
			headers: {
				'Content-Type': contentType,
				'Cache-Control': 'public, max-age=31536000, immutable',
				'X-Content-Type-Options': 'nosniff'
			}
		});
	} catch (error) {
		console.error('Error processing image:', error);
		return new Response('Terjadi kesalahan saat memproses gambar', { status: 500 });
	}
};
