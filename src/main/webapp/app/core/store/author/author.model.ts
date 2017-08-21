import { Rebuttal } from '../rebuttal/rebuttal.model';

export interface Author {
    // data
    id: string;
    bio: string;
    followers: Author[]
};

export const initialAuthor: Author = {
    id: null,
    bio: null,
    followers: []
};
