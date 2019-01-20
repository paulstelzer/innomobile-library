import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'im-vimeo-video-player',
  templateUrl: './vimeo-video-player.component.html',
  styleUrls: ['./vimeo-video-player.component.scss']
})
export class VimeoVideoPlayerComponent implements OnChanges {

  @Input() id: string = null;
  @Input() activateShowHide = false;
  @Input() autoplay = false;
  @Input() hideVideo = false;

  ready = true;

  vimeo: any = null;
  player: any = null;
  try = 0;

  trustedVideoUrl: SafeResourceUrl = null;

  loadedVideoId = null;

  constructor(
    private domSanitizer: DomSanitizer
  ) {

  }

  ngOnChanges() {
    this.load();
  }

  load() {
    if (this.id && this.id === this.loadedVideoId) { return; }
    if (this.id) {
      this.loadedVideoId = this.id;

      const url = `https://player.vimeo.com/video/${this.id}`;
      this.trustedVideoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(url);

      const tag = window.document.createElement('script');
      tag.src = 'https://player.vimeo.com/api/player.js';
      const firstScriptTag = window.document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      this.loadVimeoApi();
    }
  }

  loadVimeoApi() {
    if (this.vimeo) { return; }
    this.try++;
    if (this.try <= 3) {
      setTimeout(() => {
        console.log(window, window['Vimeo']);
        if (window['Vimeo'] && window['Vimeo'].Player) {
          this.player = new window['Vimeo'].Player('yt_player_' + this.id);
        } else {
          console.log('No Vimeo API for Video ID', this.id);
          this.loadVimeoApi();
        }
      }, 500);
    }

  }

  switch() {
    this.hideVideo = !this.hideVideo;
  }

  playVideo() {
    if (!this.ready || !this.player) { return; }
    if (this.player.playVideo instanceof Function) {
      this.player.playVideo();
    } else {
      console.log('This player has no play video function', this.player);
    }
  }

  pauseVideo() {
    if (!this.ready || !this.player) { return; }
    if (this.player.playVideo instanceof Function) {
      this.player.pauseVideo();
    } else {
      console.log('This player has no pause video function', this.player);
    }
  }
}
