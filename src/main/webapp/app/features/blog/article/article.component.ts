import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { JhiEventManager } from 'ng-jhipster';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { JhiAlertService } from 'ng-jhipster';

import * as fromRoot from '../../../core/store';
import { Article } from '../../../core/store/article/article.model';
import { Comment } from '../../../core/store/comment/comment.model';
import { User } from '../../../core/store/user/user.model';
import { slices } from '../../../core/store/util';
import * as EntityActions from '../../../core/store/entity/entity.actions';
import * as ArticleActions from '../../../core/store/article/article.actions';
import * as ProfileActions from '../../../core/store/profile/profile.actions';
import { Account, Principal } from '../../../shared';

@Component({
    selector: 'jhi-article-component',
    templateUrl: './article.component.html'
})
export class ArticleComponent implements OnInit, OnDestroy {
    comments$: Observable<Comment[]>;
    commentsSub: Subscription;
    article$: Observable<Article>;
    article: Article;
    articleSub: Subscription;
    currentUser: User;
    canModify: boolean;
    comments: Comment[];
    commentControl = new FormControl();
    commentFormErrors = {};
    isSubmitting = false;
    isDeleting = false;
    currentUser$: Observable<User>;
    currentUserSub: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private store: Store<fromRoot.RootState>,
        private alertService: JhiAlertService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        // this.identity = this.principal.identity();
        this.currentUser$ = this.store.select(fromRoot.getUserState);
        this.article$ = this.store.select(fromRoot.getSelectedArticle);
        this.articleSub = this.article$.subscribe((article) => this.article = article);
        this.comments$ = this.store.select(fromRoot.getCommentsForSelectedArticle);
        this.commentsSub = this.comments$.subscribe((comments) => this.comments = comments);

        // Load the current user's data
        this.currentUserSub = Observable.combineLatest(this.currentUser$, this.article$).subscribe(
            ([identityData, article]) => {
                this.currentUser = identityData;

                this.canModify = article && (this.currentUser.login === article.author.username);
            }
        );
    }

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

    onToggleFollowing(following: boolean) {
        if (following) {
            this.store.dispatch(new ProfileActions.Follow(this.article.author.username));
        } else {
            this.store.dispatch(new ProfileActions.Unfollow(this.article.author.username));
        }
        // this.article.author.following = following;
    }

    deleteArticle() {
        this.isDeleting = true;
        this.store.dispatch(new EntityActions.Delete(slices.ARTICLE, this.article));
    }

    // populateComments() {
    //     this.commentsService.getAll(this.article.slug)
    //         .subscribe((comments) => this.comments = comments);
    // }

    addComment() {
        // this.isSubmitting = true;
        this.commentFormErrors = {};

        const requestObject = { comment: { body: this.commentControl.value } };
        this.store.dispatch(new ArticleActions.AddComment(this.article.slug, requestObject));
    }

    onDeleteComment(comment) {
        this.store.dispatch(new EntityActions.Delete(slices.COMMENT, comment.id));
        // this.commentsService.destroy(comment.id, this.article.slug)
        //     .subscribe(
        //     (success) => {
        //         this.comments = this.comments.filter((item) => item !== comment);
        //     }
        //     );
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

    ngOnDestroy() {
        this.commentsSub && this.commentsSub.unsubscribe();
        this.currentUserSub && this.currentUserSub.unsubscribe();
        this.articleSub && this.articleSub.unsubscribe();
    }
}
