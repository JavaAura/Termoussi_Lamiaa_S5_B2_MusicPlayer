export interface Track {
    id: number;
    title: string;
    artist: string;
    description?: string;
    duration: number;
    category: MusicCategory;
    addedDate: Date;
    coverUrl: String;
    audioFile?: Blob;
}

export enum MusicCategory {
    POP = 'pop',
    ROCK = 'rock',
    RAP = 'rap',
    FLAMENCO = 'flamenco',
    OTHER = 'other',
}