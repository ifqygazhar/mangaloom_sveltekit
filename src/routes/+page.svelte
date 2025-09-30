<script lang="ts">
	import type { ComicItemType } from '$lib/api/types/ComicItemType';
	import Ads from '$lib/components/Ads.svelte';
	import GeneralHorizontalComic from '$lib/components/GeneralHorizontalComic.svelte';
	import { Phone } from '@lucide/svelte';

	const dummies: ComicItemType[] = [
		{
			title: 'Sleeping Ranker',
			href: '/sleeping-ranker/',
			thumbnail: 'https://komikcast.li/wp-content/uploads/2024/01/sleeping.jpg?w=225&h=300',
			type: 'Manhwa',
			chapter: 'Ch.149',
			rating: '8.00'
		},
		{
			title: 'The World’s Best Kunlun Tavern',
			href: '/the-worlds-best-kunlun-tavern/',
			thumbnail:
				'https://komikcast.li/wp-content/uploads/2025/01/Screenshot_20250222_181600_Chrome-e1740223278869.jpg?w=225&h=300',
			type: 'Manhwa',
			chapter: 'Ch.74',
			rating: '7.45'
		},
		{
			title: 'Legendary Youngest Son of the Marquis House',
			href: '/legendary-youngest-son-of-the-marquis-house/',
			thumbnail:
				'https://komikcast.li/wp-content/uploads/2024/06/Legendary_Youngest_Son_Cover-e1729489629184.jpg?w=225&h=300',
			type: 'Manhwa',
			chapter: 'Ch.145',
			rating: '8.00'
		},
		{
			title: 'Mushoku no Eiyuu: Betsu ni Skill Nanka Iranakattan daga',
			href: '/mushoku-no-eiyuu-betsu-ni-skill-nanka-iranakattan-daga/',
			thumbnail:
				'https://komikcast.li/wp-content/uploads/2025/09/eb2e14ac-20db-412b.jpg?w=225&h=300',
			type: 'Manga',
			chapter: 'Ch.48.1 fix',
			rating: '8.00'
		},
		{
			title: 'One Punch Man',
			href: '/one-punch-man/',
			thumbnail: 'https://komikcast.li/wp-content/uploads/2025/07/6bOYYKx.jpg?w=225&h=300',
			type: 'Manga',
			chapter: 'Ch.287 (215 New)',
			rating: '8.80'
		},
		{
			title: 'Terminally-Ill Genius Dark Knight',
			href: '/terminally-ill-genius-dark-knight/',
			thumbnail:
				'https://komikcast.li/wp-content/uploads/2025/04/½A¸®Ai_AE÷½oAI_½ae³×AI_650x758-1.jpg?w=225&h=300',
			type: 'Manhwa',
			chapter: 'Ch.117',
			rating: '7.79'
		},
		{
			title: 'Maou Tsukai no Saikyou Shihai',
			href: '/maou-tsukai-no-saikyou-shihai/',
			thumbnail:
				'https://komikcast.li/wp-content/uploads/2022/06/Maou-Tsukai-no-Saikyou-e1655038156977.jpg?w=225&h=300',
			type: 'Manga',
			chapter: 'Ch.29',
			rating: '8.00'
		},
		{
			title: 'Tsuihou Sareta Tenshou Juu Kishi wa Game Chishiki de Musou Suru',
			href: '/tsuihou-sareta-tenshou-juu-kishi-ha-gemu-chishiki-de-musou-suru/',
			thumbnail: 'https://komikcast.li/wp-content/uploads/2025/04/pR6rG0.jpg?w=225&h=300',
			type: 'Manga',
			chapter: 'Ch.133',
			rating: '8.01'
		},
		{
			title: 'Spy X Family',
			href: '/spy-x-family/',
			thumbnail:
				'https://komikcast.li/wp-content/uploads/2022/11/sp62523423-e1668849548536.jpg?w=225&h=300',
			type: 'Manga',
			chapter: 'Ch.123.2',
			rating: '8.40'
		}
	];
</script>

<GeneralHorizontalComic
	items={dummies}
	title="Rekomendasi Bulan Ini 🌟"
	shortdesc="Sebuah mahakarya yang direkomendasikan untuk Anda"
/>

{#snippet phoneIcon()}
	<Phone
		class="h-4 w-4 text-black group-hover:text-primary-foreground md:h-5 md:text-white group-hover:md:text-black lg:h-5"
	/>
{/snippet}

<Ads
	icon={phoneIcon}
	title="Ingin membuat website atau aplikasi serupa ?"
	btnText="Hubungi"
	url="https://ifqy.dev"
/>

<GeneralHorizontalComic
	items={dummies}
	isPopuler={true}
	title="Komik Populer 🚀"
	shortdesc="Deretan komik populer pilihan pembaca"
/>

<GeneralHorizontalComic
	items={dummies}
	title="Komik Aksi Untuk Kamu 🔫"
	shortdesc="Komik dengan genre aksi terbaik"
/>

<GeneralHorizontalComic
	items={dummies}
	title="Komedi Acumalaka 😂"
	shortdesc="Komik dengan genre komedi terbaik"
/>

<GeneralHorizontalComic
	items={dummies}
	title="Echhiiii!! 👀"
	shortdesc="Komik yang bikin kamu panas dingin le"
/>
