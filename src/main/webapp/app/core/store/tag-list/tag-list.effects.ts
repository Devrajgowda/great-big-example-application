import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';

import { RESTService } from '../../services/rest.service';
import * as functions from '../entity/entity.functions';
import { slices } from '../util';
import { actions } from '../slice/slice.actions';
import * as EntityActions from '../entity/entity.actions';

@Injectable()
export class TagListEffects {
    @Effect()
    private loadFromRemote$ = functions.loadFromRemote$(this.actions$, slices.TAG_LIST, this.dataService);

    constructor(private actions$: Actions,
        private dataService: RESTService) { }
}
