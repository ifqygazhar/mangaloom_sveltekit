export enum SourceType {
	V1 = 'v1',
	V2 = 'v2',
	V3 = 'v3',
	V4 = 'v4',
	V5 = 'v5'
}

// Objek untuk mapping, lebih mudah diperluas daripada switch-case
const sourceTypeToNumberMap: Record<SourceType, number> = {
	[SourceType.V1]: 1,
	[SourceType.V2]: 2,
	[SourceType.V3]: 3,
	[SourceType.V4]: 4,
	[SourceType.V5]: 5
};

const numberToSourceTypeMap: Record<number, SourceType> = {
	1: SourceType.V1,
	2: SourceType.V2,
	3: SourceType.V3,
	4: SourceType.V4,
	5: SourceType.V5
};

/**
 * Mengubah enum SourceType (string) menjadi angka.
 * @param source Enum SourceType, contoh: SourceType.V1
 * @returns Angka yang sesuai, contoh: 1
 */
export function sourceTypeToNumber(source: SourceType): number {
	return sourceTypeToNumberMap[source] || 0; // default 0 jika tidak ditemukan
}

/**
 * Mengubah angka menjadi enum SourceType (string).
 * @param num Angka sourceType, contoh: 1
 * @returns Enum SourceType yang sesuai, contoh: SourceType.V1
 */
export function numberToSourceType(num: number): SourceType {
	return numberToSourceTypeMap[num];
}
