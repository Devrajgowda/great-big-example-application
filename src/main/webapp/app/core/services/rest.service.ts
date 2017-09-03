import { Injectable, OnInit } from '@angular/core';
import { Http, URLSearchParams, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
// import { normalize } from 'normalizr';

import { Claim } from '../store/claim/claim.model';
import { ClaimRebuttal } from '../store/claim-rebuttal/claim-rebuttal.model';
import { Comment } from '../store/comment/comment.model';
import { Contact } from '../store/contact/contact.model';
import { Crisis } from '../store/crisis/crisis.model';
import { Hero } from '../store/hero/hero.model';
import { Note } from '../store/note/note.model';
import { Rebuttal } from '../store/rebuttal/rebuttal.model';
import { AppConfig } from '../../app.config';
// import { articleSchema } from '../store/article/article.model';
import { DataService } from './data.service';
import { RootState } from '../store';
import { Entity } from '../store/entity/entity.model';
import * as SliceActions from '../store/slice/slice.actions';
import * as EntityActions from '../store/entity/entity.actions';
import { completeAssign } from '../store/util';

/**
 * This mapping exists because I don't like pluralization of entity names. The JHipster
 * approach uses plurals so this takes care of that.
 */
const endpoints = {
    article: 'articles',
    author: 'authors',
    claim: 'claims',
    claimRebuttal: 'claim-rebuttals',
    comment: 'comments',
    contact: 'contacts',
    crisis: 'crises',
    hero: 'heroes',
    note: 'notes',
    rebuttal: 'rebuttals',
    talk: 'talks'
};

// const schemas = {
//     article: articleSchema
// }

const requestTransforms = {
    add: {
        comment(response: any, state: RootState) {
            // return { comment: { body: comment.body } };
            return { body: response.body };
        }
    }
}

const responseTransforms = {
    get: {
        // From ng-redux demo. Not needed now
        // session(response: any, state: RootState) {
        //     return {
        //         token: response.meta.token,
        //         user: { firstName: response.meta.profile.firstName, lastName: response.meta.profile.lastName }
        //     };
        // }
    }
}

const endpointTransforms = {
    add: {
        comment(comment: Comment, state: RootState) {
            let slug = comment.articleId;
            return `articles/${slug}/comments`;
        }
    }
}

@Injectable()
export class RESTService implements DataService {
    constructor(private http: Http, private config: AppConfig) { }

    getEntities(table: string,
        query: { [key: string]: string | number } = {},
        route: string = `${this.config.apiUrl}/${(endpoints[table] || table)}`,
        extractFunction = this.extractData): Observable<any[]> {

        const params: URLSearchParams = new URLSearchParams();

        Object.keys(query)
            .forEach((key) => {
                if (query[key] !== null) {
                    params.set(key, '' + query[key]);
                }
            });

        return this.http.get(route, { search: params })
            .map(extractFunction)
            .map(responseTransforms.get[table] || ((resp) => resp))
            .catch(this.handleError);
    }

    // getEntitiesThenNormalize(route: string, query, table: string): Observable<any> {
    //     return this.getEntities(table, query, route, (obj) => normalize(obj, schemas[table]));
    // }

    // TODO: make table the first parameter of all of these

    getEntity(id: string, table: string): Observable<any> {
        return this.http.get(`${this.config.apiUrl}/${endpoints[table]}/${id}`)
            .map(this.extractData)
            .map(responseTransforms.get[table] || ((resp) => resp))
            .catch(this.handleError);
    }

    add(entity: Entity, table: keyof RootState, state: RootState, store: Store<RootState>): Observable<any> {
        let endpoint = endpointTransforms.add[table] && endpointTransforms.add[table](entity, state) || `${endpoints[table]}`;
        let payload = this.prepareRecord(entity);

        if (requestTransforms.add[table]) {
            payload = requestTransforms.add[table](payload, state);
        }

        // store.dispatch(new SliceActions.ToggleLoading(table, { loading: true }));
        // store.dispatch(new EntityActions.ToggleLoading(table, { id: entity.id, loading: true }));
        return this.http.post(`${this.config.apiUrl}/${endpoint}`, payload)
            .map((result) => {
                const tempEntity = state[table].entities[EntityActions.TEMP];
                let oldObject = {};
                if (tempEntity) {
                    oldObject = completeAssign({}, ...tempEntity);
                    if (typeof oldObject['id'] !== 'undefined') {
                        delete oldObject['id'];
                    }
                }
                const newObject = this.extractData(result);
                if (tempEntity) {
                    store.dispatch(new EntityActions.DeleteTemp(table));
                }
                return completeAssign(oldObject, newObject);
            })
            .catch(this.handleError)
            .finally(() => {
                // store.dispatch(new SliceActions.ToggleLoading(table, { loading: false }));
                // store.dispatch(new EntityActions.ToggleLoading(table, { id: entity.id, loading: false }));
            });
    }

    get(route: string): Observable<any> {
        return this.http.get(`${this.config.apiUrl}/${route}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    post(route: string, object: any): Observable<any> {
        return this.http.post(`${this.config.apiUrl}/${route}`, this.prepareRecord(object))
            .map(this.extractData)
            .catch(this.handleError);
    }

    update(entity: Entity, table, state: RootState, store: Store<RootState>): Observable<any> {
        return this.http.put(`${this.config.apiUrl}/${endpoints[table]}`, this.prepareRecord(entity))
            .map(this.extractData)
            .catch(this.handleError);
    }

    remove(entity: Entity, table, state: RootState, store: Store<RootState>): Observable<any> {
        return this.http.delete(`${this.config.apiUrl}/${endpoints[table]}/${entity.id}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    prepareRecord(record: any) {
        const newRecord = { ...record };
        delete newRecord.dirty;
        return newRecord;
    }

    extractData(res: any) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }

        const obj =
            (res && !!res._body && res.json()) ||
            res.data ||
            { id: res.url.match(/[^\/]+$/)[0] };

        return obj;
    }

    handleError(error: Response | any) {
        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        const id = error.url.match(/[^\/]+$/)[0]; // if DELETE_FAIL, get id from resp.url

        return Observable.throw({ errMsg, id });
    }
}
