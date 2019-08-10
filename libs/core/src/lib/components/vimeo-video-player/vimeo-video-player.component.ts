import { Component, OnInit, Input, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import Player from '@vimeo/player';

@Component({
  selector: 'im-vimeo-video-player',
  templateUrl: './vimeo-video-player.component.html',
  styleUrls: ['./vimeo-video-player.component.scss']
})
export class VimeoVideoPlayerComponent implements OnChanges {
  @ViewChild('video', { static: true }) video: ElementRef<HTMLDivElement>;
  @Input() id: number;
  @Input() language = 'en';

  @Input() activateShowHide = false;
  @Input() autoplay = false;
  @Input() hideVideo = false;

  player: Player;
  try = 0;

  loadedVideoId = null;

  constructor(
  ) {

  }

  ngOnChanges() {
    this.load();
  }

  load() {
    if (this.id && this.id === this.loadedVideoId) { return; }
    if (this.id) {
      this.loadedVideoId = this.id;
      this.try = 0;
      this.loadVimeoApi();
    }
  }

  async loadVimeoApi() {
    this.try++;
    if (this.try <= 3) {
      if (this.video) {
        if (this.player) {
          await this.player.destroy();
        }
        this.player = new Player(this.video.nativeElement, {
          id: this.id,
          autoplay: this.autoplay,
          byline: false,
        });
        this.enableSubtitles();

      } else {
        setTimeout(() => {
          this.loadVimeoApi();
        }, 1500);
      }
    }

  }

  switch() {
    this.hideVideo = !this.hideVideo;
  }

  async playVideo() {
    if (!this.player) { return; }

    try {
      await this.player.play();
    } catch (error) {

    }
  }

  async pauseVideo() {
    if (!this.player) { return; }
    try {
      await this.player.pause();
    } catch (error) {

    }
  }

  async enableSubtitles() {
    if (!this.player) { return; }
    try {
      await this.player.enableTextTrack(this.language, 'subtitles');
    } catch (error) {
    }
  }
}
