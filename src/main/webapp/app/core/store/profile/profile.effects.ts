import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';

import { Profile } from './profile.model';
import * as sliceFunctions from '../slice/slice.functions';
import { actions } from './profile.actions';
import * as ProfileActions from './profile.actions';
import { slices } from '../util';
import { RESTService } from '../../services/rest.service';
import * as functions from '../entity/entity.functions';

@Injectable()
export class ProfileEffects {

    @Effect()
    private follow$ = sliceFunctions.postToRemote$(this.actions$, slices.ARTICLE, this.dataService, actions.FOLLOW, new ProfileActions.FollowSuccess(), new ProfileActions.FollowFail());

    constructor(
        private store: Store<Profile>,
        private actions$: Actions,
        private dataService: RESTService
    ) { }
}
