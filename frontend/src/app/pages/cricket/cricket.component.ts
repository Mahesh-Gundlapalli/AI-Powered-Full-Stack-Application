import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { SharedModule } from '../../utils/shared.component';
import { AiService, Message } from '../../services/ai.service';

@Component({
  selector: 'app-cricket',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './cricket.component.html',
  styleUrl: './cricket.component.css'
})
export class CricketComponent implements AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  messages: Message[] = [];
  userInput: string = '';
  isLoading: boolean = false;
  private shouldScroll: boolean = false;

  constructor(private aiService: AiService) {
    this.messages.push({
      id: '1',
      content: '🏏 Welcome to Cricket Bot! Ask me anything about cricket history, rules, strategies, players, teams, and more!',
      role: 'assistant',
      timestamp: new Date()
    });
  }

  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  sendMessage() {
    if (!this.userInput.trim() || this.isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: this.userInput,
      role: 'user',
      timestamp: new Date()
    };

    this.messages.push(userMessage);
    this.shouldScroll = true;

    const messageCopy = this.userInput;
    this.userInput = '';
    this.isLoading = true;

    const typingMessage: Message = {
      id: 'typing',
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      isTyping: true
    };
    this.messages.push(typingMessage);
    this.shouldScroll = true;

    this.aiService.sendMessage(messageCopy, 'cricket').subscribe({
      next: (response) => {
        this.messages = this.messages.filter(m => m.id !== 'typing');
        this.messages.push(response);
        this.isLoading = false;
        this.shouldScroll = true;
      },
      error: (error) => {
        console.error('Error:', error);
        this.messages = this.messages.filter(m => m.id !== 'typing');
        this.isLoading = false;
      }
    });
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  clearChat() {
    this.messages = [{
      id: '1',
      content: '🏏 Chat cleared! Ready to answer your cricket questions!',
      role: 'assistant',
      timestamp: new Date()
    }];
  }
}
