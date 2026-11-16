/* Contenu pédagogique guitare : leçons (HTML) et banque de questions des quiz.
   Les éléments <figure data-chord="Am"> et <div data-gtboard="…"> sont dessinés par guitar.js.
   Pour ajouter une leçon : une <section> ci-dessous, une entrée dans GT_QUIZ, et une dans GT_PRESETS (guitar.js), à la même position. */
const GT_HTML = String.raw`
<section data-summary="Cordes, accordage standard, cases, notes sur le manche et repères.">
  <h2>La guitare et son manche</h2>
  <p>La guitare a <b>six cordes</b> numérotées de la plus aiguë (1ʳᵉ) à la plus grave (6ᵉ). Sur le manche, des <b>cases</b> séparées par des frettes : en appuyant une corde derrière une frette, on raccourcit la partie qui vibre et le son monte.</p>
  <h3>L’accordage standard</h3>
  <div class="theory-table-wrap"><table class="theory-table">
    <thead><tr><th>Corde</th><th>6ᵉ</th><th>5ᵉ</th><th>4ᵉ</th><th>3ᵉ</th><th>2ᵉ</th><th>1ʳᵉ</th></tr></thead>
    <tbody><tr><th>Note</th><td>Mi</td><td>La</td><td>Ré</td><td>Sol</td><td>Si</td><td>Mi</td></tr>
    <tr><th>Lettre</th><td>E</td><td>A</td><td>D</td><td>G</td><td>B</td><td>e</td></tr></tbody>
  </table></div>
  <p>Retiens la suite <b>Mi – La – Ré – Sol – Si – Mi</b>, de la plus grave à la plus aiguë. Écoute les cordes à vide, en arpège puis en accord :</p>
  <p><button class="play" data-play="40,45,50,55,59,64" data-gap="450" data-dur="1500">▶ Cordes à vide (une à une)</button><button class="play" data-play="40,45,50,55,59,64" data-gap="45" data-dur="2000">▶ En grattant</button></p>
  <h3>Les cases : un demi-ton chacune</h3>
  <p>Passer d’une case à la suivante, sur la même corde, monte d’<b>un demi-ton</b>. À la <b>12ᵉ case</b>, on retrouve le nom de la corde à vide, une octave plus haut. Les repères sont aux cases <b>3, 5, 7, 9</b> (un point) et <b>12</b> (deux points).</p>
  <p>Comme sur le clavier, il y a un demi-ton (une seule case) entre <b>Mi–Fa</b> et <b>Si–Do</b>, et un ton (deux cases) entre les autres notes naturelles. Voici toutes les notes naturelles du manche, jusqu’à la 12ᵉ case (les Do sont en bleu) :</p>
  <div data-gtboard="naturals" data-nf="12"></div>
  <h3>Accorder avec la 5ᵉ case</h3>
  <p>La note de la <b>5ᵉ case</b> d’une corde est celle de la corde à vide suivante : Mi (6ᵉ) à la 5ᵉ case donne La, La à la 5ᵉ donne Ré, Ré à la 5ᵉ donne Sol. Seule exception : entre Sol et Si, il faut la <b>4ᵉ case</b>, puis on revient à la 5ᵉ entre Si et Mi.</p>
  <h3>Hauteur réelle et notation</h3>
  <p>La guitare sonne <b>une octave plus bas</b> que ce qui est écrit : sa musique se note en clé de sol, mais le Mi grave (Mi2) s’écrit un Mi3. Le Do central du piano se joue à la <b>1ʳᵉ case de la corde de Si</b>.</p>
  <div class="example"><b>À retenir</b><br>Accordage : Mi La Ré Sol Si Mi. Une case = un demi-ton ; la 12ᵉ case = l’octave. Mi–Fa et Si–Do sont séparés d’une seule case.<br><i>À essayer :</i> dans « Guitare › Jeu › Trouver la note », limite-toi aux cases 0 à 4, puis étends jusqu’à 12.</div>
</section>

<section data-summary="Lire une tablature et un diagramme d’accord : cordes, cases, doigts, notations.">
  <h2>Tablatures et diagrammes d’accords</h2>
  <p>La guitare se lit souvent sans portée, avec deux notations très répandues : la <b>tablature</b> (pour des notes ou des mélodies) et le <b>diagramme d’accord</b> (pour des positions de main).</p>
  <h3>La tablature</h3>
  <p>Six lignes représentent les six cordes : la ligne du <b>haut</b> est la corde aiguë (Mi 1ʳᵉ) et celle du <b>bas</b> la corde grave (Mi 6ᵉ). Un <b>chiffre</b> indique la case à presser ; <b>0</b> signifie corde à vide. Ces chiffres se lisent de gauche à droite, dans l’ordre du temps. Des chiffres alignés verticalement se jouent ensemble : c’est un accord.</p>
  <pre class="tab">e|-----0-----|
B|-----1-----|
G|-----0-----|
D|-----2-----|
A|-----3-----|
E|-----------|</pre>
  <p>Ici, un accord de Do majeur : 3ᵉ case de la corde de La, 2ᵉ case de Ré, Sol à vide, 1ʳᵉ case de Si, Mi aigu à vide. La corde de Mi grave n’est pas jouée.</p>
  <h3>Le diagramme d’accord</h3>
  <div class="chord-grid"><figure data-chord="C"></figure><figure data-chord="Am"></figure><figure data-chord="D"></figure></div>
  <ul>
    <li>Les <b>lignes verticales</b> sont les cordes : la plus grave est à <b>gauche</b>. Les <b>lignes horizontales</b> sont les frettes.</li>
    <li>Un <b>point</b> indique où poser un doigt. Un <b>○</b> au-dessus d’une corde : corde jouée à vide. Un <b>×</b> : corde muette, qu’on ne joue pas.</li>
    <li>Un nombre comme <b>3fr</b> à côté du diagramme signifie que le diagramme commence à la 3ᵉ case.</li>
    <li>Doigts : <b>1</b> index, <b>2</b> majeur, <b>3</b> annulaire, <b>4</b> auriculaire, <b>T</b> pouce.</li>
  </ul>
  <h3>Le capodastre</h3>
  <p>Le <b>capodastre</b> (« capo ») bloque toutes les cordes à une case donnée : il monte l’instrument d’un demi-ton par case. Avec le capo en case 2, la forme de Do sonne Ré. Cela permet de garder des formes ouvertes dans des tonalités plus aiguës.</p>
  <div class="example"><b>À retenir</b><br>Tablature : ligne du bas = corde grave, chiffre = case, 0 = corde à vide. Diagramme : cordes graves à gauche, × = muette, ○ = à vide.<br><i>À essayer :</i> « Guitare › Jeu › Diagrammes » : reconnais l’accord à partir de son diagramme.</div>
</section>

<section data-summary="Les formes d’accords ouverts, les familles de tonalités et les septièmes.">
  <h2>Les accords ouverts</h2>
  <p>Un accord <b>ouvert</b> utilise des cordes à vide. Ce sont les premiers accords à apprendre : ils sonnent plein et se jouent sans barré. Chacun est écrit ici de la corde grave à la corde aiguë, avec <b>x</b> pour une corde muette.</p>
  <h3>Majeurs et mineurs</h3>
  <div class="chord-grid">
    <figure data-chord="C"></figure><figure data-chord="A"></figure><figure data-chord="G"></figure><figure data-chord="E"></figure>
    <figure data-chord="D"></figure><figure data-chord="Am"></figure><figure data-chord="Em"></figure><figure data-chord="Dm"></figure>
  </div>
  <p>Remarque : <b>Mi</b> (022100) et <b>Mi mineur</b> (022000) ne diffèrent que d’un doigt : retirer celui de la corde de Sol abaisse la tierce d’un demi-ton, comme du majeur au mineur au piano.</p>
  <h3>Accords de septième</h3>
  <div class="chord-grid">
    <figure data-chord="A7"></figure><figure data-chord="B7"></figure><figure data-chord="C7"></figure><figure data-chord="D7"></figure>
    <figure data-chord="E7"></figure><figure data-chord="G7"></figure><figure data-chord="Cmaj7"></figure><figure data-chord="Fmaj7"></figure>
  </div>
  <p>Le <b>septième de dominante</b> (G7, D7…) ajoute une tension qui appelle l’accord suivant ; le <b>majeur 7</b> (Cmaj7, Fmaj7) donne une couleur douce et stable.</p>
  <h3>Les accords d’une tonalité</h3>
  <p>Dans une tonalité majeure, les accords I, IV, V (et vi) forment un ensemble qui accompagne beaucoup de chansons. Voici les familles les plus faciles à la guitare :</p>
  <div class="theory-table-wrap"><table class="theory-table">
    <thead><tr><th>Tonalité</th><th>I</th><th>IV</th><th>V</th><th>vi</th></tr></thead>
    <tbody>
      <tr><th>Sol majeur</th><td>G</td><td>C</td><td>D</td><td>Em</td></tr>
      <tr><th>Do majeur</th><td>C</td><td>F</td><td>G</td><td>Am</td></tr>
      <tr><th>Ré majeur</th><td>D</td><td>G</td><td>A</td><td>Bm</td></tr>
      <tr><th>La majeur</th><td>A</td><td>D</td><td>E</td><td>F♯m</td></tr>
      <tr><th>Mi majeur</th><td>E</td><td>A</td><td>B</td><td>C♯m</td></tr>
    </tbody>
  </table></div>
  <p>En La mineur, trois accords très utilisés sont <b>Am – Dm – E</b> (ou <b>E7</b> pour plus de tension). Écoute la progression I – V – vi – IV en Sol :</p>
  <p><button class="play" data-seq="43,47,50,55,59,67|38,45,50,54,57,62|40,47,52,55,59,64|36,40,43,48,52,55" data-gap="1100" data-dur="1100">▶ G – D – Em – C</button></p>
  <h3>Réussir les changements</h3>
  <ul>
    <li>Cherche les <b>doigts communs</b> entre deux accords : on peut parfois garder un doigt en place.</li>
    <li>Prépare le doigt qui bouge le <b>premier</b>, juste avant le temps fort.</li>
    <li>Travaille deux accords seulement, <b>lentement</b>, en gardant le rythme régulier : mieux vaut un accord propre à temps que deux vite et approximatifs.</li>
  </ul>
  <div class="example"><b>À retenir</b><br>G, C, D et Em, avec A, E, Am et Dm, couvrent des centaines de morceaux. Un accord se mémorise par sa forme et par sa famille (I, IV, V, vi).<br><i>À essayer :</i> « Guitare › Jeu › Accords » (accords ouverts) puis « Exercices › Enchaînements d’accords ».</div>
</section>

<section data-summary="Barrés, formes mobiles de Mi et de La, power chords.">
  <h2>Barrés et accords mobiles</h2>
  <p>Un <b>barré</b> consiste à presser <b>toutes les cordes</b> avec l’index posé à plat sur une case : il joue le rôle du sillet. Une forme d’accord sans corde à vide peut alors <b>glisser le long du manche</b> : son nom change, mais sa forme reste la même.</p>
  <h3>Les deux formes mobiles de base</h3>
  <div class="chord-grid"><figure data-chord="F"></figure><figure data-chord="Bm"></figure><figure data-chord="B"></figure><figure data-chord="F♯m"></figure></div>
  <ul>
    <li><b>Forme de Mi</b> : la fondamentale est sur la <b>6ᵉ corde</b>. À la case <i>n</i>, l’accord majeur porte le nom de la note de la 6ᵉ corde à cette case : 1ʳᵉ case = Fa, 3ᵉ = Sol, 5ᵉ = La… (pour le mineur, on retire un doigt, comme pour Em).</li>
    <li><b>Forme de La</b> : la fondamentale est sur la <b>5ᵉ corde</b>. 2ᵉ case = Si, 3ᵉ = Do, 5ᵉ = Ré… (le mineur est la forme de Am, avec Bm à la 2ᵉ case).</li>
  </ul>
  <h3>Quelle case pour quelle fondamentale ?</h3>
  <div class="theory-table-wrap"><table class="theory-table">
    <thead><tr><th>Case</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th><th>11</th></tr></thead>
    <tbody>
      <tr><th>Forme de Mi (6ᵉ corde)</th><td>F</td><td>F♯</td><td>G</td><td>A♭</td><td>A</td><td>B♭</td><td>B</td><td>C</td><td>C♯</td><td>D</td><td>E♭</td></tr>
      <tr><th>Forme de La (5ᵉ corde)</th><td>B♭</td><td>B</td><td>C</td><td>C♯</td><td>D</td><td>E♭</td><td>E</td><td>F</td><td>F♯</td><td>G</td><td>A♭</td></tr>
    </tbody>
  </table></div>
  <p>Exemple : pour jouer Si♭ majeur, utilise la forme de La à la 1ʳᵉ case, ou la forme de Mi à la 6ᵉ case. Choisis toujours la plus basse sur le manche.</p>
  <h3>Les power chords</h3>
  <p>Un <b>power chord</b> (accord de quinte, noté <b>5</b>) ne contient que la fondamentale et la quinte, parfois doublées à l’octave. Sans tierce, il n’est ni majeur ni mineur : il est très utilisé en rock, car il reste clair même avec beaucoup de distorsion.</p>
  <div class="chord-grid"><figure data-chord="G5"></figure></div>
  <p>La forme se déplace comme un barré : racine sur la 6ᵉ corde, quinte deux cases plus haut sur la 5ᵉ, octave sur la 4ᵉ.</p>
  <div class="example"><b>À retenir</b><br>Forme de Mi (racine corde 6) et forme de La (racine corde 5) : deux formes pour tous les accords. Le barré demande de la force, mais surtout une bonne position du poignet et du pouce derrière le manche.<br><i>À essayer :</i> « Guitare › Jeu › Accords » avec l’option « Barrés ».</div>
</section>

<section data-summary="Pentatoniques, gamme blues, gamme majeure : les positions sur le manche.">
  <h2>Gammes et positions</h2>
  <p>Sur un clavier, une gamme se joue sur une ligne. À la guitare, on joue la même note à plusieurs endroits : on apprend donc des <b>positions</b> (ou « boîtes »), des motifs de 4 à 5 cases réutilisables dans toutes les tonalités, en déplaçant la forme.</p>
  <h3>La gamme pentatonique mineure</h3>
  <p>Cinq notes : <b>1 – ♭3 – 4 – 5 – ♭7</b>. C’est la base du rock et du blues. Voici la position 1 de La mineur pentatonique (racine sur la corde de Mi grave, 5ᵉ case ; les La sont en bleu) :</p>
  <div data-gtboard="scale" data-v="pmin" data-t="9" data-p="0"></div>
  <p><button class="play" data-play="45,48,50,52,55,57" data-gap="350">▶ La mineur pentatonique</button><button class="play" data-play="45,48,50,51,52,55,57" data-gap="350">▶ Gamme blues de La</button></p>
  <p>Pour la <b>gamme blues</b>, on ajoute à la pentatonique mineure la « note bleue » : la <b>quinte diminuée (♭5)</b>, ici Mi♭. Elle sert de note de passage.</p>
  <h3>La pentatonique majeure</h3>
  <p>Cinq notes : <b>1 – 2 – 3 – 5 – 6</b>. Do majeur pentatonique (Do Ré Mi Sol La) contient les mêmes notes que La mineur pentatonique : elles sont <b>relatives</b>, comme Do majeur et La mineur.</p>
  <div data-gtboard="scale" data-v="pmaj" data-t="0" data-p="1"></div>
  <h3>La gamme majeure</h3>
  <p>Sept notes, avec le motif habituel T – T – ½ – T – T – T – ½. Sur le manche, elle se place en <b>trois notes par corde</b> sur une fenêtre de cinq cases. Ici Sol majeur, racine sur la 6ᵉ corde :</p>
  <div data-gtboard="scale" data-v="maj" data-t="7" data-p="0"></div>
  <p><button class="play" data-play="43,45,47,48,50,52,54,55" data-gap="350">▶ Sol majeur</button></p>
  <h3>Repères entre les cordes</h3>
  <ul>
    <li>Une même case sur deux cordes voisines : <b>quarte juste</b> (5 demi-tons), sauf entre Sol et Si où l’on obtient une <b>tierce majeure</b> (4 demi-tons).</li>
    <li>Une octave : la même note deux cordes plus haut, deux cases plus loin (par exemple Sol de la 6ᵉ corde, case 3, et Sol de la 4ᵉ corde, case 5).</li>
    <li>Déplacer une position d’une case vers l’aigu monte la gamme d’un demi-ton : c’est la transposition.</li>
  </ul>
  <div class="example"><b>À retenir</b><br>Pentatonique mineure : 1 ♭3 4 5 ♭7. Blues : on ajoute ♭5. Une position est une forme que l’on déplace pour changer de tonalité.<br><i>À essayer :</i> « Guitare › Exercices › Gammes » : suis la position, puis cache les cibles pour tester ta mémoire.</div>
</section>

<section data-summary="Rythmique, jeu au médiator, jeu aux doigts et signes de technique.">
  <h2>Rythme et techniques</h2>
  <h3>Gratter en rythme</h3>
  <p>La main droite gratte vers le bas (<b>↓</b>) ou vers le haut (<b>↑</b>). On garde le bras en mouvement régulier, et on <b>manque</b> volontairement certaines cordes plutôt que de s’arrêter. Dans un 4/4, on compte « 1 & 2 & 3 & 4 & » : huit croches par mesure, avec ↓ sur les temps et ↑ sur les « & ».</p>
  <div class="theory-table-wrap"><table class="theory-table">
    <thead><tr><th>Compte</th><th>1</th><th>&</th><th>2</th><th>&</th><th>3</th><th>&</th><th>4</th><th>&</th></tr></thead>
    <tbody>
      <tr><th>Motif simple</th><td>↓</td><td></td><td>↓</td><td></td><td>↓</td><td></td><td>↓</td><td></td></tr>
      <tr><th>Motif courant</th><td>↓</td><td></td><td>↓</td><td>↑</td><td></td><td>↑</td><td>↓</td><td>↑</td></tr>
    </tbody>
  </table></div>
  <p>Le motif courant (« bas – bas-haut – haut-bas-haut ») accompagne un grand nombre de chansons. Apprends-le lentement sur un seul accord, avec le métronome.</p>
  <h3>Médiator et doigts</h3>
  <ul>
    <li><b>Jeu alterné</b> (alternate picking) : le médiator va vers le bas puis vers le haut, sans interruption. C’est la base de la vitesse et de la régularité.</li>
    <li><b>Fingerpicking</b> : le pouce (p) joue les cordes graves, l’index (i), le majeur (m) et l’annulaire (a) les cordes aiguës. Un motif classique : basse – corde 3 – corde 2 – corde 1.</li>
  </ul>
  <h3>Signes de technique</h3>
  <div class="theory-table-wrap"><table class="theory-table">
    <thead><tr><th>Signe (tablature)</th><th>Nom</th><th>Geste</th></tr></thead>
    <tbody>
      <tr><th>h</th><td>hammer-on</td><td>un doigt frappe la corde pour faire sonner une note plus aiguë, sans la pincer</td></tr>
      <tr><th>p</th><td>pull-off</td><td>on retire le doigt en tirant légèrement la corde, vers une note plus grave déjà posée</td></tr>
      <tr><th>/ ou \</th><td>slide</td><td>le doigt glisse sur la corde d’une case à l’autre</td></tr>
      <tr><th>b</th><td>bend</td><td>on tire la corde pour en monter la hauteur</td></tr>
      <tr><th>~</th><td>vibrato</td><td>on fait osciller la hauteur de la note tenue</td></tr>
      <tr><th>P.M.</th><td>palm mute</td><td>la paume étouffe légèrement les cordes près du chevalet</td></tr>
    </tbody>
  </table></div>
  <div class="example"><b>À retenir</b><br>↓ vers le bas, ↑ vers le haut ; le mouvement du bras reste continu. h, p, /, b et ~ sont des liaisons ou ornements de la main gauche ; P.M. se joue à la main droite.<br><i>À essayer :</i> « Guitare › Exercices › Chromatique sur une corde » au tempo du métronome, en jeu alterné.</div>
</section>

<section data-summary="Conseils de travail et séance type de 15 minutes pour guitariste.">
  <h2>Pour progresser à la guitare</h2>
  <ul>
    <li><b>Accorde</b> ta guitare avant chaque séance : une guitare juste fait progresser l’oreille.</li>
    <li>Garde le <b>pouce</b> de la main gauche derrière le manche, vers le milieu, et le <b>poignet</b> détendu. Les doigts se posent près de la frette (juste derrière), sans appuyer plus que nécessaire.</li>
    <li>Travaille <b>lentement</b> avec le métronome : augmente de 5 BPM seulement quand c’est régulier.</li>
    <li>Isole un passage ou un changement d’accord difficile et répète-le en boucle avant de rejouer tout le morceau.</li>
    <li>Joue chaque jour un peu : 15 minutes tous les jours valent mieux qu’une longue séance par semaine. Arrête-toi en cas de douleur.</li>
  </ul>
  <h3>Une séance de 15 minutes</h3>
  <ol>
    <li><b>2 min</b> : accorder et échauffer (chromatique sur une corde).</li>
    <li><b>3 min</b> : jeu « Trouver la note » ou « Nommer la note », une zone du manche à la fois.</li>
    <li><b>5 min</b> : deux accords, ou un enchaînement (G – C – D – Em), en rythme régulier.</li>
    <li><b>3 min</b> : une position de gamme pentatonique, cibles cachées.</li>
    <li><b>2 min</b> : un morceau que tu aimes, en entier, sans t’arrêter.</li>
  </ol>
  <div class="example"><b>À retenir</b><br>Régularité, lenteur, précision. Le métronome est ton meilleur allié ; le plaisir de jouer aussi.<br><i>À essayer :</i> enchaîne les exercices du mode « Guitare » dans l’ordre de la séance ci-dessus.</div>
</section>
`;

/* banque de questions : [question, [bonne réponse, mauvaise, mauvaise], explication] — 3 tirées au hasard à chaque quiz, réponses mélangées */
const GT_QUIZ = [
 [['Quelle est la note de la 6ᵉ corde à vide, la plus grave ?',['Mi','La','Sol'],'L’accordage va de la 6ᵉ à la 1ʳᵉ corde : Mi – La – Ré – Sol – Si – Mi.'],
  ['De combien de demi-tons monte-t-on en passant d’une case à la suivante ?',['1','2','3'],'Chaque case correspond à un demi-ton.'],
  ['À quelle case retrouve-t-on le nom de la corde à vide, une octave plus haut ?',['12ᵉ','7ᵉ','5ᵉ'],'La 12ᵉ case est l’octave de la corde à vide (deux points sur le manche).'],
  ['Quelle note joue-t-on à la 5ᵉ case de la corde de Mi grave ?',['La','Sol','Si'],'Mi + 5 demi-tons = La : c’est la 5ᵉ corde à vide.'],
  ['Quelle note est à la 1ʳᵉ case de la corde de Si ?',['Do','Si♭','Ré'],'Si + 1 demi-ton = Do (demi-ton naturel Si–Do).'],
  ['Pour accorder la corde de Si à partir de la corde de Sol, on joue la…',['4ᵉ case de la corde de Sol','5ᵉ case de la corde de Sol','3ᵉ case de la corde de Sol'],'Sol + 4 demi-tons = Si : exception à la règle de la 5ᵉ case.'],
  ['Par rapport à ce qui est écrit, la guitare sonne…',['Une octave plus bas','Une octave plus haut','À la même hauteur'],'La guitare est notée une octave au-dessus de sa hauteur réelle.'],
  ['Quelle note est à la 3ᵉ case de la corde de La ?',['Do','Ré','Si'],'La + 3 demi-tons = Do (La, Si♭, Si, Do).']],
 [['Dans une tablature, que représente le chiffre écrit sur une ligne ?',['La case à presser','Le doigt à utiliser','La durée de la note'],'0 = corde à vide ; 3 = 3ᵉ case.'],
  ['Dans une tablature, la ligne du bas représente…',['La 6ᵉ corde (Mi grave)','La 1ʳᵉ corde (Mi aigu)','La corde de Sol'],'La ligne du bas est la corde la plus grave.'],
  ['Dans un diagramme d’accord, un × au-dessus d’une corde signifie…',['La corde est muette (non jouée)','La corde est jouée à vide','Il faut un barré'],'× : on ne joue pas cette corde.'],
  ['Dans un diagramme, un petit cercle vide au-dessus d’une corde indique…',['Une corde jouée à vide','Une corde muette','Un doigt à poser'],'○ : corde à vide, sans doigt.'],
  ['Quel numéro désigne l’index de la main gauche ?',['1','4','T'],'1 index, 2 majeur, 3 annulaire, 4 auriculaire, T pouce.'],
  ['Dans un diagramme vertical, les cordes graves sont…',['À gauche','À droite','En haut'],'La corde de Mi grave est à gauche.'],
  ['Que signifie « 3fr » à côté d’un diagramme ?',['Le diagramme commence à la 3ᵉ case','Trois doigts sont nécessaires','Trois cordes sont jouées'],'« fr » pour « fret » (case).'],
  ['À quoi sert un capodastre ?',['Monter toutes les cordes d’un même nombre de cases','Étouffer les cordes','Accorder la guitare'],'Il bloque les cordes : un demi-ton par case.']],
 [['Quelles notes contient l’accord de Do majeur ouvert (x32010) ?',['Do – Mi – Sol','Do – Mi♭ – Sol','Do – Fa – Sol'],'La forme contient Do, Mi et Sol (Do et Mi doublés).'],
  ['Quel accord se joue avec 022000 ?',['Mi mineur','Mi majeur','La mineur'],'022000 est Em ; Mi majeur ajoute un doigt (022100).'],
  ['Quels sont les accords I, IV et V en Sol majeur ?',['G – C – D','G – D – A','G – F – D'],'Sol, Do, Ré.'],
  ['Qu’est-ce qui distingue E (022100) de Em (022000) ?',['Le doigt de la corde de Sol est retiré','On ajoute un barré','On joue une corde de plus'],'La tierce majeure Sol♯ devient la tierce mineure Sol.'],
  ['Pourquoi travailler G, C, D et Em ensemble ?',['Ce sont les accords I, IV, V et vi de Sol majeur','Ce sont les plus graves','Ils se jouent sans doigts'],'Ils accompagnent un très grand nombre de chansons.'],
  ['Comment note-t-on l’accord de septième de dominante de Sol ?',['G7','Gm7','Gmaj7'],'G7 = Sol – Si – Ré – Fa.'],
  ['Quel accord est joué avec x02210 ?',['La mineur','La majeur','Mi mineur'],'Am : x02210.'],
  ['Pour changer d’accord plus vite, on cherche…',['Les doigts communs entre les deux accords','À jouer très vite dès le début','Uniquement à regarder la main droite'],'Un doigt qui reste en place diminue le mouvement.']],
 [['Qu’est-ce qu’un barré ?',['L’index presse toutes les cordes sur une case','Un accord joué avec un capodastre','Deux cordes pincées ensemble'],'Le barré remplace le sillet et permet de déplacer une forme.'],
  ['Quel accord obtient-on avec la forme de Mi majeur barrée à la 1ʳᵉ case ?',['Fa majeur','Fa mineur','Mi♭ majeur'],'Mi + 1 demi-ton = Fa.'],
  ['Un power chord contient…',['La fondamentale et la quinte (parfois l’octave)','La fondamentale et la tierce','Trois tierces superposées'],'Sans tierce, il n’est ni majeur ni mineur.'],
  ['Où est la fondamentale de la forme de La barrée ?',['Sur la 5ᵉ corde','Sur la 6ᵉ corde','Sur la 1ʳᵉ corde'],'La forme de La a sa racine sur la corde de La.'],
  ['La forme de La mineur barrée à la 2ᵉ case donne…',['Si mineur','Si majeur','Do mineur'],'La + 2 demi-tons = Si.'],
  ['La forme de Mi majeur barrée à la 5ᵉ case donne…',['La majeur','Si majeur','Sol majeur'],'Mi + 5 demi-tons = La.'],
  ['Un capodastre en case 2 avec la forme de Do donne…',['Ré majeur','Mi majeur','Si♭ majeur'],'Do + 2 demi-tons = Ré.'],
  ['Quelle forme mobile a sa racine sur la 6ᵉ corde ?',['La forme de Mi','La forme de La','La forme de Do'],'La forme de Mi se place avec la racine sur la corde de Mi grave.']],
 [['Quelle formule donne la gamme pentatonique mineure ?',['1 – ♭3 – 4 – 5 – ♭7','1 – 2 – 3 – 5 – 6','1 – 3 – 5 – 7 – 9'],'Cinq notes : 1, ♭3, 4, 5, ♭7.'],
  ['Quelle note ajoute-t-on à la pentatonique mineure pour obtenir la gamme blues ?',['La quinte diminuée (♭5)','La septième majeure','La seconde majeure'],'La « note bleue » est la ♭5.'],
  ['Combien de notes compte une gamme pentatonique ?',['5','7','12'],'Penta = cinq.'],
  ['Quelles sont les notes de La mineur pentatonique ?',['La – Do – Ré – Mi – Sol','La – Si – Do – Mi – Fa','La – Do – Mi – Fa – Sol'],'A C D E G.'],
  ['Do majeur pentatonique contient les mêmes notes que…',['La mineur pentatonique','Mi mineur pentatonique','Ré mineur pentatonique'],'Ce sont des gammes relatives.'],
  ['Entre deux cordes voisines à vide (sauf Sol–Si), l’intervalle est…',['Une quarte juste','Une tierce majeure','Une quinte juste'],'5 demi-tons : Mi–La, La–Ré, Ré–Sol, Si–Mi.'],
  ['Entre la corde de Sol et la corde de Si, l’intervalle à vide est…',['Une tierce majeure','Une quarte juste','Une quinte juste'],'Sol–Si : 4 demi-tons.'],
  ['Pour monter une position de gamme d’un demi-ton, on…',['La déplace d’une case vers l’aigu','Change de corde','Ajoute une corde'],'La forme garde sa structure : c’est la transposition.']],
 [['Dans un schéma de grattage, ↓ signifie…',['Coup vers le bas','Coup vers le haut','Un silence'],'↓ bas, ↑ haut.'],
  ['Combien de croches y a-t-il dans une mesure à 4/4 ?',['8','4','16'],'Quatre noires = huit croches.'],
  ['Le « jeu alterné » consiste à…',['Alterner le médiator vers le bas et vers le haut','Jouer uniquement vers le bas','Jouer aux doigts'],'C’est la base de la régularité.'],
  ['Que note « h » dans une tablature ?',['Un hammer-on','Une harmonique','Un silence'],'Un doigt frappe la corde pour faire sonner la note.'],
  ['Que signifie « P.M. » ?',['Palm mute (sourdine de la paume)','Position mobile','Pincé moyen'],'La paume étouffe légèrement les cordes.'],
  ['Un pull-off consiste à…',['Retirer le doigt en tirant la corde, vers une note plus grave','Glisser sur la corde','Étouffer les cordes'],'Le contraire du hammer-on.'],
  ['Un bend est…',['Un étirement de la corde qui monte la hauteur','Un glissando','Une sourdine'],'On tire la corde de côté.'],
  ['Au fingerpicking, quel doigt joue habituellement les cordes graves ?',['Le pouce','L’annulaire','L’auriculaire'],'p = pouce pour les basses.']],
 [['Que faut-il faire avant chaque séance ?',['Accorder la guitare','Régler le métronome à 200','Jouer le plus fort possible'],'Une guitare juste entraîne l’oreille.'],
  ['Pour augmenter le tempo, on ajoute…',['5 BPM quand c’est régulier','40 BPM d’un coup','Aucun BPM : on reste lent'],'Progression régulière et sûre.'],
  ['Pourquoi jouer lentement ?',['Pour installer la précision avant la vitesse','Pour économiser les cordes','Parce que c’est obligatoire'],'La vitesse vient avec la précision.'],
  ['Quelle pratique est la plus efficace ?',['15 minutes chaque jour','3 heures une fois par semaine','Aucune routine'],'La régularité compte plus que la durée.'],
  ['Où place-t-on le pouce de la main gauche ?',['Derrière le manche, vers le milieu','Au-dessus du manche','Sur les cordes'],'Pour garder une main souple.'],
  ['Que faire en cas de douleur ?',['S’arrêter et se reposer','Continuer plus fort','Serrer plus les cordes'],'Une douleur est un signal d’arrêt.']]
];
