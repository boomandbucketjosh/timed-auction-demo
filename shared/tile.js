/* ── SHARED TILE FUNCTIONS ───────────────────────────────────────────────── */

function getBidIncrement(currentBid) {
  if (currentBid <   1000) return 100;
  if (currentBid <   5000) return 250;
  if (currentBid <  10000) return 500;
  if (currentBid <  25000) return 1000;
  if (currentBid <  50000) return 2500;
  if (currentBid < 100000) return 5000;
  return 10000;
}

function fmt$(n) {
  return '$' + Math.round(n).toLocaleString();
}

function fmtHr(h) {
  return h.toLocaleString() + ' hr';
}

function timerState(secsLeft) {
  if (secsLeft <= 30)  return 'critical';
  if (secsLeft <= 120) return 'urgent';
  if (secsLeft <= 300) return 'warning';
  return 'normal';
}

function formatTime(secs) {
  if (secs <= 0) return '0:00';
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function progressPct(item) {
  const remaining = item.closeTime - Date.now();
  const fullSpan  = 17 * 60 * 1000;
  return Math.max(0, Math.min(100, (remaining / fullSpan) * 100));
}

function buildTile(item) {
  const secsLeft  = Math.max(0, Math.ceil((item.closeTime - Date.now()) / 1000));
  const state     = timerState(secsLeft);
  const pct       = progressPct(item);
  const extVisible = Date.now() < item.extendedUntil;

  const el = document.createElement('div');
  el.className = `tile state-${state}${item.watchlisted ? ' watchlisted' : ''}`;
  el.id        = `tile-${item.id}`;
  el.dataset.id = item.id;

  el.innerHTML = `
    ${item.url ? `<a class="tile-link" href="${item.url}" target="_blank" rel="noopener noreferrer"></a>` : ''}
    <div class="tile-img-wrap">
      <img class="tile-img" src="${item.thumbnail}"
           style="background:${item.bgColor}"
           onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
      <div class="tile-img-fallback" style="background:${item.bgColor};display:none">
        ${item.type}
      </div>
      <button class="watch-btn${item.watchlisted ? ' active' : ''}" id="watch-${item.id}"
              onclick="toggleWatchlist(${item.id})" title="${item.watchlisted ? 'Remove from watchlist' : 'Add to watchlist'}">
        <svg width="13" height="13" viewBox="0 0 24 24">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                fill="${item.watchlisted ? '#F57C00' : 'none'}"
                stroke="${item.watchlisted ? '#F57C00' : '#9CA3AF'}"
                stroke-width="1.5"/>
        </svg>
      </button>
      <div class="extended-badge${extVisible ? ' visible' : ''}" id="badge-${item.id}">
        ⚡ AUTO EXTENDED
      </div>
      <div class="bid-status-banner${item.userBid ? (item.userWinning ? ' winning' : ' outbid') : ''}" id="status-${item.id}">
        ${item.userBid ? (item.userWinning ? 'Winning' : 'Outbid') : ''}
      </div>
      <div class="sold-overlay" id="overlay-${item.id}">
        <div class="sold-text">SOLD</div>
        <div class="sold-price">${fmt$(item.currentBid)}</div>
      </div>
    </div>
    <div class="bid-placed-overlay" id="bid-overlay-${item.id}">
      <div class="bid-placed-text">BID PLACED</div>
    </div>
    <div class="tile-body">
      <div class="tile-lot">LOT #${item.lotNum}${item.url ? `<svg class="tile-ext-icon" width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>` : ''}</div>
      <div class="tile-name">${item.year} ${item.make} ${item.model} ${item.type}</div>
      <div class="tile-info-row">
        <div class="tile-location">
          <svg width="10" height="12" viewBox="0 0 10 12" fill="none" style="flex-shrink:0">
            <path d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 7 5 7s5-3.25 5-7c0-2.76-2.24-5-5-5zm0 6.5A1.5 1.5 0 1 1 5 3.5a1.5 1.5 0 0 1 0 3z" fill="#6b7280"/>
          </svg>
          ${item.location}
        </div>
        <div class="tile-hours">${fmtHr(item.hours)}</div>
      </div>
      <div class="tile-bid-section">
        <div class="bid-price-wrap">
          <span class="bid-price" id="bid-${item.id}">${fmt$(item.currentBid)}</span>
          <span class="bid-currency">USD</span>
        </div>
        <div class="bid-count-val" id="count-${item.id}">${item.bidCount} bids</div>
      </div>
    </div>
    <div class="tile-footer">
      <div class="timer-row">
        <div class="timer-display" id="timer-${item.id}">${formatTime(secsLeft)}</div>
      </div>
      <div class="progress-wrap">
        <div class="progress-fill" id="prog-${item.id}" style="width:${pct}%"></div>
      </div>
      <button class="bid-btn" id="btn-${item.id}" onclick="placeBid(${item.id})">
        BID NOW &rarr;
      </button>
    </div>
  `;

  return el;
}
