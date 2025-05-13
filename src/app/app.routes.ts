import { Routes } from '@angular/router';
import { HomePageComponent } from './Bingo/pages/home-page/home-page.component';
import { BingoPageComponent } from './Bingo/pages/bingo-page/bingo-page.component';

export const routes: Routes = [
  {path: '', component: BingoPageComponent},
  { path: 'bingo', component: BingoPageComponent},
  { path: '**', redirectTo: ''}
];
