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
	import { Toaster, toast } from 'svelte-sonner';

	export let data: PageData;

	const socket = io(`http://localhost:3000`);

	let gameData: Api.EmittedRoomData = {
		players: [{ userId: data.user?.userId ?? '', userName: data.user?.profileName ?? data.user?.userName ?? data.user?.userId ?? ''}],
		gameData: {
			state: 'create',
			round: 1,
			timeLeft: 0,
			data: {},
			started: false,
			done: false,
			showCasingUser: '',
		}
	};

	let timeoutId: NodeJS.Timeout;

	const timeoutDuration = 5000;

	const resetTimeout = () => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			toast.error('Disconnected from server');
			setTimeout(() => {
				goto(`/game`);
			}, 3000);
		}, timeoutDuration);
	};

	socket.on('updateRoom', (data: Api.EmittedRoomData) => {
		gameData = data;

		resetTimeout();
	});

	socket.on('leavedRoom', (user: App.User) => {
		toast('User ' + user.userName + ' leaved the room');
	});

	socket.on('disconnect', () => {
		toast('Disconnected from server');
		setTimeout(() => {
			goto(`/game`);
		}, 3000);
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
		toast.loading('Joining room...', { duration: 5000 });
	});

	const handleVote = (vote: number) => {
		const voteData: Api.voteData = {
			roomID: data.id,
			userId: gameData.gameData.showCasingUser,
			vote
		};
		socket.emit('onSendVote', voteData);
	}

	const handleSetAnswer = (answer: string) => {
		const answerData: Api.messageData = {
			roomID: data.id,
			userId: $CurrentUser?.userId ?? '',
			userName: $CurrentUser?.userName ?? '',
			answer
		};
		socket.emit('onSendMessage', answerData);

	}

	$: isMyShowCase = gameData.gameData.showCasingUser === $CurrentUser?.userId;
</script>

<Toaster richColors />

{#if !gameData || !gameData.gameData.started}
	<Lobby {gameData} />
{:else}
	{#if gameData.gameData.state === 'showcase'}
		<Showcase isDisableVote={isMyShowCase} onVote={handleVote} gameData={gameData}/>
	{:else if gameData.gameData.state === 'create'}
		<Game onSendMessage={handleSetAnswer} {gameData} />
	{:else if gameData.gameData.state === 'winners'}
		<Winners {gameData} />
	{/if}
{/if}
