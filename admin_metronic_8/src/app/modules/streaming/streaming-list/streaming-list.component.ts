import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StreamingService } from '../service/streaming.service';
import { StreamingDeleteComponent } from '../streaming-delete/streaming-delete.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-streaming-list',
  templateUrl: './streaming-list.component.html',
  styleUrls: ['./streaming-list.component.scss']
})
export class StreamingListComponent implements OnInit {

  search:any = null;
  state:any = null;

  STREAMINGS:any = [];

  isLoading:any;
  constructor(
    public modalService: NgbModal,
    public streamingService: StreamingService,
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.listStreamings();
    this.isLoading = this.streamingService.isLoading$;
  }

  getType(type:any){
    let value = "";
    type = parseInt(type);
    switch (type) {
      case 1:
        value = "MOVIE";
        break;
        case 2:
          value = "TV SHOW";
        break;
        case 3:
          value = "VIDEO";
        break;
      default:
        break;
    }
    return value;
  }
  listStreamings(){
    this.streamingService.listStreaming(this.search,this.state).subscribe((resp:any) => {
      console.log(resp);
      this.STREAMINGS = resp.streamings.data;
    })
  }


  editStreaming(STREAMING:any){
    this.router.navigateByUrl("/streamings/lista/editar/"+STREAMING.id);
  }

  deleteStreaming(STREAMING:any){
    const modalRef = this.modalService.open(StreamingDeleteComponent,{centered: true, size: 'md'});
    modalRef.componentInstance.STREAMING = STREAMING;

    modalRef.componentInstance.StreamingD.subscribe((Streaming:any) => {
     let index = this.STREAMINGS.findIndex((item:any) => item.id == STREAMING.id);
     if(index != -1){
     this.STREAMINGS.splice(index,1);
     }
    });
  }

}
