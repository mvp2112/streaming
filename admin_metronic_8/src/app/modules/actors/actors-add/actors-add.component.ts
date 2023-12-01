import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { ActorsService } from '../service/actors.service';

@Component({
  selector: 'app-actors-add',
  templateUrl: './actors-add.component.html',
  styleUrls: ['./actors-add.component.scss']
})
export class ActorsAddComponent implements OnInit {

  @Output() ActorC: EventEmitter<any> = new EventEmitter();

  full_name: string = ''
  profesion: string = ''
  type: string = '1'

  IMAGEN_PREVIZUALIZACION:any = './assets/media/avatars/300-15.jpg';
  IMAGEN_FILE:any = null;
  constructor(
    public modal: NgbActiveModal,
    public toaster: Toaster,
    public actorService: ActorsService,
  ) { }

  ngOnInit(): void {
  }

  close(){
    this.modal.close();
  }

  save(){

    if(!this.IMAGEN_FILE || !this.full_name || !this.profesion){
      this.toaster.open({text: "Necesitas ingresar todos los campos", caption: 'Validación', type: 'danger'});
      return;
    }
    let formData = new FormData();
    formData.append("img",this.IMAGEN_FILE)
    formData.append("full_name",this.full_name);
    formData.append("profesion",this.profesion);
    formData.append("type",this.type);
    formData.append("state",1+"");
    this.actorService.registerActor(formData).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toaster.open({text: resp.message_text, caption: 'Validación', type: 'danger'});
      }else{
        this.ActorC.emit(resp.actors);
        this.toaster.open({text: "El Actor se registró correctamente", caption: 'Validación', type: 'primary'});
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
