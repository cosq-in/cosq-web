// CosQ Builds: scroll XP bar, phone menu, hero runner game, mesh simulation.
(() => {
  const MOBILE = 700; // the design switches layouts below this width
  const isMobile = () => window.innerWidth < MOBILE;
  const rnd = Math.random;

  // ---------- Scroll XP bar ----------
  const xpFill = document.getElementById("xp");
  const onScroll = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    xpFill.style.width = (h > 0 ? Math.round(window.scrollY / h * 100) : 0) + "%";
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---------- Phone menu ----------
  const nav = document.getElementById("nav");
  const burger = document.getElementById("burger");
  let menuOpen = false;
  const setMenu = open => {
    menuOpen = open;
    const shown = open && isMobile();
    nav.classList.toggle("open", shown);
    burger.setAttribute("aria-expanded", String(shown));
    document.body.classList.toggle("menu-open", shown);
  };
  burger.addEventListener("click", () => setMenu(!menuOpen));
  document.querySelectorAll("#menu a").forEach(a => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", e => { if (e.key === "Escape" && menuOpen) setMenu(false); });

  // ---------- Hero runner ----------
  const WORDS = ["WEBSITES", "APPS", "ML + AI", "AUTOMATION"];
  const cv = document.getElementById("game");
  const ctx = cv.getContext("2d");
  const scoreEl = document.getElementById("score");
  const wonEl = document.getElementById("won");
  const slotEls = [...document.querySelectorAll("#slots div")];
  const img = new Image();
  img.src = "/icon.png";

  const g = { W: 0, H: 0, gy: 0, S: 4, t: 0, speed: 1.7, score: 0, bugs: [], blocks: [], parts: [], pops: [], next: 60, hit: 0, shake: 0, got: [false, false, false, false], p: { x: 0, y: 0, vy: 0, jumps: 0 } };
  let wonTimer = 0;

  // The canvas draws at 1/S of CSS pixels and is scaled up for chunky pixels.
  const size = () => {
    g.S = isMobile() ? 3 : 4;
    const w = cv.clientWidth, h = cv.clientHeight;
    g.W = Math.ceil(w / g.S);
    g.H = Math.ceil(h / g.S);
    cv.width = g.W;
    cv.height = g.H;
    g.gy = g.H - 24;
    g.p.x = Math.floor(g.W * 0.2);
    if (g.p.y === 0 || g.p.y > g.gy - 20) g.p.y = g.gy - 20;
    g.bugs = [];
    g.blocks = [];
  };

  const renderHud = () => {
    scoreEl.textContent = String(g.score).padStart(4, "0");
    slotEls.forEach((el, i) => el.classList.toggle("on", g.got[i]));
  };

  const burst = (x, y, cols, n) => {
    for (let i = 0; i < n; i++) g.parts.push({ x, y, vx: (rnd() - 0.5) * 3.4, vy: -rnd() * 2.8 - 0.5, l: 22 + rnd() * 14, c: cols[i % cols.length] });
  };

  const jump = () => {
    const p = g.p;
    if (p.jumps >= 2) return;
    p.vy = p.jumps === 0 ? -4.9 : -4.2;
    p.jumps++;
    for (let i = 0; i < 5; i++) g.parts.push({ x: p.x + 10, y: p.y + 20, vx: (rnd() - 0.5) * 2, vy: rnd() * 0.8, l: 16, c: "#fff" });
  };

  cv.addEventListener("click", jump);
  window.addEventListener("keydown", e => {
    if (["Space", "ArrowUp", "KeyW"].includes(e.code) && window.scrollY < cv.clientHeight * 0.6 && !menuOpen) {
      e.preventDefault();
      jump();
    }
  });

  const hill = (x, amp, f, off) => Math.round((Math.sin((x + off) * f) * 0.5 + 0.5) * amp / 3) * 3;
  const clouds = [[20, 40, 16], [90, 70, 22], [150, 30, 14], [220, 60, 18]];
  let last = performance.now();
  let shownScore = 0;

  const loop = () => {
    const now = performance.now();
    const dt = Math.min(2.5, (now - last) / 16.67);
    last = now;
    const { W, H, gy, p } = g;
    if (!W) return;

    g.t += dt;
    g.speed = Math.min(2.8, 1.7 + g.score / 400);
    const sp = g.speed * dt;
    p.vy += 0.28 * dt;
    p.y += p.vy * dt;
    if (p.y >= gy - 20) { p.y = gy - 20; p.vy = 0; p.jumps = 0; }
    if (g.hit > 0) g.hit -= dt;
    if (g.shake > 0) g.shake -= dt;

    // Spawn: a "?" block for a service not yet collected, otherwise a bug
    g.next -= dt;
    if (g.next <= 0) {
      g.next = 70 + rnd() * 70;
      const need = [0, 1, 2, 3].filter(i => !g.got[i] && !g.blocks.some(b => b.i === i));
      if (rnd() < 0.45 && need.length) g.blocks.push({ x: W + 10, y: gy - (g.S === 3 ? 26 + rnd() * 14 : 30 + rnd() * 24), i: need[Math.floor(rnd() * need.length)] });
      else g.bugs.push({ x: W + 10, y: gy - 11, w: 14, h: 11 });
    }
    g.bugs.forEach(b => { b.x -= sp; });
    g.blocks.forEach(b => { b.x -= sp; });
    g.bugs = g.bugs.filter(b => b.x > -20);
    g.blocks = g.blocks.filter(b => b.x > -20);

    const pr = { l: p.x + 3, r: p.x + 17, t: p.y + 2, b: p.y + 20 };
    g.bugs = g.bugs.filter(b => {
      if (pr.r > b.x && pr.l < b.x + b.w && pr.b > b.y && pr.t < b.y + b.h) {
        // Landing on top stomps the bug; running into it costs XP
        if (p.vy > 0 && pr.b - b.y < 9) {
          p.vy = -3.6; p.jumps = 1; g.score += 10;
          burst(b.x + 7, b.y + 4, ["#6a1b8f", "#e94fa8", "#fff"], 10);
          g.pops.push({ x: b.x, y: b.y - 6, t: "+10", l: 40 });
          return false;
        }
        if (g.hit <= 0) { g.hit = 50; g.shake = 10; g.score = Math.max(0, g.score - 5); burst(p.x + 10, p.y + 10, ["#e94fa8", "#fff"], 8); }
      }
      return true;
    });
    g.blocks = g.blocks.filter(b => {
      if (pr.r > b.x && pr.l < b.x + 14 && pr.b > b.y && pr.t < b.y + 14) {
        g.got[b.i] = true; g.score += 25;
        burst(b.x + 7, b.y + 7, ["#ff8ff6", "#fff", "#e94fa8"], 14);
        g.pops.push({ x: b.x - 10, y: b.y - 6, t: WORDS[b.i], l: 60 });
        if (g.got.every(Boolean)) {
          wonEl.hidden = false;
          clearTimeout(wonTimer);
          wonTimer = setTimeout(() => { g.got = [false, false, false, false]; wonEl.hidden = true; renderHud(); }, 4500);
        }
        renderHud();
        return false;
      }
      return true;
    });
    g.parts.forEach(q => { q.x += q.vx * dt; q.y += q.vy * dt; q.vy += 0.16 * dt; q.l -= dt; });
    g.parts = g.parts.filter(q => q.l > 0);
    g.pops.forEach(q => { q.y -= 0.4 * dt; q.l -= dt; });
    g.pops = g.pops.filter(q => q.l > 0);

    // Draw
    ctx.save();
    if (g.shake > 0) ctx.translate(Math.round((rnd() - 0.5) * 3), 0);
    ctx.fillStyle = "#fff0fa"; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#ffe3f5"; ctx.fillRect(0, H * 0.4, W, H);
    ctx.fillStyle = "#ffd3ed"; ctx.fillRect(0, H * 0.7, W, H);
    ctx.fillStyle = "#ff8ff6"; ctx.fillRect(W - 40, 20, 18, 18);
    ctx.fillStyle = "#ffb8ee"; ctx.fillRect(W - 44, 24, 26, 10); ctx.fillRect(W - 36, 16, 10, 26);
    const o1 = g.t * 0.2, o2 = g.t * 0.5;
    ctx.fillStyle = "#ffc3ea"; for (let x = 0; x < W; x += 3) { const h = 14 + hill(x, 40, 0.035, o1); ctx.fillRect(x, gy - h, 3, h); }
    ctx.fillStyle = "#ee9fd6"; for (let x = 0; x < W; x += 3) { const h = 6 + hill(x, 22, 0.06, o2 + 90); ctx.fillRect(x, gy - h, 3, h); }
    clouds.forEach(c => {
      c[0] -= 0.1 * dt;
      if (c[0] < -c[2] * 2) c[0] = W + 20;
      const x = Math.round(c[0]), y = c[1];
      ctx.fillStyle = "#fff"; ctx.fillRect(x, y, c[2] * 2, 6); ctx.fillRect(x + 5, y - 5, c[2], 5);
      ctx.fillStyle = "#f3d6ec"; ctx.fillRect(x, y + 6, c[2] * 2, 2);
    });
    ctx.fillStyle = "#e94fa8"; ctx.fillRect(0, gy, W, 4);
    ctx.fillStyle = "#ff8ff6"; ctx.fillRect(0, gy, W, 1);
    ctx.fillStyle = "#6a1b8f"; ctx.fillRect(0, gy + 4, W, 8);
    ctx.fillStyle = "#1a0630"; ctx.fillRect(0, gy + 12, W, H);
    const off = Math.floor(g.t * g.speed) % 12;
    ctx.fillStyle = "#4a1268"; for (let x = -off; x < W; x += 12) { ctx.fillRect(x, gy + 6, 6, 2); ctx.fillRect(x + 6, gy + 16, 6, 2); }
    g.bugs.forEach(b => {
      const x = Math.round(b.x), y = b.y, f = Math.floor(g.t / 8) % 2;
      ctx.fillStyle = "#1a0630"; ctx.fillRect(x + 1, y, 12, 9); ctx.fillRect(x, y + 2, 14, 6);
      ctx.fillStyle = "#6a1b8f"; ctx.fillRect(x + 2, y + 1, 10, 7);
      ctx.fillStyle = "#ff8ff6"; ctx.fillRect(x + 3, y + 2, 3, 3); ctx.fillRect(x + 8, y + 2, 3, 3);
      ctx.fillStyle = "#1a0630"; ctx.fillRect(x + (f ? 1 : 2), y + 9, 3, 2); ctx.fillRect(x + (f ? 10 : 9), y + 9, 3, 2); ctx.fillRect(x + 4, y - 2, 1, 2); ctx.fillRect(x + 9, y - 2, 1, 2);
    });
    g.blocks.forEach(b => {
      const x = Math.round(b.x), y = Math.round(b.y + Math.sin(g.t * 0.1 + b.i) * 2);
      ctx.fillStyle = "#1a0630"; ctx.fillRect(x - 1, y - 1, 16, 16);
      ctx.fillStyle = "#e94fa8"; ctx.fillRect(x, y, 14, 14);
      ctx.fillStyle = "#ff8ff6"; ctx.fillRect(x, y, 14, 2); ctx.fillRect(x, y, 2, 14);
      ctx.fillStyle = "#a82f78"; ctx.fillRect(x + 12, y, 2, 14); ctx.fillRect(x, y + 12, 14, 2);
      ctx.fillStyle = "#fff"; ctx.font = "9px 'Press Start 2P',monospace"; ctx.textBaseline = "top"; ctx.fillText("?", x + 4, y + 3);
    });
    if (g.hit <= 0 || Math.floor(g.t / 3) % 2) {
      ctx.fillStyle = "rgba(26,6,48,.25)"; ctx.fillRect(p.x + 3, gy - 2, 14, 2);
      const sq = p.vy < -1 ? 1 : 0;
      if (img.complete && img.naturalWidth) ctx.drawImage(img, p.x - sq, p.y + (p.y >= gy - 20 ? Math.round(Math.sin(g.t * 0.5)) : 0), 20 + sq * 2, 20);
      else { ctx.fillStyle = "#e94fa8"; ctx.fillRect(p.x, p.y, 20, 20); }
    }
    g.parts.forEach(q => { ctx.fillStyle = q.c; ctx.fillRect(Math.round(q.x), Math.round(q.y), 2, 2); });
    ctx.font = "7px 'Press Start 2P',monospace"; ctx.textBaseline = "top";
    g.pops.forEach(q => {
      ctx.fillStyle = "#1a0630"; ctx.fillText(q.t, Math.round(q.x) + 1, Math.round(q.y) + 1);
      ctx.fillStyle = "#fff"; ctx.fillText(q.t, Math.round(q.x), Math.round(q.y));
    });
    ctx.restore();

    if (g.score !== shownScore) { shownScore = g.score; renderHud(); }
  };

  size();
  renderHud();
  loop();
  setInterval(loop, 16);

  let wasMobile = isMobile();
  window.addEventListener("resize", () => {
    size();
    if (isMobile() !== wasMobile) { wasMobile = isMobile(); if (!wasMobile) setMenu(false); }
  });

  // ---------- Mesh simulation ----------
  const mesh = document.getElementById("mesh");
  const mctx = mesh.getContext("2d");
  const MW = mesh.width, MH = mesh.height, N = 16;
  const nodes = Array.from({ length: N }, () => ({ x: 20 + rnd() * (MW - 40), y: 20 + rnd() * (MH - 40), vx: (rnd() - 0.5) * 0.3, vy: (rnd() - 0.5) * 0.3, flash: 0 }));
  let pk = [], hops = 0, t = 0, mid = 0;
  const seen = {};
  const neighbours = i => nodes.map((n, j) => j).filter(j => j !== i && Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y) < 95);
  // Flood a message from node i; each hop relays to unseen neighbours until TTL runs out
  const send = i => {
    mid++;
    seen[mid] = { [i]: 1 };
    nodes[i].flash = 14;
    neighbours(i).forEach(j => { seen[mid][j] = 1; pk.push({ id: mid, a: i, b: j, p: 0, ttl: 6 }); });
  };
  mesh.addEventListener("click", e => {
    const rc = mesh.getBoundingClientRect();
    const x = (e.clientX - rc.left) / rc.width * MW, y = (e.clientY - rc.top) / rc.height * MH;
    let bi = 0, bd = Infinity;
    nodes.forEach((n, i) => { const d = Math.hypot(n.x - x, n.y - y); if (d < bd) { bd = d; bi = i; } });
    send(bi);
  });
  send(0);
  setInterval(() => {
    t++;
    if (t % 90 === 0) send(Math.floor(rnd() * N));
    mctx.fillStyle = "#12031f"; mctx.fillRect(0, 0, MW, MH);
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 12 || n.x > MW - 12) n.vx *= -1;
      if (n.y < 12 || n.y > MH - 12) n.vy *= -1;
      if (n.flash > 0) n.flash--;
    });
    mctx.lineWidth = 1;
    nodes.forEach((n, i) => neighbours(i).forEach(j => {
      if (j > i) { mctx.strokeStyle = "rgba(255,94,181,.35)"; mctx.beginPath(); mctx.moveTo(n.x, n.y); mctx.lineTo(nodes[j].x, nodes[j].y); mctx.stroke(); }
    }));
    const next = [];
    pk.forEach(q => {
      q.p += 0.06;
      if (q.p >= 1) {
        hops++;
        nodes[q.b].flash = 14;
        if (q.ttl > 0) neighbours(q.b).forEach(j => { if (!seen[q.id][j]) { seen[q.id][j] = 1; next.push({ id: q.id, a: q.b, b: j, p: 0, ttl: q.ttl - 1 }); } });
      } else next.push(q);
    });
    pk = next.slice(-120);
    pk.forEach(q => { const A = nodes[q.a], B = nodes[q.b]; mctx.fillStyle = "#fff"; mctx.fillRect(A.x + (B.x - A.x) * q.p - 2, A.y + (B.y - A.y) * q.p - 2, 4, 4); });
    nodes.forEach(n => {
      mctx.fillStyle = n.flash > 0 ? "#ffffff" : "#e94fa8"; mctx.fillRect(n.x - 4, n.y - 4, 8, 8);
      mctx.strokeStyle = "#ff8ff6"; mctx.strokeRect(n.x - 5.5, n.y - 5.5, 11, 11);
    });
    mctx.fillStyle = "#ff8ff6"; mctx.font = "8px 'Press Start 2P',monospace"; mctx.textBaseline = "top";
    mctx.fillText("HOPS " + hops, 8, 8);
  }, 33);
})();
