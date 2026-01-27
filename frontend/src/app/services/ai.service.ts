import { environment } from './../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isTyping?: boolean;
  imageUrls?: string[];
}

export interface CricketResponse {
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  sendMessage(message: string, type: 'chat' | 'cricket' | 'image', numberOfImages?: number): Observable<Message> {
    if (type === 'chat') {
      return this.sendChatMessage(message);
    } else if (type === 'cricket') {
      return this.sendCricketMessage(message);
    } else {
      return this.sendImageMessage(message, numberOfImages || 1);
    }
  }

  private sendChatMessage(inputText: string): Observable<Message> {
    const params = new HttpParams().set('inputText', inputText);

    return this.http.get<string>(`${this.apiUrl}/chat`, {
      params,
      responseType: 'text' as 'json'
    }).pipe(
      map(response => ({
        id: Date.now().toString(),
        content: response,
        role: 'assistant' as const,
        timestamp: new Date()
      })),
      catchError(error => {
        console.error('Chat API Error:', error);
        return of({
          id: Date.now().toString(),
          content: `Error: ${error.message || 'Unable to connect to the server. Please make sure the backend is running on port 8080.'}`,
          role: 'assistant' as const,
          timestamp: new Date()
        });
      })
    );
  }

  private sendCricketMessage(inputText: string): Observable<Message> {
    const params = new HttpParams().set('inputText', inputText);

    return this.http.get<CricketResponse>(`${this.apiUrl}/chat/cricket`, { params }).pipe(
      map(response => ({
        id: Date.now().toString(),
        content: response.content,
        role: 'assistant' as const,
        timestamp: new Date()
      })),
      catchError(error => {
        console.error('Cricket API Error:', error);
        return of({
          id: Date.now().toString(),
          content: `Error: ${error.message || 'Unable to connect to the cricket service. Please make sure the backend is running on port 8080.'}`,
          role: 'assistant' as const,
          timestamp: new Date()
        });
      })
    );
  }

  private sendImageMessage(inputText: string, numberOfImages: number = 1): Observable<Message> {
    const params = new HttpParams()
      .set('imageDescription', inputText)
      .set('numberOfImages', numberOfImages.toString());

    return this.http.get<string[]>(`${this.apiUrl}/chat/images`, { params }).pipe(
      map(imageUrls => ({
        id: Date.now().toString(),
        content: `🎨 Image generated successfully! Here ${imageUrls.length > 1 ? 'are your images' : 'is your image'}:`,
        role: 'assistant' as const,
        timestamp: new Date(),
        imageUrls: imageUrls
      })),
      catchError(error => {
        console.error('Image API Error:', error);
        return of({
          id: Date.now().toString(),
          content: `Error: ${error.message || 'Unable to Generate Image. Please Try Again After Some Time.'}`,
          role: 'assistant' as const,
          timestamp: new Date()
        });
      })
    );
  }

  // Stream response for chat (if you want to implement streaming later)
  streamChatMessage(inputText: string): Observable<string> {
    const params = new HttpParams().set('inputText', inputText);
    return this.http.get<string>(`${this.apiUrl}/chat/stream`, {
      params,
      responseType: 'text' as 'json'
    });
  }
}
