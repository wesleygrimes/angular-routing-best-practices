import { Routes } from '@angular/router';
import { FeatureOneComponent } from './feature-one.component';
import { FeatureSpecificCanActivateGuard } from './_guards';

export const FeatureOneRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'feature-one-component'
  },
  {
    path: 'feature-one-component',
    component: FeatureOneComponent,
    canActivate: [FeatureSpecificCanActivateGuard]
  }
];
