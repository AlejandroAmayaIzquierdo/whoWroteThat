
/// <reference types="App" />
declare namespace App {
	interface StandarFact {
		id: number;
		category: categories;
		fact: string;
	}
	
	type categories = "cats" | "dogs";

	interface CronTask {
		handle();
	}

	interface DbCron {
		id: number;
		name: string;
		schedule: string;
		is_active: number;
		lastEnd: string | null;
	}
	type GameState = "create" | "showcase" | "winners";

	interface GameData {
		[userId: string]: {
			[round: number]: {
				messages: Message[];
				answer?: string;
				vote: number;
			}
		}
	}

	interface Message {
		isMine?: boolean;
		message: string;
	}

	interface Question {
		questionID: string;
		message: string;
	}
}


/// <reference types="lucia" />
declare namespace Lucia {
	type Auth = import("./lucia.js").Auth;
	type DatabaseUserAttributes = {
		userName: string;
	};
	type DatabaseSessionAttributes = {};

	interface User {
		userId: string;
		providerId: string;
		providerUserId: string;
		passwordDefined: boolean;
	}
	interface Session {
		user: User;
		sessionId: string;
        activePeriodExpiresAt: string;
        idlePeriodExpiresAt: string;
        state: string;
        fresh: boolean;
	}
	type Providers = "id";
}

/// <reference types="Api" />
declare namespace Api {
	interface Response {
		status: number;
		error?: string | number | object | boolean | unknown;
		result?: string | number | object | boolean | unknown;
	}
	interface RegisterUserBody {
		userName: string;
		password: string;
	}
	interface Error {
		code: number;
		message: string;
	}

	interface User {
		userName: string;
		userId: string;
	}

	interface Room {
		id: number;
		players: string;
		maxUsers: number;
		isActive: number;
		isEnded: number;
		endedAt: string;
	}

	interface SearchGameBody {
		userId: string;
		lang: "es" | "en";
		private: boolean;
		userName: string;
	}
	interface JoinRoomData extends SearchGameBody {
		roomId: number;
	}
	interface messageData extends JoinRoomData {
		question: App.Question;
		answer: string;
	}
	
	interface EmittedGameData {
		round: number;
		state: App.GameState;
		data: App.GameData;
		started: boolean;
		done: boolean;
		timeLeft: number;
	}
}
  