/* =========================================================
   MJT Trip Estimator — data & logic
   Referensi: Peta Transportasi Massal Cekungan Bandung, April 2026
   Struktur data dibuat mudah diedit/ditambah.
   ========================================================= */

// Warna tiap koridor
const CORRIDOR_COLORS = {
  K1: "#1FA35A",
  K2: "#E63946",
  K3: "#8E44AD",
  K4: "#2E5BFF",
  K5: "#E91E8C",
  K6: "#F2843C",
  FD1: "#1FA35A",
  FD2: "#E63946",
};

const CORRIDOR_ICONS = {
  K1: "🟢",
  K2: "🔴",
  K3: "🟣",
  K4: "🔵",
  K5: "🩷",
  K6: "🟠",
};

// Data koridor: setiap koridor punya urutan halte (satu arah acuan).
// Menambah koridor / halte baru cukup menambah entri di sini.
const corridors = [
  {
    code: "K1",
    name: "Leuwipanjang → Soreang",
    stops: [
      "Terminal Leuwipanjang", "Leuwipanjang Soekarno Hatta", "Pasar Induk Caringin",
      "Sumbersari Junction", "Hotel Grand Pasundan", "Bumi Kopo Kencana",
      "Mall Festival Citylink", "Simpang Pasirkoja", "SPBU Pasir Koja",
      "Hotel Soreang", "Mall Pelayanan Publik", "Plaza Pemkab Bandung",
      "Simpang Desa Soreang", "Pasar Ikan Modern", "RSUD Otto Iskandar Dinata",
      "SAMSAT Soreang", "Geo Dipa Energi", "Pengendapan Bus Soreang",
    ],
  },
  {
    code: "K2",
    name: "Kota Baru Parahyangan → Alun-alun Bandung",
    stops: [
      "Kota Baru Parahyangan", "Parahyangan Selatan", "Wahoo Waterworld",
      "Parahyangan Timur", "Parahyangan Utara", "Tatar Wangsakerta",
      "Bale Pare", "Stasiun Padalarang", "STEI LPPM", "RS Karisma Cimareme",
      "RS IMC", "Masjid Ar-Ridwan", "Padasuka Indah", "Rancabelut",
      "PLN Cisangkan", "Buana", "Gedung 4", "SMPN 6", "BRI Cimahi",
      "RSUD Cibabat", "RS Mitra Kasih", "Dinas Sosial", "Cilember",
      "Jalan Budi", "SMAN 13", "Kebon Kopi", "Paledang", "Rajawali Barat",
      "Plaza Telkom Rajawali", "Rajawali 1", "Dungus Cariang", "Sudirman 3",
      "Optik Krida", "SMA Trinitas", "Kemenag Kanwil Jabar", "RS Kebon Jati",
      "Toko Ambon", "SMA Pasundan", "Mayapada Tower", "Perintis Kemerdekaan",
      "GKI Anugerah", "Lembong", "KEB Hana Bank", "Alun-alun Bandung",
    ],
  },
  {
    code: "K3",
    name: "Baleendah → BEC",
    stops: [
      "Baleendah", "RS Al Ihsan", "Kejari Bale Bandung", "Apotek K24",
      "Masjid Jami Baitul Huda", "Alfamart SPBU Bojongsoang", "Griya Bandung Asri",
      "AHASS", "Podomoro", "Permata Buah Batu", "Transmart Buah Batu",
      "Puskesmas Kujangsari", "Bluebird", "Pasar Kordon", "Swadharma BNI",
      "Buah Batu", "Bangunan Mart", "LPKIA", "PT LEN Industri",
      "PLN UP3 Bandung", "Madurasa Tengah", "PT INTI", "Lapang Tegallega",
      "Simpang Ijan", "Toko Mas ABC", "Alun-alun Bandung", "Banceuy",
      "Stasiun Timur", "Stasiun Bandung", "SMAN 6 Bandung", "SDN Pajajaran",
      "STHB", "Bandung Electronic Centre (BEC)", "Santa Angela (Merdeka)",
      "Museum Kota Bandung",
    ],
  },
  {
    code: "K4",
    name: "Leuwipanjang → Dago",
    stops: [
      "Terminal Leuwipanjang", "RS Immanuel", "Simpang Moh Toha",
      "Taman Tegallega", "Pasar Tegallega", "Pintu Keluar Terminal Tegalega",
      "Ibu Inggit Garnasih", "RSIA Astana Anyar", "Dalem Kaum",
      "Stasiun Bandung Pintu Selatan", "Pasar Baru", "Balaikota",
      "Bank Indonesia", "Santa Angela (Merdeka)", "Bandung Indah Plaza",
      "Bandung Electronic Centre (BEC)", "Hotel The-One-O-One", "Taman Radio",
      "Kartika Sari", "RS Santo Borromeus", "Masjid Baiturrahman",
      "UNPAD Dipatiukur",
    ],
  },
  {
    code: "K5",
    name: "Unpad Jatinangor → Unpad Dipatiukur",
    stops: [
      "UNPAD Jatinangor", "Jatinangor Town Square", "IPDN", "Cileunyi",
      "Simpang By Pass Soetta", "PT INTI", "Hotel Horison",
      "Bandung Creative Hub", "Hotel Grand Tebu", "SPBU Ahmad Yani",
      "Taman Pramuka", "Baltos", "Lapangan Supratman", "Pusdai",
      "Lapangan Gasibu", "ITB Ganesha", "Panatayuda", "UNPAD Dipatiukur",
    ],
  },
  {
    code: "K6",
    name: "Leuwipanjang → Majalaya",
    stops: [
      "Terminal Leuwipanjang", "RS Immanuel", "Biddokes",
      "TK Kemala Bhayangkari 49", "SDN Babakan Tarogong", "Muara",
      "PT INTI", "Palasari", "Zipur Dayeuhkolot", "Borma Bojongsoang",
      "Griya Bandung Asri", "Pasar Baleendah", "Bumi Siliwangi",
      "Giri Harja Jelekong", "Terminal Ciparay", "Borma Majalaya",
      "Terminal Majalaya",
    ],
  },
];

// Lokasi yang bisa dipilih user -> mengacu ke nama halte pada koridor di atas.
// Semua nama diambil dari Peta Transportasi Massal Cekungan Bandung, April 2026,
// kecuali "Baltos" dan "ITB Ganesha" yang ditandai sebagai lokasi perkiraan
// (tidak tercetak persis di peta, didekatkan ke halte terdekat pada koridor K5).
const locations = [
  { label: "Terminal Leuwipanjang", stop: "Terminal Leuwipanjang" },
  { label: "Terminal Soreang", stop: "Pengendapan Bus Soreang" },
  { label: "Hotel Soreang", stop: "Hotel Soreang" },
  { label: "SAMSAT Soreang", stop: "SAMSAT Soreang" },
  { label: "Kota Baru Parahyangan", stop: "Kota Baru Parahyangan" },
  { label: "Stasiun Padalarang", stop: "Stasiun Padalarang" },
  { label: "BRI Cimahi", stop: "BRI Cimahi" },
  { label: "RSUD Cibabat", stop: "RSUD Cibabat" },
  { label: "Baleendah", stop: "Baleendah" },
  { label: "Permata Buah Batu", stop: "Permata Buah Batu" },
  { label: "Buah Batu", stop: "Buah Batu" },
  { label: "PLN UP3 Bandung", stop: "PLN UP3 Bandung" },
  { label: "PT INTI", stop: "PT INTI" },
  { label: "Griya Bandung Asri", stop: "Griya Bandung Asri" },
  { label: "Borma Bojongsoang", stop: "Borma Bojongsoang" },
  { label: "Alun-alun Bandung", stop: "Alun-alun Bandung" },
  { label: "Stasiun Bandung", stop: "Stasiun Bandung" },
  { label: "BEC", stop: "Bandung Electronic Centre (BEC)" },
  { label: "Merdeka (Santa Angela)", stop: "Santa Angela (Merdeka)" },
  { label: "Balaikota", stop: "Balaikota" },
  { label: "Bandung Indah Plaza", stop: "Bandung Indah Plaza" },
  { label: "Kartika Sari", stop: "Kartika Sari" },
  { label: "Dipatiukur", stop: "UNPAD Dipatiukur" },
  { label: "Lapangan Gasibu", stop: "Lapangan Gasibu" },
  { label: "Pusdai", stop: "Pusdai" },
  { label: "ITB Ganesha", stop: "ITB Ganesha" },
  { label: "Baltos", stop: "Baltos" },
  { label: "Bandung Creative Hub", stop: "Bandung Creative Hub" },
  { label: "Hotel Horison", stop: "Hotel Horison" },
  { label: "Cileunyi", stop: "Cileunyi" },
  { label: "IPDN", stop: "IPDN" },
  { label: "Jatinangor", stop: "UNPAD Jatinangor" },
  { label: "Pasar Baleendah", stop: "Pasar Baleendah" },
  { label: "Terminal Ciparay", stop: "Terminal Ciparay" },
  { label: "Terminal Majalaya", stop: "Terminal Majalaya" },
];

// Petunjuk lokasi/landmark populer yang bukan nama halte persis di peta,
// dipetakan ke halte MJT terdekat. Bantu user yang tidak hafal nama halte.
const landmarkHints = [
  { keywords: ["telkom university", "tel-u", "telu", "telkom u"], stop: "Buah Batu", note: "Telkom University berada di kawasan Buah Batu/Sukapura." },
  { keywords: ["itb", "institut teknologi bandung", "ganesha"], stop: "ITB Ganesha", note: "ITB kampus Ganesha, dekat Lapangan Gasibu." },
  { keywords: ["unpad dipatiukur", "unpad bandung", "unikom"], stop: "UNPAD Dipatiukur", note: "Kawasan Dipatiukur/Dago bawah." },
  { keywords: ["unpad jatinangor", "ikopin", "jatinangor"], stop: "UNPAD Jatinangor", note: "Kawasan kampus Jatinangor." },
  { keywords: ["gasibu", "monju", "monumen juang"], stop: "Lapangan Gasibu", note: "Area Lapangan Gasibu/Gedung Sate." },
  { keywords: ["bec", "electronic centre", "electronic center"], stop: "Bandung Electronic Centre (BEC)", note: "BEC di Jl. Purnawarman." },
  { keywords: ["stasiun bandung", "kereta bandung"], stop: "Stasiun Bandung", note: "Stasiun Bandung (Hall besar/kecil)." },
  { keywords: ["stasiun padalarang", "kereta padalarang"], stop: "Stasiun Padalarang", note: "Stasiun Padalarang, arah KCJB/lokal." },
  { keywords: ["balai kota", "balaikota"], stop: "Balaikota", note: "Kawasan Balai Kota Bandung / Taman Sejarah." },
  { keywords: ["alun alun", "alun-alun bandung", "masjid raya bandung"], stop: "Alun-alun Bandung", note: "Alun-alun & Masjid Raya Bandung." },
  { keywords: ["baltos", "bandung trade center", "btc dago"], stop: "Baltos", note: "Bandung Trade Center, Jl. Ir. H. Djuanda (Dago)." },
  { keywords: ["cimahi"], stop: "BRI Cimahi", note: "Kawasan pusat Kota Cimahi." },
  { keywords: ["soreang"], stop: "Hotel Soreang", note: "Pusat Kota Soreang." },
  { keywords: ["majalaya"], stop: "Terminal Majalaya", note: "Pusat Kota Majalaya." },
];

/* =========================================================
   Routing engine (prototype-level, bukan real-time)
   ========================================================= */

function corridorsContaining(stopName) {
  return corridors.filter((c) => c.stops.includes(stopName));
}

function sharedStop(corridorA, corridorB) {
  return corridorA.stops.find((s) => corridorB.stops.includes(s));
}

// BFS sederhana antar koridor (maks 2 transit) via halte yang beririsan.
function findCorridorPath(fromStop, toStop) {
  const startCorridors = corridorsContaining(fromStop);
  const endCorridors = corridorsContaining(toStop);
  if (startCorridors.length === 0 || endCorridors.length === 0) return null;

  // Rute langsung (tanpa transit)
  for (const c of startCorridors) {
    if (endCorridors.includes(c)) {
      return [{ corridor: c, board: fromStop, alight: toStop }];
    }
  }

  // BFS antar koridor lewat halte irisan, maksimal 2 transit (3 koridor)
  const queue = startCorridors.map((c) => ({ path: [c], via: [fromStop] }));
  const visited = new Set(startCorridors.map((c) => c.code));

  while (queue.length) {
    const { path, via } = queue.shift();
    if (path.length > 3) continue;
    const last = path[path.length - 1];

    for (const next of corridors) {
      if (path.includes(next)) continue;
      const junction = sharedStop(last, next);
      if (!junction) continue;

      const newPath = [...path, next];
      const newVia = [...via, junction];

      if (endCorridors.includes(next)) {
        // bangun segments
        const segments = [];
        for (let i = 0; i < newPath.length; i++) {
          const board = newVia[i];
          const alight = i === newPath.length - 1 ? toStop : newVia[i + 1];
          segments.push({ corridor: newPath[i], board, alight });
        }
        return segments;
      }

      if (!visited.has(next.code + newPath.length)) {
        visited.add(next.code + newPath.length);
        queue.push({ path: newPath, via: newVia });
      }
    }
  }

  return null;
}

function hopCount(corridor, from, to) {
  const i = corridor.stops.indexOf(from);
  const j = corridor.stops.indexOf(to);
  return Math.max(1, Math.abs(j - i));
}

function roundTo5(n) {
  return Math.round(n / 5) * 5;
}

function estimateSegmentMinutes(corridor, from, to) {
  const hops = hopCount(corridor, from, to);
  const min = Math.max(10, roundTo5(hops * 1.8));
  const max = Math.max(min + 5, roundTo5(hops * 2.8));
  return { min, max };
}

function buildTrip(fromLabel, toLabel, fromStop, toStop) {
  if (fromStop === toStop) return null;

  const rawSegments = findCorridorPath(fromStop, toStop);
  if (!rawSegments) return null;

  const segments = rawSegments.map((seg) => {
    const est = estimateSegmentMinutes(seg.corridor, seg.board, seg.alight);
    return {
      code: seg.corridor.code,
      color: CORRIDOR_COLORS[seg.corridor.code],
      icon: CORRIDOR_ICONS[seg.corridor.code],
      route: seg.corridor.name,
      boarding: seg.board,
      stop: seg.alight,
      minMinutes: est.min,
      maxMinutes: est.max,
      passedStops: seg.corridor.stops.slice(
        Math.min(seg.corridor.stops.indexOf(seg.board), seg.corridor.stops.indexOf(seg.alight)),
        Math.max(seg.corridor.stops.indexOf(seg.board), seg.corridor.stops.indexOf(seg.alight)) + 1
      ).sort((a, b) => {
        const boardIsFirst = seg.corridor.stops.indexOf(seg.board) <= seg.corridor.stops.indexOf(seg.alight);
        return boardIsFirst
          ? seg.corridor.stops.indexOf(a) - seg.corridor.stops.indexOf(b)
          : seg.corridor.stops.indexOf(b) - seg.corridor.stops.indexOf(a);
      }),
    };
  });

  const transfers = segments.length - 1;
  const walkToStart = { min: 5, max: 10 };
  const walkToEnd = { min: 1, max: 5 };
  const transitTime = { min: 5, max: 10 };

  let totalMin = walkToStart.min + walkToEnd.min;
  let totalMax = walkToStart.max + walkToEnd.max;
  segments.forEach((s) => {
    totalMin += s.minMinutes;
    totalMax += s.maxMinutes;
  });
  totalMin += transfers * transitTime.min;
  totalMax += transfers * transitTime.max;

  return {
    fromLabel,
    toLabel,
    transfers,
    duration: `${roundTo5(totalMin)}–${roundTo5(totalMax)} menit`,
    fare: "Rp4.900",
    fareStudent: "Rp2.000",
    segments,
    walkToStart,
    walkToEnd,
    transitTime,
  };
}

/* =========================================================
   Rendering
   ========================================================= */

const fromSelect = document.getElementById("from-select");
const toSelect = document.getElementById("to-select");
const form = document.getElementById("trip-form");
const resultEl = document.getElementById("result");

function populateSelect(selectEl) {
  locations.forEach((loc) => {
    const opt = document.createElement("option");
    opt.value = loc.label;
    opt.textContent = loc.label;
    selectEl.appendChild(opt);
  });
}

populateSelect(fromSelect);
populateSelect(toSelect);
fromSelect.value = "Buah Batu";
toSelect.value = "Baltos";

document.getElementById("swap-btn").addEventListener("click", () => {
  const a = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = a;
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const fromLabel = fromSelect.value;
  const toLabel = toSelect.value;
  if (!fromLabel || !toLabel) return;

  const fromLoc = locations.find((l) => l.label === fromLabel);
  const toLoc = locations.find((l) => l.label === toLabel);

  const trip = buildTrip(fromLabel, toLabel, fromLoc.stop, toLoc.stop);
  renderResult(trip, fromLabel, toLabel);
});

function renderResult(trip, fromLabel, toLabel) {
  resultEl.classList.remove("hidden", "show");
  document.getElementById("result-from").textContent = fromLabel;
  document.getElementById("result-to").textContent = toLabel;

  const notAvailableCard = document.getElementById("not-available-card");
  const timelineCard = document.getElementById("timeline-card");
  const detailCard = document.getElementById("detail-card");
  const durationCard = document.getElementById("duration-card");
  const fareCard = document.getElementById("fare-card");
  const summaryStrip = document.getElementById("summary-strip");

  if (!trip) {
    notAvailableCard.hidden = false;
    timelineCard.style.display = "none";
    detailCard.style.display = "none";
    durationCard.style.display = "none";
    fareCard.style.display = "none";
    summaryStrip.style.display = "none";
  } else {
    notAvailableCard.hidden = true;
    timelineCard.style.display = "";
    detailCard.style.display = "";
    durationCard.style.display = "";
    fareCard.style.display = "";
    summaryStrip.style.display = "";

    document.getElementById("summary-time").textContent = trip.duration;
    document.getElementById("summary-transfer").textContent =
      trip.transfers === 0 ? "Langsung" : `${trip.transfers}x transit`;
    document.getElementById("summary-fare").textContent = `± ${trip.fare}`;

    renderTimeline(trip, fromLabel, toLabel);
    renderDetail(trip);
    renderDuration(trip);
  }

  // trigger animation
  void resultEl.offsetWidth;
  resultEl.classList.add("show");
  resultEl.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderTimeline(trip, fromLabel, toLabel) {
  const el = document.getElementById("timeline");
  el.innerHTML = "";

  const addNode = (html) => {
    const div = document.createElement("div");
    div.className = "tl-node";
    div.innerHTML = html;
    el.appendChild(div);
  };
  const addConnector = (colored) => {
    const div = document.createElement("div");
    div.className = "tl-connector" + (colored ? " colored" : "");
    if (colored) div.style.background = colored;
    el.appendChild(div);
  };

  addNode(`
    <div class="tl-icon-label">📍</div>
    <div class="tl-label">${fromLabel}</div>
  `);

  trip.segments.forEach((seg, idx) => {
    addConnector(seg.color);

    const segDiv = document.createElement("div");
    segDiv.className = "tl-segment";
    segDiv.style.background = seg.color;
    segDiv.innerHTML = `
      <div class="seg-code">${seg.icon} ${seg.code}</div>
      <div class="seg-route">${seg.route}</div>
    `;
    el.appendChild(segDiv);

    addConnector(seg.color);

    const isLast = idx === trip.segments.length - 1;
    addNode(`
      <div class="tl-dot ${isLast ? "end" : ""}"></div>
      <div class="tl-sub">${seg.stop}</div>
    `);

    if (!isLast) {
      addConnector();
      const transitDiv = document.createElement("div");
      transitDiv.className = "tl-transit";
      transitDiv.innerHTML = `🔄 TRANSIT`;
      el.appendChild(transitDiv);
      addConnector();
    }
  });

  // ganti node terakhir jadi tujuan akhir dengan ikon target
  const lastNode = el.querySelectorAll(".tl-node")[el.querySelectorAll(".tl-node").length - 1];
  lastNode.innerHTML = `
    <div class="tl-dot end"></div>
    <div class="tl-label">${toLabel}</div>
    <div class="tl-icon-label" style="margin-top:2px;">🎯</div>
  `;
}

function renderDetail(trip) {
  const el = document.getElementById("detail-list");
  el.innerHTML = "";

  trip.segments.forEach((seg, idx) => {
    const wrap = document.createElement("div");
    wrap.className = "detail-segment";

    const stopsId = `stops-${idx}`;
    wrap.innerHTML = `
      <div class="detail-segment-head" style="color:${seg.color}">${seg.icon} ${seg.code}</div>
      <div class="detail-segment-route">${seg.route}</div>
      <div class="detail-row"><span class="k">Naik</span><span class="v">${seg.boarding}</span></div>
      <div class="detail-row"><span class="k">Turun</span><span class="v">${seg.stop}</span></div>
      <button type="button" class="stops-toggle" data-target="${stopsId}">▼ Lihat halte yang dilewati</button>
      <div class="stops-list" id="${stopsId}">
        ${seg.passedStops.map((s) => `<div class="stop-item">${s}</div>`).join("")}
      </div>
    `;
    el.appendChild(wrap);

    if (idx < trip.segments.length - 1) {
      const transitDiv = document.createElement("div");
      transitDiv.className = "detail-transit";
      transitDiv.innerHTML = `🔄 TRANSIT<span>Pindah kendaraan di ${seg.stop}</span>`;
      el.appendChild(transitDiv);
    }
  });

  el.querySelectorAll(".stops-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = document.getElementById(btn.dataset.target);
      const open = target.classList.toggle("open");
      btn.textContent = open ? "▲ Sembunyikan halte" : "▼ Lihat halte yang dilewati";
    });
  });
}

function renderDuration(trip) {
  const el = document.getElementById("duration-list");
  el.innerHTML = "";

  const addRow = (icon, label, min, max) => {
    const row = document.createElement("div");
    row.className = "duration-item";
    row.innerHTML = `
      <span class="dl">${icon} ${label}</span>
      <span class="dv">${min}–${max} menit</span>
    `;
    el.appendChild(row);
  };

  addRow("🚶", "Jalan ke halte", trip.walkToStart.min, trip.walkToStart.max);

  trip.segments.forEach((seg, idx) => {
    addRow(seg.icon, seg.code, seg.minMinutes, seg.maxMinutes);
    if (idx < trip.segments.length - 1) {
      addRow("🔄", "Transit", trip.transitTime.min, trip.transitTime.max);
    }
  });

  addRow("🚶", "Ke tujuan", trip.walkToEnd.min, trip.walkToEnd.max);

  document.getElementById("duration-total").innerHTML = `
    <span>TOTAL</span>
    <span>± ${trip.duration}</span>
  `;
}

/* =========================================================
   Peta Semua Rute + Pencarian Landmark
   ========================================================= */

function renderCorridorList() {
  const el = document.getElementById("corridor-list");
  el.innerHTML = "";

  corridors.forEach((c) => {
    const details = document.createElement("details");
    details.className = "corridor-item";

    const summary = document.createElement("summary");
    summary.style.background = CORRIDOR_COLORS[c.code];
    summary.innerHTML = `
      <span>${CORRIDOR_ICONS[c.code]} ${c.code}</span>
      <span class="cd-name">${c.name}</span>
      <span class="cd-caret">▾</span>
    `;
    details.appendChild(summary);

    const stopsDiv = document.createElement("div");
    stopsDiv.className = "corridor-stops";
    stopsDiv.innerHTML = c.stops.map((s) => `<div class="cs-item">${s}</div>`).join("");
    details.appendChild(stopsDiv);

    el.appendChild(details);
  });
}

function searchLandmark(query) {
  const q = query.trim().toLowerCase();
  const resultEl = document.getElementById("landmark-result");
  resultEl.innerHTML = "";
  if (!q) return;

  const matches = [];
  const seenStops = new Set();

  // 1) cocokkan dulu ke daftar landmark populer
  landmarkHints.forEach((h) => {
    if (h.keywords.some((k) => k.includes(q) || q.includes(k))) {
      if (!seenStops.has(h.stop)) {
        seenStops.add(h.stop);
        matches.push({ stop: h.stop, note: h.note });
      }
    }
  });

  // 2) lalu cocokkan langsung ke nama halte pada semua koridor
  const allStops = [...new Set(corridors.flatMap((c) => c.stops))];
  allStops.forEach((stop) => {
    if (stop.toLowerCase().includes(q) && !seenStops.has(stop)) {
      seenStops.add(stop);
      matches.push({ stop, note: null });
    }
  });

  if (matches.length === 0) {
    resultEl.innerHTML = `<div class="landmark-empty">Tidak ditemukan. Coba lihat daftar rute di bawah untuk cari halte terdekat.</div>`;
    return;
  }

  matches.slice(0, 6).forEach((m) => {
    const servingCorridors = corridorsContaining(m.stop);
    servingCorridors.forEach((c) => {
      const div = document.createElement("div");
      div.className = "landmark-match";
      div.innerHTML = `
        <span class="lm-badge" style="background:${CORRIDOR_COLORS[c.code]}">${c.code}</span>
        <span class="lm-text">
          Naik di halte <span class="lm-stop">${m.stop}</span> (${c.name})
          ${m.note ? `<span class="lm-note">${m.note}</span>` : ""}
        </span>
      `;
      resultEl.appendChild(div);
    });
  });
}

document.getElementById("map-toggle").addEventListener("click", () => {
  const panel = document.getElementById("map-panel");
  const arrow = document.getElementById("map-toggle-arrow");
  const willOpen = panel.hidden;
  panel.hidden = !willOpen;
  arrow.classList.toggle("open", willOpen);
  if (willOpen && !panel.dataset.rendered) {
    renderCorridorList();
    panel.dataset.rendered = "1";
  }
});

document.getElementById("landmark-search").addEventListener("input", (e) => {
  searchLandmark(e.target.value);
});
