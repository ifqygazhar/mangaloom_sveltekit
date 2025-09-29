import china from '$lib/assets/china.svg';
import japan from '$lib/assets/japan.svg';
import korea from '$lib/assets/korea.svg';
import unkown from '$lib/assets/unkown.svg';

export function getFlagSrc(type?: string) {
	const t = (type || '').toLowerCase();
	if (t.includes('manga')) return japan;
	if (t.includes('manhwa')) return korea;
	if (t.includes('manhua')) return china;
	return unkown;
}
