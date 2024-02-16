<script lang="ts">
	import { io } from 'socket.io-client';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import Game from '$lib/components/Game/Game.svelte';
	import Lobby from '$lib/components/Game/Lobby.svelte';
	import { goto } from '$app/navigation';
	import { CurrentUser } from '$lib/stores/user';
	import Winners from '$lib/components/Game/Winners.svelte';
	import Showcase from '$lib/components/Game/Showcase.svelte';

	export let data: PageData;

	const socket = io(`http://localhost:3000`);

	let gameData: Api.EmittedRoomData | null = {
		players: [{ userId: $CurrentUser?.userId ?? "", userName: $CurrentUser?.userName ?? ""}],
		gameData: {
			state: 'create',
			round: 0,
			timeLeft: 0,
			data: {},
			showCasingUser: '',
			started: false,
			done: false,
		}	
	};

	socket.on('updateRoom', (data: Api.EmittedRoomData) => {
		gameData = data;
	});

	onMount(() => {
		if(!$CurrentUser)
		    goto(`/game`); //TODO when is not logged save session data on cookies.
		const joinRoomData = {
			lang: 'es',
			roomId: data.id,
			userId: $CurrentUser?.userId,
			userName: $CurrentUser?.userName,
			private: true
		} as unknown as Api.JoinRoomData;
		console.log(joinRoomData);
		socket.emit('joinRoom', joinRoomData);
	});


</script>

{#if !gameData || !gameData.gameData.started}
	<Lobby {gameData} />
{:else}
	{#if gameData.gameData.state === 'showcase'}
		<Showcase {gameData} />
	{:else if gameData.gameData.state === 'create'}
		<Game {gameData} />
	{:else if gameData.gameData.state === 'winners'}
		<Winners {gameData} />
	{/if}
{/if}
