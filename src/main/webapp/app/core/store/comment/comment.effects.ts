import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';

import { Comment, initialComment } from './comment.model';
import { slices } from '../util';
import { RESTService } from '../../services/rest.service';
import * as functions from '../entity/entity.functions';
import { RootState } from '../';

@Injectable()
export class CommentEffects {
    // @Effect()
    // private loadFromRemote$ = functions.loadFromRemote$(this.actions$, slices.COMMENT, this.dataService);
    @Effect()
    private updateToRemote$ = functions.updateToRemote$(this.actions$, slices.COMMENT, this.dataService, this.store);
    @Effect()
    private addToRemote$ = functions.addToRemote$(this.actions$, slices.COMMENT, this.dataService, this.store, initialComment);

    constructor(
        private store: Store<RootState>,
        private actions$: Actions,
        private dataService: RESTService
    ) { }
}
