﻿/// <reference types="App" />
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
      };
    };
  }

  interface Message {
    isMine?: boolean;
    message: string;
  }

  interface Question {
    questionID: string;
    message: string;
  }

  interface FileSaveData {
    name: string;
    type: string;
    path: string;
    hash: string;
  }

  interface GitHubUser {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
    name: string;
    company: string | null;
    blog: string;
    location: string;
    email: string | null;
    hireable: boolean | null;
    bio: string | null;
    twitter_username: string | null;
    public_repos: number;
    public_gists: number;
    followers: number;
    following: number;
    created_at: string;
    updated_at: string;
  }
}

/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("./lucia.js").Auth;
  type DatabaseUserAttributes = {
    userName: string;
    profilePic?: string;
    profileName?: string;
    github_id?: string;
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
  type Providers = "id" | "google" | "twitch" | "github";
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
    SocketId?: string;
    profilePic?: string;
    profileName?: string;
  }

  interface Room {
    id: number;
    players: string;
    maxUsers: number;
    isActive: number;
    isEnded: number;
    startedAt: string;
    createdAt: string;
    endedAt: string;
    isPrivate: number;
  }

  interface SearchGameBody {
    userId: string;
    lang: "es" | "en";
    isPrivate: boolean;
    userName: string;
  }
  interface JoinRoomData extends SearchGameBody {
    roomId: string;
  }
  interface messageData extends Omit<JoinRoomData, "lang" | "private"> {
    answer: string;
  }

  interface voteData
    extends Omit<JoinRoomData, "lang" | "private" | "userName"> {
    vote: number;
  }

  interface EmittedGameData {
    round: number;
    state: App.GameState;
    data: App.GameData;
    started: boolean;
    done: boolean;
    timeLeft: number;
    showCasingUser: string;
    winner: string;
  }

  interface GetFileBody {
    id: string;
  }

  interface OAuth2Google {
    access_token: string;
    refresh_token: string;
    scope: string;
    token_type: string;
    id_token: string;
    expiry_date: number;
  }

  interface TwitchUser {
    id: string;
    login: string;
    display_name: string;
    type: string;
    broadcaster_type: string;
    description: string;
    profile_image_url: string;
    offline_image_url: string;
    view_count: number;
    created_at: string;
  }

  interface TwitchUserData {
    data: TwitchUser[];
  }
}
