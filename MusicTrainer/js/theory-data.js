/* Contenu pédagogique : leçons (HTML) et banque de questions des quiz.
   Pour modifier ou ajouter une leçon, éditer ce fichier (puis ajouter une entrée dans TQUIZ et PRESETS de app.js). */
const THEORY_HTML = String.raw`
    <section data-summary="Noms des notes, octaves, touches blanches et noires, dièses et bémols.">
      <h2>Les notes et le clavier</h2>
      <p>La musique occidentale utilise sept noms de notes qui se répètent : <b>Do, Ré, Mi, Fa, Sol, La, Si</b>. Sur cette page, elles sont aussi notées avec les lettres internationales :</p>
      <div class="example"><b>C = Do · D = Ré · E = Mi · F = Fa · G = Sol · A = La · B = Si</b></div>
      <p>Après Si, on revient à Do dans une nouvelle <b>octave</b>. Une octave contient 12 demi-tons : les touches blanches et noires du piano suivent cette organisation.</p>
      <p>Pour distinguer les octaves, on ajoute un numéro. Le Do proche du milieu du clavier est le <b>Do central</b>, noté <b>Do4</b> (C4). Le La4 (440 Hz) sert de référence d’accord, et un piano de 88 touches va de La0 à Do8. Le Piano Trainer utilise cette notation (C4, F♯3…).</p>
      <figure>
        <svg class="theory-illustration" viewBox="0 0 320 145" role="img" aria-labelledby="keyboardTitle keyboardDesc">
          <title id="keyboardTitle">Une octave sur un clavier de piano</title>
          <desc id="keyboardDesc">Les touches blanches Do, Ré, Mi, Fa, Sol, La, Si et les touches noires Do dièse, Ré dièse, Fa dièse, Sol dièse, La dièse.</desc>
          <g fill="#fff" stroke="currentColor" stroke-width="2">
            <rect x="10" y="15" width="40" height="95" rx="3"/><rect x="50" y="15" width="40" height="95" rx="3"/>
            <rect x="90" y="15" width="40" height="95" rx="3"/><rect x="130" y="15" width="40" height="95" rx="3"/>
            <rect x="170" y="15" width="40" height="95" rx="3"/><rect x="210" y="15" width="40" height="95" rx="3"/>
            <rect x="250" y="15" width="40" height="95" rx="3"/>
          </g>
          <g fill="#202124" stroke="currentColor" stroke-width="1">
            <rect x="37" y="15" width="26" height="58" rx="3"/><rect x="77" y="15" width="26" height="58" rx="3"/>
            <rect x="157" y="15" width="26" height="58" rx="3"/><rect x="197" y="15" width="26" height="58" rx="3"/>
            <rect x="237" y="15" width="26" height="58" rx="3"/>
          </g>
          <g text-anchor="middle">
            <text x="30" y="132">Do</text><text x="70" y="132">Ré</text><text x="110" y="132">Mi</text>
            <text x="150" y="132">Fa</text><text x="190" y="132">Sol</text><text x="230" y="132">La</text><text x="270" y="132">Si</text>
            <text class="black-key-label" x="50" y="57">Do♯</text><text class="black-key-label" x="90" y="57">Ré♯</text>
            <text class="black-key-label" x="170" y="57">Fa♯</text><text class="black-key-label" x="210" y="57">Sol♯</text><text class="black-key-label" x="250" y="57">La♯</text>
          </g>
        </svg>
        <figcaption>Les touches noires se nomment d’après les notes voisines : Do♯ est juste au-dessus de Do, et Ré♭ juste au-dessous de Ré.</figcaption>
      </figure>
      <h3>Repères sur le clavier</h3>
      <ul>
        <li>Les touches noires sont groupées par <b>2</b> puis par <b>3</b>. Le <b>Do</b> est la touche blanche juste à gauche d’un groupe de deux ; le <b>Fa</b>, juste à gauche d’un groupe de trois.</li>
        <li><b>Mi–Fa</b> et <b>Si–Do</b> ne sont séparés par aucune touche noire : ce sont des demi-tons entre deux touches blanches. Partout ailleurs, deux touches blanches voisines sont à un ton.</li>
      </ul>
      <h3>Dièses et bémols</h3>
      <p>Un <b>dièse</b> (♯) monte une note d’un demi-ton ; un <b>bémol</b> (♭) la baisse d’un demi-ton. Un même son peut avoir deux noms, comme Do♯ et Ré♭ : on parle alors de notes enharmoniques. Le <b>bécarre</b> (♮) annule une altération : la note redevient naturelle.</p>
      <div class="example"><b>À retenir</b><br>7 noms de notes, 12 demi-tons par octave. Do central = Do4. Mi–Fa et Si–Do sont des demi-tons naturels.<br><i>À essayer :</i> dans le Piano Trainer, active « Afficher notes » et « Do Ré Mi », puis retrouve tous les Do du clavier.</div>
    </section>

    <section data-summary="Portée, clés de sol et de fa, Do central, armure et altérations.">
      <h2>Lire une partition</h2>
      <p>La portée comporte cinq lignes et quatre interlignes. Les notes montent en alternant ligne et interligne. La <b>clé</b> indique à quelle note correspondent ces positions :</p>
      <ul>
        <li><b>Clé de sol</b> : registre aigu, souvent joué par la main droite. Elle s’enroule autour de la 2ᵉ ligne : c’est un <b>Sol</b>.</li>
        <li><b>Clé de fa</b> : registre grave, souvent joué par la main gauche. Ses deux points encadrent la 4ᵉ ligne : c’est un <b>Fa</b>.</li>
      </ul>
      <figure class="staff-example">
        <svg viewBox="0 0 390 150" role="img" aria-labelledby="trebleTitle trebleDesc">
          <title id="trebleTitle">Notes sur les lignes en clé de sol</title>
          <desc id="trebleDesc">De bas en haut : Mi quatre, Sol quatre, Si quatre, Ré cinq, Fa cinq.</desc>
          <g class="staff-lines">
            <line x1="18" y1="30" x2="245" y2="30"/><line x1="18" y1="50" x2="245" y2="50"/>
            <line x1="18" y1="70" x2="245" y2="70"/><line x1="18" y1="90" x2="245" y2="90"/>
            <line x1="18" y1="110" x2="245" y2="110"/>
          </g>
          <g class="staff-note">
            <ellipse cx="72" cy="110" rx="7" ry="5" transform="rotate(-20 72 110)"/>
            <ellipse cx="72" cy="90" rx="7" ry="5" transform="rotate(-20 72 90)"/>
            <ellipse cx="72" cy="70" rx="7" ry="5" transform="rotate(-20 72 70)"/>
            <ellipse cx="72" cy="50" rx="7" ry="5" transform="rotate(-20 72 50)"/>
            <ellipse cx="72" cy="30" rx="7" ry="5" transform="rotate(-20 72 30)"/>
          </g>
          <g class="staff-label">
            <text x="265" y="115">E4 </text><text x="265" y="95">G4</text>
            <text x="265" y="75">B4</text><text x="265" y="55">D5</text><text x="265" y="35">F5</text>
          </g>
        </svg>
        <figcaption>En clé de sol, les cinq lignes se lisent de bas en haut : Mi, Sol, Si, Ré, Fa.</figcaption>
      </figure>
      <figure class="staff-example">
        <svg viewBox="0 0 390 150" role="img" aria-labelledby="bassTitle bassDesc">
          <title id="bassTitle">Notes sur les lignes en clé de fa</title>
          <desc id="bassDesc">De bas en haut : Sol deux, Si deux, Ré trois, Fa trois, La trois.</desc>
          <g class="staff-lines">
            <line x1="18" y1="30" x2="245" y2="30"/><line x1="18" y1="50" x2="245" y2="50"/>
            <line x1="18" y1="70" x2="245" y2="70"/><line x1="18" y1="90" x2="245" y2="90"/>
            <line x1="18" y1="110" x2="245" y2="110"/>
          </g>
          <g class="staff-note">
            <ellipse cx="72" cy="110" rx="7" ry="5" transform="rotate(-20 72 110)"/>
            <ellipse cx="72" cy="90" rx="7" ry="5" transform="rotate(-20 72 90)"/>
            <ellipse cx="72" cy="70" rx="7" ry="5" transform="rotate(-20 72 70)"/>
            <ellipse cx="72" cy="50" rx="7" ry="5" transform="rotate(-20 72 50)"/>
            <ellipse cx="72" cy="30" rx="7" ry="5" transform="rotate(-20 72 30)"/>
          </g>
          <g class="staff-label">
            <text x="265" y="115">G2 </text><text x="265" y="95">B2</text>
            <text x="265" y="75">D3</text><text x="265" y="55">F3</text><text x="265" y="35">A3 </text>
          </g>
        </svg>
        <figcaption>En clé de fa, les cinq lignes se lisent de bas en haut : Sol, Si, Ré, Fa, La.</figcaption>
      </figure>
      <p>Les quatre interlignes portent les notes intermédiaires. En clé de sol, de bas en haut : Fa, La, Do, Mi. En clé de fa : La, Do, Mi, Sol. Les notes au-dessus ou au-dessous de la portée s’écrivent avec de petites lignes supplémentaires.</p>
      <p>Le Do central se place entre les deux portées du piano et s’écrit sur une petite ligne supplémentaire :</p>
      <figure>
        <svg class="theory-illustration" viewBox="0 0 420 130" role="img" aria-labelledby="middleCTitle middleCDesc">
          <title id="middleCTitle">Le Do central entre les deux portées</title>
          <desc id="middleCDesc">Le Do central est placé sur une petite ligne supplémentaire entre la portée de sol et celle de fa.</desc>
          <g fill="none" stroke="currentColor" stroke-width="1.3">
            <path d="M20 20H220M20 30H220M20 40H220M20 50H220M20 60H220"/>
            <path d="M20 80H220M20 90H220M20 100H220M20 110H220M20 120H220"/>
            <path d="M92 70H128" stroke-width="2"/>
          </g>
          <ellipse cx="110" cy="70" rx="7" ry="5" transform="rotate(-20 110 70)" fill="currentColor"/>
          <text x="235" y="47">Portée de la main droite</text><text x="235" y="107">Portée de la main gauche</text>
          <text x="235" y="75" class="accent">Do central (C4)</text>
        </svg>
        <figcaption>La petite barre traverse la note : c’est une ligne supplémentaire, utilisée lorsque la note dépasse la portée.</figcaption>
      </figure>
      <h3>Armure et altérations</h3>
      <p>Les dièses ou bémols placés après la clé forment l’<b>armure</b> : ils s’appliquent à toutes les notes de même nom, dans toutes les octaves, jusqu’à un changement d’armure. Un <b>accidentel</b> écrit devant une note ne vaut que pour cette hauteur exacte, jusqu’à la barre de mesure.</p>
      <ul>
        <li>Ordre des dièses : <b>Fa – Do – Sol – Ré – La – Mi – Si</b>.</li>
        <li>Ordre des bémols (l’inverse) : <b>Si – Mi – La – Ré – Sol – Do – Fa</b>.</li>
        <li><b>Dièses</b> : la tonalité majeure est le demi-ton au-dessus du dernier dièse. Exemple : Fa♯ et Do♯ → Ré majeur.</li>
        <li><b>Bémols</b> : la tonalité majeure est l’avant-dernier bémol. Exemple : Si♭ et Mi♭ → Si♭ majeur. Avec un seul bémol (Si♭), c’est Fa majeur.</li>
      </ul>
      <div class="example"><b>À retenir</b><br>Clé de sol = Sol sur la 2ᵉ ligne ; clé de fa = Fa sur la 4ᵉ. Le Do central est sur une ligne supplémentaire entre les deux portées. L’armure se lit avant de jouer.<br><i>À essayer :</i> en mode jeu, choisis « Clé de sol » puis « Clé de fa » jusqu’à lire sans hésiter.</div>
    </section>

    <section data-summary="Valeurs des notes, chiffrages de mesure, points, liaisons et tempo.">
      <h2>Mesure et rythme</h2>
      <p>Le chiffrage de mesure indique combien de temps contient une mesure et quelle figure vaut un temps. Par exemple, en <b>4/4</b>, on compte généralement quatre temps par mesure.</p>
      <ul>
        <li>Ronde : 4 temps en 4/4 ; blanche : 2 temps.</li>
        <li>Noire : 1 temps ; croche : ½ temps.</li>
        <li>Deux croches ont donc la même durée qu’une noire.</li>
      </ul>
      <div class="rhythm-grid" role="group" aria-label="Durée des principales figures de notes">
  <figure class="rhythm-card">
    <svg viewBox="0 0 80 80" aria-hidden="true">
      <ellipse cx="40" cy="44" rx="17" ry="11.5" fill="currentColor"/>
      <ellipse cx="40" cy="44" rx="5.6" ry="9.6" transform="rotate(30 40 44)" fill="var(--card)"/>
    </svg>
    <figcaption>Ronde<span>4 temps</span></figcaption>
  </figure>
  <figure class="rhythm-card">
    <svg viewBox="0 0 80 80" aria-hidden="true">
      <ellipse cx="34" cy="58" rx="12.8" ry="8.6" transform="rotate(-22 34 58)" fill="currentColor"/>
      <ellipse cx="34" cy="58" rx="8.8" ry="3.4" transform="rotate(-40 34 58)" fill="var(--card)"/>
      <path d="M45.2 56V12" stroke="currentColor" stroke-width="3" fill="none"/>
    </svg>
    <figcaption>Blanche<span>2 temps</span></figcaption>
  </figure>
  <figure class="rhythm-card">
    <svg viewBox="0 0 80 80" aria-hidden="true">
      <ellipse cx="34" cy="58" rx="12.8" ry="8.6" transform="rotate(-22 34 58)" fill="currentColor"/>
      <path d="M45.2 56V12" stroke="currentColor" stroke-width="3" fill="none"/>
    </svg>
    <figcaption>Noire<span>1 temps</span></figcaption>
  </figure>
  <figure class="rhythm-card">
    <svg viewBox="0 0 80 80" aria-hidden="true">
      <ellipse cx="34" cy="58" rx="12.8" ry="8.6" transform="rotate(-22 34 58)" fill="currentColor"/>
      <path d="M45.2 56V12" stroke="currentColor" stroke-width="3" fill="none"/>
      <path d="M44 12C45 27 62 30 60 47C57 38 51 35 44 34Z" fill="currentColor"/>
    </svg>
    <figcaption>Croche<span>½ temps</span></figcaption>
  </figure>
</div>
      <p>En 4/4, chaque figure se divise en deux pour obtenir la suivante : ronde → blanche → noire → croche.</p>
      <div class="theory-table-wrap">
        <table class="theory-table">
          <thead><tr><th>Figure</th><th>Durée (4/4)</th><th>Silence</th></tr></thead>
          <tbody>
            <tr><th>Ronde</th><td>4 temps</td><td>pause</td></tr>
            <tr><th>Blanche</th><td>2 temps</td><td>demi-pause</td></tr>
            <tr><th>Noire</th><td>1 temps</td><td>soupir</td></tr>
            <tr><th>Croche</th><td>½ temps</td><td>demi-soupir</td></tr>
            <tr><th>Double-croche</th><td>¼ de temps</td><td>quart de soupir</td></tr>
          </tbody>
        </table>
      </div>
      <p>Un <b>point</b> après une figure ajoute la moitié de sa durée : une blanche pointée dure 2 + 1 = 3 temps. Une <b>liaison</b> relie deux notes de même hauteur : on joue la première et on la prolonge de la durée de la seconde, sans la rejouer.</p>
      <h3>Les chiffrages courants</h3>
      <ul>
        <li><b>4/4</b> : quatre noires par mesure. Comptage « 1 – 2 – 3 – 4 », temps forts sur 1 et 3.</li>
        <li><b>3/4</b> : trois noires, comme dans une valse : « fort – faible – faible ».</li>
        <li><b>2/4</b> : deux noires, comme dans une marche.</li>
        <li><b>6/8</b> : six croches groupées en <b>deux temps de trois</b> : « 1-2-3, 4-5-6 ».</li>
      </ul>
      <p>Le <b>tempo</b> est la vitesse du temps, en battements par minute (BPM). Repères approximatifs : Andante ≈ 76–108, Moderato ≈ 108–120, Allegro ≈ 120–156. Pour compter une double-croche, on dit « 1 – e – et – a ».</p>
      <div class="example"><b>À retenir</b><br>Le chiffrage donne le nombre de temps par mesure. Une figure vaut la moitié de la précédente ; le point ajoute la moitié ; la liaison prolonge.<br><i>À essayer :</i> charge une partition en 3/4, active le métronome (l’accent tombe sur le temps 1) et frappe chaque temps en comptant à voix haute.</div>
    </section>

    <section data-summary="Mesurer les distances entre notes, construire les gammes, comprendre le cycle des quintes.">
      <h2>Intervalles et gammes</h2>
      <p>Un <b>intervalle</b> est la distance entre deux notes. Sur le piano, un demi-ton correspond au déplacement vers la touche voisine (blanche ou noire) ; deux demi-tons forment un ton. Une <b>gamme</b> est une suite de notes organisée autour d’un centre musical : la <b>tonique</b>.</p>
      <h3>Nommer les intervalles</h3>
      <p>Le <b>nombre</b> se trouve en comptant les noms de notes, départ compris : Do–Mi est une <b>tierce</b> (Do, Ré, Mi). La <b>qualité</b> (majeure, mineure, juste…) se mesure en demi-tons.</p>
      <div class="theory-table-wrap">
        <table class="theory-table">
          <thead><tr><th>Intervalle</th><th>Demi-tons</th><th>Depuis Do</th></tr></thead>
          <tbody>
            <tr><th>Seconde mineure / majeure</th><td>1 / 2</td><td>Ré♭ / Ré</td></tr>
            <tr><th>Tierce mineure / majeure</th><td>3 / 4</td><td>Mi♭ / Mi</td></tr>
            <tr><th>Quarte juste</th><td>5</td><td>Fa</td></tr>
            <tr><th>Triton (quarte augmentée)</th><td>6</td><td>Fa♯</td></tr>
            <tr><th>Quinte juste</th><td>7</td><td>Sol</td></tr>
            <tr><th>Sixte mineure / majeure</th><td>8 / 9</td><td>La♭ / La</td></tr>
            <tr><th>Septième mineure / majeure</th><td>10 / 11</td><td>Si♭ / Si</td></tr>
            <tr><th>Octave</th><td>12</td><td>Do</td></tr>
          </tbody>
        </table>
      </div>
      <p>Les intervalles « justes » (quarte, quinte, octave) ont une sonorité très stable. Les tierces et les sixtes, majeures ou mineures, donnent leur couleur aux accords.</p>
      <p>Écoute chaque intervalle depuis Do :</p>
      <p><button class="play" data-play="60,61" data-gap="650" data-dur="900">▶ 2de m</button><button class="play" data-play="60,62" data-gap="650" data-dur="900">▶ 2de M</button><button class="play" data-play="60,63" data-gap="650" data-dur="900">▶ 3ce m</button><button class="play" data-play="60,64" data-gap="650" data-dur="900">▶ 3ce M</button><button class="play" data-play="60,65" data-gap="650" data-dur="900">▶ 4te</button><button class="play" data-play="60,66" data-gap="650" data-dur="900">▶ triton</button><button class="play" data-play="60,67" data-gap="650" data-dur="900">▶ 5te</button><button class="play" data-play="60,68" data-gap="650" data-dur="900">▶ 6te m</button><button class="play" data-play="60,69" data-gap="650" data-dur="900">▶ 6te M</button><button class="play" data-play="60,70" data-gap="650" data-dur="900">▶ 7e m</button><button class="play" data-play="60,71" data-gap="650" data-dur="900">▶ 7e M</button><button class="play" data-play="60,72" data-gap="650" data-dur="900">▶ octave</button></p>
      <h3>Qu’est-ce que la tonique ?</h3>
      <p>La tonique est la note qui donne son nom à la tonalité et autour de laquelle la musique semble s’organiser. En Do majeur, la tonique est Do ; en La mineur, c’est La. Elle donne souvent une impression de repos ou d’arrivée, un peu comme un point de retour dans une mélodie.</p>
      <p>La tonique n’est pas forcément la première note jouée : une mélodie peut commencer sur Mi ou Sol tout en restant en Do majeur. Ce qui compte, c’est que les autres notes et les accords créent une relation avec Do et que les phrases reviennent souvent vers ce centre.</p>
      <p>On emploie le même mot pour l’accord construit sur cette note : l’<b>accord de tonique</b> (degré I) contient Do–Mi–Sol en Do majeur. Pour éviter la confusion, retiens : <b>tonique = note-centre</b> ; <b>accord de tonique = accord bâti sur cette note</b>.</p>
      <div class="example"><b>Entendre le rôle de la tonique :</b> joue Do–Ré–Mi–Fa–Sol–Fa–Mi–Ré–Do. La fin sur Do donne une impression d’arrivée. Termine plutôt sur Sol : la phrase semble souvent appeler une suite.</div>
      <h3>Le cycle des quintes (cercle des quintes)</h3>
      <p>Le cycle des quintes range les tonalités selon un même déplacement : une <b>quinte juste vers le haut</b> (sept demi-tons). En partant de Do, une quinte au-dessus est Sol ; une quinte au-dessus de Sol est Ré, puis La, Mi et Si. Après douze déplacements, on revient à la note de départ, à l’octave près.</p>
      <figure>
        <svg class="theory-illustration" viewBox="0 0 440 380" role="img" aria-labelledby="fifthsCircleTitle fifthsCircleDesc">
          <title id="fifthsCircleTitle">Cercle des quintes avec tonalités majeures et mineures relatives</title>
          <desc id="fifthsCircleDesc">En partant de Do et en tournant dans le sens horaire, chaque tonalité majeure est une quinte au-dessus de la précédente. À l’intérieur sont indiquées les tonalités mineures relatives, qui partagent la même armure.</desc>
          <defs>
            <marker id="fifthsArrow" markerWidth="7" markerHeight="7" refX="5.5" refY="3.5" orient="auto">
              <path d="M0 0L7 3.5L0 7Z" fill="var(--accent)"/>
            </marker>
          </defs>
          <circle cx="220" cy="190" r="145" fill="none" stroke="var(--line)" stroke-width="1.5"/>
          <circle cx="220" cy="190" r="98" fill="none" stroke="var(--line)" stroke-width="1" stroke-dasharray="3 4"/>
          <g class="fifths-link" marker-end="url(#fifthsArrow)">
            <path d="M242 47A145 145 0 0 1 286 67"/><path d="M309 85A145 145 0 0 1 343 119"/>
            <path d="M360 140A145 145 0 0 1 360 190"/><path d="M360 214A145 145 0 0 1 343 261"/>
            <path d="M326 278A145 145 0 0 1 286 313"/><path d="M264 331A145 145 0 0 1 232 335"/>
            <path d="M208 335A145 145 0 0 1 164 313"/><path d="M147 295A145 145 0 0 1 113 261"/>
            <path d="M98 240A145 145 0 0 1 98 190"/><path d="M98 166A145 145 0 0 1 113 119"/>
            <path d="M130 102A145 145 0 0 1 164 67"/><path d="M176 49A145 145 0 0 1 208 45"/>
          </g>
          <g text-anchor="middle">
            <g><circle class="major-key-node" cx="220" cy="45" r="29"/><text class="circle-major-label" x="220" y="43">Do</text><text class="circle-signature" x="220" y="56">0 alt.</text><text class="circle-minor-label" x="220" y="101">La m</text></g>
            <g><circle class="major-key-node" cx="292.5" cy="64.4" r="29"/><text class="circle-major-label" x="292.5" y="62">Sol</text><text class="circle-signature" x="292.5" y="75">1 ♯</text><text class="circle-minor-label" x="270" y="112">Mi m</text></g>
            <g><circle class="major-key-node" cx="345.5" cy="117.5" r="29"/><text class="circle-major-label" x="345.5" y="115">Ré</text><text class="circle-signature" x="345.5" y="128">2 ♯</text><text class="circle-minor-label" x="305" y="151">Si m</text></g>
            <g><circle class="major-key-node" cx="365" cy="190" r="29"/><text class="circle-major-label" x="365" y="188">La</text><text class="circle-signature" x="365" y="201">3 ♯</text><text class="circle-minor-label" x="320" y="194">Fa♯ m</text></g>
            <g><circle class="major-key-node" cx="345.5" cy="262.5" r="29"/><text class="circle-major-label" x="345.5" y="260">Mi</text><text class="circle-signature" x="345.5" y="273">4 ♯</text><text class="circle-minor-label" x="305" y="237">Do♯ m</text></g>
            <g><circle class="major-key-node" cx="292.5" cy="315.6" r="29"/><text class="circle-major-label" x="292.5" y="313">Si</text><text class="circle-signature" x="292.5" y="326">5 ♯</text><text class="circle-minor-label" x="270" y="278">Sol♯ m</text></g>
            <g><circle class="major-key-node" cx="220" cy="335" r="32"/><text class="circle-major-label" x="220" y="331">Fa♯ / Sol♭</text><text class="circle-signature" x="220" y="344">6 ♯ / 6 ♭</text><text class="circle-minor-label" x="220" y="294">Ré♯ m / Mi♭ m</text></g>
            <g><circle class="major-key-node" cx="147.5" cy="315.6" r="32"/><text class="circle-major-label" x="147.5" y="311">Do♯ / Ré♭</text><text class="circle-signature" x="147.5" y="324">7 ♯ / 5 ♭</text><text class="circle-minor-label" x="170" y="278">Si♭ m</text></g>
            <g><circle class="major-key-node" cx="94.5" cy="262.5" r="32"/><text class="circle-major-label" x="94.5" y="258">Sol♯ / La♭</text><text class="circle-signature" x="94.5" y="271">8 ♯ / 4 ♭</text><text class="circle-minor-label" x="135" y="237">Fa m</text></g>
            <g><circle class="major-key-node" cx="75" cy="190" r="32"/><text class="circle-major-label" x="75" y="186">Ré♯ / Mi♭</text><text class="circle-signature" x="75" y="199">9 ♯ / 3 ♭</text><text class="circle-minor-label" x="120" y="194">Do m</text></g>
            <g><circle class="major-key-node" cx="94.5" cy="117.5" r="32"/><text class="circle-major-label" x="94.5" y="113">La♯ / Si♭</text><text class="circle-signature" x="94.5" y="126">10 ♯ / 2 ♭</text><text class="circle-minor-label" x="135" y="151">Sol m</text></g>
            <g><circle class="major-key-node" cx="147.5" cy="64.4" r="32"/><text class="circle-major-label" x="147.5" y="60">Mi♯ / Fa</text><text class="circle-signature" x="147.5" y="73">11 ♯ / 1 ♭</text><text class="circle-minor-label" x="170" y="112">Ré m</text></g>
            <text class="circle-center" x="220" y="178">Cercle</text>
            <text class="circle-center" x="220" y="194">des quintes</text>
            <text class="circle-center-small" x="220" y="211">majeur · mineur</text>
          </g>
        </svg>
        <figcaption>Les tonalités majeures sont sur l’anneau extérieur ; leur relative mineure est à l’intérieur. Les flèches montrent le sens horaire, de quinte en quinte.</figcaption>
      </figure>
      <p><b>Dans le sens horaire</b>, on monte d’une quinte juste (sept demi-tons) et on ajoute un dièse à l’armure à chaque étape : <b>Do → Sol → Ré → La → Mi → Si → Fa♯ → Do♯</b>, puis on continue de la même façon. Exemple : Do majeur n’a aucun dièse ; Sol majeur en a un (Fa♯) ; Ré majeur en a deux (Fa♯ et Do♯).</p>
      <p><b>Dans le sens antihoraire</b>, on descend d’une quinte juste (ce qui revient à monter d’une quarte) et on ajoute un bémol à chaque étape : <b>Do → Fa → Si♭ → Mi♭ → La♭ → Ré♭ → Sol♭</b>… Exemple : Fa majeur a un bémol (Si♭) et Si♭ majeur en a deux (Si♭ et Mi♭).</p>
      <p>Au bout du tour, on revient à Do, à des octaves différentes. Sur un clavier tempéré, certains noms désignent la même touche : <b>Fa♯ = Sol♭</b>, <b>Do♯ = Ré♭</b>, etc. Le schéma associe ces écritures enharmoniques pour montrer les tonalités usuelles sans changer le son du cycle.</p>
      <p>L’anneau intérieur donne la <b>tonalité mineure relative</b> de chaque majeur : elle partage son armure, mais sa tonique se trouve trois demi-tons plus bas (c’est le VIᵉ degré de la gamme majeure). Ainsi, Do majeur et La mineur ont les mêmes notes, mais ne reposent pas sur le même centre musical.</p>
      <h3>Gamme majeure</h3>
      <p>La gamme majeure se construit avec un motif fixe de tons (T) et demi-tons (½T) :</p>
      <div class="example"><button class="play" data-play="60,62,64,65,67,69,71,72" data-gap="350">▶ Écouter</button> <b>T – T – ½T – T – T – T – ½T</b><br>Do majeur : Do – Ré – Mi – Fa – Sol – La – Si – Do.<br>Sur le clavier, depuis Do : 0, 2, 4, 5, 7, 9, 11, 12 demi-tons.</div>
      <figure>
        <svg class="theory-illustration" viewBox="0 0 460 140" role="img" aria-labelledby="scaleTitle scaleDesc">
          <title id="scaleTitle">Les notes de Do majeur sur une portée</title>
          <desc id="scaleDesc">Do, Ré, Mi, Fa, Sol, La, Si et Do montent progressivement sur la portée.</desc>
          <g class="staff-lines">
            <line x1="20" y1="30" x2="440" y2="30"/><line x1="20" y1="45" x2="440" y2="45"/>
            <line x1="20" y1="60" x2="440" y2="60"/><line x1="20" y1="75" x2="440" y2="75"/>
            <line x1="20" y1="90" x2="440" y2="90"/>
          </g>
          <line x1="40" y1="105" x2="62.5" y2="105" stroke="currentColor" stroke-width="1.5"/>
          <g class="staff-note">
            <ellipse cx="48" cy="105" rx="7" ry="5" transform="rotate(-20 48 97.5)"/>
            <ellipse cx="100" cy="97.5" rx="7" ry="5" transform="rotate(-20 100 90)"/>
            <ellipse cx="152" cy="90" rx="7" ry="5" transform="rotate(-20 152 82.5)"/>
            <ellipse cx="204" cy="82.5" rx="7" ry="5" transform="rotate(-20 204 75)"/>
            <ellipse cx="256" cy="75" rx="7" ry="5" transform="rotate(-20 256 67.5)"/>
            <ellipse cx="308" cy="67.5" rx="7" ry="5" transform="rotate(-20 308 60)"/>
            <ellipse cx="360" cy="60" rx="7" ry="5" transform="rotate(-20 360 52.5)"/>
            <ellipse cx="412" cy="52.5" rx="7" ry="5" transform="rotate(-20 412 45)"/>
          </g>
          <g class="staff-label" text-anchor="middle">
            <text x="48" y="120">Do</text><text x="100" y="120">Ré</text><text x="152" y="120">Mi</text>
            <text x="204" y="120">Fa</text><text x="256" y="120">Sol</text><text x="308" y="120">La</text>
            <text x="360" y="120">Si</text><text x="412" y="120">Do</text>
          </g>
        </svg>
        <figcaption>La gamme monte par degrés conjoints : les notes se placent alternativement sur les lignes et dans les interlignes.</figcaption>
      </figure>
      <p>Les demi-tons se trouvent entre les degrés <b>3–4</b> et <b>7–8</b>. En Do majeur, toutes les notes sont naturelles. Pour former une gamme majeure depuis une autre tonique, on conserve le même motif et on ajoute les dièses ou bémols nécessaires. Exemple : Sol majeur contient Fa♯ pour garder un demi-ton entre Fa♯ et Sol.</p>
      <h3>Gamme mineure naturelle</h3>
      <p>La gamme mineure naturelle a un autre agencement :</p>
      <div class="example"><button class="play" data-play="57,59,60,62,64,65,67,69" data-gap="350">▶ Écouter</button> <b>T – ½T – T – T – ½T – T – T</b><br>La mineur : La – Si – Do – Ré – Mi – Fa – Sol – La.</div>
      <p>Elle se distingue de la majeure surtout par sa <b>tierce mineure</b> (le 3e degré abaissé). La mineur et Do majeur utilisent les mêmes notes naturelles : on dit qu’elles sont des tonalités relatives. Leur tonique, et donc leur centre musical, n’est toutefois pas le même.</p>
      <h3>Autres formes et degrés</h3>
      <ul>
        <li>La <b>mineure harmonique</b> relève le 7e degré : en La mineur, Sol devient Sol♯. Cela renforce l’attraction vers La.</li>
        <li>La <b>mineure mélodique</b> classique relève les 6e et 7e degrés en montant, puis reprend généralement la mineure naturelle en descendant.</li>
        <li>La <b>gamme chromatique</b> parcourt les 12 demi-tons de l’octave, en utilisant des notes naturelles et altérées.</li>
      </ul>
      <p>Les notes d’une gamme ont des fonctions appelées <b>degrés</b> : I tonique, II sus-tonique, III médiante, IV sous-dominante, V dominante, VI sus-dominante, VII sensible (ou sous-tonique si elle est à un ton de la tonique). Les accords sont souvent construits en empilant une note sur deux dans la gamme.</p>
      <div class="example"><b>À retenir</b><br>Un intervalle se nomme par son nombre et sa qualité. Majeur : T T ½ T T T ½. Mineur naturel : T ½ T T ½ T T. Le cycle des quintes ajoute un dièse (sens horaire) ou un bémol (sens antihoraire) à chaque étape.<br><i>À essayer :</i> joue la gamme de Do majeur puis de La mineur, mains séparées, en nommant chaque note (« Afficher notes »).</div>
    </section>

    <section data-summary="Triades, renversements, cadences, accords de septième et noms d’accords.">
      <h2>Accords et harmonie</h2>
      <p>L’<b>harmonie</b> étudie les accords et la façon dont ils s’enchaînent. Un accord réunit plusieurs hauteurs entendues ensemble ou successivement ; il accompagne souvent une mélodie et donne une couleur, une direction et des points de repos à la musique.</p>

      <h3>Construire une triade</h3>
      <p>Une triade (accord de trois sons) s’obtient en empilant des tierces : on prend une note, on saute la suivante dans la gamme, puis on prend la suivante. Ses trois notes sont la <b>fondamentale</b> (nom de l’accord), la <b>tierce</b> (qui détermine surtout son caractère majeur ou mineur) et la <b>quinte</b>.</p>
      <div class="example"><button class="play" data-play="60,64,67" data-chord="1" data-dur="1500">▶ Écouter</button> <b>Do majeur : Do – Mi – Sol</b><br>Do est la fondamentale, Mi la tierce majeure et Sol la quinte juste. En demi-tons depuis Do : 0, 4, 7.</div>
      <p>Pour passer de Do majeur à Do mineur, on abaisse la tierce d’un demi-ton : Mi devient Mi♭. La fondamentale et la quinte restent les mêmes.</p>
      <figure>
        <svg class="theory-illustration" viewBox="0 0 300 125" role="img" aria-labelledby="triadKeyboardTitle triadKeyboardDesc">
          <title id="triadKeyboardTitle">Do majeur au clavier</title>
          <desc id="triadKeyboardDesc">Les touches Do, Mi et Sol sont mises en évidence pour montrer l’accord de Do majeur.</desc>
          <g stroke="currentColor" stroke-width="1.5">
            <rect x="10" y="14" width="40" height="78" rx="2" fill="var(--accent)"/>
            <rect x="50" y="14" width="40" height="78" rx="2" fill="#fff"/>
            <rect x="90" y="14" width="40" height="78" rx="2" fill="var(--accent)"/>
            <rect x="130" y="14" width="40" height="78" rx="2" fill="#fff"/>
            <rect x="170" y="14" width="40" height="78" rx="2" fill="var(--accent)"/>
            <rect x="210" y="14" width="40" height="78" rx="2" fill="#fff"/>
            <rect x="250" y="14" width="40" height="78" rx="2" fill="#fff"/>
            <rect x="37" y="14" width="26" height="48" rx="2" fill="#202124"/>
            <rect x="77" y="14" width="26" height="48" rx="2" fill="#202124"/>
            <rect x="157" y="14" width="26" height="48" rx="2" fill="#202124"/>
            <rect x="197" y="14" width="26" height="48" rx="2" fill="#202124"/>
            <rect x="237" y="14" width="26" height="48" rx="2" fill="#202124"/>
          </g>
          <g text-anchor="middle">
            <text x="30" y="112" class="highlighted-key-label">Do</text><text x="70" y="112" class="white-key-label">Ré</text><text x="110" y="112" class="highlighted-key-label">Mi</text>
            <text x="150" y="112" class="white-key-label">Fa</text><text x="190" y="112" class="highlighted-key-label">Sol</text><text x="230" y="112" class="white-key-label">La</text><text x="270" y="112" class="white-key-label">Si</text>
          </g>
        </svg>
        <figcaption>Do–Mi–Sol forme la triade de Do majeur : fondamentale, tierce majeure et quinte. Pour Do mineur, la touche Mi est remplacée par Mi♭.</figcaption>
      </figure>

      <h3>Les principales triades</h3>
      <div class="theory-table-wrap">
        <table class="theory-table">
          <thead><tr><th>Type</th><th>Empilement des intervalles</th><th>Depuis Do</th><th>Couleur fréquente</th></tr></thead>
          <tbody>
            <tr><th>Majeure</th><td>tierce majeure + tierce mineure</td><td>Do – Mi – Sol</td><td>stable, lumineux</td></tr>
            <tr><th>Mineure</th><td>tierce mineure + tierce majeure</td><td>Do – Mi♭ – Sol</td><td>plus sombre ou doux</td></tr>
            <tr><th>Diminuée</th><td>tierce mineure + tierce mineure</td><td>Do – Mi♭ – Sol♭</td><td>tendu, instable</td></tr>
            <tr><th>Augmentée</th><td>tierce majeure + tierce majeure</td><td>Do – Mi – Sol♯</td><td>suspendu, instable</td></tr>
          </tbody>
        </table>
      </div>
      <p>En demi-tons au-dessus de la fondamentale, les formules sont respectivement <b>0–4–7</b>, <b>0–3–7</b>, <b>0–3–6</b> et <b>0–4–8</b>. Ces écarts sont pratiques à repérer sur le clavier ; le nom des notes dépend toutefois de l’orthographe musicale et de la tonalité.</p>

      <h3>Accords d’une gamme majeure</h3>
      <p>En empilant les notes de Do majeur par tierces, on obtient un accord sur chaque degré. Les chiffres romains indiquent le degré : majuscule pour un accord majeur, minuscule pour un mineur, et ° pour un diminué.</p>
      <div class="theory-table-wrap">
        <table class="theory-table">
          <thead><tr><th>Degré</th><th>Accord</th><th>Notes</th><th>Fonction courante</th></tr></thead>
          <tbody>
            <tr><th>I</th><td>Do majeur</td><td>Do – Mi – Sol</td><td>tonique : repos, centre</td></tr>
            <tr><th>ii</th><td>Ré mineur</td><td>Ré – Fa – La</td><td>prépare souvent la dominante</td></tr>
            <tr><th>iii</th><td>Mi mineur</td><td>Mi – Sol – Si</td><td>couleur de tonique</td></tr>
            <tr><th>IV</th><td>Fa majeur</td><td>Fa – La – Do</td><td>sous-dominante : ouverture</td></tr>
            <tr><th>V</th><td>Sol majeur</td><td>Sol – Si – Ré</td><td>dominante : appelle un retour</td></tr>
            <tr><th>vi</th><td>La mineur</td><td>La – Do – Mi</td><td>relatif mineur, couleur douce</td></tr>
            <tr><th>vii°</th><td>Si diminué</td><td>Si – Ré – Fa</td><td>tension, mène souvent vers I</td></tr>
          </tbody>
        </table>
      </div>
      <p>La <b>tonique</b> (I) donne une impression de stabilité. La <b>sous-dominante</b> (IV) éloigne du repos ; la <b>dominante</b> (V) crée une attente qui se résout souvent sur I. Cette attraction est particulièrement forte entre la sensible Si et Do.</p>

      <h3>Enchaînements et cadences</h3>
      <p>Une progression est une suite d’accords. Voici une progression très courante (I – V – vi – IV), ici en Do majeur :</p>
      <div class="chord-progression" aria-label="Progression Do majeur, Sol majeur, La mineur, Fa majeur">
        <span><b>I · Do</b><small>Do–Mi–Sol</small></span><span aria-hidden="true">→</span>
        <span><b>V · Sol</b><small>Sol–Si–Ré</small></span><span aria-hidden="true">→</span>
        <span><b>vi · La mineur</b><small>La–Do–Mi</small></span><span aria-hidden="true">→</span>
        <span><b>IV · Fa</b><small>Fa–La–Do</small></span>
      </div>
      <p><button class="play" data-seq="60,64,67|59,62,67|60,64,67" data-gap="1000">▶ I – V – I</button></p>
      <div class="example"><b>V – I : Sol – Do</b> est la <b>cadence parfaite</b> : la conclusion la plus affirmée.<br><b>IV – I : Fa – Do</b> est la <b>cadence plagale</b> (le « Amen » des chants).<br><b>V – vi : Sol – La mineur</b> est la <b>cadence rompue</b> : elle remplace le retour attendu vers Do.<br>Finir sur <b>V</b> donne une <b>demi-cadence</b> : la phrase reste en suspens.</div>
      <p>Compare les cadences (précédées de I) :</p>
      <p><button class="play" data-seq="60,64,67|59,62,67|60,64,67" data-gap="900">▶ Parfaite V–I</button><button class="play" data-seq="60,64,67|60,65,69|60,64,67" data-gap="900">▶ Plagale IV–I</button><button class="play" data-seq="60,64,67|59,62,67|60,64,69" data-gap="900">▶ Rompue V–vi</button><button class="play" data-seq="60,64,67|59,62,67" data-gap="900">▶ Demi-cadence I–V</button></p>

      <h3>Renversements et disposition au piano</h3>
      <p>Un accord est à l’<b>état fondamental</b> quand sa fondamentale est la note la plus grave. On peut déplacer cette note à l’octave supérieure pour obtenir le premier renversement, puis déplacer la nouvelle note grave pour le deuxième. Les mêmes notes restent présentes : seul leur ordre change.</p>
      <div class="theory-table-wrap">
        <table class="theory-table">
          <thead><tr><th>Position de Do majeur</th><th>Notes de la plus grave à la plus aiguë</th><th>Note à la basse</th></tr></thead>
          <tbody>
            <tr><th>État fondamental</th><td>Do – Mi – Sol</td><td>Do</td></tr>
            <tr><th>Premier renversement</th><td>Mi – Sol – Do</td><td>Mi</td></tr>
            <tr><th>Deuxième renversement</th><td>Sol – Do – Mi</td><td>Sol</td></tr>
          </tbody>
        </table>
      </div>
      <p>Au piano, la main gauche peut jouer la fondamentale ou une basse simple, tandis que la main droite joue l’accord. Choisir le renversement le plus proche de l’accord suivant évite de grands sauts et rend l’accompagnement plus fluide : c’est la <b>conduite des voix</b>.</p>

      <h3>Accords de septième</h3>
      <p>En ajoutant une tierce au-dessus d’une triade, on obtient un accord de quatre notes, souvent appelé <b>accord de septième</b>. Par exemple, Sol–Si–Ré–Fa est un Sol septième de dominante (Sol7) : le Fa et le Si créent une tension qui appelle généralement Do.</p>
      <div class="example"><b>Do majeur 7 : Do – Mi – Sol – Si</b> (sonorité douce, stable).<br><b>Do mineur 7 : Do – Mi♭ – Sol – Si♭</b> (sonorité mineure, plus riche).<br><b>Sol 7 : Sol – Si – Ré – Fa</b> (tension qui se résout souvent sur Do).</div>

      <h3>Lire les noms d’accords</h3>
      <p>Les grilles d’accords utilisent les lettres : C = Do, D = Ré, E = Mi, F = Fa, G = Sol, A = La, B = Si.</p>
      <div class="theory-table-wrap">
        <table class="theory-table">
          <thead><tr><th>Symbole</th><th>Accord</th><th>Notes</th></tr></thead>
          <tbody>
            <tr><th>C</th><td>Do majeur</td><td>Do – Mi – Sol</td></tr>
            <tr><th>Cm</th><td>Do mineur</td><td>Do – Mi♭ – Sol</td></tr>
            <tr><th>C7</th><td>Do septième de dominante</td><td>Do – Mi – Sol – Si♭</td></tr>
            <tr><th>Cmaj7</th><td>Do majeur 7</td><td>Do – Mi – Sol – Si</td></tr>
            <tr><th>Cdim</th><td>Do diminué</td><td>Do – Mi♭ – Sol♭</td></tr>
            <tr><th>Csus4</th><td>Do quarte suspendue</td><td>Do – Fa – Sol</td></tr>
          </tbody>
        </table>
      </div>
      <div class="example"><b>Enchaînement fluide I – IV – V – I en Do</b> : Do–Mi–Sol → Do–Fa–La → Si–Ré–Sol → Do–Mi–Sol. Chaque note de la main droite bouge d’un pas ou reste en place, pendant que la main gauche joue la basse Do, Fa, Sol, Do.</div>
      <h3>Une méthode pour analyser un accord</h3>
      <ol>
        <li>Repère la note la plus grave, sans supposer qu’elle est toujours la fondamentale.</li>
        <li>Range les notes par tierces et identifie la fondamentale et les éventuels renversements.</li>
        <li>Mesure les intervalles depuis la fondamentale pour reconnaître majeur, mineur, diminué ou augmenté.</li>
        <li>Regarde la tonalité et les accords voisins : ils aident à comprendre la fonction de l’accord.</li>
      </ol>
      <div class="example"><b>À retenir</b><br>Triade = fondamentale + tierce + quinte (0-4-7 majeur, 0-3-7 mineur). Les accords I, IV et V suffisent à harmoniser beaucoup de mélodies. Un renversement change la basse, pas les notes.</div>
    </section>

    <section data-summary="Du pianissimo au fortissimo, du legato au staccato : les mots et signes qui disent comment jouer.">
      <h2>Nuances et termes d’expression</h2>
      <p>Une partition indique <b>quelles</b> notes jouer, mais aussi <b>comment</b> : plus ou moins fort, lié ou détaché, vite ou lentement. Ces consignes, le plus souvent en italien, forment le vocabulaire d’expression.</p>
      <h3>Les nuances</h3>
      <div class="theory-table-wrap"><table class="theory-table">
        <thead><tr><th>Signe</th><th>Nom</th><th>Sens</th></tr></thead>
        <tbody>
          <tr><th>pp</th><td>pianissimo</td><td>très doucement</td></tr>
          <tr><th>p</th><td>piano</td><td>doucement</td></tr>
          <tr><th>mp</th><td>mezzo-piano</td><td>assez doucement</td></tr>
          <tr><th>mf</th><td>mezzo-forte</td><td>moyennement fort</td></tr>
          <tr><th>f</th><td>forte</td><td>fort</td></tr>
          <tr><th>ff</th><td>fortissimo</td><td>très fort</td></tr>
        </tbody></table></div>
      <p>Écoute la même note à intensité croissante :</p>
      <p><button class="play" data-play="60" data-vel=".2">pp</button><button class="play" data-play="60" data-vel=".35">p</button><button class="play" data-play="60" data-vel=".6">mf</button><button class="play" data-play="60" data-vel=".8">f</button><button class="play" data-play="60" data-vel="1">ff</button></p>
      <h3>Crescendo et decrescendo</h3>
      <p>Un <b>crescendo</b> (<i>cresc.</i> ou un soufflet qui s’ouvre) augmente progressivement l’intensité ; un <b>decrescendo</b> ou <b>diminuendo</b> (soufflet qui se ferme) la diminue.</p>
      <p><button class="play" data-play="60,62,64,65,67,69" data-vel=".25,.35,.45,.6,.75,.95" data-gap="400">▶ Crescendo</button><button class="play" data-play="69,67,65,64,62,60" data-vel=".95,.75,.6,.45,.35,.25" data-gap="400">▶ Decrescendo</button></p>
      <h3>Articulations</h3>
      <ul>
        <li><b>Legato</b> (lié, avec une liaison de phrasé) : les notes s’enchaînent sans coupure.</li>
        <li><b>Staccato</b> (point au-dessus ou au-dessous de la note) : note courte et détachée.</li>
        <li><b>Tenuto</b> (petit trait) : on tient la note pleine valeur.</li>
        <li><b>Accent</b> (&gt;) : on appuie sur la note.</li>
      </ul>
      <p><button class="play" data-play="60,62,64,65" data-gap="450" data-dur="900">▶ Legato</button><button class="play" data-play="60,62,64,65" data-gap="450" data-dur="120">▶ Staccato</button></p>
      <h3>Les tempos</h3>
      <div class="theory-table-wrap"><table class="theory-table">
        <thead><tr><th>Terme</th><th>Sens</th><th>BPM approximatif</th></tr></thead>
        <tbody>
          <tr><th>Largo</th><td>très lent, large</td><td>40–60</td></tr>
          <tr><th>Adagio</th><td>lent</td><td>66–76</td></tr>
          <tr><th>Andante</th><td>allant, à pas tranquille</td><td>76–108</td></tr>
          <tr><th>Moderato</th><td>modéré</td><td>108–120</td></tr>
          <tr><th>Allegro</th><td>vif, joyeux</td><td>120–156</td></tr>
          <tr><th>Presto</th><td>très rapide</td><td>168–200</td></tr>
        </tbody></table></div>
      <h3>Variations et caractère</h3>
      <ul>
        <li><b>Ritardando</b> (<i>rit.</i>) : ralentir peu à peu ; <b>accelerando</b> (<i>accel.</i>) : accélérer ; <b>a tempo</b> : revenir au tempo de départ.</li>
        <li><b>Fermate</b> (point d’orgue) : on prolonge la note à volonté.</li>
        <li><b>Dolce</b> (doux), <b>cantabile</b> (chantant), <b>espressivo</b> (expressif) précisent le caractère.</li>
        <li><b>Ped.</b> : pédale de droite enfoncée ; le signe <b>*</b> indique où la relâcher.</li>
      </ul>
      <div class="example"><b>À retenir</b><br>Les nuances vont de <i>pp</i> à <i>ff</i> ; legato = lié, staccato = détaché ; <i>rit.</i> ralentit, <i>a tempo</i> revient à la vitesse initiale.<br><i>À essayer :</i> joue une gamme de Do en <i>crescendo</i> puis en <i>decrescendo</i>, d’abord en legato, puis en staccato.</div>
    </section>

    <section data-summary="Dorien, phrygien, lydien, mixolydien… : sept couleurs avec les mêmes notes.">
      <h2>Les modes</h2>
      <p>Un <b>mode</b> est une gamme qui garde les notes d’une gamme majeure mais commence sur un autre degré. Sur les touches blanches, chaque note de départ donne une couleur différente, alors que les notes sont toujours celles de Do majeur.</p>
      <div class="theory-table-wrap">
        <table class="theory-table">
          <thead><tr><th>Mode</th><th>Départ (touches blanches)</th><th>Motif (T = ton, ½ = demi-ton)</th><th>Couleur</th></tr></thead>
          <tbody>
            <tr><th>Ionien (majeur)</th><td>Do</td><td>T T ½ T T T ½</td><td>lumineux, stable</td></tr>
            <tr><th>Dorien</th><td>Ré</td><td>T ½ T T T ½ T</td><td>mineur avec sixte majeure : doux, un peu « folk »</td></tr>
            <tr><th>Phrygien</th><td>Mi</td><td>½ T T T ½ T T</td><td>seconde mineure : sombre, « espagnol »</td></tr>
            <tr><th>Lydien</th><td>Fa</td><td>T T T ½ T T ½</td><td>quarte augmentée : rêveur, suspendu</td></tr>
            <tr><th>Mixolydien</th><td>Sol</td><td>T T ½ T T ½ T</td><td>majeur avec septième mineure : rock, blues</td></tr>
            <tr><th>Éolien (mineur naturel)</th><td>La</td><td>T ½ T T ½ T T</td><td>mineur classique</td></tr>
            <tr><th>Locrien</th><td>Si</td><td>½ T T ½ T T T</td><td>quinte diminuée : instable, rarement utilisé</td></tr>
          </tbody>
        </table>
      </div>
      <p>Écoute chaque mode (toutes ces gammes n’emploient que les touches blanches) :</p>
      <p><button class="play" data-play="60,62,64,65,67,69,71,72" data-gap="350">▶ Do ionien</button><button class="play" data-play="62,64,65,67,69,71,72,74" data-gap="350">▶ Ré dorien</button><button class="play" data-play="64,65,67,69,71,72,74,76" data-gap="350">▶ Mi phrygien</button><button class="play" data-play="65,67,69,71,72,74,76,77" data-gap="350">▶ Fa lydien</button><button class="play" data-play="67,69,71,72,74,76,77,79" data-gap="350">▶ Sol mixolydien</button><button class="play" data-play="57,59,60,62,64,65,67,69" data-gap="350">▶ La éolien</button><button class="play" data-play="59,60,62,64,65,67,69,71" data-gap="350">▶ Si locrien</button></p>
      <h3>Trouver l’armure d’un mode</h3>
      <p>Un mode partage l’armure de la gamme majeure dont il est un degré. La note de départ indique le degré :</p>
      <ul>
        <li>dorien = <b>IIᵉ</b> degré, phrygien = <b>IIIᵉ</b>, lydien = <b>IVᵉ</b>, mixolydien = <b>Vᵉ</b>, éolien = <b>VIᵉ</b>, locrien = <b>VIIᵉ</b>.</li>
        <li><b>Sol mixolydien</b> : Sol est le Vᵉ degré de Do majeur, donc aucune altération.</li>
        <li><b>La dorien</b> : La est le IIᵉ degré de Sol majeur, donc un dièse (Fa♯).</li>
        <li><b>Mi mixolydien</b> : Mi est le Vᵉ degré de La majeur, donc trois dièses (Fa♯, Do♯, Sol♯).</li>
      </ul>
      <h3>Comparer à partir de la même tonique</h3>
      <p>Pour sentir la différence, joue tous les modes depuis Do. Par rapport à Do majeur :</p>
      <ul>
        <li><b>Do lydien</b> : Fa♯ au lieu de Fa.</li>
        <li><b>Do mixolydien</b> : Si♭ au lieu de Si.</li>
        <li><b>Do dorien</b> : Mi♭ et Si♭ (c’est Do mineur avec un La naturel).</li>
        <li><b>Do phrygien</b> : Ré♭, Mi♭, La♭ et Si♭ (c’est Do mineur avec un Ré♭).</li>
        <li><b>Do locrien</b> : Ré♭, Mi♭, Sol♭, La♭ et Si♭.</li>
      </ul>
      <p><button class="play" data-play="60,62,64,66,67,69,71,72" data-gap="350">▶ Do lydien</button><button class="play" data-play="60,62,64,65,67,69,70,72" data-gap="350">▶ Do mixolydien</button><button class="play" data-play="60,62,63,65,67,69,70,72" data-gap="350">▶ Do dorien</button><button class="play" data-play="60,61,63,65,67,68,70,72" data-gap="350">▶ Do phrygien</button><button class="play" data-play="60,61,63,65,66,68,70,72" data-gap="350">▶ Do locrien</button></p>
      <div class="example"><b>Repères d’écoute</b><br>Le lydien est souvent associé au thème des Simpson, le dorien à « Scarborough Fair », le mixolydien à de nombreux morceaux de rock et de blues. Chaque mode a une note caractéristique : sixte majeure (dorien), seconde mineure (phrygien), quarte augmentée (lydien), septième mineure (mixolydien).</div>
      <div class="example"><b>À retenir</b><br>Un mode = mêmes notes qu’une gamme majeure, autre note de départ. Le mode change le centre musical, donc la couleur.<br><i>À essayer :</i> dans « Mode : exercices », choisis Gammes puis un mode (dorien, mixolydien…) et compare avec la gamme majeure de même tonique.</div>
    </section>

    <section data-summary="Lire une grille, transposer une progression, ii–V–I et blues en 12 mesures.">
      <h2>Progressions et grilles d’accords</h2>
      <p>Les chansons, le jazz ou la pop sont souvent notés par une <b>grille d’accords</b> : une suite de symboles, un ou deux accords par mesure. Ces progressions se pensent en degrés (chiffres romains), ce qui permet de les jouer dans n’importe quelle tonalité.</p>
      <h3>Lire une grille</h3>
      <div class="example"><b>| C | Am | F | G |</b><br>Quatre mesures, un accord par mesure : Do, La mineur, Fa, Sol. Un trait vertical sépare les mesures ; <b>%</b> signifie « répète la mesure précédente ».</div>
      <div class="theory-table-wrap">
        <table class="theory-table">
          <thead><tr><th>Symbole</th><th>Nom</th><th>Notes</th></tr></thead>
          <tbody>
            <tr><th>Cadd9</th><td>Do avec neuvième ajoutée</td><td>Do – Mi – Sol – Ré</td></tr>
            <tr><th>Csus2</th><td>Do seconde suspendue</td><td>Do – Ré – Sol</td></tr>
            <tr><th>C6</th><td>Do sixte</td><td>Do – Mi – Sol – La</td></tr>
            <tr><th>Cm7♭5</th><td>Do demi-diminué</td><td>Do – Mi♭ – Sol♭ – Si♭</td></tr>
            <tr><th>C/E</th><td>Do majeur, Mi à la basse</td><td>Mi (basse) + Do – Mi – Sol</td></tr>
          </tbody>
        </table>
      </div>
      <p>Une barre oblique (<b>C/E</b>) indique la note de basse : c’est un renversement, ou une basse qui descend par degrés conjoints (C – C/B – Am…).</p>
      <h3>Transposer une progression</h3>
      <p>Chaque degré garde sa fonction quelle que soit la tonalité. Voici les accords des degrés I à vi :</p>
      <div class="theory-table-wrap">
        <table class="theory-table">
          <thead><tr><th>Tonalité</th><th>I</th><th>ii</th><th>iii</th><th>IV</th><th>V</th><th>vi</th></tr></thead>
          <tbody>
            <tr><th>Do (C)</th><td>C</td><td>Dm</td><td>Em</td><td>F</td><td>G</td><td>Am</td></tr>
            <tr><th>Sol (G)</th><td>G</td><td>Am</td><td>Bm</td><td>C</td><td>D</td><td>Em</td></tr>
            <tr><th>Ré (D)</th><td>D</td><td>Em</td><td>F♯m</td><td>G</td><td>A</td><td>Bm</td></tr>
            <tr><th>Fa (F)</th><td>F</td><td>Gm</td><td>Am</td><td>B♭</td><td>C</td><td>Dm</td></tr>
            <tr><th>Si♭ (B♭)</th><td>B♭</td><td>Cm</td><td>Dm</td><td>E♭</td><td>F</td><td>Gm</td></tr>
          </tbody>
        </table>
      </div>
      <p>Exemple : I – V – vi – IV donne C – G – Am – F en Do, mais G – D – Em – C en Sol. Écoute les deux :</p>
      <p><button class="play" data-seq="60,64,67|59,62,67|60,64,69|60,65,69" data-gap="1000">▶ I–V–vi–IV en Do</button><button class="play" data-seq="55,59,62|54,57,62|55,59,64|55,60,64" data-gap="1000">▶ I–V–vi–IV en Sol</button></p>
      <p>Pour transposer sans calculer : compte l’écart en demi-tons entre l’ancienne et la nouvelle tonique, puis décale chaque accord du même écart (de Do à Sol : +7 demi-tons, C devient G, F devient C, G devient D).</p>
      <h3>Le ii – V – I</h3>
      <p>L’enchaînement le plus courant du jazz : sous-dominante, dominante, tonique, avec des accords de septième. Les voix bougent très peu (D – D – C, F – F – E, A – G – G, C – B – B).</p>
      <div class="theory-table-wrap">
        <table class="theory-table">
          <thead><tr><th>Tonalité</th><th>ii7</th><th>V7</th><th>Imaj7</th></tr></thead>
          <tbody>
            <tr><th>Do</th><td>Dm7</td><td>G7</td><td>Cmaj7</td></tr>
            <tr><th>Fa</th><td>Gm7</td><td>C7</td><td>Fmaj7</td></tr>
            <tr><th>Sol</th><td>Am7</td><td>D7</td><td>Gmaj7</td></tr>
            <tr><th>Si♭</th><td>Cm7</td><td>F7</td><td>B♭maj7</td></tr>
          </tbody>
        </table>
      </div>
      <p><button class="play" data-seq="62,65,69,72|62,65,67,71|60,64,67,71" data-gap="1100" data-dur="1100">▶ ii–V–I en Do</button></p>
      <h3>Le blues en 12 mesures</h3>
      <p>Une des formes les plus répandues : trois accords (I, IV, V) sur douze mesures, souvent joués en septième de dominante.</p>
      <div class="theory-table-wrap">
        <table class="theory-table">
          <thead><tr><th>Mesures</th><th>1 – 4</th><th>5 – 6</th><th>7 – 8</th><th>9</th><th>10</th><th>11 – 12</th></tr></thead>
          <tbody><tr><th>Degré</th><td>I</td><td>IV</td><td>I</td><td>V</td><td>IV</td><td>I</td></tr>
          <tr><th>En Do</th><td>C7</td><td>F7</td><td>C7</td><td>G7</td><td>F7</td><td>C7</td></tr></tbody>
        </table>
      </div>
      <p><button class="play" data-seq="58,60,64,67|58,60,64,67|58,60,64,67|58,60,64,67|57,60,63,65|57,60,63,65|58,60,64,67|58,60,64,67|59,62,65,67|57,60,63,65|58,60,64,67|58,60,64,67" data-gap="750" data-dur="700">▶ Blues en Do (12 mesures)</button></p>
      <div class="example"><b>À retenir</b><br>Une grille se lit en degrés : I, IV, V, vi, ii–V–I. Pour transposer, garde les degrés et change la tonique. Le blues compte 12 mesures sur I, IV et V.<br><i>À essayer :</i> joue I – V – vi – IV dans trois tonalités, main gauche sur la basse, main droite sur l’accord.</div>
    </section>

    <section data-summary="Conseils de travail et séance type de 15 minutes.">
      <h2>Pour progresser avec le piano</h2>
      <ul>
        <li>Repère les groupes de deux et trois touches noires : ils aident à retrouver les Do et les autres notes.</li>
        <li>Lis d’abord la clé, l’armure et le rythme avant de jouer une mesure.</li>
        <li>Travaille lentement, mains séparées si besoin, puis accélère lorsque les notes sont sûres.</li>
        <li>Utilise le <b>mode correction</b> du Piano Trainer pour voir les prochaines touches, puis désactive-le pour tester ta mémoire.</li>
        <li>Dans <b>Mode : exercices</b>, enchaîne gammes, arpèges, accords, cadences, intervalles et armures dans toutes les tonalités.</li>
        <li>Travaille <b>main droite seule</b>, puis <b>main gauche seule</b>, avant de réunir les deux mains.</li>
        <li>Isole un passage difficile avec la <b>boucle</b> (🔁), et écoute-le avec « ▶ Écouter » avant de le jouer.</li>
        <li>Joue avec le <b>métronome</b> : commence lentement, puis augmente de 5 BPM seulement quand c’est régulier.</li>
        <li>Reste détendu : épaules basses, poignets souples. Une courte séance quotidienne vaut mieux qu’une longue séance par semaine.</li>
      </ul>
      <h3>Une séance de 15 minutes</h3>
      <ol>
        <li><b>3 min</b> : jeu de lecture de notes (une clé à la fois).</li>
        <li><b>4 min</b> : une gamme ou un enchaînement d’accords, lentement.</li>
        <li><b>6 min</b> : un passage de ta partition, mains séparées puis ensemble, en boucle.</li>
        <li><b>2 min</b> : rejoue le morceau en entier, sans t’arrêter.</li>
      </ol>
    </section>
`;

/* banque de questions : [question, [bonne réponse, mauvaise, mauvaise], explication] — 3 tirées au hasard à chaque quiz, réponses mélangées */
const TQUIZ = [
 [["Combien de demi-tons y a-t-il dans une octave ?", ["12", "7", "8"], "Il y a 7 noms de notes, mais 12 demi-tons avec les touches noires."], ["Quelle note se trouve juste à gauche d’un groupe de deux touches noires ?", ["Do", "Fa", "La"], "Do : à gauche du groupe de deux. Fa : à gauche du groupe de trois."], ["Que fait un bémol ?", ["Il baisse la note d’un demi-ton", "Il monte la note d’un demi-ton", "Il annule une altération"], "Le bémol baisse d’un demi-ton ; le dièse monte ; le bécarre annule."], ["Quelle note sert de référence d’accord à 440 Hz ?", ["La4", "Do4", "Sol4"], "Le La4 vaut 440 Hz ; Do4 est le Do central."], ["Combien de touches compte un piano standard ?", ["88", "76", "61"], "Un piano standard va de La0 à Do8 : 88 touches."], ["Entre quelles touches blanches n’y a-t-il pas de touche noire ?", ["Mi et Fa", "Fa et Sol", "Ré et Mi"], "Mi–Fa et Si–Do sont des demi-tons naturels."], ["Do♯ et Ré♭ sont des notes…", ["enharmoniques", "d’octaves différentes", "séparées d’un ton"], "Même touche, deux noms : on parle de notes enharmoniques."], ["Quel signe annule une altération ?", ["Le bécarre", "Le dièse", "Le bémol"], "Le bécarre (♮) rend la note naturelle."]],
 [["La clé de sol s’enroule autour de quelle ligne ?", ["La 2ᵉ ligne", "La 4ᵉ ligne", "La 1ʳᵉ ligne"], "Elle désigne le Sol sur la 2ᵉ ligne."], ["Où s’écrit le Do central ?", ["Sur une ligne supplémentaire entre les deux portées", "Sur la 1ʳᵉ ligne de la clé de sol", "Sur la 3ᵉ ligne de la clé de fa"], "Il est entre les deux portées, sur une petite ligne supplémentaire."], ["Combien de dièses en Ré majeur ?", ["2", "1", "3"], "Fa♯ et Do♯."], ["Que désigne la clé de fa ?", ["Le Fa sur la 4ᵉ ligne", "Le Fa sur la 2ᵉ ligne", "Le Sol sur la 4ᵉ ligne"], "Ses deux points encadrent la 4ᵉ ligne : c’est un Fa."], ["Dans quel ordre apparaissent les dièses à l’armure ?", ["Fa – Do – Sol – Ré – La – Mi – Si", "Si – Mi – La – Ré – Sol – Do – Fa", "Do – Ré – Mi – Fa – Sol – La – Si"], "L’ordre des bémols est l’inverse : Si – Mi – La – Ré – Sol – Do – Fa."], ["Un accidentel écrit devant une note vaut jusqu’à…", ["la barre de mesure", "la fin du morceau", "la note suivante seulement"], "Il ne vaut que pour cette hauteur exacte, jusqu’à la barre de mesure."], ["Une armure avec un seul bémol (Si♭) correspond à…", ["Fa majeur", "Sol majeur", "Do majeur"], "Avec un seul bémol, c’est Fa majeur."], ["Quelles sont les notes des interlignes en clé de sol, de bas en haut ?", ["Fa – La – Do – Mi", "Mi – Sol – Si – Ré", "Sol – Si – Ré – Fa"], "Les lignes donnent Mi – Sol – Si – Ré – Fa ; les interlignes Fa – La – Do – Mi."]],
 [["Combien de temps dure une blanche pointée ?", ["3 temps", "2 temps", "4 temps"], "2 + la moitié de 2 = 3 temps."], ["Que signifie 3/4 ?", ["Trois noires par mesure", "Quatre noires par mesure", "Six croches en deux groupes"], "Trois noires par mesure, comme dans une valse."], ["Combien de temps dure une ronde en 4/4 ?", ["4 temps", "2 temps", "3 temps"], "La ronde occupe toute la mesure en 4/4."], ["Combien de croches dans une noire ?", ["2", "4", "3"], "Deux croches durent autant qu’une noire."], ["Que fait une liaison entre deux notes de même hauteur ?", ["Elle prolonge la première sans la rejouer", "Elle raccourcit la seconde", "Elle les joue plus fort"], "On joue la première note et on la tient pour la durée des deux."], ["Comment groupe-t-on les six croches d’une mesure à 6/8 ?", ["Deux temps de trois", "Trois temps de deux", "Six temps égaux"], "« 1-2-3, 4-5-6 » : deux temps de trois croches."], ["Un point après une note ajoute…", ["la moitié de sa durée", "le double de sa durée", "un temps entier"], "Une noire pointée vaut 1 + ½ = 1,5 temps."], ["Quel tempo est le plus rapide ?", ["Allegro", "Andante", "Adagio"], "Allegro ≈ 120–156 BPM ; Andante ≈ 76–108."]],
 [["Combien de demi-tons dans une quinte juste ?", ["7", "5", "6"], "De Do à Sol : 7 demi-tons."], ["Quel motif donne la gamme majeure ?", ["T T ½ T T T ½", "T ½ T T ½ T T", "T T T ½ T T ½"], "T – T – ½T – T – T – T – ½T."], ["Do majeur et La mineur ont…", ["la même armure", "la même tonique", "des armures opposées"], "Ce sont des tonalités relatives : mêmes notes, centre différent."], ["Do – Mi est…", ["une tierce majeure", "une tierce mineure", "une quarte juste"], "Do, Ré, Mi : une tierce, de 4 demi-tons, donc majeure."], ["Quelle est la tonique de La mineur ?", ["La", "Do", "Mi"], "La mineur est centrée sur La."], ["Combien de demi-tons dans un triton ?", ["6", "5", "7"], "Le triton (quarte augmentée) fait 6 demi-tons."], ["Quelle tonalité suit Do dans le cycle des quintes (sens horaire) ?", ["Sol", "Fa", "Ré"], "Une quinte au-dessus de Do : Sol (1 dièse)."], ["Où sont les demi-tons dans la gamme majeure ?", ["Entre les degrés 3–4 et 7–8", "Entre les degrés 1–2 et 5–6", "Entre les degrés 2–3 et 6–7"], "Mi–Fa et Si–Do en Do majeur."], ["Quelle tonalité majeure a un seul bémol ?", ["Fa majeur", "Sol majeur", "Ré majeur"], "Fa majeur a Si♭."]],
 [["Quelles sont les notes de Do mineur ?", ["Do – Mi♭ – Sol", "Do – Mi – Sol", "Do – Mi♭ – Sol♭"], "On abaisse la tierce d’un demi-ton."], ["La cadence V – I s’appelle…", ["parfaite", "plagale", "rompue"], "Sol – Do en Do majeur : la cadence parfaite."], ["Que change un renversement ?", ["La note à la basse", "Les notes de l’accord", "La tonalité"], "Les mêmes notes, mais une autre note à la basse."], ["Quelle formule (en demi-tons) donne une triade majeure ?", ["0 – 4 – 7", "0 – 3 – 7", "0 – 3 – 6"], "Tierce majeure (4) puis quinte juste (7)."], ["Quelles notes forment Sol7 ?", ["Sol – Si – Ré – Fa", "Sol – Si – Ré – Fa♯", "Sol – Si♭ – Ré – Fa"], "Triade de Sol majeur plus la septième mineure Fa."], ["Quel accord se construit sur le IIᵉ degré de Do majeur ?", ["Ré mineur", "Ré majeur", "Mi mineur"], "Ré – Fa – La : Ré mineur."], ["Quel est le premier renversement de Do majeur ?", ["Mi – Sol – Do", "Sol – Do – Mi", "Do – Mi – Sol"], "La fondamentale passe à l’octave : Mi est à la basse."], ["La cadence IV – I s’appelle…", ["plagale", "parfaite", "rompue"], "Fa – Do : la cadence plagale, le « Amen »."], ["Que signifie le symbole « Cm » ?", ["Do mineur", "Do majeur", "Do diminué"], "Le m indique la tierce mineure."]],
 [["Que signifie « ff » ?", ["Fortissimo : très fort", "Forte : fort", "Fermate"], "ff = fortissimo."], ["Comment joue-t-on un staccato ?", ["Court et détaché", "Lié", "De plus en plus fort"], "Le staccato est noté par un point : note courte."], ["Quel terme demande de ralentir peu à peu ?", ["Ritardando", "Accelerando", "A tempo"], "Ritardando (rit.) ; a tempo ramène la vitesse initiale."], ["Que signifie « pp » ?", ["Pianissimo : très doucement", "Piano : doucement", "Mezzo-piano : assez doucement"], "pp = pianissimo."], ["Quel terme signifie « revenir au tempo initial » ?", ["A tempo", "Ritardando", "Accelerando"], "A tempo annule un ralentissement ou une accélération."], ["Que demande un point d’orgue (fermate) ?", ["Prolonger la note à volonté", "Jouer plus fort", "Répéter la mesure"], "La note est tenue plus longtemps que sa valeur écrite."], ["Que fait un crescendo ?", ["Il augmente progressivement l’intensité", "Il diminue l’intensité", "Il ralentit le tempo"], "Un soufflet qui s’ouvre : de plus en plus fort."], ["Quel terme signifie « chantant » ?", ["Cantabile", "Dolce", "Tenuto"], "Cantabile ; dolce veut dire doux."]],
 [["Quel mode est une gamme majeure avec la septième abaissée ?", ["Mixolydien", "Lydien", "Dorien"], "Le mixolydien : majeur avec septième mineure."], ["Quelle note caractérise le mode lydien ?", ["La quarte augmentée", "La septième mineure", "La seconde mineure"], "Le lydien est un majeur avec Fa♯ (en Do)."], ["Sur les touches blanches, quel mode commence sur Ré ?", ["Dorien", "Phrygien", "Mixolydien"], "Ré dorien : IIᵉ degré de Do majeur."], ["Quel mode correspond au mineur naturel ?", ["Éolien", "Dorien", "Locrien"], "Le mode éolien, VIᵉ degré de la majeure."], ["Ré dorien utilise les mêmes notes que…", ["Do majeur", "Ré majeur", "Fa majeur"], "Ré est le IIᵉ degré de Do majeur."], ["Do mixolydien contient…", ["Si♭ à la place de Si", "Fa♯ à la place de Fa", "Mi♭ à la place de Mi"], "Mixolydien = majeur avec septième mineure."], ["Quelle sonorité est associée au phrygien ?", ["Une seconde mineure sombre", "Une quarte augmentée rêveuse", "Une sixte majeure douce"], "Le phrygien commence par un demi-ton."], ["Quel mode commence sur Si aux touches blanches ?", ["Locrien", "Lydien", "Éolien"], "Si locrien : VIIᵉ degré de Do majeur."]],
 [["Quels sont les accords I – IV – V en Sol majeur ?", ["G – C – D", "G – D – C", "G – F – D"], "IV de Sol = Do, V de Sol = Ré."], ["Que signifie « C/E » ?", ["Do majeur avec Mi à la basse", "Do majeur avec Mi à l’aigu", "Do mineur"], "Après la barre : la note de basse."], ["Comment s’écrit ii – V – I en Do avec septièmes ?", ["Dm7 – G7 – Cmaj7", "Dm – G – C", "Em7 – A7 – Dmaj7"], "Ré mineur 7, Sol 7, Do majeur 7."], ["Combien de mesures compte un blues standard ?", ["12", "8", "16"], "Le blues en 12 mesures utilise I, IV et V."], ["Dans un blues en Do, quel accord occupe les mesures 5 et 6 ?", ["F7", "G7", "C7"], "C’est le IV : Fa 7."], ["Que donne I – V – vi – IV en Ré majeur ?", ["D – A – Bm – G", "D – G – Bm – A", "D – A – Em – G"], "V = La, vi = Si mineur, IV = Sol."], ["Comment appelle-t-on le déplacement d’une progression vers une autre tonalité ?", ["Transposer", "Renverser", "Syncoper"], "On garde les degrés, on change la tonique."], ["Quel accord est le IV de Si♭ majeur ?", ["Mi♭", "Fa", "Sol mineur"], "Si♭ – Do – Ré – Mi♭ : le IV est Mi♭."]]
];
const QN = 3;
