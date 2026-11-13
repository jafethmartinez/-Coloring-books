// Each animal is drawn on a 400 x 400 canvas.
// Shapes are white with thick black outlines so kids can color inside them.
// Things are drawn back-to-front: later shapes cover earlier ones.

const B = 'fill="#111"'; // solid black (pupils, noses)
const W = 'fill="#fff" stroke="none"'; // white shine in eyes
const LINE = 'fill="none"'; // outline only

const eye = (x, y, r = 11) =>
  `<circle cx="${x}" cy="${y}" r="${r}" ${B}/>` +
  `<circle cx="${x + r * 0.35}" cy="${y - r * 0.35}" r="${r * 0.32}" ${W}/>`;

const ring = (cx, cy, radius, count, fn) =>
  Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2;
    return fn(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius, a, i);
  }).join('');

const star = (cx, cy, r) => {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.45 : r;
    return `${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)}`;
  });
  return `<polygon points="${pts.join(' ')}" stroke-width="4"/>`;
};

const heart = (x, y, s = 1) =>
  `<path transform="translate(${x} ${y}) scale(${s})" stroke-width="${4 / s}" d="M0,8 C-14,-8 -28,6 0,26 C28,6 14,-8 0,8 Z"/>`;

const grass = (y) =>
  `<path ${LINE} d="M10,${y} L390,${y}"/>` +
  [30, 70, 330, 370].map((x) => `<path ${LINE} stroke-width="4" d="M${x - 8},${y} L${x - 12},${y - 16} M${x},${y} L${x},${y - 20} M${x + 8},${y} L${x + 12},${y - 16}"/>`).join('');

const cloud = (x, y) =>
  `<path stroke-width="4" d="M${x},${y} a14,14 0 0 1 14,-16 a18,18 0 0 1 32,0 a14,14 0 0 1 14,16 Z"/>`;

const flower = (x, y) =>
  `<path ${LINE} stroke-width="4" d="M${x},${y} L${x},${y + 30}"/>` +
  ring(x, y, 11, 5, (px, py) => `<circle cx="${px}" cy="${py}" r="8" stroke-width="4"/>`) +
  `<circle cx="${x}" cy="${y}" r="6" stroke-width="4"/>`;

// Returns the drawing with its white shapes painted in the given colors (used on the cover).
export const colorize = (svg, colors = []) => {
  let i = 0;
  return svg.replace(/<(\w+)([^>]*)\/>/g, (whole, tag, attrs) => {
    if (/fill="(#111|none|#fff)"/.test(attrs) || i >= colors.length) return whole;
    return `<${tag} fill="${colors[i++]}"${attrs}/>`;
  });
};

export const animals = [
  {
    name: 'Cat',
    // Fill colors for the cover, in drawing order of the white shapes.
    coverColors: ['#FFD23F','#FFD23F','#F79B3A','#F79B3A','#FFE3C2','#F79B3A','#F79B3A','#FFA8C5','#FFA8C5','#F79B3A','#FFE3C2','#FFE3C2','#FFD23F'],
    svg: `
      ${star(50, 50, 18)}${star(350, 60, 14)}
      <path d="M268,330 C345,335 360,255 330,225 C322,217 309,224 314,234 C335,270 320,302 262,300 Z"/>
      <ellipse cx="200" cy="290" rx="85" ry="85"/>
      <ellipse cx="200" cy="305" rx="45" ry="55"/>
      <polygon points="135,130 145,48 195,100"/>
      <polygon points="265,130 255,48 205,100"/>
      <polygon points="148,110 152,72 176,98" stroke-width="4"/>
      <polygon points="252,110 248,72 224,98" stroke-width="4"/>
      <circle cx="200" cy="160" r="75"/>
      ${eye(170, 150, 13)}${eye(230, 150, 13)}
      <polygon points="190,178 210,178 200,190" ${B}/>
      <path ${LINE} d="M200,190 Q192,206 180,200 M200,190 Q208,206 220,200"/>
      <path ${LINE} stroke-width="4" d="M165,185 L120,178 M165,193 L122,198 M235,185 L280,178 M235,193 L278,198"/>
      <ellipse cx="165" cy="370" rx="30" ry="17"/>
      <ellipse cx="235" cy="370" rx="30" ry="17"/>
      <circle cx="200" cy="248" r="12"/>
      <path ${LINE} stroke-width="5" d="M140,232 Q200,256 260,232"/>
    `,
  },
  {
    name: 'Dog',
    // Fill colors for the cover, in drawing order of the white shapes.
    coverColors: ['#FF5C8A','#FF5C8A','#C8894E','#C8894E','#F3DDBF','#C8894E','#C8894E','#C8894E','#7A4A26','#7A4A26','#7A4A26','#F3DDBF','#3BA4F5','#FFD23F','#F3DDBF','#F3DDBF'],
    svg: `
      ${heart(55, 45, 1.3)}${heart(340, 60, 1)}
      <path d="M275,320 C330,310 345,250 330,220 C325,210 312,214 314,226 C320,260 305,290 270,295 Z"/>
      <ellipse cx="200" cy="295" rx="85" ry="80"/>
      <ellipse cx="200" cy="305" rx="42" ry="50"/>
      <rect x="148" y="310" width="38" height="70" rx="18"/>
      <rect x="214" y="310" width="38" height="70" rx="18"/>
      <circle cx="200" cy="155" r="72"/>
      <ellipse cx="232" cy="138" rx="24" ry="22"/>
      <ellipse cx="128" cy="165" rx="26" ry="55" transform="rotate(18 128 165)"/>
      <ellipse cx="272" cy="165" rx="26" ry="55" transform="rotate(-18 272 165)"/>
      ${eye(172, 140, 11)}${eye(230, 140, 11)}
      <ellipse cx="200" cy="190" rx="40" ry="28"/>
      <ellipse cx="200" cy="177" rx="15" ry="10" ${B}/>
      <path ${LINE} d="M200,187 L200,198 M182,200 Q200,214 218,200"/>
      <rect x="150" y="222" width="100" height="18" rx="9"/>
      <circle cx="200" cy="252" r="13"/>
      <ellipse cx="167" cy="380" rx="24" ry="10" stroke-width="5"/>
      <ellipse cx="233" cy="380" rx="24" ry="10" stroke-width="5"/>
    `,
  },
  {
    name: 'Fish',
    // Fill colors for the cover, in drawing order of the white shapes.
    coverColors: ['#BDE8FF','#BDE8FF','#BDE8FF','#FF7A45','#FF7A45','#FF7A45','#FFB238','#fff'],
    svg: `
      <circle cx="60" cy="70" r="14" stroke-width="4"/><circle cx="85" cy="40" r="9" stroke-width="4"/><circle cx="70" cy="18" r="6" stroke-width="4"/>
      <path d="M290,200 L375,120 Q355,200 375,280 Z"/>
      <path d="M140,135 Q190,55 260,140 Z"/>
      <path d="M160,265 Q200,330 240,262 Z"/>
      <ellipse cx="190" cy="200" rx="125" ry="80"/>
      <path ${LINE} d="M145,140 Q175,200 145,260"/>
      <path ${LINE} stroke-width="4" d="M200,128 Q225,200 200,272 M245,135 Q268,200 245,265"/>
      <path ${LINE} stroke-width="4" d="M175,175 q10,-12 20,0 q10,-12 20,0 M175,215 q10,-12 20,0 q10,-12 20,0"/>
      <circle cx="105" cy="185" r="20"/>
      ${eye(108, 185, 10)}
      <path ${LINE} d="M75,215 Q88,228 100,220"/>
      <path ${LINE} stroke-width="5" d="M20,360 q25,-20 50,0 t50,0 t50,0 t50,0 t50,0 t50,0 t50,0 t50,0"/>
      <path ${LINE} stroke-width="5" d="M330,360 C320,330 340,320 330,295 M355,360 C365,335 345,320 358,300"/>
    `,
  },
  {
    name: 'Owl',
    // Fill colors for the cover, in drawing order of the white shapes.
    coverColors: ['#FFD23F','#FFE66D','#8B5A2B','#8E6CCF','#8E6CCF','#8E6CCF','#D9C8F5','#6A4BAE','#6A4BAE','#FFE66D','#FFE66D','#fff','#fff','#FF9F1C','#FF9F1C','#FF9F1C'],
    svg: `
      ${star(355, 50, 16)}
      <path transform="translate(-245 -20)" d="M300,85 a40,40 0 1 0 40,45 a32,32 0 1 1 -40,-45 Z" stroke-width="5"/>
      <rect x="40" y="345" width="320" height="26" rx="13"/>
      <polygon points="128,140 118,60 178,108"/>
      <polygon points="272,140 282,60 222,108"/>
      <ellipse cx="200" cy="225" rx="105" ry="125"/>
      <ellipse cx="200" cy="270" rx="62" ry="70"/>
      <path ${LINE} stroke-width="4" d="M172,240 l14,12 l14,-12 l14,12 l14,-12 M166,275 l17,12 l17,-12 l17,12 l17,-12 M172,310 l14,12 l14,-12 l14,12 l14,-12"/>
      <ellipse cx="105" cy="250" rx="28" ry="70" transform="rotate(12 105 250)"/>
      <ellipse cx="295" cy="250" rx="28" ry="70" transform="rotate(-12 295 250)"/>
      <circle cx="158" cy="160" r="40"/><circle cx="242" cy="160" r="40"/>
      <circle cx="158" cy="160" r="22" stroke-width="4"/><circle cx="242" cy="160" r="22" stroke-width="4"/>
      ${eye(158, 162, 11)}${eye(242, 162, 11)}
      <polygon points="188,190 212,190 200,215"/>
      <path d="M165,345 l-8,-18 l12,8 l6,-14 l6,14 l12,-8 l-8,18 Z" stroke-width="4"/>
      <path d="M215,345 l-8,-18 l12,8 l6,-14 l6,14 l12,-8 l-8,18 Z" stroke-width="4"/>
    `,
  },
  {
    name: 'Turtle',
    svg: `
      ${cloud(40, 70)}${cloud(290, 55)}
      ${grass(345)}
      <polygon points="70,280 40,295 75,300" />
      <ellipse cx="110" cy="310" rx="28" ry="30"/>
      <ellipse cx="290" cy="310" rx="28" ry="30"/>
      <path d="M300,250 C320,240 320,200 345,195 C385,190 395,250 360,265 C335,275 320,275 300,275 Z"/>
      ${eye(355, 220, 9)}
      <path ${LINE} stroke-width="5" d="M352,248 Q365,258 378,246"/>
      <path d="M70,280 A130,125 0 0 1 330,280 Z"/>
      <rect x="62" y="270" width="276" height="22" rx="11"/>
      <polygon points="200,190 240,212 240,252 200,272 160,252 160,212" stroke-width="5"/>
      <path ${LINE} stroke-width="5" d="M200,190 L200,160 M240,212 L268,192 M240,252 L278,268 M160,252 L122,268 M160,212 L132,192 M200,272 L200,280"/>
      <path ${LINE} stroke-width="5" d="M118,200 Q140,170 170,165 M282,200 Q260,170 230,165"/>
    `,
  },
  {
    name: 'Elephant',
    svg: `
      ${cloud(250, 50)}
      ${grass(370)}
      <path d="M335,240 C360,250 360,280 352,295" ${LINE}/>
      <path d="M346,288 l6,18 l10,-14 Z" stroke-width="4"/>
      <ellipse cx="235" cy="260" rx="115" ry="85"/>
      <rect x="150" y="300" width="45" height="70" rx="12"/>
      <rect x="275" y="300" width="45" height="70" rx="12"/>
      <path d="M78,215 C52,265 55,330 92,338 C105,341 112,325 100,318 C82,305 88,268 112,238 Z"/>
      <path ${LINE} stroke-width="4" d="M70,260 l14,4 M66,285 l14,2 M70,310 l14,0"/>
      <circle cx="130" cy="185" r="68"/>
      <path d="M105,228 Q100,262 130,272 Q118,252 122,232 Z" stroke-width="5"/>
      <ellipse cx="178" cy="190" rx="48" ry="62"/>
      <ellipse cx="182" cy="192" rx="30" ry="42" stroke-width="4"/>
      ${eye(115, 172, 11)}
      <path ${LINE} stroke-width="5" d="M100,150 Q112,140 126,148"/>
      <ellipse cx="172" cy="370" rx="26" ry="8" stroke-width="5"/>
      <ellipse cx="297" cy="370" rx="26" ry="8" stroke-width="5"/>
    `,
  },
  {
    name: 'Lion',
    svg: `
      ${star(45, 45, 14)}${star(360, 50, 16)}
      <path d="M270,345 C340,350 350,300 340,280" ${LINE}/>
      <path d="M330,285 c-10,-20 10,-35 22,-20 c10,15 -5,30 -22,20 Z"/>
      <ellipse cx="200" cy="315" rx="88" ry="60"/>
      <ellipse cx="160" cy="370" rx="32" ry="17"/>
      <ellipse cx="240" cy="370" rx="32" ry="17"/>
      <circle cx="200" cy="165" r="100"/>
      ${ring(200, 165, 98, 16, (x, y) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="30"/>`)}
      <circle cx="200" cy="165" r="95" stroke="none"/>
      <circle cx="148" cy="102" r="18"/><circle cx="252" cy="102" r="18"/>
      <circle cx="148" cy="102" r="8" stroke-width="4"/><circle cx="252" cy="102" r="8" stroke-width="4"/>
      <circle cx="200" cy="165" r="72"/>
      ${eye(172, 150, 11)}${eye(228, 150, 11)}
      <ellipse cx="200" cy="200" rx="34" ry="24"/>
      <path d="M186,182 L214,182 L200,198 Z" ${B}/>
      <path ${LINE} d="M200,198 L200,206 M184,214 Q200,222 216,214"/>
      <path ${LINE} stroke-width="4" d="M150,195 L118,190 M150,205 L120,212 M250,195 L282,190 M250,205 L280,212"/>
    `,
  },
  {
    name: 'Bunny',
    svg: `
      ${flower(45, 300)}${flower(355, 290)}
      ${grass(375)}
      <circle cx="285" cy="320" r="25"/>
      <ellipse cx="200" cy="300" rx="85" ry="75"/>
      <ellipse cx="200" cy="310" rx="45" ry="50"/>
      <ellipse cx="160" cy="80" rx="24" ry="70" transform="rotate(-10 160 80)"/>
      <ellipse cx="240" cy="80" rx="24" ry="70" transform="rotate(10 240 80)"/>
      <ellipse cx="160" cy="85" rx="10" ry="48" transform="rotate(-10 160 85)" stroke-width="4"/>
      <ellipse cx="240" cy="85" rx="10" ry="48" transform="rotate(10 240 85)" stroke-width="4"/>
      <circle cx="200" cy="180" r="65"/>
      ${eye(175, 170, 11)}${eye(225, 170, 11)}
      <ellipse cx="200" cy="195" rx="9" ry="7" ${B}/>
      <path ${LINE} d="M200,202 Q190,216 180,208 M200,202 Q210,216 220,208"/>
      <rect x="190" y="212" width="20" height="14" rx="3" stroke-width="4"/>
      <circle cx="160" cy="200" r="10" stroke-width="3"/><circle cx="240" cy="200" r="10" stroke-width="3"/>
      <ellipse cx="160" cy="370" rx="35" ry="16"/>
      <ellipse cx="240" cy="370" rx="35" ry="16"/>
    `,
  },
  {
    name: 'Pig',
    svg: `
      ${heart(50, 50, 1.2)}${heart(345, 45, 1.2)}
      ${grass(370)}
      <path ${LINE} d="M325,250 c25,-5 30,-30 12,-32 c-14,-2 -14,16 0,16 c18,0 22,-22 8,-30"/>
      <rect x="140" y="300" width="36" height="70" rx="10"/>
      <rect x="250" y="300" width="36" height="70" rx="10"/>
      <ellipse cx="225" cy="265" rx="110" ry="75"/>
      <polygon points="85,140 92,85 135,118"/>
      <polygon points="195,135 200,80 160,112"/>
      <circle cx="140" cy="175" r="65"/>
      ${eye(115, 160, 10)}${eye(165, 160, 10)}
      <ellipse cx="140" cy="200" rx="34" ry="24"/>
      <ellipse cx="128" cy="200" rx="6" ry="10" ${B}/>
      <ellipse cx="152" cy="200" rx="6" ry="10" ${B}/>
      <path ${LINE} d="M120,232 Q140,244 160,232"/>
      <path ${LINE} stroke-width="4" d="M150,370 l0,-10 M164,370 l0,-10 M260,370 l0,-10 M274,370 l0,-10"/>
    `,
  },
  {
    name: 'Frog',
    svg: `
      ${cloud(40, 70)}${cloud(290, 60)}
      <ellipse cx="200" cy="330" rx="170" ry="45"/>
      <path ${LINE} stroke-width="4" d="M200,330 L60,320 M200,330 L95,360 M200,330 L305,360 M200,330 L340,320"/>
      <ellipse cx="200" cy="250" rx="105" ry="70"/>
      <ellipse cx="200" cy="285" rx="52" ry="34"/>
      <ellipse cx="112" cy="310" rx="42" ry="17"/>
      <ellipse cx="288" cy="310" rx="42" ry="17"/>
      <circle cx="148" cy="170" r="38"/><circle cx="252" cy="170" r="38"/>
      <circle cx="148" cy="170" r="20" stroke-width="4"/><circle cx="252" cy="170" r="20" stroke-width="4"/>
      ${eye(148, 172, 10)}${eye(252, 172, 10)}
      <path ${LINE} d="M145,222 Q200,262 255,222"/>
      <circle cx="122" cy="232" r="10" stroke-width="3"/><circle cx="278" cy="232" r="10" stroke-width="3"/>
      <circle cx="188" cy="215" r="3" ${B}/><circle cx="212" cy="215" r="3" ${B}/>
    `,
  },
  {
    name: 'Snail',
    svg: `
      ${cloud(50, 70)}
      <circle cx="330" cy="70" r="30"/>
      ${ring(330, 70, 48, 8, (x, y, a) => `<path ${LINE} stroke-width="5" d="M${(330 + Math.cos(a) * 38).toFixed(1)},${(70 + Math.sin(a) * 38).toFixed(1)} L${x.toFixed(1)},${y.toFixed(1)}"/>`)}
      ${grass(345)}
      ${flower(40, 290)}
      <path d="M60,340 C60,310 100,300 140,300 L300,300 C330,300 330,240 300,215 C290,205 300,190 310,195 C355,215 365,340 300,340 Z"/>
      <path ${LINE} stroke-width="5" d="M300,212 L285,160 M318,205 L330,155"/>
      <circle cx="285" cy="155" r="10"/><circle cx="330" cy="150" r="10"/>
      ${eye(305, 245, 9)}
      <path ${LINE} stroke-width="5" d="M310,270 Q320,280 332,270"/>
      <circle cx="190" cy="220" r="90"/>
      <path ${LINE} d="M190,220 m0,-8 a8,8 0 1 1 -8,8 a20,20 0 0 1 20,-20 a32,32 0 0 1 32,32 a46,46 0 0 1 -46,46 a60,60 0 0 1 -60,-60 a74,74 0 0 1 74,-74"/>
    `,
  },
  {
    name: 'Bear',
    svg: `
      ${star(45, 50, 15)}${star(350, 55, 15)}
      <ellipse cx="200" cy="300" rx="90" ry="80"/>
      <ellipse cx="200" cy="310" rx="50" ry="55"/>
      <circle cx="140" cy="100" r="30"/><circle cx="260" cy="100" r="30"/>
      <circle cx="140" cy="100" r="15" stroke-width="4"/><circle cx="260" cy="100" r="15" stroke-width="4"/>
      <circle cx="200" cy="165" r="75"/>
      ${eye(170, 150, 11)}${eye(230, 150, 11)}
      <ellipse cx="200" cy="195" rx="36" ry="28"/>
      <ellipse cx="200" cy="182" rx="15" ry="10" ${B}/>
      <path ${LINE} d="M200,192 L200,202 M186,208 Q200,218 214,208"/>
      <ellipse cx="128" cy="285" rx="24" ry="45" transform="rotate(25 128 285)"/>
      <ellipse cx="272" cy="285" rx="24" ry="45" transform="rotate(-25 272 285)"/>
      ${heart(200, 270, 1.8)}
      <ellipse cx="155" cy="368" rx="34" ry="20"/>
      <ellipse cx="245" cy="368" rx="34" ry="20"/>
      <circle cx="155" cy="368" r="8" stroke-width="4"/><circle cx="245" cy="368" r="8" stroke-width="4"/>
    `,
  },
  {
    name: 'Duck',
    svg: `
      ${cloud(250, 60)}
      <circle cx="70" cy="70" r="28"/>
      ${ring(70, 70, 46, 8, (x, y, a) => `<path ${LINE} stroke-width="5" d="M${(70 + Math.cos(a) * 36).toFixed(1)},${(70 + Math.sin(a) * 36).toFixed(1)} L${x.toFixed(1)},${y.toFixed(1)}"/>`)}
      <polygon points="295,250 350,205 325,280"/>
      <ellipse cx="215" cy="270" rx="110" ry="62"/>
      <ellipse cx="150" cy="225" rx="38" ry="42"/>
      <circle cx="135" cy="165" r="55"/>
      <path d="M85,168 Q42,168 45,186 Q70,200 96,190 Z"/>
      <path ${LINE} stroke-width="4" d="M48,180 Q70,182 92,178"/>
      ${eye(130, 152, 10)}
      <circle cx="150" cy="185" r="10" stroke-width="3"/>
      <path d="M185,255 Q240,215 295,250 Q255,305 195,290 Z"/>
      <path ${LINE} stroke-width="4" d="M215,265 Q245,262 270,252 M210,280 Q240,280 265,268"/>
      <path ${LINE} stroke-width="5" d="M20,345 q25,-18 50,0 t50,0 t50,0 t50,0 t50,0 t50,0 t50,0 t50,0"/>
      <path ${LINE} stroke-width="5" d="M60,375 q25,-18 50,0 t50,0 t50,0 t50,0 t50,0 t50,0"/>
    `,
  },
  {
    name: 'Penguin',
    svg: `
      ${star(60, 70, 14)}${star(345, 60, 12)}${star(330, 140, 9)}${star(80, 150, 9)}
      <path ${LINE} d="M20,372 Q200,352 380,372"/>
      <ellipse cx="112" cy="245" rx="24" ry="65" transform="rotate(22 112 245)"/>
      <ellipse cx="288" cy="245" rx="24" ry="65" transform="rotate(-22 288 245)"/>
      <ellipse cx="200" cy="230" rx="95" ry="130"/>
      <path d="M200,140 C170,110 125,130 140,190 C120,260 140,340 200,345 C260,340 280,260 260,190 C275,130 230,110 200,140 Z"/>
      ${eye(175, 165, 11)}${eye(225, 165, 11)}
      <polygon points="186,185 214,185 200,207"/>
      <circle cx="160" cy="195" r="10" stroke-width="3"/><circle cx="240" cy="195" r="10" stroke-width="3"/>
      <rect x="132" y="218" width="136" height="24" rx="12"/>
      <rect x="225" y="228" width="26" height="62" rx="9"/>
      <path ${LINE} stroke-width="4" d="M231,280 l0,10 M239,280 l0,10 M245,280 l0,10"/>
      <ellipse cx="168" cy="360" rx="32" ry="14"/>
      <ellipse cx="232" cy="360" rx="32" ry="14"/>
    `,
  },
  {
    name: 'Giraffe',
    svg: `
      ${cloud(290, 60)}
      ${grass(372)}
      <path ${LINE} d="M325,260 Q350,290 345,325"/>
      <path d="M345,320 l-10,22 l22,-4 Z" stroke-width="4"/>
      <rect x="275" y="285" width="24" height="87" rx="9"/>
      <rect x="305" y="280" width="24" height="92" rx="9"/>
      <ellipse cx="250" cy="268" rx="88" ry="45"/>
      <rect x="172" y="282" width="24" height="90" rx="9"/>
      <rect x="210" y="290" width="24" height="82" rx="9"/>
      <path d="M165,265 L118,115 L165,100 L222,248 Z"/>
      <circle cx="225" cy="258" r="11" stroke-width="4"/><circle cx="262" cy="282" r="10" stroke-width="4"/>
      <circle cx="295" cy="255" r="12" stroke-width="4"/><circle cx="258" cy="246" r="7" stroke-width="4"/>
      <circle cx="315" cy="285" r="7" stroke-width="4"/>
      <circle cx="148" cy="155" r="9" stroke-width="4"/><circle cx="168" cy="200" r="11" stroke-width="4"/>
      <circle cx="190" cy="242" r="9" stroke-width="4"/><circle cx="148" cy="190" r="6" stroke-width="4"/>
      <path ${LINE} d="M118,70 L108,38 M145,62 L150,32"/>
      <circle cx="108" cy="36" r="9"/><circle cx="150" cy="30" r="9"/>
      <ellipse cx="172" cy="78" rx="20" ry="9" transform="rotate(-20 172 78)"/>
      <ellipse cx="125" cy="90" rx="50" ry="32" transform="rotate(-15 125 90)"/>
      <ellipse cx="88" cy="104" rx="24" ry="20" transform="rotate(-15 88 104)" stroke-width="4"/>
      <circle cx="78" cy="100" r="3" ${B}/><circle cx="92" cy="96" r="3" ${B}/>
      ${eye(132, 80, 9)}
      <path ${LINE} stroke-width="4" d="M82,116 Q95,124 106,114"/>
    `,
  },
  {
    name: 'Monkey',
    svg: `
      ${heart(50, 50, 1.2)}${star(350, 50, 15)}
      <path ${LINE} stroke-width="8" d="M255,330 C330,345 350,260 312,250 C296,246 290,266 304,270"/>
      <ellipse cx="200" cy="290" rx="72" ry="75"/>
      <ellipse cx="200" cy="300" rx="40" ry="50"/>
      <ellipse cx="140" cy="295" rx="20" ry="42" transform="rotate(18 140 295)"/>
      <ellipse cx="260" cy="295" rx="20" ry="42" transform="rotate(-18 260 295)"/>
      <ellipse cx="160" cy="370" rx="32" ry="15"/>
      <ellipse cx="240" cy="370" rx="32" ry="15"/>
      <circle cx="125" cy="150" r="27"/><circle cx="275" cy="150" r="27"/>
      <circle cx="120" cy="150" r="13" stroke-width="4"/><circle cx="280" cy="150" r="13" stroke-width="4"/>
      <circle cx="200" cy="150" r="72"/>
      <path d="M200,122 C175,100 138,115 145,150 C130,178 150,214 200,214 C250,214 270,178 255,150 C262,115 225,100 200,122 Z"/>
      ${eye(178, 145, 10)}${eye(222, 145, 10)}
      <circle cx="194" cy="174" r="3.5" ${B}/><circle cx="206" cy="174" r="3.5" ${B}/>
      <path ${LINE} d="M172,190 Q200,210 228,190"/>

    `,
  },
  {
    name: 'Mouse',
    svg: `
      ${star(50, 50, 14)}${star(350, 50, 14)}
      <path ${LINE} d="M268,330 C330,345 350,280 372,290"/>
      <ellipse cx="200" cy="295" rx="75" ry="72"/>
      <ellipse cx="200" cy="305" rx="40" ry="48"/>
      <ellipse cx="160" cy="370" rx="30" ry="14"/>
      <ellipse cx="240" cy="370" rx="30" ry="14"/>
      <circle cx="135" cy="100" r="48"/><circle cx="265" cy="100" r="48"/>
      <circle cx="135" cy="100" r="28" stroke-width="4"/><circle cx="265" cy="100" r="28" stroke-width="4"/>
      <ellipse cx="200" cy="170" rx="72" ry="62"/>
      ${eye(175, 158, 11)}${eye(225, 158, 11)}
      <circle cx="200" cy="190" r="11" ${B}/>
      <path ${LINE} d="M200,200 Q190,212 180,206 M200,200 Q210,212 220,206"/>
      <path ${LINE} stroke-width="4" d="M168,192 L120,184 M168,200 L122,206 M232,192 L280,184 M232,200 L278,206"/>
      <polygon points="40,375 125,375 125,315"/>
      <circle cx="100" cy="355" r="7" stroke-width="4"/><circle cx="112" cy="335" r="5" stroke-width="4"/><circle cx="78" cy="365" r="5" stroke-width="4"/>
    `,
  },
  {
    name: 'Cow',
    svg: `
      ${cloud(40, 60)}${cloud(290, 50)}
      ${grass(372)}
      <ellipse cx="200" cy="312" rx="108" ry="58"/>
      <ellipse cx="130" cy="318" rx="24" ry="17" stroke-width="4"/>
      <ellipse cx="275" cy="330" rx="22" ry="15" stroke-width="4"/>
      <path d="M150,112 Q118,96 118,66 Q142,86 168,100 Z"/>
      <path d="M250,112 Q282,96 282,66 Q258,86 232,100 Z"/>
      <ellipse cx="118" cy="148" rx="36" ry="16" transform="rotate(20 118 148)"/>
      <ellipse cx="282" cy="148" rx="36" ry="16" transform="rotate(-20 282 148)"/>
      <ellipse cx="200" cy="170" rx="72" ry="82"/>
      <path d="M222,112 C252,106 265,130 252,148 C240,158 222,142 222,112 Z" stroke-width="4"/>
      ${eye(172, 152, 11)}${eye(228, 152, 11)}
      <ellipse cx="200" cy="218" rx="62" ry="38"/>
      <ellipse cx="180" cy="214" rx="7" ry="11" ${B}/><ellipse cx="220" cy="214" rx="7" ry="11" ${B}/>
      <path ${LINE} d="M178,236 Q200,248 222,236"/>
      <rect x="185" y="258" width="30" height="22" rx="6"/>
      <circle cx="200" cy="288" r="8"/>
    `,
  },
  {
    name: 'Sheep',
    svg: `
      ${cloud(250, 55)}
      ${grass(372)}
      ${flower(350, 300)}
      <rect x="160" y="270" width="22" height="100" rx="9"/>
      <rect x="196" y="275" width="22" height="95" rx="9"/>
      <rect x="240" y="275" width="22" height="95" rx="9"/>
      <rect x="276" y="270" width="22" height="100" rx="9"/>
      ${Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2; return `<circle cx="${(230 + Math.cos(a) * 92).toFixed(1)}" cy="${(230 + Math.sin(a) * 58).toFixed(1)}" r="28"/>`; }).join('')}
      <ellipse cx="230" cy="230" rx="94" ry="60" stroke="none"/>
      <ellipse cx="82" cy="182" rx="24" ry="11" transform="rotate(-25 82 182)"/>
      <ellipse cx="162" cy="182" rx="24" ry="11" transform="rotate(25 162 182)"/>
      <ellipse cx="122" cy="205" rx="40" ry="50"/>
      <circle cx="104" cy="160" r="15"/><circle cx="140" cy="160" r="15"/><circle cx="122" cy="150" r="16"/>
      ${eye(108, 198, 9)}${eye(136, 198, 9)}
      <ellipse cx="122" cy="225" rx="8" ry="6" ${B}/>
      <path ${LINE} stroke-width="5" d="M110,238 Q122,248 134,238"/>
    `,
  },
  {
    name: 'Panda',
    svg: `
      ${star(45, 50, 14)}
      <rect x="292" y="130" width="28" height="245" rx="8"/>
      <path ${LINE} stroke-width="4" d="M292,190 L320,190 M292,255 L320,255 M292,320 L320,320"/>
      <ellipse cx="345" cy="160" rx="28" ry="11" transform="rotate(-30 345 160)"/>
      <ellipse cx="342" cy="232" rx="26" ry="10" transform="rotate(-20 342 232)"/>
      <ellipse cx="190" cy="300" rx="85" ry="75"/>
      <circle cx="135" cy="105" r="27"/><circle cx="245" cy="105" r="27"/>
      <circle cx="190" cy="165" r="72"/>
      <ellipse cx="163" cy="158" rx="19" ry="25" transform="rotate(35 163 158)"/>
      <ellipse cx="217" cy="158" rx="19" ry="25" transform="rotate(-35 217 158)"/>
      <circle cx="166" cy="156" r="10"/><circle cx="214" cy="156" r="10"/>
      <circle cx="166" cy="156" r="5" ${B}/><circle cx="214" cy="156" r="5" ${B}/>
      <ellipse cx="190" cy="197" rx="32" ry="22"/>
      <ellipse cx="190" cy="187" rx="12" ry="8" ${B}/>
      <path ${LINE} d="M190,195 L190,203 M178,208 Q190,216 202,208"/>
      <ellipse cx="120" cy="290" rx="22" ry="45" transform="rotate(25 120 290)"/>
      <ellipse cx="262" cy="262" rx="22" ry="48" transform="rotate(-60 262 262)"/>
      <ellipse cx="145" cy="365" rx="34" ry="20"/>
      <ellipse cx="235" cy="365" rx="34" ry="20"/>
    `,
  },
  {
    name: 'Fox',
    svg: `
      ${flower(45, 300)}${star(350, 50, 15)}${star(50, 60, 12)}
      ${grass(375)}
      <ellipse cx="300" cy="300" rx="36" ry="78" transform="rotate(40 300 300)"/>
      <path d="M326,262 C345,246 360,228 352,222 C340,214 320,230 308,248 Z" stroke-width="5"/>
      <ellipse cx="200" cy="305" rx="70" ry="70"/>
      <ellipse cx="200" cy="300" rx="35" ry="48"/>
      <ellipse cx="165" cy="370" rx="28" ry="14"/>
      <ellipse cx="235" cy="370" rx="28" ry="14"/>
      <polygon points="128,135 135,45 188,108"/>
      <polygon points="272,135 265,45 212,108"/>
      <polygon points="142,115 145,72 172,104" stroke-width="4"/>
      <polygon points="258,115 255,72 228,104" stroke-width="4"/>
      <path d="M118,118 Q200,92 282,118 Q272,190 200,240 Q128,190 118,118 Z"/>
      <path d="M200,240 Q150,205 138,152 Q175,168 200,196 Q225,168 262,152 Q250,205 200,240 Z"/>
      ${eye(170, 150, 10)}${eye(230, 150, 10)}
      <ellipse cx="200" cy="228" rx="11" ry="8" ${B}/>
    `,
  },
  {
    name: 'Octopus',
    svg: `
      <circle cx="350" cy="80" r="14" stroke-width="4"/><circle cx="330" cy="50" r="9" stroke-width="4"/><circle cx="345" cy="25" r="6" stroke-width="4"/>
      ${[-140, -85, -30, 30, 85, 140].map((d) => {
        const x = 200 + d * 0.55, e = d * 0.55, c = d > 0 ? 1 : -1;
        return `<path d="M${x - 17},195 C${x - 22},255 ${x + e - 20},300 ${x + e},345 C${x + e + 10 * c},362 ${x + e + 30 * c},350 ${x + e + 18 * c},332 C${x + e + 8},300 ${x + 20},255 ${x + 17},195 Z"/>`
          + `<circle cx="${x + e * 0.35}" cy="260" r="5" stroke-width="3"/><circle cx="${x + e * 0.7}" cy="300" r="4" stroke-width="3"/>`;
      }).join('')}
      <ellipse cx="200" cy="150" rx="100" ry="92"/>
      <circle cx="160" cy="95" r="10" stroke-width="4"/><circle cx="245" cy="88" r="14" stroke-width="4"/><circle cx="215" cy="70" r="7" stroke-width="4"/>
      <circle cx="165" cy="155" r="22"/><circle cx="235" cy="155" r="22"/>
      ${eye(165, 157, 11)}${eye(235, 157, 11)}
      <path ${LINE} d="M180,195 Q200,212 220,195"/>
      <circle cx="135" cy="190" r="11" stroke-width="3"/><circle cx="265" cy="190" r="11" stroke-width="3"/>
    `,
  },
  {
    name: 'Whale',
    svg: `
      ${cloud(40, 60)}
      <path ${LINE} stroke-width="5" d="M160,135 L160,85 M160,95 Q140,65 120,80 M160,95 Q180,65 200,80"/>
      <circle cx="115" cy="88" r="6" stroke-width="4"/><circle cx="205" cy="88" r="6" stroke-width="4"/><circle cx="160" cy="70" r="6" stroke-width="4"/>
      <path d="M298,210 C318,172 345,152 378,150 C362,172 356,184 342,198 C360,204 372,220 378,246 C346,240 320,230 302,236 Z"/>
      <path d="M45,230 C45,150 170,118 250,160 C285,178 300,200 318,206 L302,250 C262,292 120,302 78,276 C58,264 45,250 45,230 Z"/>
      <path ${LINE} stroke-width="4" d="M80,262 Q170,292 285,248 M100,276 L104,264 M130,284 L132,272 M162,288 L162,276 M195,286 L194,274 M228,278 L225,266"/>
      ${eye(108, 205, 10)}
      <path ${LINE} d="M55,238 Q85,254 118,244"/>
      <circle cx="132" cy="228" r="10" stroke-width="3"/>
      <ellipse cx="180" cy="248" rx="32" ry="13" transform="rotate(30 180 248)"/>
      <path ${LINE} stroke-width="5" d="M10,330 q25,-18 50,0 t50,0 t50,0 t50,0 t50,0 t50,0 t50,0 t50,0"/>
      <path ${LINE} stroke-width="5" d="M40,365 q25,-18 50,0 t50,0 t50,0 t50,0 t50,0 t50,0"/>
    `,
  },
  {
    name: 'Crab',
    svg: `
      ${star(55, 350, 22)}${cloud(280, 50)}
      ${star(345, 355, 18)}
      <path ${LINE} d="M10,385 L390,385"/>
      ${[0, 1, 2].map((i) => `<ellipse cx="${95 - i * 4}" cy="${245 + i * 30}" rx="42" ry="11" transform="rotate(${15 + i * 15} ${95 - i * 4} ${245 + i * 30})"/><ellipse cx="${305 + i * 4}" cy="${245 + i * 30}" rx="42" ry="11" transform="rotate(${-15 - i * 15} ${305 + i * 4} ${245 + i * 30})"/>`).join('')}
      <ellipse cx="115" cy="185" rx="15" ry="38" transform="rotate(-35 115 185)"/>
      <ellipse cx="285" cy="185" rx="15" ry="38" transform="rotate(35 285 185)"/>
      <path d="M82,140 L64,104 A38,38 0 1 0 104,106 Z"/>
      <path d="M318,140 L336,104 A38,38 0 1 1 296,106 Z"/>
      <path ${LINE} d="M175,205 L168,165 M225,205 L232,165"/>
      <ellipse cx="200" cy="250" rx="105" ry="62"/>
      <circle cx="166" cy="150" r="20"/><circle cx="234" cy="150" r="20"/>
      ${eye(166, 152, 10)}${eye(234, 152, 10)}
      <path ${LINE} d="M175,262 Q200,282 225,262"/>
      <circle cx="148" cy="255" r="10" stroke-width="3"/><circle cx="252" cy="255" r="10" stroke-width="3"/>
    `,
  },
];
