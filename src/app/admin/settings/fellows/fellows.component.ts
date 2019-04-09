import { Component, OnInit } from '@angular/core';
import { AppEventService } from 'src/app/shared/app-events.service';
import { FellowsService } from '../../__services__/fellows.service';
import { ISerializedFellowDetail } from 'src/app/shared/models/fellows.model';

@Component({
  selector: 'app-fellows',
  templateUrl: './fellows.component.html',
  styleUrls: [
    './fellows.component.scss',
    '../../../auth/login-redirect/login-redirect.component.scss'
  ]
})
export class FellowsComponent implements OnInit {
  isLoading: boolean;
  fellows: ISerializedFellowDetail[];
  totalItems: number;
  pageSize: number;
  pageNumber: number;
  displayText = 'No fellows currently on routes';

  constructor(
    private appEventService: AppEventService,
    private fellowService: FellowsService
  ) {
    this.pageNumber = 1;
    this.pageSize = 9;
  }

  loadFellows() {
    this.isLoading = true;
    this.fellowService.getFellows(this.pageSize, this.pageNumber).subscribe(
      data => {
        const { fellows, pageMeta } = data;
        this.fellows = fellows.map(this.serializeFellow);
        this.totalItems = pageMeta.totalItems;
        this.isLoading = false;
        this.appEventService.broadcast({
          name: 'updateHeaderTitle',
          content: { badgeSize: this.totalItems }
        });
      },
      error => {
        this.isLoading = false;
        this.displayText =
          error.status === 404
            ? this.displayText
            : 'There was an error fetching this data';
      }
    );
  }

  serializeFellow(fellow: any): ISerializedFellowDetail {
    return {
      id: fellow.userId,
      name: fellow.name,
      image: fellow.picture,
      partner: fellow.placement ? fellow.placement.client : 'N/A',
      tripsTaken: `${fellow.tripsTaken} / ${fellow.totalTrips}`,
      startDate: fellow.placement && fellow.placement.created_at,
      endDate: fellow.placement && fellow.placement.next_available_date
    };
  }

  setPage(page: number): void {
    this.pageNumber = page;
    this.loadFellows();
  }

  ngOnInit() {
    this.loadFellows();
  }
}