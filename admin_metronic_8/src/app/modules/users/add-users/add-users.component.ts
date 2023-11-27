import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { UsersService } from '../service/users.service';

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.scss']
})
export class AddUsersComponent implements OnInit {

  @Output() UserC: EventEmitter<any> = new EventEmitter();

  name:string = '';
  surname:string = '';
  email:string = '';
  password:string = '';
  repit_password:string = '';
  role_id:number = 1;

  IMAGEN_PREVIZUALIZACION:any = './assets/media/avatars/300-6.jpg';
  IMAGEN_FILE:any = null;
  constructor(
    public modal: NgbActiveModal,
    public toaster: Toaster,
    public userService: UsersService,
  ) { }

  ngOnInit(): void {
  }

  close(){
    this.modal.close();
  }

  save(){

    if(!this.IMAGEN_FILE || !this.name || !this.surname || !this.email || !this.password || !this.role_id){
      this.toaster.open({text: "Necesitas ingresar todos los campos", caption: 'Validación', type: 'danger'});
      return;
    }
    if(this.password != this.repit_password){
      this.toaster.open({text: "Las contraseñas deben ser iguales", caption: 'Validación', type: 'danger'});
      return;
    }

    let formData = new FormData();
    formData.append("img",this.IMAGEN_FILE)
    formData.append("name",this.name);
    formData.append("surname",this.surname);
    formData.append("email",this.email);
    formData.append("password",this.password);
    formData.append("role_id",this.role_id+"");
    formData.append("state",1+"");
    this.userService.registerUser(formData).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toaster.open({text: resp.message_text, caption: 'Validación', type: 'danger'});
      }else{
        this.UserC.emit(resp.user);
        this.toaster.open({text: "El usuario se registró correctamente", caption: 'Validación', type: 'primary'});
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
