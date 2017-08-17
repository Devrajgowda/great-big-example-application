export interface TagList {
    tags: string[];
};

export function initialTagList(vals: any = {}): TagList {
    return Object.assign({},
        {
            tags: []
        }, vals);
};
