/* ---------- 0. Konfigurasi database (Firebase Firestore) ---------- */
const FIREBASE_CONFIG = {
  apiKey: "ISI_API_KEY",
  authDomain: "ISI_PROJECT_ID.firebaseapp.com",
  projectId: "ISI_PROJECT_ID",
  storageBucket: "ISI_PROJECT_ID.appspot.com",
  messagingSenderId: "ISI_SENDER_ID",
  appId: "ISI_APP_ID"
};

const CLOUD =
  typeof firebase !== "undefined" &&
  !String(FIREBASE_CONFIG.projectId).startsWith("ISI_");

/* ---------- 1. Data awal ---------- */
const ORGS = [
  {
    n: "OSIS",
    d: "Organisasi Siswa Intra Sekolah, wadah aspirasi dan kepemimpinan siswa.",
    j: "Senin, 14.00",
    p: "Bu Rina"
  },
  {
    n: "MPK",
    d: "Majelis Perwakilan Kelas, pengawas dan penyalur aspirasi kelas.",
    j: "Selasa, 14.00",
    p: "Pak Hadi"
  },
  {
    n: "Ambalan",
    d: "Gugus depan Pramuka: kepanduan, tali-temali, dan perkemahan.",
    j: "Jumat, 15.00",
    p: "Pak Joko"
  },
  {
    n: "PMR",
    d: "Palang Merah Remaja: pertolongan pertama dan kegiatan kemanusiaan.",
    j: "Rabu, 14.30",
    p: "Bu Sari"
  },
  {
    n: "Pecinta Alam",
    d: "Pendakian, konservasi, dan pelatihan survival.",
    j: "Sabtu, 07.00",
    p: "Pak Dedi"
  },
  {
    n: "Futsal",
    d: "Latihan futsal dan persiapan turnamen antar sekolah.",
    j: "Selasa, 15.30",
    p: "Pak Agus"
  },
  {
    n: "Voli",
    d: "Latihan bola voli putra dan putri.",
    j: "Kamis, 15.30",
    p: "Bu Wati"
  },
  {
    n: "Basket",
    d: "Latihan basket dan pembinaan tim sekolah.",
    j: "Rabu, 15.30",
    p: "Pak Anto"
  },
  {
    n: "Hadroh",
    d: "Seni musik rebana dan shalawat untuk acara keagamaan.",
    j: "Jumat, 14.00",
    p: "Ust. Fauzi"
  },
  {
    n: "PIK-R",
    d: "Pusat Informasi dan Konseling Remaja: edukasi kesehatan remaja.",
    j: "Kamis, 14.00",
    p: "Bu Lina"
  }
];

const TYPES = [
  "Ekstrakurikuler",
  "Acara",
  "Ujian",
  "Libur",
  "Pengumuman"
];

const WA_NUMBER = "6285334685691";
let selectedOrg = "";

const SEED_U = [
  {
    u: "admin",
    p: "admin123",
    n: "Administrator",
    r: "admin",
    j: []
  },
  {
    u: "guru",
    p: "guru123",
    n: "Bu Rina (Guru)",
    r: "guru",
    j: []
  },
  {
    u: "siswa",
    p: "siswa123",
    n: "Siswa",
    r: "siswa",
    j: []
  }
];

const SEED_I = [
  {
    id: 1,
    t: "Ujian",
    o: "Umum",
    ti: "Penilaian Akhir Semester Ganjil",
    dt: "2026-12-07",
    ds: "PAS dilaksanakan 7–18 Desember. Kartu ujian diambil di wali kelas.",
    a: "guru"
  },
  {
    id: 2,
    t: "Libur",
    o: "Umum",
    ti: "Libur Semester Ganjil",
    dt: "2026-12-21",
    ds: "Libur 21 Desember 2026 – 2 Januari 2027. Masuk kembali 4 Januari.",
    a: "admin"
  },
  {
    id: 3,
    t: "Acara",
    o: "OSIS",
    ti: "Peringatan Hari Guru Nasional",
    dt: "2026-11-25",
    ds: "Upacara dan penampilan seni untuk guru di lapangan sekolah.",
    a: "admin"
  },
  {
    id: 4,
    t: "Acara",
    o: "Futsal",
    ti: "Turnamen Futsal Antar Kelas",
    dt: "2026-11-20",
    ds: "Pendaftaran tim ke pembina sebelum 15 November.",
    a: "guru"
  },
  {
    id: 5,
    t: "Ekstrakurikuler",
    o: "PMR",
    ti: "Pelatihan Pertolongan Pertama",
    dt: "2026-11-18",
    ds: "Materi RJP dan penanganan luka. Bawa seragam PMR.",
    a: "guru"
  },
  {
    id: 6,
    t: "Pengumuman",
    o: "Umum",
    ti: "Pembayaran Seragam Olahraga",
    dt: "2026-11-14",
    ds: "Batas pembayaran seragam olahraga hingga 14 November di TU.",
    a: "admin"
  },
  {
    id: 7,
    t: "Acara",
    o: "Pecinta Alam",
    ti: "Pendakian Bersama Gunung Wilis",
    dt: "2026-11-28",
    ds: "Berkumpul 04.00 di sekolah. Wajib izin orang tua.",
    a: "guru"
  },
  {
    id: 8,
    t: "Acara",
    o: "Hadroh",
    ti: "Penampilan Maulid Sekolah",
    dt: "2026-11-22",
    ds: "Latihan tambahan Kamis dan Jumat sebelum acara.",
    a: "guru"
  }
];

/* ---------- 2. Penyimpanan localStorage ---------- */
const mem = {};

const ld = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : (mem[key] || fallback);
  } catch (e) {
    return mem[key] || fallback;
  }
};

const sv = (key, value) => {
  mem[key] = value;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}
};

/* ---------- 3. State aplikasi ---------- */
let users = CLOUD ? [] : ld("sk_u", SEED_U);
let items = CLOUD ? [] : ld("sk_i", SEED_I);
let me = ld("sk_me", null);
let view = "home";
let edit = null;

let f = {
  q: "",
  t: "",
  m: "",
  o: ""
};

let theme = ld("sk_theme", null);

/* ---------- Tema ---------- */
function applyTheme() {
  if (theme) {
    document.documentElement.setAttribute("data-theme", theme);
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}

const isDark = () =>
  theme
    ? theme === "dark"
    : window.matchMedia("(prefers-color-scheme: dark)").matches;

const themeLabel = () =>
  isDark() ? "☀️ Mode Terang" : "🌙 Mode Gelap";

function toggleTheme() {
  theme = isDark() ? "light" : "dark";
  sv("sk_theme", theme);
  applyTheme();

  document
    .querySelectorAll(".theme-btn")
    .forEach(b => b.textContent = themeLabel());
}

/* ---------- Database ---------- */
let fsdb = null;

const DB = {
  ready: false,
  error: "",

  saveUser(u) {
    users = users.some(x => x.u === u.u)
      ? users.map(x => x.u === u.u ? u : x)
      : [...users, u];

    if (CLOUD) {
      return fsdb
        .collection("users")
        .doc(u.u)
        .set(u)
        .catch(dbFail);
    }

    sv("sk_u", users);
  },

  delUser(name) {
    users = users.filter(x => x.u !== name);

    if (CLOUD) {
      return fsdb
        .collection("users")
        .doc(name)
        .delete()
        .catch(dbFail);
    }

    sv("sk_u", users);
  },

  saveItem(i) {
    items = items.some(x => x.id === i.id)
      ? items.map(x => x.id === i.id ? i : x)
      : [...items, i];

    if (CLOUD) {
      return fsdb
        .collection("items")
        .doc(String(i.id))
        .set(i)
        .catch(dbFail);
    }

    sv("sk_i", items);
  },

  delItem(id) {
    items = items.filter(x => x.id !== id);

    if (CLOUD) {
      return fsdb
        .collection("items")
        .doc(String(id))
        .delete()
        .catch(dbFail);
    }

    sv("sk_i", items);
  }
};

function dbFail(err) {
  console.error(err);

  alert(
    "Gagal menyimpan ke database: " +
    (err.message || err)
  );
}

/* ---------- Firestore ---------- */
function startCloud() {
  firebase.initializeApp(FIREBASE_CONFIG);
  fsdb = firebase.firestore();

  let gotU = false;
  let gotI = false;
  let gotInit = false;

  const check = () => {
    if (!(gotU && gotI && gotInit)) return;

    if (!DB.ready) {
      DB.ready = true;
      render();
    } else {
      refresh();
    }
  };

  const fail = e => {
    console.error(e);

    DB.error =
      e && e.code === "permission-denied"
        ? "Akses database ditolak. Periksa aturan (Rules) Firestore."
        : "Tidak dapat terhubung ke database. Periksa koneksi internet dan konfigurasi Firebase.";

    render();
  };

  fsdb.collection("users").onSnapshot(
    s => {
      users = s.docs.map(d => d.data());
      gotU = true;
      check();
    },
    fail
  );

  fsdb.collection("items").onSnapshot(
    s => {
      items = s.docs.map(d => d.data());
      gotI = true;
      check();
    },
    fail
  );

  fsdb.doc("meta/init").get()
    .then(d => {
      if (d.exists) return;

      const b = fsdb.batch();

      SEED_U.forEach(u => {
        b.set(
          fsdb.collection("users").doc(u.u),
          u
        );
      });

      SEED_I.forEach(i => {
        b.set(
          fsdb.collection("items").doc(String(i.id)),
          i
        );
      });

      b.set(fsdb.doc("meta/init"), {
        at: Date.now()
      });

      return b.commit();
    })
    .then(() => {
      gotInit = true;
      check();
    })
    .catch(fail);

  setTimeout(() => {
    if (!DB.ready && !DB.error) {
      DB.error =
        "Koneksi lambat. Periksa internet Anda, lalu muat ulang halaman.";
      render();
    }
  }, 12000);
}

/* ---------- Refresh ---------- */
function refresh() {
  if (!DB.ready) return;

  if (me && !users.some(u => u.u === me.u)) {
    logout();
    return;
  }

  if (!me) return;

  if (view === "home" || view === "eks") {
    ({ home, eks })[view]();
  } else if (view === "keg") {
    showList();
  } else if (view === "kel") {
    kelTable();
  } else if (view === "usr") {
    usrTable();
  }
}

/* ---------- 4. Fungsi bantu ---------- */
const E = s =>
  String(s ?? "").replace(
    /[&<>"']/g,
    c => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[c])
  );

const tgl = t =>
  t.toLowerCase().replace(/[^a-z]/g, "");

const fd = d =>
  new Date(d + "T00:00:00").toLocaleDateString(
    "id-ID",
    {
      day: "numeric",
      month: "long",
      year: "numeric"
    }
  );

const $ = s => document.querySelector(s);

const today = () =>
  new Date().toISOString().slice(0, 10);

const sorted = () =>
  [...items].sort(
    (a, b) => a.dt.localeCompare(b.dt)
  );

const isStaff = () =>
  me && (
    me.r === "admin" ||
    me.r === "guru"
  );

const canEdit = i =>
  me && (
    me.r === "admin" ||
    (
      me.r === "guru" &&
      i.a === me.u
    )
  );

const tsb = () =>
  document.body.classList.toggle("open");

/* ---------- 5. Kerangka halaman ---------- */
function render() {
  document.body.classList.remove("open");

  if (!DB.ready) {
    return loadingView();
  }

  if (me && !users.some(u => u.u === me.u)) {
    me = null;
    sv("sk_me", null);
  }

  if (!me) {
    return loginView();
  }

  const tabs = [
    ["home", "🏠", "Beranda"],
    ["keg", "📅", "Kegiatan"],
    ["eks", "🏅", "Ekstrakurikuler"]
  ];

  if (isStaff()) {
    tabs.push([
      "kel",
      "✏️",
      "Kelola Informasi"
    ]);
  }

  if (me.r === "admin") {
    tabs.push([
      "usr",
      "👥",
      "Pengguna"
    ]);
  }

  const cur = tabs.find(t => t[0] === view);

  $("#app").innerHTML = `
    <aside class="sb">
      <div class="brand">🏫 Smkn 2 Trenggalek</div>

      <div class="me">
        ${E(me.n)}
        <br>
        <span class="tag">${me.r}</span>
      </div>

      ${tabs.map(t => `
        <button
          class="menu-i ${view === t[0] ? "on" : ""}"
          onclick="go('${t[0]}')">
          <span>${t[1]}</span>
          ${t[2]}
        </button>
      `).join("")}

      <button
        class="theme-btn"
        onclick="toggleTheme()">
        ${themeLabel()}
      </button>

      <button
        class="out"
        onclick="logout()">
        Keluar
      </button>
    </aside>

    <div class="ov" onclick="tsb()"></div>

    <div class="content">
      <div class="top">
        <button onclick="tsb()" aria-label="Menu">☰</button>
        <b>
          ${
            cur
              ? cur[2]
              : (
                view === "syarat"
                  ? "Persyaratan Gabung"
                  : ""
              )
          }
        </b>
      </div>

      <div class="backbar ${view === "home" ? "hidden" : ""}">
        <button
          class="back-home"
          onclick="go('home')">
          ← Kembali ke Beranda
        </button>
      </div>

      <main id="m"></main>
    </div>
  `;

  ({
    home,
    keg,
    eks,
    kel,
    usr,
    syarat
  })[view]();
}

function go(v) {
  view = v;
  edit = null;
  render();
  window.scrollTo(0, 0);
}

/* ---------- 6. Login ---------- */
function loadingView() {
  $("#app").innerHTML = `
    <div class="login">
      <div class="box" style="text-align:center">
        <h1>🏫 Info Kegiatan Sekolah</h1>

        <p class="mu">
          ${
            DB.error
              ? E(DB.error)
              : "Memuat data…"
          }
        </p>

        ${
          DB.error
            ? `
              <button
                class="btn"
                onclick="location.reload()">
                Muat ulang
              </button>
            `
            : ""
        }
      </div>
    </div>
  `;
}

function loginView() {
  $("#app").innerHTML = `
    <div class="login">
      <button
        class="theme-btn theme-fab"
        onclick="toggleTheme()">
        ${themeLabel()}
      </button>

      <div class="box">
        <h1>🏫 Login to school information</h1>

        <p class="mu">
          Masuk untuk melihat informasi sekolah.
        </p>

        <label>Username</label>
        <input
          id="lu"
          autocomplete="username">

        <label>Kata sandi</label>
        <input
          id="lp"
          type="password"
          autocomplete="current-password"
          onkeydown="if(event.key==='Enter')login()">

        <p
          id="le"
          style="
            color:var(--dg);
            min-height:1.2em;
            font-size:.85rem
          ">
        </p>

        <button
          class="btn"
          style="width:100%"
          onclick="login()">
          Masuk
        </button>
      </div>
    </div>
  `;
}

function login() {
  const u = users.find(
    x =>
      x.u === $("#lu").value.trim() &&
      x.p === $("#lp").value
  );

  if (!u) {
    $("#le").textContent =
      "Username atau kata sandi salah.";
    return;
  }

  me = {
    u: u.u,
    n: u.n,
    r: u.r
  };

  sv("sk_me", me);
  view = "home";
  render();
}

function logout() {
  me = null;
  sv("sk_me", null);
  render();
}

/* ---------- 7. Komponen kartu ---------- */
const tag = i => `
  <span class="tag ${tgl(i.t)}">${E(i.t)}</span>
  <span class="tag">${E(i.o)}</span>
`;

const itemCard = i => `
  <div class="card k-${tgl(i.t)}">
    ${tag(i)}

    <h3>${E(i.ti)}</h3>

    <p>📅 ${fd(i.dt)}</p>
    <p>${E(i.ds)}</p>
  </div>
`;

/* ---------- 8. Beranda ---------- */
function home() {
  const upcoming =
    sorted()
      .filter(
        i =>
          i.dt >= today() &&
          i.t !== "Pengumuman"
      )
      .slice(0, 6);

  const announcements =
    items
      .filter(i => i.t === "Pengumuman")
      .slice(-3)
      .reverse();

  $("#m").innerHTML = `
    <div class="grid sec">
      <div class="card stat">
        <b>${items.length}</b>
        Informasi
      </div>

      <div class="card stat">
        <b>${ORGS.length}</b>
        Ekstrakurikuler
      </div>

      <div class="card stat">
        <b>
          ${
            items.filter(
              i => i.t === "Ujian"
            ).length
          }
        </b>
        Jadwal ujian
      </div>

      <div class="card stat">
        <b>${users.length}</b>
        Pengguna
      </div>
    </div>

    <div class="sec">
      <h2>📢 Pengumuman terbaru</h2>

      <div class="grid">
        ${
          announcements.map(itemCard).join("")
          ||
          '<div class="empty">Belum ada pengumuman.</div>'
        }
      </div>
    </div>

    <div class="sec">
      <h2>🗓️ Kegiatan mendatang</h2>

      <div class="grid">
        ${
          upcoming.map(itemCard).join("")
          ||
          '<div class="empty">Tidak ada kegiatan mendatang.</div>'
        }
      </div>
    </div>
  `;
}

/* ---------- 9. Kegiatan ---------- */
const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember"
];

const monthOf = d => d.slice(5, 7);

function keg() {
  const typeOptions =
    TYPES.map(
      t =>
        `<option ${
          f.t === t ? "selected" : ""
        }>${t}</option>`
    ).join("");

  const monthOptions =
    MONTHS.map((name, x) => {
      const v = String(x + 1).padStart(2, "0");

      return `
        <option
          value="${v}"
          ${f.m === v ? "selected" : ""}>
          ${name}
        </option>
      `;
    }).join("");

  const orgChip =
    f.o
      ? `
        <div
          class="row"
          style="margin-bottom:12px">

          <span class="tag">
            Organisasi: ${E(f.o)}
          </span>

          <button
            class="btn o s"
            onclick="f.o='';keg()">
            Hapus filter
          </button>
        </div>
      `
      : "";

  $("#m").innerHTML = `
    <h2>Semua kegiatan</h2>

    <div class="bar">
      <input
        placeholder="Cari…"
        value="${E(f.q)}"
        oninput="f.q=this.value;showList()">

      <select onchange="f.t=this.value;showList()">
        <option value="">Semua jenis</option>
        ${typeOptions}
      </select>

      <select onchange="f.m=this.value;showList()">
        <option value="">Semua bulan</option>
        ${monthOptions}
      </select>
    </div>

    ${orgChip}

    <div class="grid" id="l"></div>
  `;

  showList();
}

function showList() {
  const q = f.q.toLowerCase();

  const result =
    sorted().filter(
      i =>
        (!f.t || i.t === f.t) &&
        (!f.m || monthOf(i.dt) === f.m) &&
        (!f.o || i.o === f.o) &&
        (
          i.ti +
          " " +
          i.ds +
          " " +
          i.o
        )
          .toLowerCase()
          .includes(q)
    );

  $("#l").innerHTML =
    result.map(itemCard).join("")
    ||
    `
      <div
        class="empty"
        style="grid-column:1/-1">
        Tidak ada data yang cocok.
      </div>
    `;
}

/* ---------- 10. Ekstrakurikuler ---------- */
function eks() {
  const cards =
    ORGS.map((o, x) => {
      const count =
        items.filter(i => i.o === o.n).length;

      const waBtn =
        me.r === "siswa"
          ? `
            <button
              class="btn wa s"
              onclick="joinWhatsApp('${o.n}')">
              Gabung via WhatsApp
            </button>
          `
          : "";

      return `
        <div class="card org c${x % 6}">
          <h3>${E(o.n)}</h3>

          <p>${E(o.d)}</p>

          <p>
            🕒 ${E(o.j)}
            <br>
            👤 Pembina: ${E(o.p)}
            <br>
            📌 ${count} informasi
          </p>

          <div class="row">
            <button
              class="btn o s"
              onclick="
                f={
                  q:'',
                  t:'',
                  m:'',
                  o:'${o.n}'
                };
                go('keg')
              ">
              Lihat info
            </button>

            <button
              class="btn info-syarat s"
              onclick="showSyarat('${o.n}')">
              Info Syarat
            </button>

            ${waBtn}
          </div>
        </div>
      `;
    }).join("");

  $("#m").innerHTML = `
    <h2>Ekstrakurikuler & organisasi</h2>

    <div class="grid">
      ${cards}
    </div>
  `;
}

/* ---------- WhatsApp ---------- */
function joinWhatsApp(name) {
  if (!me || me.r !== "siswa") {
    alert(
      "Hanya siswa yang sudah login yang dapat bergabung melalui WhatsApp."
    );
    return;
  }

  let phone =
    String(WA_NUMBER).replace(/\D/g, "");

  if (phone.startsWith("0")) {
    phone = "62" + phone.slice(1);
  }

  if (!phone || phone.length < 10) {
    alert(
      "Nomor WhatsApp belum benar. Periksa WA_NUMBER di script.js."
    );
    return;
  }

  const message =
    `Halo, saya ingin bergabung dengan ekstrakurikuler ${name}. Mohon informasi pendaftarannya.`;

  const url =
    `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;

  window.open(
    url,
    "_blank",
    "noopener,noreferrer"
  );
}

/* ---------- Persyaratan ---------- */
function showSyarat(name) {
  selectedOrg = name;
  view = "syarat";
  edit = null;
  render();
  window.scrollTo(0, 0);
}

function syarat() {
  const name =
    selectedOrg || "Ekstrakurikuler";

  const o =
    ORGS.find(x => x.n === name);

  $("#m").innerHTML = `
    <div class="card requirement-page">
      <div class="requirement-head">
        <span class="tag ekstrakurikuler">
          Persyaratan
        </span>

        <h2>
          Syarat Gabung ${E(name)}
        </h2>

        <p class="mu">
          ${
            o
              ? E(o.d)
              : "Silakan pilih ekstrakurikuler yang ingin diikuti."
          }
        </p>
      </div>

      <div class="requirements">
        <div class="requirement-item">
          1. Siswa aktif SMKN 2 Trenggalek.
        </div>

        <div class="requirement-item">
          2. Mengisi pendaftaran sesuai ekstrakurikuler yang dipilih.
        </div>

        <div class="requirement-item">
          3. Mendapatkan izin dari orang tua/wali.
        </div>

        <div class="requirement-item">
          4. Bersedia mengikuti jadwal dan kegiatan ekstrakurikuler.
        </div>

        <div class="requirement-item">
          5. Mematuhi tata tertib serta arahan pembina.
        </div>
      </div>

      <div class="row">
        ${
          me && me.r === "siswa"
            ? `
              <button
                class="btn"
                onclick="joinWhatsApp('${E(name)}')">
                Gabung via WhatsApp
              </button>
            `
            : ""
        }

        <button
          class="btn o"
          onclick="go('eks')">
          ← Kembali ke Ekstrakurikuler
        </button>
      </div>
    </div>
  `;
}

/* ---------- 11. Kelola Informasi ---------- */
function kel() {
  const e =
    (edit && items.find(i => i.id === edit)) || {
      t: "Pengumuman",
      o: "Umum",
      ti: "",
      dt: today(),
      ds: ""
    };

  const typeOptions =
    TYPES.map(
      t =>
        `<option ${
          e.t === t ? "selected" : ""
        }>${t}</option>`
    ).join("");

  const orgOptions =
    ORGS.map(
      o =>
        `<option ${
          e.o === o.n ? "selected" : ""
        }>${o.n}</option>`
    ).join("");

  $("#m").innerHTML = `
    <h2>${edit ? "Ubah" : "Tambah"} informasi</h2>

    <div class="card sec ${edit ? "editing" : ""}">
      <div class="grid">
        <div>
          <label>Jenis</label>
          <select id="ft">
            ${typeOptions}
          </select>
        </div>

        <div>
          <label>Organisasi</label>
          <select id="fo">
            <option ${
              e.o === "Umum" ? "selected" : ""
            }>
              Umum
            </option>
            ${orgOptions}
          </select>
        </div>

        <div>
          <label>Tanggal</label>
          <input
            type="date"
            id="fd"
            value="${e.dt}">
        </div>
      </div>

      <label>Judul</label>
      <input id="fi" value="${E(e.ti)}">

      <label>Keterangan</label>
      <textarea
        id="fs"
        rows="3">${E(e.ds)}</textarea>

      <div
        class="row"
        style="margin-top:12px">

        <button
          class="btn"
          onclick="saveI()">
          Simpan
        </button>

        ${
          edit
            ? `
              <button
                class="btn o"
                onclick="go('kel')">
                Batal
              </button>
            `
            : ""
        }
      </div>
    </div>

    <h2>
      ${
        me.r === "admin"
          ? "Semua informasi"
          : "Informasi buatan Anda"
      }
    </h2>

    <div
      class="card tw"
      id="tb">
    </div>
  `;

  kelTable();
}

function kelTable() {
  const tableRows =
    sorted()
      .filter(canEdit)
      .map(
        i => `
          <tr>
            <td>
              ${E(i.ti)}
              <br>
              <span class="mu">${E(i.o)}</span>
            </td>

            <td>${E(i.t)}</td>
            <td>${fd(i.dt)}</td>

            <td>
              <button
                class="btn o s"
                onclick="editI(${i.id})">
                Ubah
              </button>

              <button
                class="btn d s"
                onclick="delI(${i.id})">
                Hapus
              </button>
            </td>
          </tr>
        `
      )
      .join("")
    ||
    `
      <tr>
        <td
          colspan="4"
          class="empty">
          Belum ada data.
        </td>
      </tr>
    `;

  $("#tb").innerHTML = `
    <table>
      <tr>
        <th>Judul</th>
        <th>Jenis</th>
        <th>Tanggal</th>
        <th></th>
      </tr>

      ${tableRows}
    </table>
  `;
}

function editI(id) {
  edit = id;
  kel();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function saveI() {
  const ti = $("#fi").value.trim();

  if (!ti) {
    alert("Judul wajib diisi.");
    return;
  }

  const data = {
    t: $("#ft").value,
    o: $("#fo").value,
    ti,
    dt: $("#fd").value || today(),
    ds: $("#fs").value.trim()
  };

  if (edit) {
    const old =
      items.find(i => i.id === edit);

    DB.saveItem({
      ...old,
      ...data
    });
  } else {
    DB.saveItem({
      id: Date.now(),
      ...data,
      a: me.u
    });
  }

  edit = null;
  kel();
}

function delI(id) {
  if (confirm("Hapus informasi ini?")) {
    DB.delItem(id);
    kelTable();
  }
}

/* ---------- 12. Pengguna ---------- */
function usr() {
  $("#m").innerHTML = `
    <h2>Tambah pengguna</h2>

    <div class="card sec">
      <div class="grid">
        <div>
          <label>Nama</label>
          <input id="un">
        </div>

        <div>
          <label>Username</label>
          <input id="uu">
        </div>

        <div>
          <label>Kata sandi</label>
          <input
            id="up"
            type="password">
        </div>

        <div>
          <label>Peran</label>
          <select id="ur">
            <option value="siswa">Siswa</option>
            <option value="guru">Guru</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <div
        class="row"
        style="margin-top:12px">

        <button
          class="btn"
          onclick="addU()">
          Tambah
        </button>
      </div>
    </div>

    <h2>Daftar pengguna</h2>

    <div
      class="card tw"
      id="tb">
    </div>
  `;

  usrTable();
}

function usrTable() {
  const tableRows =
    users
      .map(
        u => `
          <tr>
            <td>${E(u.n)}</td>
            <td>${E(u.u)}</td>

            <td>
              <span class="tag">${E(u.r)}</span>
            </td>

            <td>
              ${
                u.u === me.u
                  ? ""
                  : `
                    <button
                      class="btn d s"
                      onclick="delU('${E(u.u)}')">
                      Hapus
                    </button>
                  `
              }
            </td>
          </tr>
        `
      )
      .join("");

  $("#tb").innerHTML = `
    <table>
      <tr>
        <th>Nama</th>
        <th>Username</th>
        <th>Peran</th>
        <th></th>
      </tr>

      ${tableRows}
    </table>
  `;
}

function addU() {
  const n = $("#un").value.trim();
  const u = $("#uu").value.trim();
  const p = $("#up").value;

  if (!n || !u || !p) {
    alert("Semua kolom wajib diisi.");
    return;
  }

  if (
    !/^[A-Za-z0-9_.-]{2,30}$/.test(u) ||
    u.startsWith("__") ||
    u === "." ||
    u === ".."
  ) {
    alert(
      "Username hanya boleh huruf, angka, titik, strip, dan garis bawah (2-30 karakter)."
    );
    return;
  }

  if (users.some(x => x.u === u)) {
    alert("Username sudah dipakai.");
    return;
  }

  DB.saveUser({
    u,
    p,
    n,
    r: $("#ur").value,
    j: []
  });

  usr();
}

function delU(username) {
  if (confirm("Hapus pengguna ini?")) {
    DB.delUser(username);
    usrTable();
  }
}

/* ---------- Jalankan aplikasi ---------- */
applyTheme();

if (CLOUD) {
  startCloud();
  render();
} else {
  DB.ready = true;
  render();
}
