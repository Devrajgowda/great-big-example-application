import { Action } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { Params, ActivatedRouteSnapshot } from '@angular/router';
import { ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { RootState } from './';

/**
 * This function coerces a string into a string literal type.
 * Using tagged union types in TypeScript 2.0, this enables
 * powerful typechecking of our reducers.
 *
 * Since every action label passes through this function it
 * is a good place to ensure all of our action labels
 * are unique.
 */

const typeCache: { [label: string]: boolean } = {};

export function type<T>(label: T | ''): T {
    if (typeCache[<string>label]) {
        throw new Error(`Action type "${label}" is not unique"`);
    }

    typeCache[<string>label] = true;

    return <T>label;
}

const typeForCache: { [slice: string]: { [action: string]: string } } = {};

export function typeFor(slice: string, action: string) {
    if (typeForCache[slice] && typeForCache[slice][action]) {
        return typeForCache[slice][action];
    } else {
        typeForCache[slice] = typeForCache[slice] || {};
        typeForCache[slice][action] = `[${slice}] ${action}`;
        type(typeForCache[slice][action]);
        return typeForCache[slice][action];
    }
}

export const slices = {
    ARTICLE: 'article',
    AUTHOR: 'author',
    BOOK: 'book',
    CRISIS: 'crisis',
    CLAIM: 'claim',
    CLAIM_REBUTTAL: 'claimRebuttal',
    COLLECTION: 'collection',
    COMMENT: 'comment',
    CONTACT: 'contact',
    COUNTER: 'counter',
    HERO: 'hero',
    LAYOUT: 'layout',
    MESSAGE: 'message',
    NOTE: 'note',
    PROFILE: 'profile',
    REBUTTAL: 'rebuttal',
    SEARCH: 'search',
    SESSION: 'session',
    TAG_LIST: 'tagList',
    TALK: 'talk'
};

export class PayloadAction implements Action {
    public type: string;

    constructor(public payload?: any) {
    }
}

export type PayloadActions = Actions<PayloadAction>;

/**
 * @whatItDoes Use this function to do something in response to routing to a specific route
 *
 * @param segment The url part to watch for
 * @param callback The function to execute after routing to segment
 */
export function handleNavigation(store: Store<RootState>, actions$: Actions, segment: (Action) => ActivatedRouteSnapshot, segmentValue: string, callback: (a: ActivatedRouteSnapshot, state: RootState) => Observable<any>) {
    const nav = actions$.ofType(ROUTER_NAVIGATION)
        .map(segment)
        .filter((s) => s.routeConfig.path === segmentValue);

    return nav.withLatestFrom(store).switchMap((a) => callback(a[0], a[1])).catch((e) => {
        console.log('Network error', e);
        return of();
    });
}

/**
 * This returns a route configuration of the second part of the route.
 * /features/talks       => talks
 * /features/talks/:id   => talks/:id
 * @param r
 */
export function secondSegment(r: RouterNavigationAction): ActivatedRouteSnapshot {    // TODO: figure out what type should go here
    return (<any>r.payload.routerState).root.firstChild.firstChild;
}
