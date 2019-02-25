import { Routes } from '@angular/router';
import { FeatureOneComponent } from './feature-one.component';
import { FeatureSpecificCanActivateGuard } from './_guards';

export const FeatureOneRoutes: Routes = [
  {
    path: '',
    component: FeatureOneComponent,
    canActivate: [FeatureSpecificCanActivateGuard]
  }
];
