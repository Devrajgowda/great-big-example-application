import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ArticleComponent } from './article.component';
import { UserRouteAccessService } from '../../../shared';

const routes: Routes = [
    {
        path: ':slug',
        component: ArticleComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'greatBigExampleApplicationApp.blog.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const routedComponents = [ArticleComponent];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ArticleRouting { }
