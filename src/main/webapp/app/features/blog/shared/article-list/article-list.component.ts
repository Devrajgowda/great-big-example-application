import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import * as fromRoot from '../../../../core/store';
import { Article } from '../../../../core/store/article/article.model';
import { Layout } from '../../../../core/store/layout/layout.model';
import { BlogPageLayout } from '../../blog.layout';
import * as SliceActions from '../../../../core/store/slice/slice.actions';
import * as EntityActions from '../../../../core/store/entity/entity.actions';
import { slices } from '../../../../core/store/util';
import { Entities } from '../../../../core/store/entity/entity.model';

@Component({
    selector: 'jhi-article-list',
    templateUrl: './article-list.component.html'
})
export class ArticleListComponent implements OnInit, OnDestroy {
    articles$: Store<Entities<Article>>;
    articlesSub: Subscription;
    articles: Article[] = [];
    loading = false;
    totalPages: Array<number> = [1];

    constructor(
        private store: Store<fromRoot.RootState>
    ) { }

    @Input() limit: number;

    ngOnInit() {
        let self = this;  // because we need to refer to this.limit inside a function
        this.articles$ = this.store.select(fromRoot.getArticlesState);
        this.articlesSub = this.articles$.subscribe((articles) => {
            this.loading = articles.loading;
            this.articles = articles.ids.map((id) => articles.entities[id]);

            // Used from http://www.jstips.co/en/create-range-0...n-easily-using-one-line/
            this.totalPages = Array.from(new Array(Math.ceil(articles.ids.length / self.limit)), (val, index) => index + 1);
        })
        this.setPageTo(1);
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
        this.store.dispatch(new EntityActions.Load(slices.ARTICLE, { query }));
        this.loading = true;
        this.articles = [];
    }

    ngOnDestroy() {
        this.articlesSub && this.articlesSub.unsubscribe();
    }
}
