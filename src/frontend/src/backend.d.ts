import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface VideoClue {
    id: bigint;
    owner: Principal;
    videoBlob: ExternalBlob;
    timestamp: bigint;
}
export interface ImageClue {
    id: bigint;
    imageBlob: ExternalBlob;
    owner: Principal;
    timestamp: bigint;
}
export interface AudioClue {
    id: bigint;
    owner: Principal;
    audioBlob: ExternalBlob;
    timestamp: bigint;
}
export interface Answer {
    id: bigint;
    owner: Principal;
    timestamp: bigint;
    answerText: string;
    imageClueIds: Array<bigint>;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    generateAnswer(imageClueIds: Array<bigint>, answerText: string): Promise<bigint>;
    getAnswer(answerId: bigint): Promise<Answer | null>;
    getAudioClue(clueId: bigint): Promise<AudioClue | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getImageClue(clueId: bigint): Promise<ImageClue | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVideoClue(clueId: bigint): Promise<VideoClue | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    uploadAudioClue(audioBlob: ExternalBlob): Promise<bigint>;
    uploadImageClue(imageBlob: ExternalBlob): Promise<bigint>;
    uploadVideoClue(videoBlob: ExternalBlob): Promise<bigint>;
}
