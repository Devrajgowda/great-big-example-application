import { EntityAction } from './entity.actions';
import { initialSlice, Slice } from '../slice/slice.model';
import { completeAssign } from '../util';

export interface Entity {
    id: string,
    loading?: boolean;
    [field: string]: any
}

const initialBaseEntity = {
    id: null,
    loading: false
};

export interface Entities<T extends Entity> extends Slice {
    ids: string[];
    entities: { [id: string]: T };
    selectedEntityId?: string;
    initialEntity: T;
};

export function initialEntities<T extends Entity>(slice: string, initialEntity: T, vals = {}): Entities<T> {

    return completeAssign({}, initialSlice(slice), {
        ids: [],
        entities: {},
        selectedEntityId: null,
        initialEntity: completeAssign({}, initialBaseEntity, initialEntity)
    }, vals);
};
