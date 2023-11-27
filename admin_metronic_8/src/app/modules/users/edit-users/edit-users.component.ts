import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { UsersService } from '../service/users.service';

@Component({
  selector: 'app-edit-users',
  templateUrl: './edit-users.component.html',
  styleUrls: ['./edit-users.component.scss']
})
export class EditUsersComponent implements OnInit {

  @Input() USER:any;
  @Output() UserE: EventEmitter<any> = new EventEmitter();

  name:string = '';
  surname:string = '';
  email:string = '';
  password:string = '';
  repit_password:string = '';
  role_id:number = 1;
  state:number = 1;

  IMAGEN_PREVIZUALIZACION:any = './assets/media/avatars/300-6.jpg';
  IMAGEN_FILE:any = null;
  constructor(
    public modal: NgbActiveModal,
    public toaster: Toaster,
    public userService: UsersService,
  ) { }

  ngOnInit(): void {
    this.name = this.USER.name;
    this.surname = this.USER.surname;
    this.email = this.USER.email;
    this.IMAGEN_PREVIZUALIZACION = this.USER.avatar;
    this.state = this.USER.state;
  }

  close(){
    this.modal.close();
  }

  save(){

    if(!this.name || !this.surname || !this.email || !this.role_id){
      this.toaster.open({text: "Necesitas ingresar todos los campos", caption: 'Validación', type: 'danger'});
      return;
    }
    if(this.password && (this.password != this.repit_password)){
      this.toaster.open({text: "Las contraseñas deben ser iguales", caption: 'Validación', type: 'danger'});
      return;
    }

    let formData = new FormData();
    if(this.IMAGEN_FILE){
      formData.append("img",this.IMAGEN_FILE);
    }
    formData.append("name",this.name);
    formData.append("surname",this.surname);
    formData.append("email",this.email);
    if(this.password){
      formData.append("password",this.password);
    }
    formData.append("role_id",this.role_id+"");
    formData.append("state",this.state+"");
    this.userService.editUser(this.USER.id,formData).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toaster.open({text: resp.message_text, caption: 'Validación', type: 'danger'});
      }else{
        this.UserE.emit(resp.user);
        this.toaster.open({text: "El usuario se editó correctamente", caption: 'Validación', type: 'primary'});
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
