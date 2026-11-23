# Piano Trainer V4.27

Ouvrir `index.html` dans le navigateur (Chrome/Edge recommandé pour le MIDI ; internet requis pour les bibliothèques et les sons de piano).

- `index.html` : structure de la page
- `style.css` : styles
- `js/` : code, chargé dans l'ordre indiqué en tête de `js/core.js`
- `js/theory-data.js` : leçons et questions de quiz (le plus simple à modifier)

- `js/guitar-core.js` : données et fonctions pures de la guitare (accords, gammes, dessins)
- `js/guitar.js` : interface guitare (jeu, exercices, leçons)
- `js/guitar-theory-data.js` : leçons et quiz de théorie guitare
- `js/guitar-songs.js` : collection de base (11 morceaux), lecteurs MusicXML et Guitar Pro
- `js/guitar-tab.js` : dessin de la tablature
- `js/guitar-songs-ui.js` : mode « Morceaux » (bibliothèque, import, jeu, écoute, métronome)

Import de tablatures : MusicXML (.mxl, .musicxml, .xml) lu directement ; Guitar Pro (.gp3 à .gpx, .gp) lu par alphaTab,
chargé depuis un CDN au premier fichier Guitar Pro (connexion internet nécessaire).
- `js/guitar-audio.js` : son de guitare (corde pincée), détection de hauteur (YIN) et d'accords (chromagramme)
- `js/guitar-mic.js` : accordeur et validation au micro

Le micro demande une page en https ou localhost (ou un fichier ouvert localement selon le navigateur) et ton autorisation.
