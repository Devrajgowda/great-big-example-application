import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';

import { Article } from './article.model';
import { slices } from '../util';
import { RESTService } from '../../services/rest.service';
import * as entityFunctions from '../entity/entity.functions';
import * as sliceFunctions from '../slice/slice.functions';
import { typeFor } from '../util';
import { actions } from './article.actions';
import { SliceAction } from '../slice/slice.actions';
import * as EntityActions from '../entity/entity.actions';
import * as ArticleActions from './article.actions';
import { initialBlogPageLayout } from '../../../features/blog/blog.layout';
import * as SliceActions from '../slice/slice.actions';
import * as fromRoot from '../../../core/store';
import { PayloadAction } from '../util';

@Injectable()
export class ArticleEffects {
    @Effect()
    private loadFromRemote$ = entityFunctions.loadFromRemote$(this.actions$, slices.ARTICLE, this.dataService);
    @Effect()
    private updateToRemote$ = entityFunctions.updateToRemote$(this.actions$, slices.ARTICLE, this.dataService, this.store);
    @Effect()
    private addToRemote$ = entityFunctions.addToRemote$(this.actions$, slices.ARTICLE, this.dataService, this.store);

    @Effect()
    private navigateOnArticleAddSuccess = this.actions$
        .ofType(typeFor(slices.ARTICLE, actions.ADD_SUCCESS))
        .map((action) => {
            this.router.navigateByUrl('/features/blog/article/' + action.payload.slug);
            return Observable.empty();
        });

    @Effect()
    private navigateOnArticleDeleteSuccess = this.actions$
        .ofType(typeFor(slices.ARTICLE, actions.DELETE_SUCCESS))
        .map((action) => {
            this.router.navigateByUrl('/features/blog/article/');
            return Observable.empty();
        });

    // @Effect()
    // // export function loadFromRemote$(actions$: Actions, slice: string, dataService): Observable<Action> {
    // private loadForQueryFromRemote = this.actions$
    //     .ofType(typeFor(slices.LAYOUT, SliceActions.actions.UPDATE))
    //     .filter((action: SliceAction) => action.payload.filters)   // TODO: make this a better test for this being the blog page layout
    //     .withLatestFrom(this.store.select(fromRoot.getBlogPageLayout), (action, blogPageLayout) => {

    //         const route = '/articles' + (blogPageLayout.type === 'feed') ? '/feed' : '';
    //         return this.dataService.getEntities(route, action.payload.filters)
    //             .mergeMap((fetchedEntities) => Observable.from(fetchedEntities))
    //             .map((fetchedEntity) => new EntityActions.LoadSuccess(slices.ARTICLE, fetchedEntity))  // one action per entity
    //             .catch((err) => {
    //                 console.log(err);
    //                 return Observable.of(new EntityActions.AddUpdateFail(slices.ARTICLE, null));
    //             })
    //     }
    //     );

    @Effect()
    private favorite$ = sliceFunctions.postToRemote$(this.actions$, slices.ARTICLE, this.dataService, actions.FAVORITE, new ArticleActions.FavoriteSuccess(), new ArticleActions.FavoriteFail());

    @Effect()
    private unFavorite$ = sliceFunctions.deleteFromRemote$(this.actions$, slices.ARTICLE, this.dataService, actions.FAVORITE, new ArticleActions.FavoriteSuccess(), new ArticleActions.FavoriteFail());

    @Effect()
    private addComment$ = sliceFunctions.postToRemote$(this.actions$, slices.ARTICLE, this.dataService, actions.ADD_COMMENT, new ArticleActions.AddCommentSuccess(), new ArticleActions.AddCommentFail());

    constructor(
        private store: Store<Article>,
        private actions$: Actions<PayloadAction>,
        private router: Router,
        private dataService: RESTService
    ) { }
}
