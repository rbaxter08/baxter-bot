'use strict';

const rm = require('./requestMaker.service.js');

//https://accounts.spotify.com/authorize/?client_id=1e990c0fb588470088a74493d0769821&response_type=code&scope=playlist-modify-public&redirect_uri=http://localhost:1337/spotify/token


//SPOTIFY
const SPOTIFY_CLIENT = '1e990c0fb588470088a74493d0769821';
const SPOTIFY_SECRET = '82a2daae239249c49e02f70b201a2b15';
const REDIRECT = 'http://localhost:1337/spotify/token';
const REDIRECT_2 = 'http://localhost:1337/spotify/access';
//const REDIRECT = 'https://baxter-bot.herokuapp.com/spotify/token';
//const REDIRECT = 'https://baxter-bot.herokuapp.com/spotify/access';
const USER_ID = '1226313191';
const PLAYLIST_ID = '2qi53ifcbF7kvD5HNjaxg5';

class Spotify {
  constructor() { }

  addSong(songURI) {
    return this.getToken().then((token) => {
      return token;
      let regex = new RegExp(/(track\/)(.+)/);
      let songID = songURI.match(regex)[2];
      return rm.http('post', {
        url: `https://api.spotify.com/v1/users/${USER_ID}/playlists/${PLAYLIST_ID}/tracks&uris=spotify:track:${songID}`,
        headers: {
          auth: {
            Authorization: 'FAKE TOKEN',
          },
        },
      });
    });
  }

  getToken() {
    console.log('getting token');
    let requestObj = {
      url: `https://accounts.spotify.com/authorize/?client_id=${SPOTIFY_CLIENT}&response_type=code&scope=playlist-modify-public&redirect_uri=${REDIRECT}`,
    }
    return rm.http('get', requestObj);
  }

  getAccessToken(code) {
    console.log('getting access token');
    let encoded = `Basic ${new Buffer(`${SPOTIFY_CLIENT}${SPOTIFY_SECRET}`).toString('base64')}`;
    let url = `https://accounts.spotify.com/api/token?grant_type=authorization_code&code=${code}&redirect_uri=${REDIRECT_2}`;
    return rm.http('post', {
      url: url,
      form: {
        client_id: SPOTIFY_CLIENT,
        client_secret: SPOTIFY_SECRET,
      },
      cb: (resp) => {
        console.log(resp);
      }
    });
  }
}

module.exports = new Spotify();