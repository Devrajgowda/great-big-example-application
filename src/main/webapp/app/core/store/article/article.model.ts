import { Profile } from '../profile/profile.model';
import { Entity } from '../entity/entity.model';

export interface Article extends Entity {
    slug: string;
    title: string;
    description: string;
    body: string;
    tagList: Array<string>;
    createdAt: string;
    updatedAt: string;
    favorited: boolean;
    favoritesCount: number;
    author: Profile;
}

export const initialArticle = {
    slug: '',
    title: '',
    description: '',
    body: '',
    tagList: [],
    createdAt: '',
    updatedAt: '',
    favorited: false,
    favoritesCount: 0,
    author: null,
    get id() {
        return this.slug;
    },
    set id(slug: string) {
        this.slug = slug;
    }
};
