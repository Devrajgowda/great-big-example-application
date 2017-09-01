import { Store } from '@ngrx/store';

import { RootState } from '../store';
import { Entity } from '../store/entity/entity.model';

export interface DataService {
    add(obj: Entity, slice: keyof RootState, state: RootState, store: Store<RootState>): any,
    update(obj: Entity, slice: keyof RootState, state: RootState, store: Store<RootState>): any,
    remove(obj: Entity, slice: keyof RootState, state: RootState, store: Store<RootState>): any
}
