import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';

import { Profile, initialProfile } from './profile.model';
import * as entityFunctions from '../entity/entity.functions';
import { slices } from '../util';
import { RESTService } from '../../services/rest.service';
import { RootState } from '../';

@Injectable()
export class ProfileEffects {
    @Effect()
    private updateToRemote$ = entityFunctions.updateToRemote$(this.actions$, slices.PROFILE, this.dataService, this.store, initialProfile);

    constructor(
        private store: Store<RootState>,
        private actions$: Actions,
        private dataService: RESTService
    ) { }
}
