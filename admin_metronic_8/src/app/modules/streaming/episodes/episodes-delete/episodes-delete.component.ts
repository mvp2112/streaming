import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { StreamingEpisodesService } from '../../service/streaming-episodes.service';

@Component({
  selector: 'app-episodes-delete',
  templateUrl: './episodes-delete.component.html',
  styleUrls: ['./episodes-delete.component.scss']
})
export class EpisodesDeleteComponent implements OnInit {

  @Input() EPISODE:any;
  @Output() EpisodeD: EventEmitter<any> = new EventEmitter();

  constructor(
    public modal: NgbActiveModal,
    public toaster: Toaster,
    public streamingepisodeSeason: StreamingEpisodesService,
  ) { }

  ngOnInit(): void {
  }

  delete(){
    this.streamingepisodeSeason.deleteEpisode(this.EPISODE.id).subscribe((resp:any) => {
      this.EpisodeD.emit("");
      this.toaster.open({text: "El episodio se eliminó correctamente", type: 'warning'});
      this.close();
    })
  }

  close(){
    this.modal.close();
  }

}
