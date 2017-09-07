import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromRoot from '../../core/store';
import { User } from '../../core/store/user/user.model';
import { slices } from '../../core/store/util';
import * as EntityActions from '../../core/store/entity/entity.actions';

@Component({
    selector: 'jhi-blog-page',
    templateUrl: './blog.page.html'
})
export class BlogPage implements OnInit {
    user$: Observable<User>;
    constructor(
        private store: Store<fromRoot.RootState>
    ) { }

    ngOnInit() {
        this.user$ = this.store.select(fromRoot.getUserState);

        // this.userService.populate();
        this.store.dispatch(new EntityActions.Load(slices.ARTICLE, null));
        this.store.dispatch(new EntityActions.Load(slices.TAG, null));
    }
}
