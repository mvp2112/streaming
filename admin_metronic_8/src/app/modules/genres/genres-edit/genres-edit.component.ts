import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { GenresService } from '../service/genres.service';

@Component({
  selector: 'app-genres-edit',
  templateUrl: './genres-edit.component.html',
  styleUrls: ['./genres-edit.component.scss']
})
export class GenresEditComponent implements OnInit {

  @Input() GENRE:any;
  @Output() GenreE: EventEmitter<any> = new EventEmitter();

  title: string = ''
  type: string = '1'
  state: number = 1;

  IMAGEN_PREVIZUALIZACION:any = './assets/media/avatars/21.jpg';
  IMAGEN_FILE:any = null;
  constructor(
    public modal: NgbActiveModal,
    public toaster: Toaster,
    public genresService: GenresService,
  ) { }

  ngOnInit(): void {
    this.title = this.GENRE.title;
    this.type = this.GENRE.type;
    this.state = this.GENRE.state;
    this.IMAGEN_PREVIZUALIZACION = this.GENRE.imagen;
  }

  close(){
    this.modal.close();
  }

  save(){

    if(!this.title){
      this.toaster.open({text: "Necesitas ingresar todos los campos", caption: 'Validación', type: 'danger'});
      return;
    }
    let formData = new FormData();
    if(this.IMAGEN_FILE) {
      formData.append("img",this.IMAGEN_FILE)
    }
    formData.append("title",this.title);
    formData.append("type",this.type);
    formData.append("state",this.state+"");
    this.genresService.editGenre(this.GENRE.id,formData).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toaster.open({text: resp.message_text, caption: 'Validación', type: 'danger'});
      }else{
        this.GenreE.emit(resp.genre);
        this.toaster.open({text: "El genero se editó correctamente", caption: 'Validación', type: 'primary'});
        this.modal.close();
      }
    })
  }

  processAvatar($event:any){
    if($event.target.files[0].type.indexOf("image") < 0 ){
      this.toaster.open({text: "El archivo no es una imagen", caption: "Mensage de validación", type: 'danger'});
      return;
    }
    //
    this.IMAGEN_FILE = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.IMAGEN_FILE);
    reader.onloadend = () => this.IMAGEN_PREVIZUALIZACION = reader.result;
  }

}
