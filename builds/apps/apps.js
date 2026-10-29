// CosQ Apps (Kurukuru): the simulations on this page, from the design.
// Map baking, fog of war and the ride matcher run on canvas; everything else
// is text filled in from the data below.
(() => {
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const heroTagsHTML = (t, i) => `<span style="font:400 9px/1.7 'Press Start 2P',monospace;padding:8px 10px;border:3px solid #e94fa8;background:#3a0f5c;color:#fff">${esc(t)}</span>`;
const algoBtnsHTML = (a, i) => `<button data-i="${i}" style="cursor:pointer;text-align:left;display:flex;flex-direction:column;gap:6px;padding:12px 14px;background:${esc(a.bg)};color:#fff;border:3px solid ${esc(a.bd)}">
            <span style="font:400 8px/1.7 'Press Start 2P',monospace;color:#ff8ff6">${esc(a.tag)}</span>
            <span style="font:400 17px/1.15 var(--font-display);text-transform:uppercase">${esc(a.name)}</span>
          </button>`;
const mRulesHTML = (r, i) => `<div style="display:flex;gap:12px;align-items:center;background:rgba(106,27,143,.38);border:3px solid ${esc(r.bd)};padding:12px 14px">
              <span style="font:400 11px/1 'Press Start 2P',monospace;color:${esc(r.c)};flex:none;width:18px">${esc(r.mark)}</span>
              <div style="min-width:0"><div style="font:400 15px/1.2 var(--font-display);text-transform:uppercase">${esc(r.title)}</div><div style="font:400 12px/1.5 'JetBrains Mono',monospace;color:#f3d6ec;margin-top:4px">${esc(r.val)}</div></div>
            </div>`;
const stageBtnsHTML = (b, i) => `<button data-i="${i}" style="cursor:pointer;font:400 9px/1.7 'Press Start 2P',monospace;padding:10px 12px;background:${esc(b.bg)};color:${esc(b.fg)};border:3px solid #e94fa8">${esc(b.label)}</button>`;
const classChipsHTML = (c, i) => `<span style="display:flex;align-items:center;gap:8px;font:400 8px/1.7 'Press Start 2P',monospace;padding:6px 8px;border:2px solid #6a1b8f;background:#1a0630"><span style="width:12px;height:12px;background:${esc(c.color)};border:2px solid #1a0630;display:block"></span>${esc(c.name)}</span>`;
const bakeStepsHTML = (s, i) => `<div style="background:rgba(106,27,143,.38);border:3px solid #e94fa8;box-shadow:0 0 22px rgba(255,94,181,.25),inset 0 0 0 2px #1a0630;padding:20px;display:flex;flex-direction:column;gap:8px">
          <span style="font:400 9px/1.7 'Press Start 2P',monospace;color:#ff8ff6">${esc(s.num)}</span>
          <h3 style="font:400 20px/1.1 var(--font-display);text-transform:uppercase;margin:0">${esc(s.title)}</h3>
          <p style="font-size:15px;line-height:1.5;margin:0;color:#f3d6ec">${esc(s.desc)}</p>
        </div>`;
const mapCardsHTML = (m, i) => `<div style="background:rgba(106,27,143,.38);border:3px solid #e94fa8;box-shadow:inset 0 0 0 2px #1a0630;padding:18px;display:flex;flex-direction:column;gap:6px">
              <span style="font:400 9px/1.7 'Press Start 2P',monospace;color:#ff8ff6">${esc(m.tag)}</span>
              <h3 style="font:400 19px/1.1 var(--font-display);text-transform:uppercase;margin:0">${esc(m.title)}</h3>
              <p style="font-size:15px;line-height:1.5;margin:0;color:#f3d6ec">${esc(m.desc)}</p>
            </div>`;
const worldCardsHTML = (w, i) => `<div style="background:rgba(106,27,143,.38);border:3px solid #e94fa8;box-shadow:0 0 22px rgba(255,94,181,.25),inset 0 0 0 2px #1a0630;padding:20px;display:flex;flex-direction:column;gap:8px">
          <span style="font:400 9px/1.7 'Press Start 2P',monospace;color:#ff8ff6">${esc(w.tag)}</span>
          <h3 style="font:400 20px/1.1 var(--font-display);text-transform:uppercase;margin:0">${esc(w.title)}</h3>
          <p style="font-size:15px;line-height:1.5;margin:0;color:#f3d6ec">${esc(w.desc)}</p>
        </div>`;
const stackHTML = (t, i) => `<span style="font:400 13px/1.4 'JetBrains Mono',monospace;padding:7px 10px;border:3px solid #6a1b8f;background:#1a0630;color:#fff">${esc(t)}</span>`;

  class App {
  state = { stage: 0, explored: 0, algo: 0, verdict: "", rules: [] };
  demoRef = { current: null }; baseRef = { current: null }; fogRef = { current: null }; markerRef = { current: null }; matchRef = { current: null };
  COLS = 40; ROWS = 24; SS = 3;
  C = { g: "#cfe8b3", t: "#a6d58a", w: "#9bcbe6", r: "#ffffff", p: "#e6cf9a", b: "#e2d9bf" };
  ALGOS = [
    ["MATCHING // GEOMETRY", "Co-pilot fit on a route", "internal/rides/match.go", "The pilot's route is a line. Each co-pilot stop is projected onto it in a flat local frame to get a position along the line and a sideways distance. A match needs both stops within 600 m of the line, the drop-off after the pick-up, 250 m or more shared, and departures within 20 minutes. The score is the sum of off-route distances plus a time penalty, lower is better.",
`t1, d1, in  := projectOnSegment(pilot.From, pilot.To, copilot.From)
t2, d2, out := projectOnSegment(pilot.From, pilot.To, copilot.To)
if d1 > maxOffRouteM || d2 > maxOffRouteM { return no }
if t2 <= t1 { return no }            // against the pilot's direction
shared := haversineM(in, out)
if shared < minSharedM { return no }
detour := max(1, round(2*(d1+d2)/300))  // minutes
score  := d1 + d2 + gapMinutes*10`],
    ["QUEUES // CONCURRENCY", "A job queue in one SQL statement", "internal/rides/series_matcher.go", "Several server instances run the matcher at once. A job is claimed with FOR UPDATE SKIP LOCKED, so two workers can never take the same row. A claim older than five minutes is treated as a crashed worker and taken over. A sweep every three minutes re-enqueues any open series that has room in its queue.",
`UPDATE match_jobs SET claimed_at = now()
WHERE series_id = (
  SELECT series_id FROM match_jobs
  WHERE run_after <= now()
    AND (claimed_at IS NULL
         OR claimed_at < now() - interval '5 minutes')
  ORDER BY run_after LIMIT 1
  FOR UPDATE SKIP LOCKED)
RETURNING series_id::text`],
    ["QUEUES // INVARIANTS", "Queue caps inside the INSERT", "internal/rides/series_matcher.go", "Both sides of a proposed match must have room in their queue. That check lives in the INSERT itself, not in Go, so two workers racing cannot overfill either queue. ON CONFLICT makes the insert idempotent.",
`INSERT INTO series_matches (pilot_series_id, copilot_series_id, score)
SELECT $1, $2, $3
WHERE (SELECT count(*) FROM series_matches
        WHERE state='proposed'
          AND (pilot_series_id=$1 OR copilot_series_id=$1)) < $4
  AND (SELECT count(*) FROM series_matches
        WHERE state='proposed'
          AND (pilot_series_id=$2 OR copilot_series_id=$2)) < $4
ON CONFLICT (pilot_series_id, copilot_series_id) DO NOTHING`],
    ["REALTIME // SOCKETS", "A hub that slow phones cannot stall", "pkg/sockets/hub.go", "Each socket has one writer goroutine and a buffered send queue of 32 messages. Broadcast never waits on a write: if a client's queue is full it is too slow, so it is dropped. One stalled phone cannot hold up the rest of the trip. Pings and read deadlines clear out silent clients.",
`msg := append([]byte(nil), payload...)   // copy once
for c := range clients {
  select {
  case c.send <- msg:                    // queued, no waiting
  default:
    slow = append(slow, c)               // queue full
  }
}
for _, c := range slow { c.close() }     // drop the slow ones`],
    ["MAP // GEOHASH", "Fog as 38 m by 19 m tiles", "internal/exploration/geohash.go", "The world is cut into precision-8 geohash tiles. A GPS fix lifts the fog within 120 m, found by sweeping a half-cell grid over the circle's bounding box and keeping the distinct tiles that fall inside. Progress is tiles visited over the tiles in the area.",
`for la := lat-dLat; la <= lat+dLat+cellLat/2; la += cellLat/2 {
  for lo := lng-dLng; lo <= lng+dLng+cellLng/2; lo += cellLng/2 {
    dy := (la-lat) * mPerDegLat
    dx := (lo-lng) * mPerDegLng
    if dx*dx+dy*dy > radiusM*radiusM { continue }
    seen[geohashEncode(la, lo, 8)] = struct{}{}
  }
}`],
    ["FAIRNESS // ANTI-CHEAT", "Impossible GPS jumps are dropped", "internal/quests/rules.go", "Quest stamps come from reported positions, so the server filters them. A fix is skipped if it would need more than 40 m/s from the last kept fix. Two fixes with the same timestamp must be close together. Fixes with no timestamp are kept.",
`dist := haversineM(prev.Lat, prev.Lng, f.Lat, f.Lng)
dt   := float64(f.T-prev.T) / 1000.0
if dt <= 0 {
  if dist > sameInstantFarM { continue }   // same instant, far apart
} else if dist/dt > MaxSpeedMps {
  continue                                  // faster than 144 km/h
}
out = append(out, f)`],
    ["ROUTING // SIMPLIFY", "Douglas-Peucker on road paths", "internal/routing/routing.go", "Routes come back from a self-hosted OSRM as encoded polylines. The server decodes them and drops every point within 5 m of the line through its neighbours, so the app draws a light path that still follows each bend. Results are cached for 24 hours, and a straight line is the fallback if routing is down.",
`rec = func(lo, hi int) {
  worst, at := 0.0, -1
  for i := lo+1; i < hi; i++ {
    if d := distToSegmentM(p[i], p[lo], p[hi]); d > worst {
      worst, at = d, i
    }
  }
  if at >= 0 && worst > tolM {
    keep[at] = true
    rec(lo, at); rec(at, hi)
  }
}`],
    ["MONEY // TRANSACTIONS", "Coins that cannot go negative", "internal/wallet/complete_tx.go", "Finishing a ride is one database transaction. The trip row and both balances are locked with FOR UPDATE, the fare is computed from the stored route distance, the co-pilot's balance is checked, both ledger rows are appended, and the trip moves to completed only if it was still in progress.",
`tx.QueryRow(\`SELECT ... FROM trips WHERE id=$1 FOR UPDATE\`)
tx.QueryRow(\`SELECT kuru_coin_balance FROM users
              WHERE id=$1 FOR UPDATE\`, copilotID)
if cBal < cost { return "insufficient vault balance" }
// debit co-pilot, credit pilot, append two ledger rows
UPDATE trips SET status='completed'
 WHERE id=$2 AND status='in_progress'   // exactly one row`],
    ["COLLAB // LIVE EDITING", "Versioned edits over server-sent events", "internal/editor/collab.go", "The quest book editor is multi-user. Every save carries the version it was based on, and a stale one gets a 409 with the current copy. Changes fan out to every open editor over a server-sent event stream with a 15 second heartbeat, and presence shows who has which place selected.",
`saved, cur, err := s.store.PutPlace(ctx, view, place,
                                     b.BaseVersion, who.Name)
if errors.Is(err, ErrConflict) {
  writeJSON(w, 409, map[string]any{"error": "conflict",
                                   "current": cur})
  return
}
s.hub(view).broadcast(Event{Type: "place", Place: &saved})`]
  ];

  setState(p) {
    this.state = { ...this.state, ...(typeof p === "function" ? p(this.state) : p) };
    this.update();
  }
  // Fill the lists that never change, then draw and start the animations.
  mount() {
    this.demoRef.current = $("demoCanvas"); this.baseRef.current = $("baseCanvas"); this.fogRef.current = $("fogCanvas");
    this.markerRef.current = $("fogMarker"); this.matchRef.current = $("matchCanvas");
    const v = this.renderVals();
    $("heroTags").innerHTML = v.heroTags.map(heroTagsHTML).join("");
    $("classChips").innerHTML = v.classChips.map(classChipsHTML).join("");
    $("bakeSteps").innerHTML = v.bakeSteps.map(bakeStepsHTML).join("");
    $("mapCards").innerHTML = v.mapCards.map(mapCardsHTML).join("");
    $("worldCards").innerHTML = v.worldCards.map(worldCardsHTML).join("");
    $("stack").innerHTML = v.stack.map(stackHTML).join("");
    $("algoBtns").addEventListener("click", e => { const b = e.target.closest("[data-i]"); if (b) this.setState({ algo: +b.dataset.i }); });
    $("stageBtns").addEventListener("click", e => { const b = e.target.closest("[data-i]"); if (b) { this.manual = true; this.setState({ stage: +b.dataset.i }); } });
    this.buildScene(); this.update();
    this.stageTimer = setInterval(() => { if (!this.manual) this.setState(s => ({ stage: (s.stage + 1) % 4 })); }, 3600);
    this.initFog(); this.initMatch();
    const m = $("matchCanvas");
    m.addEventListener("pointerdown", e => this.mDown && this.mDown(e));
    m.addEventListener("pointermove", e => this.mMove && this.mMove(e));
    m.addEventListener("pointerup", () => this.mUp && this.mUp());
    const fa = $("fogArea");
    fa.addEventListener("pointermove", e => this.renderVals().fogMove(e));
    fa.addEventListener("pointerdown", e => this.renderVals().fogMove(e));
  }
  // Redraw the stage canvas and refresh whatever text depends on state.
  update() {
    this.draw();
    const v = this.renderVals(), st = this.state;
    if (this.shownAlgo !== st.algo) {
      this.shownAlgo = st.algo;
      $("algoBtns").innerHTML = v.algoBtns.map(algoBtnsHTML).join("");
      $("algoTag").textContent = v.algo.tag; $("algoName").textContent = v.algo.name; $("algoFile").textContent = v.algo.file;
      $("algoIdea").textContent = v.algo.idea; $("algoCode").textContent = v.algo.code;
    }
    if (this.shownStage !== st.stage) {
      this.shownStage = st.stage;
      $("stageBtns").innerHTML = v.stageBtns.map(stageBtnsHTML).join("");
      $("stageName").textContent = v.stageName; $("stageTag").textContent = v.stageTag;
      $("stageTitle").textContent = v.stageTitle; $("stageDesc").textContent = v.stageDesc;
    }
    $("mVerdict").textContent = v.mVerdict;
    $("mRules").innerHTML = v.mRules.map(mRulesHTML).join("");
    $("explored").textContent = v.explored;
  }

  dist(px, py, pts) {
    let best = 1e9;
    for (let i = 0; i < pts.length - 1; i++) {
      const [ax, ay] = pts[i], [bx, by] = pts[i + 1], vx = bx - ax, vy = by - ay, l2 = vx * vx + vy * vy || 1;
      const u = Math.max(0, Math.min(1, ((px - ax) * vx + (py - ay) * vy) / l2));
      best = Math.min(best, Math.hypot(px - ax - vx * u, py - ay - vy * u));
    }
    return best;
  }
  buildScene() {
    const { COLS, ROWS, SS } = this;
    this.road = { pts: [[0, 12], [14, 11], [26, 7], [40, 6]], w: 1.2 };
    this.path = { pts: [[6, 21], [20, 15], [14, 11.1]], w: 0.34 };
    this.park = [3, 3, 10, 8]; this.pond = [28, 17, 5.5, 3.2];
    this.blds = [[16, 13, 4, 3, 2], [21, 14, 3, 3, 4], [24, 9.5, 4, 3, 3], [18, 3, 5, 3, 1], [30, 11, 3, 3, 5], [33, 20, 4, 2, 2]];
    this.trees = [[5, 5], [8, 6], [11, 4], [7, 9], [4, 15], [12, 18], [30, 3], [35, 14], [2, 21], [36, 9]];
    const W = COLS * SS, H = ROWS * SS, sub = new Uint8Array(W * H), bh = new Uint8Array(W * H), K = { g: 0, t: 1, w: 2, r: 3, p: 4, b: 5 };
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const cx = (x + 0.5) / SS, cy = (y + 0.5) / SS; let v = K.g;
      const [px0, py0, pw, ph] = this.park;
      if (cx >= px0 && cx <= px0 + pw && cy >= py0 && cy <= py0 + ph) v = K.t;
      const [ex, ey, rx, ry] = this.pond;
      if (((cx - ex) / rx) ** 2 + ((cy - ey) / ry) ** 2 <= 1) v = K.w;
      if (this.dist(cx, cy, this.road.pts) <= this.road.w / 2) v = K.r;
      if (this.dist(cx, cy, this.path.pts) <= this.path.w / 2) v = K.p;
      for (const [bx, by, bw, bhh, h] of this.blds) if (cx >= bx && cx <= bx + bw && cy >= by && cy <= by + bhh) { v = K.b; bh[y * W + x] = h; }
      sub[y * W + x] = v;
    }
    this.sub = sub; this.W = W; this.H = H;
    const skel = new Uint8Array(COLS * ROWS);
    const mark = (pts, val) => { for (let i = 0; i < pts.length - 1; i++) { const [ax, ay] = pts[i], [bx, by] = pts[i + 1], n = Math.ceil(Math.hypot(bx - ax, by - ay) / 0.25); for (let k = 0; k <= n; k++) { const c = Math.floor(ax + (bx - ax) * k / n), r = Math.floor(ay + (by - ay) * k / n); if (c >= 0 && c < COLS && r >= 0 && r < ROWS && skel[r * COLS + c] !== K.r) skel[r * COLS + c] = val; } } };
    mark(this.path.pts, K.p); mark(this.road.pts, K.r);
    const w = { 0: [1, 1], 1: [1, 1], 2: [1.25, 3], 3: [1.7, 2], 4: [1.2, 2], 5: [1, 1] };
    const cells = new Uint8Array(COLS * ROWS), ch = new Uint8Array(COLS * ROWS);
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      const cnt = [0, 0, 0, 0, 0, 0]; let bc = 0, bmax = 0;
      for (let dy = 0; dy < SS; dy++) for (let dx = 0; dx < SS; dx++) { const i = (r * SS + dy) * W + c * SS + dx; cnt[sub[i]]++; if (sub[i] === K.b) { bc++; bmax = Math.max(bmax, bh[i]); } }
      let best = 0, bs = -1;
      for (let k = 0; k < 6; k++) { if (k === 5 || cnt[k] < w[k][1]) continue; const s = cnt[k] * w[k][0]; if (s > bs) { bs = s; best = k; } }
      const sk = skel[r * COLS + c]; if (sk && best !== K.r) best = sk;
      if (bc >= 3 && best !== K.r && best !== K.w) { best = K.b; ch[r * COLS + c] = bmax; }
      cells[r * COLS + c] = best;
    }
    this.cells = cells; this.cellH = ch;
    this.treeCells = this.trees.filter(([x, y]) => { const k = cells[y * COLS + x]; return k === 0 || k === 1; });
  }
  draw() {
    const cv = this.demoRef.current; if (!cv) return;
    const ctx = cv.getContext("2d"), { COLS, ROWS, C } = this, st = this.state.stage, col = ["g", "t", "w", "r", "p", "b"];
    ctx.imageSmoothingEnabled = false; ctx.fillStyle = "#cfe8b3"; ctx.fillRect(0, 0, 640, 400);
    const grid = a => { ctx.strokeStyle = "rgba(26,6,48," + a + ")"; ctx.lineWidth = 1; for (let c = 0; c <= COLS; c++) { ctx.beginPath(); ctx.moveTo(c * 16, 0); ctx.lineTo(c * 16, 384); ctx.stroke(); } for (let r = 0; r <= ROWS; r++) { ctx.beginPath(); ctx.moveTo(0, r * 16); ctx.lineTo(640, r * 16); ctx.stroke(); } };
    if (st === 0) {
      const k = 16; ctx.fillStyle = C.g; ctx.fillRect(0, 0, 640, 384);
      ctx.fillStyle = C.t; ctx.fillRect(this.park[0] * k, this.park[1] * k, this.park[2] * k, this.park[3] * k);
      ctx.fillStyle = C.w; ctx.beginPath(); ctx.ellipse(this.pond[0] * k, this.pond[1] * k, this.pond[2] * k, this.pond[3] * k, 0, 0, 6.3); ctx.fill();
      const line = (pts, wd, color) => { ctx.strokeStyle = color; ctx.lineWidth = wd * k; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x * k, y * k) : ctx.moveTo(x * k, y * k)); ctx.stroke(); };
      line(this.road.pts, this.road.w + 0.35, "#cfc7ab"); line(this.road.pts, this.road.w, C.r); line(this.path.pts, this.path.w, "#c9a45a");
      this.blds.forEach(([x, y, w, h]) => { ctx.fillStyle = C.b; ctx.fillRect(x * k, y * k, w * k, h * k); ctx.strokeStyle = "#b8ad8a"; ctx.lineWidth = 2; ctx.strokeRect(x * k, y * k, w * k, h * k); });
      ctx.fillStyle = "#4f9a3f"; this.trees.forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x * k, y * k, 5, 0, 6.3); ctx.fill(); });
    } else if (st === 1) {
      const s = 640 / this.W;
      for (let y = 0; y < this.H; y++) for (let x = 0; x < this.W; x++) { ctx.fillStyle = C[col[this.sub[y * this.W + x]]]; ctx.fillRect(Math.floor(x * s), Math.floor(y * s), Math.ceil(s), Math.ceil(s)); }
      grid(0.28);
    } else if (st === 2) {
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) { const k = this.cells[r * COLS + c]; ctx.fillStyle = C[col[k]]; ctx.fillRect(c * 16, r * 16, 16, 16); if (k === 5) { ctx.fillStyle = "#b8ad8a"; ctx.fillRect(c * 16, r * 16 + 14, 16, 2); } }
      ctx.fillStyle = "#4f9a3f"; this.treeCells.forEach(([x, y]) => ctx.fillRect(x * 16 + 4, y * 16 + 4, 8, 8)); grid(0.22);
    } else {
      ctx.fillStyle = "#1a0630"; ctx.fillRect(0, 0, 640, 400);
      const ox = ROWS * 10 + 90, oy = 70, tw = 10, th = 5;
      const poly = (pts, color) => { ctx.fillStyle = color; ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.fill(); };
      const gcol = { 0: ["#cfe8b3", "#c4e0a6"], 1: ["#a6d58a", "#9acb7d"], 2: ["#9bcbe6", "#8bbfdc"], 3: ["#ffffff", "#f3eed9"], 4: ["#e6cf9a", "#dcc487"], 5: ["#cfe8b3", "#c4e0a6"] };
      const tset = new Set(this.treeCells.map(([x, y]) => y * COLS + x));
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
        const k = this.cells[r * COLS + c], x = (c - r) * tw + ox, y = (c + r) * th + oy, h = this.cellH[r * COLS + c], d = k === 2 ? 3 : 0;
        poly([[x, y + d], [x + tw, y + th + d], [x, y + 2 * th + d], [x - tw, y + th + d]], gcol[k][(r + c) % 2]);
        if (k === 5) { const hp = h * 8 + 6; poly([[x - tw, y + th], [x, y + 2 * th], [x, y + 2 * th - hp], [x - tw, y + th - hp]], "#e94fa8"); poly([[x + tw, y + th], [x, y + 2 * th], [x, y + 2 * th - hp], [x + tw, y + th - hp]], "#a82f78"); poly([[x, y - hp], [x + tw, y + th - hp], [x, y + 2 * th - hp], [x - tw, y + th - hp]], "#ff8ff6"); }
        if (tset.has(r * COLS + c)) { ctx.fillStyle = "#6b4a2a"; ctx.fillRect(x - 1, y + th - 6, 3, 8); poly([[x, y - 12], [x + 6, y - 8], [x, y - 3], [x - 6, y - 8]], "#4f9a3f"); poly([[x, y - 16], [x + 5, y - 12], [x, y - 8], [x - 5, y - 12]], "#6fc25a"); }
      }
    }
  }
  initFog() {
    const base = this.baseRef.current, fog = this.fogRef.current; if (!base || !fog) return;
    const b = base.getContext("2d"), f = fog.getContext("2d");
    b.fillStyle = "#f3eedf"; b.fillRect(0, 0, 160, 100); b.fillStyle = "#cfe8b3"; b.fillRect(8, 8, 36, 24); b.fillRect(100, 62, 40, 28); b.fillStyle = "#9bcbe6"; b.fillRect(118, 6, 34, 20);
    const road = (pts, w) => { b.lineCap = "round"; b.lineJoin = "round"; [["#cfc7ab", w + 2], ["#fff", w]].forEach(([c, lw]) => { b.strokeStyle = c; b.lineWidth = lw; b.beginPath(); pts.forEach(([x, y], i) => i ? b.lineTo(x, y) : b.moveTo(x, y)); b.stroke(); }); };
    road([[0, 50], [50, 46], [90, 54], [160, 48]], 5); road([[60, 0], [56, 46], [64, 100]], 4); road([[104, 0], [98, 54], [110, 100]], 3); road([[0, 80], [64, 74], [160, 82]], 3);
    b.fillStyle = "#e2d9bf"; b.strokeStyle = "#b8ad8a"; b.lineWidth = 1;
    [[68, 8, 14, 10], [68, 24, 20, 12], [8, 56, 18, 14], [30, 58, 16, 12], [70, 58, 14, 10], [116, 36, 14, 10], [134, 34, 16, 12], [8, 84, 16, 10], [74, 84, 18, 10], [30, 36, 12, 8]].forEach(([x, y, w, h]) => { b.fillRect(x, y, w, h); b.strokeRect(x + 0.5, y + 0.5, w, h); });
    f.fillStyle = "rgba(142,140,130,.78)"; f.fillRect(0, 0, 160, 100);
    this.fogMoveTo = (x, y) => { f.globalCompositeOperation = "destination-out"; f.beginPath(); f.arc(x, y, 11, 0, 6.3); f.fill(); f.globalCompositeOperation = "source-over"; const m = this.markerRef.current; if (m) { m.style.left = x / 160 * 100 + "%"; m.style.top = y + "%"; } };
    const route = [[10, 72], [40, 78], [64, 76], [90, 80], [110, 76], [140, 82], [130, 60], [110, 52], [96, 54], [80, 50], [62, 46], [40, 49], [20, 50], [10, 40], [20, 22], [40, 18], [58, 20], [60, 6], [80, 12], [104, 10], [124, 14], [140, 30]];
    let seg = 0, t = 0; this.auto = true; this.tick = 0;
    this.fogTimer = setInterval(() => {
      if (this.auto && seg < route.length - 1) { const a = route[seg], c = route[seg + 1]; t += 0.12 / Math.max(1, Math.hypot(c[0] - a[0], c[1] - a[1]) / 6); if (t >= 1) { t = 0; seg++; } this.fogMoveTo(a[0] + (c[0] - a[0]) * t, a[1] + (c[1] - a[1]) * t); }
      this.tick++;
      if (this.tick % 8 === 0) { const d = f.getImageData(0, 0, 160, 100).data; let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] < 100) n++; const p = Math.round(n / 160); if (p !== this.state.explored) this.setState({ explored: p }); }
    }, 50);
  }
  initMatch() {
    const cv = this.matchRef.current; if (!cv) return;
    const ctx = cv.getContext("2d"), W = 640, H = 400, MPP = 2;
    const A = [60, 320], B = [580, 80];
    const pts = { f: [180, 240], t: [440, 140] }; this.drag = null; this.user = false; let tk = 0;
    const proj = (p) => { const vx = B[0] - A[0], vy = B[1] - A[1], l2 = vx * vx + vy * vy, u0 = ((p[0] - A[0]) * vx + (p[1] - A[1]) * vy) / l2, u = Math.max(0, Math.min(1, u0)), q = [A[0] + vx * u, A[1] + vy * u]; return { t: u, q, d: Math.hypot(p[0] - q[0], p[1] - q[1]) * MPP }; };
    const pos = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H]; };
    this.mDown = e => { const p = pos(e); const df = Math.hypot(p[0] - pts.f[0], p[1] - pts.f[1]), dt = Math.hypot(p[0] - pts.t[0], p[1] - pts.t[1]); if (Math.min(df, dt) < 40) { this.drag = df < dt ? "f" : "t"; this.user = true; try { cv.setPointerCapture(e.pointerId); } catch (x) {} } };
    this.mMove = e => { if (this.drag) pts[this.drag] = pos(e); };
    this.mUp = () => { this.drag = null; };
    this.mt = setInterval(() => {
      tk++;
      if (!this.user) { pts.f = [180 + Math.sin(tk / 40) * 60, 240 + Math.cos(tk / 33) * 70]; pts.t = [440 + Math.cos(tk / 50) * 80, 140 + Math.sin(tk / 37) * 90]; }
      const p1 = proj(pts.f), p2 = proj(pts.t), shared = Math.hypot(p1.q[0] - p2.q[0], p1.q[1] - p2.q[1]) * MPP;
      const okOff = p1.d <= 600 && p2.d <= 600, okDir = p2.t > p1.t, okShared = shared >= 250, detour = Math.max(1, Math.round(2 * (p1.d + p2.d) / 300)), ok = okOff && okDir && okShared;
      ctx.fillStyle = "#12031f"; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(255,94,181,.15)"; ctx.lineWidth = 1; for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); } for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      const band = 600 / MPP, ang = Math.atan2(B[1] - A[1], B[0] - A[0]);
      ctx.save(); ctx.translate(A[0], A[1]); ctx.rotate(ang); ctx.fillStyle = "rgba(255,94,181,.1)"; ctx.fillRect(0, -band, Math.hypot(B[0] - A[0], B[1] - A[1]), band * 2); ctx.restore();
      ctx.strokeStyle = "#6a1b8f"; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke();
      if (okDir) { ctx.strokeStyle = ok ? "#ff8ff6" : "#9a6bb0"; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(p1.q[0], p1.q[1]); ctx.lineTo(p2.q[0], p2.q[1]); ctx.stroke(); }
      ctx.setLineDash([5, 5]); ctx.strokeStyle = "#fff"; ctx.lineWidth = 2;
      [[pts.f, p1.q], [pts.t, p2.q]].forEach(([a, q]) => { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(q[0], q[1]); ctx.stroke(); }); ctx.setLineDash([]);
      const sq = (p, c, s) => { ctx.fillStyle = "#1a0630"; ctx.fillRect(p[0] - s - 3, p[1] - s - 3, s * 2 + 6, s * 2 + 6); ctx.fillStyle = c; ctx.fillRect(p[0] - s, p[1] - s, s * 2, s * 2); };
      sq(A, "#6a1b8f", 9); sq(B, "#6a1b8f", 9); sq(p1.q, "#ff8ff6", 5); sq(p2.q, "#ff8ff6", 5); sq(pts.f, "#e94fa8", 9); sq(pts.t, "#fff", 9);
      ctx.fillStyle = "#fff"; ctx.font = "9px 'Press Start 2P',monospace"; ctx.textBaseline = "top";
      ctx.fillText("PILOT START", A[0] - 6, A[1] + 16); ctx.fillText("PILOT END", B[0] - 70, B[1] + 16); ctx.fillStyle = "#e94fa8"; ctx.fillText("IN", pts.f[0] + 14, pts.f[1] - 5); ctx.fillStyle = "#fff"; ctx.fillText("OUT", pts.t[0] + 14, pts.t[1] - 5);
      const v = !okOff ? "REJECT: OFF ROUTE" : !okDir ? "REJECT: WRONG WAY" : !okShared ? "REJECT: TOO SHORT" : "MATCH", sh = Math.round(shared);
      const rules = [
        { title: "Both stops near the route", val: "in " + Math.round(p1.d) + " m, out " + Math.round(p2.d) + " m (max 600)", ok: okOff },
        { title: "Same direction", val: "t(out) " + p2.t.toFixed(2) + " vs t(in) " + p1.t.toFixed(2), ok: okDir },
        { title: "Enough shared distance", val: sh + " m shared (min 250)", ok: okShared },
        { title: "Detour estimate", val: detour + " min added for the pilot", ok: ok },
        { title: "Score, lower is better", val: Math.round(p1.d + p2.d) + " + time gap x 10", ok: ok }
      ].map(r => ({ title: r.title, val: r.val, mark: r.ok ? "+" : "x", c: r.ok ? "#ff8ff6" : "#e94fa8", bd: r.ok ? "#6a1b8f" : "#e94fa8" }));
      if (v !== this.state.verdict || tk % 5 === 0) this.setState({ verdict: v, rules });
    }, 40);
  }
  renderVals() {
    const st = this.state.stage, mk = (a, keys) => a.map(r => Object.fromEntries(keys.map((x, i) => [x, r[i]])));
    const names = ["VECTOR SHAPES", "3X SUBSAMPLE", "10 M CELLS", "BLOCK WORLD"];
    const stages = [["STEP 1 // DOWNLOAD", "Features from OpenStreetMap", "Land use, water, roads, rail, buildings and trees are fetched tile by tile with retries and a cache, so a long bake can resume."], ["STEP 2 // RASTERIZE", "Painted at 3x resolution", "Every feature is filled onto a grid three times finer than the output, in painter's order, with even-odd polygon fill so courtyards and ponds become holes. Roads are stroked at their real width."], ["STEP 3 // DOWNSAMPLE", "A vote per 10 m cell", "Each cell takes a weighted vote from its 3x3 subsamples. Roads, bridges and water get boosts so a 5 m lane or an 8 m house survives. A road centreline pass keeps thin roads connected."], ["STEP 4 // EXTRUDE", "Blocks with height and kind", "Buildings keep a height class and a kind (house, flats, shop, institution, religious, industrial) so the app can extrude and colour them. Trees, sand banks and landmarks are added."]];
    const s = stages[st];
    return {
      heroTags: ["FLUTTER", "GO CORE", "POSTGIS", "VOXEL WORLD", "THREE.JS", "MAPLIBRE"],
      algoBtns: this.ALGOS.map((a, i) => ({ tag: a[0], name: a[1], bg: i === this.state.algo ? "#6a1b8f" : "rgba(106,27,143,.25)", bd: i === this.state.algo ? "#ff8ff6" : "#6a1b8f", click: () => this.setState({ algo: i }) })),
      algo: (a => ({ tag: a[0], name: a[1], file: a[2], idea: a[3], code: a[4] }))(this.ALGOS[this.state.algo]),
      matchRef: this.matchRef, mDown: e => this.mDown && this.mDown(e), mMove: e => this.mMove && this.mMove(e), mUp: () => this.mUp && this.mUp(),
      mVerdict: this.state.verdict, mRules: this.state.rules,
      demoRef: this.demoRef, baseRef: this.baseRef, fogRef: this.fogRef, markerRef: this.markerRef,
      stageBtns: names.map((label, i) => ({ label, bg: i === st ? "#e94fa8" : "#1a0630", fg: "#fff", click: () => { this.manual = true; this.setState({ stage: i }); } })),
      stageName: names[st], stageTag: s[0], stageTitle: s[1], stageDesc: s[2],
      classChips: [["GRASS", "#cfe8b3"], ["PARK", "#a6d58a"], ["WATER", "#9bcbe6"], ["ROAD", "#ffffff"], ["PATH", "#e6cf9a"], ["BUILDING", "#e94fa8"]].map(([name, color]) => ({ name, color })),
      explored: this.state.explored,
      fogMove: e => { if (!this.fogMoveTo) return; if (e.type === "pointermove" && e.buttons === 0 && e.pointerType === "mouse" && !this.auto) { } const r = e.currentTarget.getBoundingClientRect(); this.auto = false; this.fogMoveTo((e.clientX - r.left) / r.width * 160, (e.clientY - r.top) / r.height * 100); },
      bakeSteps: mk([
        ["SUBSAMPLE", "Painter's order and even-odd fill", "Land use is painted in a fixed order from low to high. A scanline fill treats overlapping rings as holes, and multipolygon ring segments are stitched into closed rings first."],
        ["SKELETON", "Thin roads stay connected", "The road centreline is walked in small steps and its class is written into every cell it crosses, so a 4 m lane on a 10 m grid never breaks into dots."],
        ["BRIDGES", "Roads over water", "A road that crosses water, or is tagged as a bridge, becomes a bridge cell instead of drowning, and sand banks form along shorelines."],
        ["SEAMLESS TILES", "One shared grid per city", "A whole city is cut into 2 km tiles on a single pinned grid, so neighbours meet on exact cell edges. A feature near a border is given to both tiles."],
        ["CONTENT HASHING", "Deterministic tiles", "Tiles are gzipped with a zeroed header so identical data gives identical bytes. The manifest lists each tile's sha1, and the app fetches and caches by hash."],
        ["LEVELS OF DETAIL", "Coarse city, fine street", "A city has a coarse level and a finer one. The app switches by zoom, and stitches a window of tiles around the camera into one world with an LRU cache."]
      ], ["num", "title", "desc"]),
      mapCards: mk([
        ["VECTOR STYLE", "A palette of our own", "A MapLibre style on OpenFreeMap vector tiles: parchment land, soft green parks, blue water, and roads drawn as a casing line plus a fill line that widen on an exponential zoom curve."],
        ["FOG POLYGON", "A world polygon with holes", "The fog is one big polygon. Explored outlines are cut out as holes. Unexplored pockets enclosed by explored ground are added back as separate shapes so they stay foggy."],
        ["GEOJSON LAYERS", "Six sources, one push", "Fog, route, shared stretch, stops, flags and actors are separate GeoJSON sources. A single update pushes them all, and sprites are drawn in code and added as map images."],
        ["TAP IN METRES", "Flag hit-testing without pixels", "Taps are tested in metres, not screen pixels, using the zoom's metres-per-pixel, so a flag icon is just as easy to hit on every device."]
      ], ["tag", "title", "desc"]),
      worldCards: mk([
        ["CENTRELINE", "Roads keep every bend", "Roads are real polylines clipped to 500 m tiles. Each is built as a ribbon with mitred corners and a limit on how sharp a corner can spike."],
        ["BUILDINGS", "Footprints with heights", "Footprints are extruded to real or estimated heights. Shop fronts are chosen by the wall that faces the nearest road, then given glass, an awning and a brand sign."],
        ["SHOPS", "Brands matched to buildings", "Named places are attached to the nearest building. Known chains with no building in the data get a stand-in building set back from the road, turned to face it."],
        ["TREES", "Placed by rule, not by hand", "Trees are generated with a seeded random generator: along streets, scattered in parks on a jittered grid filled by scanline, and in yards, never on a road or a building."],
        ["MERGING", "One draw call per material", "All the small meshes in a tile are merged into a single buffer geometry, so a whole tile of roads or walls costs one draw call. Trees and lamps use instancing."],
        ["STREAMING", "One tile built per frame", "Tiles load around the player, are built at most one per frame so walking never hitches, and are unloaded and disposed when the player moves away."],
        ["COLLISION", "Slide along walls", "The player is a circle. Building footprints push it out and let it slide along the wall, with a few passes to settle a spot squeezed between two buildings."],
        ["LIGHTING", "A sun that does not shimmer", "A sky shader and a directional sun cast shadows. The shadow box follows the player and snaps to the shadow map's texel size, so shadows stay still as you move."]
      ], ["tag", "title", "desc"]),
      stack: ["Flutter", "Dart 3.11", "flutter_map", "maplibre_gl", "OpenFreeMap", "geolocator", "webview_flutter", "Go 1.25", "net/http", "gorilla/websocket", "server-sent events", "lib/pq", "PostgreSQL", "PostGIS", "geohash", "Supabase auth", "OSRM", "Three.js", "Vite", "OpenStreetMap", "Overture Maps", "DuckDB", "osmium", "Razorpay", "Docker multi-stage", "Python tooling"]
    };
  }
}

  new App().mount();
})();
