import { BaseInventoryComponent } from './../../base-inventory/base-inventory.component';
import { IDriverModel } from './../../../shared/models/driver.model';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AppEventService} from '../../../shared/app-events.service';
import {ActivatedRoute} from '@angular/router';
import {MatDialog} from '@angular/material';
import {ITEMS_PER_PAGE} from '../../../app.constants';
import {DriversInventoryService} from '../../__services__/drivers-inventory.service';

@Component({
  selector: 'app-drivers',
  templateUrl: './driver-inventory.component.html',
  styleUrls: [
    '../../cabs/cab-inventory/cab-inventory.component.scss',
    '../../../auth/login-redirect/login-redirect.component.scss'
  ]
})
export class DriverInventoryComponent extends BaseInventoryComponent implements OnInit {
  drivers: IDriverModel[] = [];
  displayText = 'No Drivers yet';
  createText = 'Add a Driver';
  updateSubscription: any;
  driversSubscription: any;

  @Input() providerTabRequestType: string;
  @Output() driverInfoEventEmitter = new EventEmitter();

  constructor(
    public driversService: DriversInventoryService,
    protected appEventsService: AppEventService,
    protected activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
  ) {
    super(appEventsService, activatedRoute, dialog);
  }

  ngOnInit() {
    this.driversSubscription = this.activatedRoute.params.subscribe(
      data => this.updateInventory.call(this, data)
    );
    this.updateSubscription = this.appEventsService.subscribe(
      'newDriver', () => this.getInventory.call(this)
    );
  }

  loadData (size, page, sort, providerId): void {
    this.driversService.get(size, page, sort, providerId ).subscribe(driversData => {
        const {
          data: {
            data,
            pageMeta: {totalItems}
          }
        } = driversData;
        this.totalItems = totalItems;
        this.drivers = data;
        this.isLoading = false;
        this.emitData(this.driverInfoEventEmitter);
      },
      () => {
        this.isLoading = false;
        this.displayText = `Oops! We're having connection problems.`;
      });
  }
}
