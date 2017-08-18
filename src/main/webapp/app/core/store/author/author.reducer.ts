import { Author, initialAuthor } from './author.model';
import { actions, EntityAction } from '../entity/entity.actions';
import { SliceAction } from '../slice/slice.actions';
import { Entities, initialEntities } from '../entity/entity.model';
import * as entityFunctions from '../entity/entity.functions';
import * as sliceFunctions from '../slice/slice.functions';
import { slices } from '../util';
import { typeFor } from '../util';

export function reducer(state = initialEntities<Author>(slices.AUTHOR, actions, initialAuthor),
    action: EntityAction<Author>): Entities<Author> {
    switch (action.type) {
        case typeFor(slices.AUTHOR, actions.ADD_SUCCESS):
            return entityFunctions.addSuccess<Author>(state, <any>action);
        case typeFor(slices.AUTHOR, actions.ADD_TEMP):
        case typeFor(slices.AUTHOR, actions.LOAD_SUCCESS):
            return entityFunctions.addToStore<Author>(state, <any>action);
        case typeFor(slices.AUTHOR, actions.PATCH_EACH):
            return entityFunctions.patchEach<Author>(state, <any>action);
        case typeFor(slices.AUTHOR, actions.UPDATE):
            if (action instanceof SliceAction) {
                return sliceFunctions.update(state, action);
            } else {
                return entityFunctions.update<Author>(state, <any>action);
            }
        default: {
            return state;
        }
    }
}

export const getEntities = (state: Entities<Author>) => state.entities;

export const getIds = (state: Entities<Author>) => state.ids;
