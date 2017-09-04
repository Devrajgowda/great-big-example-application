export interface BlogPageLayout {
    type: string,
    filters: {
        tag?: string,
        author?: string,
        favorited?: string,
        limit?: number,
        offset?: number
    },
    currentPage: number

}

export const initialBlogPageLayout = {
    type: 'all',
    filters: {},
    currentPage: 1
};
