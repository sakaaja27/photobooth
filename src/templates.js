export const FILTERS = [
  { id: "none", label: "Original", css: "none" },
  { id: "film", label: "Film", css: "contrast(1.08) saturate(0.85) sepia(0.18) brightness(1.02)" },
  { id: "bw", label: "B&W", css: "grayscale(1) contrast(1.12) brightness(1.02)" },
  { id: "warm", label: "Warm", css: "sepia(0.28) saturate(1.15) contrast(1.05) hue-rotate(-8deg)" },
  { id: "cool", label: "Cool", css: "saturate(0.9) hue-rotate(18deg) contrast(1.06) brightness(1.04)" },
  { id: "fade", label: "Fade", css: "contrast(0.88) saturate(0.75) brightness(1.08)" },
  { id: "vivid", label: "Vivid", css: "saturate(1.45) contrast(1.12) brightness(1.03)" },
  { id: "soft", label: "Soft", css: "contrast(0.92) brightness(1.1) saturate(1.05) blur(0.2px)" },
  { id: "noir", label: "Noir", css: "grayscale(1) contrast(1.35) brightness(0.92)" },
  { id: "matcha", label: "Matcha", css: "sepia(0.2) hue-rotate(42deg) saturate(0.9) contrast(1.05)" },
];

export const TEMPLATES = [
  {
    id: "snapmanner",
    name: "SnapManner Koran",
    vibe: "Vintage newspaper",
    orientation: "portrait",
    width: 794,
    height: 1123,
    slots: 2,
    kind: "newspaper",
  },
  {
    id: "squad",
    name: "Squad Goals",
    vibe: "Retro pop art",
    orientation: "portrait",
    width: 794,
    height: 1123,
    slots: 3,
    kind: "squad",
  },
  {
    id: "strip",
    name: "Seoul Strip",
    vibe: "4-cut photobox",
    orientation: "portrait",
    width: 420,
    height: 1260,
    slots: 4,
    kind: "strip",
  },
  {
    id: "polaroid",
    name: "Polaroid Cream",
    vibe: "Analog travel",
    orientation: "landscape",
    width: 1080,
    height: 720,
    slots: 1,
    kind: "polaroid",
  },
  {
    id: "coquette",
    name: "Coquette Pink",
    vibe: "Ribbon & lace",
    orientation: "portrait",
    width: 720,
    height: 1080,
    slots: 1,
    kind: "coquette",
  },
  {
    id: "y2k",
    name: "Y2K Chrome",
    vibe: "Cyber hearts",
    orientation: "portrait",
    width: 720,
    height: 1080,
    slots: 2,
    kind: "y2k",
  },
  {
    id: "magazine",
    name: "Cover Magazine",
    vibe: "Editorial vogue",
    orientation: "portrait",
    width: 720,
    height: 1080,
    slots: 1,
    kind: "magazine",
  },
  {
    id: "matcha",
    name: "Matcha Journal",
    vibe: "Earthy cafe",
    orientation: "landscape",
    width: 1080,
    height: 720,
    slots: 2,
    kind: "matcha",
  },
  {
    id: "neon",
    name: "Night Neon",
    vibe: "City after dark",
    orientation: "landscape",
    width: 1280,
    height: 720,
    slots: 1,
    kind: "neon",
  },
  {
    id: "film3",
    name: "35mm Triptych",
    vibe: "Cinema stills",
    orientation: "landscape",
    width: 1280,
    height: 540,
    slots: 3,
    kind: "film3",
  },
  {
    id: "minimal",
    name: "Quiet Beige",
    vibe: "Soft studio",
    orientation: "portrait",
    width: 800,
    height: 1000,
    slots: 1,
    kind: "minimal",
  },
];

function slotMarkup(count, labels = []) {
  return Array.from({ length: count }, (_, i) => {
    const label = labels[i] || `Foto ${i + 1}`;
    return `<button class="photo-slot" type="button" data-slot="${i}" aria-label="${label}">
      <video playsinline muted autoplay></video>
      <img alt="" />
      <span class="slot-hint">${label}</span>
    </button>`;
  }).join("");
}

export function renderTemplate(template, texts) {
  const t = texts;
  if (template.kind === "newspaper") {
    return `
      <article class="paper news-paper">
        <header class="news-top">
          <div class="news-box">BRUNO MARS<br /><em>THE ROMANTIC</em></div>
          <p>BREAKING<br />NEWS</p>
          <div class="news-mast">
            <h1>SnapManner</h1>
            <small>Capture the Moment, Make the News!</small>
          </div>
          <p>SPECIAL<br />ISSUE</p>
          <div class="news-box dark">NEW MUSIC<br />FRIDAY</div>
        </header>
        <h2 class="news-script" data-bind="headline">${escapeHtml(t.headline)}</h2>
        <div class="news-sub">
          <span>MELODIC MUSES</span>
          <span>THE MUSIC ARCHIVE</span>
          <span data-bind="date">${escapeHtml(t.date)}</span>
        </div>
        <div class="ornate">
          ${slotMarkup(1, ["Foto utama"])}
        </div>
        <div class="news-cap">
          <span data-bind="caption">${escapeHtml(t.caption)}</span>
          <em>Vol. MCMVI — No. 003/SM/MUSIC</em>
        </div>
        <div class="news-grid">
          <div class="news-col">
            <h3>BRUNO MARS - RISK IT ALL</h3>
            <p>In an era where music often chases vitality over depth, this issue captures a moment that still holds power. Built on smooth instrumentation and emotionally charged vocals, every lyric feels intentional.</p>
            <div class="romantic-card">
              <small>BRUNO MARS</small>
              <strong>The Romantic</strong>
              <em>RISK IT ALL</em>
            </div>
            <div class="lyric">
              <div class="qr"></div>
              <p>It's crazy, but it's true<br />There's nothing I won't do<br />I'd risk it all for you</p>
            </div>
          </div>
          <div class="news-col mid">
            <p class="kicker">- SM ARCHIVE -</p>
            ${slotMarkup(1, ["Foto arsip"]).replace('data-slot="0"', 'data-slot="1"')}
            <p class="bar">I'LL DO ANYTHING, ANYTHING YOU ASK ME TO</p>
            <p>A reminder that real risk often lies not in failure, but in daring to care deeply. Shared in crowded spaces, the track remains a testament to enduring romance.</p>
            <p class="pull">A soulful dive into the heart-pounding gamble of love, redefining the boundaries of modern R&amp;B.</p>
          </div>
          <div class="news-col side">
            <p class="kicker">SNAPMANNER MUSIC SPACE</p>
            <h3>BRUNO MARS</h3>
            <h4>THE ROMANTIC TOUR</h4>
            <div class="poster">
              <div class="sketch" aria-hidden="true"></div>
              <div class="poster-meta">
                <b>Atlantic Records</b>
                <span>ALBUM &amp;<br />CAREER CONTEXT</span>
                <small>Live moments with the night crowd. Stage for everlasting romance now starring in records.</small>
              </div>
            </div>
            <div class="sm-foot">
              <span class="sm-logo">SM</span>
              <div>
                <b>SnapManner</b>
                <small>SnapManner Photobooth</small>
              </div>
            </div>
          </div>
        </div>
        <footer class="news-footer">
          <span>Song: “Risk It All - Bruno Mars”</span>
          <span>LOCAL ICON SPOTTED AT THIS CITY</span>
          <span>@snapmannerid</span>
        </footer>
      </article>`;
  }

  if (template.kind === "squad") {
    const defaultHeadline = t.headline || "SQUAD";
    return `<article class="paper squad-paper">
      <div class="squad-bg">
        <div class="squad-sunburst"></div>
      </div>
      <div class="squad-content">
        <div class="squad-header">
          <div class="squad-pill">- Archivebooth Presents -</div>
          <div class="squad-sparkles"></div>
          <h2 class="squad-title">
            <span class="squad-t1" data-bind="headline">${escapeHtml(defaultHeadline)}</span>
            <span class="squad-t2">GOALS</span>
          </h2>
        </div>
        
        <div class="squad-hero">
          ${slotMarkup(1, ["Foto Utama"])}
        </div>
        
        <div class="squad-grid">
          <div class="squad-slot-wrap">
             ${slotMarkup(1, ["Foto Kiri"]).replace('data-slot="0"', 'data-slot="1"')}
             <div class="squad-badge">EXCLUSIVE<br/>DROP!</div>
          </div>
          <div class="squad-slot-wrap">
             ${slotMarkup(1, ["Foto Kanan"]).replace('data-slot="0"', 'data-slot="2"')}
          </div>
        </div>
        
        <div class="squad-footer">
          <div class="squad-f-left">
            <div class="squad-f-bestie">BESTIE</div>
            <div class="squad-f-approved">APPROVED</div>
          </div>
          <div class="squad-f-mid">AT BALIKPAPAN</div>
          <div class="squad-f-right">
            <div class="squad-barcode"></div>
            <div class="squad-barcode-text">(00)123456789101112133</div>
          </div>
        </div>
      </div>
      
      <div class="squad-checker"></div>
    </article>`;
  }

  if (template.kind === "strip") {
    return `<article class="paper strip-paper">
      <div class="strip-brand">SNAPMANNER · 4CUT</div>
      ${slotMarkup(4, ["Pose 1", "Pose 2", "Pose 3", "Pose 4"])}
      <div class="strip-foot"><span>today's date</span><b data-bind="date">${escapeHtml(t.date)}</b></div>
    </article>`;
  }

  if (template.kind === "polaroid") {
    return `<article class="paper polaroid-paper">
      <div class="polaroid-frame">
        ${slotMarkup(1, ["Foto landscape"])}
        <p class="polaroid-cap" data-bind="headline">${escapeHtml(t.headline)}</p>
      </div>
    </article>`;
  }

  if (template.kind === "coquette") {
    return `<article class="paper coquette-paper">
      <div class="lace"></div>
      <h3 class="coq-title" data-bind="headline">${escapeHtml(t.headline)}</h3>
      ${slotMarkup(1, ["Foto coquette"])}
      <p class="coq-sub">darling · forever · ${escapeHtml(t.date)}</p>
    </article>`;
  }

  if (template.kind === "y2k") {
    return `<article class="paper y2k-paper">
      <div class="chrome-title" data-bind="headline">${escapeHtml(t.headline)}</div>
      <div class="y2k-slots">${slotMarkup(2, ["Atas", "Bawah"])}</div>
      <p class="y2k-tag">www.snapmanner.studio · ${escapeHtml(t.date)}</p>
    </article>`;
  }

  if (template.kind === "magazine") {
    return `<article class="paper mag-paper">
      ${slotMarkup(1, ["Cover"])}
      <div class="mag-ui">
        <p class="mag-issue">SEPTEMBER ISSUE</p>
        <h3 data-bind="headline">${escapeHtml(t.headline)}</h3>
        <p class="mag-cap" data-bind="caption">${escapeHtml(t.caption)}</p>
      </div>
    </article>`;
  }

  if (template.kind === "matcha") {
    return `<article class="paper matcha-paper">
      <header><span>FIELD NOTES</span><b data-bind="date">${escapeHtml(t.date)}</b></header>
      <div class="matcha-grid">${slotMarkup(2, ["Kiri", "Kanan"])}</div>
      <h3 data-bind="headline">${escapeHtml(t.headline)}</h3>
    </article>`;
  }

  if (template.kind === "neon") {
    return `<article class="paper neon-paper">
      ${slotMarkup(1, ["Night shot"])}
      <div class="neon-ui">
        <p>AFTER HOURS</p>
        <h3 data-bind="headline">${escapeHtml(t.headline)}</h3>
      </div>
    </article>`;
  }

  if (template.kind === "film3") {
    return `<article class="paper film-paper">
      <div class="sprockets"></div>
      <div class="film-row">${slotMarkup(3, ["Take 1", "Take 2", "Take 3"])}</div>
      <div class="sprockets"></div>
    </article>`;
  }

  return `<article class="paper minimal-paper">
    ${slotMarkup(1, ["Studio"])}
    <div class="min-cap">
      <b data-bind="headline">${escapeHtml(t.headline)}</b>
      <span data-bind="date">${escapeHtml(t.date)}</span>
    </div>
  </article>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
