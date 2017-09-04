import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';

import { Note, initialNote } from './note.model';
import { slices } from '../util';
import { RESTService } from '../../services/rest.service';
import * as functions from '../entity/entity.functions';
import { RootState } from '../';

@Injectable()
export class NoteEffects {
    @Effect()
    private loadFromRemote$ = functions.loadFromRemote$(this.actions$, slices.NOTE, this.dataService, this.store);
    @Effect()
    private updateToRemote$ = functions.updateToRemote$(this.actions$, slices.NOTE, this.dataService, this.store);
    @Effect()
    private deleteFromRemote$ = functions.deleteFromRemote$(this.actions$, slices.NOTE, this.dataService, this.store);
    @Effect()
    private addToRemote$ = functions.addToRemote$(this.actions$, slices.NOTE, this.dataService, this.store, initialNote);

    constructor(
        private store: Store<RootState>,
        private actions$: Actions,
        private dataService: RESTService
    ) { }
}
