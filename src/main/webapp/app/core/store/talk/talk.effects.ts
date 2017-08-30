import { RouterAction, ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store';
import { Params, ActivatedRouteSnapshot } from '@angular/router';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { of } from 'rxjs/observable/of';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';

import { WatchService } from '../../../features/talks/services/watch.service';
import { Filters } from '../../../features/talks/talks.layout';
import { RESTService } from '../../services/rest.service';
import { Talk } from './talk.model';
import { RootState } from '../';
import { slices, PayloadAction, handleNavigation } from '../util';
import * as EntityActions from '../entity/entity.actions';
import { typeFor } from '../util';
import { actions } from '../entity/entity.actions';

@Injectable()
export class TalkEffects {
    @Effect()
    navigateToTalks$ = handleNavigation(this.store, this.actions$, '/features/talks', (r: ActivatedRouteSnapshot) => {
        const filters = createFilters(r.params);
        return this.dataService.getEntities(slices.TALK, { speaker: filters.speaker, title: filters.title, minRating: '' + filters.minRating })
            .map((fetchedEntities) => new EntityActions.LoadAllSuccess(slices.TALK, fetchedEntities));
    });

    @Effect()
    navigateToTalk$ = handleNavigation(this.store, this.actions$, '/features/talks/talk/:id', (r: ActivatedRouteSnapshot, state: RootState) => {
        const id = +r.paramMap.get('id');
        if (!state.talk[id]) {
            return this.dataService.getEntity(+r.paramMap.get('id'), slices.TALK).map((responseEntity) => new EntityActions.UpdateSuccess(slices.TALK, responseEntity));
        } else {
            return of();
        }
    });

    @Effect() rateTalk$ = this.actions$.ofType(typeFor(slices.TALK, actions.PATCH)).
        switchMap((a: PayloadAction) => {
            return this.dataService.update({ id: a.payload.id, yourRating: a.payload.rating }, slices.TALK)
                .switchMap(() => of())
                .catch((e) => {
                    console.log('Error', e);
                    return of(new EntityActions.PatchFail(slices.TALK, { id: a.payload.talkId, rating: null })
                    );
                });
        });

    constructor(
        private store: Store<RootState>,  // Other effects are Store<Thing>
        private actions$: Actions,
        private dataService: RESTService,
        private watch: WatchService
    ) { }
}

function createFilters(p: Params): Filters {
    return { speaker: p['speaker'] || null, title: p['title'] || null, minRating: p['minRating'] ? +p['minRating'] : 0 };
}
