import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { empty } from 'rxjs/observable/empty';
import { toPayload, Actions } from '@ngrx/effects';
import { async } from 'rxjs/scheduler/async';
import { Action, Store } from '@ngrx/store';

import { Entities, Entity } from './entity.model';
import { typeFor, PayloadAction, PayloadActions, completeAssign } from '../util';
import { actions, EntityAction } from './entity.actions';
import * as EntityActions from './entity.actions';
import * as sliceFunctions from '../slice/slice.functions';
import { RootState } from '../';
import { DataService } from '../../services/data.service';

export function addEntityToStore<T extends Entity>(state: Entities<T>, action: EntityActions.Add<T> | EntityActions.Load<T>): Entities<T> {
    const entities = completeAssign({}, state.entities);
    const newEntity = reduceOne(state, null, action);       // this is like this because id could be an
    entities[newEntity.id] = newEntity;                     // accessor rather than a regular field
    const newState = completeAssign({}, state, {
        ids: Object.keys(entities),
        entities,
        selectedEntityId: action.payload.id
    });
    return sliceFunctions.setSliceLoading(newState, action);
};

/**
 * @whatItDoes updates a given slice with a whole new set of entities in one fell swoop
 *
 * @param state  the set of entities
 * @param action needs a payload that is an array of entities
 */
export function addEntitiesToStore<T extends Entity>(state: Entities<T>, action: EntityActions.Update<T>): Entities<T> {
    const entities = action.payload.reduce(function(map, obj) {
        map[obj.id] = completeAssign({}, state.initialEntity, obj, { dirty: false });
        return map;
    }, {});
    return completeAssign({}, state, {
        ids: Object.keys(entities),
        entities
    });
};

/**
 * Called after response from an add request returns from the server
 */
// export function addSuccess<T extends Entity>(state: Entities<T>, action: EntityActions.AddTemp<T>): Entities<T> {
//     const entities = completeAssign({}, state.entities);
//     entities[action.payload.id] = reduceOne(state, null, action);
//     let newState = completeAssign({}, state, {
//         ids: Object.keys(entities),
//         entities,
//         selectedEntityId: action.payload.id
//     });
//     return sliceFunctions.setSliceLoading(newState, action);
// };
/*
 * Delete the property from state.entities, the element from state.ids and
 * if the one being deleted is the selectedEntity, then select a different one.
 *
 * Only delete pessimistically
 */
export function deleteEntity<T extends Entity>(state: Entities<T>, action: EntityActions.Delete<T> | EntityActions.DeleteTemp<T>): Entities<T> {
    const entities = completeAssign({}, state.entities);

    const id = action.payload.id;

    delete entities[id];
    const idx = state.ids.indexOf(id);
    const lastIdx = state.ids.length > 1 ? state.ids.length - 2 : null
    const newIdx = idx > 0 ? idx - 1 : lastIdx;
    const selectedEntityId = idx === -1 ? state.selectedEntityId : state.ids[newIdx];
    const i = state.ids.findIndex((findId) => findId === id);
    const ids = [...state.ids.slice(0, i), ...state.ids.slice(i + 1)];
    const newState = completeAssign({}, state, { entities, ids, selectedEntityId });
    return sliceFunctions.setSliceLoading(newState, action);
};

/**
 * Called from OnDestroy hooks to remove unsaved records with TEMP ID
 */
export function deleteTemp<T extends Entity>(state: Entities<T>, action: EntityActions.DeleteTemp<T>): Entities<T> {
    let newState = state;
    const entities = completeAssign({}, state.entities);
    if (entities[action.payload.id]) {
        newState = deleteEntity<T>(state, action);
    }
    return newState;
}

export function select<T extends Entity>(state: Entities<T>, action: EntityActions.Select<T>): Entities<T> {
    return completeAssign({}, state, {
        selectedEntityId: action.payload.id || action.payload
    });
};

export function selectNext<T extends Entity>(state: Entities<T>, action: EntityActions.SelectNext<T>): Entities<T> {
    let ix = 1 + state.ids.indexOf(state.selectedEntityId);
    if (ix >= state.ids.length) { ix = 0; }
    return completeAssign({}, state, { selectedEntityId: state.ids[ix] });
};

export function unload<T extends Entity>(state: Entities<T>, action: EntityActions.Select<T>): Entities<T> {
    return completeAssign({}, state, { entities: {}, ids: [], selectedEntityId: null, loaded: false });
};

/**
 * Add entities in the action's payload into the state if they are not yet there
 *
 * @param state
 * @param action
 */
export function union<T extends Entity>(state: Entities<T>, action: EntityActions.LoadSuccess<T>) {
    const entities = action.payload;
    let newEntities = entities.filter((entity) => !state.entities[entity.id]);

    const newEntityIds = newEntities.map((entity) => entity.id);
    newEntities = newEntities.reduce((ents: { [id: string]: T }, entity: T) => {
        return completeAssign(ents, {
            [entity.id]: entity
        });
    }, {});

    return completeAssign({}, state, {
        ids: [...state.ids, ...newEntityIds],
        entities: completeAssign({}, state.entities, newEntities),
        selectedEntityId: state.selectedEntityId
    });
}

/**
 * @whatItDoes updates, patches, sets loading or sets deleteMe of a single entity
 *
 * @param state  the set of entities
 * @param action needs a payload that has an id
 */
export function update<T extends Entity>(state: Entities<T>, action: EntityActions.Update<T>): Entities<T> {
    const entities = completeAssign({}, state.entities);
    const id = action.payload.id;
    entities[id] = reduceOne(state, entities[id], action);

    // const newEntity = reduceOne(state, null, action);       // this is like this because id could be an
    // entities[newEntity.id] = newEntity;                     // accessor rather than a regular field
    return completeAssign({}, state, {
        ids: Object.keys(entities),
        entities
    });
};

export function patchEach<T extends Entity>(state: Entities<T>, action: any): Entities<T> {
    const entities = completeAssign({}, state.entities);
    for (const id of Object.keys(entities)) {
        entities[id] = completeAssign(entities[id], action.payload);
    }
    return completeAssign({}, state, {
        entities
    });
};

function reduceOne<T extends Entity>(state: Entities<T>, entity: T = null, action: EntityAction<T>): T {
    // console.log('reduceOne entity:' + JSON.stringify(entity) + ' ' + action.type)
    let newState;
    switch (action.type) {

        case typeFor(state.slice, actions.ADD_TEMP):
        case typeFor(state.slice, actions.ADD_OPTIMISTICALLY):
            newState = completeAssign({}, state.initialEntity, action.payload, { dirty: true });
            break;
        case typeFor(state.slice, actions.DELETE):
            newState = completeAssign({}, entity, action.payload, { deleteMe: true });
            break;
        case typeFor(state.slice, actions.DELETE_FAIL):
            newState = completeAssign({}, entity, action.payload, { deleteMe: false });
            break;
        case typeFor(state.slice, actions.UPDATE):
        case typeFor(state.slice, actions.PATCH):
            newState = completeAssign({}, entity, action.payload, { dirty: true });
            break;
        case typeFor(state.slice, actions.ADD_SUCCESS):
            // entity could be a client-side-created object with client-side state not returned by
            // the server. If so, preserve this state by having entity as part of this
            newState = completeAssign({}, state.initialEntity, entity, action.payload, { dirty: false });
            break;
        case typeFor(state.slice, actions.LOAD_SUCCESS):
            newState = completeAssign({}, state.initialEntity, action.payload, { dirty: false }); // maybe remove initialEntity. it is merged in the effect
            break;
        case typeFor(state.slice, actions.UPDATE_SUCCESS):
            newState = completeAssign({}, entity, action.payload, { dirty: false });
            break;
        default:
            newState = entity;
    }
    return newState;
    // return setEntityLoading(newState, action);
};

// function setEntityLoading(state, action) {
//     let newState = state;
//     if (isLoadingAction(action.verb)) {
//         newState = { ...state, loading: true };
//     } else if (isPostLoadingAction(action.verb)) {
//         newState = { ...state, loading: false };
//     }
//     return newState;

// }

// function isLoadingAction(verb: string) {
//     switch (verb) {
//         case actions.ADD:
//         case actions.LOAD:
//         case 'ADD_COMMENT':  // TODO: create an ADD_CHILD action verb to handle this
//             return true;
//         default:
//             return false;
//     }
// }

// function isPostLoadingAction(verb: string) {
//     switch (verb) {
//         case actions.ADD_SUCCESS:
//         case actions.ADD_UPDATE_FAIL:
//         case actions.DELETE_FAIL:
//         case actions.DELETE_SUCCESS:
//             return true;
//         default:
//             return false;
//     }
// }

/**
 *
 * Effects
 *
 */

export function loadFromRemote$(actions$: PayloadActions, slice: keyof RootState, dataService: DataService, store: Store<RootState>, initialEntity: Entity, debounce = 0, scheduler?): Observable<Action> {  // TODO: should return PayloadAction
    return actions$
        .ofType(typeFor(slice, actions.LOAD), typeFor(slice, actions.LOAD_ALL_SUCCESS))
        .debounceTime(debounce, this.scheduler || async)
        .withLatestFrom(store)
        .switchMap(([action, state]) => {
            // First this happens
            // for actions.LOAD - dispatch a LoadAllSuccess
            if (action.type === typeFor(slice, actions.LOAD)) {
                if (action.payload && action.payload.query === '') {
                    return empty();
                }

                const nextSearch$ = actions$.ofType(typeFor(slice, actions.LOAD)).skip(1);

                return dataService.getEntities(slice, action.payload ? action.payload.query : undefined, state)
                    .takeUntil(nextSearch$)
                    .mergeMap((responseEntities) => Observable.of(new EntityActions.LoadAllSuccess(slice, responseEntities)))
                    .catch((err) => {
                        console.log(err);
                        return Observable.of(new EntityActions.LoadAllFail(slice, null));
                    });
            }

            // Then this happens
            // for actions.LOAD_ALL_SUCCESS - dispatch a LoadSuccess for each entity returned
            else {
                return Observable.from(action.payload)
                    .map((responseEntity) => new EntityActions.LoadSuccess(slice, completeAssign({}, initialEntity, responseEntity)))  // one action per entity
            }

        }
        );
}

export function addToRemote$(actions$: Actions, slice: keyof RootState, dataService: DataService, store: Store<RootState>, initialEntity: Entity): Observable<Action> {
    return actions$
        .ofType(typeFor(slice, actions.ADD), typeFor(slice, actions.ADD_OPTIMISTICALLY))
        .withLatestFrom(store)
        .switchMap(([action, state]) =>
            dataService.add(slice, (<any>action).payloadForPost(), state, store)  // TODO: find better way
                .map((responseEntity: Entity) => new EntityActions.AddSuccess(slice, completeAssign({}, initialEntity, responseEntity)))
                .catch((err) => {
                    console.log(err);
                    return Observable.of(new EntityActions.AddUpdateFail(slice, null));
                })
        );
}

/**
 * @whatItDoes This function creates a subscription to UPDATE and PATCH actions for a given entity type and calls the dataservice to send the
 * update to the server
 *
 * @param actions$
 * @param slice
 * @param dataService
 * @param store
 */
export function updateToRemote$(actions$: Actions, slice: keyof RootState, dataService: DataService, store: Store<RootState>, initialEntity: Entity): Observable<Action> {
    return actions$
        .ofType(typeFor(slice, actions.UPDATE), typeFor(slice, actions.PATCH))
        .withLatestFrom(store)
        .switchMap(([action, state]) =>
            dataService.update(slice, (<EntityAction<any>>action).payload, state, store))
        .map((responseEntity: Entity) => new EntityActions.UpdateSuccess(slice, completeAssign({}, initialEntity, responseEntity)));
}

export function deleteFromRemote$(actions$: Actions, slice: keyof RootState, dataService: DataService, store: Store<RootState>): Observable<EntityAction<any>> {  // TODO: fix this any
    return actions$
        .ofType(typeFor(slice, actions.DELETE))
        .withLatestFrom(store)
        .switchMap(([action, state]) => dataService.remove(slice, (<EntityAction<any>>action).payload, state, store))
        .map((responseEntity: Entity) => new EntityActions.DeleteSuccess(slice, responseEntity))
        .catch((err) => {
            console.log(err);
            return Observable.of(new EntityActions.DeleteFail(slice, err));
        })
}

export function select$(actions$: Actions, slice: keyof RootState, dataService: DataService, store: Store<RootState>, initialEntity: Entity): Observable<EntityAction<any>> {  // TODO: fix this any
    return actions$
        .ofType(typeFor(slice, actions.SELECT))
        .withLatestFrom(store)
        .filter(([action, state]) => {
            return !state[slice].entities[(<EntityAction<any>>action).payload.id];
        })
        .switchMap(([action, state]) => {
            return dataService.getEntity(slice, (<EntityAction<any>>action).payload.id, state, store)
                .map((responseEntity) => {    //('articles/' + slug)
                    // const payload = { ...initialEntity };
                    const payload = completeAssign({}, initialEntity, responseEntity)
                    return new EntityActions.LoadSuccess(slice, payload);
                });
        });
}

//  Load if not loaded
//
// @Effect()
// load$: Observable<Action> = this.actions$
//     .ofType( actions.LOAD )
//     .map( toPayload )
//     .withLatestFrom( this.store.select( fromRoot.getEssentialItems ) )
//     // filter on whether it is already loaded or loading
//     .filter( this.shouldLoadItem )
//     .mergeMap( ( [payload, items] ) => {
//         const loadBegunAction = Observable.of( new actions.LoadBegunAction(  payload ) );
//         const loadedAction = this.itemsService.getEssentialItem( payload.item )
//             .map( successPayload => new actions.LoadSuccessAction( successPayload ) );
//         return Observable.merge( loadBegunAction, loadedAction );
//     } );

// shouldLoadItem( [ payload, items ] ) {
//     const item = _.get( items, [payload.item.type, payload.item.id] );
//     return !_.get( item, 'loaded' ) && ! _.get( item, 'loading' );
// }
