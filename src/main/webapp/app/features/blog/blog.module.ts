import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';

import { BlogPage } from './blog.page';
import { ArticleModule } from './article/article.module';
import { EditorModule } from './editor/editor.module';
import { HomeModule } from './home/home.module';
import { ProfileModule } from './profile/profile.module';
import { BlogRouting } from './blog.routing';
import { GreatBigExampleApplicationSharedModule } from '../../shared/shared.module';
import { customHttpProvider } from '../../blocks/interceptor/http.provider';
import { SharedModule } from './shared/shared.module';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';
import { ArticleEffects } from '../../core/store/article/article.effects';

@NgModule({
    imports: [
        ArticleModule,
        BlogRouting,
        EditorModule,
        HomeModule,
        ProfileModule,
        SharedModule,
        EffectsModule.run(ArticleEffects),
    ],
    declarations: [
        BlogPage,
        FooterComponent,
        HeaderComponent
    ],
    providers: [
        customHttpProvider()
    ]
})
export class BlogModule { }
