import { PayloadAction } from '../util';
import { Entity } from './entity.model';
import { SliceAction } from '../slice/slice.actions';
import { typeFor } from '../util';

export const actions = {
    ADD: 'ADD',
    ADD_OPTIMISTICALLY: 'ADD_OPTIMISTICALLY',
    ADD_SUCCESS: 'ADD_SUCCESS',
    ADD_TEMP: 'ADD_TEMP', // Use for adding to a blank to the store so users can fill in before submitting to server
    ADD_UPDATE_FAIL: 'ADD_UPDATE_FAIL',
    DELETE: 'DELETE',
    DELETE_FAIL: 'DELETE_FAIL',
    DELETE_SUCCESS: 'DELETE_SUCCESS',
    DELETE_TEMP: 'DELETE_TEMP',
    LOAD: 'LOAD',
    LOAD_FAIL: 'LOAD_FAIL',
    LOAD_SUCCESS: 'LOAD_SUCCESS',
    LOAD_ALL: 'LOAD_ALL',
    LOAD_ALL_FAIL: 'LOAD_ALL_FAIL',
    LOAD_ALL_SUCCESS: 'LOAD_ALL_SUCCESS',
    SELECT: 'SELECT',
    SELECT_NEXT: 'SELECT_NEXT',
    UPDATE: 'UPDATE',
    PATCH_EACH: 'PATCH_EACH',
    UPDATE_SUCCESS: 'UPDATE_SUCCESS',
    PATCH: 'PATCH',
    PATCH_SUCCESS: 'PATCH_SUCCESS',
    PATCH_FAIL: 'PATCH_FAIL'
};

export const TEMP = 'TEMP_ID_VALUE';

class DynamicTypeAction<T> extends SliceAction implements PayloadAction {
    protected actionName = '';
    constructor(public slice: string, public payload: any) {
        super(slice, payload);
    }
    get type() {
        return typeFor(this.slice, this.actionName);
    }
}

export class EntityAction<T extends Entity> extends DynamicTypeAction<T> implements PayloadAction {
    constructor(public slice: string, public payload: T) {
        super(slice, payload);
    }
}

export class Add<T extends Entity> extends EntityAction<T> {
    protected actionName: string = actions.ADD;
    constructor(public slice: string, public payload: any = {}) {
        super(slice, Object.assign({}, { dirty: true }, payload));
    }
    // If the payload contains the temp ID value, that means
    // we want the server to assign and ID value, so drop the ID field
    payloadForPost() {
        const newPayload = Object.assign({}, this.payload);
        if (this.payload.id === TEMP) {
            delete newPayload.id;
            delete newPayload.dirty;
        }
        return newPayload;
    }
}

/**
 * Create a temporary entity to go into the store but not to the server or be
 * validated. If the id of the payload is missing or null
 * then use the TEMP value. Otherwise use the payload.id value
 */
export class AddTemp<T extends Entity> extends EntityAction<T> {
    protected actionName: string = actions.ADD_TEMP;
    constructor(public slice: string, payload: any = {}) {
        super(slice, Object.assign({}, payload, (payload.id ? {} : { id: TEMP })));
    }
}

/**
 * Use this action to first put in the store and then
 * submit to the server
 */
export class AddOptimistically<T extends Entity> extends Add<T> {
    protected actionName: string = actions.ADD_OPTIMISTICALLY;
    constructor(public slice: string, payload: any = {}) {
        super(slice, Object.assign({}, { id: TEMP }, payload));
    }
}

export class AddSuccess<T extends Entity> extends EntityAction<T> {
    protected actionName: string = actions.ADD_SUCCESS;
}

export class AddUpdateFail<T extends Entity> extends EntityAction<T> {
    protected actionName: string = actions.ADD_UPDATE_FAIL;
}

export class Delete<T extends Entity> extends EntityAction<T> {
    protected actionName: string = actions.DELETE;
}

export class DeleteFail<T extends Entity> extends EntityAction<T> {
    protected actionName: string = actions.DELETE_FAIL;
}

export class DeleteSuccess<T extends Entity> extends EntityAction<T> {
    protected actionName: string = actions.DELETE_SUCCESS;
}

export class DeleteTemp<T extends Entity> extends EntityAction<T> {
    protected actionName: string = actions.DELETE_TEMP;
    constructor(public slice: string) {
        super(slice, <T>{ id: TEMP })
    }
}

export class Load<T extends Entity> extends EntityAction<T> {
    protected actionName: string = actions.LOAD;
}

export class LoadFail<T extends Entity> extends EntityAction<T> {
    protected actionName: string = actions.LOAD_FAIL;
}

export class LoadSuccess<T extends Entity> extends EntityAction<T> {
    protected actionName: string = actions.LOAD_SUCCESS;
}

export class LoadAll<T extends Entity> extends EntityAction<T> {
    protected actionName: string = actions.LOAD_ALL;
}

export class LoadAllFail<T extends Entity> extends EntityAction<T> {
    protected actionName: string = actions.LOAD_ALL_FAIL;
}

export class LoadAllSuccess<T extends Entity> extends DynamicTypeAction<T> {
    protected actionName: string = actions.LOAD_ALL_SUCCESS;
}

export class Patch<T> extends DynamicTypeAction<T> {
    protected actionName: string = actions.PATCH;
}

export class PatchSuccess<T extends Entity> extends EntityAction<T> {
    protected actionName: string = actions.PATCH_SUCCESS;
}

export class PatchFail<T extends Entity> extends EntityAction<T> {
    protected actionName: string = actions.PATCH_FAIL;
}

export class Update<T extends Entity> extends EntityAction<T> {
    protected actionName: string = actions.UPDATE;
}

export class PatchEach<T extends Entity> extends DynamicTypeAction<T> {
    protected actionName: string = actions.PATCH_EACH;
}

export class UpdateSuccess<T extends Entity> extends EntityAction<T> {
    protected actionName: string = actions.UPDATE_SUCCESS;
}

export class Select<T extends Entity> extends EntityAction<T> {
    protected actionName: string = actions.SELECT;
}

export class SelectNext<T extends Entity> extends EntityAction<T> {
    protected actionName: string = actions.SELECT_NEXT;
    constructor(public slice: string) {
        super(slice, null);
    }
}
