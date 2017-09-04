import { completeAssign } from '../util';

export interface Slice {
    loaded: boolean;
    loading: boolean;
    slice: string;
    hasError: boolean;
};

export function initialSlice(slice: string, vals: any = {}): Slice {

    return completeAssign({
        loaded: false,
        loading: false,
        slice: slice,
        hasError: false
    }, vals);
};
