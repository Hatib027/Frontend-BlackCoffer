import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})



export class NavbarComponent {
  @ViewChild(MatSidenav)
  sidenav !: MatSidenav;
}
