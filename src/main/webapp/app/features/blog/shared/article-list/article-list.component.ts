import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import * as fromRoot from '../../../../core/store';
import { Article } from '../../../../core/store/article/article.model';
import { Layout } from '../../../../core/store/layout/layout.model';
import { BlogPageLayout } from '../../blog.layout';
import * as SliceActions from '../../../../core/store/slice/slice.actions';
import { slices } from '../../../../core/store/util';

@Component({
    selector: 'jhi-article-list',
    templateUrl: './article-list.component.html'
})
export class ArticleListComponent implements OnDestroy {
    articles$: Observable<Article[]>;
    articlesSub: Subscription;
    articles: Article[] = [];
    loading = false;
    totalPages: Array<number> = [1];

    constructor(
        private store: Store<fromRoot.RootState>
    ) { }

    @Input() limit: number;

    ngOninit() {
        this.articles$ = this.store.select(fromRoot.getArticlesForQuery);
        this.articlesSub = this.articles$.subscribe((articles) => {
            // this.loading = articles.loading;
            this.articles = articles;

            // Used from http://www.jstips.co/en/create-range-0...n-easily-using-one-line/
            this.totalPages = Array.from(new Array(Math.ceil(articles.length / this.limit)), (val, index) => index + 1);
        })
    }

    setPageTo(pageNumber) {
        // Create limit and offset filter (if necessary)
        let query: any = {
            currentPage: pageNumber,
        };
        if (this.limit) {
            query.filters = {
                limit: this.limit,
                offset: (this.limit * (pageNumber - 1))
            };
        }

        this.store.dispatch(new SliceActions.Patch(slices.LAYOUT, ['blogPage'], query));
        this.loading = true;
        this.articles = [];
    }

    ngOnDestroy() {
        this.articlesSub && this.articlesSub.unsubscribe();
    }
}
