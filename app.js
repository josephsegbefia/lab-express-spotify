require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const PORT = process.env.PORT;

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");
const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );
// Our routes go here:

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist-search", (req, res) => {
  const { search } = req.query;
  spotifyApi
    .searchArtists(search)
    .then((data) => {
      const artists = data.body.artists.items;
      console.log(artists);
      res.render("artist-search-results", { artists });
    })
    .catch((error) =>
      console.log("An error occured while searching artists:", error)
    );
});
app.get("/artist-search-results", (req, res) => {
  res.render("artist-search-results");
});

app.get("/albums/:artistID", (req, res) => {
  const { artistID } = req.params;
  spotifyApi
    .getArtistAlbums(artistID)
    .then((data) => {
      const albums = data.body.items;
      res.render("albums", { albums });
    })
    .catch((err) => console.log("An error occured while fetching albums", err));
});

app.get("/tracks/:albumID", (req, res) => {
  const { albumID } = req.params;
  spotifyApi
    .getAlbumTracks(albumID)
    .then((data) => {
      const tracks = data.body.items;
      res.render("tracks", { tracks });
    })
    .catch((err) => console.log("An error occured while fetching tracks", err));
});

app.listen(3000, () =>
  console.log(`My Spotify project running on port ${PORT} 🎧 🥁 🎸 🔊`)
);
