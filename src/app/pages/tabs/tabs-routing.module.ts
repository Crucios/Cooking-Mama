import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then( m => m.HomePageModule)
      },
      {
        path: 'upload-recipe',
        loadChildren: () => import('../upload-recipe/upload-recipe.module').then( m => m.UploadRecipePageModule)
      },
      {
        path: 'bookmark-recipes',
        loadChildren: () => import('../bookmark-recipes/bookmark-recipes.module').then( m => m.BookmarkRecipesPageModule)
      },
      {
        path: 'details-recipe-online',
        loadChildren: () => import('../details-recipe-online/details-recipe-online.module').then( m => m.DetailsRecipeOnlinePageModule)
      },
    ],
  },
  {
    path: 'tabs',
    redirectTo: './tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}