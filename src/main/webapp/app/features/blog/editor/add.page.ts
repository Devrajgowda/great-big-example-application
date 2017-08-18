import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import * as fromRoot from '../../../core/store';
import { Article } from '../../../core/store/article/article.model';
import { slices } from '../../../core/store/util';
import * as EntityActions from '../../../core/store/entity/entity.actions';

@Component({
    selector: 'jhi-add-page',
    templateUrl: './add.page.html'
})
export class AddPage implements OnInit, OnDestroy {
    articleSub: Subscription;
    article: Article;
    articleForm: FormGroup;
    tagField = new FormControl();
    errors: Object = {};
    isSubmitting = false;

    constructor(
        private store: Store<fromRoot.RootState>,
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder
    ) {
        // use the FormBuilder to create a form group
        this.articleForm = this.fb.group({
            title: '',
            description: '',
            body: '',
        });
        // Optional: subscribe to value changes on the form
        // this.articleForm.valueChanges.subscribe(value => this.updateArticle(value));
    }

    ngOnInit() {
        this.articleSub = this.store.select(fromRoot.getTempArticle).subscribe((article) => {
            if (article) {
                this.article = article;
                this.articleForm.patchValue(article);
            }
        });
        if (this.route.snapshot.url.length == 1) {
            this.store.dispatch(new EntityActions.AddTemp(slices.ARTICLE));
        }
    }

    addTag() {
        // retrieve tag control
        const tag = this.tagField.value;
        // only add tag if it does not exist yet
        if (this.article.tagList.indexOf(tag) < 0) {
            this.article.tagList.push(tag);
        }
        // clear the input
        this.tagField.reset('');
    }

    removeTag(tagName: string) {
        this.article.tagList = this.article.tagList.filter((tag) => tag !== tagName);
    }

    submitForm() {
        this.isSubmitting = true;

        // update the model
        this.updateArticle(this.articleForm.value);

        const submission = this.article;
        this.store.dispatch(new EntityActions.Add(slices.ARTICLE, submission));
    }

    updateArticle(values: Object) {
        this.store.dispatch(new EntityActions.Patch(slices.ARTICLE, { id: this.article.id, ...values }));
        // (<any>Object).assign(this.article, values);
    }

    ngOnDestroy() {
        this.articleSub && this.articleSub.unsubscribe();
        if (this.articleForm.value.id === EntityActions.TEMP) {
            this.store.dispatch(new EntityActions.DeleteTemp(slices.CONTACT));
        }
    }
}
