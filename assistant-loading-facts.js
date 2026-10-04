/* assistant-loading-facts.js
 * Drop-in entertainment overlay for the Traffic Ticket Amigo AI scanner.
 * While a ticket scan is running, shows an animated overlay with rotating
 * California traffic-law facts so the wait feels short.
 *
 * Install: include AFTER assistant.js on the /assistant page:
 *   <script src="/assistant-loading-facts.js?v=20260930-1" defer></script>
 * No changes to assistant.js needed. Works with assistant-upgrades.js too.
 */
(function () {
  'use strict';
  if (window.__uttLoadingFactsInstalled) return;
  window.__uttLoadingFactsInstalled = true;

  /* ---------------- Traffic-law facts (California) ---------------- */
  var FACTS = [
    "En California puedes pelear la mayoría de las multas POR CORREO con una Declaración por Escrito — sin ir a la corte.",
    "Una condena por exceso de velocidad puede quedarse en tu récord de manejo de California por años — y las aseguradoras suelen subir las tarifas después de una infracción en movimiento.",
    "El Código Vehicular 22350 — la 'ley básica de velocidad' — es una de las infracciones de velocidad más citadas en California.",
    "Las multas de cámara de semáforo generalmente requieren identificar al conductor — las fotos poco claras a veces se pueden impugnar.",
    "La escuela de tráfico puede mantener una multa fuera de tu récord público — típicamente una vez cada 18 meses.",
    "Una multa de 'arréglalo' muchas veces se puede desestimar por una tarifa pequeña una vez que corriges el problema y lo firmas.",
    "California tiene más de 400 secciones del código vehicular por las que te pueden multar. Sí, en serio.",
    "Si el oficial que te multó no se presenta al juicio en persona, los jueces suelen desestimar el caso — por eso importan las fechas límite.",
    "Faltar a tu fecha de corte puede agregar penalidades por no presentarse además de la multa original.",
    "Las lecturas del radar se pueden impugnar: los registros de calibración, el entrenamiento del oficial y las condiciones del tráfico importan.",
    "La Declaración por Escrito te permite contar tu versión por escrito — y si pierdes, usualmente puedes pedir un nuevo juicio en persona.",
    "Los puntos en tu licencia pueden causar una suspensión por conductor negligente. Cada punto cuenta."
  ];

  var STEPS = [
    "Subiendo tu multa de forma segura…",
    "Leyendo la letra pequeña…",
    "Extrayendo los detalles de la infracción…",
    "Verificando la info de la corte…",
    "Casi listo — puliendo los resultados…"
  ];

  /* ---------------- Styles ---------------- */
  var css = [
    ".utt-loadveil{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;",
    "background:rgba(10,14,26,.82);backdrop-filter:blur(6px);opacity:0;pointer-events:none;transition:opacity .35s ease;}",
    ".utt-loadveil.on{opacity:1;pointer-events:auto;}",
    ".utt-loadcard{max-width:520px;width:calc(100% - 48px);background:#101828;border:1px solid #2a3a5c;border-radius:20px;",
    "padding:36px 32px 30px;text-align:center;color:#eef2ff;box-shadow:0 24px 80px rgba(0,0,0,.55);",
    "transform:translateY(14px) scale(.97);transition:transform .35s cubic-bezier(.2,.9,.25,1.2);}",
    ".utt-loadveil.on .utt-loadcard{transform:translateY(0) scale(1);}",
    /* animated road + car */
    ".utt-road{position:relative;height:74px;margin:6px 0 4px;overflow:hidden;border-radius:12px;background:#0b1222;}",
    ".utt-road::before{content:'';position:absolute;left:0;right:0;top:35px;height:4px;",
    "background:repeating-linear-gradient(90deg,#ffd23f 0 26px,transparent 26px 52px);animation:utt-dash 0.7s linear infinite;}",
    "@keyframes utt-dash{to{background-position:-52px 0;}}",
    ".utt-car{position:absolute;top:14px;left:8px;font-size:38px;animation:utt-drive 2.6s ease-in-out infinite;filter:drop-shadow(0 6px 8px rgba(0,0,0,.5));}",
    "@keyframes utt-drive{0%,100%{transform:translateX(0) rotate(-2deg);}50%{transform:translateX(calc(100% + 240px)) rotate(2deg);}}",
    /* spinner ring */
    ".utt-ring{width:54px;height:54px;margin:14px auto 6px;border-radius:50%;",
    "border:5px solid rgba(255,255,255,.14);border-top-color:#ffd23f;animation:utt-spin 0.9s linear infinite;}",
    "@keyframes utt-spin{to{transform:rotate(360deg);}}",
    ".utt-step{font-size:16px;font-weight:600;color:#ffd23f;min-height:24px;margin:8px 0 2px;}",
    ".utt-dots{display:inline-block;}",
    ".utt-dots i{display:inline-block;width:7px;height:7px;margin:0 3px;border-radius:50%;background:#8ea2ff;animation:utt-bounce 1.2s infinite;}",
    ".utt-dots i:nth-child(2){animation-delay:.15s;}.utt-dots i:nth-child(3){animation-delay:.3s;}",
    "@keyframes utt-bounce{0%,60%,100%{transform:translateY(0);opacity:.5;}30%{transform:translateY(-9px);opacity:1;}}",
    /* fact card */
    ".utt-fact{margin:18px 0 4px;padding:16px 18px;background:#16213a;border:1px dashed #3b517c;border-radius:14px;",
    "font-size:15px;line-height:1.55;color:#dbe4ff;min-height:96px;display:flex;align-items:center;justify-content:center;}",
    ".utt-fact b{color:#ffd23f;}",
    ".utt-factlabel{font-size:11px;letter-spacing:2.5px;text-transform:uppercase;color:#8ea2ff;margin-top:14px;}",
    ".utt-factnum{font-size:12px;color:#5f739e;margin-top:8px;}",
    ".utt-bar{height:6px;background:#1c2947;border-radius:99px;margin-top:16px;overflow:hidden;}",
    ".utt-bar>div{height:100%;width:30%;border-radius:99px;background:linear-gradient(90deg,#ffd23f,#ff9d3f);",
    "animation:utt-slide 1.6s ease-in-out infinite;}",
    "@keyframes utt-slide{0%{margin-left:-30%;}100%{margin-left:100%;}}",
    ".utt-note{font-size:12.5px;color:#8ea2ff;margin-top:14px;}",
    "@media (prefers-reduced-motion: reduce){",
    ".utt-road::before,.utt-car,.utt-ring,.utt-dots i,.utt-bar>div{animation:none !important;}",
    ".utt-loadcard{transition:none;}}",
    "@media (max-width:480px){.utt-loadcard{padding:26px 20px;}.utt-fact{font-size:14px;min-height:110px;}}"
  ].join("\n");

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------------- DOM ---------------- */
  var veil = document.createElement('div');
  veil.className = 'utt-loadveil';
  veil.setAttribute('role', 'status');
  veil.setAttribute('aria-live', 'polite');
  veil.innerHTML =
    '<div class="utt-loadcard">' +
      '<div class="utt-road"><div class="utt-car">🚗</div></div>' +
      '<div class="utt-ring"></div>' +
      '<div class="utt-step" id="uttStep">Subiendo tu multa de forma segura…</div>' +
      '<div class="utt-dots"><i></i><i></i><i></i></div>' +
      '<div class="utt-factlabel">⚖️ ¿Sabías que?</div>' +
      '<div class="utt-fact" id="uttFact"></div>' +
      '<div class="utt-factnum" id="uttFactNum"></div>' +
      '<div class="utt-bar"><div></div></div>' +
      '<div class="utt-note">Tu documento es privado — cifrado en tránsito, nunca compartido.</div>' +
    '</div>';
  document.body.appendChild(veil);

  var factEl = veil.querySelector('#uttFact');
  var factNumEl = veil.querySelector('#uttFactNum');
  var stepEl = veil.querySelector('#uttStep');

  var factTimer = null, stepTimer = null, safetyTimer = null, factIdx = 0, stepIdx = 0;

  function showFact(i) {
    factEl.innerHTML = '<span>' + FACTS[i % FACTS.length] + '</span>';
    factNumEl.textContent = 'Dato ' + ((i % FACTS.length) + 1) + ' de ' + FACTS.length;
  }

  function show() {
    factIdx = Math.floor(Math.random() * FACTS.length);
    stepIdx = 0;
    showFact(factIdx);
    stepEl.textContent = STEPS[0];
    veil.classList.add('on');
    document.body.style.overflow = 'hidden';
    clearInterval(factTimer); clearInterval(stepTimer); clearTimeout(safetyTimer);
    factTimer = setInterval(function () { factIdx++; showFact(factIdx); }, 4500);
    stepTimer = setInterval(function () {
      stepIdx = Math.min(stepIdx + 1, STEPS.length - 1);
      stepEl.textContent = STEPS[stepIdx];
    }, 3200);
    // Safety: never trap the user behind the veil (resets on every open).
    safetyTimer = setTimeout(hide, 90000);
  }

  function hide() {
    veil.classList.remove('on');
    document.body.style.overflow = '';
    clearInterval(factTimer); clearInterval(stepTimer); clearTimeout(safetyTimer);
  }

  /* ---------------- Hook into the scanner ----------------
   * The scan button (astScan) is disabled while a scan runs and
   * re-enabled in the finally block. Watch that + the status text.
   */
  function scanBtn() { return document.getElementById('astScan'); }
  function statusEl() { return document.getElementById('astStatus'); }

  var wasDisabled = false;
  function check() {
    var btn = scanBtn();
    if (!btn) return;
    var disabled = !!btn.disabled;
    if (disabled && !wasDisabled) {
      var st = statusEl();
      var txt = st ? (st.textContent || '') : '';
      if (/scan|upload|extract|reading/i.test(txt) || txt === '') show();
    } else if (!disabled && wasDisabled) {
      hide();
    }
    wasDisabled = disabled;
  }

  // Poll (cheap) + MutationObserver for snappy show/hide.
  setInterval(check, 300);
  var obs = new MutationObserver(check);
  obs.observe(document.documentElement, { subtree: true, attributes: true, attributeFilter: ['disabled', 'class'] });

  // Clicking the backdrop dismisses the veil as a fallback.
  veil.addEventListener('click', function (e) {
    if (e.target === veil) hide();
  });

  // Expose for debugging / manual control.
  window.__uttLoadingFacts = { show: show, hide: hide };
})();
