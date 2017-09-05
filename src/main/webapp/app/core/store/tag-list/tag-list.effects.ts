import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { RESTService } from '../../services/rest.service';
import * as entityFunctions from '../entity/entity.functions';
import { slices } from '../util';
import { actions } from '../slice/slice.actions';
import * as EntityActions from '../entity/entity.actions';
import { RootState } from '../';

@Injectable()
export class TagListEffects {
    @Effect()
    private loadFromRemote$ = entityFunctions.loadFromRemote$(this.actions$, slices.TAG_LIST, this.dataService, this.store);

    constructor(
        private store: Store<RootState>,
        private actions$: Actions,
        private dataService: RESTService) { }
}
