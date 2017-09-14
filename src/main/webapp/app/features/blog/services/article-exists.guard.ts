import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { RESTService } from '../../../core/services/rest.service';
import * as fromRoot from '../../../core/store';
import { slices } from '../../../core/store/util';
import * as EntityActions from '../../../core/store/entity/entity.actions';

/**
 * Guards are hooks into the route resolution process, providing an opportunity
 * to inform the router's navigation process whether the route should continue
 * to activate this route. Guards must return an observable of true or false.
 */
@Injectable()
export class ArticleExistsGuard implements CanActivate {
    constructor(
        private store: Store<fromRoot.RootState>,
        private dataService: RESTService,
        private router: Router
    ) { }

    /**
     * This method creates an observable that waits for the `loaded` property
     * of the article state to turn `true`, emitting one time once loading
     * has finished.
     */
    waitForArticleToLoad(): Observable<boolean> {
        return this.store.select(fromRoot.getArticleLoaded)
            .filter((loaded) => loaded)
            .take(1);
    }

    /**
     * This method checks if an article with the given slug/id is already registered
     * in the Store
     */
    hasArticleInStore(id: string): Observable<boolean> {
        return this.store.select(fromRoot.getArticleEntities)
            .map((entities) => !!entities[id])
            .take(1);
    }

    /**
     * This method loads an article with the given slug from the API and caches
     * it in the store, returning `true` or `false` if it was found.
     */
    hasArticleInApi(id: string): Observable<boolean> {
        return this.dataService.getEntity(slices.ARTICLE, id)
            .map((articleEntity) => new EntityActions.Load(slices.ARTICLE, articleEntity))
            .do((action) => this.store.dispatch(action))
            .map((article) => !!article)
            .catch(() => {
                this.router.navigate(['/404']);
                return of(false);
            });
    }

    /**
     * `hasArticle` composes `hasArticleInStore` and `hasArticleInApi`. It first checks
     * if the article is in store, and if not it then checks if it is in the
     * API.
     */
    hasArticle(id: string): Observable<boolean> {
        return this.hasArticleInStore(id)
            .switchMap((inStore) => {
                if (inStore) {
                    return of(inStore);
                }

                return this.hasArticleInApi(id);
            });
    }

    /**
     * This is the actual method the router will call when our guard is run.
     *
     * Our guard waits for the collection to load, then it checks if we need
     * to request a book from the API or if we already have it in our cache.
     * If it finds it in the cache or in the API, it returns an Observable
     * of `true` and the route is rendered successfully.
     *
     * If it was unable to find it in our cache or in the API, this guard
     * will return an Observable of `false`, causing the router to move
     * on to the next candidate route. In this case, it will move on
     * to the 404 page.
     */
    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
        return this.waitForArticleToLoad()
            .switchMap(() => this.hasArticle(route.params['slug']));
    }
}
