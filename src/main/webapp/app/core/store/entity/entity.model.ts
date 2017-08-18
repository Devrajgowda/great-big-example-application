import { EntityAction } from './entity.actions';

export interface Entity {
    id: string,
    [field: string]: any
}

export interface Entities<T extends Entity> {
    ids: string[];
    entities: { [id: string]: T };
    loaded?: boolean;
    loading?: boolean;
    selectedEntityId?: string;
    slice: string;
    initialEntity: T;
};

export function initialEntities<T extends Entity>(slice: string, actionNames: any, initialEntity: T, vals?: T): Entities<T> {

    return Object.assign({
        ids: [],
        entities: {},
        loaded: false,
        loading: false,
        selectedEntityId: null,
        slice,
        initialEntity,
    }, vals);
};
