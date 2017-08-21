import { createSelector } from 'reselect';

import { Comment, initialComment } from './comment.model';
import { Entities, initialEntities } from '../entity/entity.model';
import { slices } from '../util';
import * as functions from '../entity/entity.functions';
import { typeFor } from '../util';
import { actions, EntityAction } from '../entity/entity.actions';

export function reducer(state: Entities<Comment> = initialEntities<Comment>(slices.COMMENT, initialComment),
    action: EntityAction<Comment>): Entities<Comment> {

    switch (action.type) {
        case typeFor(slices.COMMENT, actions.ADD_SUCCESS):
            return functions.addSuccess<Comment>(state, <any>action);
        case typeFor(slices.COMMENT, actions.ADD_TEMP):
        case typeFor(slices.COMMENT, actions.LOAD_SUCCESS):
            return functions.addToStore<Comment>(state, <any>action);
        case typeFor(slices.COMMENT, actions.UPDATE):
        case typeFor(slices.COMMENT, actions.UPDATE_SUCCESS):
            return functions.update<Comment>(state, <any>action);
        case typeFor(slices.COMMENT, actions.DELETE):
            return functions.deleteEntity<Comment>(state, <any>action);
        case typeFor(slices.COMMENT, actions.DELETE_TEMP):
            return functions.deleteTemp<Comment>(state, <any>action);
        case typeFor(slices.COMMENT, actions.SELECT):
            return functions.select<Comment>(state, <any>action);
        case typeFor(slices.COMMENT, actions.SELECT_NEXT):
            return functions.selectNext<Comment>(state, <any>action);
        default:
            return state;
    }
};

export const getEntities = (state: Entities<Comment>) => state.entities;

export const getIds = (state: Entities<Comment>) => state.ids;

export const getSelectedId = (state: Entities<Comment>) => state.selectedEntityId;

export const getSelected = createSelector(getEntities, getSelectedId, (entities, selectedId) => {
    return entities[selectedId];
});
