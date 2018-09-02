import { Component, Input, OnChanges } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'innomobile-youtube-video-player',
  templateUrl: 'youtube-video-player.html',
  styleUrls: ['youtube-video-player.scss']
})
export class YoutubeVideoPlayerComponent implements OnChanges {
  @Input() id: string = null;
  @Input() activateShowHide = false;
  @Input() autoplay = false;
  @Input() hideVideo = false;

  ready = true;

  yt: any = null;
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

      const url =
        'https://www.youtube-nocookie.com/embed/'
        + this.id
        + '?enablejsapi=1&controls=1&showinfo=0&rel=0&fs=1&modestbranding=0&cc_load_policy=1';
      this.trustedVideoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(url);

      const tag = window.document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = window.document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      this.loadYtApi();
    }
  }

  loadYtApi() {
    if (this.yt) { return; }
    this.try++;
    if (this.try <= 3) {
      setTimeout(() => {
        if (window['YT'] && window['YT'].Player) {
          this.player = new window['YT'].Player('yt_player_' + this.id, {
            events: {
              onReady: (event: any) => {
                this.ready = true;
                if (this.autoplay) {
                  this.playVideo();
                }
              },
              onStateChange: (event: any) => {
              }
            }
          });


        } else {
          // console.log('No YT API');
          this.loadYtApi();
        }
      }, 500);
    }

  }

  switch() {
    this.hideVideo = !this.hideVideo;
  }

  playVideo() {
    if (!this.ready || !this.player) { return; }
    this.player.playVideo();
  }

  pauseVideo() {
    if (!this.ready || !this.player) { return; }
    this.player.pauseVideo();
  }

}
