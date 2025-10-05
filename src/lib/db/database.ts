import type { ChapterItemType } from '$lib/api/types/ChapterItemType';
import type { ComicItemType } from '$lib/api/types/ComicItemType';
import { numberToSourceType, sourceTypeToNumber, type SourceType } from '$lib/config/sourceType';
import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'MangaLoomDB';
const DB_VERSION = 1;

// --- STORE NAMES ---
const BOOKMARK_STORE = 'bookmarked_komik';
const HISTORY_STORE = 'chapter_history';
const SCROLL_POS_STORE = 'chapter_scroll_position';

// --- TYPE DEFINITIONS for Application Logic (using string enum) ---

export interface BookmarkedKomik extends ComicItemType {
	sourceType: SourceType;
	bookmarkedAt: Date;
}

export interface ChapterHistory extends ChapterItemType {
	komikHref: string;
	sourceType: SourceType;
	readAt: Date;
}

export interface ChapterScrollPosition {
	chapterHref: string;
	normalScrollPosition: number;
	fullscreenScrollPosition: number;
	sourceType: SourceType;
	updatedAt: Date;
}

// --- Internal TYPE DEFINITIONS for Database Records (using number) ---

interface BookmarkedKomikInDB extends Omit<BookmarkedKomik, 'sourceType'> {
	sourceType: number;
}

interface ChapterHistoryInDB extends Omit<ChapterHistory, 'sourceType'> {
	sourceType: number;
}

interface ChapterScrollPositionInDB extends Omit<ChapterScrollPosition, 'sourceType'> {
	sourceType: number;
}

// --- DATABASE INITIALIZATION ---

let dbPromise: Promise<IDBPDatabase>;

function getDB() {
	if (!dbPromise) {
		dbPromise = openDB(DB_NAME, DB_VERSION, {
			upgrade(db) {
				if (!db.objectStoreNames.contains(BOOKMARK_STORE)) {
					const store = db.createObjectStore(BOOKMARK_STORE, {
						keyPath: ['href', 'sourceType']
					});
					store.createIndex('bookmarkedAt', 'bookmarkedAt');
				}

				if (!db.objectStoreNames.contains(HISTORY_STORE)) {
					const store = db.createObjectStore(HISTORY_STORE, {
						keyPath: ['href', 'sourceType']
					});
					store.createIndex('by-komik', ['komikHref', 'sourceType']);
					store.createIndex('readAt', 'readAt');
				}

				if (!db.objectStoreNames.contains(SCROLL_POS_STORE)) {
					db.createObjectStore(SCROLL_POS_STORE, {
						keyPath: ['chapterHref', 'sourceType']
					});
				}
			}
		});
	}
	return dbPromise;
}

// --- CRUD OPERATIONS ---

// == BOOKMARK ==
export async function addOrUpdateBookmark(bookmark: BookmarkedKomik) {
	const db = await getDB();
	const dbRecord: BookmarkedKomikInDB = {
		...bookmark,
		sourceType: sourceTypeToNumber(bookmark.sourceType)
	};
	return db.put(BOOKMARK_STORE, dbRecord);
}

export async function getBookmark(
	href: string,
	sourceType: SourceType
): Promise<BookmarkedKomik | undefined> {
	const db = await getDB();
	const sourceNumber = sourceTypeToNumber(sourceType);
	const dbRecord: BookmarkedKomikInDB | undefined = await db.get(BOOKMARK_STORE, [
		href,
		sourceNumber
	]);

	if (!dbRecord) return undefined;
	return { ...dbRecord, sourceType: numberToSourceType(dbRecord.sourceType) };
}

export async function getAllBookmarks(): Promise<BookmarkedKomik[]> {
	const db = await getDB();
	const dbRecords: BookmarkedKomikInDB[] = await db.getAll(BOOKMARK_STORE);
	return dbRecords.map((record) => ({
		...record,
		sourceType: numberToSourceType(record.sourceType)
	}));
}

export async function deleteBookmark(href: string, sourceType: SourceType) {
	const db = await getDB();
	const sourceNumber = sourceTypeToNumber(sourceType);
	return db.delete(BOOKMARK_STORE, [href, sourceNumber]);
}

// == HISTORY ==
export async function addOrUpdateHistory(history: ChapterHistory) {
	const db = await getDB();
	const dbRecord: ChapterHistoryInDB = {
		...history,
		sourceType: sourceTypeToNumber(history.sourceType)
	};
	return db.put(HISTORY_STORE, dbRecord);
}

export async function getHistory(
	href: string,
	sourceType: SourceType
): Promise<ChapterHistory | undefined> {
	const db = await getDB();
	const sourceNumber = sourceTypeToNumber(sourceType);
	const dbRecord: ChapterHistoryInDB | undefined = await db.get(HISTORY_STORE, [
		href,
		sourceNumber
	]);
	if (!dbRecord) return undefined;
	return { ...dbRecord, sourceType: numberToSourceType(dbRecord.sourceType) };
}

export async function getHistoryForKomik(
	komikHref: string,
	sourceType: SourceType
): Promise<ChapterHistory[]> {
	const db = await getDB();
	const sourceNumber = sourceTypeToNumber(sourceType);
	const dbRecords: ChapterHistoryInDB[] = await db.getAllFromIndex(HISTORY_STORE, 'by-komik', [
		komikHref,
		sourceNumber
	]);
	return dbRecords.map((record) => ({
		...record,
		sourceType: numberToSourceType(record.sourceType)
	}));
}

export async function getAllHistory(): Promise<ChapterHistory[]> {
	const db = await getDB();
	const dbRecords: ChapterHistoryInDB[] = await db.getAll(HISTORY_STORE);
	const historyItems = dbRecords.map((record) => ({
		...record,
		sourceType: numberToSourceType(record.sourceType)
	}));

	return historyItems.sort((a, b) => b.readAt.getTime() - a.readAt.getTime());
}

export async function deleteHistory(href: string, sourceType: SourceType) {
	const db = await getDB();
	const sourceNumber = sourceTypeToNumber(sourceType);
	return db.delete(HISTORY_STORE, [href, sourceNumber]);
}

// == SCROLL POSITION ==
export async function saveScrollPosition(scrollPos: ChapterScrollPosition) {
	const db = await getDB();
	const dbRecord: ChapterScrollPositionInDB = {
		...scrollPos,
		sourceType: sourceTypeToNumber(scrollPos.sourceType)
	};
	return db.put(SCROLL_POS_STORE, dbRecord);
}

export async function getScrollPosition(
	chapterHref: string,
	sourceType: SourceType
): Promise<ChapterScrollPosition | undefined> {
	const db = await getDB();
	const sourceNumber = sourceTypeToNumber(sourceType);
	const dbRecord: ChapterScrollPositionInDB | undefined = await db.get(SCROLL_POS_STORE, [
		chapterHref,
		sourceNumber
	]);
	if (!dbRecord) return undefined;
	return { ...dbRecord, sourceType: numberToSourceType(dbRecord.sourceType) };
}
