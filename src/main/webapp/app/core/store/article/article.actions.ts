import { EntityAction, actions as entityActions } from '../entity/entity.actions';
import { Article } from './article.model';
import { slices } from '../util';

export const actions = {
    ...entityActions,
    FAVORITE: 'FAVORITE',
    FAVORITE_SUCCESS: 'FAVORITE_SUCCESS',
    FAVORITE_FAIL: 'FAVORITE_FAIL',
    UNFAVORITE: 'UNFAVORITE',
    UNFAVORITE_SUCCESS: 'UNFAVORITE_SUCCESS',
    UNFAVORITE_FAIL: 'UNFAVORITE_FAIL',
    ADD_COMMENT: 'ADD_COMMENT',
    ADD_COMMENT_SUCCESS: 'ADD_COMMENT_SUCCESS',
    ADD_COMMENT_FAIL: 'ADD_COMMENT_FAIL'
}

class ArticleAction extends EntityAction<Article> {
    constructor(obj = {}) {
        super(slices.ARTICLE, obj);
    }
}

export class Favorite extends ArticleAction {
    protected actionName: string = actions.FAVORITE;
    constructor(slug: string) {
        super({ route: '/articles/' + slug + '/favorite' });
    }
}

export class FavoriteSuccess extends ArticleAction {
    protected actionName: string = actions.FAVORITE_SUCCESS;
}

export class FavoriteFail extends ArticleAction {
    protected actionName: string = actions.FAVORITE_FAIL;
}

export class Unfavorite extends ArticleAction {
    protected actionName: string = actions.UNFAVORITE;
}

export class UnfavoriteSuccess extends ArticleAction {
    protected actionName: string = actions.UNFAVORITE_SUCCESS;
}

export class UnfavoriteFail extends ArticleAction {
    protected actionName: string = actions.UNFAVORITE_FAIL;
}

export class AddComment extends ArticleAction {
    protected actionName: string = actions.ADD_COMMENT;
    constructor(slug: string, requestObject: any) {
        super({ route: 'articles/' + slug + '/comments', requestObject });
    }
}

export class AddCommentSuccess extends ArticleAction {
    protected actionName: string = actions.ADD_COMMENT_SUCCESS;
}

export class AddCommentFail extends ArticleAction {
    protected actionName: string = actions.ADD_COMMENT_FAIL;
}
