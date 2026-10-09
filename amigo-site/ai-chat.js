/* Traffic Ticket Amigo — World-class AI chat widget.
   CJ-style: floating bubble → right-docked panel → lead capture → AI chat.
   Stone/orange branding. No dependencies. */
(function () {
  'use strict';
  if (window.__uttAIChatBooted) return;
  window.__uttAIChatBooted = true;

  var BRAND = {
    orange: '#E8590C',
    orangeDark: '#C94A08',
    stone: '#1A1D24',
    stoneLight: '#242832'
  };

  /* ---------- Styles ---------- */
  var CSS = [
    '#uttAIBubble{position:fixed;right:22px;bottom:22px;z-index:2147483000;width:64px;height:64px;border-radius:50%;',
    'background:linear-gradient(135deg,#F08C00 0%,#E8590C 60%,#C94A08 100%);border:none;cursor:pointer;',
    'box-shadow:0 8px 28px rgba(232,89,12,.45),0 2px 8px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;',
    'transition:transform .25s cubic-bezier(.34,1.56,.64,1),box-shadow .25s;}',
    '#uttAIBubble.dragging{transition:none;cursor:grabbing;transform:scale(1.05);}#uttAIBubble{cursor:grab;touch-action:none;}#uttAIBubble:hover{transform:scale(1.08);box-shadow:0 12px 36px rgba(232,89,12,.55),0 2px 8px rgba(0,0,0,.3);}',
    '#uttAIBubble svg{width:30px;height:30px;fill:#fff;}',
    '#uttAIBubble .utt-ai-badge{position:absolute;top:-2px;right:-2px;min-width:22px;height:22px;border-radius:11px;background:#fff;',
    'color:#E8590C;font:700 12px/22px system-ui,sans-serif;text-align:center;padding:0 5px;box-shadow:0 2px 6px rgba(0,0,0,.3);}',
    '#uttAIPanel{position:fixed;top:0;right:0;bottom:0;width:400px;max-width:94vw;z-index:2147483001;background:#fff;',
    'display:flex;flex-direction:column;box-shadow:-12px 0 48px rgba(0,0,0,.25);',
    'transform:translateX(105%);transition:transform .38s cubic-bezier(.32,.72,.28,1);font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;}',
    '#uttAIPanel.open{transform:translateX(0);}',
    '.utt-chat-head{background:linear-gradient(135deg,#1A1D24 0%,#2A2E38 100%);color:#fff;padding:18px 20px;display:flex;align-items:center;gap:12px;flex-shrink:0;}',
    '.utt-chat-avatar{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#F08C00,#E8590C);',
    'display:flex;align-items:center;justify-content:center;flex-shrink:0;}',
    '.utt-chat-avatar svg{width:24px;height:24px;fill:#fff;}',
    '.utt-chat-title{flex:1;min-width:0;}',
    '.utt-chat-title strong{display:block;font-size:16px;font-weight:700;}',
    '.utt-chat-title small{display:block;font-size:12px;opacity:.75;margin-top:2px;}',
    '.utt-chat-status{display:inline-block;width:8px;height:8px;border-radius:50%;background:#51CF66;margin-right:5px;}',
    '.utt-chat-close{background:rgba(255,255,255,.12);border:none;color:#fff;width:36px;height:36px;border-radius:50%;',
    'cursor:pointer;font-size:18px;line-height:1;display:flex;align-items:center;justify-content:center;flex-shrink:0;}',
    '.utt-chat-close:hover{background:rgba(255,255,255,.22);}',
    '.utt-chat-body{flex:1;overflow-y:auto;padding:20px 16px;background:#F4F5F7;display:flex;flex-direction:column;gap:12px;}',
    '.utt-msg{max-width:82%;padding:12px 16px;border-radius:18px;font-size:14.5px;line-height:1.55;word-wrap:break-word;animation:uttMsgIn .3s ease;}',
    '@keyframes uttMsgIn{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}',
    '.utt-msg.bot{background:#fff;color:#1A1D24;border-bottom-left-radius:6px;align-self:flex-start;box-shadow:0 1px 3px rgba(0,0,0,.08);}',
    '.utt-msg.user{background:linear-gradient(135deg,#F08C00,#E8590C);color:#fff;border-bottom-right-radius:6px;align-self:flex-end;}',
    '.utt-msg.bot a{color:#E8590C;font-weight:600;}',
    '.utt-typing{align-self:flex-start;background:#fff;border-radius:18px;border-bottom-left-radius:6px;padding:14px 18px;box-shadow:0 1px 3px rgba(0,0,0,.08);display:flex;gap:5px;}',
    '.utt-typing span{width:8px;height:8px;border-radius:50%;background:#B0B5C0;animation:uttBlink 1.2s infinite;}',
    '.utt-typing span:nth-child(2){animation-delay:.2s;}.utt-typing span:nth-child(3){animation-delay:.4s;}',
    '@keyframes uttBlink{0%,60%,100%{opacity:.3;transform:scale(.85);}30%{opacity:1;transform:scale(1.1);}}',
    '.utt-quick{display:flex;flex-wrap:wrap;gap:8px;margin-top:4px;}',
    '.utt-quick button{background:#fff;border:1.5px solid #E8590C;color:#E8590C;border-radius:20px;padding:8px 16px;',
    'font-size:13px;font-weight:600;cursor:pointer;transition:all .2s;}',
    '.utt-quick button:hover{background:#E8590C;color:#fff;}',
    '.utt-lead{background:#fff;border-radius:16px;padding:24px 20px;box-shadow:0 2px 12px rgba(0,0,0,.08);}',
    '.utt-lead h3{margin:0 0 6px;font-size:17px;color:#1A1D24;}',
    '.utt-lead p{margin:0 0 16px;font-size:13.5px;color:#5A6270;line-height:1.5;}',
    '.utt-lead label{display:block;font-size:12.5px;font-weight:600;color:#3A4050;margin:12px 0 6px;}',
    '.utt-lead input{width:100%;box-sizing:border-box;border:1.5px solid #DDE1E8;border-radius:10px;padding:12px 14px;font-size:14.5px;outline:none;transition:border .2s;}',
    '.utt-lead input:focus{border-color:#E8590C;}',
    '.utt-lead .utt-start{width:100%;margin-top:18px;background:linear-gradient(135deg,#F08C00,#E8590C);color:#fff;border:none;',
    'border-radius:12px;padding:14px;font-size:15.5px;font-weight:700;cursor:pointer;transition:transform .15s,opacity .2s;}',
    '.utt-lead .utt-start:hover:not(:disabled){transform:translateY(-1px);}',
    '.utt-lead .utt-start:disabled{opacity:.45;cursor:not-allowed;}',
    '.utt-chat-foot{padding:14px 16px;background:#fff;border-top:1px solid #E8EAEE;display:flex;gap:10px;flex-shrink:0;}',
    '.utt-chat-foot input{flex:1;border:1.5px solid #DDE1E8;border-radius:24px;padding:12px 18px;font-size:14.5px;outline:none;}',
    '.utt-chat-foot input:focus{border-color:#E8590C;}',
    '.utt-chat-foot button{width:48px;height:48px;border-radius:50%;border:none;cursor:pointer;flex-shrink:0;',
    'background:linear-gradient(135deg,#F08C00,#E8590C);display:flex;align-items:center;justify-content:center;transition:transform .15s;}',
    '.utt-chat-foot button:hover{transform:scale(1.06);}',
    '.utt-chat-foot button svg{width:22px;height:22px;fill:#fff;}',
    '.utt-chat-foot button:disabled{opacity:.45;}',
    '@media(max-width:480px){#uttAIPanel{width:100vw;max-width:100vw;}#uttAIBubble{right:16px;bottom:16px;width:58px;height:58px;}}'
  ].join('\n');

  var CHAT_SVG = '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-9 9H7V9h4v2zm6 0h-4V9h4v2z"/></svg>';
  var SEND_SVG = '<svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>';
  var BOT_SVG = '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 11H7V9h2v2zm8 0h-2V9h2v2z"/></svg>';

  function el(tag, cls, html) {
    var d = document.createElement(tag);
    if (cls) d.className = cls;
    if (html) d.innerHTML = html;
    return d;
  }

  /* ---------- Knowledge base ---------- */
  var KB = [
    { k: ['precio', 'costo', 'cuánto', 'cuanto', 'tarifa', 'cargos', '$', 'cuesta', 'vale', 'price', 'cost', 'how much'], r: 'Nuestras tarifas son simples y sin sorpresas:<br>• <b>$199</b> — Defensa completa de tu multa de tráfico<br>• <b>$149</b> — Preparación de Declaración por Escrito (TR-205)<br>• <b>$99</b> — Multa adicional en un caso existente<br><br>Nunca hay cargos ocultos. ¿Quieres que inicie tu escaneo gratis?' },
    { k: ['cómo funciona', 'como funciona', 'proceso', 'pasos', 'qué pasa', 'que pasa', 'how it works'], r: 'Así funciona:<br><b>1.</b> Escanea tu multa gratis en línea<br><b>2.</b> Detectamos posibles fallas en tu citación<br><b>3.</b> Un abogado con licencia de California revisa tu defensa<br><b>4.</b> Preparamos y presentamos tu declaración TR-205<br><br>La mayoría de nuestros clientes nunca van a la corte.' },
    { k: ['escanea', 'escanear', 'scan', 'subir', 'foto', 'picture'], r: 'Puedes escanear tu multa ahora mismo — toma 60 segundos y es gratis. Te abro el escáner. <a href="/assistant">Iniciar escaneo gratis →</a>' },
    { k: ['velocidad', 'exceso de velocidad', 'speeding'], r: 'Peleamos multas por exceso de velocidad en todo el condado de Los Ángeles. Las defensas comunes incluyen problemas de calibración del radar/lidar, errores de medición y defectos en la citación. Escanea tu multa gratis y te diremos lo que encontramos.' },
    { k: ['semáforo', 'semaforo', 'luz roja', 'cámara', 'camara', 'red light'], r: 'Las multas de semáforo en rojo — incluyendo las de cámara — se pueden ganar. La evidencia de cámara tiene requisitos estrictos de autenticación en California. Déjanos revisar la tuya gratis.' },
    { k: ['celular', 'teléfono', 'telefono', 'textear', 'distraído', 'distraido', 'cell phone'], r: 'Las multas por usar el celular (VC 23123/23123.5) agregan un punto a tu récord. Hay defensas sólidas — uso con soporte, llamadas de emergencia, GPS. Vale la pena pelearla.' },
    { k: ['dui', 'borracho', 'alcohol'], r: 'Manejamos asuntos de tráfico relacionados con DUI, pero el DUI es penal — necesitas un abogado de defensa penal para el lado criminal. Podemos ayudar con los componentes del DMV/tráfico. Llámanos al <a href="tel:+14244506387">(424) 450-6387</a> para hablar.' },
    { k: ['corte', 'juzgado', 'tribunal', 'ir a la corte', 'court'], r: 'La mayoría de nuestros clientes <b>nunca van a la corte</b>. Peleamos por Declaración por Escrito (TR-205) — todo se hace por escrito. Si pierdes el juicio escrito, aún puedes pedir un nuevo juicio en persona.' },
    { k: ['declaración por escrito', 'declaracion por escrito', 'tr-205', 'por escrito', 'tbd'], r: 'La Declaración por Escrito (formulario TR-205) te permite pelear tu multa completamente por correo — sin sala de juzgado. Preparamos la declaración completa, un abogado con licencia la revisa, y la presentamos por ti. $149 por preparación, $199 por defensa completa.' },
    { k: ['abogado', 'bufete', 'firma legal', 'law firm', 'lawyer'], r: 'Somos un servicio de preparación de documentos — <b>no un bufete de abogados</b> — pero cada defensa es revisada por un abogado con licencia de California antes de presentarla. Obtienes revisión de nivel de abogado por una tarifa fija de $199.' },
    { k: ['van nuys', 'burbank', 'glendale', 'pasadena', 'long beach', 'cortes', 'juzgados'], r: 'Servimos todas las cortes del condado de Los Ángeles incluyendo Van Nuys, Burbank, Glendale, Pasadena y Long Beach. Nuestra oficina está en 7120 Hayvenhurst Ave Ste 320, Van Nuys.' },
    { k: ['no me presenté', 'no me presente', 'no fui a la corte', 'orden de arresto', 'warrant', 'fta', 'failure to appear'], r: 'No presentarse (VC 40508) puede suspender tu licencia. No te asustes — esto tiene solución. Llámanos ahora al <a href="tel:+14244506387">(424) 450-6387</a> y hoy mismo vemos tus opciones.' },
    { k: ['suspendida', 'suspendido', 'licencia suspendida', 'suspended'], r: 'Ayudamos con problemas de licencia suspendida relacionados con multas de tráfico. La solución depende de por qué se suspendió — llama al <a href="tel:+14244506387">(424) 450-6387</a> para una evaluación gratis.' },
    { k: ['cdl', 'comercial', 'camión', 'camion', 'trailero'], r: 'Los conductores con CDL no pueden darse el lujo de tener puntos — tu sustento depende de un récord limpio. Priorizamos las defensas de CDL. Empieza con un escaneo gratis.' },
    { k: ['seguro', 'seguro de auto', 'puntos', 'punto', 'dmv', 'insurance'], r: 'Una condena agrega un punto a tu récord del DMV y puede subir tu seguro 20-40% por 3 años. Pelear por $199 muchas veces sale más barato que pagar la multa.' },
    { k: ['escuela de tráfico', 'escuela de trafico', 'traffic school'], r: 'La escuela de tráfico oculta un punto pero solo puedes usarla una vez cada 18 meses, e igual pagas la multa completa. Pelear la multa puede lograr que la <b>desestimen por completo</b> — sin multa, sin punto, sin escuela.' },
    { k: ['reembolso', 'garantía', 'garantia', 'ganar', 'refund', 'guarantee'], r: 'No podemos garantizar resultados — ningún servicio honesto puede. Lo que sí garantizamos: un abogado con licencia revisa cada defensa, presentamos todo correctamente y a tiempo, y peleamos fuerte. Mira nuestra <a href="/refund-policy">política de reembolso</a>.' },
    { k: ['humano', 'persona', 'alguien', 'agente', 'hablar con', 'human', 'person'], r: 'Puedes comunicarte con nuestro equipo al <a href="tel:+14244506387">(424) 450-6387</a>, lun–vie 7:30 AM–7:30 PM, sáb 9:30 AM–2:30 PM. Toca el chat en vivo abajo o déjanos tu info aquí y te llamamos.' },
    { k: ['hola', 'buenos días', 'buenos dias', 'buenas tardes', 'buenas noches', 'hey', 'hello'], r: '¡Hola! Soy el asistente AI de Amigo. Puedo responder preguntas sobre cómo pelear multas de tráfico, precios y cómo funciona — o iniciar tu escaneo gratis. ¿En qué te ayudo?' },
    { k: ['gracias', 'thank'], r: '¡De nada! Si estás listo, inicia tu <a href="/assistant">escaneo gratis</a> — toma 60 segundos.' },
    { k: ['adiós', 'adios', 'chao', 'nos vemos', 'bye', 'goodbye'], r: '¡Suerte con tu multa! Recuerda — tienes una fecha límite para actuar, así que no esperes mucho. Aquí estamos cuando estés listo.' }
  ];

  function answer(q) {
    var s = q.toLowerCase();
    var best = null, bestScore = 0;
    for (var i = 0; i < KB.length; i++) {
      var score = 0;
      for (var j = 0; j < KB[i].k.length; j++) {
        if (s.indexOf(KB[i].k[j]) !== -1) score += KB[i].k[j].length;
      }
      if (score > bestScore) { bestScore = score; best = KB[i]; }
    }
    if (best) return best.r;
    return 'Buena pregunta. Puedo ayudar con precios, cómo funciona la defensa de multas, las cortes que servimos y tipos específicos de infracciones. También puedes <a href="/assistant">escanear tu multa gratis</a> para una revisión personalizada — o llamar al <a href="tel:+14244506387">(424) 450-6387</a>. ¿Qué te gustaría saber?';
  }

  var QUICK = ['Escanear mi multa 🎫', 'Precios 💰', 'Chat en vivo 💬', 'Email ✉️'];

  /* ---------- Build UI ---------- */
  function init() {
    var st = document.createElement('style');
    st.textContent = CSS;
    document.head.appendChild(st);

    // Floating bubble
    var bubble = el('button');
    bubble.id = 'uttAIBubble';
    bubble.setAttribute('aria-label', 'Chatea con el asistente AI de Amigo');
    bubble.innerHTML = CHAT_SVG + '<span class="utt-ai-badge" style="display:none">1</span>';
    document.body.appendChild(bubble);

    // Panel
    var panel = el('div');
    panel.id = 'uttAIPanel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Chat AI de Amigo');
    panel.innerHTML =
      '<div class="utt-chat-head">' +
        '<div class="utt-chat-avatar">' + BOT_SVG + '</div>' +
        '<div class="utt-chat-title"><strong>Asistente AI de Amigo</strong>' +
        '<small><span class="utt-chat-status"></span>En línea — responde al instante</small></div>' +
        '<button class="utt-chat-close" aria-label="Cerrar chat">✕</button>' +
      '</div>' +
      '<div class="utt-chat-body"></div>' +
      '<div class="utt-chat-foot">' +
        '<input type="text" placeholder="Pregunta sobre tu multa…" aria-label="Escribe tu mensaje" maxlength="500">' +
        '<button aria-label="Enviar mensaje">' + SEND_SVG + '</button>' +
      '</div>';
    document.body.appendChild(panel);

    var body = panel.querySelector('.utt-chat-body');
    var input = panel.querySelector('.utt-chat-foot input');
    var sendBtn = panel.querySelector('.utt-chat-foot button');
    var closeBtn = panel.querySelector('.utt-chat-close');
    var badge = bubble.querySelector('.utt-ai-badge');
    var opened = false, leadDone = false, lead = {};

    try { lead = JSON.parse(localStorage.getItem('uttChatLead') || '{}'); leadDone = !!(lead.name && lead.phone); } catch (e) {}

    function scrollDown() { body.scrollTop = body.scrollHeight; }

    function addMsg(text, who) {
      var m = el('div', 'utt-msg ' + who);
      m.innerHTML = text;
      body.appendChild(m);
      scrollDown();
      return m;
    }

    function showTyping() {
      var t = el('div', 'utt-typing');
      t.innerHTML = '<span></span><span></span><span></span>';
      body.appendChild(t);
      scrollDown();
      return t;
    }

    function botSay(text, quick) {
      var t = showTyping();
      setTimeout(function () {
        t.remove();
        addMsg(text, 'bot');
        if (quick) showQuick(quick);
      }, 700 + Math.random() * 600);
    }

    function showQuick(items) {
      var q = el('div', 'utt-quick');
      items.forEach(function (label) {
        var b = el('button', '', label);
        b.addEventListener('click', function () {
          q.remove();
          handleUser(label.replace(/[🎫💰💬✉️⚙️📞]/g, '').trim());
        });
        q.appendChild(b);
      });
      body.appendChild(q);
      scrollDown();
    }

    function showLeadForm() {
      var wrap = el('div', 'utt-lead');
      wrap.innerHTML =
        '<h3>Bienvenido al Chat AI de Amigo 👋</h3>' +
        '<p>Déjame tu nombre y número para dar seguimiento a tu multa. Luego chatea — respondo al instante.</p>' +
        '<label for="uttLeadName">Nombre</label>' +
        '<input id="uttLeadName" type="text" placeholder="Tu nombre" autocomplete="name">' +
        '<label for="uttLeadPhone">Teléfono</label>' +
        '<input id="uttLeadPhone" type="tel" placeholder="(818) 555-0123" autocomplete="tel">' +
        '<label class="utt-sms-consent" style="display:flex;gap:8px;align-items:flex-start;margin:10px 0;font-size:.85rem;font-weight:normal;cursor:pointer">' +
        '<input id="uttSmsConsent" type="checkbox" style="margin-top:3px">' +
        '<span>Sí, envíame mensajes sobre mi multa a este número. Pueden aplicar tarifas de mensajes y datos. Responde STOP para no recibir más, HELP para ayuda. El consentimiento no es condición de compra.</span></label>' +
        '<button class="utt-start" disabled>Comenzar el chat →</button>';
      body.appendChild(wrap);
      scrollDown();

      var nameI = wrap.querySelector('#uttLeadName');
      var phoneI = wrap.querySelector('#uttLeadPhone');
      var startB = wrap.querySelector('.utt-start');

      function check() {
        var ok = nameI.value.trim().length >= 2 && phoneI.value.replace(/\D/g, '').length >= 10;
        startB.disabled = !ok;
      }
      nameI.addEventListener('input', check);
      phoneI.addEventListener('input', check);

      startB.addEventListener('click', function () {
        var smsC = wrap.querySelector('#uttSmsConsent');
        lead = { name: nameI.value.trim(), phone: phoneI.value.trim(), smsConsent: !!(smsC && smsC.checked), ts: new Date().toISOString() };
        try { localStorage.setItem('uttChatLead', JSON.stringify(lead)); } catch (e) {}
        // Fire lead to backend (best-effort)
        try {
          fetch('/api/chat-lead', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(lead), keepalive: true
          }).catch(function () {});
        } catch (e) {}
        try {
          if (window.gtag) {
            window.gtag('event', 'generate_lead', { event_category: 'AI Chat', value: 1 });
            // TODO: Traffic Ticket Amigo Google Ads ID — add real AW ID when ready
            ['AW-AMIGO_ACCOUNT_ID'].forEach(function (id) {
              try { window.gtag('event', 'conversion', { send_to: id + '/chat_lead' }); } catch (e2) {}
            });
          }
        } catch (e) {}
        leadDone = true;
        wrap.remove();
        botSay('¡Mucho gusto, ' + lead.name.split(' ')[0] + '! Soy tu asistente AI de Amigo. Pregúntame lo que sea sobre pelear tu multa — precios, cómo funciona, tu corte — o toca abajo para escanear tu multa gratis.', QUICK);
      });

      setTimeout(function () { nameI.focus(); }, 400);
    }

    function requestLiveChat() {
      var t = showTyping();
      setTimeout(function () {
        t.remove();
        addMsg('Te estoy conectando con nuestro equipo… espera un momento.', 'bot');
        var payload = { name: (lead&&lead.name)||"", phone: (lead&&lead.phone)||"", page: location.href, ts: new Date().toISOString(), type: "live_chat_request" };
        try { fetch("/api/live-chat-request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), keepalive: true }).catch(function(){}); } catch(e) {}
        try { if (window.gtag) window.gtag("event", "live_chat_request", { event_category: "AI Chat" }); } catch(e2) {}
        var t2 = showTyping();
        setTimeout(function(){ t2.remove(); addMsg('Tu solicitud fue enviada. Mientras tanto, <a href="/assistant">escanea tu multa gratis</a> para ayudarnos a ayudarte más rápido.', 'bot'); }, 2500);
      }, 800);
    }

    function handleUser(text) {
      if (!text.trim()) return;
      addMsg(text.replace(/</g, '&lt;'), 'user');
      input.value = '';
      var t = showTyping();
      setTimeout(function () {
        t.remove();
        var low = text.toLowerCase();
        if (/live chat|chat en vivo/.test(low)) {
          requestLiveChat();
        } else if (/email|correo/.test(low)) {
          addMsg('Escríbenos a <a href="mailto:help@trafficticketamigo.com"><b>help@trafficticketamigo.com</b></a> — respondemos en un día hábil.', 'bot');
        } else if (/scan|escanea|escanear/.test(low)) {
          addMsg('Abriendo el escáner gratis para ti… <a href="/assistant"><b>Toca aquí para escanear →</b></a>', 'bot');
        } else {
          addMsg(answer(text), 'bot');
        }
      }, 650 + Math.random() * 550);
    }

    sendBtn.addEventListener('click', function () { handleUser(input.value); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') handleUser(input.value);
    });

    function open() {
      panel.classList.add('open');
      badge.style.display = 'none';
      opened = true;
      if (!body.children.length) {
        if (leadDone) {
          botSay('¡Bienvenido de nuevo, ' + (lead.name || 'amigo').split(' ')[0] + '! ¿En qué te ayudo hoy?', QUICK);
        } else {
          showLeadForm();
        }
      }
      setTimeout(function () { input.focus(); }, 420);
    }
    function close() { panel.classList.remove('open'); opened = false; }

    // Draggable bubble (like CJ's)
    (function makeDraggable(elm) {
      var pos = null;
      try { pos = JSON.parse(localStorage.getItem('uttChatBubblePos') || 'null'); } catch (e) {}
      if (pos && typeof pos.x === 'number' && typeof pos.y === 'number') {
        elm.style.left = pos.x + 'px'; elm.style.top = pos.y + 'px';
        elm.style.right = 'auto'; elm.style.bottom = 'auto';
      }
      var sx, sy, ox, oy, moved;
      function onStart(e) {
        var t = e.touches ? e.touches[0] : e;
        sx = t.clientX; sy = t.clientY;
        var r = elm.getBoundingClientRect();
        ox = r.left; oy = r.top; moved = false;
        elm.classList.add('dragging');
        e.preventDefault();
      }
      function onMove(e) {
        if (sx === undefined) return;
        var t = e.touches ? e.touches[0] : e;
        var dx = t.clientX - sx, dy = t.clientY - sy;
        if (Math.abs(dx) > 6 || Math.abs(dy) > 6) moved = true;
        if (!moved) return;
        var nx = Math.max(8, Math.min(window.innerWidth - 72, ox + dx));
        var ny = Math.max(8, Math.min(window.innerHeight - 72, oy + dy));
        elm.style.left = nx + 'px'; elm.style.top = ny + 'px';
        elm.style.right = 'auto'; elm.style.bottom = 'auto';
      }
      function onEnd() {
        if (sx === undefined) return;
        elm.classList.remove('dragging');
        // Snap to nearest edge
        var r = elm.getBoundingClientRect();
        var cx = r.left + r.width / 2;
        var nx = cx < window.innerWidth / 2 ? 16 : window.innerWidth - r.width - 16;
        elm.style.left = nx + 'px';
        try { localStorage.setItem('uttChatBubblePos', JSON.stringify({ x: nx, y: r.top })); } catch (e) {}
        var wasMoved = moved;
        sx = undefined;
        // Suppress click if it was a drag
        if (wasMoved) { elm.__uttDragged = true; setTimeout(function(){ elm.__uttDragged = false; }, 50); }
      }
      elm.addEventListener('mousedown', onStart);
      elm.addEventListener('touchstart', onStart, { passive: false });
      document.addEventListener('mousemove', onMove);
      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('mouseup', onEnd);
      document.addEventListener('touchend', onEnd);
    })(bubble);

    bubble.addEventListener('click', function () { if (bubble.__uttDragged) return; opened ? close() : open(); });
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && opened) close(); });

    // Proactive nudge after 25s (once per session)
    setTimeout(function () {
      if (!opened && !sessionStorage.getItem('uttChatNudged')) {
        try { sessionStorage.setItem('uttChatNudged', '1'); } catch (e) {}
        badge.textContent = '1';
        badge.style.display = 'block';
        bubble.style.animation = 'uttMsgIn .4s ease';
      }
    }, 25000);
  }

  function boot() {
    if ('requestIdleCallback' in window) requestIdleCallback(init, { timeout: 3000 });
    else setTimeout(init, 1);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
