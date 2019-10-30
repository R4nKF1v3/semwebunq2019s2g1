node main.js addArtist U2 Inglaterra
node main.js addArtist ACDC Australia
node main.js addArtist Sabina España

node main.js addAlbum 1 U2_alb1 2000
node main.js addAlbum 1 U2_alb2 2001

node main.js addAlbum 2 ACDC_alb1 2003
node main.js addAlbum 2 ACDC_alb2 2004

node main.js addAlbum 3 Sabina_alb1 2000
node main.js addAlbum 3 Sabina_alb2 2001

node main.js addTrack 1 U2_track1 2000 rock
node main.js addTrack 1 U2_track2 2000 pop
node main.js addTrack 1 U2_track3 2000 rock

node main.js addTrack 2 U2_track4 2001 rock
node main.js addTrack 2 U2_track5 2001 pop
node main.js addTrack 2 U2_track6 2001 rock

node main.js addTrack 3 ACDC_track7 2000 metal
node main.js addTrack 3 ACDC_track8 2000 metal
node main.js addTrack 3 ACDC_track9 2000 rock

node main.js addTrack 4 ACDC_track10 2001 rock
node main.js addTrack 4 ACDC_track11 2001 metal
node main.js addTrack 4 ACDC_track12 2001 rock

node main.js addTrack 5 Sabina_track13 2000 melodico
node main.js addTrack 5 Sabina_track14 2000 melodico
node main.js addTrack 5 Sabina_track15 2000 folklore

node main.js addTrack 6 Sabina_track16 2001 folklore
node main.js addTrack 6 Sabina_track17 2001 folklore
node main.js addTrack 6 Sabina_track18 2001 pop

node main.js addPlaylist Rock 6000 rock metal
node main.js addPlaylist Folklore 7000 folklore

node main.js listArtist 1
node main.js listArtist 2
node main.js listArtist 3

node main.js listAlbum 1
node main.js listAlbum 2
node main.js listAlbum 3
node main.js listAlbum 4
node main.js listAlbum 5
node main.js listAlbum 6

node main.js listTrack 1
node main.js listTrack 2
node main.js listTrack 3
node main.js listTrack 4
node main.js listTrack 5
node main.js listTrack 6
node main.js listTrack 7
node main.js listTrack 8
node main.js listTrack 9
node main.js listTrack 10
node main.js listTrack 11
node main.js listTrack 12

node main.js listPlaylist 1
node main.js listPlaylist 2

node main.js getTracksFromArtist 1

node main.js getTracksMatchingGenres rock

node main.js searchByName ACDC

node main.js createUser Pepe
node main.js createUser Roberta

node main.js getUser Pepe
node main.js getUser 2

node main.js userListenTo Pepe 1
node main.js userListenTo Pepe 2
node main.js userListenTo Pepe U2_track2
node main.js userListenTo Pepe ACDC_track11

node main.js userListenTo Roberta 2
node main.js userListenTo Roberta 3
node main.js userListenTo Roberta 12
node main.js userListenTo Roberta Sabina_track18

node main.js userTrackHistory 1
node main.js userTrackHistory Roberta

node main.js userTimesListenedTo Roberta 12
node main.js userTimesListenedTo 1 U2_track2

node main.js getArtistMostListened 1
node main.js getArtistMostListened Sabina
node main.js getArtistMostListened ACDC

node main.js getTrack 4

node main.js deleteTrack U2_track4
node main.js deleteTrack 5
node main.js deleteTrack U2_track6

node main.js getAlbum 2

##node main.js deleteAlbum U2_alb1
##node main.js deleteAlbum 2
##
##node main.js getArtist 1
##
##node main.js deleteArtist 1
##node main.js deleteArtist ACDC
##node main.js deleteArtist Sabina
##
##node main.js getPlaylist 1
##node main.js getPlaylist 2
##
##node main.js deletePlaylist 1
##node main.js deletePlaylist Folklore
##
##node main.js deleteUser 1
##node main.js deleteUser Roberta
