import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidemenu',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidemenu.component.html',
  styleUrl: './sidemenu.component.css'
})
export class SidemenuComponent {
  @Input() isDarkMode = true;
  @Output() themeToggle = new EventEmitter<void>();
  menuItems = [
    {
      label: 'Chat',
      route: '/chat',
      icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
    },
    {
      label: 'Cricket Bot',
      route: '/cricket',
      icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
    },
    {
      label: 'Image Generator',
      route: '/image',
      icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
    }
  ];

  bottomMenuItems = [
    {
      label: 'Feedback',
      action: 'feedback',
      icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z'
    },
    {
      label: 'Sign Out',
      action: 'signout',
      icon: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
    }
  ];

  handleAction(action: string) {
    if (action === 'feedback') {
      console.log('Feedback clicked');
      // Add your feedback logic here
    } else if (action === 'signout') {
      console.log('Sign out clicked');
      // Add your sign out logic here
    } else if (action === 'theme') {
      this.themeToggle.emit();
    }
  }

  onMenuHover(event: Event, isEntering: boolean) {
    const target = event.currentTarget as HTMLElement;
    if (isEntering) {
      target.style.background = 'var(--hover-sidebar)';
    } else {
      if (!target.classList.contains('active')) {
        target.style.background = 'transparent';
      }
    }
  }

  onButtonHover(event: Event, action: string, isEntering: boolean) {
    const target = event.currentTarget as HTMLElement;
    if (isEntering) {
      target.style.background = action === 'signout' ? 'rgba(153, 27, 27, 0.3)' : 'var(--hover-sidebar)';
    } else {
      target.style.background = 'transparent';
    }
  }
}
