'use strict';

const rm = require('./requestMaker.service.js');

//https://accounts.spotify.com/authorize/?client_id=1e990c0fb588470088a74493d0769821&response_type=code&scope=playlist-modify-public&redirect_uri=http://localhost:1337/spotify/token


//SPOTIFY

//NOT SURE IF TEMPORARY
//const CODE = 'AQCmzdRiimDasns1IToVMkNZ-haCja1PUoK3Y71q5BKCPwqM1YCrZluVZN7ixWrEn0rSjeBlAg5j7zdSScW2ZSneAprO87qjHTHRkrZNqLmEYuOj6-EliGsBSv5p_eUUoOnVBvE9luuVnerfgyaSCF-x1X1PIiLgl1JdFP3hVvyw5KrFuAHNwesf5o3d61Vb2DbTW2rc9bwvckBNJimaXGs7-KxAiLGafLlD2YKUIfuR';


const SPOTIFY_CLIENT = '1e990c0fb588470088a74493d0769821';
const SPOTIFY_SECRET = '82a2daae239249c49e02f70b201a2b15';
const REDIRECT = 'http://localhost:1337/spotify/token';
//const REDIRECT = 'https://baxter-bot.herokuapp.com/spotify/token';
const USER_ID = '1226313191';
const PLAYLIST_ID = '2qi53ifcbF7kvD5HNjaxg5';
const REFRESH_TOKEN = 'AQD4zS5DVfQLDRQCdpnSIclQQYCpadcpZ8VecRUQwbMqivdtT6uD4IKrpl6_vvhiET7vqxirfGM-5vvqP679NVKLbpOICLhCQrGZiMGM7dD4YVhv9dvpZ9I3tUjaiM1BHks';

class Spotify {
  constructor() {
    this.accessToken = '';
    this.refresh_token = REFRESH_TOKEN;
    this.fetchAccessToken();
  }
  
  addSong(songURI) {
    let regex = new RegExp(/(track\/)(.+)(>)/);
    let songID = songURI.match(regex)[2];
    let uri = `https://api.spotify.com/v1/users/${USER_ID}/playlists/${PLAYLIST_ID}/tracks?position=0&uris=spotify:track:${songID}`;
    return rm.http({
      method: 'POST',
      uri: uri,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
  }

  getCode() {
    return rm.http({
      uri: `https://accounts.spotify.com/authorize/?client_id=${SPOTIFY_CLIENT}&response_type=code&scope=playlist-modify-public&redirect_uri=${REDIRECT}`,
    });
  }

  fetchAccessToken() {
    let url = `https://accounts.spotify.com/api/token`;
    return rm.http({
      method: 'POST',
      uri: url,
      json: true,
      form: {
        grant_type: 'refresh_token', // when using code: authorization_code
        refresh_token: this.refresh_token,
      },
      headers: {
        Authorization: `Basic ${new Buffer(`${SPOTIFY_CLIENT}:${SPOTIFY_SECRET}`).toString('base64')}`, //${this.accessToken}
      },
    }).then(resp => {
      this.accessToken = resp.access_token;
      console.log(`New token expires in ${resp.expires_in} seconds.`)
      
      if (this.refresh_token !== resp.refresh_token) {
        this.refresh_token = resp.refresh_token;
        console.log(`New refresh token:  ${this.refresh_token}`);
      }

      setTimeout(this.fetchAccessToken, resp.expires_in * 1000);
    });
  }

  setAuthCode(code) {
    this.authCode = code;
  }

  setAcessToken(token) {
    this.accessToken = token;
  }

  getAccessToken() {
    //todo soon
    return this.accessToken ? this.accessToken : false;
  }
}

module.exports = new Spotify();