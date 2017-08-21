export interface Slice {
    loaded?: boolean;
    loading?: boolean;
    slice: string;
    hasError: boolean;
};

export function initialSlice(slice: string, vals?: any): Slice {

    return Object.assign({
        loaded: false,
        loading: false,
        slice: slice,
        hasError: false
    }, vals);
};
