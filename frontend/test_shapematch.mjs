import { chromium } from 'playwright';

const BASE = 'http://localhost:5173';
const API  = 'http://127.0.0.1:8001/api';
const SS   = (n) => `/tmp/shape_${n}.png`;

async function apiFetch(path, body, token) {
  const r = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  return r.json();
}

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await ctx.newPage();

page.on('console', msg => { if (msg.type() === 'error') console.log('[BROWSER ERR]', msg.text()); });
page.on('pageerror', err => console.log('[PAGE ERR]', err.message));

// 1. Register + login
const email = `test_${Date.now()}@kido.dev`;
await apiFetch('/auth/register', { email, password: 'test1234', full_name: 'Testeur Kido' });
const { access_token } = await apiFetch('/auth/login', { email, password: 'test1234' });
await ctx.addInitScript((tok) => localStorage.setItem('token', tok), access_token);
const child = await apiFetch('/children/', { name: 'Léa', birth_year: 2020, avatar: '🦊' }, access_token);
console.log(`Child: ${child.name} cycle=${child.cycle}`);

// 2. Dashboard → select child
await page.goto(BASE + '/dashboard');
await page.waitForSelector('text=Léa', { timeout: 8000 });
await page.screenshot({ path: SS('01_dashboard') });
console.log('✅ Dashboard');

await page.click('text=Léa');
await page.waitForURL('**/cycles/**', { timeout: 6000 });
await page.waitForSelector('text=Reconnais les formes', { timeout: 6000 });
await page.screenshot({ path: SS('02_cycle') });
console.log('✅ Cycle maternelle — cards loaded');

// 3. Open ShapeMatch game — find the card whose h3 exactly matches
const shapeCard = page.locator('div').filter({
  has: page.locator('h3').filter({ hasText: 'Reconnais les formes' })
}).last();
await shapeCard.locator('button').click();
await page.waitForURL('**/play/**', { timeout: 6000 });
await page.waitForSelector("text=C'est parti", { timeout: 6000 });
await page.screenshot({ path: SS('03_intro') });
console.log('✅ Game intro — thumbnail + description visible');

// 4. Start game
await page.click("text=C'est parti !");
const canvas = page.locator('canvas');
await canvas.waitFor({ state: 'visible', timeout: 12000 });
await page.waitForTimeout(2200);
await page.screenshot({ path: SS('04_shapes') });
console.log('✅ Phaser canvas rendered — 4 shapes visible');

// 5. Measure canvas
const box = await canvas.boundingBox();
const sx = box.width / 800;
const sy = box.height / 500;
console.log(`   Canvas: ${box.width.toFixed(0)}×${box.height.toFixed(0)}, scale ${sx.toFixed(2)}`);

// Hit zone x positions (scene coords), y=260
const hitXs = [130, 310, 490, 670];

// 6. Play all 8 rounds — click one shape per round
for (let r = 0; r < 8; r++) {
  const hx = hitXs[r % 4];
  await page.mouse.click(box.x + hx * sx, box.y + 260 * sy);
  await page.waitForTimeout(300);
  if (r === 0) {
    await page.screenshot({ path: SS('05_round1_click') });
    console.log('✅ Round 1 click at shape hit zone');
  }
  await page.waitForTimeout(1050); // > 950ms scene transition
}

// 7. Wait for React "finished" state (onComplete → setState)
await page.waitForSelector('text=Bravo', { timeout: 10000 });
await page.screenshot({ path: SS('06_results') });
const scoreText = await page.locator('text=/\\d+/').first().textContent().catch(() => '?');
console.log(`✅ Results screen — Bravo! score visible`);

// 8. Probe: click Rejouer → canvas reappears
await page.click('text=Rejouer');
await page.waitForSelector("text=C'est parti", { timeout: 5000 });
await page.screenshot({ path: SS('07_probe_replay_intro') });
console.log('🔍 Probe: Rejouer → back to intro screen ✓');

await page.click("text=C'est parti !");
await canvas.waitFor({ state: 'visible', timeout: 12000 });
await page.waitForTimeout(2000);
const box2 = await canvas.boundingBox();

// 9. Probe: click gap between shapes (x=220, between shapes at 130 and 310)
await page.mouse.click(box2.x + 220 * (box2.width/800), box2.y + 260 * (box2.height/500));
await page.waitForTimeout(500);
await page.screenshot({ path: SS('08_probe_gap') });
console.log('🔍 Probe: gap at x=220 — no crash, no selection');

// 10. Probe: click label area at bottom (y=430 — outside shape zone)
await page.mouse.click(box2.x + 400 * (box2.width/800), box2.y + 430 * (box2.height/500));
await page.waitForTimeout(500);
await page.screenshot({ path: SS('09_probe_bottom') });
console.log('🔍 Probe: bottom bar area — no crash');

await browser.close();
console.log('\nDone. Screenshots: /tmp/shape_*.png');
