/* ===================== HELPERS DE MODAL ===================== */
function openModal(id){ document.getElementById(id).classList.add('open'); }
function closeModal(id){ document.getElementById(id).classList.remove('open'); }
document.querySelectorAll('.modal-overlay').forEach(ov => {
  ov.addEventListener('click', (e) => { if (e.target === ov) ov.classList.remove('open'); });
});

/* ===================== NAV / SISTEMA DE ABAS ===================== */
const navEl = document.getElementById('siteNav');
window.addEventListener('scroll', () => navEl.classList.toggle('scrolled', window.scrollY > 20));
const hamburger = document.getElementById('hamburger');
const tabsEl = document.getElementById('tabs');
hamburger.addEventListener('click', () => tabsEl.classList.toggle('open'));

const tabLinks = document.querySelectorAll('.tab-link');
const pages = document.querySelectorAll('.page');
function showPage(id){
  pages.forEach(p => p.classList.toggle('active', p.id === id));
  tabLinks.forEach(l => l.classList.toggle('active', l.dataset.target === id));
  window.scrollTo({ top: 0, behavior: 'instant' });
  tabsEl.classList.remove('open');
  if (id === 'cerebro3d' && typeof resizeBrain === 'function') {
    // a aba estava com display:none, então o canvas precisa recalcular o tamanho agora que ficou visível
    requestAnimationFrame(resizeBrain);
    setTimeout(resizeBrain, 150);
  }
}
tabLinks.forEach(btn => btn.addEventListener('click', () => showPage(btn.dataset.target)));
document.querySelectorAll('[data-scroll]').forEach(btn => btn.addEventListener('click', () => showPage(btn.dataset.scroll)));

/* Reveal removido: com o sistema de abas (display:none/flex), o IntersectionObserver
   podia deixar elementos invisíveis ao trocar de página. Elementos aparecem direto. */

/* ===================== LOGIN MODAL ===================== */
document.getElementById('openLogin').addEventListener('click', () => openModal('loginOverlay'));
document.getElementById('heroLoginBtn').addEventListener('click', () => openModal('loginOverlay'));
document.getElementById('closeLogin').addEventListener('click', () => closeModal('loginOverlay'));
document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  document.getElementById('loginMsg').classList.add('show');
});
document.getElementById('forgotPassBtn').addEventListener('click', () => {
  document.getElementById('loginMsg').textContent = 'Fluxo de recuperação de senha simulado — conecte ao seu backend.';
  document.getElementById('loginMsg').classList.add('show');
});
let isSignupMode = false;
document.getElementById('toggleSignup').addEventListener('click', () => {
  isSignupMode = !isSignupMode;
  document.getElementById('loginTitle').innerHTML = isSignupMode ? 'Seja <em>Bem-vindo</em>' : 'Bem-vindo <em>de volta</em>';
  document.getElementById('confirmPassField').hidden = !isSignupMode;
  document.getElementById('loginSubmitBtn').textContent = isSignupMode ? 'Cadastrar' : 'Entrar';
  document.getElementById('forgotPassBtn').hidden = isSignupMode;
  document.getElementById('toggleSignup').innerHTML = isSignupMode
    ? 'Já tem conta? <span>Entrar</span>'
    : 'Ainda não tem conta? <span>Cadastre-se</span>';
  document.getElementById('loginMsg').classList.remove('show');
});

/* ===================== DIAGRAMA DE SINAPSE INTERATIVO ===================== */
const synapseInfo = {
  vesicula: ['Vesícula', 'Armazena neurotransmissores prontos para serem liberados assim que um potencial de ação chega ao terminal do axônio.'],
  fenda: ['Fenda sináptica', 'Espaço microscópico entre dois neurônios onde o neurotransmissor é liberado e atravessa até o neurônio seguinte.'],
  receptor: ['Receptor', 'Proteína na membrana do neurônio seguinte que reconhece um neurotransmissor específico e muda seu comportamento elétrico.']
};
const synapsePopover = document.getElementById('synapsePopover');
document.querySelectorAll('#synapseDiagram [data-key]').forEach(el => {
  el.addEventListener('click', () => {
    const [title, text] = synapseInfo[el.dataset.key];
    document.getElementById('synapseModalTitle').textContent = title;
    document.getElementById('synapseModalText').textContent = text;
    synapsePopover.classList.add('open');
  });
});
document.getElementById('closeSynapsePopover').addEventListener('click', () => synapsePopover.classList.remove('open'));

/* ===================== CEREBRO 3D — MODELO ANATÔMICO REAL ===================== */
/* Modelo: "Brain Atlas" por itayinbarr — 344 estruturas nomeadas, MIT (código) + CC BY-SA 4.0 (modelo 3D)
   https://github.com/itayinbarr/brainproject — © Z-Anatomy contributors / BodyParts3D (DBCLS) */
/* Tenta o hosting oficial do projeto primeiro (build já publicado, sem risco de Git LFS),
   e usa o espelho jsDelivr do repositório como segunda tentativa. */
const MODEL_URLS = [
  'https://brain-atlas-7f5fe.web.app/models/brain.glb',
  'https://cdn.jsdelivr.net/gh/itayinbarr/brainproject@main/brain-atlas/models/brain.glb'
];
const DRACO_DECODER = 'https://www.gstatic.com/draco/versioned/decoders/1.5.5/';

/* Dicionário de tradução PT-BR por padrão de nome (a nomenclatura original do modelo é em inglês/TA2) */
const REGION_DICT = [
  { re:/precentral|frontal/i, name:'Lobo Frontal', tag:'lobo (córtex)',
    funcao:'Planejamento, tomada de decisão, controle motor voluntário e regulação da personalidade e dos impulsos.',
    curiosidade:'É a última região do cérebro a amadurecer por completo — só por volta dos 25 anos de idade.',
    comportamento:'Lesões aqui podem causar impulsividade, dificuldade de planejamento e mudanças de personalidade.',
    neuro:'Depende fortemente de dopamina para motivação, foco e regulação do humor.' },
  { re:/postcentral|parietal|supramarginal|angular gyrus|precuneus/i, name:'Lobo Parietal', tag:'lobo (córtex)',
    funcao:'Integra informações sensoriais como tato, temperatura e dor, além da percepção espacial.',
    curiosidade:'Ajuda a saber onde seu corpo está no espaço mesmo de olhos fechados (propriocepção).',
    comportamento:'Lesões podem causar negligência espacial: ignorar por completo um lado do próprio corpo.',
    neuro:'Usa principalmente glutamato para transmitir sinais sensoriais com rapidez.' },
  { re:/temporal|fusiform/i, name:'Lobo Temporal', tag:'lobo (córtex)',
    funcao:'Processa a audição, participa do reconhecimento de rostos e da compreensão da linguagem.',
    curiosidade:'Abriga o giro fusiforme, especializado em reconhecer rostos.',
    comportamento:'Lesões podem causar afasia de compreensão, dificultando entender a fala de outras pessoas.',
    neuro:'Acetilcolina e glutamato são centrais para memória e processamento auditivo aqui.' },
  { re:/occipital|calcarine|cuneus|lingual/i, name:'Lobo Occipital', tag:'lobo (córtex)',
    funcao:'Concentra o córtex visual primário, transformando sinais dos olhos em percepção visual consciente.',
    curiosidade:'Estimular essa área eletricamente faz a pessoa "ver" pontos de luz, mesmo de olhos fechados.',
    comportamento:'Lesões podem causar cegueira cortical mesmo com os olhos perfeitamente saudáveis.',
    neuro:'O glutamato domina a transmissão rápida de informação visual entre os neurônios.' },
  { re:/cerebellum|vermis/i, name:'Cerebelo', tag:'estrutura',
    funcao:'Coordena o equilíbrio, ajusta a precisão dos movimentos voluntários e o timing motor.',
    curiosidade:'Tem mais neurônios do que todo o resto do cérebro somado, apesar do tamanho pequeno.',
    comportamento:'Danos causam ataxia: movimentos descoordenados, mesmo com a força muscular normal.',
    neuro:'GABA é o principal neurotransmissor inibitório das suas células de Purkinje.' },
  { re:/medulla|pons|midbrain|brainstem|peduncle/i, name:'Tronco Encefálico', tag:'estrutura',
    funcao:'Controla funções vitais automáticas: respiração, batimentos cardíacos e ciclo de sono.',
    curiosidade:'Lesões graves aqui são incompatíveis com a vida sem suporte médico intensivo.',
    comportamento:'Regula o nível de consciência e alerta; lesões extensas podem causar coma.',
    neuro:'Noradrenalina e serotonina têm núcleos de origem aqui, influenciando o cérebro todo.' },
  { re:/hippocamp/i, name:'Hipocampo', tag:'estrutura límbica',
    funcao:'Região relacionada principalmente à formação e consolidação de memórias de longo prazo.',
    curiosidade:'Taxistas de Londres que decoram a cidade inteira mostram um hipocampo fisicamente maior.',
    comportamento:'Sua perda impede a formação de novas memórias conscientes, mesmo preservando memórias antigas.',
    neuro:'Depende de glutamato e da potenciação de longo prazo (LTP) para gravar novas memórias.' },
  { re:/amygdal/i, name:'Amígdala', tag:'estrutura límbica',
    funcao:'Detecta ameaças e atribui carga emocional às experiências, antes mesmo da consciência agir.',
    curiosidade:'Pode disparar uma resposta de medo em milissegundos, antes do córtex "entender" o perigo.',
    comportamento:'Hiperatividade aqui está associada a ansiedade e ao transtorno de estresse pós-traumático.',
    neuro:'Noradrenalina e cortisol amplificam sua resposta em situações de estresse agudo.' },
  { re:/^thalamus|geniculate/i, name:'Tálamo', tag:'diencéfalo',
    funcao:'Retransmite quase toda informação sensorial (exceto olfato) até o córtex — uma central de comutação.',
    curiosidade:'É tão central para a consciência que danos bilaterais extensos podem causar coma.',
    comportamento:'Lesões podem causar perda sensorial ou distúrbios do sono.',
    neuro:'Usa glutamato para repassar sinais rapidamente ao córtex cerebral.' },
  { re:/hypothalamus|mamillary|habenula/i, name:'Hipotálamo', tag:'diencéfalo',
    funcao:'Regula fome, sede, temperatura corporal e libera hormônios que controlam a hipófise.',
    curiosidade:'Pesa cerca de 4 gramas, mas comanda boa parte do equilíbrio hormonal do corpo.',
    comportamento:'Está diretamente ligado à resposta de estresse e ao ciclo sono-vigília.',
    neuro:'Libera hormônios que comandam a hipófise, incluindo os que regulam o cortisol.' },
  { re:/corpus callosum|fornix|internal capsule|commissure/i, name:'Corpo Caloso e Vias de Substância Branca', tag:'substância branca',
    funcao:'Feixes de fibras que conectam diferentes regiões do cérebro, permitindo comunicação entre elas.',
    curiosidade:'O corpo caloso sozinho tem cerca de 200 milhões de fibras nervosas.',
    comportamento:'Em cirurgias de "cérebro dividido", os dois hemisférios passam a agir de forma quase independente.',
    neuro:'Transmite sinais eletroquímicos rapidamente via axônios mielinizados.' },
  { re:/cingulate/i, name:'Córtex Cingulado', tag:'córtex límbico',
    funcao:'Monitora conflitos entre emoção e razão, ajudando a regular impulsos e reações.',
    curiosidade:'Fica na face interna dos hemisférios, logo acima do corpo caloso.',
    comportamento:'Ativa-se fortemente em tarefas que exigem resolver conflitos ou detectar erros.',
    neuro:'Integra sinais de dopamina e serotonina ligados a humor e motivação.' },
  { re:/caudate|putamen|globus pallidus|lentiform|striatum|claustrum/i, name:'Núcleos da Base', tag:'substância cinzenta profunda',
    funcao:'Grupo de estruturas envolvidas no controle do movimento voluntário e na formação de hábitos.',
    curiosidade:'Danos aqui estão ligados a doenças como Parkinson e Huntington.',
    comportamento:'Regula a suavidade e a iniciação dos movimentos voluntários.',
    neuro:'Depende fortemente de dopamina — sua degeneração causa os sintomas motores do Parkinson.' },
  { re:/artery|carotid|basilar|vertebral a/i, name:'Artéria cerebral', tag:'vascular',
    funcao:'Parte do círculo de Willis, a rede de artérias que irriga o cérebro com sangue oxigenado.',
    curiosidade:'Uma obstrução nessas artérias é a causa mais comum de AVC isquêmico.',
    comportamento:'—', neuro:'—' },
  { re:/sinus|vein/i, name:'Seio venoso / veia cerebral', tag:'vascular',
    funcao:'Drena o sangue venoso do cérebro de volta para a circulação geral do corpo.',
    curiosidade:'Os seios da dura-máter não têm válvulas, diferente da maioria das veias do corpo.',
    comportamento:'—', neuro:'—' },
  { re:/nerve/i, name:'Nervo craniano', tag:'nervo craniano',
    funcao:'Um dos 12 pares de nervos que saem diretamente do encéfalo, controlando sentidos e músculos da cabeça.',
    curiosidade:'Ao todo são 12 pares, numerados em algarismos romanos (I a XII).',
    comportamento:'—', neuro:'—' },
  { re:/ventric/i, name:'Ventrículo cerebral', tag:'sistema ventricular',
    funcao:'Cavidade preenchida com líquido cefalorraquidiano, que amortece e nutre o cérebro.',
    curiosidade:'Esse líquido é renovado várias vezes ao longo do dia.',
    comportamento:'—', neuro:'—' },
  { re:/falx|tentorium|dura/i, name:'Meninge (dura-máter)', tag:'meninge',
    funcao:'Membrana resistente que envolve e protege o encéfalo, dividindo-o em compartimentos.',
    curiosidade:'É a mais externa e resistente das três meninges que envolvem o cérebro.',
    comportamento:'—', neuro:'—' },
  { re:/gyrus|sulcus|cortex/i, name:'Córtex cerebral', tag:'córtex',
    funcao:'Camada externa enrugada do cérebro, responsável pelo processamento cognitivo mais sofisticado.',
    curiosidade:'Se fosse esticado, o córtex humano cobriria a área de um guardanapo grande (~2500 cm²).',
    comportamento:'—', neuro:'—' },
];
function translateRegion(label, category){
  const found = REGION_DICT.find(r => r.re.test(label));
  if (found) return found;
  return {
    name: label, tag: category || 'estrutura',
    funcao: 'Estrutura anatômica real, identificada pelo modelo 3D — descrição detalhada em português ainda não disponível para esta subestrutura específica.',
    curiosidade: '—', comportamento: '—', neuro: '—'
  };
}

document.getElementById('closeBrainModal').addEventListener('click', () => closeModal('brainOverlay'));
function openBrainInfo(info){
  document.getElementById('brainModalTag').textContent = info.tag;
  document.getElementById('brainModalTitle').textContent = info.name;
  document.getElementById('brainModalFuncao').textContent = info.funcao;
  document.getElementById('brainModalCuriosidade').textContent = info.curiosidade;
  document.getElementById('brainModalComportamento').textContent = info.comportamento;
  document.getElementById('brainModalNeuro').textContent = info.neuro;
  openModal('brainOverlay');
}

const stage = document.querySelector('.brain-stage');
if (typeof THREE === 'undefined') {
  stage.innerHTML = '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;padding:24px;color:#ab9dc9;font-family:JetBrains Mono,monospace;font-size:.85rem;">⚠️ Não foi possível carregar a biblioteca 3D (Three.js). Verifique sua conexão com a internet e recarregue a página.</div>';
  throw new Error('THREE.js não carregado.');
}
const brainCanvas = document.getElementById('brainCanvas');
const hotspotLayer = document.getElementById('hotspotLayer');
const brainLoadingEl = document.createElement('div');
brainLoadingEl.className = 'brain-loading';
brainLoadingEl.textContent = 'Carregando modelo anatômico (344 estruturas)…';
stage.appendChild(brainLoadingEl);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, stage.clientWidth / stage.clientHeight, 0.1, 200);
camera.position.set(0, 0.3, 6.4);

const renderer = new THREE.WebGLRenderer({ canvas: brainCanvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(stage.clientWidth, stage.clientHeight);
if (renderer.outputEncoding !== undefined && THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;

scene.add(new THREE.AmbientLight(0x3a2a5c, 1.3));
const lightA = new THREE.PointLight(0xb794f6, 2.4, 30); lightA.position.set(-5, 4, 5); scene.add(lightA);
const lightB = new THREE.PointLight(0xc66bff, 1.6, 30); lightB.position.set(5, -3, 4); scene.add(lightB);
const lightC = new THREE.DirectionalLight(0xffffff, 0.5); lightC.position.set(0, 5, 8); scene.add(lightC);

const brainGroup = new THREE.Group();
scene.add(brainGroup);

let dragging = false, lastX = 0, lastY = 0;
let rotY = 0.4, rotX = 0.1, velY = 0.0012;
let zoom = 6.4;
brainCanvas.addEventListener('pointerdown', (e) => { dragging = true; lastX = e.clientX; lastY = e.clientY; });
window.addEventListener('pointerup', () => dragging = false);
window.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  const dx = e.clientX - lastX, dy = e.clientY - lastY;
  rotY += dx * 0.006; rotX += dy * 0.006;
  rotX = Math.max(-0.9, Math.min(0.9, rotX));
  lastX = e.clientX; lastY = e.clientY;
});
brainCanvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  zoom = Math.max(2.5, Math.min(14, zoom + e.deltaY * 0.004));
}, { passive:false });

function resizeBrain(){
  const w = stage.clientWidth, h = stage.clientHeight;
  camera.aspect = w / h; camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}
window.addEventListener('resize', resizeBrain);

function animateBrain(){
  requestAnimationFrame(animateBrain);
  if (!dragging) rotY += velY;
  brainGroup.rotation.y = rotY;
  brainGroup.rotation.x = rotX;
  camera.position.z += (zoom - camera.position.z) * 0.08;
  renderer.render(scene, camera);
}

/* ---------- FALLBACK: cérebro estilizado (usado se o modelo real não carregar) ---------- */
function buildFallbackBrain(){
  brainLoadingEl.remove();
  function fakeNoise(x, y, z){
    return Math.sin(x*1.6+z*1.1)*Math.cos(y*1.3+x*0.7)*0.5 + Math.sin(x*3.1+y*2.3)*0.22 + Math.sin(z*4.2+y*1.7)*0.14;
  }
  const geo = new THREE.IcosahedronGeometry(1.9, 4);
  const posAttr = geo.attributes.position;
  const vertex = new THREE.Vector3();
  for (let i = 0; i < posAttr.count; i++) {
    vertex.fromBufferAttribute(posAttr, i);
    const n = vertex.clone().normalize();
    vertex.addScaledVector(n, fakeNoise(vertex.x, vertex.y, vertex.z) * 0.16);
    vertex.y *= 0.92;
    posAttr.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }
  geo.computeVertexNormals();
  const brainMat = new THREE.MeshPhongMaterial({ color: 0x2a1750, emissive: 0x140a28, shininess: 45, transparent: true, opacity: 0.93 });
  brainGroup.add(new THREE.Mesh(geo, brainMat));
  const wireMat = new THREE.MeshBasicMaterial({ color: 0xb794f6, wireframe: true, transparent: true, opacity: 0.13 });
  const wireMesh = new THREE.Mesh(geo, wireMat); wireMesh.scale.setScalar(1.012);
  brainGroup.add(wireMesh);

  const anchorVec = new THREE.Vector3();
  const hotspotEls = brainRegionsFallback.map(r => {
    const el = document.createElement('div'); el.className = 'hotspot'; el.dataset.key = r.key;
    el.addEventListener('click', () => openBrainInfo(r));
    const label = document.createElement('div'); label.className = 'hotspot-label'; label.textContent = r.name;
    hotspotLayer.appendChild(el); hotspotLayer.appendChild(label);
    return { el, label, vec: new THREE.Vector3(...r.pos).normalize().multiplyScalar(2.05) };
  });
  const origAnimate = animateBrain;
  (function loop(){
    requestAnimationFrame(loop);
    hotspotEls.forEach(h => {
      anchorVec.copy(h.vec).applyMatrix4(brainGroup.matrixWorld);
      const screen = anchorVec.clone().project(camera);
      const inFront = screen.z < 1;
      const x = (screen.x*0.5+0.5) * stage.clientWidth, y = (1-(screen.y*0.5+0.5)) * stage.clientHeight;
      h.el.style.left = x+'px'; h.el.style.top = y+'px'; h.label.style.left = x+'px'; h.label.style.top = y+'px';
      h.el.style.display = inFront ? 'block' : 'none'; h.label.style.display = inFront ? 'block' : 'none';
    });
  })();
}
const brainRegionsFallback = [
  { key:'frontal', tag:'lobo', name:'Lobo Frontal', pos:[0,0.55,1.55], funcao:'Planejamento, tomada de decisão e controle motor voluntário.', curiosidade:'É a última região a amadurecer, por volta dos 25 anos.', comportamento:'Lesões podem causar impulsividade.', neuro:'Depende de dopamina para motivação e foco.' },
  { key:'parietal', tag:'lobo', name:'Lobo Parietal', pos:[0.15,1.55,-0.35], funcao:'Integração sensorial e percepção espacial.', curiosidade:'Envolvido na propriocepção.', comportamento:'Lesões podem causar negligência espacial.', neuro:'Usa glutamato para sinais sensoriais rápidos.' },
  { key:'temporal', tag:'lobo', name:'Lobo Temporal', pos:[1.55,-0.15,0.15], funcao:'Audição, reconhecimento facial e linguagem.', curiosidade:'Abriga o giro fusiforme.', comportamento:'Lesões podem causar afasia.', neuro:'Acetilcolina e glutamato são centrais aqui.' },
  { key:'occipital', tag:'lobo', name:'Lobo Occipital', pos:[0,0.15,-1.65], funcao:'Processamento visual primário.', curiosidade:'Estimulação elétrica gera fosfenos.', comportamento:'Lesões podem causar cegueira cortical.', neuro:'Glutamato domina a via visual.' },
  { key:'cerebelo', tag:'estrutura', name:'Cerebelo', pos:[0,-1.1,-1.15], funcao:'Equilíbrio e coordenação motora.', curiosidade:'Concentra a maioria dos neurônios do cérebro.', comportamento:'Danos causam ataxia.', neuro:'GABA é o neurotransmissor das células de Purkinje.' },
  { key:'tronco', tag:'estrutura', name:'Tronco Encefálico', pos:[0,-1.65,-0.1], funcao:'Funções vitais automáticas.', curiosidade:'Lesões graves são incompatíveis com a vida sem suporte.', comportamento:'Regula o nível de consciência.', neuro:'Origem de núcleos de noradrenalina e serotonina.' },
];

/* ---------- CARREGAMENTO DO MODELO REAL ---------- */
let hoveredMesh = null, selectedMesh = null;
const interactiveMeshes = [];
const raycaster = new THREE.Raycaster();
const mouseNDC = new THREE.Vector2();
const hoverLabel = document.createElement('div');
hoverLabel.className = 'hotspot-label';
hoverLabel.style.position = 'absolute';
hotspotLayer.appendChild(hoverLabel);

function meshInfo(mesh){
  const extras = mesh.userData || (mesh.parent && mesh.parent.userData) || {};
  const label = extras.bx_label || mesh.name || 'Estrutura';
  const cat = extras.bx_cat || '';
  return translateRegion(label, cat);
}

brainCanvas.addEventListener('pointermove', (e) => {
  if (!interactiveMeshes.length || dragging) { hoverLabel.style.opacity = 0; return; }
  const rect = brainCanvas.getBoundingClientRect();
  mouseNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouseNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(mouseNDC, camera);
  const hits = raycaster.intersectObjects(interactiveMeshes, false);
  if (hits.length) {
    const mesh = hits[0].object;
    if (hoveredMesh && hoveredMesh !== mesh && hoveredMesh !== selectedMesh) {
      hoveredMesh.material.emissive.setHex(0x140a28);
    }
    if (mesh !== selectedMesh) mesh.material.emissive.setHex(0x6b3fa0);
    hoveredMesh = mesh;
    hoverLabel.textContent = meshInfo(mesh).name;
    hoverLabel.style.left = (e.clientX - rect.left) + 'px';
    hoverLabel.style.top = (e.clientY - rect.top - 14) + 'px';
    hoverLabel.style.opacity = 1;
    brainCanvas.style.cursor = 'pointer';
  } else {
    if (hoveredMesh && hoveredMesh !== selectedMesh) hoveredMesh.material.emissive.setHex(0x140a28);
    hoveredMesh = null;
    hoverLabel.style.opacity = 0;
    brainCanvas.style.cursor = 'grab';
  }
});
brainCanvas.addEventListener('click', () => {
  if (!hoveredMesh) return;
  if (selectedMesh && selectedMesh !== hoveredMesh) selectedMesh.material.emissive.setHex(0x140a28);
  selectedMesh = hoveredMesh;
  selectedMesh.material.emissive.setHex(0xc66bff);
  openBrainInfo(meshInfo(selectedMesh));
});

let modelSettled = false;
const loadTimeout = setTimeout(() => {
  if (!modelSettled) {
    modelSettled = true;
    console.warn('[Cérebro 3D] Tempo esgotado (20s) carregando o modelo real. Usando versão de reserva.');
    buildFallbackBrain();
  }
}, 20000);

function settleWithFallback(reason){
  if (modelSettled) return;
  modelSettled = true;
  clearTimeout(loadTimeout);
  console.warn('[Cérebro 3D] ' + reason);
  buildFallbackBrain();
}

function applyLoadedModel(gltf){
  if (modelSettled) return;
  modelSettled = true;
  clearTimeout(loadTimeout);
  brainLoadingEl.remove();

  const root = gltf.scene;
  const box = new THREE.Box3().setFromObject(root);
  const size = new THREE.Vector3(); box.getSize(size);
  const center = new THREE.Vector3(); box.getCenter(center);
  root.position.sub(center);
  const scale = 4.3 / Math.max(size.x, size.y, size.z);
  root.scale.setScalar(scale);

  root.traverse((child) => {
    if (child.isMesh) {
      const extras = (child.userData && Object.keys(child.userData).length) ? child.userData
        : (child.parent && child.parent.userData) || {};
      child.userData = extras;
      const mat = new THREE.MeshStandardMaterial({
        color: 0x8a63c9, emissive: 0x140a28, roughness: 0.55, metalness: 0.12,
        transparent: true, opacity: 0.96
      });
      child.material = mat;
      interactiveMeshes.push(child);
    }
  });
  brainGroup.add(root);
  console.info('[Cérebro 3D] Modelo real carregado com sucesso —', interactiveMeshes.length, 'meshes interativos.');
}

/* Busca manual do arquivo primeiro, para diagnosticar exatamente o que deu errado
   (ex.: arquivo servido como ponteiro do Git LFS em vez do .glb binário real) */
async function tryFetchModel(url){
  let res;
  try {
    res = await fetch(url);
  } catch (err) {
    console.warn('[Cérebro 3D] Falha de rede/CORS em', url, '—', err.message);
    return null;
  }
  if (!res.ok) {
    console.warn('[Cérebro 3D] HTTP', res.status, 'em', url);
    return null;
  }
  const buffer = await res.arrayBuffer();
  if (buffer.byteLength < 2000) {
    const text = new TextDecoder().decode(buffer.slice(0, 200));
    if (/git-lfs/i.test(text)) {
      console.warn('[Cérebro 3D]', url, 'é um ponteiro Git LFS, não o binário real. Pulando para a próxima fonte.');
    } else {
      console.warn('[Cérebro 3D] Resposta pequena demais (' + buffer.byteLength + ' bytes) em', url);
    }
    return null;
  }
  return buffer;
}

async function loadRealBrain(){
  const dracoLoader = new THREE.DRACOLoader();
  dracoLoader.setDecoderPath(DRACO_DECODER);
  const gltfLoader = new THREE.GLTFLoader();
  gltfLoader.setDRACOLoader(dracoLoader);

  for (const url of MODEL_URLS) {
    const buffer = await tryFetchModel(url);
    if (!buffer) continue;
    await new Promise((resolve) => {
      gltfLoader.parse(buffer, '', (gltf) => { applyLoadedModel(gltf); resolve(); }, (err) => {
        console.warn('[Cérebro 3D] GLTFLoader falhou ao interpretar', url, '—', err && err.message ? err.message : err);
        resolve();
      });
    });
    if (modelSettled) return;
  }
  settleWithFallback('Nenhuma das fontes do modelo real funcionou (rede, CORS ou Git LFS). Veja os avisos acima no console para o motivo exato de cada uma.');
}

try {
  loadRealBrain();
} catch (err) {
  settleWithFallback('Erro inesperado ao iniciar o carregamento: ' + err.message);
}

resizeBrain();
animateBrain();

if (typeof ResizeObserver !== 'undefined') {
  new ResizeObserver(() => resizeBrain()).observe(stage);
}

