/* ===================== DADOS DO JOGO ===================== */
const synapseOrder = ['Neurônio pré-sináptico', 'Vesícula', 'Neurotransmissor', 'Fenda sináptica', 'Receptor', 'Neurônio pós-sináptico'];

const phase2Questions = [
  { clue:'Neurotransmissor ligado à motivação, recompensa e ao movimento — sua falta está associada ao Parkinson.',
    options:['Dopamina','Serotonina','GABA','Glutamato'], answer:'Dopamina',
    explain:'A dopamina age na via mesolímbica (recompensa) e na substância negra (movimento).' },
  { clue:'Principal neurotransmissor inibitório do cérebro — reduz a excitabilidade neuronal.',
    options:['Glutamato','GABA','Acetilcolina','Noradrenalina'], answer:'GABA',
    explain:'O GABA é o alvo de ansiolíticos como os benzodiazepínicos.' },
  { clue:'Regula humor, sono e apetite — é o alvo principal dos antidepressivos ISRS.',
    options:['Serotonina','Dopamina','Glutamato','GABA'], answer:'Serotonina',
    explain:'A serotonina é produzida principalmente nos núcleos da rafe, no tronco encefálico.' },
];

const phase3Questions = [
  { clue:'Formação e consolidação de memórias de longo prazo.',
    options:['Hipocampo','Lobo Occipital','Cerebelo','Amígdala'], answer:'Hipocampo',
    explain:'O hipocampo grava novas memórias e as transfere para o córtex, principalmente durante o sono.' },
  { clue:'Coordenação motora fina e equilíbrio.',
    options:['Cerebelo','Lobo Frontal','Amígdala','Lobo Parietal'], answer:'Cerebelo',
    explain:'O cerebelo ajusta a precisão dos movimentos voluntários, mesmo sem iniciá-los.' },
  { clue:'Processamento visual — transforma sinais dos olhos em imagens conscientes.',
    options:['Lobo Occipital','Lobo Temporal','Tronco Encefálico','Hipocampo'], answer:'Lobo Occipital',
    explain:'O córtex visual primário fica concentrado no lobo occipital, na parte de trás do cérebro.' },
];

const phase4Questions = [
  { clue:'Qual dupla está mais associada à formação de memórias?',
    options:['Hipocampo + Glutamato','Cerebelo + GABA','Amígdala + Noradrenalina','Lobo Occipital + Acetilcolina'],
    answer:'Hipocampo + Glutamato', explain:'O hipocampo usa glutamato e a potenciação de longo prazo (LTP) para gravar memórias.' },
  { clue:'Qual é a primeira etapa de uma sinapse química?',
    options:['Liberação do neurotransmissor pela vesícula','Ligação ao receptor pós-sináptico','Recaptação do neurotransmissor','Abertura de canais pós-sinápticos'],
    answer:'Liberação do neurotransmissor pela vesícula', explain:'A vesícula libera o neurotransmissor na fenda antes de qualquer ligação a receptores.' },
  { clue:'Qual estrutura e neurotransmissor estão ligados à resposta de "luta ou fuga"?',
    options:['Amígdala + Noradrenalina','Hipocampo + Serotonina','Cerebelo + GABA','Lobo Parietal + Dopamina'],
    answer:'Amígdala + Noradrenalina', explain:'A amígdala aciona o alerta e a noradrenalina prepara o corpo para reagir rapidamente.' },
];

/* ===================== ESTADO E DOM ===================== */
const gameArena = document.getElementById('gameArena');
const gameProgressFill = document.getElementById('gameProgressFill');
const gamePhaseLabel = document.getElementById('gamePhaseLabel');
const gameScoreLabel = document.getElementById('gameScoreLabel');

let state = { phase: 1, score: 0, subIndex: 0 };

function updateMeta(){
  gamePhaseLabel.textContent = state.phase <= 4 ? `Fase ${state.phase} de 4` : 'Concluído';
  gameScoreLabel.textContent = `Pontuação: ${state.score}`;
  const pct = state.phase <= 4 ? (state.phase - 1) * 25 : 100;
  gameProgressFill.style.width = pct + '%';
}

/* ===================== FASE 1: MONTE A SINAPSE ===================== */
function renderPhase1(){
  gameArena.innerHTML = `
    <h3>Fase 1 · Monte a sinapse</h3>
    <p class="game-instructions">Clique nos elementos abaixo na ordem correta — do neurônio que envia o sinal até o que o recebe.</p>
    <div class="order-slots" id="orderSlots"></div>
    <div class="chip-row" id="chipRow"></div>
    <div class="game-feedback" id="phaseFeedback"></div>
  `;
  const slotsEl = document.getElementById('orderSlots');
  synapseOrder.forEach(() => {
    const s = document.createElement('div'); s.className = 'order-slot'; s.textContent = '?';
    slotsEl.appendChild(s);
  });
  const chipRow = document.getElementById('chipRow');
  const shuffled = [...synapseOrder].sort(() => Math.random() - 0.5);
  let nextIndex = 0;
  shuffled.forEach(label => {
    const chip = document.createElement('button');
    chip.className = 'chip'; chip.textContent = label;
    chip.addEventListener('click', () => {
      if (chip.classList.contains('picked')) return;
      const fb = document.getElementById('phaseFeedback');
      if (label === synapseOrder[nextIndex]) {
        chip.classList.add('picked');
        const slot = slotsEl.children[nextIndex];
        slot.textContent = label; slot.classList.add('filled');
        state.score += 20; nextIndex++;
        fb.textContent = 'Conexão correta!'; fb.className = 'game-feedback show ok';
        updateMeta();
        if (nextIndex === synapseOrder.length) {
          fb.textContent = 'Sinapse completa! Avançando…';
          setTimeout(() => nextPhase(), 900);
        }
      } else {
        fb.textContent = 'Quase! Tente novamente.'; fb.className = 'game-feedback show no';
        chip.classList.add('wrong');
        setTimeout(() => chip.classList.remove('wrong'), 400);
      }
    });
    chipRow.appendChild(chip);
  });
}

/* ===================== FASES 2, 3 E 4: QUIZ GENÉRICO ===================== */
function renderQuiz(pool, title, instructions){
  const q = pool[state.subIndex];
  gameArena.innerHTML = `
    <h3>${title}</h3>
    <p class="game-instructions">${instructions}</p>
    <div class="game-scenario">${q.clue}</div>
    <div class="game-btn-row" id="quizOptions"></div>
    <div class="game-feedback" id="phaseFeedback"></div>
  `;
  const optWrap = document.getElementById('quizOptions');
  q.options.forEach(opt => {
    const b = document.createElement('button');
    b.className = 'chip'; b.textContent = opt;
    b.addEventListener('click', () => {
      [...optWrap.children].forEach(c => c.disabled = true);
      const fb = document.getElementById('phaseFeedback');
      if (opt === q.answer) {
        b.classList.add('correct'); state.score += 100;
        fb.textContent = '✅ ' + q.explain; fb.className = 'game-feedback show ok';
      } else {
        b.classList.add('wrong');
        [...optWrap.children].find(c => c.textContent === q.answer).classList.add('correct');
        fb.textContent = '❌ ' + q.explain; fb.className = 'game-feedback show no';
      }
      updateMeta();
      const nextBtn = document.createElement('button');
      nextBtn.className = 'btn-primary'; nextBtn.style.marginTop = '18px';
      nextBtn.textContent = (state.subIndex < pool.length - 1) ? 'Próxima pergunta →' : 'Continuar →';
      nextBtn.addEventListener('click', () => {
        state.subIndex++;
        if (state.subIndex >= pool.length) nextPhase(); else renderCurrentPhase();
      });
      gameArena.appendChild(nextBtn);
    });
    optWrap.appendChild(b);
  });
}

/* ===================== CONTROLADOR ===================== */
function renderCurrentPhase(){
  if (state.phase === 1) renderPhase1();
  else if (state.phase === 2) renderQuiz(phase2Questions, 'Fase 2 · Quem é esse neurotransmissor?', 'Leia a pista e escolha o neurotransmissor correto.');
  else if (state.phase === 3) renderQuiz(phase3Questions, 'Fase 3 · Conecte o cérebro', 'Associe a função à região cerebral responsável.');
  else if (state.phase === 4) renderQuiz(phase4Questions, 'Fase 4 · Desafio final', 'Misture tudo o que você aprendeu nas fases anteriores.');
  else renderFinal();
}
function nextPhase(){ state.phase++; state.subIndex = 0; updateMeta(); renderCurrentPhase(); }

function renderFinal(){
  gameProgressFill.style.width = '100%';
  gameArena.innerHTML = `
    <div class="game-final">
      <span class="kicker">Desafio concluído</span>
      <h3>Muito bem! 🧠</h3>
      <div class="score-big">${state.score}</div>
      <p class="game-instructions">pontos — você passou pelas quatro fases do Desafio Neural.</p>
      <button class="btn-primary" id="restartGame">Jogar novamente</button>
    </div>`;
  document.getElementById('restartGame').addEventListener('click', resetGame);
}
function resetGame(){ state = { phase: 1, score: 0, subIndex: 0 }; updateMeta(); renderCurrentPhase(); }

updateMeta();
renderCurrentPhase();
