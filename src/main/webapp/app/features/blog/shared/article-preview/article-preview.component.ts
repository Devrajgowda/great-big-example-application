import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromRoot from '../../../../core/store';
import { Article } from '../../../../core/store/article/article.model';
import * as ArticleActions from '../../../../core/store/article/article.actions';

@Component({
    selector: 'jhi-article-preview',
    templateUrl: './article-preview.component.html'
})
export class ArticlePreviewComponent {
    @Input() article: Article;

    constructor(
        private store: Store<fromRoot.RootState>,
    ) { }

    onToggleFavorite(favorited: boolean) {
        //     this.article.favorited = favorited;

        if (favorited) {
            this.store.dispatch(new ArticleActions.Favorite(this.article.slug));
            // this.article.favoritesCount++;
        } else {
            this.store.dispatch(new ArticleActions.Unfavorite(this.article.slug));
            // this.article.favoritesCount--;
        }
    }
}
