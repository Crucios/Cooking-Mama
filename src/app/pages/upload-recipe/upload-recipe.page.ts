import { Component, OnInit } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Recipe } from '../../models/recipe.model';
import { map } from 'rxjs/operators';
import { Ingredient } from '../../models/ingredient.model';
import { Media } from '../../models/media.model';
import { Direction } from '../../models/direction.model';
import { AngularFireStorage } from '@angular/fire/storage';
import { LoadingController } from '@ionic/angular';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-upload-recipe',
  templateUrl: './upload-recipe.page.html',
  styleUrls: ['./upload-recipe.page.scss'],
})
export class UploadRecipePage implements OnInit {
  recipeCloud: Observable<Recipe[]>;
  private recipeColumn: AngularFirestoreCollection<Recipe>;
  private ingredientsColumn: AngularFirestoreCollection<Ingredient>;
  private directionsColumn: AngularFirestoreCollection<Direction>;

  selectedFile: any;
  loading: HTMLIonLoadingElement;
  img1: any;
  constructor(
    private fireStore: AngularFirestore,
    private store: AngularFireStorage,
    private loadingController : LoadingController
  ) {
    this.recipeColumn = this.fireStore.collection<Recipe>('Recipes');
    this.recipeCloud = this.recipeColumn.valueChanges();
    this.ingredientsColumn = this.fireStore.collection<Ingredient>('Ingredients');
    this.directionsColumn = this.fireStore.collection<Direction>('Directions');
  }

  ngOnInit() {
  }

  add_ingredients_field(){
    let markup = "<ion-row><ion-col><ion-input class=\"ingredients-field\" placeholder=\"1kg Sugar\"></ion-input></ion-col></ion-row>";
    document.getElementById("ingredients-section").outerHTML += markup;
  }
  
  add_directions_field(){
    let markup = "<ion-row><ion-col><ion-input class=\"ingredients-field\" placeholder=\"Boil the water for 10 minutes\"></ion-input></ion-col></ion-row>";
    document.getElementById("directions-section").outerHTML += markup;
  }

  upload_recipe(){
    var recipeId;
    let classIngredients = <HTMLInputElement>document.getElementsByClassName(elementId);
    let classDirections = <HTMLInputElement>document.getElementsByClassName(elementId);
    
    // Insert Recipe
    let tempRecipe = {
      id : 'string',
      title : 'stringRecipe',
      time_cook : 'stringTime',
      imageLink : 'File',
      id_user : 'stringUser',
      id_category : 'stringCategory'
    }

    this.recipeColumn.add(tempRecipe).then(async resp => {
      recipeId = resp.id;
      console.log(recipeId);
      const imageUrl = await this.uploadFile(resp.id, this.selectedFile);
      this.recipeColumn.doc(resp.id).update({
        id: resp.id,
        imageLink: imageUrl || null
      }).catch(error => {
        console.log(error);
      });
      // insert ingredients to firebase
      for(let i=0;i<classIngredients.length;i++){
        let tempIngredient = {
          id : 'string',
          description : classIngredients[i].nodeValue,  
          id_recipe : recipeId
        }
        this.ingredientsColumn.add(tempIngredient).then(resp => {
          this.ingredientsColumn.doc(resp.id).update({
            id: resp.id
          }).catch(error => {
            console.log(error);
          });
        });
      }

      // Insert Directions to Firebase
      for(let i=0;i<classDirections.length;i++){
        let tempDirection = {
          id : 'string',
          description : classDirections[i].nodeValue,  
          id_recipe : recipeId
        }
        this.directionsColumn.add(tempDirection).then(async resp => {
          this.directionsColumn.doc(resp.id).update({
            id: resp.id
          }).catch(error => {
            console.log(error);
          });
        });
      }
    });
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    return this.loading.present();
  }

  async uploadFile(id, file): Promise<any> {
    if(file && file.length){
      try{
        this.presentLoading();
        const task = await this.store.ref('recipes').child(id).put(file[0]);
        this.loading.dismiss();
        return this.store.ref(`recipes/${id}`).getDownloadURL().toPromise();
      } catch(error){
        console.log(error);
      }
    }
  }

  remove(item){
    console.log(item);
    if(item.imageUrl){
      this.store.ref(`recipes/${item.id}`).delete();
    }
    this.recipeColumn.doc(item.id).delete();
  }

  fileChange(event){
    this.selectedFile = event.target.files
    if(event.target.files && event.target.files[0]){
      let reader = new FileReader();

      reader.onload = (event:any) => {
        this.img1 = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
      let fileList: FileList = event.target.files;  
      let file: File = fileList[0];
      console.log(file);
  }
}