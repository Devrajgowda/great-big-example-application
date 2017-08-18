import { createSelector } from 'reselect';

import { Article, initialArticle } from './article.model';
import { Entities, initialEntities } from '../entity/entity.model';
import { slices } from '../util';
import * as functions from '../entity/entity.functions';
import { typeFor } from '../util';
import { actions, EntityAction } from '../entity/entity.actions';
import * as EntityActions from '../entity/entity.actions';
import * as ArticleActions from '../article/article.actions';

export function reducer(state: Entities<Article> = initialEntities<Article>(slices.ARTICLE, actions, initialArticle),
    action: EntityAction<Article>): Entities<Article> {

    switch (action.type) {
        case typeFor(slices.ARTICLE, actions.ADD_TEMP):
        case typeFor(slices.ARTICLE, actions.LOAD_SUCCESS):
            return functions.addToStore<Article>(state, <any>action);
        // case typeFor(slices.ARTICLE, ArticleActions.actions.FAVORITE_SUCCESS):
        // case typeFor(slices.ARTICLE, ArticleActions.actions.FAVORITE_FAIL):

        // if (favorited) {
        //     this.article.favoritesCount++;
        // } else {
        //     this.article.favoritesCount--;
        // }
        // case typeFor(slices.ARTICLE, ArticleActions.actions.FOLLOW_SUCCESS):

        // this.article.author.following = following;
        // case typeFor(slices.ARTICLE, ArticleActions.actions.FOLLOW_FAIL):
        default:
            return state;
    }
};

export const getEntities = (state: Entities<Article>): { [id: string]: Article } => state.entities;

export const getIds = (state: Entities<Article>): string[] => state.ids;

export const getSelectedId = (state: Entities<Article>): string => state.selectedEntityId;

export const getSelected = createSelector(getEntities, getSelectedId, (entities, selectedId) => {
    return entities[selectedId];
});

export const getTemp = createSelector(getEntities, getSelectedId, (entities, selectedId) => {
    return entities[EntityActions.TEMP]
});
