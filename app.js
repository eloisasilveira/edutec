(function(){
  "use strict";

  var tabs = document.querySelectorAll('[data-nav]');
  var views = document.querySelectorAll('.view');
  var topnav = document.querySelector('.topnav');
  var menuToggle = document.getElementById('menuToggle');
  function closeMenu(){
    if (!topnav || !menuToggle) return;
    topnav.classList.remove('mobile-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
  }
  if (menuToggle){
    menuToggle.addEventListener('click', function(){
      var open = !topnav.classList.contains('mobile-open');
      topnav.classList.toggle('mobile-open', open);
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });
  }
  function goTo(name){
    var nextView = null;
    views.forEach(function(v){
      var active = v.id === 'view-' + name;
      v.classList.toggle('active', active);
      if (active) nextView = v;
    });
    if (nextView){
      nextView.classList.remove('page-enter');
      void nextView.offsetWidth;
      nextView.classList.add('page-enter');
    }
    document.querySelectorAll('.tab[data-nav]').forEach(function(t){ t.classList.toggle('active', t.dataset.nav === name); });
    document.body.dataset.view = name;
    window.scrollTo({ top: 0, behavior: 'auto' });
    closeAuth();
    closeTooltip();
    closeMenu();
    if (name === 'cerebro3d'){
      if (window.__startBrain3D) window.__startBrain3D();
    } else if (window.__stopBrain3D){
      window.__stopBrain3D();
    }
    if (name === 'neuro'){
      if (window.__startNeuroBrain) window.__startNeuroBrain();
    }
    if (name === 'jogo'){
      var jf = document.getElementById('jogoFrame');
      if (jf && jf.dataset.src && !jf.getAttribute('src')) jf.setAttribute('src', jf.dataset.src);
    }
  }
  document.body.dataset.view = 'inicio';
  tabs.forEach(function(t){ t.addEventListener('click', function(){ goTo(t.dataset.nav); }); });
  window.addEventListener('resize', function(){ if (window.innerWidth > 880) closeMenu(); });
  document.querySelectorAll('.tab.soon').forEach(function(t){
    t.addEventListener('click', function(){ showToast(t.dataset.soon + ' — em breve neste protótipo.'); });
  });

  (function(){
    var shell = document.getElementById('jogoShell');
    var botao = document.getElementById('jogoExpandir');
    if(!shell || !botao) return;
    var rotulo = botao.querySelector('span');

    function emTelaCheia(){
      return document.fullscreenElement === shell || document.webkitFullscreenElement === shell;
    }
    function atualizar(){
      var cheio = emTelaCheia();
      rotulo.textContent = cheio ? 'reduzir' : 'expandir';
      botao.title = cheio ? 'Sair da tela cheia' : 'Expandir para tela cheia';
    }
    botao.addEventListener('click', function(){
      if(emTelaCheia()){
        (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      } else {
        var abrir = shell.requestFullscreen || shell.webkitRequestFullscreen;
        if(abrir){
          var r = abrir.call(shell);
          if(r && r.catch) r.catch(function(){ showToast('Seu navegador bloqueou a tela cheia.'); });
        } else {
          showToast('Este navegador não permite tela cheia aqui.');
        }
      }
    });
    document.addEventListener('fullscreenchange', atualizar);
    document.addEventListener('webkitfullscreenchange', atualizar);
    atualizar();
  })();

  var toastEl = document.getElementById('toast');
  var toastTimer;
  function showToast(msg){
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ toastEl.classList.remove('show'); }, 2600);
  }

  var overlay = document.getElementById('authOverlay');
  var authCard = document.getElementById('authCard');
  var loginForm = document.getElementById('loginForm');
  var cadastroForm = document.getElementById('cadastroForm');
  function openAuth(mode){
    overlay.classList.add('open');
    setAuthMode(mode || 'login');
  }
  function closeAuth(){ overlay.classList.remove('open'); }
  function setAuthMode(mode){
    loginForm.style.display = mode === 'login' ? 'block' : 'none';
    cadastroForm.style.display = mode === 'cadastro' ? 'block' : 'none';
    authCard.dataset.mode = mode;
  }
  document.querySelectorAll('[data-auth]').forEach(function(b){
    b.addEventListener('click', function(){ openAuth(b.dataset.auth); });
  });
  document.getElementById('authClose').addEventListener('click', closeAuth);
  overlay.addEventListener('click', function(e){ if (e.target === overlay) closeAuth(); });
  document.querySelectorAll('[data-switch]').forEach(function(b){
    b.addEventListener('click', function(){ setAuthMode(b.dataset.switch); });
  });
  loginForm.addEventListener('submit', function(e){ e.preventDefault(); closeAuth(); showToast('Login simulado — protótipo sem backend.'); });
  cadastroForm.addEventListener('submit', function(e){ e.preventDefault(); closeAuth(); showToast('Cadastro simulado — protótipo sem backend.'); });

  var tooltip = document.getElementById('tooltip');
  var tooltipTitle = document.getElementById('tooltipTitle');
  var tooltipBody = document.getElementById('tooltipBody');
  var popoverBackdrop = document.getElementById('popoverBackdrop');
  var TIPS = {
    vesicula: ['Vesícula', 'Armazena neurotransmissores prontos para serem liberados assim que um potencial de ação chega ao terminal do axônio.'],
    receptor: ['Receptor', 'Proteína na membrana do neurônio seguinte que reconhece um neurotransmissor específico e muda seu comportamento elétrico.'],
    fenda: ['Fenda sináptica', 'Espaço microscópico entre dois neurônios onde o neurotransmissor é liberado e atravessa até o neurônio seguinte.']
  };
  function closeTooltip(){
    tooltip.classList.remove('open');
    popoverBackdrop.classList.remove('open');
  }
  function openTooltip(title, body){
    tooltipTitle.textContent = title;
    tooltipBody.textContent = body;
    tooltip.classList.add('open');
    popoverBackdrop.classList.add('open');
  }
  window.openTooltip = openTooltip;
  document.querySelectorAll('[data-key]').forEach(function(el){
    el.addEventListener('click', function(e){
      var t = TIPS[el.dataset.key];
      openTooltip(t[0], t[1]);
      e.stopPropagation();
    });
  });
  var EMOTION_TIPS = {
    talamo: [
      'Tálamo · central de triagem',
      'Quando a porta bate, o tálamo recebe rapidamente o sinal auditivo. Ele envia uma versão resumida direto para a amígdala e outra, mais detalhada, para o córtex analisar.'
    ],
    cortex: [
      'Córtex sensorial · identificar o som',
      'Na via lenta, o córtex examina as características do barulho. Isso permite distinguir uma porta batendo de algo realmente perigoso.'
    ],
    hipocampo: [
      'Hipocampo · contexto e memória',
      'O hipocampo compara o som com experiências e com o ambiente atual: “essa porta costuma bater com o vento”. Esse contexto ajuda a reduzir um alarme desnecessário.'
    ],
    amigdala: [
      'Amígdala · disparar o alarme',
      'No exemplo da porta, a amígdala recebe primeiro uma informação incompleta e prefere errar por excesso de cuidado. Ela aciona a defesa antes de o córtex confirmar o que aconteceu.'
    ],
    hipotalamo: [
      'Hipotálamo · preparar o corpo',
      'Depois do alarme da amígdala, o hipotálamo coordena a resposta física: aumenta o estado de alerta, acelera coração e respiração e ativa sistemas ligados ao estresse.'
    ]
  };
  document.querySelectorAll('[data-emotion-node]').forEach(function(el){
    el.addEventListener('click', function(e){
      var tip = EMOTION_TIPS[el.dataset.emotionNode];
      if (tip) openTooltip(tip[0], tip[1]);
      e.stopPropagation();
    });
  });
  document.getElementById('tooltipClose').addEventListener('click', closeTooltip);
  popoverBackdrop.addEventListener('click', closeTooltip);
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape'){ closeAuth(); closeTooltip(); } });

  var MOLECULES = {
    dopamina: {
      name: 'Dopamina', formula: 'C₈H₁₁NO₂',
      tipo: 'Catecolamina — atua como neurotransmissor excitatório/modulador',
      funcao: 'Motivação, sensação de recompensa e controle do movimento voluntário.',
      onde: 'Via mesolímbica e substância negra.',
      elementos: 'Carbono, Hidrogênio, Nitrogênio, Oxigênio',
      svg: catecholSvg({ oh2: true, nh2Only: true })
    },
    noradrenalina: {
      name: 'Noradrenalina', formula: 'C₈H₁₁NO₃',
      tipo: 'Catecolamina — atua como neurotransmissor excitatório/modulador',
      funcao: 'Atenção, alerta, concentração, resposta ao estresse e regulação da pressão arterial.',
      onde: 'Principalmente no locus coeruleus, no cérebro, e no sistema nervoso simpático.',
      elementos: 'Carbono, Hidrogênio, Nitrogênio e Oxigênio.',
      svg: catecholSvg({ oh2: true, nh2Only: false })
    },
    serotonina: {
      name: 'Serotonina', formula: 'C₁₀H₁₂N₂O',
      tipo: 'Monoamina indolamínica — modulador do humor',
      funcao: 'Regula humor, sono, apetite e ansiedade; principal alvo dos antidepressivos ISRS.',
      onde: 'Núcleos da rafe, no tronco encefálico, com projeções por todo o córtex.',
      elementos: 'Carbono, Hidrogênio, Nitrogênio, Oxigênio',
      svg: serotoninSvg()
    },
    gaba: {
      name: 'GABA', formula: 'C₄H₉NO₂',
      tipo: 'Aminoácido — principal neurotransmissor inibitório do SNC',
      funcao: 'Reduz a excitabilidade neuronal; alvo de ansiolíticos e anticonvulsivantes.',
      onde: 'Amplamente distribuído no córtex, cerebelo e sistema límbico.',
      elementos: 'Carbono, Hidrogênio, Nitrogênio, Oxigênio',
      svg: chainSvg({ acid: true, amine: true, branch: false })
    },
    glutamato: {
      name: 'Glutamato', formula: 'C₅H₉NO₄',
      tipo: 'Aminoácido — principal neurotransmissor excitatório do SNC',
      funcao: 'Essencial para aprendizado, memória e a potenciação de longo prazo (LTP).',
      onde: 'Amplamente distribuído; predomina no córtex e no hipocampo.',
      elementos: 'Carbono, Hidrogênio, Nitrogênio, Oxigênio',
      svg: chainSvg({ acid: true, amine: true, branch: true })
    },
    acetilcolina: {
      name: 'Acetilcolina', formula: 'C₇H₁₆NO₂⁺',
      tipo: 'Éster de colina — neurotransmissor motor e autonômico',
      funcao: 'Envolvida em memória, atenção e contração muscular; reduzida em pacientes com Alzheimer.',
      onde: 'Junções neuromusculares, núcleo basal de Meynert e sistema nervoso parassimpático.',
      elementos: 'Carbono, Hidrogênio, Nitrogênio, Oxigênio',
      svg: acetylcholineSvg()
    }
  };

  function svgWrap(inner){
    return '<svg viewBox="0 0 220 160" fill="none" stroke="#e2a6ff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">' + inner + '</svg>';
  }
  function label(x,y,text,fill){
    return '<text x="'+x+'" y="'+y+'" font-family="JetBrains Mono, monospace" font-size="15" fill="'+(fill||'#ffb8e3')+'" stroke="none">'+text+'</text>';
  }
  function catecholSvg(opts){
    var ring = 'M70,60 L96,76 L96,108 L70,124 L44,108 L44,76 Z';
    var inner = 'M74,66 L92,78 M92,104 L74,120 M48,80 L48,104';
    var chain = opts.nh2Only
      ? 'M70,60 L86,40 L108,40 L124,20'
      : 'M70,60 L86,42 L104,52 L124,32';
    var s = '<path d="'+ring+'" />';
    s += '<path d="'+inner+'" stroke-width="2" opacity=".55" />';
    s += '<path d="M70,124 L70,142" /><path d="M44,108 L26,120" />';
    s += '<path d="'+chain+'" />';
    s += label(56,152,'OH');
    s += label(2,126,'HO');
    if (opts.nh2Only){
      s += label(126,18,'NH₂');
    } else {
      s += label(90,36,'OH');
      s += label(126,30,'NH₂');
      s += label(96,66,'(R)','#f6eef8');
    }
    return svgWrap(s);
  }
  function serotoninSvg(){
    var s = '';
    s += '<path d="M56,58 L82,74 L82,106 L56,122 L30,106 L30,74 Z" />';
    s += '<path d="M60,64 L78,76 M78,102 L60,114 M34,78 L34,102" stroke-width="2" opacity=".55" />';
    s += '<path d="M82,90 L112,80 L128,96 L112,112 Z" />';
    s += '<path d="M56,122 L56,140" />';
    s += label(44,150,'OH');
    s += label(120,120,'N'); s += label(126,132,'H','#f6eef8');
    s += '<path d="M128,96 L150,86 L168,64 L188,44" />';
    s += label(190,40,'NH₂');
    return svgWrap(s);
  }
  function chainSvg(opts){
    var s = '';
    var pts = opts.branch
      ? [[24,120],[50,96],[76,120],[102,96],[128,120],[154,96]]
      : [[30,120],[64,96],[98,120],[132,96],[166,120]];
    var d = 'M' + pts.map(function(p){ return p[0]+','+p[1]; }).join(' L');
    s += '<path d="'+d+'" />';
    var a = pts[0];
    s += '<path d="M'+a[0]+','+a[1]+' L'+(a[0]-4)+','+(a[1]-24)+'" />';
    s += '<path d="M'+a[0]+','+a[1]+' L'+(a[0]-22)+','+(a[1]+10)+'" />';
    s += label(a[0]-16,a[1]-30,'O');
    s += label(a[0]-46,a[1]+18,'HO');
    if (opts.acid){
      var b = pts[pts.length-1];
      s += '<path d="M'+b[0]+','+b[1]+' L'+(b[0]+4)+','+(b[1]-24)+'" />';
      s += '<path d="M'+b[0]+','+b[1]+' L'+(b[0]+22)+','+(b[1]+10)+'" />';
      s += label(b[0]-4,b[1]-30,'O');
      s += label(b[0]+22,b[1]+22,'OH');
    }
    if (opts.amine){
      var mid = opts.branch ? pts[2] : pts[1];
      s += '<path d="M'+mid[0]+','+mid[1]+' L'+(mid[0]+4)+','+(mid[1]+26)+'" />';
      s += label(mid[0]-10,mid[1]+44,'NH₂');
    }
    return svgWrap(s);
  }
  function acetylcholineSvg(){
    var s = '';
    s += '<path d="M40,80 L40,56 M40,80 L18,68 M40,80 L18,92" />';
    s += label(30,44,'N⁺');
    s += '<path d="M40,80 L64,96 L88,80 L112,96" />';
    s += label(106,72,'O');
    s += '<path d="M112,96 L136,80" />';
    s += '<path d="M136,80 L136,56" />';
    s += label(128,48,'O');
    s += '<path d="M136,80 L160,96" />';
    s += label(160,116,'CH₃');
    return svgWrap(s);
  }

  var compareToggle = document.getElementById('compareToggle');
  var pillsWrap = document.getElementById('ntPills');
  var stack = document.getElementById('moleculeStack');
  var emptyMsg = document.getElementById('moleculeEmpty');
  var selected = [];

  function renderMolecules(){
    var pills = pillsWrap.querySelectorAll('.nt-pill');
    pills.forEach(function(p){ p.classList.toggle('selected', selected.indexOf(p.dataset.mol) > -1); });
    stack.innerHTML = '';
    emptyMsg.style.display = selected.length ? 'none' : 'block';
    selected.forEach(function(key){
      var m = MOLECULES[key];
      var card = document.createElement('div');
      card.className = 'molecule-card';
      card.innerHTML =
        '<div class="molecule-art">' + m.svg + '</div>' +
        '<div class="molecule-info">' +
          '<h3>' + m.name + '</h3>' +
          '<p class="molecule-formula">' + m.formula + '</p>' +
          '<dl>' +
            '<div><dt>Tipo</dt><dd>' + m.tipo + '</dd></div>' +
            '<div><dt>Função</dt><dd>' + m.funcao + '</dd></div>' +
            '<div><dt>Onde atua</dt><dd>' + m.onde + '</dd></div>' +
            '<div><dt>Elementos</dt><dd>' + m.elementos + '</dd></div>' +
          '</dl>' +
        '</div>';
      stack.appendChild(card);
    });
  }
  pillsWrap.addEventListener('click', function(e){
    var btn = e.target.closest('.nt-pill');
    if (!btn) return;
    var key = btn.dataset.mol;
    var compare = compareToggle.checked;
    var idx = selected.indexOf(key);
    if (idx > -1){
      selected.splice(idx, 1);
    } else if (compare){
      selected.push(key);
      if (selected.length > 2) selected.shift();
    } else {
      selected = [key];
    }
    renderMolecules();
  });
  compareToggle.addEventListener('change', function(){
    if (!compareToggle.checked && selected.length > 1) selected = [selected[selected.length - 1]];
    renderMolecules();
  });

  renderMolecules();
})();

(function(){
  "use strict";
  var canvas = document.getElementById('brainCanvas');
  var panel = document.getElementById('brainPanel');
  if (!canvas || !panel) return;

  function boot(){
  var THREE = window.THREE;
  if (!THREE) return;

  var REGIONS = [
    { key:'frontal-e',  pos:[-0.92, 0.65, 0.35],  title:'Lobo Frontal',
      body:'Planejamento, tomada de decisão, controle de impulsos e a maior parte dos movimentos voluntários.' },
    { key:'frontal-d',  pos:[-0.93, 0.58,-0.42],  title:'Lobo Frontal',
      body:'Planejamento, tomada de decisão, controle de impulsos e a maior parte dos movimentos voluntários.' },
    { key:'parietal-e', pos:[ 0.34, 1.17, 0.37],  title:'Lobo Parietal',
      body:'Integra informações sensoriais — tato, temperatura, dor — e a noção de espaço e posição do corpo.' },
    { key:'parietal-d', pos:[ 0.42, 1.15,-0.34],  title:'Lobo Parietal',
      body:'Integra informações sensoriais — tato, temperatura, dor — e a noção de espaço e posição do corpo.' },
    { key:'temporal-e', pos:[-0.04, 0.22, 0.81],  title:'Lobo Temporal',
      body:'Audição, reconhecimento de rostos e linguagem; abriga o hipocampo, essencial para a memória.' },
    { key:'temporal-d', pos:[-0.15, 0.21,-0.78],  title:'Lobo Temporal',
      body:'Audição, reconhecimento de rostos e linguagem; abriga o hipocampo, essencial para a memória.' },
    { key:'occipital',  pos:[ 1.01, 0.42,-0.10],  title:'Lobo Occipital',
      body:'Processamento visual — da luz captada pelos olhos até formas, cores e movimento reconhecíveis.' },
    { key:'motor',      pos:[-0.21, 1.19, 0.27],  title:'Córtex Motor',
      body:'Faixa no topo do cérebro, logo à frente do sulco central, que comanda os movimentos voluntários — cada trecho controla uma parte do corpo.' },
    { key:'broca',      pos:[-0.85, 0.40, 0.52],  title:'Área de Broca',
      body:'No lobo frontal do hemisfério esquerdo, ligada à produção da fala — à articulação das palavras e à formação de frases.' },
    { key:'wernicke',   pos:[ 0.43, 0.37, 0.76],  title:'Área de Wernicke',
      body:'Na junção entre os lobos temporal e parietal, do lado esquerdo, é essencial para compreender a linguagem falada e escrita.' },
    { key:'cerebelo',   pos:[ 0.76,-0.10, 0.32],  title:'Cerebelo',
      body:'Logo abaixo e atrás do cérebro: coordenação motora fina, equilíbrio e o ajuste automático de movimentos aprendidos.' },
    { key:'tronco',     pos:[ 0.30,-0.62, 0.12],  title:'Tronco encefálico',
      body:'A haste que liga o cérebro à medula. Controla funções vitais automáticas — respiração, batimentos cardíacos e o ciclo sono-vigília.' }
  ];

  var state = { inited:false, animating:false, dragging:false, lastX:0, lastY:0, moved:0, ready:false };
  var scene, camera, renderer, brainGroup, raycaster, pointer, hotspotMeshes = [];

  function makeGlowTexture(hex){
    var c = document.createElement('canvas');
    c.width = c.height = 128;
    var ctx = c.getContext('2d');
    var g = ctx.createRadialGradient(64,64,0,64,64,64);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.25, hex + 'ff');
    g.addColorStop(1, hex + '00');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,128,128);
    return new THREE.CanvasTexture(c);
  }

  function b64ToArrayBuffer(b64){
    var bin = atob(b64);
    var len = bin.length;
    var buf = new ArrayBuffer(len);
    var arr = new Uint8Array(buf);
    for (var i = 0; i < len; i++) arr[i] = bin.charCodeAt(i);
    return buf;
  }

  function buildHotspots(group){
    var texPink = makeGlowTexture('#ff6fd8');
    REGIONS.forEach(function(r){
      var mat = new THREE.SpriteMaterial({ map:texPink, transparent:true, depthWrite:false, blending:THREE.AdditiveBlending });
      var sprite = new THREE.Sprite(mat);
      sprite.position.set(r.pos[0], r.pos[1], r.pos[2]);
      sprite.scale.set(0.13, 0.13, 0.13);
      sprite.userData.region = r;
      group.add(sprite);
      hotspotMeshes.push(sprite);
    });
  }

  var brainModelTemplate = null;
  function loadBrainModel(onReady){
    if (brainModelTemplate){
      onReady(brainModelTemplate.clone(true));
      return;
    }
    var b64 = window.__brainB64;
    if (!b64 || !window.THREE || !THREE.GLTFLoader){
      onReady(null);
      return;
    }
    var loader = new THREE.GLTFLoader();
    var buf = b64ToArrayBuffer(b64);
    loader.parse(buf, '', function(gltf){
      var root = gltf.scene;
      var box = new THREE.Box3().setFromObject(root);
      var size = new THREE.Vector3(); box.getSize(size);
      var center = new THREE.Vector3(); box.getCenter(center);

      var mat = new THREE.MeshStandardMaterial({
        color: 0x8a4bc9, emissive: 0x3a1858, emissiveIntensity: 0.38,
        roughness: 0.5, metalness: 0.1, flatShading:false
      });
      root.traverse(function(o){
        if (o.isMesh) o.material = mat;
      });

      var maxDim = Math.max(size.x, size.y, size.z) || 1;
      var scale = 2.4 / maxDim;
      root.scale.setScalar(scale);
      root.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

      var wireMat = new THREE.MeshBasicMaterial({ color:0xc879e1, wireframe:true, transparent:true, opacity:0.04 });
      var wireRoot = root.clone(true);
      wireRoot.traverse(function(o){ if (o.isMesh) o.material = wireMat; });
      wireRoot.scale.multiplyScalar(1.004);

      var group = new THREE.Group();
      group.add(root, wireRoot);
      brainModelTemplate = group;
      onReady(group.clone(true));
    }, function(err){
      onReady(null);
    });
  }

  function initBrain(){
    state.inited = true;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(0, 0.45, 5.1);
    camera.lookAt(0, -0.18, 0);

    renderer = new THREE.WebGLRenderer({ canvas:canvas, antialias:true, alpha:true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    scene.add(new THREE.AmbientLight(0x3a1a4d, 1.5));
    var lp = new THREE.PointLight(0xff2f8f, 1.1, 14);
    lp.position.set(2.5, 2, 3);
    scene.add(lp);
    var lv = new THREE.PointLight(0x8b3ce0, 1.3, 14);
    lv.position.set(-2.5, -1.5, -2.5);
    scene.add(lv);
    var lf = new THREE.PointLight(0xffffff, 0.28, 14);
    lf.position.set(0, 3, 2);
    scene.add(lf);

    raycaster = new THREE.Raycaster();
    pointer = new THREE.Vector2();

    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('click', onClick);
    window.addEventListener('resize', resizeBrain);

    loadBrainModel(function(group){
      if (!group){
        panel.classList.add('brain3d-error');
        return;
      }
      brainGroup = group;
      brainGroup.rotation.y = Math.PI / 2 - 0.45;
      scene.add(brainGroup);
      buildHotspots(brainGroup);
      state.ready = true;
    });
  }

  function onPointerDown(e){
    state.dragging = true;
    state.moved = 0;
    state.lastX = e.clientX;
    state.lastY = e.clientY;
    panel.classList.add('dragging');
  }
  function onPointerMove(e){
    if (!state.dragging || !state.ready) return;
    var dx = e.clientX - state.lastX;
    var dy = e.clientY - state.lastY;
    state.moved += Math.abs(dx) + Math.abs(dy);
    brainGroup.rotation.y += dx * 0.005;
    brainGroup.rotation.x = Math.max(-0.55, Math.min(0.55, brainGroup.rotation.x + dy * 0.004));
    state.lastX = e.clientX;
    state.lastY = e.clientY;
  }
  function onPointerUp(){
    state.dragging = false;
    panel.classList.remove('dragging');
  }
  function onClick(e){
    if (state.moved > 6) return;
    var rect = canvas.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    var hits = raycaster.intersectObjects(hotspotMeshes);
    if (hits.length){
      var r = hits[0].object.userData.region;
      window.openTooltip(r.title, r.body);
    }
  }

  function resizeBrain(){
    if (!renderer) return;
    var w = panel.clientWidth, h = panel.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function loop(){
    if (!state.animating) return;
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  }

  window.__cloneAnatomicalBrain = loadBrainModel;

  window.__startBrain3D = function(){
    if (!state.inited) initBrain();
    resizeBrain();
    if (!state.animating){
      state.animating = true;
      requestAnimationFrame(loop);
    }
  };
  window.__stopBrain3D = function(){
    state.animating = false;
  };

  if (document.body.dataset.view === 'cerebro3d') window.__startBrain3D();
  }

  if (window.THREE) boot();
  else window.addEventListener('three-ready', boot, { once:true });
})();

(function(){
  "use strict";
  var canvas = document.getElementById('npBrainCanvas');
  if (!canvas) return;
  var started = false, renderer, scene, camera;

  function resize(){
    if (!renderer) return;
    var box = canvas.getBoundingClientRect();
    if (!box.width || !box.height) return;
    renderer.setSize(box.width, box.height, false);
    camera.aspect = box.width / box.height;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
  }

  function init(){
    if (started || !window.THREE || !window.__cloneAnatomicalBrain) return;
    started = true;
    var THREE = window.THREE;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(31, 2.1, 0.1, 50);
    camera.position.set(0, 0.25, 4.6);
    camera.lookAt(0, 0.02, 0);
    renderer = new THREE.WebGLRenderer({ canvas:canvas, antialias:true, alpha:true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    scene.add(new THREE.HemisphereLight(0xe8c9ff, 0x16041d, 1.7));
    var rim = new THREE.DirectionalLight(0xff67bf, 1.15);
    rim.position.set(-2, 2, 3);
    scene.add(rim);
    window.__cloneAnatomicalBrain(function(group){
      if (!group) return;
      group.rotation.y = Math.PI / 2 - 0.42;
      group.rotation.x = -0.04;
      group.scale.multiplyScalar(0.88);
      group.position.y = 0.02;
      scene.add(group);
      resize();
    });
    window.addEventListener('resize', resize);
    resize();
  }

  window.__startNeuroBrain = function(){ init(); resize(); };
})();

(function(){
  "use strict";
  var cv = document.getElementById('heroCerebro');
  if (!cv || !cv.getContext) return;
  var ctx = cv.getContext('2d');

  var CORTEX   = 'M46 96 C38 62 66 34 106 28 C132 10 176 8 202 26 C236 22 264 40 272 68 C292 80 294 110 278 126 C266 140 244 146 224 142 C214 156 196 162 178 156 C160 166 132 164 118 150 C92 152 62 134 58 116 C52 112 48 104 46 96 Z';
  var CEREBELO = 'M230 138 C250 132 272 141 276 156 C280 171 266 183 247 183 C230 183 220 172 222 157 C224 148 226 142 230 138 Z';
  var TRONCO   = 'M212 146 C213 162 209 177 202 189';
  var SULCOS = [
    'M112 40 C124 74 104 98 116 140','M172 26 C182 70 162 104 176 152',
    'M236 42 C244 78 230 100 238 128','M84 60 C96 88 82 108 90 134',
    'M204 34 C214 72 198 104 208 150','M256 56 C264 86 252 106 258 130'
  ];

  var M = 408, N = 240, ESC = M / 340;
  function molde(fn){
    var c = document.createElement('canvas');
    c.width = M; c.height = N;
    var g = c.getContext('2d');
    g.save(); g.scale(ESC, ESC); g.translate(0, 8); fn(g); g.restore();
    return g.getImageData(0, 0, M, N).data;
  }
  var corpo = molde(function(g){
    g.fillStyle = '#fff';
    g.fill(new Path2D(CORTEX));
    g.fill(new Path2D(CEREBELO));
    g.strokeStyle = '#fff';
    g.lineWidth = 13;
    g.lineCap = 'round';
    g.stroke(new Path2D(TRONCO));
  });
  var sulcos = molde(function(g){
    g.strokeStyle = '#fff';
    g.lineWidth = 3.6;
    g.lineCap = 'round';
    for (var si = 0; si < SULCOS.length; si++) g.stroke(new Path2D(SULCOS[si]));
  });

  var INF = 1e9, dist = new Float32Array(M * N), i, x, y, k;
  for (i = 0; i < M * N; i++) dist[i] = corpo[i * 4 + 3] > 128 ? INF : 0;
  for (y = 1; y < N; y++) for (x = 1; x < M - 1; x++){
    k = y * M + x;
    if (!dist[k]) continue;
    dist[k] = Math.min(dist[k], dist[k-1]+1, dist[k-M]+1, dist[k-M-1]+1.41, dist[k-M+1]+1.41);
  }
  for (y = N - 2; y >= 0; y--) for (x = M - 2; x > 0; x--){
    k = y * M + x;
    if (!dist[k]) continue;
    dist[k] = Math.min(dist[k], dist[k+1]+1, dist[k+M]+1, dist[k+M+1]+1.41, dist[k+M-1]+1.41);
  }

  var MAXD = 44, P = [], ALVO = window.innerWidth < 760 ? 3200 : 7600, tent = 0;
  while (P.length < ALVO && tent < ALVO * 60){
    tent++;
    var px = Math.random() * M, py = Math.random() * N;
    var idx = (py | 0) * M + (px | 0);
    var d = dist[idx];
    if (!d || d === INF) continue;
    if (sulcos[idx * 4 + 3] > 100 && Math.random() < 0.82) continue;
    var casca = d < 3.2;
    if (!casca && Math.random() > 0.55) continue;
    var gord = Math.min(d, MAXD) / MAXD;
    P.push({
      x:px - M / 2, y:py - N / 2,
      z:(Math.random() * 2 - 1) * Math.pow(gord, 0.65) * 56,
      b:casca ? 1 : 0.55 + gord * 0.3,
      c:px / M,
      cint:Math.random() < 0.045,
      f:Math.random() * 6.283,
      faixa:(Math.random() * 2 - 1),
      destX:Math.random(),
      destY:Math.random()
    });
  }

  var POEIRA = [];
  for (i = 0; i < 80; i++) POEIRA.push({
    x:(Math.random()*2-1)*300, y:(Math.random()*2-1)*190, z:(Math.random()*2-1)*180,
    r:0.6 + Math.random()*1.3, f:Math.random()*6.283
  });

  var w = 0, h = 0, dpr = 1, escala = 1;
  function medir(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = cv.clientWidth; h = cv.clientHeight;
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    escala = Math.min(w / 620, h / 430) * 1.06;
  }
  medir();
  window.addEventListener('resize', medir);

  var mx = -9999, my = -9999, temMouse = false;
  var giroMao = 0, tiltMao = 0, arrastando = false, ultX = 0, ultY = 0;
  var palco = cv.parentNode;
  var transicao = false, transicaoInicio = 0, transicaoConcluida = false, ultimoToque = 0;

  function iniciarTransicao(e){
    if (transicao || (e && e.target && e.target.closest('button'))) return;
    transicao = true;
    transicaoInicio = performance.now();
    transicaoConcluida = false;
    arrastando = false;
    palco.classList.remove('girando');
    palco.classList.add('saindo');
  }

  document.addEventListener('pointermove', function(e){
    if (document.body.dataset.view !== 'inicio') return;
    var rect = cv.getBoundingClientRect();
    mx = e.clientX - rect.left;
    my = e.clientY - rect.top;
    temMouse = true;
    if (!arrastando) return;
    giroMao += (e.clientX - ultX) * 0.0045;
    tiltMao = Math.max(-0.55, Math.min(0.55, tiltMao + (e.clientY - ultY) * 0.0035));
    ultX = e.clientX;
    ultY = e.clientY;
  });
  if (palco){
    palco.addEventListener('pointerdown', function(e){
      if (e.target.closest('button')) return;
      arrastando = true;
      ultX = e.clientX; ultY = e.clientY;
      palco.classList.add('girando');
    });
    window.addEventListener('pointerup', function(){
      arrastando = false;
      palco.classList.remove('girando');
    });
    palco.addEventListener('dblclick', iniciarTransicao);
    palco.addEventListener('pointerup', function(e){
      if (e.pointerType !== 'touch' || e.target.closest('button')) return;
      var agora = performance.now();
      if (agora - ultimoToque < 360) iniciarTransicao(e);
      ultimoToque = agora;
    });
    palco.addEventListener('pointerleave', function(){
      temMouse = false;
      mx = -9999; my = -9999;
      arrastando = false;
      palco.classList.remove('girando');
    });
  }

  function cor(c, a){
    var r = Math.round(255 * (1 - c) + 165 * c);
    var g = Math.round(59 * (1 - c) + 51 * c);
    var b = Math.round(158 * (1 - c) + 231 * c);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  }

  var ang = -0.35, F = 560, tAnterior = 0;
  var VELOCIDADE_GIRO = 0.015;
  var TRANSICAO_MS = 1500;
  var RAIO = 92, RAIO2 = RAIO * RAIO, EMPURRA = 7, LEVANTA = 4;

  function quadro(t){
    requestAnimationFrame(quadro);
    if (document.body.dataset.view !== 'inicio') return;

    if (!tAnterior) tAnterior = t;
    var dt = Math.min((t - tAnterior) / 1000, 0.05);
    tAnterior = t;
    if (!arrastando && !transicao) ang = (ang + dt * VELOCIDADE_GIRO) % (Math.PI * 2);

    var cx = w / 2, cy = h * 0.46;
    var sa = Math.sin(ang + giroMao), ca = Math.cos(ang + giroMao);
    var st = Math.sin(tiltMao), ct = Math.cos(tiltMao);

    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';

    for (i = 0; i < POEIRA.length; i++){
      var q = POEIRA[i];
      var qx = q.x * ca - q.z * sa, qz = q.x * sa + q.z * ca;
      var qs = F / (F + qz * escala * 0.5);
      var qa = 0.09 + 0.09 * Math.sin(t / 900 + q.f);
      ctx.fillStyle = 'rgba(214,201,238,' + qa.toFixed(3) + ')';
      ctx.fillRect(cx + qx * escala * 0.5 * qs, cy + q.y * escala * 0.5 * qs, q.r, q.r);
    }

    for (i = 0; i < P.length; i++){
      var p = P[i];
      var rx = p.x * ca - p.z * sa;
      var rz0 = p.x * sa + p.z * ca;
      var ry = p.y * ct - rz0 * st;
      var rz = p.y * st + rz0 * ct;
      var s = F / (F + rz * escala);
      if (s <= 0) continue;
      var sx = cx + rx * escala * s;
      var sy = cy + ry * escala * s;
      var extra = 0, crescer = 1;

      if (transicao){
        var progresso = Math.min(1, Math.max(0, (t - transicaoInicio) / TRANSICAO_MS));
        var carga = Math.min(1, progresso / 0.26);
        var recolhe = Math.sin(carga * Math.PI) * 0.15;
        var disparoBase = Math.max(0, (progresso - 0.26) / 0.74);
        var disparo = 1 - Math.pow(1 - disparoBase, 3);

        var dxc = sx - cx, dyc = sy - cy;
        var raioAtual = Math.sqrt(dxc * dxc + dyc * dyc) || 0.001;
        var direcao = Math.atan2(dyc, dxc) + disparo * p.faixa * 0.45;
        var alcance = raioAtual * (1 - recolhe) + disparo * w * 0.6 * (0.45 + p.destX);
        var tremor = Math.sin(p.f * 3 + progresso * 15) * (1 - disparo) * 8;

        sx = cx + Math.cos(direcao) * alcance + tremor;
        sy = cy + Math.sin(direcao) * alcance * 0.84 + tremor * 0.4;
        var clarao = Math.sin(Math.min(1, progresso / 0.34) * Math.PI) * 0.95;
        extra = Math.max(clarao, disparo * 0.45);
        crescer = 1 + disparo * 0.8;
      }

      if (temMouse && !arrastando && !transicao){
        var dx = sx - mx, dy = sy - my;
        var d2 = dx * dx + dy * dy;
        if (d2 < RAIO2){
          var dd = Math.sqrt(d2) || 0.001;
          var forca = 1 - dd / RAIO;
          forca = forca * forca * (3 - 2 * forca);
          sx += (dx / dd) * forca * EMPURRA;
          sy += (dy / dd) * forca * EMPURRA - forca * LEVANTA;
          extra = forca;
        }
      }

      var prof = 0.42 + 0.58 * s;
      var a = p.b * prof * 1.05 + extra * 0.18;
      if (transicao){
        var apagar = Math.max(0, ((t - transicaoInicio) / TRANSICAO_MS - 0.72) / 0.28);
        a *= 1 - apagar;
      }
      if (p.cint) a *= 0.65 + 0.45 * Math.sin(t / 420 + p.f);
      var pr = ((p.cint ? 1.7 : 1.05) + extra * 0.28) * s * crescer;
      ctx.fillStyle = extra > 0.02
        ? 'rgba(255,' + Math.round(59 + extra * 70) + ',' + Math.round(158 + extra * 35) + ',' + Math.min(a, 1).toFixed(3) + ')'
        : cor(p.c, Math.min(a, 1).toFixed(3));
      if (p.cint || extra > 0.35){
        ctx.beginPath(); ctx.arc(sx, sy, pr, 0, 6.283); ctx.fill();
      } else {
        ctx.fillRect(sx, sy, pr, pr);
      }
    }
    ctx.globalCompositeOperation = 'source-over';

    if (transicao && !transicaoConcluida && t - transicaoInicio >= TRANSICAO_MS){
      transicaoConcluida = true;
      var veil = document.getElementById('pageTransition');
      if (veil) veil.classList.add('cover');
      setTimeout(function(){
        var primeiraPagina = document.querySelector('.tab[data-nav="neuro"]');
        if (primeiraPagina) primeiraPagina.click();
        transicao = false;
        palco.classList.remove('saindo');
        mx = -9999; my = -9999; temMouse = false;
        if (veil){
          veil.classList.add('reveal');
          setTimeout(function(){ veil.classList.remove('cover', 'reveal'); }, 760);
        }
      }, 220);
    }
  }
  requestAnimationFrame(quadro);
})();
