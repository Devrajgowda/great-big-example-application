import { createSelector } from 'reselect';

import { Article, initialArticle } from './article.model';
import { Entities, initialEntities } from '../entity/entity.model';
import { slices } from '../util';
import * as entityFunctions from '../entity/entity.functions';
import * as sliceFunctions from '../slice/slice.functions';
import { typeFor } from '../util';
import { EntityAction } from '../entity/entity.actions';
import * as EntityActions from '../entity/entity.actions';
import * as ArticleActions from '../article/article.actions';
import { actions } from '../article/article.actions';

export function reducer(state: Entities<Article> = initialEntities<Article>(slices.ARTICLE, initialArticle),
    action: EntityAction<Article>): Entities<Article> {

    switch (action.type) {
        case typeFor(slices.ARTICLE, actions.ADD_TEMP):
        case typeFor(slices.ARTICLE, actions.LOAD_SUCCESS):
            return entityFunctions.addToStore<Article>(state, <any>action);
        case typeFor(slices.ARTICLE, actions.ADD_COMMENT):  // this is here to set loading=true
            return entityFunctions.update(state, <any>action);
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
