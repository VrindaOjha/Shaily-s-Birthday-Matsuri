import {
  INTERACT_RADIUS,
  LightingMode,
  PLAY_AREA_HEIGHT,
  SKY_OFFSET,
  WORLD_HEIGHT,
  WORLD_OBJECTS,
  WORLD_WIDTH,
  WorldObject,
} from '../data/worldObjects';

export type Direction = 'down' | 'up' | 'left' | 'right';

export interface PlayerState {
  x: number;
  y: number;
  dir: Direction;
  isMoving: boolean;
  walkFrame: number;
  targetX: number | null;
  targetY: number | null;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  angle: number;
  vAngle: number;
  swayOffset: number;
  type:
    | 'snowflake-dot'
    | 'snowflake-crystal'
    | 'leaf-red'
    | 'leaf-orange'
    | 'ember-purple'
    | 'ember-amber';
}

export function createInitialParticles(count = 28): Particle[] {
  const list: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const isCrystal = i % 4 === 0;
    list.push({
      x: Math.random() * WORLD_WIDTH,
      y: Math.random() * WORLD_HEIGHT,
      vx: (Math.random() - 0.5) * 0.35,
      vy: 0.45 + Math.random() * 0.75,
      size: isCrystal ? 2.2 + Math.random() * 1.4 : 1.1 + Math.random() * 1.2,
      angle: Math.random() * Math.PI * 2,
      vAngle: (Math.random() - 0.5) * 0.02,
      swayOffset: Math.random() * Math.PI * 2,
      type: isCrystal ? 'snowflake-crystal' : 'snowflake-dot',
    });
  }
  return list;
}

// Helper for crisp rectangles
function fillRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string
) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

// Helper for cute rounded circle
function fillCircle(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  color: string
) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
}

// Helper for carved flickering Jack-o'-Lantern using cute rounded shapes & thin lines
function drawKabochaPumpkin(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  time: number,
  seed: number
) {
  // Subtle ground shadow
  ctx.fillStyle = 'rgba(0,0,0,0.38)';
  ctx.beginPath();
  ctx.ellipse(cx, cy + radius * 0.75, radius * 0.95, radius * 0.35, 0, 0, Math.PI * 2);
  ctx.fill();

  // Plump circular pumpkin lobes
  fillCircle(ctx, cx - radius * 0.35, cy, radius * 0.78, '#c2410c');
  fillCircle(ctx, cx + radius * 0.35, cy, radius * 0.78, '#c2410c');
  fillCircle(ctx, cx, cy, radius * 0.84, '#ea580c');
  fillCircle(ctx, cx, cy, radius * 0.62, '#f97316');

  // Thin delicate rib outline
  ctx.strokeStyle = 'rgba(124, 45, 18, 0.45)';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.ellipse(cx, cy, radius * 0.48, radius * 0.8, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Little curved green stem
  fillRect(ctx, cx - 1, cy - radius - 2, 2, 3, '#15803d');

  // Randomized candle flicker inside eyes and grin
  const flicker = Math.sin(time * 0.014 + seed * 3.7) + Math.cos(time * 0.029 + seed);
  const eyeColor = flicker > 0.2 ? '#fef08a' : flicker > -0.6 ? '#f59e0b' : '#d97706';

  // Cute round/oval glowing eyes
  fillCircle(ctx, cx - radius * 0.36, cy - radius * 0.12, 1.8, eyeColor);
  fillCircle(ctx, cx + radius * 0.36, cy - radius * 0.12, 1.8, eyeColor);

  // Cute curved smile with thin line
  ctx.strokeStyle = eyeColor;
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.arc(cx, cy + radius * 0.08, radius * 0.42, 0.2, Math.PI - 0.2);
  ctx.stroke();
}

// Helper for drawing iconic Mount Fuji (富士山) in the extended twilight sky
function drawMountFuji(ctx: CanvasRenderingContext2D, time: number) {
  // Mountain is shorter and shifted further to the left
  const fujiCenterX = 220;
  const fujiBaseY = 158;
  const fujiPeakY = 54;
  const summitWidth = 38;
  const baseWidth = 440;

  // 1. Soft atmospheric twilight sunset glow / halo behind Fuji
  const haloGrad = ctx.createRadialGradient(
    fujiCenterX,
    100,
    20,
    fujiCenterX,
    105,
    230
  );
  haloGrad.addColorStop(0, 'rgba(251, 113, 133, 0.45)'); // warm sunset rose
  haloGrad.addColorStop(0.35, 'rgba(244, 114, 182, 0.30)'); // glowing pink
  haloGrad.addColorStop(0.7, 'rgba(168, 85, 247, 0.16)'); // twilight purple
  haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = haloGrad;
  ctx.fillRect(Math.max(0, fujiCenterX - 240), 0, 480, 160);

  // 2. Main Silhouette of Mount Fuji (smooth volcanic hyperbolic flanks)
  const leftPeakX = fujiCenterX - summitWidth / 2;
  const rightPeakX = fujiCenterX + summitWidth / 2;
  const leftBaseX = fujiCenterX - baseWidth / 2;
  const rightBaseX = fujiCenterX + baseWidth / 2;

  // Gradient body for the mountain (deep twilight silhouette)
  const bodyGrad = ctx.createLinearGradient(0, fujiPeakY, 0, fujiBaseY);
  bodyGrad.addColorStop(0, '#311645'); // top ridge beneath snow
  bodyGrad.addColorStop(0.4, '#241235'); // mid slope
  bodyGrad.addColorStop(1, '#170b24'); // deep silhouette base
  ctx.fillStyle = bodyGrad;

  ctx.beginPath();
  ctx.moveTo(leftBaseX, fujiBaseY);
  // Left hyperbolic flank
  ctx.bezierCurveTo(
    fujiCenterX - 140, fujiBaseY - 14,
    fujiCenterX - 88, fujiPeakY + 38,
    leftPeakX, fujiPeakY
  );
  // Crater rim with classic subtle central caldera dip
  ctx.lineTo(fujiCenterX - 7, fujiPeakY + 1.2);
  ctx.lineTo(fujiCenterX, fujiPeakY + 2.0);
  ctx.lineTo(fujiCenterX + 7, fujiPeakY + 1.2);
  ctx.lineTo(rightPeakX, fujiPeakY);
  // Right hyperbolic flank
  ctx.bezierCurveTo(
    fujiCenterX + 88, fujiPeakY + 38,
    fujiCenterX + 140, fujiBaseY - 14,
    rightBaseX, fujiBaseY
  );
  ctx.closePath();
  ctx.fill();

  // 3. Volcanic slope ridges and twilight rim lighting
  ctx.strokeStyle = 'rgba(244, 114, 182, 0.45)';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(rightPeakX, fujiPeakY);
  ctx.bezierCurveTo(
    fujiCenterX + 88, fujiPeakY + 38,
    fujiCenterX + 140, fujiBaseY - 14,
    rightBaseX, fujiBaseY
  );
  ctx.stroke();

  // Subtle interior volcanic ridges
  ctx.strokeStyle = 'rgba(19, 9, 30, 0.55)';
  ctx.lineWidth = 1.1;
  const ridgePaths = [
    [leftPeakX + 7, fujiPeakY + 4, fujiCenterX - 55, fujiBaseY],
    [leftPeakX + 16, fujiPeakY + 4, fujiCenterX - 20, fujiBaseY],
    [fujiCenterX, fujiPeakY + 5, fujiCenterX + 8, fujiBaseY],
    [rightPeakX - 14, fujiPeakY + 4, fujiCenterX + 42, fujiBaseY],
    [rightPeakX - 6, fujiPeakY + 3, fujiCenterX + 80, fujiBaseY],
  ];
  ridgePaths.forEach(([x1, y1, x2, y2]) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo((x1 + x2) / 2 + 4, (y1 + y2) / 2, x2, y2);
    ctx.stroke();
  });

  // 4. Iconic Snow-Capped Peak with classic triangular snow fingers
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(leftBaseX, fujiBaseY);
  ctx.bezierCurveTo(
    fujiCenterX - 140, fujiBaseY - 14,
    fujiCenterX - 88, fujiPeakY + 38,
    leftPeakX, fujiPeakY
  );
  ctx.lineTo(rightPeakX, fujiPeakY);
  ctx.bezierCurveTo(
    fujiCenterX + 88, fujiPeakY + 38,
    fujiCenterX + 140, fujiBaseY - 14,
    rightBaseX, fujiBaseY
  );
  ctx.closePath();
  ctx.clip();

  // Snow fill: soft gradient from bright white with pink tint down to lavender
  const snowGrad = ctx.createLinearGradient(0, fujiPeakY, 0, fujiPeakY + 46);
  snowGrad.addColorStop(0, '#ffffff');
  snowGrad.addColorStop(0.3, '#fdf2f8');
  snowGrad.addColorStop(0.7, '#f5d0fe');
  snowGrad.addColorStop(1, '#c4b5fd');
  ctx.fillStyle = snowGrad;

  // Stepped snowline fingers
  ctx.beginPath();
  ctx.moveTo(fujiCenterX - 80, fujiPeakY + 36);
  const snowFlutes: [number, number][] = [
    [fujiCenterX - 66, fujiPeakY + 28],
    [fujiCenterX - 54, fujiPeakY + 24],
    [fujiCenterX - 42, fujiPeakY + 35],
    [fujiCenterX - 30, fujiPeakY + 26],
    [fujiCenterX - 18, fujiPeakY + 39],
    [fujiCenterX - 7, fujiPeakY + 28],
    [fujiCenterX + 5, fujiPeakY + 41],
    [fujiCenterX + 17, fujiPeakY + 31],
    [fujiCenterX + 30, fujiPeakY + 37],
    [fujiCenterX + 42, fujiPeakY + 26],
    [fujiCenterX + 54, fujiPeakY + 33],
    [fujiCenterX + 66, fujiPeakY + 28],
  ];

  snowFlutes.forEach(([fx, fy]) => {
    ctx.lineTo(fx, fy);
  });
  ctx.lineTo(rightPeakX + 36, fujiPeakY + 36);
  ctx.lineTo(rightPeakX + 8, fujiPeakY);
  ctx.lineTo(leftPeakX - 8, fujiPeakY);
  ctx.closePath();
  ctx.fill();

  // Crisp white highlight along the crest
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(leftPeakX, fujiPeakY);
  ctx.lineTo(rightPeakX, fujiPeakY);
  ctx.stroke();

  // Snow ridge shadow on left side
  ctx.fillStyle = 'rgba(167, 139, 250, 0.28)';
  ctx.beginPath();
  ctx.moveTo(leftPeakX, fujiPeakY);
  ctx.lineTo(fujiCenterX - 5, fujiPeakY + 2);
  ctx.lineTo(fujiCenterX - 18, fujiPeakY + 38);
  ctx.lineTo(leftPeakX - 20, fujiPeakY + 28);
  ctx.closePath();
  ctx.fill();

  ctx.restore();

  // 5. Gentle glowing mist at Fuji's foothills
  const mistGrad = ctx.createLinearGradient(0, 135, 0, fujiBaseY);
  mistGrad.addColorStop(0, 'rgba(244, 114, 182, 0)');
  mistGrad.addColorStop(0.5, 'rgba(244, 114, 182, 0.22)');
  mistGrad.addColorStop(1, 'rgba(251, 113, 133, 0.28)');
  ctx.fillStyle = mistGrad;
  ctx.fillRect(Math.max(0, fujiCenterX - 220), 132, 440, 26);
}

// Helper for drawing cute floaty twilight clouds
function drawFloatyCloud(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number,
  opacity: number = 0.38
) {
  ctx.save();
  ctx.fillStyle = `rgba(253, 164, 175, ${opacity})`;
  ctx.beginPath();
  ctx.ellipse(cx, cy, 46 * scale, 6.5 * scale, 0, 0, Math.PI * 2);
  ctx.ellipse(cx - 16 * scale, cy - 3 * scale, 24 * scale, 5.5 * scale, 0, 0, Math.PI * 2);
  ctx.ellipse(cx + 14 * scale, cy - 2 * scale, 20 * scale, 4.8 * scale, 0, 0, Math.PI * 2);
  ctx.ellipse(cx - 28 * scale, cy + 1 * scale, 15 * scale, 3.8 * scale, 0, 0, Math.PI * 2);
  ctx.ellipse(cx + 28 * scale, cy + 1 * scale, 14 * scale, 3.4 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  // Gentle white highlight crest
  ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.45})`;
  ctx.beginPath();
  ctx.ellipse(cx - 10 * scale, cy - 4.5 * scale, 18 * scale, 2.5 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function renderWorld(
  ctx: CanvasRenderingContext2D,
  time: number,
  player: PlayerState,
  lighting: LightingMode,
  discoveredNoteIds: number[],
  nearbyObject: WorldObject | null,
  particles: Particle[],
  isVampireSpeaking: boolean = false,
  isParkCheering: boolean = false
) {
  ctx.save();
  // Allow smooth anti-aliased circles & thin 1px strokes
  ctx.imageSmoothingEnabled = true;

  // =========================================================================
  // 1. EXTENDED TOP SKY & MOUNT FUJI (1000 x 160)
  // Sunsetty pinkish-violet twilight night palette
  // =========================================================================
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 160);
  skyGrad.addColorStop(0, '#0f081d');    // Deep cosmic violet-black night zenith
  skyGrad.addColorStop(0.22, '#230f36'); // Rich amethyst twilight
  skyGrad.addColorStop(0.45, '#4a144e'); // Dusky plum purple
  skyGrad.addColorStop(0.68, '#7e1c5f'); // Glowing sunset magenta
  skyGrad.addColorStop(0.85, '#b92f77'); // Warm sunset rose-pink
  skyGrad.addColorStop(0.94, '#df548d'); // Soft glowing twilight pink
  skyGrad.addColorStop(1.0, '#fda4af');  // Warm peach horizon line

  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, WORLD_WIDTH, 160);

  // Twinkling stars in the upper deep violet night sky
  const starPositions = [
    [52, 14], [95, 26], [148, 18], [215, 32], [285, 16],
    [355, 24], [630, 20], [695, 15], [755, 28], [815, 18],
    [860, 28], [935, 16], [970, 26],
  ];
  starPositions.forEach(([sx, sy], idx) => {
    const twinkle = Math.sin(time * 0.005 + idx * 1.3) > 0;
    const starColor = idx % 3 === 0 ? '#fef08a' : idx % 3 === 1 ? '#fbcfe8' : '#e9d5ff';
    fillCircle(ctx, sx, sy, twinkle ? 1.4 : 0.9, starColor);
  });

  // Glowing Harvest Moon (upper right sky) with soft rosy-gold halo - bigger as requested!
  const moonX = 860;
  const moonY = 46;
  const moonR = 30;

  const moonHalo = ctx.createRadialGradient(moonX, moonY, moonR * 0.4, moonX, moonY, moonR * 2.5);
  moonHalo.addColorStop(0, 'rgba(254, 240, 138, 0.48)');
  moonHalo.addColorStop(0.35, 'rgba(251, 113, 133, 0.30)');
  moonHalo.addColorStop(0.7, 'rgba(244, 114, 182, 0.15)');
  moonHalo.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = moonHalo;
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonR * 2.5, 0, Math.PI * 2);
  ctx.fill();

  fillCircle(ctx, moonX, moonY, moonR, '#fef08a');
  fillCircle(ctx, moonX, moonY, moonR - 2.2, '#fef9c3');
  // Moon craters/textures scaled to new moon size
  fillCircle(ctx, moonX - 8, moonY - 7, 5, 'rgba(217, 119, 6, 0.22)');
  fillCircle(ctx, moonX + 8, moonY + 5, 4.2, 'rgba(217, 119, 6, 0.20)');
  fillCircle(ctx, moonX - 3, moonY + 10, 3.5, 'rgba(217, 119, 6, 0.18)');
  fillCircle(ctx, moonX + 11, moonY - 8, 3, 'rgba(217, 119, 6, 0.16)');

  // Draw Mount Fuji in the background behind the rooftops!
  drawMountFuji(ctx, time);

  // Floaty clouds:
  // 1. One lil cute cloud hovering directly over Mount Fuji's peak (Kasagumo)
  const fujiPeakCloudBobX = Math.sin(time * 0.0016) * 2.5;
  const fujiPeakCloudBobY = Math.cos(time * 0.0022) * 1.5;
  drawFloatyCloud(ctx, 220 + fujiPeakCloudBobX, 40 + fujiPeakCloudBobY, 0.68, 0.52);

  // 2. Floaty cloud to the right of Mount Fuji
  const cloud1Bob = Math.sin(time * 0.0022 + 0.8) * 2.5;
  drawFloatyCloud(ctx, 420, 84 + cloud1Bob, 1.1, 0.42);

  // 3. Floaty cloud in the mid-right sky between Fuji and Moon
  const cloud2Bob = Math.cos(time * 0.0019 + 2.1) * 2.2;
  drawFloatyCloud(ctx, 620, 66 + cloud2Bob, 0.95, 0.38);

  // 4. Floaty cloud near the Harvest Moon
  const cloud3Bob = Math.sin(time * 0.0024 + 3.4) * 2.0;
  drawFloatyCloud(ctx, 755, 96 + cloud3Bob, 0.85, 0.35);

  // Distant Tokyo wooden rooftops / city skyline silhouette layered in front of Fuji's base
  for (let rx = 0; rx < WORLD_WIDTH; rx += 70) {
    const roofH = 26 + ((rx * 7) % 20);
    fillRect(ctx, rx, 155 - roofH, 66, roofH + 5, '#160a22');
    fillRect(ctx, rx + 2, 155 - roofH + 2, 62, roofH + 1, '#1b0d2a');
    if (rx % 140 === 0) {
      fillRect(ctx, rx + 18, 155 - roofH + 8, 4, 4, '#fbbf24');
      fillRect(ctx, rx + 26, 155 - roofH + 8, 4, 4, '#f472b6');
    }
  }

  // Skyline spires / Tokyo silhouettes
  const spires = [220, 480, 640, 810];
  spires.forEach((sx) => {
    fillRect(ctx, sx, 122, 2, 30, '#1b0d2a');
    fillRect(ctx, sx - 2, 130, 6, 1.5, '#1b0d2a');
    fillCircle(ctx, sx + 1, 122, 1.2, '#f472b6');
  });

  // Delicate power lines across the twilight sky in front of Fuji
  ctx.strokeStyle = 'rgba(25, 12, 35, 0.65)';
  ctx.lineWidth = 0.85;
  ctx.beginPath();
  ctx.moveTo(0, 102);
  ctx.quadraticCurveTo(500, 128, WORLD_WIDTH, 98);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, 110);
  ctx.quadraticCurveTo(500, 136, WORLD_WIDTH, 106);
  ctx.stroke();

  // Shift world rendering down by SKY_OFFSET so playable area starts at y = 155
  ctx.save();
  ctx.translate(0, SKY_OFFSET);

  // =========================================================================
  // 2. NORTH ZONE (Shops & Shrine, Y: 20-225)
  // =========================================================================
  fillRect(ctx, 0, 75, WORLD_WIDTH, 150, '#231f2e');

  // --- 2A. Top-Left: Mossy Shrine Sanctuary (X: 16-310, Y: 68-225) ---
  // Atmospheric sacred moss garden with organic cedar/moss gradient
  const shrineGardenGrad = ctx.createLinearGradient(18, 78, 18, 220);
  shrineGardenGrad.addColorStop(0, '#131f18');
  shrineGardenGrad.addColorStop(0.5, '#19281f');
  shrineGardenGrad.addColorStop(1, '#111b15');
  ctx.fillStyle = shrineGardenGrad;
  ctx.fillRect(18, 78, 290, 142);

  // Weathered granite border kerbing around sacred ground
  fillRect(ctx, 16, 76, 294, 2, '#2f3b33');
  fillRect(ctx, 16, 76, 2, 146, '#2f3b33');
  fillRect(ctx, 308, 76, 2, 146, '#26312a');

  // Rich layered velvety moss cushions with subtle highlights
  const mossCircles = [
    [42, 98, 15], [258, 96, 19], [52, 196, 17], [142, 102, 12], [278, 200, 15],
    [92, 108, 10], [225, 114, 11],
  ];
  mossCircles.forEach(([mx, my, mr]) => {
    fillCircle(ctx, mx, my, mr, '#14532d');
    fillCircle(ctx, mx - 1, my - 1, mr * 0.75, '#166534');
    fillCircle(ctx, mx - 2, my - 2, mr * 0.45, '#15803d');
  });

  // Stone paver color palette matching the sidewalks
  const stonePaverPalette = ['#334155', '#3f3f46', '#475569', '#384252', '#52525b', '#475161'];

  // Sandō (参道) Sacred Interlocking Cut Granite Stone Pathway - Centered directly through Torii Gate (X: 144 to 196)
  const sandoW = 52;
  const sandoStartX = 170 - sandoW / 2; // Exactly 144
  const sandoPaverW = 26;
  const sandoPaverH = 14;

  // Bedding mortar base for sacred stone path
  fillRect(ctx, sandoStartX - 1, 78, sandoW + 2, 147, '#1e293b');

  for (let py = 78; py < 225; py += sandoPaverH) {
    const rowIdx = Math.floor((py - 78) / sandoPaverH);
    const isStaggered = rowIdx % 2 === 1;

    if (!isStaggered) {
      for (let c = 0; c < 2; c++) {
        const px = sandoStartX + c * sandoPaverW;
        const colorIdx = Math.abs(Math.floor((px * 7 + py * 19) / 26)) % stonePaverPalette.length;
        fillRect(ctx, px + 1, py + 1, sandoPaverW - 2, sandoPaverH - 2, stonePaverPalette[colorIdx]);
        fillRect(ctx, px + 1, py + 1, sandoPaverW - 2, 1, 'rgba(255, 255, 255, 0.16)');
        fillRect(ctx, px + 1, py + 1, 1, sandoPaverH - 2, 'rgba(255, 255, 255, 0.12)');
        fillRect(ctx, px + 1, py + sandoPaverH - 2, sandoPaverW - 2, 1, 'rgba(0, 0, 0, 0.32)');
        fillRect(ctx, px + sandoPaverW - 2, py + 1, 1, sandoPaverH - 2, 'rgba(0, 0, 0, 0.32)');
      }
    } else {
      const splits = [
        { x: sandoStartX, w: 13 },
        { x: sandoStartX + 13, w: 26 },
        { x: sandoStartX + 39, w: 13 },
      ];
      splits.forEach(({ x: px, w: pw }) => {
        const colorIdx = Math.abs(Math.floor((px * 11 + py * 23) / 26)) % stonePaverPalette.length;
        fillRect(ctx, px + 1, py + 1, pw - 2, sandoPaverH - 2, stonePaverPalette[colorIdx]);
        fillRect(ctx, px + 1, py + 1, pw - 2, 1, 'rgba(255, 255, 255, 0.16)');
        fillRect(ctx, px + 1, py + 1, 1, sandoPaverH - 2, 'rgba(255, 255, 255, 0.12)');
        fillRect(ctx, px + 1, py + sandoPaverH - 2, pw - 2, 1, 'rgba(0, 0, 0, 0.32)');
        fillRect(ctx, px + pw - 2, py + 1, 1, sandoPaverH - 2, 'rgba(0, 0, 0, 0.32)');
      });
    }

    if (py % 28 === 0) {
      fillCircle(ctx, sandoStartX - 0.5, py + 4, 1.5, '#15803d');
      fillCircle(ctx, sandoStartX + sandoW + 0.5, py + 9, 1.5, '#15803d');
    }
  }

  // Bamboo partition fence along back & right edge of shrine (3D stalks with nodes & ties)
  for (let bx = 22; bx < 300; bx += 8) {
    fillRect(ctx, bx, 66, 5, 26, '#365314');
    fillRect(ctx, bx + 1, 66, 2.5, 26, '#65a30d');
    fillRect(ctx, bx, 72, 5, 1.2, '#1a2e05');
    fillRect(ctx, bx, 82, 5, 1.2, '#1a2e05');
  }
  fillRect(ctx, 20, 75, 284, 2.5, '#4d7c0f');
  fillRect(ctx, 20, 76, 284, 1, '#1a2e05');

  for (let by = 75; by < 215; by += 10) {
    fillRect(ctx, 304, by, 5, 8, '#4d7c0f');
    fillRect(ctx, 305, by, 2.5, 8, '#65a30d');
    fillRect(ctx, 304, by + 4, 5, 1, '#1a2e05');
  }

  // Object #13: Pumpkin-Lit Shrine Torii Gate (Enlarged & Centered at X: 170, Y: 128)
  const toriiCenterX = 170;
  const toriiY = 74;
  const toriiPillarSpan = 36; // Left pillar at 170-36=134, Right pillar at 170+36=206

  // Ground shadow under Torii gate
  fillRect(ctx, toriiCenterX - 48, toriiY + 92, 96, 4, 'rgba(0,0,0,0.52)');

  // Base shoes (Kamebara / Daiishi) in black polished lacquer with gold accent
  const leftShoeX = toriiCenterX - toriiPillarSpan - 7; // 127
  const rightShoeX = toriiCenterX + toriiPillarSpan - 5; // 201
  // Left shoe
  fillRect(ctx, leftShoeX, toriiY + 80, 14, 14, '#18181b');
  fillRect(ctx, leftShoeX + 1, toriiY + 81, 12, 12, '#27272a');
  fillRect(ctx, leftShoeX, toriiY + 84, 14, 1.4, '#f59e0b');
  // Right shoe
  fillRect(ctx, rightShoeX, toriiY + 80, 14, 14, '#18181b');
  fillRect(ctx, rightShoeX + 1, toriiY + 81, 12, 12, '#27272a');
  fillRect(ctx, rightShoeX, toriiY + 84, 14, 1.4, '#f59e0b');

  // Vermilion cylindrical pillars (Hashira) with rich lacquer 3D lighting (Taller & Grander)
  const leftColX = toriiCenterX - toriiPillarSpan - 5; // 129
  const rightColX = toriiCenterX + toriiPillarSpan - 5; // 201
  const pillarH = 72;

  // Left pillar
  fillRect(ctx, leftColX - 1, toriiY + 12, 12, pillarH, '#7f1d1d');
  fillRect(ctx, leftColX, toriiY + 12, 10, pillarH, '#b91c1c');
  fillRect(ctx, leftColX + 2, toriiY + 12, 5, pillarH, '#ef4444');
  fillRect(ctx, leftColX + 3.5, toriiY + 12, 2, pillarH, '#fca5a5');
  // Right pillar
  fillRect(ctx, rightColX - 1, toriiY + 12, 12, pillarH, '#7f1d1d');
  fillRect(ctx, rightColX, toriiY + 12, 10, pillarH, '#b91c1c');
  fillRect(ctx, rightColX + 2, toriiY + 12, 5, pillarH, '#ef4444');
  fillRect(ctx, rightColX + 3.5, toriiY + 12, 2, pillarH, '#fca5a5');

  // Top curved Kasagi lintel (Enlarged, spanning 116px from X: 112 to 228)
  const kasagiLeft = toriiCenterX - 58;
  const kasagiRight = toriiCenterX + 58;
  ctx.fillStyle = '#18181b';
  ctx.beginPath();
  ctx.moveTo(kasagiLeft - 3, toriiY - 1);
  ctx.quadraticCurveTo(toriiCenterX, toriiY + 3, kasagiRight + 3, toriiY - 1);
  ctx.lineTo(kasagiRight + 5, toriiY + 5);
  ctx.quadraticCurveTo(toriiCenterX, toriiY + 9, kasagiLeft - 5, toriiY + 5);
  ctx.closePath();
  ctx.fill();

  // Vermilion Kasagi face with golden corner caps
  fillRect(ctx, kasagiLeft + 2, toriiY + 5, 112, 8, '#b91c1c');
  fillRect(ctx, kasagiLeft + 2, toriiY + 6, 112, 4, '#ef4444');
  fillRect(ctx, kasagiLeft - 1, toriiY + 5, 4, 8, '#f59e0b');
  fillRect(ctx, kasagiRight - 3, toriiY + 5, 4, 8, '#f59e0b');

  // Secondary Nuki crossbar with wooden wedges
  const nukiLeft = toriiCenterX - 48;
  fillRect(ctx, nukiLeft, toriiY + 24, 96, 6, '#7f1d1d');
  fillRect(ctx, nukiLeft + 1, toriiY + 25, 94, 4, '#dc2626');
  // Mortise wedges (Kusabi)
  fillRect(ctx, leftColX - 4, toriiY + 23, 2.5, 8, '#450a0a');
  fillRect(ctx, rightColX + 11.5, toriiY + 23, 2.5, 8, '#450a0a');

  // Central Tablet (Gakuzuka) in black lacquer with golden shrine emblem
  fillRect(ctx, toriiCenterX - 7, toriiY + 11, 14, 16, '#18181b');
  fillRect(ctx, toriiCenterX - 6, toriiY + 12, 12, 14, '#311042');
  fillRect(ctx, toriiCenterX - 6, toriiY + 12, 12, 1.4, '#f59e0b');
  fillRect(ctx, toriiCenterX - 6, toriiY + 24.6, 12, 1.4, '#f59e0b');
  fillCircle(ctx, toriiCenterX, toriiY + 19, 3, '#fbbf24');

  // Sacred Shimenawa straw rope with twisted fiber texture
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 2.8;
  ctx.beginPath();
  ctx.moveTo(leftColX + 5, toriiY + 31);
  ctx.quadraticCurveTo(toriiCenterX, toriiY + 36, rightColX + 5, toriiY + 31);
  ctx.stroke();
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(leftColX + 5, toriiY + 31);
  ctx.quadraticCurveTo(toriiCenterX, toriiY + 36, rightColX + 5, toriiY + 31);
  ctx.stroke();

  // Zig-zag folded white paper Shide streamers with clean geometric drop
  const shidePositions = [toriiCenterX - 22, toriiCenterX, toriiCenterX + 22];
  shidePositions.forEach((sx) => {
    fillRect(ctx, sx - 2, toriiY + 34, 5, 3.5, '#ffffff');
    fillRect(ctx, sx, toriiY + 37.5, 5, 3.5, '#f1f5f9');
    fillRect(ctx, sx - 2, toriiY + 41, 5, 4.5, '#e2e8f0');
    fillRect(ctx, sx - 1, toriiY + 34, 1, 11, 'rgba(0,0,0,0.18)');
  });

  // Carved Jack-o'-lanterns flanking outside the Torii gate
  drawKabochaPumpkin(ctx, leftShoeX - 10, toriiY + 88, 8.5, time, 1);
  drawKabochaPumpkin(ctx, rightShoeX + 22, toriiY + 88, 8.5, time, 2);

  // Object #3: Haunted Shrine Stone Lantern (Tōrō) with dancing purple flame (X: 92, Y: 162)
  const lanternX = 74;
  const lanternY = 132;
  // Multi-tiered granite base
  fillRect(ctx, lanternX + 4, lanternY + 48, 28, 5, '#1e293b');
  fillRect(ctx, lanternX + 6, lanternY + 45, 24, 4, '#334155');
  fillRect(ctx, lanternX + 7, lanternY + 45, 22, 1.2, '#64748b');
  // Chiseled central shaft (Sao)
  fillRect(ctx, lanternX + 11, lanternY + 25, 14, 21, '#475569');
  fillRect(ctx, lanternX + 13, lanternY + 25, 4, 21, '#64748b');
  fillRect(ctx, lanternX + 21, lanternY + 25, 4, 21, '#334155');
  // Middle platform (Chūdai)
  fillRect(ctx, lanternX + 6, lanternY + 21, 24, 5, '#334155');
  fillRect(ctx, lanternX + 7, lanternY + 21, 22, 1.2, '#64748b');

  // Hollowed-out Fire Chamber (Hibukuro) with dancing purple flame
  fillRect(ctx, lanternX + 8, lanternY + 9, 20, 13, '#1e1b4b');
  // Stone corner window posts
  fillRect(ctx, lanternX + 8, lanternY + 9, 3, 13, '#475569');
  fillRect(ctx, lanternX + 25, lanternY + 9, 3, 13, '#334155');

  // Soft glowing purple aura inside the chamber
  const flameBob = Math.sin(time * 0.01) * 1.5;
  const fireCx = lanternX + 18;
  const fireCy = lanternY + 15 + flameBob;
  const fireGlow = ctx.createRadialGradient(fireCx, fireCy, 1, fireCx, fireCy, 14);
  fireGlow.addColorStop(0, 'rgba(192, 132, 252, 0.6)');
  fireGlow.addColorStop(1, 'rgba(192, 132, 252, 0)');
  ctx.fillStyle = fireGlow;
  ctx.beginPath();
  ctx.arc(fireCx, fireCy, 14, 0, Math.PI * 2);
  ctx.fill();

  // Cute dancing violet kitsune-bi flame
  fillCircle(ctx, fireCx, fireCy, 3.8, '#a855f7');
  fillCircle(ctx, fireCx, fireCy - 0.5, 2.2, '#c084fc');
  fillCircle(ctx, fireCx, fireCy - 1, 1.2, '#ffffff');

  // Multi-tier pagoda roof cap (Kasa) with moss patina
  fillRect(ctx, lanternX + 3, lanternY + 5, 30, 5, '#334155');
  fillRect(ctx, lanternX + 4, lanternY + 5, 28, 1.2, '#64748b');
  fillRect(ctx, lanternX + 8, lanternY + 1, 20, 5, '#475569');
  fillRect(ctx, lanternX + 9, lanternY + 1, 18, 1.2, '#64748b');
  // Jewel finial (Hōju)
  fillCircle(ctx, lanternX + 18, lanternY, 2.8, '#15803d');
  fillCircle(ctx, lanternX + 18, lanternY - 1, 1.5, '#4ade80');

  // Object #12: Spooky Bonsai with Paper Bat (X: 242, Y: 175)
  const bonsaiX = 226;
  const bonsaiY = 152;
  // Glazed celadon ceramic planter with brass feet
  fillRect(ctx, bonsaiX + 3, bonsaiY + 34, 28, 3, '#1e293b');
  fillRect(ctx, bonsaiX + 5, bonsaiY + 24, 24, 10, '#0f766e');
  fillRect(ctx, bonsaiX + 3, bonsaiY + 22, 28, 3, '#14b8a6');
  fillRect(ctx, bonsaiX + 3, bonsaiY + 22, 28, 1, '#5eead4');
  // Brass planter feet
  fillRect(ctx, bonsaiX + 6, bonsaiY + 34, 4, 2, '#d97706');
  fillRect(ctx, bonsaiX + 24, bonsaiY + 34, 4, 2, '#d97706');

  // Gnarled aged pine trunk
  ctx.strokeStyle = '#5c2409';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(bonsaiX + 17, bonsaiY + 22);
  ctx.quadraticCurveTo(bonsaiX + 13, bonsaiY + 13, bonsaiX + 20, bonsaiY + 8);
  ctx.stroke();
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(bonsaiX + 17, bonsaiY + 22);
  ctx.quadraticCurveTo(bonsaiX + 13, bonsaiY + 13, bonsaiX + 20, bonsaiY + 8);
  ctx.stroke();

  // Dense tiered pine needle foliage pads (Matsukasa)
  fillCircle(ctx, bonsaiX + 11, bonsaiY + 11, 7.5, '#14532d');
  fillCircle(ctx, bonsaiX + 10, bonsaiY + 10, 5.5, '#166534');
  fillCircle(ctx, bonsaiX + 22, bonsaiY + 7, 8.5, '#14532d');
  fillCircle(ctx, bonsaiX + 21, bonsaiY + 6, 6.5, '#166534');
  fillCircle(ctx, bonsaiX + 22, bonsaiY + 5, 3.5, '#15803d');

  // Hanging violet origami bat suspended on thin thread
  const batBob = Math.sin(time * 0.008) * 1.5;
  fillRect(ctx, bonsaiX + 25, bonsaiY + 11, 1, 6, 'rgba(226,232,240,0.75)');
  fillCircle(ctx, bonsaiX + 25, bonsaiY + 18 + batBob, 2.6, '#3b0764');
  // Dainty angled origami wings
  ctx.fillStyle = '#6b21a8';
  ctx.beginPath();
  ctx.moveTo(bonsaiX + 21, bonsaiY + 19 + batBob);
  ctx.lineTo(bonsaiX + 25, bonsaiY + 17 + batBob);
  ctx.lineTo(bonsaiX + 29, bonsaiY + 19 + batBob);
  ctx.lineTo(bonsaiX + 25, bonsaiY + 20 + batBob);
  ctx.closePath();
  ctx.fill();
  fillCircle(ctx, bonsaiX + 24.2, bonsaiY + 17.5 + batBob, 0.6, '#fef08a');
  fillCircle(ctx, bonsaiX + 25.8, bonsaiY + 17.5 + batBob, 0.6, '#fef08a');

  // --- 2B. Top-Center: Traditional Ramen Bar ("🎃 ハロウィン ラーメン", X: 318-652, Y: 62-225) ---
  const ramenX = 322;
  const ramenY = 64;
  const ramenW = 326;
  fillRect(ctx, ramenX, ramenY + 24, ramenW, 130, '#271712');
  fillRect(ctx, ramenX + 4, ramenY + 28, ramenW - 8, 122, '#3b2116');

  // Kawara roof tiles with thin 1px dividers
  fillRect(ctx, ramenX - 6, ramenY, ramenW + 12, 26, '#1e293b');
  for (let tx = ramenX - 4; tx < ramenX + ramenW + 4; tx += 12) {
    fillRect(ctx, tx, ramenY + 2, 10, 22, '#334155');
    fillCircle(ctx, tx + 5, ramenY + 23, 3, '#94a3b8');
  }
  // Wooden signboard on roof eaves
  fillRect(ctx, ramenX + 48, ramenY + 5, 230, 20, '#451a03');
  fillRect(ctx, ramenX + 49, ramenY + 6, 228, 18, '#fef3c7');
  ctx.font = 'bold 8px "Press Start 2P", monospace';
  ctx.fillStyle = '#ea580c';
  ctx.textAlign = 'center';
  ctx.fillText('🍜 HALLOWEEN RAMEN SHOP 🎃', ramenX + ramenW / 2, ramenY + 18);
  ctx.textAlign = 'start';

  // Hanging orange/purple triangle pennant bunting on thin cord
  for (let px = ramenX + 10; px < ramenX + ramenW - 16; px += 16) {
    const isOrange = Math.floor(px / 16) % 2 === 0;
    ctx.fillStyle = isOrange ? '#ea580c' : '#7c3aed';
    ctx.beginPath();
    ctx.moveTo(px, ramenY + 28);
    ctx.lineTo(px + 12, ramenY + 28);
    ctx.lineTo(px + 6, ramenY + 38);
    ctx.closePath();
    ctx.fill();
  }

  // Glowing Shoji paper sliding doors with delicate 1px lattice lines
  const shojiGlow = lighting === 'day' ? '#fde68a' : '#f59e0b';
  fillRect(ctx, ramenX + 22, ramenY + 52, 68, 92, '#451a03');
  fillRect(ctx, ramenX + 24, ramenY + 54, 64, 88, shojiGlow);
  for (let gx = ramenX + 45; gx < ramenX + 86; gx += 21) {
    fillRect(ctx, gx, ramenY + 54, 1, 88, '#78350f');
  }
  for (let gy = ramenY + 74; gy < ramenY + 138; gy += 18) {
    fillRect(ctx, ramenX + 24, gy, 64, 1, '#78350f');
  }

  // Right shoji window with 1px lattice
  fillRect(ctx, ramenX + 228, ramenY + 52, 64, 92, '#451a03');
  fillRect(ctx, ramenX + 230, ramenY + 54, 60, 88, shojiGlow);
  for (let gx = ramenX + 250; gx < ramenX + 286; gx += 20) {
    fillRect(ctx, gx, ramenY + 54, 1, 88, '#78350f');
  }
  for (let gy = ramenY + 74; gy < ramenY + 138; gy += 18) {
    fillRect(ctx, ramenX + 230, gy, 60, 1, '#78350f');
  }

  // Object #11: Ghost & Bat Ramen Noren Curtain (X: 495, Y: 162)
  const norenX = 452;
  const norenY = 114;
  fillRect(ctx, norenX, norenY, 86, 98, '#18100e');
  const norenSway = Math.sin(time * 0.004) * 1.5;
  for (let panel = 0; panel < 3; panel++) {
    const px = norenX + 3 + panel * 28 + norenSway;
    fillRect(ctx, px, norenY + 2, 24, 44, '#312e81');
    fillRect(ctx, px + 1, norenY + 3, 22, 41, '#3730a3');
    if (panel === 1) {
      fillCircle(ctx, px + 12, norenY + 20, 6, '#f8fafc');
      fillRect(ctx, px + 6, norenY + 20, 12, 8, '#f8fafc');
      fillCircle(ctx, px + 10, norenY + 19, 1, '#1e1b4b');
      fillCircle(ctx, px + 14, norenY + 19, 1, '#1e1b4b');
    } else {
      fillCircle(ctx, px + 12, norenY + 21, 3, '#f59e0b');
      fillRect(ctx, px + 6, norenY + 20, 12, 2, '#f59e0b');
    }
  }

  // Object #1: Swaying Jack-o'-Lantern Chōchin (Ramen Lantern, X: 410, Y: 158)
  const chochinSway = Math.sin(time * 0.0055) * 3.5;
  const chochinX = 410 + chochinSway;
  const chochinY = 148;
  // Thin hanging cord
  fillRect(ctx, 410, 110, 1, 22, '#78350f');
  // Plump rounded chōchin body
  ctx.fillStyle = '#ea580c';
  ctx.beginPath();
  ctx.ellipse(chochinX, chochinY, 13, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f97316';
  ctx.beginPath();
  ctx.ellipse(chochinX, chochinY, 10, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  // Top & bottom thin rims
  fillRect(ctx, chochinX - 7, chochinY - 15, 14, 3, '#18181b');
  fillRect(ctx, chochinX - 7, chochinY + 13, 14, 3, '#18181b');
  // Glowing pumpkin face on lantern
  fillCircle(ctx, chochinX - 4, chochinY - 2, 2, '#fef08a');
  fillCircle(ctx, chochinX + 4, chochinY - 2, 2, '#fef08a');
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(chochinX, chochinY + 2, 5, 0.2, Math.PI - 0.2);
  ctx.stroke();

  // Object #19: Witch's Broom & Purple Umbrella Stand (X: 602, Y: 176)
  const standX = 590;
  const standY = 154;
  fillRect(ctx, standX + 5, standY + 24, 20, 24, '#334155');
  fillRect(ctx, standX + 4, standY + 22, 22, 2, '#475569');
  // Thin bamboo broom handle & bristles
  fillRect(ctx, standX + 9, standY - 4, 2, 28, '#92400e');
  fillCircle(ctx, standX + 10, standY - 8, 5.5, '#d97706');
  fillRect(ctx, standX + 7, standY - 4, 6, 1.5, '#7c3aed');
  // Folded purple wagasa umbrella
  fillRect(ctx, standX + 17, standY + 2, 3, 22, '#7c3aed');
  fillRect(ctx, standX + 18, standY - 3, 1.5, 6, '#f59e0b');

  // --- 2C. Top-Right: 24H Laundromat & Arcade Alley (X: 662-982, Y: 64-225) ---
  const laundryX = 664;
  const laundryY = 64;
  const laundryW = 314;

  // Main retro cream/slate mosaic tile building body
  fillRect(ctx, laundryX, laundryY + 22, laundryW, 134, '#1e1b2e');
  fillRect(ctx, laundryX + 3, laundryY + 25, laundryW - 6, 128, '#28233d');

  // Subtle horizontal retro tile lines on facade
  ctx.fillStyle = 'rgba(148, 163, 184, 0.1)';
  for (let ty = laundryY + 46; ty < laundryY + 150; ty += 10) {
    ctx.fillRect(laundryX + 4, ty, laundryW - 8, 1);
  }

  // Wooden wainscoting base along bottom of shopfront
  fillRect(ctx, laundryX + 3, laundryY + 132, laundryW - 6, 21, '#3b2116');
  fillRect(ctx, laundryX + 3, laundryY + 131, laundryW - 6, 1.5, '#f59e0b');

  // Rounded Vintage Neon Capsule Marquee Signboard on Roof
  ctx.fillStyle = '#1e1035';
  ctx.beginPath();
  ctx.roundRect(laundryX + 8, laundryY - 1, laundryW - 16, 24, 11);
  ctx.fill();
  ctx.strokeStyle = '#a855f7';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#3b0764';
  ctx.beginPath();
  ctx.roundRect(laundryX + 11, laundryY + 2, laundryW - 22, 18, 8);
  ctx.fill();

  // Cute glowing stars & neon text on marquee
  fillCircle(ctx, laundryX + 24, laundryY + 11, 2, '#fde047');
  fillCircle(ctx, laundryX + laundryW - 24, laundryY + 11, 2, '#fde047');
  ctx.font = 'bold 8px "Press Start 2P", monospace';
  ctx.fillStyle = '#67e8f9';
  ctx.textAlign = 'center';
  ctx.fillText('👻 24H GHOST LAUNDROMAT 🫧', laundryX + laundryW / 2, laundryY + 15);
  ctx.textAlign = 'start';

  // Striped Scalloped Shop Awning under the neon sign
  const stripeCount = 16;
  const stripeW = (laundryW - 8) / stripeCount;
  for (let s = 0; s < stripeCount; s++) {
    const sx = laundryX + 4 + s * stripeW;
    const isTeal = s % 2 === 0;
    const stripeColor = isTeal ? '#0d9488' : '#fef3c7';
    fillRect(ctx, sx, laundryY + 23, stripeW + 0.5, 11, stripeColor);
    // Cute rounded scalloped edge at bottom of each stripe
    fillCircle(ctx, sx + stripeW / 2, laundryY + 34, stripeW / 2, stripeColor);
  }
  // Thin golden trim line across awning top
  fillRect(ctx, laundryX + 4, laundryY + 23, laundryW - 8, 1.5, '#f59e0b');

  // Cozy Panoramic Left Window (Arcade & Folding Lounge Inside, X: 672-720)
  const winX = 673;
  const winY = 108;
  fillRect(ctx, winX, winY, 44, 72, '#451a03'); // Warm timber window frame
  fillRect(ctx, winX + 2, winY + 2, 40, 68, '#fef3c7'); // Warm cozy interior glow
  fillRect(ctx, winX + 2, winY + 2, 40, 68, 'rgba(251, 191, 36, 0.22)');
  // Mini retro arcade cabinet inside left window
  fillRect(ctx, winX + 6, winY + 24, 16, 44, '#6d28d9');
  fillRect(ctx, winX + 8, winY + 29, 12, 10, '#38bdf8'); // Arcade screen
  fillCircle(ctx, winX + 11, winY + 43, 1.2, '#f43f5e'); // Arcade joystick
  // Stacked pastel towels on wooden bench inside window
  fillRect(ctx, winX + 25, winY + 54, 14, 14, '#78350f');
  fillRect(ctx, winX + 26, winY + 49, 12, 5, '#f472b6');
  fillRect(ctx, winX + 26, winY + 44, 12, 5, '#5eead4');
  // Cute hanging string lights inside window
  fillCircle(ctx, winX + 12, winY + 10, 2, '#f97316');
  fillCircle(ctx, winX + 22, winY + 12, 2, '#a855f7');
  fillCircle(ctx, winX + 32, winY + 10, 2, '#f97316');
  // Thin 1px window pane mullion
  fillRect(ctx, winX + 2, winY + 36, 40, 1, 'rgba(120, 53, 15, 0.45)');

  // Object #14: Haunted Laundromat Ghost Dryer (Vintage Cream & Teal Enamel Cabinet, X: 748, Y: 165)
  const dryerBoxX = 724;
  const dryerBoxY = 106;
  ctx.fillStyle = '#fef3c7';
  ctx.beginPath();
  ctx.roundRect(dryerBoxX, dryerBoxY, 58, 90, 5);
  ctx.fill();
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Retro teal top control header on dryer
  ctx.fillStyle = '#0d9488';
  ctx.beginPath();
  ctx.roundRect(dryerBoxX + 2, dryerBoxY + 2, 54, 15, 3);
  ctx.fill();
  fillRect(ctx, dryerBoxX + 6, dryerBoxY + 6, 14, 7, '#0f172a'); // LED timer
  fillCircle(ctx, dryerBoxX + 10, dryerBoxY + 9.5, 1.3, '#4ade80');
  fillCircle(ctx, dryerBoxX + 15, dryerBoxY + 9.5, 1.3, '#4ade80');
  fillCircle(ctx, dryerBoxX + 44, dryerBoxY + 9.5, 3, '#fbbf24'); // Temperature dial

  // Round brass-trimmed glass drum
  const drumCx = dryerBoxX + 29;
  const drumCy = dryerBoxY + 52;
  fillCircle(ctx, drumCx, drumCy, 23, '#d97706'); // Warm brass porthole outer ring
  fillCircle(ctx, drumCx, drumCy, 20.5, '#334155');
  fillCircle(ctx, drumCx, drumCy, 18, '#1e1b4b');

  // Cute spinning white sheet ghost costume inside the dryer
  const spinAngle = time * 0.0045;
  ctx.save();
  ctx.translate(drumCx, drumCy);
  ctx.rotate(spinAngle);
  fillCircle(ctx, 0, -2, 9.5, '#f8fafc');
  fillCircle(ctx, -5.5, 5.5, 4.5, '#e2e8f0');
  fillCircle(ctx, 5.5, 5.5, 4.5, '#e2e8f0');
  fillCircle(ctx, -3, -3, 1.4, '#0f172a');
  fillCircle(ctx, 3, -3, 1.4, '#0f172a');
  fillCircle(ctx, -5, -0.5, 1.4, '#f472b6'); // Blushing pink cheeks
  fillCircle(ctx, 5, -0.5, 1.4, '#f472b6');
  fillCircle(ctx, 6.5, 7.5, 3, '#a855f7'); // Tumbling purple witch sock
  ctx.restore();

  // Glass reflection arc on dryer window
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(drumCx, drumCy, 14, -Math.PI * 0.75, -Math.PI * 0.35);
  ctx.stroke();

  // Object #6: Yokai Halloween Gachapon Dispensers (X: 842, Y: 174)
  const gachaX = 804;
  const gachaY = 114;
  // Wooden display platform under Gachapon machines
  fillRect(ctx, gachaX - 4, gachaY + 80, 62, 6, '#451a03');
  // Cute mini purple roof cap over the Gachapon pair
  ctx.fillStyle = '#581c87';
  ctx.beginPath();
  ctx.roundRect(gachaX - 3, gachaY - 6, 60, 7, 3);
  ctx.fill();

  for (let col = 0; col < 2; col++) {
    const gx = gachaX + col * 29;
    const bodyColor = col === 0 ? '#e11d48' : '#7c3aed';
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.roundRect(gx, gachaY, 25, 80, 3);
    ctx.fill();

    // Clear glossy capsule windows (top & middle)
    fillRect(ctx, gx + 2, gachaY + 4, 21, 24, '#e0f2fe');
    fillRect(ctx, gx + 2, gachaY + 36, 21, 21, '#e0f2fe');
    // Colorful round capsules inside
    fillCircle(ctx, gx + 7, gachaY + 21, 3.3, '#f59e0b');
    fillCircle(ctx, gx + 14, gachaY + 22, 3.3, '#a855f7');
    fillCircle(ctx, gx + 18, gachaY + 18, 3.3, '#38bdf8');
    fillCircle(ctx, gx + 11, gachaY + 15, 3.3, '#10b981');
    fillCircle(ctx, gx + 8, gachaY + 50, 3.3, '#fbbf24');
    fillCircle(ctx, gx + 16, gachaY + 49, 3.3, '#ec4899');
    fillCircle(ctx, gx + 12, gachaY + 44, 3.3, '#f97316');

    // Chrome crank wheel & prize flap
    fillCircle(ctx, gx + 12.5, gachaY + 32, 3.5, '#f8fafc');
    fillCircle(ctx, gx + 12.5, gachaY + 32, 1.5, '#94a3b8');
    fillRect(ctx, gx + 6, gachaY + 64, 13, 10, '#1e293b');
  }

  // Object #20: Halloween Treat Pumpkin Can Bin (Cute Rounded Jack-o'-Lantern Bin, X: 928, Y: 178)
  const binX = 906;
  const binY = 142;
  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.beginPath();
  ctx.ellipse(binX + 18, binY + 55, 17, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  // Rounded orange pumpkin bin body
  ctx.fillStyle = '#ea580c';
  ctx.beginPath();
  ctx.roundRect(binX, binY + 10, 36, 45, 9);
  ctx.fill();
  ctx.fillStyle = '#f97316';
  ctx.beginPath();
  ctx.roundRect(binX + 3, binY + 12, 30, 41, 7);
  ctx.fill();
  // Cute green leaf-shaped dome lid
  ctx.fillStyle = '#15803d';
  ctx.beginPath();
  ctx.roundRect(binX - 1, binY + 5, 38, 7, 4);
  ctx.fill();
  fillRect(ctx, binX + 16, binY + 1, 4, 5, '#166534');
  // Happy recycling slots (eyes + curved smile slot)
  fillCircle(ctx, binX + 11, binY + 24, 3.8, '#18151f');
  fillCircle(ctx, binX + 25, binY + 24, 3.8, '#18151f');
  ctx.strokeStyle = '#18151f';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(binX + 18, binY + 31, 7, 0.2, Math.PI - 0.2);
  ctx.stroke();

  // =========================================================================
  // 3. CENTER ZONE (Main Street & Sidewalks, Y: 225-430)
  // =========================================================================
  // North and South Stone-Paved Sidewalks with interlocking cut granite pavers
  // Base mortar bed for north sidewalk (Y: 225-285)
  fillRect(ctx, 0, 225, WORLD_WIDTH, 60, '#1e293b');
  // Stone paved blocks on North sidewalk
  const paverW = 28;
  const paverH = 14;
  for (let row = 0; row < 4; row++) {
    const py = 225 + row * paverH;
    const xOffset = row % 2 === 0 ? 0 : -14;
    for (let px = xOffset; px < WORLD_WIDTH; px += paverW) {
      const stoneIdx = Math.abs(Math.floor((px * 7 + row * 19) / 28)) % stonePaverPalette.length;
      const stoneColor = stonePaverPalette[stoneIdx];
      // Draw stone paver
      fillRect(ctx, px + 1, py + 1, paverW - 2, paverH - 2, stoneColor);
      // Top and left edge highlight for 3D paver bevel
      fillRect(ctx, px + 1, py + 1, paverW - 2, 1, 'rgba(255, 255, 255, 0.16)');
      fillRect(ctx, px + 1, py + 1, 1, paverH - 2, 'rgba(255, 255, 255, 0.12)');
      // Bottom and right edge shadow
      fillRect(ctx, px + 1, py + paverH - 2, paverW - 2, 1, 'rgba(0, 0, 0, 0.32)');
      fillRect(ctx, px + paverW - 2, py + 1, 1, paverH - 2, 'rgba(0, 0, 0, 0.32)');
    }
  }

  // Raised chiseled granite curb along North sidewalk street edge (Y: 281-285)
  fillRect(ctx, 0, 281, WORLD_WIDTH, 4, '#1e293b');
  for (let cb = 0; cb < WORLD_WIDTH; cb += 36) {
    fillRect(ctx, cb + 1, 281, 34, 4, '#64748b');
    fillRect(ctx, cb + 1, 281, 34, 1, '#94a3b8');
  }

  // Base mortar bed for south sidewalk (Y: 385-435)
  fillRect(ctx, 0, 385, WORLD_WIDTH, 50, '#1e293b');
  // Stone paved blocks on South sidewalk
  const sPaverH = 12.5;
  for (let row = 0; row < 4; row++) {
    const py = 385 + row * sPaverH;
    const xOffset = row % 2 === 0 ? -14 : 0;
    for (let px = xOffset; px < WORLD_WIDTH; px += paverW) {
      const stoneIdx = Math.abs(Math.floor((px * 11 + row * 23) / 28)) % stonePaverPalette.length;
      const stoneColor = stonePaverPalette[stoneIdx];
      // Draw stone paver
      fillRect(ctx, px + 1, py + 1, paverW - 2, sPaverH - 2, stoneColor);
      // Bevel highlight
      fillRect(ctx, px + 1, py + 1, paverW - 2, 1, 'rgba(255, 255, 255, 0.16)');
      fillRect(ctx, px + 1, py + 1, 1, sPaverH - 2, 'rgba(255, 255, 255, 0.12)');
      // Bevel shadow
      fillRect(ctx, px + 1, py + sPaverH - 2, paverW - 2, 1, 'rgba(0, 0, 0, 0.32)');
      fillRect(ctx, px + paverW - 2, py + 1, 1, sPaverH - 2, 'rgba(0, 0, 0, 0.32)');
    }
  }

  // Raised chiseled granite curb along South sidewalk road edge (Y: 382-385)
  fillRect(ctx, 0, 382, WORLD_WIDTH, 3, '#1e293b');
  for (let cb = 0; cb < WORLD_WIDTH; cb += 36) {
    fillRect(ctx, cb + 1, 382, 34, 3, '#64748b');
    fillRect(ctx, cb + 1, 382, 34, 1, '#94a3b8');
  }

  // Tactile Guide Tiles (点字ブロック - Tenji Blocks) sitting atop the stone pavement
  for (let tx = 20; tx < WORLD_WIDTH - 20; tx += 16) {
    fillRect(ctx, tx, 265, 11, 8, '#d97706');
    fillRect(ctx, tx + 1, 266, 9, 6, '#fbbf24');
    fillCircle(ctx, tx + 3.5, 269, 1.2, '#f59e0b');
    fillCircle(ctx, tx + 7.5, 269, 1.2, '#f59e0b');

    fillRect(ctx, tx, 392, 11, 8, '#d97706');
    fillRect(ctx, tx + 1, 393, 9, 6, '#fbbf24');
    fillCircle(ctx, tx + 3.5, 396, 1.2, '#f59e0b');
    fillCircle(ctx, tx + 7.5, 396, 1.2, '#f59e0b');
  }

  // =========================================================================
  // ASPHALT ROADWAY (Y: 285-383)
  // =========================================================================
  const roadGrad = ctx.createLinearGradient(0, 285, 0, 383);
  roadGrad.addColorStop(0, '#1c192b');
  roadGrad.addColorStop(0.5, '#28223d');
  roadGrad.addColorStop(1, '#1a1727');
  ctx.fillStyle = roadGrad;
  ctx.fillRect(0, 285, WORLD_WIDTH, 98);

  // Concrete roadside gutters
  fillRect(ctx, 0, 285, WORLD_WIDTH, 3, '#191526');
  fillRect(ctx, 0, 381, WORLD_WIDTH, 3, '#171323');

  // Dashed Center Lane Dividers
  for (let lx = 30; lx < WORLD_WIDTH; lx += 70) {
    if (lx < 320 || lx > 430) {
      fillRect(ctx, lx, 332, 34, 3, '#f1f5f9');
      fillRect(ctx, lx, 332, 34, 1, '#ffffff');
    }
  }

  // =========================================================================
  // ZEBRA CROSSWALK STRIPES (Y: 290 to 376)
  // =========================================================================
  const crosswalkLeft = 342;
  const crosswalkWidth = 76;
  const stripeH = 8;
  const stripeGap = 6;
  for (let cy = 290; cy <= 376; cy += stripeH + stripeGap) {
    fillRect(ctx, crosswalkLeft, cy, crosswalkWidth, stripeH, '#f8fafc');
    fillRect(ctx, crosswalkLeft, cy, crosswalkWidth, 1, '#ffffff');
  }

  // Object #18: Jack-o'-Lantern Manhole Cover / Street Pothole (X: 485, Y: 338)
  // Rendered with true 3D sunken depth, asphalt erosion cracks, and beveled cast-iron relief
  const mhX = 485;
  const mhY = 338;

  // 1. Surrounding weathered asphalt micro-cracks radiating into roadway
  ctx.strokeStyle = 'rgba(10, 8, 16, 0.75)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(mhX - 22, mhY - 6);
  ctx.lineTo(mhX - 29, mhY - 10);
  ctx.lineTo(mhX - 35, mhY - 9);
  ctx.moveTo(mhX + 22, mhY + 4);
  ctx.lineTo(mhX + 31, mhY + 7);
  ctx.lineTo(mhX + 37, mhY + 5);
  ctx.moveTo(mhX - 12, mhY + 12);
  ctx.lineTo(mhX - 16, mhY + 18);
  ctx.stroke();

  // 2. Chiseled asphalt cavity outer lip (Sunken basin in the asphalt)
  ctx.fillStyle = '#13111b'; // Deep dark asphalt cutout
  ctx.beginPath();
  ctx.ellipse(mhX, mhY + 1, 23.5, 13.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Top deep inner shadow for depression depth (creates sunken cavity)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.beginPath();
  ctx.ellipse(mhX, mhY - 1, 22.5, 9, 0, Math.PI, 0);
  ctx.fill();

  // Bottom lip highlight on asphalt rim (ambient twilight reflection)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.ellipse(mhX, mhY + 1.5, 23, 12.5, 0, 0, Math.PI);
  ctx.stroke();

  // 3. Heavy cast-iron outer frame ring
  ctx.fillStyle = '#334155';
  ctx.beginPath();
  ctx.ellipse(mhX, mhY, 21, 11.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Beveled outer metallic edge
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // 4. Recessed inner cast-iron body with depth gradient
  const ironGrad = ctx.createLinearGradient(mhX, mhY - 9, mhX, mhY + 9);
  ironGrad.addColorStop(0, '#111827');
  ironGrad.addColorStop(0.5, '#1e293b');
  ironGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = ironGrad;
  ctx.beginPath();
  ctx.ellipse(mhX, mhY + 0.5, 18, 9.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Inner upper wall shadow (steep vertical drop)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
  ctx.beginPath();
  ctx.ellipse(mhX, mhY - 2, 17, 5.5, 0, Math.PI, 0);
  ctx.fill();

  // Concentric grip traction ring & notches
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 0.9;
  ctx.beginPath();
  ctx.ellipse(mhX, mhY + 0.5, 13, 6.8, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Radial anti-slip key tabs
  for (let a = 0; a < 8; a++) {
    const angle = (a * Math.PI) / 4;
    const rx1 = mhX + Math.cos(angle) * 14;
    const ry1 = mhY + 0.5 + Math.sin(angle) * 7.5;
    const rx2 = mhX + Math.cos(angle) * 17;
    const ry2 = mhY + 0.5 + Math.sin(angle) * 9;
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(rx1, ry1);
    ctx.lineTo(rx2, ry2);
    ctx.stroke();
  }

  // 5. Inset Jack-o'-Lantern Relief with molten amber/pumpkin glow & 3D bevels
  // Subtle warm amber underglow in the depression
  const mhAura = ctx.createRadialGradient(mhX, mhY + 1, 1, mhX, mhY + 1, 12);
  mhAura.addColorStop(0, 'rgba(249, 115, 22, 0.35)');
  mhAura.addColorStop(1, 'rgba(249, 115, 22, 0)');
  ctx.fillStyle = mhAura;
  ctx.beginPath();
  ctx.ellipse(mhX, mhY + 1, 12, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Carved glowing eyes with depth bevel
  fillCircle(ctx, mhX - 5.5, mhY - 1, 2.4, '#ea580c');
  fillCircle(ctx, mhX - 5.5, mhY - 1, 1.4, '#fef08a');
  fillCircle(ctx, mhX + 5.5, mhY - 1, 2.4, '#ea580c');
  fillCircle(ctx, mhX + 5.5, mhY - 1, 1.4, '#fef08a');

  // Carved grinning mouth with tooth notch
  ctx.fillStyle = '#ea580c';
  ctx.beginPath();
  ctx.arc(mhX, mhY + 0.5, 5.5, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.lineTo(mhX + 4.5, mhY + 3.8);
  ctx.lineTo(mhX + 2, mhY + 4.8);
  ctx.lineTo(mhX, mhY + 3.5);
  ctx.lineTo(mhX - 2, mhY + 4.8);
  ctx.lineTo(mhX - 4.5, mhY + 3.8);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(mhX, mhY + 0.5, 4, 0.25 * Math.PI, 0.75 * Math.PI);
  ctx.stroke();

  // Subtle wet puddle gloss highlight on bottom curve
  ctx.strokeStyle = 'rgba(244, 114, 182, 0.22)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(mhX, mhY + 3, 10, 3.5, 0, 0.2, Math.PI - 0.2);
  ctx.stroke();

  // Object #2: Spooky Monster Vending Machine (X: 275, Y: 235)
  const vmX = 252;
  const vmY = 192;
  fillRect(ctx, vmX + 3, vmY + 68, 44, 4, 'rgba(0,0,0,0.4)');
  fillRect(ctx, vmX, vmY, 46, 70, '#581c87');
  fillRect(ctx, vmX + 1, vmY + 1, 44, 68, '#6b21a8');
  fillRect(ctx, vmX + 4, vmY + 5, 38, 34, '#fef3c7');
  // Delicate monster fangs along top of display window
  for (let fx = vmX + 6; fx < vmX + 40; fx += 7) {
    fillRect(ctx, fx, vmY + 5, 3, 4, '#f8fafc');
  }
  const canColors = ['#10b981', '#a855f7', '#f97316', '#06b6d4', '#ec4899'];
  for (let c = 0; c < 5; c++) {
    fillRect(ctx, vmX + 6 + c * 7, vmY + 15, 4, 8, canColors[c]);
    fillRect(ctx, vmX + 6 + c * 7, vmY + 27, 4, 8, canColors[(c + 2) % 5]);
  }
  fillRect(ctx, vmX + 5, vmY + 43, 22, 4, '#22c55e');
  fillCircle(ctx, vmX + 36, vmY + 45, 3.5, '#f59e0b');
  fillRect(ctx, vmX + 7, vmY + 53, 32, 10, '#0f172a');

  // Object #4: Pumpkin-Draped Red Postbox (X: 565, Y: 252)
  const pbX = 550;
  const pbY = 212;
  fillRect(ctx, pbX + 3, pbY + 54, 28, 4, 'rgba(0,0,0,0.4)');
  fillRect(ctx, pbX + 6, pbY + 44, 22, 12, '#1e293b');
  fillRect(ctx, pbX + 4, pbY + 12, 26, 34, '#b91c1c');
  fillRect(ctx, pbX + 7, pbY + 12, 16, 34, '#dc2626');
  fillCircle(ctx, pbX + 17, pbY + 12, 13, '#b91c1c');
  fillRect(ctx, pbX + 9, pbY + 18, 16, 4, '#0f172a');
  // Thin 1px white 〒 T-mark symbol
  fillRect(ctx, pbX + 12, pbY + 27, 10, 1.5, '#f8fafc');
  fillRect(ctx, pbX + 12, pbY + 30, 10, 1.5, '#f8fafc');
  fillRect(ctx, pbX + 16, pbY + 30, 1.5, 7, '#f8fafc');
  // Cute Kabocha pumpkin perched on top of the postbox
  drawKabochaPumpkin(ctx, pbX + 17, pbY + 2, 9, time, 4);

  // Object #5: Trick-or-Treat Mamachari Bicycle with thin spoked wheels (X: 155, Y: 358)
  const bikeX = 128;
  const bikeY = 342;
  fillRect(ctx, bikeX + 4, bikeY + 32, 48, 4, 'rgba(0,0,0,0.35)');
  // Thin 1.5px wheels
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(bikeX + 14, bikeY + 24, 9.5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(bikeX + 44, bikeY + 24, 9.5, 0, Math.PI * 2);
  ctx.stroke();
  // Thin frame lines
  ctx.strokeStyle = '#f97316';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(bikeX + 14, bikeY + 24);
  ctx.lineTo(bikeX + 26, bikeY + 15);
  ctx.lineTo(bikeX + 41, bikeY + 15);
  ctx.lineTo(bikeX + 44, bikeY + 24);
  ctx.stroke();
  // Handlebar & saddle
  fillRect(ctx, bikeX + 39, bikeY + 7, 2, 16, '#94a3b8');
  fillRect(ctx, bikeX + 18, bikeY + 12, 8, 3, '#451a03');
  // Wire basket with cute round candies
  fillRect(ctx, bikeX + 42, bikeY + 9, 12, 9, '#475569');
  fillCircle(ctx, bikeX + 46, bikeY + 8, 2.5, '#a855f7');
  fillCircle(ctx, bikeX + 51, bikeY + 8, 2.5, '#fbbf24');

  // Object #7: Flickering Halloween Phone Booth (East Alley, X: 912, Y: 268)
  const boothX = 888;
  const boothY = 208;
  const boothFlicker = Math.sin(time * 0.018) > -0.7;
  fillRect(ctx, boothX, boothY, 44, 78, '#334155');
  fillRect(ctx, boothX - 1, boothY - 3, 46, 6, '#dc2626');
  fillRect(
    ctx,
    boothX + 3,
    boothY + 6,
    38,
    66,
    boothFlicker ? 'rgba(186, 230, 253, 0.78)' : 'rgba(51, 65, 85, 0.8)'
  );
  fillRect(ctx, boothX + 14, boothY + 28, 15, 19, '#16a34a');
  fillRect(ctx, boothX + 16, boothY + 31, 11, 7, '#fef08a');
  // Thin 1px window mullions
  fillRect(ctx, boothX + 3, boothY + 28, 38, 1, '#475569');
  fillRect(ctx, boothX + 3, boothY + 50, 38, 1, '#475569');

  // =========================================================================
  // =========================================================================
  // 3B. COUNT VLAD THE VAMPIRE (Stationary on Right Center of Road under Phone Booth)
  // =========================================================================
  // Vertically under the phone booth (X: 912) on the right center of the road (Y: 336)
  const vladX = 912;
  const vladY = 336;
  const vladFacingRight = false; // Aristocratically facing left towards the main street

  // Keep Count Vlad's interactive WorldObject coordinates synced in real-time
  const vladObj = WORLD_OBJECTS.find((o) => o.id === 21);
  if (vladObj) {
    vladObj.x = vladX;
    vladObj.y = vladY;
  }

  // Draw Count Vlad standing stationary along the asphalt road
  const vladSway = Math.sin(time * 0.0035) * 0.8;

  // Ground shadow on asphalt
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.beginPath();
  ctx.ellipse(vladX, vladY + 22, 14, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Dramatic Billowing Cape trailing gently in the autumn breeze
  const capeWave = Math.sin(time * 0.007) * 2.5;
  const capeDrift = vladFacingRight ? -6 : 6;
  ctx.fillStyle = '#991b1b'; // Crimson lining
  ctx.beginPath();
  ctx.moveTo(vladX - 12 + capeDrift, vladY - 6);
  ctx.quadraticCurveTo(vladX - 18 + capeDrift + capeWave, vladY + 12, vladX - 14 + capeDrift + capeWave, vladY + 22);
  ctx.lineTo(vladX + 14 + capeDrift - capeWave, vladY + 22);
  ctx.quadraticCurveTo(vladX + 18 + capeDrift - capeWave, vladY + 12, vladX + 12 + capeDrift, vladY - 6);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#09090b'; // Midnight black cape outer
  ctx.beginPath();
  ctx.moveTo(vladX - 10 + capeDrift, vladY - 4);
  ctx.quadraticCurveTo(vladX - 15 + capeDrift + capeWave, vladY + 12, vladX - 12 + capeDrift + capeWave, vladY + 22);
  ctx.lineTo(vladX + 12 + capeDrift - capeWave, vladY + 22);
  ctx.quadraticCurveTo(vladX + 15 + capeDrift - capeWave, vladY + 12, vladX + 10 + capeDrift, vladY - 4);
  ctx.closePath();
  ctx.fill();

  // High Upright Vampire Collar
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.moveTo(vladX - 12, vladY - 8);
  ctx.lineTo(vladX - 14, vladY - 22);
  ctx.lineTo(vladX - 4, vladY - 10);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(vladX + 12, vladY - 8);
  ctx.lineTo(vladX + 14, vladY - 22);
  ctx.lineTo(vladX + 4, vladY - 10);
  ctx.closePath();
  ctx.fill();

  // Stationary standing legs & boots on the asphalt
  fillRect(ctx, vladX - 5, vladY + 12, 4, 11, '#18181b');
  fillRect(ctx, vladX + 1, vladY + 12, 4, 11, '#18181b');
  fillRect(ctx, vladX - 6, vladY + 20, 5, 3, '#09090b');
  fillRect(ctx, vladX + 1, vladY + 20, 5, 3, '#09090b');

  // Aristocratic Victorian Waistcoat & Ruffled White Cravat
  fillRect(ctx, vladX - 6, vladY - 6, 12, 18, '#1e1b4b');
  fillRect(ctx, vladX - 2.5, vladY - 7, 5, 8, '#f8fafc');
  fillCircle(ctx, vladX, vladY - 2, 1.2, '#fef08a');
  fillCircle(ctx, vladX - 1.5, vladY + 3, 1, '#f59e0b');
  fillCircle(ctx, vladX - 1.5, vladY + 7, 1, '#f59e0b');

  // Pale Vampire Head & Widow's peak
  fillCircle(ctx, vladX, vladY - 12 + vladSway * 0.3, 6.8, '#f1f5f9');
  ctx.fillStyle = '#09090b';
  ctx.beginPath();
  ctx.moveTo(vladX - 7, vladY - 13);
  ctx.quadraticCurveTo(vladX, vladY - 20, vladX + 7, vladY - 13);
  ctx.lineTo(vladX + 6, vladY - 10);
  ctx.lineTo(vladX + 2, vladY - 11);
  ctx.lineTo(vladX, vladY - 9);
  ctx.lineTo(vladX - 2, vladY - 11);
  ctx.lineTo(vladX - 6, vladY - 10);
  ctx.closePath();
  ctx.fill();
  fillCircle(ctx, vladX - 7, vladY - 12, 1.4, '#f1f5f9');
  fillCircle(ctx, vladX + 7, vladY - 12, 1.4, '#f1f5f9');

  // Glowing Red Eyes & fangs
  const eyeGlint = Math.sin(time * 0.01) > 0.3 ? '#ef4444' : '#b91c1c';
  fillCircle(ctx, vladX - 2.5, vladY - 11.5, 1.2, eyeGlint);
  fillCircle(ctx, vladX + 2.5, vladY - 11.5, 1.2, eyeGlint);
  ctx.strokeStyle = '#18181b';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(vladX, vladY - 9, 2.5, 0.2, Math.PI - 0.2);
  ctx.stroke();
  fillRect(ctx, vladX - 1.8, vladY - 8, 1, 1.8, '#ffffff');
  fillRect(ctx, vladX + 0.8, vladY - 8, 1, 1.8, '#ffffff');

  // Golden Goblet with Berry Cider in hand
  const gobletX = vladFacingRight ? vladX + 8 : vladX - 8;
  fillCircle(ctx, gobletX, vladY + 2, 2.2, '#f59e0b');
  fillRect(ctx, gobletX - 1, vladY + 4, 2, 4, '#d97706');
  fillCircle(ctx, gobletX, vladY + 1, 1.5, '#dc2626');

  // Cute micro-bat hovering near trailing shoulder
  const batFlap = Math.sin(time * 0.02) * 3;
  const batOffset = vladFacingRight ? -16 : 16;
  const vBatX = vladX + batOffset;
  const vBatY = vladY - 26 + Math.sin(time * 0.008) * 3;
  ctx.fillStyle = '#1e1b4b';
  fillCircle(ctx, vBatX, vBatY, 2.2, '#1e1b4b');
  ctx.beginPath();
  ctx.moveTo(vBatX - 1, vBatY);
  ctx.lineTo(vBatX - 6, vBatY - 2 + batFlap);
  ctx.lineTo(vBatX - 3, vBatY + 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(vBatX + 1, vBatY);
  ctx.lineTo(vBatX + 6, vBatY - 2 - batFlap);
  ctx.lineTo(vBatX + 3, vBatY + 2);
  ctx.fill();
  fillCircle(ctx, vBatX - 0.8, vBatY - 0.5, 0.6, '#fef08a');
  fillCircle(ctx, vBatX + 0.8, vBatY - 0.5, 0.6, '#fef08a');

  // Count Vlad's Speech Bubble on the road!
  const isVladNear = nearbyObject?.id === 21;
  if (isVampireSpeaking || isVladNear) {
    const sbW = isVampireSpeaking ? 195 : 170;
    const sbH = isVampireSpeaking ? 34 : 22;
    const sbX = Math.min(WORLD_WIDTH - sbW / 2 - 12, vladX - 25);
    const sbY = vladY - 48 - (isVampireSpeaking ? 10 : 0);

    ctx.fillStyle = '#18151f';
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(sbX - sbW / 2, sbY - sbH / 2, sbW, sbH, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#18151f';
    ctx.beginPath();
    ctx.moveTo(sbX - 4, sbY + sbH / 2);
    ctx.lineTo(sbX + 4, sbY + sbH / 2);
    ctx.lineTo(vladX, vladY - 24);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(sbX - 4, sbY + sbH / 2);
    ctx.lineTo(vladX, vladY - 24);
    ctx.lineTo(sbX + 4, sbY + sbH / 2);
    ctx.stroke();

    if (isVampireSpeaking) {
      ctx.font = 'bold 8px "Press Start 2P", monospace';
      ctx.fillStyle = '#ef4444';
      ctx.textAlign = 'center';
      ctx.fillText('🧛 "BLOOOOOOD!..."', sbX, sbY - 4);

      ctx.font = 'bold 6.5px "Press Start 2P", monospace';
      ctx.fillStyle = '#fef08a';
      ctx.fillText('🎂 HAPPY BIRTHDAY SHAILY! 🎉', sbX, sbY + 9);
      ctx.textAlign = 'start';
    } else {
      ctx.font = 'bold 6.5px "Press Start 2P", monospace';
      ctx.fillStyle = '#ef4444';
      ctx.textAlign = 'center';
      ctx.fillText('🧛 "HAPPY BIRTHDAY SHAILY!"', sbX, sbY + 2.5);
      ctx.textAlign = 'start';
    }
  }

  // =========================================================================
  // 3C. PEDESTRIANS ON THE PAVEMENT WITH TRANSLUCENT UMBRELLAS (透明ビニール傘)
  // Atmospheric autumn pedestrians standing stationary on the stone pavement with see-through vinyl umbrellas
  // =========================================================================
  // Pedestrian 1: Yuki (Student in navy coat with Clear Translucent Dome Umbrella)
  // Stationary on North Sidewalk Stone Pavement (X: 336, Y: 254) near the Crosswalk
  const yukiX = 336;
  const yukiY = 254;
  const yukiBreathe = Math.sin(time * 0.004) * 0.7;

  // Ground shadow on stone pavement
  ctx.fillStyle = 'rgba(0, 0, 0, 0.38)';
  ctx.beginPath();
  ctx.ellipse(yukiX, yukiY + 17, 10, 3.8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Stationary standing legs & boots on stone pavers
  fillRect(ctx, yukiX - 3.5, yukiY + 9, 3, 8, '#1e293b');
  fillRect(ctx, yukiX + 0.5, yukiY + 9, 3, 8, '#1e293b');
  fillRect(ctx, yukiX - 4, yukiY + 15, 3.5, 3, '#0f172a');
  fillRect(ctx, yukiX + 0.5, yukiY + 15, 3.5, 3, '#0f172a');

  // Autumn navy coat & pastel scarf
  fillRect(ctx, yukiX - 5, yukiY - 3 + yukiBreathe * 0.5, 10, 13, '#1e3a8a');
  fillRect(ctx, yukiX - 6, yukiY - 5 + yukiBreathe * 0.5, 12, 3.5, '#f472b6'); // Pink knitted scarf
  const yukiScarfTail = Math.sin(time * 0.006) * 1.5;
  fillRect(ctx, yukiX + 4.5, yukiY - 3 + yukiBreathe * 0.5, 2.5, 6 + yukiScarfTail, '#f472b6');

  // Head & Dark Bob Hair (visible through translucent umbrella!)
  fillCircle(ctx, yukiX, yukiY - 10 + yukiBreathe * 0.5, 5.5, '#fed7aa');
  ctx.fillStyle = '#09090b';
  ctx.beginPath();
  ctx.arc(yukiX, yukiY - 11 + yukiBreathe * 0.5, 6, Math.PI, 0);
  ctx.fill();
  fillRect(ctx, yukiX - 6, yukiY - 11 + yukiBreathe * 0.5, 12, 5, '#09090b');
  // Gentle eyes & pink blush
  fillCircle(ctx, yukiX - 2.5, yukiY - 9 + yukiBreathe * 0.5, 0.9, '#1e293b');
  fillCircle(ctx, yukiX + 2.5, yukiY - 9 + yukiBreathe * 0.5, 0.9, '#1e293b');
  fillCircle(ctx, yukiX - 3.5, yukiY - 7.5 + yukiBreathe * 0.5, 1.1, 'rgba(244, 63, 94, 0.5)');
  fillCircle(ctx, yukiX + 3.5, yukiY - 7.5 + yukiBreathe * 0.5, 1.1, 'rgba(244, 63, 94, 0.5)');

  // Clear Translucent Vinyl Umbrella (透明ビニール傘)
  const u1X = yukiX + 1;
  const u1Y = yukiY - 6 + yukiBreathe * 0.5;
  const u1Sway = Math.sin(time * 0.005) * 1.2;

  // Thin metallic shaft & curved black hook handle
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(u1X, u1Y + 14);
  ctx.lineTo(u1X, u1Y - 14 + u1Sway);
  ctx.stroke();
  fillRect(ctx, u1X - 2, u1Y + 12, 4, 3, '#0f172a'); // Handle hook

  // Translucent Vinyl Dome Fill (Glass effect: head & background show through!)
  ctx.save();
  ctx.fillStyle = 'rgba(215, 235, 255, 0.42)';
  ctx.beginPath();
  ctx.ellipse(u1X, u1Y - 4 + u1Sway, 17, 11, 0, Math.PI, 0);
  ctx.fill();

  // Glossy reflection arc on translucent plastic
  const u1Grad = ctx.createLinearGradient(u1X - 17, u1Y - 15 + u1Sway, u1X + 17, u1Y - 4 + u1Sway);
  u1Grad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
  u1Grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.12)');
  u1Grad.addColorStop(0.7, 'rgba(255, 255, 255, 0.4)');
  u1Grad.addColorStop(1, 'rgba(255, 255, 255, 0.08)');
  ctx.fillStyle = u1Grad;
  ctx.beginPath();
  ctx.ellipse(u1X, u1Y - 4 + u1Sway, 17, 11, 0, Math.PI, 0);
  ctx.fill();

  // White umbrella ribs (arched vinyl frame lines)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.lineWidth = 0.9;
  ctx.beginPath();
  ctx.moveTo(u1X, u1Y - 15 + u1Sway);
  ctx.lineTo(u1X, u1Y - 4 + u1Sway);
  ctx.moveTo(u1X, u1Y - 15 + u1Sway);
  ctx.quadraticCurveTo(u1X - 7, u1Y - 10 + u1Sway, u1X - 11, u1Y - 4 + u1Sway);
  ctx.moveTo(u1X, u1Y - 15 + u1Sway);
  ctx.quadraticCurveTo(u1X + 7, u1Y - 10 + u1Sway, u1X + 11, u1Y - 4 + u1Sway);
  ctx.stroke();

  // Crisp vinyl umbrella rim
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.ellipse(u1X, u1Y - 4 + u1Sway, 17, 11, 0, Math.PI, 0);
  ctx.stroke();
  fillRect(ctx, u1X - 1, u1Y - 18 + u1Sway, 2, 4, '#64748b'); // Top ferrule tip
  ctx.restore();

  // Yuki's Speech Bubble when player walks near
  const distToYuki = Math.hypot(player.x - yukiX, player.y - yukiY);
  if (distToYuki < 60) {
    const ybW = 160;
    const ybH = 20;
    const ybX = yukiX;
    const ybY = yukiY - 34;
    ctx.fillStyle = '#18151f';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(ybX - ybW / 2, ybY - ybH / 2, ybW, ybH, 5);
    ctx.fill();
    ctx.stroke();
    ctx.font = 'bold 5.5px "Press Start 2P", monospace';
    ctx.fillStyle = '#bae6fd';
    ctx.textAlign = 'center';
    ctx.fillText('☔ "Happy Birthday Shaily! 🎂"', ybX, ybY + 2);
    ctx.textAlign = 'start';
  }

  // -------------------------------------------------------------------------
  // Pedestrian 2: Aoi (Autumn stroller in trench coat with Tinted Lilac Translucent Umbrella)
  // Stationary on South Sidewalk Stone Pavement (X: 684, Y: 408) near Matsuri Festival Alley
  // -------------------------------------------------------------------------
  const aoiX = 684;
  const aoiY = 408;
  const aoiBreathe = Math.sin(time * 0.0038 + 1.5) * 0.7;

  // Ground shadow on stone pavement
  ctx.fillStyle = 'rgba(0, 0, 0, 0.38)';
  ctx.beginPath();
  ctx.ellipse(aoiX, aoiY + 17, 11, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Stationary standing legs & autumn brown boots on stone pavers
  fillRect(ctx, aoiX - 3.5, aoiY + 9, 3, 8, '#334155');
  fillRect(ctx, aoiX + 0.5, aoiY + 9, 3, 8, '#334155');
  fillRect(ctx, aoiX - 4, aoiY + 15, 3.5, 3, '#451a03');
  fillRect(ctx, aoiX + 0.5, aoiY + 15, 3.5, 3, '#451a03');

  // Autumn caramel trench coat & forest green beret
  fillRect(ctx, aoiX - 5.5, aoiY - 4 + aoiBreathe * 0.5, 11, 14, '#b45309');
  fillRect(ctx, aoiX - 5.5, aoiY - 4 + aoiBreathe * 0.5, 2, 14, '#d97706'); // Coat lapel
  // Head & Stylish Beret
  fillCircle(ctx, aoiX, aoiY - 10 + aoiBreathe * 0.5, 5.5, '#fed7aa');
  fillCircle(ctx, aoiX - 1, aoiY - 14 + aoiBreathe * 0.5, 5, '#15803d'); // Green beret
  fillRect(ctx, aoiX - 5, aoiY - 13 + aoiBreathe * 0.5, 9, 2, '#166534');
  fillCircle(ctx, aoiX - 2.5, aoiY - 9 + aoiBreathe * 0.5, 0.9, '#1e293b');
  fillCircle(ctx, aoiX + 2.5, aoiY - 9 + aoiBreathe * 0.5, 0.9, '#1e293b');
  fillCircle(ctx, aoiX - 3.5, aoiY - 7.5 + aoiBreathe * 0.5, 1.1, 'rgba(251, 146, 60, 0.6)');
  fillCircle(ctx, aoiX + 3.5, aoiY - 7.5 + aoiBreathe * 0.5, 1.1, 'rgba(251, 146, 60, 0.6)');

  // Tinted Lilac Translucent Umbrella (薄紫の透明傘)
  const u2X = aoiX + 1;
  const u2Y = aoiY - 6 + aoiBreathe * 0.5;
  const u2Sway = Math.sin(time * 0.005 + 1) * 1.2;

  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(u2X, u2Y + 14);
  ctx.lineTo(u2X, u2Y - 14 + u2Sway);
  ctx.stroke();
  fillRect(ctx, u2X - 2, u2Y + 12, 4, 3, '#451a03'); // Wooden handle

  // Translucent Lavender/Lilac Vinyl Dome
  ctx.save();
  ctx.fillStyle = 'rgba(233, 213, 255, 0.45)';
  ctx.beginPath();
  ctx.ellipse(u2X, u2Y - 4 + u2Sway, 17, 11, 0, Math.PI, 0);
  ctx.fill();

  // Glass sheen gradient
  const u2Grad = ctx.createLinearGradient(u2X - 17, u2Y - 15 + u2Sway, u2X + 17, u2Y - 4 + u2Sway);
  u2Grad.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
  u2Grad.addColorStop(0.35, 'rgba(255, 255, 255, 0.15)');
  u2Grad.addColorStop(0.7, 'rgba(255, 255, 255, 0.45)');
  u2Grad.addColorStop(1, 'rgba(255, 255, 255, 0.08)');
  ctx.fillStyle = u2Grad;
  ctx.beginPath();
  ctx.ellipse(u2X, u2Y - 4 + u2Sway, 17, 11, 0, Math.PI, 0);
  ctx.fill();

  // White arched ribs
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.78)';
  ctx.lineWidth = 0.9;
  ctx.beginPath();
  ctx.moveTo(u2X, u2Y - 15 + u2Sway);
  ctx.lineTo(u2X, u2Y - 4 + u2Sway);
  ctx.moveTo(u2X, u2Y - 15 + u2Sway);
  ctx.quadraticCurveTo(u2X - 7, u2Y - 10 + u2Sway, u2X - 11, u2Y - 4 + u2Sway);
  ctx.moveTo(u2X, u2Y - 15 + u2Sway);
  ctx.quadraticCurveTo(u2X + 7, u2Y - 10 + u2Sway, u2X + 11, u2Y - 4 + u2Sway);
  ctx.stroke();

  // Translucent rim highlight
  ctx.strokeStyle = 'rgba(243, 232, 255, 0.95)';
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.ellipse(u2X, u2Y - 4 + u2Sway, 17, 11, 0, Math.PI, 0);
  ctx.stroke();
  fillRect(ctx, u2X - 1, u2Y - 18 + u2Sway, 2, 4, '#78350f');
  ctx.restore();

  // Aoi's Speech Bubble when player walks near
  const distToAoi = Math.hypot(player.x - aoiX, player.y - aoiY);
  if (distToAoi < 60) {
    const abW = 160;
    const abH = 20;
    const abX = aoiX;
    const abY = aoiY - 34;
    ctx.fillStyle = '#18151f';
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(abX - abW / 2, abY - abH / 2, abW, abH, 5);
    ctx.fill();
    ctx.stroke();
    ctx.font = 'bold 5.5px "Press Start 2P", monospace';
    ctx.fillStyle = '#e9d5ff';
    ctx.textAlign = 'center';
    ctx.fillText('✨ "Happy Birthday Shaily! 🎈"', abX, abY + 2);
    ctx.textAlign = 'start';
  }

  // =========================================================================
  // 4. SOUTH ZONE (Plaza, Parklet & Railroad, Y: 430-640)
  // =========================================================================
  fillRect(ctx, 0, 435, WORLD_WIDTH, 205, '#1e1b29');

  // -------------------------------------------------------------------------
  // 4A. SHOP 4 (Bottom-Left): CHERRY BLOSSOM TREE, PARK BENCH & WITCH'S CAFE (X: 16-355, Y: 438-630)
  // Natural, uncluttered parklet layout:
  // - LEFT: Grand Cherry Blossom & Autumn Maple Tree with Big Glowing Ghost Lantern
  // - CENTER-LEFT: Witch's Cafe shifted comfortably left to X: 176 (leaves spacious 60px right entrance)
  // - RIGHT: Enlarged Cobwebbed Sakura Park Bench with carved Jack-o'-Lantern (Note #9)
  // - MEADOW: Kuro-neko the Black Witch Cat on velvet cushion with jingle bell & purple witch hat
  // -------------------------------------------------------------------------
  // Autumn park lawn base
  fillRect(ctx, 16, 440, 330, 188, '#14532d');
  fillRect(ctx, 22, 445, 318, 178, '#166534');

  // Organic curved stone stepping pavers leading from the spacious right entrance into the park
  const steppingStones: [number, number, number][] = [
    [344, 448, 5], [340, 470, 5], [334, 494, 5.2], [322, 518, 5.2],
    [298, 542, 5], [264, 564, 4.8], [224, 576, 4.8], [182, 582, 4.5],
  ];
  steppingStones.forEach(([sx, sy, sr]) => {
    fillCircle(ctx, sx + 0.5, sy + 1, sr, 'rgba(0,0,0,0.25)'); // Shadow
    fillCircle(ctx, sx, sy, sr, '#475569');
    fillCircle(ctx, sx - 0.5, sy - 0.5, sr - 1, '#64748b');
    fillCircle(ctx, sx - 1, sy - 1, 1, 'rgba(255,255,255,0.4)');
  });

  // Flower planter box with purple pansies (Far left corner, X: 24, Y: 444)
  fillRect(ctx, 24, 444, 26, 8, '#78350f');
  fillRect(ctx, 25, 445, 24, 6, '#92400e');
  fillCircle(ctx, 29, 443, 2.5, '#a855f7');
  fillCircle(ctx, 36, 442, 2.5, '#ea580c');
  fillCircle(ctx, 43, 443, 2.5, '#c084fc');

  // =========================================================================
  // 1. GRAND CHERRY BLOSSOM & AUTUMN MAPLE TREE (MOMIJI & SAKURA - TO THE LEFT, BIGGER!)
  // Centered at X: 95, Y: 475 with vast sprawling canopy and prominent Ghost Lantern
  // =========================================================================
  const treeX = 95;
  const treeY = 475;

  // Broad soft ground shadow under ancient tree
  ctx.fillStyle = 'rgba(0, 0, 0, 0.38)';
  ctx.beginPath();
  ctx.ellipse(treeX + 4, treeY + 54, 58, 16, 0, 0, Math.PI * 2);
  ctx.fill();

  // Grand ancient Shōwa trunk with gnarled mossy roots (Thicker & Taller)
  ctx.strokeStyle = '#3b1d11';
  ctx.lineWidth = 18;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(treeX, treeY + 50);
  ctx.quadraticCurveTo(treeX + 8, treeY + 16, treeX + 4, treeY - 26);
  ctx.stroke();

  // Inner warm cedar bark highlights & moss patches
  ctx.strokeStyle = '#5c2409';
  ctx.lineWidth = 13;
  ctx.beginPath();
  ctx.moveTo(treeX, treeY + 48);
  ctx.quadraticCurveTo(treeX + 7, treeY + 16, treeX + 3, treeY - 24);
  ctx.stroke();
  fillRect(ctx, treeX - 3, treeY + 22, 4, 10, '#166534'); // Moss streak

  // Deep sprawling root flares anchoring into the grass
  ctx.lineWidth = 5.5;
  ctx.strokeStyle = '#3b1d11';
  ctx.beginPath();
  ctx.moveTo(treeX - 4, treeY + 42);
  ctx.lineTo(treeX - 24, treeY + 56);
  ctx.moveTo(treeX + 6, treeY + 42);
  ctx.lineTo(treeX + 26, treeY + 56);
  ctx.stroke();

  // Left supporting bough extending outward
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(treeX - 2, treeY - 6);
  ctx.quadraticCurveTo(treeX - 26, treeY - 16, treeX - 48, treeY - 12);
  ctx.stroke();

  // Strong arched right bough holding the Big Ghost Lantern
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(treeX + 4, treeY - 4);
  ctx.quadraticCurveTo(treeX + 28, treeY - 14, treeX + 54, treeY - 6);
  ctx.stroke();

  // Vast multi-layered foliage canopy (Spanning X: 20 to X: 175)
  // Rich autumn palette: Momiji crimson, cherry sakura pinks, golden harvest amber & orange
  const grandCanopyCircles: [number, number, number, string][] = [
    [treeX - 46, treeY - 36, 30, '#991b1b'],
    [treeX + 44, treeY - 34, 30, '#991b1b'],
    [treeX, treeY - 68, 34, '#831843'],
    [treeX - 32, treeY - 52, 28, '#dc2626'],
    [treeX + 30, treeY - 50, 28, '#db2777'],
    [treeX, treeY - 38, 30, '#e11d48'],
    [treeX - 16, treeY - 58, 26, '#f472b6'],
    [treeX + 20, treeY - 44, 25, '#ea580c'],
    [treeX - 34, treeY - 30, 22, '#f97316'],
    [treeX - 6, treeY - 46, 22, '#f59e0b'],
    [treeX + 14, treeY - 62, 18, '#fbcfe8'],
    [treeX - 24, treeY - 50, 16, '#fde047'],
    [treeX + 8, treeY - 26, 17, '#f472b6'],
    [treeX - 52, treeY - 24, 16, '#b91c1c'],
    [treeX + 48, treeY - 22, 16, '#ea580c'],
  ];
  grandCanopyCircles.forEach(([cx, cy, r, color]) => {
    fillCircle(ctx, cx, cy, r, color);
  });

  // --- THE GHOST LANTERN (Restored to previous charming compact size!) ---
  // Suspended from the right bough at (treeX + 46, treeY - 6)
  const ghostSwing = Math.sin(time * 0.0055) * 3;
  const glX = treeX + 46 + ghostSwing;
  const glY = treeY + 12;

  // Luminous delicate warm aura
  const glGrad = ctx.createRadialGradient(glX, glY, 2, glX, glY, 20);
  glGrad.addColorStop(0, 'rgba(254, 240, 138, 0.55)');
  glGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
  ctx.fillStyle = glGrad;
  ctx.beginPath();
  ctx.arc(glX, glY, 20, 0, Math.PI * 2);
  ctx.fill();

  // Suspension cord
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(treeX + 46, treeY - 6);
  ctx.lineTo(glX, glY - 9);
  ctx.stroke();

  // Ghost Head & Body (Compact, cute 9px radius)
  fillCircle(ctx, glX, glY - 1, 9, '#fffbeb');
  fillCircle(ctx, glX - 5, glY + 6, 4, '#fef3c7');
  fillCircle(ctx, glX, glY + 7, 4, '#fffbeb');
  fillCircle(ctx, glX + 5, glY + 6, 4, '#fef3c7');

  // Orange pumpkin beret with little green stalk
  fillCircle(ctx, glX, glY - 9.5, 4, '#f97316');
  fillRect(ctx, glX - 0.6, glY - 12.5, 1.2, 3, '#15803d');

  // Kawaii smiling face
  fillCircle(ctx, glX - 3.2, glY - 2, 1.4, '#1e1b4b');
  fillCircle(ctx, glX + 3.2, glY - 2, 1.4, '#1e1b4b');
  fillCircle(ctx, glX - 5.5, glY + 0.8, 1.8, '#f472b6');
  fillCircle(ctx, glX + 5.5, glY + 0.8, 1.8, '#f472b6');
  ctx.strokeStyle = '#1e1b4b';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(glX, glY - 0.5, 2.5, 0.2, Math.PI - 0.2);
  ctx.stroke();

  // Scattered fallen cherry & maple petals dancing around the tree base
  const parkFallenLeaves = [
    [45, 510], [68, 542], [105, 528], [125, 508], [35, 488], [88, 558], [140, 535],
  ];
  parkFallenLeaves.forEach(([lx, ly], idx) => {
    fillCircle(ctx, lx, ly, 2.5, idx % 3 === 0 ? '#f472b6' : idx % 3 === 1 ? '#dc2626' : '#f59e0b');
  });

  // =========================================================================
  // 2. WITCH'S CAFE STOREFRONT (RIGHT EDGE RIGHT AT X: 328)
  // Spanning X: 210 to 328 (W: 118px), Y: 432 to 528 (H: 96px)
  // Right edge placed right at 328, opening 32px entrance on right to Shop 5!
  // Gabled Gothic slate roof, gold crescent moon crest, potion shelves, Barista Witch Aki
  // =========================================================================
  const cafeW = 118;
  const cafeX = 328 - cafeW; // 210 (right edge right at 328!)
  const cafeY = 432;
  const cafeH = 96;

  // Rich charred cedar siding with dark timber post lines
  fillRect(ctx, cafeX, cafeY, cafeW, cafeH, '#1c1316');
  for (let px = cafeX + 6; px < cafeX + cafeW; px += 8) {
    fillRect(ctx, px, cafeY, 1, cafeH, '#120b0d');
  }
  // Carved horizontal timber beam moldings
  fillRect(ctx, cafeX, cafeY + 28, cafeW, 4, '#311d24');
  fillRect(ctx, cafeX, cafeY + 60, cafeW, 3, '#311d24');

  // Gabled Gothic Slate Roof with Purple Kawara Shingles
  ctx.fillStyle = '#3b0764';
  ctx.beginPath();
  ctx.moveTo(cafeX - 6, cafeY + 8);
  ctx.lineTo(cafeX + cafeW / 2, cafeY - 14);
  ctx.lineTo(cafeX + cafeW + 6, cafeY + 8);
  ctx.lineTo(cafeX + cafeW + 4, cafeY + 12);
  ctx.lineTo(cafeX - 4, cafeY + 12);
  ctx.closePath();
  ctx.fill();
  fillRect(ctx, cafeX - 6, cafeY + 8, cafeW + 12, 4, '#581c87');
  fillRect(ctx, cafeX - 8, cafeY + 11, cafeW + 16, 2.5, '#7c3aed');

  // Ornate Gold Crescent Moon Crest on gable peak
  fillCircle(ctx, cafeX + cafeW / 2, cafeY - 5, 5.5, '#f59e0b');
  fillCircle(ctx, cafeX + cafeW / 2 + 2, cafeY - 6, 4.5, '#3b0764');

  // Striped Scalloped Awning (Burgundy, Pumpkin Orange, Warm Cream)
  const cafeAwningColors = ['#831843', '#ea580c', '#fef3c7', '#831843', '#ea580c', '#fef3c7', '#831843', '#ea580c', '#fef3c7', '#831843', '#ea580c', '#fef3c7'];
  const scallopW = Math.floor(cafeW / cafeAwningColors.length);
  for (let sc = 0; sc < cafeAwningColors.length; sc++) {
    const ax = cafeX + sc * scallopW;
    fillRect(ctx, ax, cafeY + 14, scallopW, 14, cafeAwningColors[sc]);
    fillCircle(ctx, ax + scallopW / 2, cafeY + 28, scallopW / 2, cafeAwningColors[sc]);
  }

  // Two hanging wrought-iron lanterns on curved brackets
  const drawCafeLantern = (lx: number, ly: number) => {
    fillRect(ctx, lx - 1, ly - 6, 2, 6, '#451a03');
    fillRect(ctx, lx - 4, ly, 8, 10, '#18151f');
    fillRect(ctx, lx - 2.5, ly + 2, 5, 6, '#fef08a');
    fillCircle(ctx, lx, ly + 5, 2, Math.sin(time * 0.02 + lx) > 0 ? '#f59e0b' : '#fef08a');
    fillRect(ctx, lx - 3, ly - 1, 6, 2, '#451a03');
  };
  drawCafeLantern(cafeX + 8, cafeY + 36);
  drawCafeLantern(cafeX + cafeW - 8, cafeY + 36);

  // AESTHETIC CARVED WOODEN SIGNBOARD: Centered, readable, no text clipping!
  const cafeSignW = 96;
  const cafeSignH = 15;
  const cafeSignX = cafeX + (cafeW - cafeSignW) / 2;
  const cafeSignY = cafeY + 31;
  // Brass hanging chains
  fillRect(ctx, cafeSignX + 12, cafeSignY - 4, 1.5, 4, '#fbbf24');
  fillRect(ctx, cafeSignX + cafeSignW - 13.5, cafeSignY - 4, 1.5, 4, '#fbbf24');
  // Walnut plaque with gold edge
  ctx.fillStyle = '#451a03';
  ctx.beginPath();
  ctx.roundRect(cafeSignX, cafeSignY, cafeSignW, cafeSignH, 4);
  ctx.fill();
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1.2;
  ctx.stroke();
  fillRect(ctx, cafeSignX + 2, cafeSignY + 2, cafeSignW - 4, cafeSignH - 4, '#271c19');
  // Centered retro pixel text with golden star flourishes
  ctx.font = 'bold 7px "Press Start 2P", monospace';
  ctx.fillStyle = '#fef08a';
  ctx.textAlign = 'center';
  ctx.fillText('✨ WITCH CAFE ✨', cafeSignX + cafeSignW / 2, cafeSignY + 10.5);
  ctx.textAlign = 'start';

  // Cafe Serving Counter Window with warm glowing interior (Spacious!)
  const cafeWinX = cafeX + 10;
  const cafeWinY = cafeY + 49;
  const cafeWinW = cafeW - 20;
  const cafeWinH = 44;
  fillRect(ctx, cafeWinX, cafeWinY, cafeWinW, cafeWinH, '#f59e0b');
  fillRect(ctx, cafeWinX + 2, cafeWinY + 2, cafeWinW - 4, cafeWinH - 4, '#fef3c7');

  // Multi-tier apothecary shelves with potions, coffee grinder & mugs
  fillRect(ctx, cafeWinX + 4, cafeWinY + 8, cafeWinW - 8, 2, '#78350f');
  // Glowing potion jars in rainbow jewel tones
  fillCircle(ctx, cafeWinX + 10, cafeWinY + 5, 2.5, '#a855f7');
  fillCircle(ctx, cafeWinX + 18, cafeWinY + 5, 2.5, '#10b981');
  fillCircle(ctx, cafeWinX + 26, cafeWinY + 5, 2.5, '#f97316');
  fillCircle(ctx, cafeWinX + 34, cafeWinY + 5, 2.5, '#38bdf8');
  fillCircle(ctx, cafeWinX + 42, cafeWinY + 5, 2.5, '#ec4899');
  fillCircle(ctx, cafeWinX + 50, cafeWinY + 5, 2.5, '#fbbf24');
  fillCircle(ctx, cafeWinX + 58, cafeWinY + 5, 2.5, '#06b6d4');

  // Vintage Brass Coffee Siphon & Dripper on shelf
  fillRect(ctx, cafeWinX + 66, cafeWinY + 3, 5, 6, '#b45309');
  fillCircle(ctx, cafeWinX + 68.5, cafeWinY + 2, 2.2, '#fef08a');
  fillRect(ctx, cafeWinX + 74, cafeWinY + 4, 6, 5, '#1e293b');

  // Lower counter bar
  fillRect(ctx, cafeWinX, cafeWinY + cafeWinH - 6, cafeWinW, 6, '#78350f');
  fillRect(ctx, cafeWinX, cafeWinY + cafeWinH - 3, cafeWinW, 3, '#451a03');

  // Glass cake cloche dome with pumpkin tart on counter
  fillCircle(ctx, cafeWinX + 14, cafeWinY + cafeWinH - 9, 4.5, 'rgba(255,255,255,0.7)');
  fillRect(ctx, cafeWinX + 10, cafeWinY + cafeWinH - 7, 8, 1.5, '#cbd5e1');
  fillCircle(ctx, cafeWinX + 14, cafeWinY + cafeWinH - 9, 2.4, '#ea580c'); // pumpkin tart

  // BARISTA WITCH AKI behind the counter
  const akiX = cafeX + 72;
  const akiY = cafeY + 69;
  fillCircle(ctx, akiX, akiY + 9, 6.5, '#7c3aed');
  fillRect(ctx, akiX - 4, akiY + 5, 8, 8, '#fef3c7');
  fillCircle(ctx, akiX, akiY + 1, 5, '#fde68a');
  fillCircle(ctx, akiX - 2, akiY + 0.5, 0.9, '#18151f');
  fillCircle(ctx, akiX + 2, akiY + 0.5, 0.9, '#18151f');
  fillCircle(ctx, akiX - 3, akiY + 2, 1.2, '#f472b6');
  fillCircle(ctx, akiX + 3, akiY + 2, 1.2, '#f472b6');
  ctx.fillStyle = '#581c87';
  ctx.beginPath();
  ctx.ellipse(akiX, akiY - 3.5, 8, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(akiX - 5, akiY - 3.5);
  ctx.lineTo(akiX, akiY - 12);
  ctx.lineTo(akiX + 5, akiY - 3.5);
  ctx.fill();
  fillRect(ctx, akiX - 5, akiY - 5, 10, 1.5, '#ea580c');
  // Hot ceramic coffee mug in Aki's hands
  fillCircle(ctx, akiX + 8, akiY + 7, 3, '#b45309');
  fillRect(ctx, akiX + 7, akiY + 3, 2, 4, '#78350f');
  fillRect(ctx, akiX + 10, akiY + 5, 4, 1.2, '#b45309');
  // Heart-shaped steam puffs floating up
  const steamPuff = ((time * 0.02) % 24) / 24;
  const steamY = akiY + 1 - steamPuff * 18;
  const steamX = akiX + 14 + Math.sin(time * 0.008) * 2;
  fillCircle(ctx, steamX - 1.2, steamY, 1.5, `rgba(244, 114, 182, ${1 - steamPuff})`);
  fillCircle(ctx, steamX + 1.2, steamY, 1.5, `rgba(244, 114, 182, ${1 - steamPuff})`);
  fillCircle(ctx, steamX, steamY + 1.4, 1.8, `rgba(233, 213, 255, ${1 - steamPuff})`);

  // Chalkboard Cafe Easel Menu (X: 188, Y: 502)
  const easelX = 188;
  const easelY = 502;
  fillRect(ctx, easelX - 1, easelY + 2, 2, 26, '#451a03');
  fillRect(ctx, easelX + 17, easelY + 2, 2, 26, '#451a03');
  fillRect(ctx, easelX, easelY + 4, 18, 20, '#1e293b');
  fillRect(ctx, easelX + 1, easelY + 5, 16, 18, '#0f172a');
  fillCircle(ctx, easelX + 9, easelY + 10, 2.5, '#ea580c');
  fillRect(ctx, easelX + 4, easelY + 15, 10, 1.2, '#fef08a');
  fillRect(ctx, easelX + 5, easelY + 18, 8, 1.2, '#cbd5e1');

  // =========================================================================
  // 3. OBJECT #9: COBWEBBED SAKURA PARK BENCH (TO THE RIGHT, ENLARGED!)
  // Centered at X: 285, Y: 582 (W: 96px, H: 30px)
  // Polished mahogany wood slats, cast-iron scrollwork legs, glowing carved pumpkin (holds Note #9)
  // =========================================================================
  const benchCenterX = 285;
  const benchCenterY = 582;
  const benchW = 96;
  const benchX = benchCenterX - benchW / 2; // 237
  const benchY = benchCenterY - 10;        // 572

  // Ground shadow under long bench
  fillRect(ctx, benchX + 4, benchY + 28, benchW - 8, 5, 'rgba(0,0,0,0.4)');
  // Slatted backrest
  fillRect(ctx, benchX + 4, benchY + 4, benchW - 8, 5, '#78350f');
  fillRect(ctx, benchX + 4, benchY + 11, benchW - 8, 5, '#92400e');
  // Polished seat slats
  fillRect(ctx, benchX + 2, benchY + 18, benchW - 4, 6, '#b45309');
  fillRect(ctx, benchX + 3, benchY + 19, benchW - 6, 2, '#d97706'); // Varnish sheen
  // Decorative iron legs (4 legs for stability across 96px span)
  fillRect(ctx, benchX + 6, benchY + 24, 4, 8, '#1e293b');
  fillRect(ctx, benchCenterX - 18, benchY + 24, 4, 8, '#1e293b');
  fillRect(ctx, benchCenterX + 14, benchY + 24, 4, 8, '#1e293b');
  fillRect(ctx, benchX + benchW - 10, benchY + 24, 4, 8, '#1e293b');

  // Spiderweb on right corner
  ctx.strokeStyle = 'rgba(241, 245, 249, 0.55)';
  ctx.lineWidth = 0.75;
  ctx.beginPath();
  ctx.moveTo(benchX + benchW - 4, benchY + 4);
  ctx.lineTo(benchX + benchW - 16, benchY + 4);
  ctx.lineTo(benchX + benchW - 4, benchY + 16);
  ctx.closePath();
  ctx.stroke();

  // Carved Jack-o'-Lantern sitting on the right side of the bench (X: 318, holds Note #9)
  drawKabochaPumpkin(ctx, benchX + benchW - 15, benchY + 13, 8, time, 9);

  // -------------------------------------------------------------------------
  // PERSON SITTING ON THE BENCH: KENJI (CHILLING FRIEND WITH RED SCARF & KITSUNE MASK)
  // Seated comfortably on the left side of the long bench (X: 259, Y: 584)
  // -------------------------------------------------------------------------
  const kenjiX = benchX + 22; // 259
  const kenjiY = benchY + 14; // 586

  // Swinging legs & boots dangling below bench seat
  const legSwing1 = Math.sin(time * 0.004) * 2.2;
  const legSwing2 = Math.sin(time * 0.004 + Math.PI) * 1.8;
  // Left leg & boot
  fillRect(ctx, kenjiX - 4.5, kenjiY + 4, 3.5, 9 + legSwing1, '#1e293b');
  fillRect(ctx, kenjiX - 5.5, kenjiY + 13 + legSwing1, 5, 3.5, '#0f172a');
  fillRect(ctx, kenjiX - 5.5, kenjiY + 16 + legSwing1, 5, 1, '#78350f'); // Leather sole
  // Right leg & boot
  fillRect(ctx, kenjiX + 1, kenjiY + 4, 3.5, 9 + legSwing2, '#1e293b');
  fillRect(ctx, kenjiX + 0.5, kenjiY + 13 + legSwing2, 5, 3.5, '#0f172a');
  fillRect(ctx, kenjiX + 0.5, kenjiY + 16 + legSwing2, 5, 1, '#78350f'); // Leather sole

  // Indigo winter jacket / haori
  fillRect(ctx, kenjiX - 6.5, kenjiY - 6, 13, 11, '#1e1b4b');
  fillRect(ctx, kenjiX - 6.5, kenjiY - 6, 2, 11, '#312e81'); // Left fold highlight
  fillRect(ctx, kenjiX - 0.5, kenjiY - 6, 1.5, 11, '#4338ca'); // Center seam

  // Right arm holding a warm steaming can of Boss Coffee
  fillRect(ctx, kenjiX + 5, kenjiY - 2, 3.5, 5, '#b45309');
  fillRect(ctx, kenjiX + 5.5, kenjiY - 1, 2.5, 2, '#f59e0b'); // Can label
  // Steam puff rising from hot drink
  const steamOffset = (time * 0.02) % 6;
  fillCircle(ctx, kenjiX + 6.8, kenjiY - 4 - steamOffset, 1.1, 'rgba(254, 240, 138, 0.5)');

  // Cozy knitted crimson scarf wrapped around neck
  fillRect(ctx, kenjiX - 7, kenjiY - 8, 14, 4, '#dc2626');
  fillRect(ctx, kenjiX - 5, kenjiY - 7.5, 10, 2.5, '#ef4444');
  // Fluttering red scarf tail in autumn breeze
  const scarfWave = Math.sin(time * 0.006) * 2;
  fillRect(ctx, kenjiX - 8.5, kenjiY - 5, 3, 7 + scarfWave, '#dc2626');
  fillRect(ctx, kenjiX - 8.5, kenjiY + 1.5 + scarfWave, 3, 1, '#991b1b'); // Scarf fringe

  // Kenji's Head & Face
  fillCircle(ctx, kenjiX, kenjiY - 13, 5, '#fed7aa');
  // Gentle smiling eyes
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(kenjiX - 2, kenjiY - 13, 1.2, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(kenjiX + 2, kenjiY - 13, 1.2, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();
  // Warm rosy cheeks
  fillCircle(ctx, kenjiX - 3.5, kenjiY - 11, 1.2, 'rgba(244, 63, 94, 0.5)');
  fillCircle(ctx, kenjiX + 3.5, kenjiY - 11, 1.2, 'rgba(244, 63, 94, 0.5)');
  // Warm smile
  fillRect(ctx, kenjiX - 1, kenjiY - 10, 2, 0.8, '#b91c1c');

  // Layered dark anime hair
  fillRect(ctx, kenjiX - 6, kenjiY - 18, 12, 5, '#09090b');
  fillCircle(ctx, kenjiX - 4.5, kenjiY - 15, 2.2, '#09090b');
  fillCircle(ctx, kenjiX + 4.5, kenjiY - 15, 2.2, '#09090b');
  fillCircle(ctx, kenjiX, kenjiY - 18.5, 2.5, '#09090b');
  fillCircle(ctx, kenjiX - 2, kenjiY - 16, 2, '#18181b'); // Hair highlight

  // Tilted Kitsune (Fox) Mask resting on the side of his head
  fillCircle(ctx, kenjiX + 6.5, kenjiY - 16, 3.8, '#f8fafc');
  // Fox ear on mask
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.moveTo(kenjiX + 4.5, kenjiY - 18);
  ctx.lineTo(kenjiX + 6, kenjiY - 21.5);
  ctx.lineTo(kenjiX + 8, kenjiY - 19);
  ctx.fill();
  // Red vermillion eye paint on fox mask
  fillRect(ctx, kenjiX + 5.5, kenjiY - 16, 2.2, 1, '#ef4444');
  // Red tassel cord & tiny golden bell
  fillRect(ctx, kenjiX + 9, kenjiY - 15, 1, 4.5, '#dc2626');
  fillCircle(ctx, kenjiX + 9.5, kenjiY - 10.5, 1.2, '#fbbf24');

  // Kenji's Birthday Speech Bubble when player is nearby
  const distToKenji = Math.hypot(player.x - kenjiX, player.y - kenjiY);
  if (distToKenji < 68 || nearbyObject?.id === 9) {
    const kbW = 168;
    const kbH = 22;
    const kbX = kenjiX;
    const kbY = kenjiY - 34;

    ctx.fillStyle = '#18151f';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.roundRect(kbX - kbW / 2, kbY - kbH / 2, kbW, kbH, 5);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#18151f';
    ctx.beginPath();
    ctx.moveTo(kbX - 3, kbY + kbH / 2);
    ctx.lineTo(kbX + 3, kbY + kbH / 2);
    ctx.lineTo(kenjiX, kenjiY - 19);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(kbX - 3, kbY + kbH / 2);
    ctx.lineTo(kenjiX, kenjiY - 19);
    ctx.lineTo(kbX + 3, kbY + kbH / 2);
    ctx.stroke();

    ctx.font = 'bold 6px "Press Start 2P", monospace';
    ctx.fillStyle = '#fef08a';
    ctx.textAlign = 'center';
    ctx.fillText('🍂 "HAPPY BIRTHDAY SHAILY!" 🍰', kbX, kbY - 1);
    ctx.font = 'bold 5px "Press Start 2P", monospace';
    ctx.fillStyle = '#fed7aa';
    ctx.fillText('✨ Enjoy the autumn night! 🎃', kbX, kbY + 7);
    ctx.textAlign = 'start';
  }

  // =========================================================================
  // 4. OBJECT #16: SIMPLIFIED, CHARMING BLACK WITCH CAT (KURO-NEKO)
  // Located at X: 145, Y: 580 between the Tree and the Bench with ample walking room
  // Clean, well-proportioned silhouette, velvet cushion, witch hat, big golden eyes!
  // =========================================================================
  const catX = 160;
  const catY = 580;

  // Soft ground shadow under cushion
  ctx.fillStyle = 'rgba(0,0,0,0.32)';
  ctx.beginPath();
  ctx.ellipse(catX, catY + 9, 22, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cozy Round Velvet Cushion (warm autumn crimson with gold trim)
  ctx.fillStyle = '#831843';
  ctx.beginPath();
  ctx.ellipse(catX, catY + 6, 20, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#991b1b';
  ctx.beginPath();
  ctx.ellipse(catX, catY + 5, 18, 8.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1.2;
  ctx.stroke();
  // 4 Golden Corner Tassels
  fillCircle(ctx, catX - 18, catY + 6, 1.8, '#fbbf24');
  fillCircle(ctx, catX + 18, catY + 6, 1.8, '#fbbf24');
  fillCircle(ctx, catX - 11, catY + 13, 1.6, '#fbbf24');
  fillCircle(ctx, catX + 11, catY + 13, 1.6, '#fbbf24');

  // Plump, cute black cat body
  fillCircle(ctx, catX, catY + 1, 11, '#09090b');
  fillCircle(ctx, catX - 2, catY - 1, 8.5, '#18181b'); // Silky chest highlight

  // Two cute front paws resting neatly on cushion
  fillCircle(ctx, catX - 4.5, catY + 8.5, 3.2, '#09090b');
  fillCircle(ctx, catX + 4.5, catY + 8.5, 3.2, '#09090b');

  // Cute rounded head
  fillCircle(ctx, catX, catY - 10, 9, '#09090b');

  // Pointed triangular cat ears
  ctx.fillStyle = '#09090b';
  ctx.beginPath();
  ctx.moveTo(catX - 8, catY - 10);
  ctx.lineTo(catX - 6, catY - 20);
  ctx.lineTo(catX - 1.5, catY - 12);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(catX + 1.5, catY - 12);
  ctx.lineTo(catX + 6, catY - 20);
  ctx.lineTo(catX + 8, catY - 10);
  ctx.closePath();
  ctx.fill();
  // Clean soft pink inner ear fluff
  ctx.fillStyle = '#f472b6';
  ctx.beginPath();
  ctx.moveTo(catX - 7, catY - 11);
  ctx.lineTo(catX - 5.8, catY - 17);
  ctx.lineTo(catX - 2.5, catY - 12.5);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(catX + 2.5, catY - 12.5);
  ctx.lineTo(catX + 5.8, catY - 17);
  ctx.lineTo(catX + 7, catY - 11);
  ctx.closePath();
  ctx.fill();

  // Mini Purple Witch Hat with Orange Ribbon & Gold Buckle
  ctx.fillStyle = '#581c87';
  ctx.beginPath();
  ctx.ellipse(catX, catY - 16, 10, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#7c3aed';
  ctx.beginPath();
  ctx.moveTo(catX - 4.5, catY - 16);
  ctx.lineTo(catX + 2, catY - 27);
  ctx.lineTo(catX + 6.5, catY - 16);
  ctx.closePath();
  ctx.fill();
  fillRect(ctx, catX - 4, catY - 18, 9, 2, '#ea580c');
  fillRect(ctx, catX - 1, catY - 18.5, 3, 3, '#fbbf24');

  // Big, expressive golden eyes with gentle blinking
  const isBlink = Math.sin(time * 0.0035) > 0.94;
  if (isBlink) {
    fillRect(ctx, catX - 6, catY - 10, 4.5, 1.4, '#fbbf24');
    fillRect(ctx, catX + 1.5, catY - 10, 4.5, 1.4, '#fbbf24');
  } else {
    fillCircle(ctx, catX - 3.8, catY - 10, 3, '#fbbf24');
    fillCircle(ctx, catX + 3.8, catY - 10, 3, '#fbbf24');
    // Vertical cat slit pupils
    fillRect(ctx, catX - 4.3, catY - 11.8, 1.3, 3.6, '#09090b');
    fillRect(ctx, catX + 3, catY - 11.8, 1.3, 3.6, '#09090b');
    // Clean eye shine catchlights
    fillCircle(ctx, catX - 4.5, catY - 11, 1, '#ffffff');
    fillCircle(ctx, catX + 3.2, catY - 11, 1, '#ffffff');
  }

  // Cute pink nose dot & delicate clean whiskers
  fillCircle(ctx, catX, catY - 6.5, 1.1, '#f472b6');
  ctx.strokeStyle = 'rgba(255,255,255,0.75)';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(catX - 4, catY - 6.5);
  ctx.lineTo(catX - 12, catY - 7.5);
  ctx.moveTo(catX - 4, catY - 5.5);
  ctx.lineTo(catX - 12, catY - 4.5);
  ctx.moveTo(catX + 4, catY - 6.5);
  ctx.lineTo(catX + 12, catY - 7.5);
  ctx.moveTo(catX + 4, catY - 5.5);
  ctx.lineTo(catX + 12, catY - 4.5);
  ctx.stroke();

  // Red Collar with Shiny Golden Jingle Bell
  fillRect(ctx, catX - 5.5, catY - 3, 11, 2, '#dc2626');
  fillCircle(ctx, catX, catY - 1, 2.5, '#fbbf24');
  fillRect(ctx, catX - 0.8, catY - 1, 1.6, 1, '#78350f');

  // Curled Sleek Black Tail with Gentle Sway
  const tailSway = Math.sin(time * 0.008) * 3.5;
  ctx.strokeStyle = '#09090b';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(catX + 8, catY + 6);
  ctx.quadraticCurveTo(catX + 17, catY - 2 + tailSway, catX + 14, catY - 12 + tailSway);
  ctx.stroke();

  // Kuro-neko Interaction / Nearby Speech Bubble
  const distToCat = Math.hypot(player.x - catX, player.y - catY);
  if (distToCat < 70 || nearbyObject?.id === 16) {
    const cbW = 168;
    const cbH = 22;
    const cbX = catX;
    const cbY = catY - 34;

    ctx.fillStyle = '#18151f';
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.roundRect(cbX - cbW / 2, cbY - cbH / 2, cbW, cbH, 5);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#18151f';
    ctx.beginPath();
    ctx.moveTo(cbX - 3, cbY + cbH / 2);
    ctx.lineTo(cbX + 3, cbY + cbH / 2);
    ctx.lineTo(catX, catY - 18);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#34d399';
    ctx.beginPath();
    ctx.moveTo(cbX - 3, cbY + cbH / 2);
    ctx.lineTo(catX, catY - 18);
    ctx.lineTo(cbX + 3, cbY + cbH / 2);
    ctx.stroke();

    ctx.font = 'bold 6px "Press Start 2P", monospace';
    ctx.fillStyle = '#6ee7b7';
    ctx.textAlign = 'center';
    ctx.fillText('🐾 "Meow! Happy Birthday Shaily! 🎈"', cbX, cbY - 1);
    ctx.font = 'bold 5px "Press Start 2P", monospace';
    ctx.fillStyle = '#fbcfe8';
    ctx.fillText('✨ *purrrrr* 🐱', cbX, cbY + 7);
    ctx.textAlign = 'start';
  }

  // -------------------------------------------------------------------------
  // 4B. SHOP 5 (Bottom-Center): EXPANDED MATSURI TAKOYAKI NIGHT MARKET PAVILION
  // (Spans X: 360-670, Top: Y: 438 [top of station], Bottom: Y: 612 [bottom of railway line]!)
  // -------------------------------------------------------------------------
  // Stone plaza floor base
  fillRect(ctx, 350, 440, 325, 192, '#2e293a');
  for (let fx = 352; fx < 675; fx += 26) {
    fillRect(ctx, fx, 440, 1, 192, 'rgba(40, 34, 52, 0.6)');
  }

  // Raised festival timber platform deck (Y: 438 down to Y: 612 - exactly 174px tall!)
  // Top aligns with the top of station shelter (Y: 438), bottom aligns with bottom of railway line (Y: 612)
  const pavX = 360;
  const pavY = 438;
  const pavW = 310;
  const pavH = 174; // Exactly reaches Y: 612!

  // Timber deck platform foundation
  fillRect(ctx, pavX - 4, pavY, pavW + 8, pavH, '#3b2518');
  fillRect(ctx, pavX - 2, pavY + 2, pavW + 4, pavH - 4, '#451a03');
  // Vertical cedar floorboard lines running down to Y: 612
  for (let fx = pavX + 2; fx < pavX + pavW; fx += 14) {
    fillRect(ctx, fx, pavY + 4, 1, pavH - 8, '#2e1202');
  }

  // Warm cedar lattice backdrop screen (koushi) in soft natural timber tones (no harsh white)
  fillRect(ctx, pavX + 6, pavY + 36, pavW - 12, 54, '#451a03');
  fillRect(ctx, pavX + 8, pavY + 38, pavW - 16, 50, '#2a170d');
  // Lighter shade of cedar brown for the lattice woodwork net
  for (let lx = pavX + 12; lx < pavX + pavW - 12; lx += 12) {
    fillRect(ctx, lx, pavY + 38, 1.2, 50, '#9a5b28');
  }
  for (let ly = pavY + 44; ly < pavY + 86; ly += 12) {
    fillRect(ctx, pavX + 8, ly, pavW - 16, 1.2, '#9a5b28');
  }

  // Upper storage shelves with traditional branded sake casks (sakadaru)
  fillRect(ctx, pavX + 12, pavY + 62, pavW - 24, 4, '#451a03');
  for (let sk = 0; sk < 5; sk++) {
    const sx = pavX + 36 + sk * 54;
    fillCircle(ctx, sx, pavY + 54, 8, '#d97706');
    fillRect(ctx, sx - 7, pavY + 48, 14, 12, '#b45309');
    fillRect(ctx, sx - 7, pavY + 50, 14, 2, '#18181b');
    fillRect(ctx, sx - 7, pavY + 56, 14, 2, '#18181b');
    fillCircle(ctx, sx, pavY + 54, 2.5, '#dc2626'); // Red sun crest
  }

  // 4 Robust charred cedar support pillars spanning full height
  fillRect(ctx, pavX + 8, pavY + 4, 7, 134, '#2e1202');
  fillRect(ctx, pavX + 105, pavY + 4, 7, 134, '#2e1202');
  fillRect(ctx, pavX + 205, pavY + 4, 7, 134, '#2e1202');
  fillRect(ctx, pavX + 295, pavY + 4, 7, 134, '#2e1202');

  // Heavy timber lintel beams & brackets
  fillRect(ctx, pavX - 4, pavY + 12, pavW + 8, 6, '#5c2409');
  fillRect(ctx, pavX - 6, pavY + 10, pavW + 12, 3, '#78350f');

  // Double-tiered grand curved festival roof eaves with dark kawara tiles (aligned with station top!)
  fillRect(ctx, pavX - 8, pavY - 4, pavW + 16, 16, '#1e1b4b');
  fillRect(ctx, pavX - 10, pavY + 8, pavW + 20, 5, '#312e81');
  fillRect(ctx, pavX - 4, pavY - 6, pavW + 8, 4, '#f59e0b'); // Gold ridge cap

  // Shimenawa sacred straw rope under eaves
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(pavX, pavY + 16);
  ctx.quadraticCurveTo(pavX + pavW / 2, pavY + 22, pavX + pavW, pavY + 16);
  ctx.stroke();

  // Broad Red & White scalloped festival noren valance banner
  const norenCount = 15;
  const norenW = pavW / norenCount;
  for (let v = 0; v < norenCount; v++) {
    const vx = pavX + v * norenW;
    const vColor = v % 2 === 0 ? '#dc2626' : '#fef3c7';
    fillRect(ctx, vx, pavY + 22, norenW, 14, vColor);
    fillCircle(ctx, vx + norenW / 2, pavY + 36, norenW / 4, vColor);
  }

  // 5 Swaying Festival Chōchin Paper Lanterns evenly spaced
  const chochinColors = ['#ef4444', '#f59e0b', '#a855f7', '#ea580c', '#ef4444'];
  for (let cl = 0; cl < 5; cl++) {
    const lSway = Math.sin(time * 0.006 + cl * 1.3) * 2;
    const lx = pavX + 28 + cl * 64 + lSway;
    const ly = pavY + 38;
    fillRect(ctx, lx, pavY + 22, 1, 16, '#f8fafc');
    fillRect(ctx, lx - 4, ly, 9, 2, '#18181b');
    fillRect(ctx, lx - 4, ly + 16, 9, 2, '#18181b');
    ctx.fillStyle = chochinColors[cl];
    ctx.beginPath();
    ctx.ellipse(lx + 0.5, ly + 8, 7.5, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    fillCircle(ctx, lx + 0.5, ly + 8, 3, '#fef08a');
    fillRect(ctx, lx - 2, ly + 6, 5, 1, '#18181b');
    fillRect(ctx, lx, ly + 4, 1, 7, '#18181b');
  }

  // WIDE FESTIVAL BAR COUNTER (Vertically situated at barY = 524 to 570)
  const barX = 370;
  const barY = 524;
  const barW = 290;
  fillRect(ctx, barX, barY, barW, 46, '#78350f');
  fillRect(ctx, barX + 2, barY + 2, barW - 4, 42, '#92400e');
  for (let sx = barX + 6; sx < barX + barW; sx += 10) {
    fillRect(ctx, sx, barY + 4, 1, 38, '#451a03');
  }
  fillRect(ctx, barX - 2, barY - 2, barW + 4, 4, '#f59e0b'); // Polished brass top rail

  // Cozy Japanese Bar Customer Place Settings (Left side of counter)
  // Bamboo woven placemat
  fillRect(ctx, barX + 14, barY + 4, 44, 28, '#78350f');
  fillRect(ctx, barX + 16, barY + 6, 40, 24, '#92400e');
  for (let px = barX + 18; px < barX + 54; px += 4) {
    fillRect(ctx, px, barY + 6, 1, 24, '#451a03');
  }
  // Ceramic Tokkuri sake carafe
  fillCircle(ctx, barX + 24, barY + 16, 4.5, '#f8fafc');
  fillCircle(ctx, barX + 24, barY + 11, 2.5, '#f8fafc');
  fillRect(ctx, barX + 22.5, barY + 8, 3, 4, '#f8fafc');
  fillCircle(ctx, barX + 24, barY + 16, 2, '#0284c7');
  // Two small Ochoko sake cups
  fillCircle(ctx, barX + 35, barY + 13, 2.8, '#38bdf8');
  fillCircle(ctx, barX + 35, barY + 13, 1.8, '#f8fafc');
  fillCircle(ctx, barX + 35, barY + 22, 2.8, '#38bdf8');
  fillCircle(ctx, barX + 35, barY + 22, 1.8, '#f8fafc');
  // Steaming autumn pumpkin miso soup bowl
  fillCircle(ctx, barX + 47, barY + 18, 4.8, '#ea580c');
  fillCircle(ctx, barX + 47, barY + 18, 3.8, '#c2410c');
  fillCircle(ctx, barX + 47, barY + 18, 1.8, '#fef3c7'); // Cream swirl
  // Bamboo chopsticks on red ceramic rest
  fillRect(ctx, barX + 20, barY + 26, 22, 1.2, '#fef08a');
  fillRect(ctx, barX + 30, barY + 25.5, 3, 2, '#dc2626');

  // OBJECT #8: PUMPKIN TAKOYAKI WOODEN MENU BOARDS (X: 472, Y: 524)
  for (let m = 0; m < 4; m++) {
    const mx = 456 + m * 10;
    fillRect(ctx, mx, barY - 20, 8, 20, '#fde68a');
    fillRect(ctx, mx + 2, barY - 17, 4, 14, '#451a03');
    fillRect(ctx, mx + 3, barY - 22, 2, 2, '#78350f');
  }

  // CHEF TARO (Takoyaki Master NPC) Behind Counter (X: 525, Y: 494)
  const taroX = 525;
  const taroY = barY - 30;
  const taroBob = Math.sin(time * 0.012) * 1.5;
  fillCircle(ctx, taroX, taroY + 14 + taroBob, 7, '#1e3a8a');
  fillRect(ctx, taroX - 5, taroY + 10 + taroBob, 10, 10, '#f8fafc');
  fillCircle(ctx, taroX, taroY + 5 + taroBob, 6, '#fed7aa');
  fillCircle(ctx, taroX - 2.5, taroY + 4.5 + taroBob, 1, '#18181b');
  fillCircle(ctx, taroX + 2.5, taroY + 4.5 + taroBob, 1, '#18181b');
  fillCircle(ctx, taroX - 4, taroY + 6.5 + taroBob, 1.4, '#f87171');
  fillCircle(ctx, taroX + 4, taroY + 6.5 + taroBob, 1.4, '#f87171');
  fillRect(ctx, taroX - 6, taroY + taroBob, 12, 2.5, '#f8fafc');
  fillRect(ctx, taroX + 5, taroY - 2 + taroBob, 2.5, 4, '#f8fafc');
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(taroX - 7, taroY + 12 + taroBob);
  ctx.lineTo(taroX - 10, taroY + 22 + taroBob);
  ctx.moveTo(taroX + 7, taroY + 12 + taroBob);
  ctx.lineTo(taroX + 10, taroY + 22 + taroBob);
  ctx.stroke();

  // Dual Cast-Iron Takoyaki Griddles with 24 Golden Takoyaki Spheres
  fillRect(ctx, taroX - 35, barY + 2, 70, 26, '#18181b');
  fillRect(ctx, taroX - 33, barY + 4, 66, 22, '#27272a');
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 6; col++) {
      const bx = taroX - 28 + col * 11;
      const by = barY + 10 + row * 10;
      fillCircle(ctx, bx, by, 3.8, '#d97706');
      fillCircle(ctx, bx, by, 3.2, '#f59e0b');
      fillRect(ctx, bx - 1.5, by - 1.5, 3, 1, '#451a03');
      fillCircle(ctx, bx + 1, by + 1, 0.8, '#15803d');
      const kRipple = Math.sin(time * 0.015 + col * 2 + row) * 1.2;
      fillRect(ctx, bx - 1, by - 2.5 + kRipple, 2.5, 0.8, '#fde68a');
    }
  }

  // Squeeze sauce bottles
  fillRect(ctx, taroX + 38, barY + 4, 5, 14, '#fef08a');
  fillRect(ctx, taroX + 39, barY + 1, 3, 3, '#f59e0b');
  fillRect(ctx, taroX + 45, barY + 4, 5, 14, '#78350f');
  fillRect(ctx, taroX + 46, barY + 1, 3, 3, '#dc2626');

  // OBJECT #15: WITCH'S TAKOYAKI BREW POT (X: 580, Y: 528)
  const potX = 580;
  const potY = barY - 6;
  fillCircle(ctx, potX, potY + 8, 14, '#3b0764');
  fillRect(ctx, potX - 14, potY - 4, 28, 5, '#581c87');
  fillRect(ctx, potX - 11, potY - 3, 22, 3, '#a855f7');
  for (let b = 0; b < 5; b++) {
    const progress = ((time * 0.03 + b * 11) % 36) / 36;
    const bx = potX - 8 + b * 4 + Math.sin(time * 0.008 + b) * 3;
    const by = potY - 6 - progress * 28;
    const bRadius = progress < 0.5 ? 2.6 : 1.8;
    fillCircle(ctx, bx, by, bRadius, `rgba(192, 132, 252, ${1 - progress * 0.85})`);
  }

  // OBJECT #17: CRATE WITH CANDY CORN & GOURDS (X: 635, Y: 536)
  const crateX = 635;
  const crateY = barY + 4;
  fillRect(ctx, crateX - 20, crateY, 44, 28, '#92400e');
  fillRect(ctx, crateX - 18, crateY + 3, 40, 7, '#b45309');
  fillRect(ctx, crateX - 18, crateY + 13, 40, 7, '#b45309');
  fillCircle(ctx, crateX - 9, crateY - 3, 5.5, '#ea580c');
  fillCircle(ctx, crateX + 3, crateY - 2, 4.5, '#15803d');
  fillCircle(ctx, crateX + 13, crateY - 2.5, 4.5, '#fbbf24');

  // Festival Cedar Barrel with paper uchiwa fan (X: 658, Y: 544)
  fillRect(ctx, 652, barY + 10, 16, 24, '#78350f');
  fillRect(ctx, 651, barY + 14, 18, 2, '#18181b');
  fillRect(ctx, 651, barY + 26, 18, 2, '#18181b');
  fillCircle(ctx, 660, barY + 6, 6, '#ef4444');
  fillRect(ctx, 659, barY + 8, 2, 8, '#fde68a');

  // LOWER VERANDA DECK AREA (Y: 570 down to Y: 612 - equal to bottom of railway line!)
  // Shaily can walk all through this lower area near the bar!
  fillRect(ctx, barX - 6, barY + 46, barW + 12, 2, '#451a03'); // Footrail
  // 4 Cute Round Wooden Stools with Red Matsuri Cushions at Y: 578
  const stoolXs = [pavX + 70, pavX + 120, pavX + 185, pavX + 250];
  stoolXs.forEach((stX) => {
    fillRect(ctx, stX - 1.5, barY + 44, 3, 10, '#18181b');
    fillCircle(ctx, stX, barY + 54, 5.5, 'rgba(0,0,0,0.3)');
    fillCircle(ctx, stX, barY + 44, 6.5, '#dc2626');
    fillCircle(ctx, stX, barY + 44, 4.5, '#ef4444');
    fillCircle(ctx, stX, barY + 44, 1.8, '#fef08a');
  });

  // Front Stone Veranda Step Border at Y: 612 (exactly matching the railway ties bottom)
  fillRect(ctx, pavX - 4, 610, pavW + 8, 3, '#1e1b29');
  fillRect(ctx, pavX - 4, 612, pavW + 8, 1, '#475569');

  // -------------------------------------------------------------------------
  // 4C. SHOP 6 (Bottom-Right): GHOST LINE RAILWAY STATION PLATFORM #04
  // (Spans X: 675-985, Y: 438-630)
  // -------------------------------------------------------------------------
  // Station ballast gravel base
  fillRect(ctx, 678, 442, 306, 186, '#262330');

  // Raised Wooden/Stone Station Platform Deck (X: 690 to 985, Y: 442 to 552)
  const platX = 690;
  const platY = 442;
  const platW = 295;
  const platH = 110;
  fillRect(ctx, platX, platY, platW, platH, '#475569');
  fillRect(ctx, platX, platY, platW, platH - 4, '#334155');
  for (let px = platX; px < platX + platW; px += 24) {
    fillRect(ctx, px, platY, 1, platH - 4, '#1e293b');
  }

  // Bright Yellow Tactile Warning Edge (Tenji Blocks) along platform lip
  fillRect(ctx, platX, platY + platH - 8, platW, 4, '#f59e0b');
  for (let bx = platX; bx < platX + platW; bx += 8) {
    fillRect(ctx, bx + 1, platY + platH - 7, 5, 2, '#fbbf24');
  }
  fillRect(ctx, platX, platY + platH - 4, platW, 4, '#0f172a');

  // Station Canopy Shelter Roof (Timber pillars & corrugated tin roof)
  fillRect(ctx, platX + 20, platY + 16, 6, 72, '#3f2010');
  fillRect(ctx, platX + 140, platY + 16, 6, 72, '#3f2010');
  fillRect(ctx, platX + 260, platY + 16, 6, 72, '#3f2010');
  fillRect(ctx, platX + 10, platY + 12, platW - 20, 6, '#5c2409');
  fillRect(ctx, platX + 4, platY - 4, platW - 8, 16, '#1e293b');
  fillRect(ctx, platX + 2, platY + 8, platW - 4, 4, '#475569');

  // Two Hanging Industrial Green Enamel Station Lamps casting light
  const lampX1 = platX + 80;
  const lampX2 = platX + 200;
  [lampX1, lampX2].forEach((lx) => {
    fillRect(ctx, lx, platY + 12, 1, 14, '#18181b');
    fillCircle(ctx, lx + 0.5, platY + 28, 6, '#15803d');
    fillCircle(ctx, lx + 0.5, platY + 30, 2.5, '#fef08a');
    const lampCone = ctx.createRadialGradient(lx + 0.5, platY + 32, 2, lx + 0.5, platY + 54, 28);
    lampCone.addColorStop(0, 'rgba(254, 240, 138, 0.35)');
    lampCone.addColorStop(1, 'rgba(254, 240, 138, 0)');
    ctx.fillStyle = lampCone;
    ctx.beginPath();
    ctx.arc(lx + 0.5, platY + 44, 24, 0, Math.PI * 2);
    ctx.fill();
  });

  // Suspended Illuminated Station Signboard (Backlit Japanese Sign: 駅)
  const signW = 68;
  const signH = 26;
  const signX = platX + 107;
  const signY = platY + 18;
  // Steel suspension struts
  fillRect(ctx, signX + 10, platY + 12, 1.5, 6, '#cbd5e1');
  fillRect(ctx, signX + signW - 11.5, platY + 12, 1.5, 6, '#cbd5e1');
  // Backlit housing & frame
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.roundRect(signX, signY, signW, signH, 3);
  ctx.fill();
  // Illuminated interior
  fillRect(ctx, signX + 1.5, signY + 1.5, signW - 3, signH - 3, '#f8fafc');
  // Classic JR East emerald-green accent stripe across top
  fillRect(ctx, signX + 1.5, signY + 1.5, signW - 3, 3.5, '#059669');
  // Bold, prominent Japanese text: "駅" (Station)
  ctx.font = 'bold 15px "Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", "Noto Sans JP", sans-serif';
  ctx.fillStyle = '#0f172a';
  ctx.textAlign = 'center';
  ctx.fillText('駅', signX + signW / 2, signY + 19);
  ctx.textAlign = 'start';

  // Antique Round Station Clock on canopy pillar
  const clockX = platX + 143;
  const clockY = platY + 28;
  fillCircle(ctx, clockX, clockY, 7, '#d97706');
  fillCircle(ctx, clockX, clockY, 5.5, '#fef3c7');
  fillCircle(ctx, clockX, clockY, 0.8, '#18181b');
  fillRect(ctx, clockX - 0.5, clockY - 4.5, 1, 4.5, '#18181b');
  fillRect(ctx, clockX - 3.5, clockY - 0.5, 3.5, 1, '#18181b');

  // Railroad Crossing Barrier Pole (踏切 - Fumikiri, X: 712, Y: 478)
  const poleX = 712;
  const poleY = 478;
  fillRect(ctx, poleX + 2, poleY + 58, 18, 14, '#facc15');
  fillRect(ctx, poleX + 8, poleY, 5, 58, '#e2e8f0');
  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(poleX + 1, poleY + 4);
  ctx.lineTo(poleX + 20, poleY + 16);
  ctx.moveTo(poleX + 20, poleY + 4);
  ctx.lineTo(poleX + 1, poleY + 16);
  ctx.stroke();

  const flashLeft = Math.floor(time / 420) % 2 === 0;
  fillRect(ctx, poleX - 4, poleY + 24, 30, 8, '#18181b');
  fillCircle(ctx, poleX + 2, poleY + 28, 3.5, flashLeft ? '#f97316' : '#451a03');
  fillCircle(ctx, poleX + 19, poleY + 28, 3.5, !flashLeft ? '#f97316' : '#451a03');

  for (let bx = 0; bx < 7; bx++) {
    fillRect(
      ctx,
      poleX + 13 + bx * 18,
      poleY + 45,
      18,
      4.5,
      bx % 2 === 0 ? '#facc15' : '#18181b'
    );
  }

  // Platform Waiting Bench with a trick-or-treat candy pail (X: 755, Y: 512)
  fillRect(ctx, platX + 65, platY + 68, 36, 12, '#78350f');
  fillRect(ctx, platX + 67, platY + 70, 32, 8, '#92400e');
  fillCircle(ctx, platX + 93, platY + 66, 3.5, '#ea580c');
  fillCircle(ctx, platX + 93, platY + 66, 1.2, '#fef08a');

  // STATIONMASTER AYAME (Conductor NPC at X: 840, Y: 510)
  const ayameX = platX + 150;
  const ayameY = platY + 66;
  const ayameBob = Math.sin(time * 0.009) * 1.2;

  fillCircle(ctx, ayameX, ayameY + 12 + ayameBob, 6.5, '#1e3a8a');
  fillRect(ctx, ayameX - 5, ayameY + 8 + ayameBob, 10, 12, '#172554');
  fillCircle(ctx, ayameX - 1.5, ayameY + 11 + ayameBob, 0.9, '#f59e0b');
  fillCircle(ctx, ayameX + 1.5, ayameY + 11 + ayameBob, 0.9, '#f59e0b');
  fillCircle(ctx, ayameX - 1.5, ayameY + 15 + ayameBob, 0.9, '#f59e0b');
  fillCircle(ctx, ayameX + 1.5, ayameY + 15 + ayameBob, 0.9, '#f59e0b');

  fillCircle(ctx, ayameX, ayameY + 3 + ayameBob, 5.5, '#fed7aa');
  fillCircle(ctx, ayameX - 2, ayameY + 2.5 + ayameBob, 0.9, '#18181b');
  fillCircle(ctx, ayameX + 2, ayameY + 2.5 + ayameBob, 0.9, '#18181b');
  fillCircle(ctx, ayameX - 3, ayameY + 4 + ayameBob, 1.2, '#f472b6');
  fillCircle(ctx, ayameX + 3, ayameY + 4 + ayameBob, 1.2, '#f472b6');

  fillRect(ctx, ayameX - 6, ayameY - 3 + ayameBob, 12, 4, '#172554');
  fillRect(ctx, ayameX - 7, ayameY - 0.5 + ayameBob, 14, 2, '#0f172a');
  fillCircle(ctx, ayameX, ayameY - 2 + ayameBob, 1.3, '#f59e0b');

  const lanSway = Math.sin(time * 0.008) * 4;
  const lanX = ayameX + 10 + lanSway;
  const lanY = ayameY + 15;
  fillRect(ctx, ayameX + 4, ayameY + 10 + ayameBob, 5, 2, '#172554');
  fillRect(ctx, lanX, lanY - 4, 1, 4, '#78350f');
  fillRect(ctx, lanX - 3, lanY, 7, 9, '#18181b');
  fillCircle(ctx, lanX + 0.5, lanY + 4.5, 3.5, '#22c55e');
  fillCircle(ctx, lanX + 0.5, lanY + 4.5, 1.8, '#bbf7d0');

  const lanGrad = ctx.createRadialGradient(lanX + 0.5, lanY + 4.5, 2, lanX + 0.5, lanY + 4.5, 18);
  lanGrad.addColorStop(0, 'rgba(34, 197, 94, 0.45)');
  lanGrad.addColorStop(1, 'rgba(34, 197, 94, 0)');
  ctx.fillStyle = lanGrad;
  ctx.beginPath();
  ctx.arc(lanX + 0.5, lanY + 4.5, 18, 0, Math.PI * 2);
  ctx.fill();

  // Vintage Baggage Parcel Handcart with Wrapped Birthday Gift Boxes! (X: 895, Y: 512)
  const cartBaggageX = platX + 205;
  const cartBaggageY = platY + 70;
  fillRect(ctx, cartBaggageX, cartBaggageY + 12, 34, 4, '#78350f');
  fillCircle(ctx, cartBaggageX + 6, cartBaggageY + 16, 4, '#18181b');
  fillCircle(ctx, cartBaggageX + 28, cartBaggageY + 16, 4, '#18181b');
  fillRect(ctx, cartBaggageX + 2, cartBaggageY, 15, 12, '#e11d48');
  fillRect(ctx, cartBaggageX + 8, cartBaggageY, 3, 12, '#fbbf24');
  fillRect(ctx, cartBaggageX + 2, cartBaggageY + 5, 15, 2, '#fbbf24');
  fillRect(ctx, cartBaggageX + 18, cartBaggageY + 2, 14, 10, '#8b5cf6');
  fillRect(ctx, cartBaggageX + 23, cartBaggageY + 2, 2.5, 10, '#fef08a');
  fillCircle(ctx, cartBaggageX + 25, cartBaggageY - 2, 3.5, '#ea580c');

  // OBJECT #10: HAUNTED STATION COIN LOCKER #04 (X: 948, Y: 505)
  // Neatly positioned near the eastern platform edge
  const lockerX = 926;
  const lockerY = 465;
  fillRect(ctx, lockerX + 3, lockerY + 72, 46, 4, 'rgba(0,0,0,0.4)');
  fillRect(ctx, lockerX, lockerY, 48, 74, '#334155');
  fillRect(ctx, lockerX + 1, lockerY + 1, 46, 72, '#64748b');
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 2; col++) {
      const lx = lockerX + 4 + col * 21;
      const ly = lockerY + 5 + row * 32;
      const isLocker04 = row === 1 && col === 1;
      fillRect(ctx, lx, ly, 19, 29, isLocker04 ? '#4c1d95' : '#94a3b8');
      fillRect(ctx, lx + 2, ly + 3, 7, 4, isLocker04 ? '#fbbf24' : '#e2e8f0');
      fillCircle(ctx, lx + 15, ly + 15, 1.5, isLocker04 ? '#f97316' : '#1e293b');
    }
  }

  // Railway Tracks (Wooden ties & metallic steel rails, Y: 558 to 612)
  for (let rx = 692; rx < 975; rx += 16) {
    fillRect(ctx, rx, 558, 7, 54, '#451a03');
  }
  fillRect(ctx, 680, 569, 304, 3, '#64748b');
  fillRect(ctx, 680, 569, 304, 1, '#cbd5e1');
  fillRect(ctx, 680, 599, 304, 3, '#64748b');
  fillRect(ctx, 680, 599, 304, 1, '#cbd5e1');

  // =========================================================================
  // 5. CUTE MICRO-ANIMATIONS (Yūrei Ghost & Flying Rooftop Bat)
  // =========================================================================
  const ghostX = ((time * 0.032) % (WORLD_WIDTH + 80)) - 40;
  const ghostY = 318 + Math.sin(time * 0.0045) * 14;
  ctx.save();
  ctx.globalAlpha = 0.88;
  // Smooth rounded Yūrei body
  fillCircle(ctx, ghostX, ghostY - 3, 11, '#f8fafc');
  fillRect(ctx, ghostX - 11, ghostY - 3, 22, 12, '#f8fafc');
  const tailWave = Math.sin(time * 0.012) * 2;
  fillCircle(ctx, ghostX - 7, ghostY + 9 + tailWave, 4, '#e2e8f0');
  fillCircle(ctx, ghostX, ghostY + 9 - tailWave, 4, '#e2e8f0');
  fillCircle(ctx, ghostX + 7, ghostY + 9 + tailWave, 4, '#e2e8f0');
  // Cute eyes, rosy cheeks & smile
  fillCircle(ctx, ghostX - 4, ghostY - 3, 1.6, '#1e1b4b');
  fillCircle(ctx, ghostX + 4, ghostY - 3, 1.6, '#1e1b4b');
  fillCircle(ctx, ghostX - 6.5, ghostY - 0.5, 2, '#f472b6');
  fillCircle(ctx, ghostX + 6.5, ghostY - 0.5, 2, '#f472b6');
  ctx.strokeStyle = '#1e1b4b';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(ghostX, ghostY - 1, 2.5, 0.2, Math.PI - 0.2);
  ctx.stroke();
  // Tiny purple witch hat on Yūrei
  fillRect(ctx, ghostX - 11, ghostY - 14, 22, 2.5, '#6b21a8');
  ctx.fillStyle = '#7c3aed';
  ctx.beginPath();
  ctx.moveTo(ghostX - 7, ghostY - 14);
  ctx.lineTo(ghostX, ghostY - 25);
  ctx.lineTo(ghostX + 7, ghostY - 14);
  ctx.fill();
  fillRect(ctx, ghostX - 6, ghostY - 15, 12, 1.5, '#f59e0b');
  ctx.restore();

  // =========================================================================
  // 6. SUBTLE DISCOVERY MARKERS FOR FOUND NOTES
  // =========================================================================
  WORLD_OBJECTS.forEach((obj) => {
    if (obj.hasNote && obj.noteId && discoveredNoteIds.includes(obj.noteId)) {
      const badgeY = obj.y - obj.height / 2 - 10 + Math.sin(time * 0.006 + obj.id) * 2;
      fillCircle(ctx, obj.x, badgeY, 3.5, '#f59e0b');
      fillCircle(ctx, obj.x, badgeY, 1.8, '#fef08a');
    }
  });

  // =========================================================================
  // 7. 16-BIT CHIBI EXPLORER CHARACTER SPRITE
  // =========================================================================
  drawExplorerCharacter(ctx, player, time);

  // =========================================================================
  // 9. ATMOSPHERIC LIGHTING OVERLAYS (Witching Hour Night with Sunsetty Pinker Hue)
  // =========================================================================
  // Sunsetty pinkish-violet twilight night atmospheric wash covering full canvas
  const nightGrad = ctx.createLinearGradient(0, -SKY_OFFSET, 0, PLAY_AREA_HEIGHT);
  nightGrad.addColorStop(0, 'rgba(25, 10, 38, 0.20)');
  nightGrad.addColorStop(0.35, 'rgba(52, 16, 48, 0.18)');
  nightGrad.addColorStop(0.75, 'rgba(38, 14, 40, 0.22)');
  nightGrad.addColorStop(1, 'rgba(20, 10, 30, 0.26)');
  ctx.fillStyle = nightGrad;
  ctx.fillRect(0, -SKY_OFFSET, WORLD_WIDTH, WORLD_HEIGHT);

  // Soft pink ambient wash
  ctx.fillStyle = 'rgba(244, 114, 182, 0.045)';
  ctx.fillRect(0, -SKY_OFFSET, WORLD_WIDTH, WORLD_HEIGHT);

  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const lightSources = [
    { x: 92, y: 150, r: 75, color: 'rgba(168, 85, 247, 0.32)' },
    { x: 168, y: 155, r: 70, color: 'rgba(249, 115, 22, 0.28)' },
    { x: 410, y: 150, r: 110, color: 'rgba(245, 158, 11, 0.34)' },
    { x: 275, y: 230, r: 90, color: 'rgba(168, 85, 247, 0.30)' },
    { x: 565, y: 220, r: 65, color: 'rgba(249, 115, 22, 0.28)' },
    { x: 755, y: 155, r: 95, color: 'rgba(56, 189, 248, 0.26)' },
    { x: 282, y: 485, r: 100, color: 'rgba(254, 240, 138, 0.36)' }, // Witch's Cafe serving window
    { x: 141, y: 487, r: 70, color: 'rgba(254, 240, 138, 0.35)' }, // Tree Ghost Lantern glow
    { x: 285, y: 582, r: 75, color: 'rgba(249, 115, 22, 0.30)' }, // Park bench lantern (holds Note #9)
    { x: 180, y: 575, r: 65, color: 'rgba(244, 114, 182, 0.28)' }, // Kuro-neko the Black Witch Cat glow
    { x: vladX, y: vladY, r: 75, color: 'rgba(239, 68, 68, 0.30)' }, // Count Vlad's ruby glow on the road
    { x: 525, y: 535, r: 130, color: 'rgba(245, 158, 11, 0.35)' }, // Takoyaki festival pavilion
    { x: 580, y: 528, r: 75, color: 'rgba(168, 85, 247, 0.30)' }, // Witch's brew pot
    { x: 712, y: 505, r: 75, color: 'rgba(249, 115, 22, 0.26)' }, // Railway crossing
    { x: 770, y: 485, r: 80, color: 'rgba(254, 240, 138, 0.28)' }, // Station canopy lamp
    { x: 890, y: 485, r: 80, color: 'rgba(254, 240, 138, 0.28)' }, // Station canopy lamp
    { x: 840, y: 512, r: 65, color: 'rgba(34, 197, 94, 0.32)' }, // Ayame's emerald signal lantern
    { x: player.x, y: player.y - 8, r: 80, color: 'rgba(245, 158, 11, 0.24)' },
  ];

  lightSources.forEach((src) => {
    const grad = ctx.createRadialGradient(src.x, src.y, 4, src.x, src.y, src.r);
    grad.addColorStop(0, src.color);
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(src.x, src.y, src.r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();

  // Restore the translated world context (SKY_OFFSET)
  ctx.restore();

  // =========================================================================
  // 8. TWILIGHT SKY BAT & DRIFTING PARTICLES ACROSS FULL CANVAS
  // =========================================================================
  // Flying Rooftop Bat in the extended twilight sky
  const batX = WORLD_WIDTH - (((time * 0.055) % (WORLD_WIDTH + 60)) - 30);
  const batY = 46 + Math.sin(time * 0.01) * 8;
  const wingFlap = Math.floor(time / 120) % 2 === 0 ? -4 : 3;
  fillCircle(ctx, batX, batY, 3.5, '#18151f');
  ctx.strokeStyle = '#311042';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(batX - 3, batY);
  ctx.lineTo(batX - 10, batY + wingFlap);
  ctx.moveTo(batX + 3, batY);
  ctx.lineTo(batX + 10, batY + wingFlap);
  ctx.stroke();
  fillCircle(ctx, batX - 1.5, batY - 0.5, 1, '#fde047');
  fillCircle(ctx, batX + 1.5, batY - 0.5, 1, '#fde047');

  // Particles drifting across the entire 1000x720 canvas
  particles.forEach((p) => {
    ctx.save();
    const swayX = p.type.startsWith('snowflake')
      ? Math.sin(time * 0.003 + p.swayOffset) * 4
      : 0;
    ctx.translate(p.x + swayX, p.y);

    if (p.type === 'snowflake-dot') {
      fillCircle(ctx, 0, 0, p.size, 'rgba(255, 255, 255, 0.42)');
      fillCircle(ctx, 0, 0, p.size * 1.5, 'rgba(224, 242, 254, 0.12)');
    } else if (p.type === 'snowflake-crystal') {
      ctx.rotate(p.angle * 0.5);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.40)';
      ctx.lineWidth = 0.85;
      const r = p.size + 1;
      for (let s = 0; s < 3; s++) {
        const a = (s * Math.PI) / 3;
        ctx.beginPath();
        ctx.moveTo(-Math.cos(a) * r, -Math.sin(a) * r);
        ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        ctx.stroke();
      }
      fillCircle(ctx, 0, 0, 1, 'rgba(255, 255, 255, 0.45)');
    } else if (p.type === 'leaf-red') {
      ctx.rotate(p.angle);
      fillCircle(ctx, 0, 0, p.size * 0.65, '#dc2626');
    } else if (p.type === 'leaf-orange') {
      ctx.rotate(p.angle);
      fillCircle(ctx, 0, 0, p.size * 0.65, '#f97316');
    } else if (p.type === 'ember-purple') {
      fillCircle(ctx, 0, 0, 1.8, '#c084fc');
    } else {
      fillCircle(ctx, 0, 0, 1.5, '#fde047');
    }
    ctx.restore();
  });

  // Restore the initial canvas save
  ctx.restore();
}

function drawExplorerCharacter(
  ctx: CanvasRenderingContext2D,
  player: PlayerState,
  time: number
) {
  const x = Math.round(player.x);
  const y = Math.round(player.y);

  const walkBob = player.isMoving ? Math.abs(Math.sin(time * 0.018)) * 2.5 : 0;
  const idleBreathe = !player.isMoving ? Math.sin(time * 0.005) * 0.8 : 0;
  const py = y - walkBob + idleBreathe;

  // Ground shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.42)';
  ctx.beginPath();
  ctx.ellipse(x, y + 13, 10, 4.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cute round trick-or-treat pumpkin pail on backpack
  const drawPail = (offsetX: number, offsetY: number) => {
    fillCircle(ctx, x + offsetX, py + offsetY, 4.5, '#ea580c');
    fillCircle(ctx, x + offsetX, py + offsetY, 3.5, '#f97316');
    fillCircle(ctx, x + offsetX - 1.5, py + offsetY - 0.5, 0.9, '#fef08a');
    fillCircle(ctx, x + offsetX + 1.5, py + offsetY - 0.5, 0.9, '#fef08a');
  };

  if (player.dir === 'down') {
    drawPail(8, 2);
  } else if (player.dir === 'left') {
    drawPail(7, 1);
  } else if (player.dir === 'right') {
    drawPail(-7, 1);
  }

  // Indigo boots
  const leftStep = player.isMoving ? Math.sin(time * 0.018) * 2.5 : 0;
  const rightStep = player.isMoving ? -leftStep : 0;
  fillCircle(ctx, x - 3.5, y + 9 + leftStep, 2.8, '#1e1b4b');
  fillCircle(ctx, x + 3.5, y + 9 + rightStep, 2.8, '#1e1b4b');

  // Rounded purple witch cloak
  ctx.fillStyle = '#581c87';
  ctx.beginPath();
  ctx.moveTo(x - 9, py + 8);
  ctx.quadraticCurveTo(x - 8, py - 5, x, py - 5);
  ctx.quadraticCurveTo(x + 8, py - 5, x + 9, py + 8);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#7c3aed';
  ctx.beginPath();
  ctx.moveTo(x - 7, py + 7);
  ctx.quadraticCurveTo(x - 6, py - 4, x, py - 4);
  ctx.quadraticCurveTo(x + 6, py - 4, x + 7, py + 7);
  ctx.closePath();
  ctx.fill();

  if (player.dir !== 'up') {
    fillCircle(ctx, x, py - 0.5, 1.8, '#f59e0b');
  }

  if (player.dir === 'up') {
    drawPail(0, 2);
  }

  // Cute round chibi head & dark bob hair
  fillCircle(ctx, x, py - 9.5, 7.5, '#1e1b4b');
  if (player.dir === 'down') {
    fillCircle(ctx, x, py - 8.5, 5.8, '#fde68a');
    fillCircle(ctx, x - 2.5, py - 8.5, 1.2, '#18151f');
    fillCircle(ctx, x + 2.5, py - 8.5, 1.2, '#18151f');
    fillCircle(ctx, x - 4, py - 6.8, 1.3, '#f472b6');
    fillCircle(ctx, x + 4, py - 6.8, 1.3, '#f472b6');
  } else if (player.dir === 'left') {
    fillCircle(ctx, x - 1.5, py - 8.5, 5.5, '#fde68a');
    fillCircle(ctx, x - 3.5, py - 8.5, 1.2, '#18151f');
    fillCircle(ctx, x - 4.5, py - 6.8, 1.2, '#f472b6');
  } else if (player.dir === 'right') {
    fillCircle(ctx, x + 1.5, py - 8.5, 5.5, '#fde68a');
    fillCircle(ctx, x + 3.5, py - 8.5, 1.2, '#18151f');
    fillCircle(ctx, x + 4.5, py - 6.8, 1.2, '#f472b6');
  }

  // Pointed Witch Hat with bouncy curved tip animation
  const tipBounce = player.isMoving ? Math.sin(time * 0.022) * 2.5 : 0;
  // Wide oval hat brim
  ctx.fillStyle = '#4c1d95';
  ctx.beginPath();
  ctx.ellipse(x, py - 15, 12.5, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  // Hat cone & bouncy tip
  ctx.fillStyle = '#7c3aed';
  ctx.beginPath();
  ctx.moveTo(x - 7.5, py - 15);
  ctx.quadraticCurveTo(x - 3, py - 27, x + 3 + tipBounce, py - 31 + Math.abs(tipBounce));
  ctx.quadraticCurveTo(x + 5, py - 24, x + 7.5, py - 15);
  ctx.closePath();
  ctx.fill();
  // Thin gold ribbon band
  fillRect(ctx, x - 7, py - 17, 14, 2, '#f59e0b');
}

export function findNearestObject(px: number, py: number): WorldObject | null {
  let closest: WorldObject | null = null;
  let minDistance = INTERACT_RADIUS;

  for (const obj of WORLD_OBJECTS) {
    const dist = Math.hypot(px - obj.x, py - obj.y);
    if (dist <= minDistance) {
      minDistance = dist;
      closest = obj;
    }
  }
  return closest;
}

export interface CollisionRect {
  x: number; // left
  y: number; // top
  w: number;
  h: number;
}

// Solid building facades, trees, carts, and all interactive objects
export const SOLID_OBSTACLES: CollisionRect[] = [
  { x: 324, y: 64, w: 322, h: 118 }, // Ramen Bar building
  { x: 666, y: 66, w: 310, h: 118 }, // 24H Laundromat building
  { x: 210, y: 432, w: 118, h: 92 }, // Witch's Cafe storefront facade & counter (Right edge right at 328)
  { x: 82, y: 504, w: 28, h: 28 },   // Grand Sakura & Maple Tree trunk base (Left side of Shop 4)
  { x: 360, y: 434, w: 310, h: 90 }, // Shop 5 upper building, roof & kitchen (prevents walking on top!)
  { x: 370, y: 524, w: 290, h: 46 }, // Shop 5 bar counter (allows walking near the bar in front!)
  { x: 705, y: 510, w: 140, h: 24 }, // Railroad crossing barrier pole

  ...WORLD_OBJECTS.filter((obj) => obj.id !== 21 && obj.id !== 16).map((obj) => {
    const cw = Math.min(obj.width * 0.78, 56);
    const ch = Math.min(obj.height * 0.68, 42);
    return {
      x: obj.x - cw / 2,
      y: obj.y - ch / 2,
      w: cw,
      h: ch,
    };
  }),
];

export function isPointColliding(px: number, py: number): boolean {
  const playerHalfW = 9;
  const playerHalfH = 7;
  const footY = py + 4;

  const pLeft = px - playerHalfW;
  const pRight = px + playerHalfW;
  const pTop = footY - playerHalfH;
  const pBottom = footY + playerHalfH;

  for (const box of SOLID_OBSTACLES) {
    if (
      pRight > box.x &&
      pLeft < box.x + box.w &&
      pBottom > box.y &&
      pTop < box.y + box.h
    ) {
      return true;
    }
  }
  return false;
}

export function resolvePlayerMovement(
  prevX: number,
  prevY: number,
  nextX: number,
  nextY: number
): { x: number; y: number; hitObstacle: boolean } {
  const clampedX = Math.max(24, Math.min(WORLD_WIDTH - 24, nextX));
  const clampedY = Math.max(115, Math.min(PLAY_AREA_HEIGHT - 24, nextY));

  let finalX = prevX;
  let finalY = prevY;
  let hitObstacle = false;

  if (!isPointColliding(clampedX, prevY)) {
    finalX = clampedX;
  } else {
    hitObstacle = true;
  }

  if (!isPointColliding(finalX, clampedY)) {
    finalY = clampedY;
  } else {
    hitObstacle = true;
  }

  return { x: finalX, y: finalY, hitObstacle };
}
