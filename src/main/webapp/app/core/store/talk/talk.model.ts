export interface Talk {
    id: string,
    title: string,
    speaker: string,
    description: string,
    yourRating: number,
    rating: number,
    deleteMe?: boolean
}

export const initialTalk: Talk = {
    id: null,
    title: null,
    speaker: null,
    description: null,
    yourRating: null,
    rating: 0
};
