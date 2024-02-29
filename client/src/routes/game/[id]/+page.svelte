<script lang="ts">
	import { io } from 'socket.io-client';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import Game from '$lib/components/Game/Game.svelte';
	import Lobby from '$lib/components/Game/Lobby/Lobby.svelte';
	import { goto } from '$app/navigation';
	import { CurrentUser } from '$lib/stores/user';
	import Winners from '$lib/components/Game/Winners.svelte';
	import Showcase from '$lib/components/Game/ShowCase/Showcase.svelte';
	import { Toaster, toast } from 'svelte-sonner';

	export let data: PageData;

	// const socket = io(`http://localhost:3000`);

	const currentUser = data.user ?? $CurrentUser;

	let gameData: Api.EmittedRoomData = {
		players: [
			{
				userId: 'test',
				userName: 'nova',
				profileName: 'nova',
				profilePic:
					'https://static-cdn.jtvnw.net/jtv_user_pictures/d4a7ed37-4b38-486e-8845-4b1fb4d5f49c-profile_image-300x300.jpeg'
			},
			{
				userId: 'test2',
				userName: 'nova2',
				profileName: 'nova2',
			}
		],
		gameData: {
			state: 'showcase',
			round: 1,
			timeLeft: 0,
			data: {
				"test": {
					1: {
						messages: [
							{
								message: 'What is the capital of France?',
								isMine: false
							}
						],
						answer: 'Paris',
						score: 5,
						vote: 0,
					}
				},
				"test2": {
					1: {
						messages: [
							{
								message: 'What is the capital of France?',
								isMine: false
							}
						],
						answer: 'Paris',
						score: 10,
						vote: 0,
					}
				}
			},
			started: true,
			done: false,
			showCasingUser: 'general'
		}
	};

	// let timeoutId: NodeJS.Timeout;

	// const timeoutDuration = 5000;

	// const resetTimeout = () => {
	// 	clearTimeout(timeoutId);
	// 	timeoutId = setTimeout(() => {
	// 		toast.error('Disconnected from server');
	// 		setTimeout(() => {
	// 			goto(`/game`);
	// 		}, 3000);
	// 	}, timeoutDuration);
	// };

	// socket.on('updateRoom', (data: Api.EmittedRoomData) => {
	// 	gameData = data;

	// 	resetTimeout();
	// });

	// socket.on('leavedRoom', (user: App.User) => {
	// 	toast('User ' + user.userName + ' leaved the room');
	// });

	// socket.on('disconnect', () => {
	// 	toast('Disconnected from server');
	// 	setTimeout(() => {
	// 		goto(`/game`);
	// 	}, 3000);
	// });

	// onMount(() => {
	// 	console.log('Current user',currentUser);
	// 	if(!currentUser || currentUser === null || currentUser === undefined || currentUser?.userId === '' || currentUser?.userId === undefined || currentUser?.userId === null) {
	// 		goto(`/game`); //TODO when is not logged save session data on cookies.
	// 		return;
	// 	}

	// 	const joinRoomData = {
	// 		lang: 'es',
	// 		roomId: data.id,
	// 		userId: currentUser?.userId,
	// 		userName: currentUser?.profileName ?? currentUser?.userName ?? currentUser?.userId ?? '',
	// 		private: true
	// 	} as unknown as Api.JoinRoomData;

	// 	console.log(joinRoomData);
	// 	socket.emit('joinRoom', joinRoomData);
	// 	toast.loading('Joining room...', { duration: 5000 });
	// });

	// const handleVote = (vote: number) => {
	// 	const voteData: Api.voteData = {
	// 		roomID: data.id,
	// 		userId: gameData.gameData.showCasingUser,
	// 		vote
	// 	};
	// 	socket.emit('onSendVote', voteData);
	// }

	// const handleSetAnswer = (answer: string) => {
	// 	const answerData: Api.messageData = {
	// 		roomID: data.id,
	// 		userId: currentUser?.userId ?? '',
	// 		userName: currentUser?.userName ?? '',
	// 		answer
	// 	};
	// 	socket.emit('onSendMessage', answerData);

	// }

	$: isMyShowCase = gameData.gameData.showCasingUser === 'test';
</script>

<Toaster richColors />
<Showcase isDisableVote={isMyShowCase} onVote={console.log} {gameData} />

