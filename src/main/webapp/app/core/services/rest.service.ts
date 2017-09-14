import { Injectable, OnInit } from '@angular/core';
import { Http, URLSearchParams, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';

import { Claim } from '../store/claim/claim.model';
import { ClaimRebuttal } from '../store/claim-rebuttal/claim-rebuttal.model';
import { Comment } from '../store/comment/comment.model';
import { Contact } from '../store/contact/contact.model';
import { Crisis } from '../store/crisis/crisis.model';
import { Hero } from '../store/hero/hero.model';
import { Note } from '../store/note/note.model';
import { Rebuttal } from '../store/rebuttal/rebuttal.model';
import { AppConfig } from '../../app.config';
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
    talk: 'talks',
    tag: 'tags'
};

const requestTransforms = {
    add: {
        comment: (response: any, state: RootState) => ({ body: response.body })
    }
}

const responseTransforms = {
    getEntity: {
    },
    getEntities: {
        tag: (resp) => resp.map(tag => {
            return { id: tag, name: tag };
        })
    }
}

const endpointTransforms = {
    add: {
        comment: (comment: Comment, state: RootState) => {
            let slug = comment.articleId;
            return `articles/${slug}/comments`;
        }
    },
    update: {
        article: (article, state: RootState) => {
            let slug = state.article.entities[article.id].slug;
            if (article.favorited === true || article.favorited === false) {
                return `articles/${slug}/favorite`;
            }
            return 'articles';
        }
    },
    getEntities: {
        article: (state: RootState) => {
            return 'articles' + ((state.layout.blogPage.type === 'feed') ? '/feed' : '');
        }
    }
}

const methodTransforms = {
    update: {
        article(article, state: RootState) {
            if (article.favorited === true) {
                return 'post';
            } else if (article.favorited === false) {
                return 'delete';
            }
            return 'put';
        }
    }
}

const GOOGLE_ROOT = 'https://www.googleapis.com/books/v1/volumes';
const apis = {
    book: {
        get: {
            endpoint: (book, state: RootState) => {
                return `${GOOGLE_ROOT}/${book.id}`;
            }
        },
        getEntities: {
            endpoint: (book, state: RootState) => {
                return `${GOOGLE_ROOT}/${book.id}`;
            }
        }
    },
    comment: {
        add: {
            requestBody: (response: any, state: RootState) => ({ body: response.body }),
            endpoint: (comment: Comment, state: RootState) => {
                let slug = comment.articleId;
                return `articles/${slug}/comments`;
            }
        }
    },
    tag: {
        getEntities: {
            responseBody: (resp) => resp.map(tag => {
                return { id: tag, name: tag };
            })
        }
    },
    article: {
        update: {
            endpoint: (article, state: RootState) => {
                let slug = state.article.entities[article.id].slug;
                if (article.favorited === true || article.favorited === false) {
                    return `articles/${slug}/favorite`;
                }
                return 'articles';
            },
            getEntities: {
                endpoint: (state: RootState) => {
                    return 'articles' + ((state.layout.blogPage.type === 'feed') ? '/feed' : '');
                }
            }
        }
    }
}






@Injectable()
export class RESTService implements DataService {
    constructor(private http: Http, private config: AppConfig) { }

    getEntities(table: keyof RootState,
        query: { [key: string]: string | number } = {}, state: RootState): Observable<any[]> {

        let endpoint = endpointTransforms.getEntities[table] ? endpointTransforms.getEntities[table](state) : `${endpoints[table]}` || table;

        const params: URLSearchParams = new URLSearchParams();

        Object.keys(query)
            .forEach((key) => {
                if (query[key] !== null) {
                    params.set(key, '' + query[key]);
                }
            });

        return this.http.get(`${this.config.apiUrl}/${endpoint}`, { search: params })
            .map(this.extractData)
            .map(responseTransforms.getEntities[table] || ((resp) => resp))
            .catch(this.handleError);
    }

    getEntity(table: keyof RootState, id: string): Observable<any> {
        return this.http.get(`${this.config.apiUrl}/${endpoints[table]}/${id}`)
            .map(this.extractData)
            .map(responseTransforms.getEntity[table] || ((resp) => resp))
            .catch(this.handleError);
    }

    add(table: keyof RootState, entity: Entity, state: RootState, store: Store<RootState>): Observable<any> {
        let endpoint = endpointTransforms.add[table] && endpointTransforms.add[table](entity, state) || `${endpoints[table]}`;
        let payload = this.prepareRecord(entity);

        if (requestTransforms.add[table]) {
            payload = requestTransforms.add[table](payload, state);
        }

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
            .catch(this.handleError);
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

    update(table: keyof RootState, entity: Entity, state: RootState, store: Store<RootState>): Observable<any> {
        let endpoint = endpointTransforms.update[table] && endpointTransforms.update[table](entity, state) || `${endpoints[table]}`;
        let method = methodTransforms.update[table] && methodTransforms.update[table](entity, state) || 'put';
        let payload = this.prepareRecord(entity);

        return this.http[method](`${this.config.apiUrl}/${endpoint}`, this.prepareRecord(entity))
            .map(this.extractData)
            .catch(this.handleError);
    }

    remove(table: keyof RootState, entity: Entity, state: RootState, store: Store<RootState>): Observable<any> {
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
