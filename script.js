(function(){
  "use strict";

  /* ---------- Navigation ---------- */
  var tabs = document.querySelectorAll('[data-nav]');
  var views = document.querySelectorAll('.view');
  function goTo(name){
    views.forEach(function(v){ v.classList.toggle('active', v.id === 'view-' + name); });
    document.querySelectorAll('.tab[data-nav]').forEach(function(t){ t.classList.toggle('active', t.dataset.nav === name); });
    document.body.dataset.view = name;
    window.scrollTo({ top: 0, behavior: 'auto' });
    closeAuth();
    closeTooltip();
  }
  document.body.dataset.view = 'inicio';
  tabs.forEach(function(t){ t.addEventListener('click', function(){ goTo(t.dataset.nav); }); });
  document.querySelectorAll('.tab.soon').forEach(function(t){
    t.addEventListener('click', function(){ showToast(t.dataset.soon + ' — em breve neste protótipo.'); });
  });

  /* ---------- Toast ---------- */
  var toastEl = document.getElementById('toast');
  var toastTimer;
  function showToast(msg){
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ toastEl.classList.remove('show'); }, 2600);
  }

  /* ---------- Auth overlay ---------- */
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

  /* ---------- Synapse diagram tooltip ---------- */
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
  document.querySelectorAll('[data-key]').forEach(function(el){
    el.addEventListener('click', function(e){
      var t = TIPS[el.dataset.key];
      tooltipTitle.textContent = t[0];
      tooltipBody.textContent = t[1];
      tooltip.classList.add('open');
      popoverBackdrop.classList.add('open');
      e.stopPropagation();
    });
  });
  document.getElementById('tooltipClose').addEventListener('click', closeTooltip);
  popoverBackdrop.addEventListener('click', closeTooltip);
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape'){ closeAuth(); closeTooltip(); } });

  /* ---------- Modelo molecular ---------- */
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
    // benzene ring (catechol) + amine chain
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
    s += '<path d="M56,58 L82,74 L82,106 L56,122 L30,106 L30,74 Z" />'; // benzene
    s += '<path d="M60,64 L78,76 M78,102 L60,114 M34,78 L34,102" stroke-width="2" opacity=".55" />';
    s += '<path d="M82,90 L112,80 L128,96 L112,112 Z" />'; // pyrrole (approx pentagon-ish)
    s += '<path d="M56,122 L56,140" />';
    s += label(44,150,'OH');
    s += label(120,120,'N'); s += label(126,132,'H','#f6eef8');
    s += '<path d="M128,96 L150,86 L168,64 L188,44" />';
    s += label(190,40,'NH₂');
    return svgWrap(s);
  }
  function chainSvg(opts){
    var s = '';
    // zigzag backbone
    var pts = opts.branch
      ? [[24,120],[50,96],[76,120],[102,96],[128,120],[154,96]]
      : [[30,120],[64,96],[98,120],[132,96],[166,120]];
    var d = 'M' + pts.map(function(p){ return p[0]+','+p[1]; }).join(' L');
    s += '<path d="'+d+'" />';
    // acid end (first point): =O and OH
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
    s += '<path d="M40,80 L40,56 M40,80 L18,68 M40,80 L18,92" />'; // N with 3 methyl stubs
    s += label(30,44,'N⁺');
    s += '<path d="M40,80 L64,96 L88,80 L112,96" />'; // chain to ester O
    s += label(106,72,'O');
    s += '<path d="M112,96 L136,80" />'; // carbonyl C
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
