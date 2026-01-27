import { Component, OnInit, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ImageComponent } from './pages/image/image.component';
import { ChatComponent } from './pages/chat/chat.component';
import { CricketComponent } from './pages/cricket/cricket.component';
import { SidemenuComponent } from './components/sidemenu/sidemenu.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ImageComponent, ChatComponent, CricketComponent, SidemenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  isDarkMode = true;

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    this.isDarkMode = savedTheme === 'dark';
    this.applyTheme();
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
  }

  private applyTheme() {
    const theme = this.isDarkMode ? 'dark' : 'light';
    this.renderer.setAttribute(document.documentElement, 'data-theme', theme);
    localStorage.setItem('theme', theme);
  }
}
