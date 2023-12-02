import { Component, OnInit } from '@angular/core';
import { Toaster } from 'ngx-toast-notifications';
import { StreamingService } from '../service/streaming.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-streaming-edit',
  templateUrl: './streaming-edit.component.html',
  styleUrls: ['./streaming-edit.component.scss']
})
export class StreamingEditComponent implements OnInit {

  streaming_selected:any = null;
  title: any = '';
  subtitle: any = '';
  description: any = '';

  IMAGEN_FILE: any;
  IMAGEN_PREVISUALIZA: any;

  genre_id: any;
  tags_selected: any = [];
  actors_selected: any = [];
  type: any = 1;


  TAGS: any = [];
  GENRES: any = [];
  ACTORS: any = [];

  isLoading: any;

  //
  selected_tag: any;
  selected_actor: any;

  streaming_id: any = null;
  constructor(
    public streamingService: StreamingService,
    public toaster: Toaster,
    public activedRouter: ActivatedRoute,
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.isLoading = this.streamingService.isLoading$;
    this.activedRouter.params.subscribe((resp:any) =>{
      console.log(resp);
      this.streaming_id = resp.id;
    })
    this.streamingService.configAll().subscribe((resp: any) => {
      console.log(resp);
      this.TAGS = resp.tags;
      this.GENRES = resp.genres;
      this.ACTORS = resp.actors;
      this.showStreaming();
    })
  }
  showStreaming(){
    this.streamingService.showStreaming(this.streaming_id).subscribe((resp:any) =>{
      console.log(resp);
      if(resp.message == 404){
        this.toaster.open({text: "El streaming no existe", caption: "Mensage de validación", type: 'danger'});
        this.router.navigateByUrl("/streamings/lista");
      }else{
        this.streaming_selected = resp.streaming;
        this.title = this.streaming_selected.title;
        this.subtitle = this.streaming_selected.subtitle;
        this.genre_id = this.streaming_selected.genre_id;
        this.description = this.streaming_selected.description;
        this.IMAGEN_PREVISUALIZA = this.streaming_selected.imagen;
        this.type = this.streaming_selected.type;

        this.tags_selected = this.streaming_selected.tags_multiples;
        this.actors_selected = this.streaming_selected.actors;
      }
    })
  }

  processFile($event: any) {
    if($event.target.files[0].type.indexOf("image") < 0 ){
      this.toaster.open({text: "El archivo no es una imagen", caption: "Mensage de validación", type: 'danger'});
      return;
    }
    //
    this.IMAGEN_FILE = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.IMAGEN_FILE);
    reader.onloadend = () => this.IMAGEN_PREVISUALIZA = reader.result;
    this.streamingService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.streamingService.isLoadingSubject.next(false);
    },50);
  }

  addTags() {

    if (this.selected_tag) {
      let INDEX = this.tags_selected.findIndex((item: any) => item.id == this.selected_tag);

      if (INDEX != -1) {
        this.toaster.open({ text: 'El tag seleccionado ya existe en la lista',type: 'warning' });
        return;
      } else {
        let TAG_S = this.TAGS.find((item:any) => item.id == this.selected_tag);
        this.tags_selected.unshift(TAG_S);
        this.selected_tag = null;
      }
    }else{
      this.toaster.open({ text: 'Necesitas seleccionar un TAG',type: 'warning' });
        return;
    }

  }

  deleteTag(i:any){
    this.tags_selected.splice(i,1);
  }

  addActors() {

    if (this.selected_actor) {
      let INDEX = this.actors_selected.findIndex((item: any) => item.id == this.selected_actor);

      if (INDEX != -1) {
        this.toaster.open({ text: 'El actor seleccionado ya existe en la lista',type: 'warning' });
        return;
      } else {
        let actor_S = this.ACTORS.find((item:any) => item.id == this.selected_actor);
        this.actors_selected.unshift(actor_S);
        this.selected_actor = null;
      }
    }else{
      this.toaster.open({ text: 'Necesitas seleccionar un Actor',type: 'warning' });
        return;
    }

  }

  deleteActor(actors_selec:any){
    let INDEX_ACTOR_SELECTED = this.actors_selected.findIndex((item:any) => item.id == actors_selec.id);
    if(INDEX_ACTOR_SELECTED != -1){
      this.actors_selected.splice(INDEX_ACTOR_SELECTED,1);
    }
  }

  save(){

    if(!this.title || !this.description || !this.genre_id || this.tags_selected.length == 0 || this.actors_selected.length == 0 ||
      !this.subtitle){
        this.toaster.open({text: 'Es obligatorio llenar todos los campos',type: 'danger'});
        return;
    }

    let formData = new FormData();
    formData.append("title",this.title);
    formData.append("description",this.description);
    formData.append("genre_id",this.genre_id);
    formData.append("subtitle",this.subtitle);
    if(this.IMAGEN_FILE){
      formData.append("img",this.IMAGEN_FILE);
    }

    // *
    let TAGSt:any = [];
    this.tags_selected.forEach((tag:any) => {
      TAGSt.push(tag.title);
    });
    // ["SUSPESO","TERROR","COMEDIA"] -> "SUSPESO","TERROR","COMEDIA"
    formData.append("tags",TAGSt);
    formData.append("actors_selected",JSON.stringify(this.actors_selected));
    // *

    this.streamingService.editStreaming(this.streaming_selected.id,formData).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toaster.open({text: resp.message_text, type: 'warning'});
        return;
      }else{
        this.toaster.open({text: "El streaming se editó correctamente", type: 'primary'});
      }
    })
  }

}
