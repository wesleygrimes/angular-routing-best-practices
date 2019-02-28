<div class="ultimate-courses-banner"><a href="https://ultimatecourses.com/angular?ref=76683_ttll_neb"><img src="https://ultimatecourses.com/assets/img/banners/ultimate-angular-leader.svg" style="width:100%;max-width:100%"></a></div>

![](https://wesleygrimes.com/assets/post_headers/routing.jpg)

## Before We Get Started

This article is not intended to be a tutorial on routing in Angular. If you are new to Routing in Angular then I highly recommend you check out one of the the following resources:

- [Ultimate Courses](https://bit.ly/2WubqhW)
- [Official Angular Docs](https://angular.io/guide/router)

## Background

The following represents a pattern that I've developed at my day job after building several enterprise Angular applications. While most online tutorials do a great job laying out the fundamentals, I had a hard time locating articles that showed recommended conventions and patterns for large and scalable applications.

With this pattern you should have a clean and concise organization for all routing related concerns in your applications.

## Prerequisites

For context, this article assumes you are using the following version of Angular:

- Angular v7.2.6

---

## Best Practice #1 - Create a top-level Routes array file

> The official [Angular docs recommend](https://angular.io/guide/router#refactor-the-routing-configuration-into-a-routing-module) creating a full-blown `app-routing.module.ts` for your top-level routing. I have found this extra layer to be unnecessary in most cases.

> HOT TIP: Only register top-level routes here, if you plan to implement feature modules, then the child routes would live underneath the respective `feature.routes.ts` file. We want to keep this top-level routes file as clean as possible and follow the component tree structure.

Let's go with the following approach:

1. Create a new file named `app.routes.ts` in the root `src/app` directory. This file will hold our top-level `Routes` array. We will come back later throughout the article and fill this in. For now, let's scaffold it with the following contents:

   ```typescript
   import { Routes } from '@angular/router';

   export const AppRoutes: Routes = [];
   ```

2. Register `AppRoutes` in the `app.module.ts` file.

   - Import `AppRoutes` from `app.routes.ts`.
   - Import `RouterModule` from `@angular/router`.
   - Add `RouterModule.forRoot(AppRoutes)` to your `imports` array

   Your updated `app.module.ts` will look similar to the following:

   ```typescript
   import { NgModule } from '@angular/core';
   import { BrowserModule } from '@angular/platform-browser';
   import { RouterModule } from '@angular/router';
   import { AppComponent } from './app.component';
   import { AppRoutes } from './app.routes';

   @NgModule({
     declarations: [AppComponent],
     imports: [BrowserModule, RouterModule.forRoot(AppRoutes)],
     providers: [],
     bootstrap: [AppComponent]
   })
   export class AppModule {}
   ```

## Best Practice #2 - Create a feature-level Routes array file

In similar fashion to how we constructed the `app.routes.ts` we will create a `feature.routes.ts` to list out the individual routes for this feature module. We want to keep our routes as close to the source as possible. This will be in keeping with a clean code approach, and having a good separation of concerns.

1. Create a new file named `feature/feature.routes.ts` where `feature` matches the name of your `feature.module.ts` prefix. This file will hold our feature-level `Routes` array. Keeping in mind that you would replace `Feature` with the actual name of your module, let's scaffold it with the following contents:

   ```typescript
   import { Routes } from '@angular/router';

   export const FeatureRoutes: Routes = [];
   ```

2. Register `FeatureRoutes` in the `feature/feature.module.ts` file. We will make use of the `RouterModule.forChild` import so that these routes are automatically registered with lazy loading.

   - Import `FeatureRoutes` from `feature.routes.ts`.
   - Import `RouterModule` from `@angular/router`.
   - Add `RouterModule.forChild(FeatureRoutes)` to your `imports` array

   Your updated `feature/feature.module.ts` will look similar to the following:

   ```typescript
   import { CommonModule } from '@angular/common';
   import { NgModule } from '@angular/core';
   import { RouterModule } from '@angular/router';
   import { FeatureRoutes } from './feature.routes';

   @NgModule({
     declarations: [],
     imports: [CommonModule, RouterModule.forChild(FeatureRoutes)]
   })
   export class FeatureModule {}
   ```

   An example of a `feature.routes.ts` file with child route(s) may look like the following:

   ```typescript
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
   ```

## Best Practice #3 - Add Lazy Loaded Features to top-level Routes file

> Lazy loading is the concept of deferring load of code assets (javascript, styles) until the user actually needs to utilize the resources. This can bring large performance increases to perceived load times of your application as the entire code set doesn't have to download on first paint.

> Angular provides a nice way to handle this with the `loadChildren` option for a given route. More information can be found in the [official Angular docs](https://angular.io/guide/router#lazy-loading-route-configuration).

Once you've created your `app.routes.ts` and `*.routes.ts` files, you need to register any feature modules that you want to load lazily.

### Per Feature Module...

Update the `AppRoutes` array in the `app.routes.ts` file to include a new route the feature:

```typescript
import { Routes } from '@angular/router';

export const AppRoutes: Routes = [
  {
    path: 'feature',
    loadChildren: './feature/feature.module#FeatureModule'
  }
];
```

By adding the above route to the array, when the user requests `/feature` in the browser, Angular lazy loads the module using the path given and then automatically registers any routes defined in the `feature.routes.ts` `FeatureRoutes` array using the `RouterModule.forChild` import.

For each additional feature module, you would add another item to the `AppRoutes` array. If you have multiple features, it might look something like the following:

```typescript
import { Routes } from '@angular/router';

export const AppRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'feature-one'
  },
  {
    path: 'feature-one',
    loadChildren: './feature-one/feature-one.module#FeatureOneModule'
  },
  {
    path: 'feature-two',
    loadChildren: './feature-two/feature-two.module#FeatureTwoModule'
  }
];
```

## Best Practice #4 - Keep Router Guards Organized

Here are a few tips to keep your router guards organized. These are just guidelines, but I have found them to be very helpful.

### Name Your Guards Well

Guards should use the following naming convention:

- File Name: `name.function.guard.ts`
- Class Name: `NameFunctionGuard`

Each part being identified as:

- `name` - this is the name of your guard. What are you guarding against?
- `function` - this is the function your guard will be attached to. Angular supports `CanActivate`, `CanActivateChild`, `CanDeactivate`, and `Resolve`.

An example of an Auth Guard that is attached to the `CanActivate` function would be named as follows:

- File Name: `auth.can-activate.guard`
- Class Name: `AuthCanActivateGuard`

### Group under `_guards` folder

Organize all top-level guards under a folder named `src/app/_guards`. I have seen apps dump guards in the top level directory and this is messy, especially if you end up with more than a few guards.

### Use Barrel Exports

> The jury is still out on whether or not using barrel exports is officially considered a "best practice" or even supported by the Angular style guide. However, I am a big fan of the clean organization this provides. This method is offered as a suggestion.

Make sure that `src/app/_guards` has a nice and clean `index.ts` barrel export. Barrel exports are simply `index.ts` files that group together and export all public files from a directory. An example is as follows:

```typescript
export * from './auth.can-activate.guard';
export * from './require-save.can-deactivate.guard';
```

Without Barrel Exporting:

```typescript
import { AuthCanActivateGuard } from 'src/app/_guards/auth.can-activate.guard';
import { RequireSaveCanDeactivateGuard } from 'src/app/_guards/require-save.can-deactivate.guard';
```

With Barrel Exporting:

```typescript
import {
  AuthCanActivateGuard,
  RequireSaveCanDeactivateGuard
} from 'src/app/_guards';
```

An example application with a `_guards` directory would look as follows:

![](https://wesleygrimes.com/assets/post_headers/routing_directory.png)

### Organize Feature-Specific Route Guards

If you have guards that are _only_ used in a particular `FeatureRoutes` array, then store these routes underneath a folder named `_guards` underneath your feature folder. Make sure to follow the same naming conventions defined above, as well as barrel exporting.

- Place guards under a folder named `_guards` underneath your feature folder
- Make sure to create a barrel export `index.ts` for clean importing

An example feature directory with `_guards` would look as follows:

![](https://wesleygrimes.com/assets/post_headers/routing_feature_directory.png)

## Finished Application Structure

A completed application structure should look something like the following:

![](https://wesleygrimes.com/assets/post_headers/routing_completed_structure.png)

---

## Example GitHub Repository

I have created a demonstration repository on GitHub. Feel free to fork, clone, and submit PRs.

[https://github.com/wesleygrimes/angular-routing-best-practices](https://github.com/wesleygrimes/angular-routing-best-practices)

## Conclusion

It's important to remember that I have implemented these best practices in several "real world" applications. While I have found these best practices helpful, and maintainable, I do not believe they are an end-all be-all solution to organizing routes in projects; it's just what has worked for me. I am curious as to what you all think? Please feel free to offer any suggestions, tips, or best practices you've learned when building enterprise Angular applications with routing and I will update the article to reflect as such. Happy Coding!
