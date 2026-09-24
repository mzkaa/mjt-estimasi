/* =========================================================
   MJT Trip Estimator — data & logic
   Referensi: Peta Transportasi Massal Cekungan Bandung, April 2026
   (versi skematik per-koridor, sisi A & sisi B).

   Setiap koridor MJT sebenarnya jalan satu arah (loop) lewat jalan
   yang kadang berbeda antara arah pergi (sisi A) & arah pulang
   (sisi B) — makanya nama haltenya juga sering beda walau berdekatan.
   Struktur data di bawah menyimpan KEDUA arah per koridor apa adanya
   sesuai peta, supaya semua halte & arahnya kelihatan jelas, dan
   mesin estimasi rute mencari jalur lewat kedua arah tersebut.
   ========================================================= */

const CORRIDOR_COLORS = {
  K1: "#1FA35A",
  K2: "#E63946",
  K3: "#8E44AD",
  K4: "#2E5BFF",
  K5: "#E91E8C",
  K6: "#F2843C",
};

const CORRIDOR_ICONS = {
  K1: "🟢",
  K2: "🔴",
  K3: "🟣",
  K4: "🔵",
  K5: "🩷",
  K6: "🟠",
};

// corridorDefs: satu entri per koridor, berisi DUA arah (A & B) persis
// seperti dua kolom pada peta skematik. "Baltos" & "ITB Ganesha" adalah
// satu-satunya titik yang tidak tercetak persis di peta — didekatkan ke
// posisi realistisnya di koridor K5 dan ditandai di UI.
const corridorDefs = [
  {
    code: "K1",
    corridorName: "Leuwipanjang - Soreang",
    directions: [
      {
        dir: "A",
        label: "Leuwipanjang → Soreang",
        stops: [
          "Terminal Leuwipanjang", "Hotel Grand Pasundan", "Bumi Kopo Kencana",
          "Mall Festival Citylink", "Simpang Pasirkoja", "SPBU Pasir Koja",
          "Hotel Soreang", "Mall Pelayanan Publik", "Plaza Pemkab Bandung",
          "Simpang Desa Soreang", "Pasar Ikan Modern", "RSUD Otto Iskandar Dinata",
          "SAMSAT Soreang", "Geo Dipa Energi", "Pengendapan Bus Soreang",
        ],
      },
      {
        dir: "B",
        label: "Soreang → Leuwipanjang",
        stops: [
          "Pengendapan Bus Soreang", "Hotel Soreang", "Sumbersari Junction",
          "Pasar Induk Caringin", "Leuwipanjang Soekarno Hatta", "Terminal Leuwipanjang",
        ],
      },
    ],
  },
  {
    code: "K2",
    corridorName: "Kota Baru Parahyangan - Alun-alun Bandung",
    directions: [
      {
        dir: "A",
        label: "Kota Baru Parahyangan → Alun-alun Bandung",
        stops: [
          "Kota Baru Parahyangan", "Wahoo Waterworld", "Parahyangan Timur",
          "Parahyangan Timur 2", "Parahyangan Utara", "Tatar Wangsakerta",
          "Bale Pare", "Stasiun Padalarang", "STEI LPPM", "RS Karisma Cimareme",
          "RS IMC", "Masjid Ar-Ridwan", "Padasuka Indah", "Rancabelut",
          "PLN Cisangkan", "BRI Cimahi", "RSUD Cibabat", "Dinas Sosial",
          "Jalan Budi", "SMAN 13", "Paledang", "Rajawali Barat",
          "Plaza Telkom Rajawali", "Rajawali 1", "Dungus Cariang", "SMA Trinitas",
          "RS Kebon Jati", "SMA Pasundan", "Perintis Kemerdekaan", "Lembong",
          "Alun-alun Bandung",
        ],
      },
      {
        dir: "B",
        label: "Alun-alun Bandung → Kota Baru Parahyangan",
        stops: [
          "Alun-alun Bandung", "KEB Hana Bank", "GKI Anugerah", "Mayapada Tower",
          "Toko Ambon", "Kemenag Kanwil Jabar", "Optik Krida", "Sudirman 3",
          "Kebon Kopi", "SMAN 13", "Cilember", "RS Mitra Kasih", "RSUD Cibabat",
          "SMPN 6", "Gedung 4", "Buana", "PLN Cisangkan", "Rancabelut",
          "Padasuka Indah", "Masjid Ar-Ridwan", "RS IMC", "RS Karisma Cimareme",
          "STEI LPPM", "Bale Pare", "Tatar Wangsakerta", "Parahyangan Utara",
          "Parahyangan Selatan", "Kota Baru Parahyangan",
        ],
      },
    ],
  },
  {
    code: "K3",
    corridorName: "Baleendah - BEC",
    directions: [
      {
        dir: "A",
        label: "Baleendah → BEC",
        stops: [
          "Baleendah", "Masjid Al Amanah", "Matahari Land", "Masjid Jami Baitul Huda",
          "Bubur Ayam Haji Amid", "Borma Bojongsoang", "SD Negeri Lengkong",
          "Puskesmas Bojongsoang", "Bluebird", "Pasar Kordon", "JAPNAS",
          "PT Medal Sekarwangi", "Bangunan Mart", "LPKIA", "PT LEN Industri",
          "PLN UP3 Bandung", "Muhammad Toha", "PT INTI", "Sekolah Ganesha",
          "Taman Tegallega", "Sekolah Moh Toha", "ITC Kebon Kelapa",
          "Grand Yogya Kepatihan", "Alun-alun Bandung", "Banceuy", "Stasiun Timur",
          "Stasiun Bandung", "SMAN 6 Bandung", "SDN Pajajaran", "STHB",
          "Bandung Electronic Centre (BEC)",
        ],
      },
      {
        dir: "B",
        label: "BEC/Merdeka → Baleendah",
        stops: [
          "Museum Kota Bandung", "Santa Angela (Merdeka)", "Alun-alun Bandung",
          "Toko Mas ABC", "Simpang Ijan", "Lapang Tegallega", "PT INTI",
          "Madurasa Tengah", "PLN UP3 Bandung", "PT LEN Industri", "LPKIA",
          "Bangunan Mart", "Buah Batu", "Swadharma BNI", "Pasar Kordon",
          "Bluebird", "Puskesmas Kujangsari", "Transmart Buah Batu",
          "Permata Buah Batu", "Podomoro", "AHASS", "Griya Bandung Asri",
          "Alfamart SPBU Bojongsoang", "Masjid Jami Baitul Huda", "Apotek K24",
          "Kejari Bale Bandung", "RS Al Ihsan", "Baleendah",
        ],
      },
    ],
  },
  {
    code: "K4",
    corridorName: "Leuwipanjang - Dago",
    directions: [
      {
        dir: "A",
        label: "Leuwipanjang → Dago (UNPAD Dipatiukur)",
        stops: [
          "Terminal Leuwipanjang", "RS Immanuel", "Taman Tegallega",
          "Pintu Keluar Terminal Tegalega", "RSIA Astana Anyar",
          "Stasiun Bandung Pintu Selatan", "Balaikota", "Bandung Electronic Centre (BEC)",
          "Hotel The-One-O-One", "Taman Radio", "Kartika Sari",
          "RS Santo Borromeus", "Masjid Baiturrahman", "UNPAD Dipatiukur",
        ],
      },
      {
        dir: "B",
        label: "Dago (UNPAD Dipatiukur) → Leuwipanjang",
        stops: [
          "UNPAD Dipatiukur", "RS Santo Borromeus", "Kartika Sari", "Taman Radio",
          "Hotel The-One-O-One", "Bandung Indah Plaza", "Santa Angela (Merdeka)",
          "Bank Indonesia", "Pasar Baru", "Dalem Kaum", "Ibu Inggit Garnasih",
          "Pasar Tegallega", "Simpang Moh Toha", "RS Immanuel", "Terminal Leuwipanjang",
        ],
      },
    ],
  },
  {
    code: "K5",
    corridorName: "Dipatiukur - Jatinangor",
    directions: [
      {
        dir: "A",
        label: "UNPAD Dipatiukur → UNPAD Jatinangor",
        stops: [
          "UNPAD Dipatiukur", "Panatayuda", "ITB Ganesha", "Lapangan Gasibu",
          "PUSDAI", "Lapangan Supratman", "Baltos", "Taman Pramuka",
          "Hotel Grand Tebu", "Bandung Creative Hub", "Hotel Horison", "PT INTI",
          "Simpang By Pass Soetta", "SPBU Moh Toha", "Cileunyi", "IPDN",
          "Jatinangor Town Square", "UNPAD Jatinangor",
        ],
      },
      {
        dir: "B",
        label: "UNPAD Jatinangor → UNPAD Dipatiukur",
        stops: [
          "UNPAD Jatinangor", "IPDN", "Cileunyi", "Tatang Sumantri",
          "Simpang By Pass Soetta", "PT INTI", "Hotel Horison",
          "Bandung Creative Hub", "SPBU Ahmad Yani", "Baltos", "Lapangan Supratman",
          "PUSDAI", "Lapangan Gasibu", "ITB Ganesha", "Panatayuda", "UNPAD Dipatiukur",
        ],
      },
    ],
  },
  {
    code: "K6",
    corridorName: "Leuwipanjang - Majalaya",
    directions: [
      {
        dir: "A",
        label: "Leuwipanjang → Majalaya",
        stops: [
          "Terminal Leuwipanjang", "SDN Babakan Tarogong", "RS Immanuel", "Muara",
          "PT INTI", "Palasari Radio", "Zipur Dayeuhkolot", "Griya Bandung Asri",
          "Pasar Baleendah", "Bumi Siliwangi", "Terminal Ciparay", "Borma Majalaya",
          "Terminal Majalaya",
        ],
      },
      {
        dir: "B",
        label: "Majalaya → Leuwipanjang",
        stops: [
          "Terminal Majalaya", "Terminal Ciparay", "Giri Harja Jelekong",
          "Pasar Baleendah", "Borma Bojongsoang", "Palasari Ceres",
          "TK Kemala Bhayangkari 49", "Biddokes", "Terminal Leuwipanjang",
        ],
      },
    ],
  },
];

// "lines" = satu entri per ARAH per koridor (12 total) — ini yang dipakai
// mesin pencari rute & peta, supaya semua sisi/arah ikut tercakup.
const lines = corridorDefs.flatMap((c) =>
  c.directions.map((d) => ({
    code: c.code,
    corridorName: c.corridorName,
    color: CORRIDOR_COLORS[c.code],
    icon: CORRIDOR_ICONS[c.code],
    dir: d.dir,
    label: d.label,
    stops: d.stops,
  }))
);

// Lokasi yang bisa dipilih user pada form -> SEMUA halte dari data koridor
// di atas (bukan daftar pilihan terbatas), supaya pilihan Dari/Ke lengkap.
// Beberapa nama diberi label yang lebih akrab lewat LABEL_ALIASES di bawah,
// tapi tetap mengacu ke nama halte asli untuk pencarian rute.
const LABEL_ALIASES = {
  "Pengendapan Bus Soreang": "Terminal Soreang (Pengendapan Bus Soreang)",
  "UNPAD Dipatiukur": "Dipatiukur (UNPAD Dipatiukur)",
  "UNPAD Jatinangor": "Jatinangor (UNPAD Jatinangor)",
  "Bandung Electronic Centre (BEC)": "BEC (Bandung Electronic Centre)",
  "PUSDAI": "Pusdai (PUSDAI)",
};

const locations = [...new Set(lines.flatMap((l) => l.stops))]
  .map((stop) => ({ stop, label: LABEL_ALIASES[stop] || stop }))
  .sort((a, b) => a.label.localeCompare(b.label, "id"));

// Petunjuk lokasi/landmark populer yang bukan nama halte persis di peta,
// dipetakan ke halte MJT terdekat. Bantu user yang tidak hafal nama halte.
const landmarkHints = [
  { keywords: ["telkom university", "tel-u", "telu", "telkom u"], stop: "Buah Batu", note: "Telkom University berada di kawasan Buah Batu/Sukapura (dilewati K3 arah BEC → Baleendah)." },
  { keywords: ["itb", "institut teknologi bandung", "ganesha"], stop: "ITB Ganesha", note: "ITB kampus Ganesha, dekat Lapangan Gasibu." },
  { keywords: ["unpad dipatiukur", "unpad bandung", "unikom"], stop: "UNPAD Dipatiukur", note: "Kawasan Dipatiukur/Dago bawah." },
  { keywords: ["unpad jatinangor", "ikopin", "jatinangor"], stop: "UNPAD Jatinangor", note: "Kawasan kampus Jatinangor." },
  { keywords: ["gasibu", "monju", "monumen juang"], stop: "Lapangan Gasibu", note: "Area Lapangan Gasibu/Gedung Sate." },
  { keywords: ["bec", "electronic centre", "electronic center"], stop: "Bandung Electronic Centre (BEC)", note: "BEC di Jl. Purnawarman." },
  { keywords: ["stasiun bandung", "kereta bandung"], stop: "Stasiun Bandung", note: "Stasiun Bandung (Hall besar/kecil)." },
  { keywords: ["stasiun padalarang", "kereta padalarang"], stop: "Stasiun Padalarang", note: "Stasiun Padalarang, arah KCJB/lokal." },
  { keywords: ["balai kota", "balaikota"], stop: "Balaikota", note: "Kawasan Balai Kota Bandung / Taman Sejarah." },
  { keywords: ["alun alun", "alun-alun bandung", "masjid raya bandung"], stop: "Alun-alun Bandung", note: "Alun-alun & Masjid Raya Bandung." },
  { keywords: ["baltos", "bandung trade center", "btc dago"], stop: "Baltos", note: "Bandung Trade Center, Jl. Ir. H. Djuanda (Dago) — posisi perkiraan." },
  { keywords: ["cimahi"], stop: "BRI Cimahi", note: "Kawasan pusat Kota Cimahi." },
  { keywords: ["soreang"], stop: "Hotel Soreang", note: "Pusat Kota Soreang." },
  { keywords: ["majalaya"], stop: "Terminal Majalaya", note: "Pusat Kota Majalaya." },
];

/* =========================================================
   Routing engine (prototype-level, bukan real-time)
   Mencari jalur lewat 12 "lines" (6 koridor x 2 arah), maksimal
   2 kali transit, tanpa memakai dua arah dari koridor yang sama
   berturut-turut (itu bukan transit sungguhan, cuma balik arah).
   ========================================================= */

function linesContaining(stopName) {
  return lines.filter((l) => l.stops.includes(stopName));
}

// Setiap "line" cuma bisa dijalani MAJU (sesuai urutan halte tercetak di
// peta) — nggak boleh naik bus lalu "mundur" ke halte sebelumnya.
// BFS di bawah menjelajah per-halte-maju supaya arah selalu benar, dan
// berhenti begitu ketemu jalur dengan jumlah transit paling sedikit.
function findLinePath(fromStop, toStop) {
  const startLines = linesContaining(fromStop);
  if (startLines.length === 0) return null;

  const queue = startLines.map((l) => ({
    line: l,
    board: fromStop,
    segments: [],
    codes: new Set([l.code]),
  }));

  let guard = 0;
  while (queue.length) {
    if (++guard > 20000) break; // pengaman, seharusnya tidak pernah tercapai
    const { line, board, segments, codes } = queue.shift();
    if (segments.length >= 3) continue; // maksimal 2 transit (3 line)

    const boardIdx = line.stops.indexOf(board);

    // 1) apakah tujuan ada di line ini, di halte setelah boardIdx?
    const toIdx = line.stops.indexOf(toStop);
    if (toIdx > boardIdx) {
      return [...segments, { line, board, alight: toStop }];
    }

    // 2) kalau belum, coba transit di tiap halte berikutnya pada line ini
    for (let i = boardIdx + 1; i < line.stops.length; i++) {
      const s = line.stops[i];
      const others = linesContaining(s).filter((o) => !codes.has(o.code));
      for (const other of others) {
        const newCodes = new Set(codes);
        newCodes.add(other.code);
        queue.push({
          line: other,
          board: s,
          segments: [...segments, { line, board, alight: s }],
          codes: newCodes,
        });
      }
    }
  }

  return null;
}

function hopCount(line, from, to) {
  const i = line.stops.indexOf(from);
  const j = line.stops.indexOf(to);
  return Math.max(1, Math.abs(j - i));
}

function roundTo5(n) {
  return Math.round(n / 5) * 5;
}

function estimateSegmentMinutes(line, from, to) {
  const hops = hopCount(line, from, to);
  const min = Math.max(10, roundTo5(hops * 1.8));
  const max = Math.max(min + 5, roundTo5(hops * 2.8));
  return { min, max };
}

function buildTrip(fromLabel, toLabel, fromStop, toStop) {
  if (fromStop === toStop) return null;

  const rawSegments = findLinePath(fromStop, toStop);
  if (!rawSegments) return null;

  const segments = rawSegments.map((seg) => {
    const est = estimateSegmentMinutes(seg.line, seg.board, seg.alight);
    return {
      code: seg.line.code,
      color: seg.line.color,
      icon: seg.line.icon,
      route: seg.line.label,
      boarding: seg.board,
      stop: seg.alight,
      minMinutes: est.min,
      maxMinutes: est.max,
      passedStops: seg.line.stops.slice(
        Math.min(seg.line.stops.indexOf(seg.board), seg.line.stops.indexOf(seg.alight)),
        Math.max(seg.line.stops.indexOf(seg.board), seg.line.stops.indexOf(seg.alight)) + 1
      ).sort((a, b) => {
        const boardIsFirst = seg.line.stops.indexOf(seg.board) <= seg.line.stops.indexOf(seg.alight);
        return boardIsFirst
          ? seg.line.stops.indexOf(a) - seg.line.stops.indexOf(b)
          : seg.line.stops.indexOf(b) - seg.line.stops.indexOf(a);
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
   Rendering — form & hasil estimasi
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
fromSelect.value = "Baleendah";
toSelect.value = locations.find((l) => l.stop === "UNPAD Jatinangor").label;

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
   Peta Semua Rute (kedua arah, semua halte) + Pencarian Landmark
   ========================================================= */

function renderCorridorList() {
  const el = document.getElementById("corridor-list");
  el.innerHTML = "";

  corridorDefs.forEach((c) => {
    const details = document.createElement("details");
    details.className = "corridor-item";

    const summary = document.createElement("summary");
    summary.style.background = CORRIDOR_COLORS[c.code];
    summary.innerHTML = `
      <span>${CORRIDOR_ICONS[c.code]} ${c.code}</span>
      <span class="cd-name">${c.corridorName}</span>
      <span class="cd-caret">▾</span>
    `;
    details.appendChild(summary);

    const stopsDiv = document.createElement("div");
    stopsDiv.className = "corridor-stops";
    c.directions.forEach((d) => {
      stopsDiv.innerHTML += `<div class="cs-dir-label">↳ Arah ${d.label}</div>`;
      stopsDiv.innerHTML += d.stops.map((s) => `<div class="cs-item">${s}</div>`).join("");
    });
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

  // 2) lalu cocokkan langsung ke semua nama halte pada semua koridor & arah
  const allStops = [...new Set(lines.flatMap((l) => l.stops))];
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
    const servingLines = linesContaining(m.stop);
    servingLines.forEach((l) => {
      const div = document.createElement("div");
      div.className = "landmark-match";
      div.innerHTML = `
        <span class="lm-badge" style="background:${l.color}">${l.code}</span>
        <span class="lm-text">
          Naik di halte <span class="lm-stop">${m.stop}</span> — arah ${l.label}
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
