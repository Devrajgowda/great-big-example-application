import { Action } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { SliceAction } from './slice.actions';
import { typeFor } from '../util';
import { actions } from './slice.actions';
import * as ActionClasses from './slice.actions';
import { PayloadAction } from '../util';

const merge = require('lodash/merge');

export function load(state: {}, action: SliceAction): any {
    let newState = merge({}, state, {
        hasError: false
    });
    return setSliceLoading(newState, action);
};

export function loadFail(state, action: SliceAction): any {
    let newState = merge({}, state, {
        hasError: true,
    });
    return setSliceLoading(newState, action);
}

export function loadSuccess(state, action): any {
    let newState = merge({}, state, action.payload, {
        hasError: false,
    });
    return setSliceLoading(newState, action);
}

export function update(state: any, action: SliceAction): any {
    return patch({}, action);
}

export function patch(state: any, action: SliceAction): any {
    const obj = [state];
    const path = action.payload.path;
    const val = action.payload.val;

    if (!path || !path.length) {
        return merge({}, state, evaluate(val, state));
    }

    let i = 0;
    for (i = 0; i < path.length - 1; i++) {
        obj[i + 1] = obj[i][path[i]];
    }
    let result = {};
    let start = 0;

    if ((typeof val === 'object') && (val !== null)) {
        result = val;
        start = path.length;

    } else {
        result[path[path.length - 1]] = evaluate(val, state);
        start = path.length - 1;
    }

    let mutation = {};
    for (i = start; i > 0; i--) {
        mutation = merge({}, obj[i], result);
        result = {};
        result[path[i - 1]] = mutation;
    }

    return merge({}, state, result);
}

function evaluate(val, state) {
    if (typeof val === 'function') {
        return val(state);
    }

    return val;
}

export function setSliceLoading(state, action) {
    let newState = state;
    if (isLoadingAction(action.verb)) {
        newState = { ...state, loading: true };
    } else if (isPostLoadingAction(action.verb)) {
        newState = { ...state, loading: false, loaded: (action.verb === actions.LOAD_SUCCESS) };
    }
    return newState;

}

function isLoadingAction(verb: string) {
    switch (verb) {
        case actions.LOAD:
            return true;
        default:
            return false;
    }
}

function isPostLoadingAction(verb: string) {
    switch (verb) {
        case actions.LOAD_FAIL:
        case actions.LOAD_SUCCESS:
            return true;
        default:
            return false;
    }
}

/**
 * Effects
 */
export function loadFromRemote$(actions$: Actions, slice: string, dataService, dataGetter: string): Observable<Action> {
    return actions$
        .ofType(typeFor(slice, actions.LOAD))
        .switchMap((action: PayloadAction) =>
            dataService[dataGetter](action.payload)
                .map((responseSlice: any) =>
                    new ActionClasses.LoadSuccess(slice, responseSlice))
                .catch((error) => of(new ActionClasses.LoadFail(slice, error)))
        );
}

export function postToRemote$(actions$: Actions, slice: string, dataService, triggerAction: string, successAction: SliceAction, errorAction: SliceAction, responseTransform: Function = ((resp) => resp)): Observable<Action> {
    return httpToRemote$('post', actions$, slice, dataService, triggerAction, successAction, errorAction, responseTransform);
}

export function deleteFromRemote$(actions$: Actions, slice: string, dataService, triggerAction: string, successAction: SliceAction, errorAction: SliceAction, responseTransform: Function = ((resp) => resp)): Observable<Action> {
    return httpToRemote$('delete', actions$, slice, dataService, triggerAction, successAction, errorAction, responseTransform);
}

export function getFromRemote$(actions$: Actions, slice: string, dataService, triggerAction: string, successAction: SliceAction, errorAction: SliceAction, responseTransform: Function = ((resp) => resp)): Observable<Action> {
    return httpToRemote$('get', actions$, slice, dataService, triggerAction, successAction, errorAction, responseTransform);
}

function httpToRemote$(method: string, actions$: Actions, slice: string, dataService, triggerAction: string, successAction: SliceAction, errorAction: SliceAction, responseTransform: Function = ((resp) => resp)): Observable<Action> {
    return actions$
        .ofType(typeFor(slice, triggerAction))
        .switchMap((action: PayloadAction) =>
            dataService[method](action.payload.route, action.payload.requestObject || {})
                .map(responseTransform)
                .map((responseSlice: any) => {
                    successAction.payload = responseSlice;
                    return successAction;
                })
                .catch((error) => {
                    errorAction.payload = error;
                    of(errorAction)
                })
        );
}
