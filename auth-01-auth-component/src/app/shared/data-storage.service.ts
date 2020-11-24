import { AuthService } from "./../auth/auth.service";
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { exhaustMap, map, take, tap } from "rxjs/operators";

import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";
import { Observable } from 'rxjs';

@Injectable({ providedIn: "root" })
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private AuthService: AuthService
  ) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http
      .put(
        "https://ng-course-recipe-book-65f10.firebaseio.com/recipes.json",
        recipes
      )
      .subscribe((response) => {
        console.log(response);
      });
  }

  fetchRecipes(){
    // take(1) means we only wanna take one value from that observable  and it automatically unsubscribes
    //it means basically subscribe and then unsubscribe

    //exhasustMap take what previosly was take(1) and passes it (-> the user ) and replaces the observable it was piped from (-> the authservice observable)
       
    this.AuthService.user.pipe(
      take(1),
      exhaustMap((user) => {
        //this is the observable it will replace the upper one
        return this.http.get<Recipe[]>(
          "https://ng-course-recipe-book-65f10.firebaseio.com/recipes.json",
          {
            params: new HttpParams().set('auth',user.token)
          }
        )
      }),
      map((recipes) => {
        return recipes.map((recipe) => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : [],
          };
        });
      }),
      tap((recipes) => {
        this.recipeService.setRecipes(recipes);
      })
    );
  }
}
