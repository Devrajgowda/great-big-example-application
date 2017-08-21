import { EntityAction } from './entity.actions';
import { initialSlice, Slice } from '../slice/slice.model';

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

export function initialEntities<T extends Entity>(slice: string, initialEntity: T, vals?: T): Entities<T> {

    return Object.assign({}, initialSlice(slice), {
        ids: [],
        entities: {},
        selectedEntityId: null,
        initialEntity: Object.assign({}, initialBaseEntity, initialEntity),
    }, vals);
};
