/* ===================== DADOS MOLECULARES ===================== */
const ATOM = { c:'#b794f6', o:'#f6f4fb', n:'#c66bff', bond:'#4a3576', text:'#f1edf9' };

function hexPts(cx, cy, r){
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const a = Math.PI / 180 * (60 * i - 90);
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  return pts;
}
function ringPath(pts){ return 'M ' + pts.map(p => p.join(' ')).join(' L ') + ' Z'; }

/* anel catecol (benzeno com 2 hidroxilas) usado em dopamina e noradrenalina */
function catecholRing(cx, cy, r){
  const p = hexPts(cx, cy, r);
  return `
    <path d="${ringPath(p)}" fill="none" stroke="${ATOM.bond}" stroke-width="2"/>
    <circle cx="${cx}" cy="${cy}" r="${r * 0.6}" fill="none" stroke="${ATOM.bond}" stroke-width="1" stroke-dasharray="3 3" opacity="0.6"/>
    <line x1="${p[4][0]}" y1="${p[4][1]}" x2="${p[4][0]-22}" y2="${p[4][1]-4}" stroke="${ATOM.bond}" stroke-width="2"/>
    <text x="${p[4][0]-46}" y="${p[4][1]}" fill="${ATOM.o}" font-size="12" font-family="JetBrains Mono">HO</text>
    <line x1="${p[3][0]}" y1="${p[3][1]}" x2="${p[3][0]-22}" y2="${p[3][1]+8}" stroke="${ATOM.bond}" stroke-width="2"/>
    <text x="${p[3][0]-46}" y="${p[3][1]+12}" fill="${ATOM.o}" font-size="12" font-family="JetBrains Mono">HO</text>
  `;
}

const MOLS = {
  dopamina: {
    name:'Dopamina', formula:'C₈H₁₁NO₂', elementos:'Carbono, Hidrogênio, Nitrogênio, Oxigênio',
    tipo:'Catecolamina — atua como neurotransmissor excitatório/modulador',
    funcao:'Motivação, sensação de recompensa e controle do movimento voluntário.',
    local:'Via mesolímbica e substância negra.',
    curiosidade:'A perda de neurônios dopaminérgicos na substância negra causa os sintomas motores da doença de Parkinson.',
    svg:(cx=70,cy=75,r=26)=>`<svg viewBox="0 0 230 150">
      ${catecholRing(cx,cy,r)}
      <line x1="${cx+r*0.87}" y1="${cy-r*0.5}" x2="120" y2="55" stroke="${ATOM.bond}" stroke-width="2"/>
      <line x1="120" y1="55" x2="150" y2="72" stroke="${ATOM.bond}" stroke-width="2"/>
      <line x1="150" y1="72" x2="180" y2="55" stroke="${ATOM.bond}" stroke-width="2"/>
      <text x="188" y="59" fill="${ATOM.n}" font-size="13" font-family="JetBrains Mono">NH₂</text>
    </svg>`
  },
  noradrenalina: {
    name:'Noradrenalina', formula:'C₈H₁₁NO₃', elementos:'Carbono, Hidrogênio, Nitrogênio, Oxigênio',
    tipo:'Catecolamina — neurotransmissor e hormônio do estresse',
    funcao:'Comanda o estado de alerta e a resposta de "luta ou fuga" diante de ameaças.',
    local:'Locus coeruleus e sistema nervoso simpático.',
    curiosidade:'É quimicamente quase idêntica à dopamina — a diferença é uma única hidroxila extra na cadeia.',
    svg:(cx=70,cy=75,r=26)=>`<svg viewBox="0 0 230 150">
      ${catecholRing(cx,cy,r)}
      <line x1="${cx+r*0.87}" y1="${cy-r*0.5}" x2="120" y2="55" stroke="${ATOM.bond}" stroke-width="2"/>
      <line x1="120" y1="55" x2="120" y2="35" stroke="${ATOM.bond}" stroke-width="2"/>
      <text x="112" y="27" fill="${ATOM.o}" font-size="12" font-family="JetBrains Mono">OH</text>
      <line x1="120" y1="55" x2="155" y2="70" stroke="${ATOM.bond}" stroke-width="2"/>
      <text x="163" y="74" fill="${ATOM.n}" font-size="13" font-family="JetBrains Mono">NH₂</text>
    </svg>`
  },
  serotonina: {
    name:'Serotonina', formula:'C₁₀H₁₂N₂O', elementos:'Carbono, Hidrogênio, Nitrogênio, Oxigênio',
    tipo:'Indolamina — neurotransmissor modulador',
    funcao:'Regula humor, sono, apetite e é alvo dos antidepressivos ISRS.',
    local:'Núcleos da rafe, no tronco encefálico.',
    curiosidade:'Cerca de 90% da serotonina do corpo está no intestino, não no cérebro.',
    svg:()=>`<svg viewBox="0 0 230 150">
      <path d="${ringPath(hexPts(58,80,24))}" fill="none" stroke="${ATOM.bond}" stroke-width="2"/>
      <circle cx="58" cy="80" r="14" fill="none" stroke="${ATOM.bond}" stroke-width="1" stroke-dasharray="3 3" opacity="0.6"/>
      <path d="M 82 68 L 106 60 L 118 80 L 100 96 L 82 92 Z" fill="none" stroke="${ATOM.bond}" stroke-width="2"/>
      <text x="34" y="46" fill="${ATOM.o}" font-size="12" font-family="JetBrains Mono">HO</text>
      <line x1="45" y1="58" x2="58" y2="56" stroke="${ATOM.bond}" stroke-width="2"/>
      <text x="94" y="112" fill="${ATOM.n}" font-size="11" font-family="JetBrains Mono">NH</text>
      <line x1="118" y1="80" x2="150" y2="70" stroke="${ATOM.bond}" stroke-width="2"/>
      <line x1="150" y1="70" x2="178" y2="86" stroke="${ATOM.bond}" stroke-width="2"/>
      <text x="184" y="90" fill="${ATOM.n}" font-size="13" font-family="JetBrains Mono">NH₂</text>
    </svg>`
  },
  gaba: {
    name:'GABA', formula:'C₄H₉NO₂', elementos:'Carbono, Hidrogênio, Nitrogênio, Oxigênio',
    tipo:'Aminoácido — principal neurotransmissor inibitório',
    funcao:'Reduz a excitabilidade neuronal, funcionando como o "freio" do cérebro.',
    local:'Amplamente distribuído; presente em até 40% das sinapses do SNC.',
    curiosidade:'Benzodiazepínicos como o diazepam funcionam intensificando o efeito do GABA nos seus receptores.',
    svg:()=>`<svg viewBox="0 0 230 150">
      <text x="14" y="66" fill="${ATOM.n}" font-size="13" font-family="JetBrains Mono">H₂N</text>
      <line x1="48" y1="60" x2="76" y2="80" stroke="${ATOM.bond}" stroke-width="2"/>
      <line x1="76" y1="80" x2="104" y2="60" stroke="${ATOM.bond}" stroke-width="2"/>
      <line x1="104" y1="60" x2="132" y2="80" stroke="${ATOM.bond}" stroke-width="2"/>
      <line x1="132" y1="80" x2="160" y2="60" stroke="${ATOM.bond}" stroke-width="2"/>
      <text x="166" y="58" fill="${ATOM.o}" font-size="13" font-family="JetBrains Mono">COOH</text>
    </svg>`
  },
  glutamato: {
    name:'Glutamato', formula:'C₅H₉NO₄', elementos:'Carbono, Hidrogênio, Nitrogênio, Oxigênio',
    tipo:'Aminoácido — principal neurotransmissor excitatório',
    funcao:'Essencial para aprendizado, memória e potenciação de longo prazo (LTP).',
    local:'A maioria das sinapses excitatórias do cérebro.',
    curiosidade:'Também é o "glutamato" usado como realçador de sabor em alimentos (glutamato monossódico).',
    svg:()=>`<svg viewBox="0 0 230 150">
      <text x="8" y="66" fill="${ATOM.o}" font-size="12" font-family="JetBrains Mono">HOOC</text>
      <line x1="54" y1="60" x2="82" y2="80" stroke="${ATOM.bond}" stroke-width="2"/>
      <line x1="82" y1="80" x2="82" y2="50" stroke="${ATOM.bond}" stroke-width="2"/>
      <text x="72" y="42" fill="${ATOM.n}" font-size="12" font-family="JetBrains Mono">NH₂</text>
      <line x1="82" y1="80" x2="110" y2="60" stroke="${ATOM.bond}" stroke-width="2"/>
      <line x1="110" y1="60" x2="138" y2="80" stroke="${ATOM.bond}" stroke-width="2"/>
      <line x1="138" y1="80" x2="166" y2="60" stroke="${ATOM.bond}" stroke-width="2"/>
      <text x="172" y="58" fill="${ATOM.o}" font-size="12" font-family="JetBrains Mono">COOH</text>
    </svg>`
  },
  acetilcolina: {
    name:'Acetilcolina', formula:'C₇H₁₆NO₂⁺', elementos:'Carbono, Hidrogênio, Nitrogênio, Oxigênio',
    tipo:'Éster — neurotransmissor excitatório',
    funcao:'Envolvida em memória, atenção e contração muscular.',
    local:'Junções neuromusculares e núcleo basal de Meynert.',
    curiosidade:'Foi o primeiro neurotransmissor descoberto, em 1921, pelo farmacologista Otto Loewi.',
    svg:()=>`<svg viewBox="0 0 230 150">
      <text x="6" y="66" fill="${ATOM.c}" font-size="12" font-family="JetBrains Mono">H₃C</text>
      <line x1="40" y1="60" x2="66" y2="78" stroke="${ATOM.bond}" stroke-width="2"/>
      <line x1="66" y1="78" x2="66" y2="50" stroke="${ATOM.bond}" stroke-width="2"/>
      <line x1="69" y1="78" x2="69" y2="50" stroke="${ATOM.bond}" stroke-width="2"/>
      <text x="60" y="42" fill="${ATOM.o}" font-size="12" font-family="JetBrains Mono">O</text>
      <line x1="66" y1="78" x2="94" y2="60" stroke="${ATOM.bond}" stroke-width="2"/>
      <text x="90" y="52" fill="${ATOM.o}" font-size="12" font-family="JetBrains Mono">O</text>
      <line x1="100" y1="64" x2="126" y2="82" stroke="${ATOM.bond}" stroke-width="2"/>
      <line x1="126" y1="82" x2="154" y2="64" stroke="${ATOM.bond}" stroke-width="2"/>
      <line x1="154" y1="64" x2="180" y2="82" stroke="${ATOM.bond}" stroke-width="2"/>
      <line x1="180" y1="82" x2="200" y2="64" stroke="${ATOM.bond}" stroke-width="1.5"/>
      <line x1="180" y1="82" x2="200" y2="82" stroke="${ATOM.bond}" stroke-width="1.5"/>
      <line x1="180" y1="82" x2="192" y2="102" stroke="${ATOM.bond}" stroke-width="1.5"/>
      <text x="178" y="76" fill="${ATOM.n}" font-size="12" font-family="JetBrains Mono">N⁺</text>
    </svg>`
  }
};

/* ===================== RENDER ===================== */
const moleculeStage = document.getElementById('moleculeStage');
const panelA = document.getElementById('moleculePanelA');
const panelB = document.getElementById('moleculePanelB');
const compareToggle = document.getElementById('compareToggle');
const moleculeButtons = document.querySelectorAll('.molecule-btn');

let selA = 'dopamina';
let selB = null;
let compareMode = false;

function panelHTML(key){
  const m = MOLS[key];
  return `
    <div class="molecule-visual">${m.svg()}</div>
    <div class="molecule-info">
      <h3>${m.name}</h3>
      <span class="mol-formula">${m.formula}</span>
      <dl class="mol-facts">
        <div><dt>Tipo</dt><dd>${m.tipo}</dd></div>
        <div><dt>Função</dt><dd>${m.funcao}</dd></div>
        <div><dt>Onde atua</dt><dd>${m.local}</dd></div>
        <div><dt>Elementos</dt><dd>${m.elementos}</dd></div>
      </dl>
      <div class="mol-fun">${m.curiosidade}</div>
    </div>`;
}

function render(){
  panelA.innerHTML = panelHTML(selA);
  moleculeStage.classList.toggle('compare', compareMode && !!selB);
  if (compareMode && selB) {
    panelB.hidden = false;
    panelB.innerHTML = panelHTML(selB);
  } else {
    panelB.hidden = true;
  }
  moleculeButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.key === selA || btn.dataset.key === selB);
  });
}

moleculeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const key = btn.dataset.key;
    if (!compareMode) {
      selA = key; selB = null;
    } else if (key === selA) {
      /* mantém como base */
    } else if (key === selB) {
      selB = null;
    } else {
      selB = key;
    }
    render();
  });
});

compareToggle.addEventListener('change', () => {
  compareMode = compareToggle.checked;
  if (!compareMode) selB = null;
  render();
});

render();
