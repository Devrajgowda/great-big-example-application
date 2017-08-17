import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';

import { RESTService } from '../../services/rest.service';
import * as functions from '../entity/entity.functions';
import { slices } from '../util';
import { actions } from '../slice/slice.actions';
import * as EntityActions from '../entity/entity.actions';

@Injectable()
export class SessionEffects {
    @Effect()
    private loadFromRemote$ = functions.loadFromRemote$(this.actions$, slices.TAG_LIST, this.dataService);

    constructor(private actions$: Actions,
        private dataService: RESTService) { }

    transform({ meta }) {
        return {
            token: meta.token,
            user: { firstName: meta.profile.firstName, lastName: meta.profile.lastName }
        };
    }
}
