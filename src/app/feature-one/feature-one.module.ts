import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FeatureOneComponent } from './feature-one.component';
import { FeatureOneRoutes } from './feature-one.routes';
import { FeatureSpecificCanActivateGuard } from './_guards';

@NgModule({
  declarations: [FeatureOneComponent],
  imports: [CommonModule, RouterModule.forChild(FeatureOneRoutes)],
  providers: [FeatureSpecificCanActivateGuard]
})
export class FeatureOneModule {}
