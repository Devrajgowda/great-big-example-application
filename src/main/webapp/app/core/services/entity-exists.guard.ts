import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { RESTService } from './rest.service';
import * as fromRoot from '../store';
import { slices } from '../store/util';
import * as EntityActions from '../store/entity/entity.actions';
import { RootState } from '../store';

/**
 * Guards are hooks into the route resolution process, providing an opportunity
 * to inform the router's navigation process whether the route should continue
 * to activate this route. Guards must return an observable of true or false.
 */
@Injectable()
export class EntityExistsGuard implements CanActivate {
    constructor(
        private store: Store<fromRoot.RootState>,
        private dataService: RESTService,
        private router: Router
    ) { }

    /**
     * This method creates an observable that waits for the `loaded` property
     * of the entity state to turn `true`, emitting one time once loading
     * has finished.
     */
    waitForEntityToLoad(slice: keyof RootState): Observable<boolean> {
        return this.store.select(fromRoot.getEntityLoaded(slice))
            .filter((loaded) => {
                return loaded
            })
            .take(1);
    }

    /**
     * This method checks if an entity with the given slug/id is already registered
     * in the Store
     */
    hasEntityInStore(slice: keyof RootState, id: string): Observable<boolean> {
        return this.store.select(fromRoot.getEntityState(slice))
            .map((entities) => {
                return !!entities.entities[id]
            }
            )
            .take(1);
    }

    /**
     * This method loads an entity with the given slug from the API and caches
     * it in the store, returning `true` or `false` if it was found.
     */
    hasEntityInApi(slice: keyof RootState, id: string): Observable<boolean> {
        return this.dataService.getEntity(slice, id)
            .map((entity) => new EntityActions.Load(slice, entity))
            .do((action) => this.store.dispatch(action))
            .map((entity) => !!entity)
            .catch(() => {
                this.router.navigate(['/404']);
                return of(false);
            });
    }

    /**
     * `hasEntity` composes `hasEntityInStore` and `hasEntityInApi`. It first checks
     * if the entity is in store, and if not it then checks if it is in the
     * API.
     */
    hasEntity(slice: keyof RootState, id: string): Observable<boolean> {
        return this.hasEntityInStore(slice, id)
            .switchMap((inStore) => {
                if (inStore) {
                    return of(inStore);
                }

                return this.hasEntityInApi(slice, id);
            });
    }

    /**
     * This is the actual method the router will call when our guard is run.
     *
     * Our guard waits for the collection to load, then it checks if we need
     * to request an entity from the API or if we already have it in our cache.
     * If it finds it in the cache or in the API, it returns an Observable
     * of `true` and the route is rendered successfully.
     *
     * If it was unable to find it in our cache or in the API, this guard
     * will return an Observable of `false`, causing the router to move
     * on to the next candidate route. In this case, it will move on
     * to the 404 page.
     */
    // canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    //     const slice = route.data['slice'];
    //     const id = route.params['slug'] || route.params['id'];
    //     return this.waitForEntityToLoad(slice)
    //         .switchMap(() => {
    //             return this.hasEntity(slice, id)
    //         });
    // }


    // From https://toddmotto.com/preloading-ngrx-store-route-guards

    getFromStoreOrAPI(slice: keyof RootState, id: string): Observable<any> {
        return this.store
            .select(fromRoot.getEntityState(slice))
            .do((entities: any) => {
                if (!entities.entities[id]) {
                    this.store.dispatch(new EntityActions.Load(slice, { query: { id } }));
                }
            })
            .switchMap((entities) => {
                return entities.ids.map((id) => entities.entities[id]);
            })
            .filter((entity: any) => {
                return entity.id === id;
            })
            .take(1);
    }

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
        const slice = route.data['slice'];
        const id = route.params['slug'] || route.params['id'];
        return this.getFromStoreOrAPI(slice, id)
            .switchMap(() => of(true))
            .catch(() => of(false));
    }
}
