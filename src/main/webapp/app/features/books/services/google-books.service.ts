import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Book } from '../../../core/store/book/book.model';

const headers: Headers = new Headers([{ Authorization: '' }]);
const options: RequestOptionsArgs = { headers };

@Injectable()
export class GoogleBooksService {
    private API_PATH = 'https://www.googleapis.com/books/v1/volumes';

    constructor(private http: Http) { }

    searchBooks(queryTitle: string): Observable<Book[]> {

        return this.http.get(`${this.API_PATH}?q=${queryTitle}`)
            .map((res) => res.json().items || []);
    }

    retrieveBook(volumeId: string): Observable<Book> {
        return this.http.get(`${this.API_PATH}/${volumeId}`)
            .map((res) => res.json());
    }
}
