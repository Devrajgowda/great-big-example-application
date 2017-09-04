import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProfileArticlesComponent } from './profile-articles/profile-articles.component';
import { ProfileFavoritesComponent } from './profile-favorites/profile-favorites.component';
import { ProfileComponent } from './profile.component';
import { UserRouteAccessService } from '../../../shared';

const routes: Routes = [
    {
        path: ':username',
        component: ProfileComponent,
        children: [
            {
                path: '',
                component: ProfileArticlesComponent
            },
            {
                path: 'favorites',
                component: ProfileFavoritesComponent
            }
        ],
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'greatBigExampleApplicationApp.profile.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const routedComponents = [ProfileComponent];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProfileRouting { }
