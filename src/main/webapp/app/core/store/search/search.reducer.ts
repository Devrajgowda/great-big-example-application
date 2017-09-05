import { IDs, initialIDs } from '../id/id.model';
import { slices } from '../util';
import { actions } from '../id/id.actions';
import { typeFor } from '../util';
import { SliceAction } from '../slice/slice.actions';
import * as entityFunctions from '../id/id.functions';

export function reducer(state = initialIDs(slices.SEARCH), action: SliceAction): IDs {
    switch (action.type) {
        case typeFor(slices.SEARCH, actions.LOAD):
            return entityFunctions.addLoadID(state, action);
        case typeFor(slices.SEARCH, actions.LOAD_SUCCESS):
            return entityFunctions.updateIDs(state, action);
        default: {
            return state;
        }
    }
}

export const getIds = (state: IDs) => state.ids;

export const getLoading = (state: IDs) => state.loading;
