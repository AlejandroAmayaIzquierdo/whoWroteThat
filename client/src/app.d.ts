// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	interface Locals {
		user: User | undefined | null;
		authToken: string | undefined | null;
	}
	// interface PageData {}
	// interface Error {}
	// interface Platform {}

	interface User {
		userName: string;
		userId: string;
		profilePic?: string;
		profileName?: string;
	}
	interface UserInGame extends User {
		roundData: UserGameData;
	}
	interface Room {
		roomId: number;
		currentUsers: User[];
	}

	interface Message {
		message: string;
		isMine?: boolean;
	}

	interface GameData {
		[userId: string]: {
			[round: number]: UserGameData;
		}
	}

	interface UserGameData {
		score: number;
		messages: Message[];
		answer?: string;
		vote: number;
	}

	type GameState = "create" | "showcase" | "winners";
}

declare namespace Api {

	interface StandardResp {
		status: number;
		result: unknown;
		error?: string;
	}
	interface Session {
		user: App.User;
		sessionId: string;
		activePeriodExpiresAt: string;
		idlePeriodExpiresAt: string;
		state: string;
		fresh: boolean;
	}

	interface Room {
		board: string[][];
		turn: string;
		done: boolean;
		winner: string | null;
	}

	interface searchGameResult {
		roomId: string;
		currentUsers: string[];
	}

	interface SessionResult {
		user: App.User;
		sessionId: string;
		activePeriodExpiresAt: Date;
		idlePeriodExpiresAt: Date;
		state: string;
		fresh: boolean;
	}

	interface EmittedGameData {
		round: number;
		state: App.GameState;
		data: App.GameData;
		started: boolean;
		done: boolean;
		timeLeft: number;
		showCasingUser: string;
	}

	interface EmittedRoomData {
		gameData: EmittedGameData;
		players: App.User[];
		isPrivate?: boolean;
	}

	interface SearchGameBody {
		userId: string;
		lang: "es" | "en";
		private: boolean;
		userName: string;
	}

	interface JoinRoomData extends SearchGameBody {
		roomID: string;
	}

	interface messageData extends Omit<JoinRoomData,"lang" | "private">  {
		answer: string;
	}

	interface voteData extends Omit<JoinRoomData,"lang" | "private" | "userName"> {
		vote: number;
	}
}

declare namespace Strore { 
	interface ChatStore {
		
	}
}
