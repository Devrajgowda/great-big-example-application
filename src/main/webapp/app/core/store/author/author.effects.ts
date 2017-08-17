import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';

import { Author } from './author.model';
import { slices } from '../util';
import { RESTService } from '../../services/rest.service';
import * as functions from '../entity/entity.functions';

@Injectable()
export class AuthorEffects {
    @Effect()
    private loadFromRemote$ = functions.loadFromRemote$(this.actions$, slices.AUTHOR, this.dataService);

    constructor(
        private store: Store<Author>,
        private actions$: Actions,
        private dataService: RESTService
    ) { }
}
