import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatIconRegistry, MatSidenav } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Event as RouterEvent, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs'
import { NavMenuService } from '../__services__/nav-menu.service';
import * as mainRoutes from './main-routes.json';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy, AfterViewInit {
  position: String = 'side';
  watcher: Subscription;
  activeRoute = '';

  routes = mainRoutes.routes;

  @ViewChild('sidenav') sidenav: MatSidenav;

  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private media: MediaObserver,
    private router: Router,
    private navMenuService: NavMenuService,
    private cd: ChangeDetectorRef
  ) {
    this.registerIcons();
    this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        this.activeRoute = event.url;
      }
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.navMenuService.setSidenav(this.sidenav);
    this.createMediaWatcher();
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    if (this.watcher) {
      this.watcher.unsubscribe();
    }
  }

  registerIcons = () => {
    const logos = [
      { name: 'logo', url: 'assets/logo.svg' },
      { name: 'dashboard', url: 'assets/sidebar-icons/ic_active_dashboard.svg' },
      { name: 'dashboard-inactive', url: 'assets/sidebar-icons/ic_inactive_dashboard.svg' },
      { name: 'routes', url: 'assets/sidebar-icons/ic_active_routes.svg' },
      { name: 'routes-inactive', url: 'assets/sidebar-icons/ic_inactive_routes.svg' },
      { name: 'trips', url: 'assets/sidebar-icons/ic_active_location.svg' },
      { name: 'trips-inactive', url: 'assets/sidebar-icons/ic_inactive_location.svg' },
      { name: 'cabs', url: 'assets/sidebar-icons/ic_active_cabs.svg' },
      { name: 'cabs-inactive', url: 'assets/sidebar-icons/ic_inactive_cabs.svg' },
      { name: 'settings', url: 'assets/sidebar-icons/ic_active_settings.svg' },
      { name: 'settings-inactive', url: 'assets/sidebar-icons/ic_inactive_settings.svg' }
    ];

    logos.forEach(item => {
      this.iconRegistry.addSvgIcon(item.name,
        this.sanitizer.bypassSecurityTrustResourceUrl(item.url));
    });
  };

  createMediaWatcher = () => {
    this.watcher = this.media.media$.subscribe((change: MediaChange) => {
      if (change.mqAlias === 'sm' || change.mqAlias === 'xs') {
        this.navMenuService.close();
        this.position = 'over';
      } else {
        this.navMenuService.open();
        this.position = 'side';
      }
    });
  };

  menuClicked = (shouldCloseWhenClicked) => {
    if (this.position === 'over' && shouldCloseWhenClicked) {
      this.navMenuService.close();
    }
  };
}
