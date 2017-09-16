import { createSelector } from 'reselect';

import { Profile, initialProfile } from './profile.model';
import { Entities, initialEntities } from '../entity/entity.model';
import { slices } from '../util';
import * as entityFunctions from '../entity/entity.functions';
import { typeFor, completeAssign } from '../util';
import { actions, EntityAction } from '../entity/entity.actions';

export function reducer(state: Entities<Profile> = initialEntities<Profile>(slices.PROFILE, initialProfile),
    action: EntityAction<Profile>): Entities<Profile> {

    switch (action.type) {
        case typeFor(slices.ARTICLE, actions.LOAD_SUCCESS):
            const entities = completeAssign({}, state.entities);
            const newProfile = completeAssign({}, initialProfile, action.payload.author);
            entities[newProfile.id] = newProfile;
            const newState = completeAssign({}, state, {
                ids: Object.keys(entities),
                entities,
                selectedEntityId: newProfile.id
            });
            return newState;
        default:
            return state;
    }
};

export const getEntities = (state: Entities<Profile>) => state.entities;

export const getIds = (state: Entities<Profile>) => state.ids.filter((id) => !state.entities[id].deleteMe);
