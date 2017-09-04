import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';

import { RootState } from '../';
import { slices } from '../util';
import { RESTService } from '../../services/rest.service';
import * as functions from '../entity/entity.functions';

@Injectable()
export class ClaimRebuttalEffects {
    @Effect()
    private loadFromRemote$ = functions.loadFromRemote$(this.actions$, slices.CLAIM_REBUTTAL, this.dataService, this.store);

    constructor(
        private store: Store<RootState>,
        private actions$: Actions,
        private dataService: RESTService
    ) { }
}
