
const WHATSAPP_NUMBER = ""; // Isi dengan nomor WA, contoh: "6281234567890"

const money = (value) => {
  if (!value) return "-";
  return "Rp " + value;
};

const parseRupiah = (value) => {
  if (!value) return 0;
  return Number(String(value).replace(/\./g, "").replace(/,/g, ".")) || 0;
};

const formatRupiah = (n) => {
  return "Rp " + Math.round(n).toLocaleString("id-ID");
};

const slug = (s) => s.toLowerCase()
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const iconFor = (category) => {
  const map = {
    "HANDPHONE":"handphone","ELEKTRONIK":"elektronik","FURNITURE":"furniture",
    "BAHAN BANGUNAN":"bahan-bangunan","ALAT RUMAH TANGGA":"alat-rumah-tangga",
    "PERMADANI":"permadani","BAHAN POKOK":"bahan-pokok","TEH,KOPI,SUSU":"teh-kopi-susu",
    "BUMBU BUMBU":"bumbu-bumbu","MINUMAN SEGAR":"minuman-segar","LAUK PAUK":"lauk-pauk",
    "MIE INSTAN":"mie-instan","BUAH BUAHAN":"buah-buahan","KUE KALENG":"kue-kaleng",
    "EMPING":"emping","ANEKA KUE":"aneka-kue","KACANG KACANGAN":"kacang-kacangan",
    "KUE BLEKAN":"kue-blekan","MAKANAN RINGAN":"makanan-ringan","DETERGEN":"detergen",
    "ROKOK":"rokok","EMAS":"emas"
  };
  return "assets/" + (map[category] || "elektronik") + ".svg";
};

const state = {search:"", category:"", price:"both"};

const grid = document.getElementById("productGrid");
const count = document.getElementById("resultCount");
const empty = document.getElementById("emptyState");

function renderProducts() {
  const q = state.search.trim().toLowerCase();
  const filtered = window.PRODUCTS.filter(p => {
    const text = `${p.name} ${p.detail} ${p.category}`.toLowerCase();
    return (!q || text.includes(q)) && (!state.category || p.category === state.category);
  });

  count.textContent = `${filtered.length.toLocaleString("id-ID")} barang ditampilkan dari ${window.PRODUCTS.length.toLocaleString("id-ID")} barang.`;

  grid.innerHTML = filtered.map(p => {
    const daily = parseRupiah(p.daily);
    const monthly = daily ? formatRupiah(daily * 30) : "-";
    const showDaily = state.price !== "weekly";
    const showWeekly = state.price !== "daily";
    return `
      <article class="product-card">
        <div class="product-image">
          <img src="${iconFor(p.category)}" alt="Ilustrasi ${escapeHtml(p.category)}">
        </div>
        <div class="product-body">
          <div class="cat">${escapeHtml(p.category)}</div>
          <div class="product-name">${escapeHtml(p.name)}</div>
          <div class="detail">${escapeHtml(p.detail || "—")}</div>
          <div class="prices">
            ${showDaily ? `<div class="price"><small>HARGA 300 HARI</small><b>${money(p.daily)}</b></div>` : ""}
            ${showWeekly ? `<div class="price"><small>HARGA MINGGUAN</small><b>${money(p.weekly)}</b></div>` : ""}
          </div>
          ${showDaily ? `<div class="monthly">Estimasi 30 hari: <b>${monthly}</b></div>` : ""}
        </div>
      </article>
    `;
  }).join("");

  empty.classList.toggle("hidden", filtered.length !== 0);
  grid.classList.toggle("hidden", filtered.length === 0);
}

function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}

const chips = document.getElementById("categoryChips");
chips.innerHTML = `<button class="chip active" data-cat="">Semua</button>` +
  window.CATEGORIES.map(c => `<button class="chip" data-cat="${escapeHtml(c)}">${escapeHtml(c)}</button>`).join("");

chips.addEventListener("click", e => {
  const btn = e.target.closest("[data-cat]");
  if (!btn) return;
  state.category = btn.dataset.cat;
  document.getElementById("categorySelect").value = state.category;
  document.querySelectorAll(".chip").forEach(x => x.classList.toggle("active", x === btn));
  renderProducts();
});

document.getElementById("searchInput").addEventListener("input", e => {
  state.search = e.target.value;
  renderProducts();
});

document.getElementById("categorySelect").addEventListener("change", e => {
  state.category = e.target.value;
  document.querySelectorAll(".chip").forEach(x => x.classList.toggle("active", x.dataset.cat === state.category));
  renderProducts();
});

document.getElementById("priceSelect").addEventListener("change", e => {
  state.price = e.target.value;
  renderProducts();
});

// PDF viewer
const modal = document.getElementById("pdfModal");
const frame = document.getElementById("pdfFrame");
const title = document.getElementById("pdfTitle");
const eyebrow = document.getElementById("pdfEyebrow");

function openPdf(type) {
  const isDaily = type === "daily";
  frame.src = isDaily ? "PAKET HARIAN 2027.pdf" : "PAKET MINGGUAN 2027.pdf";
  title.textContent = isDaily ? "Paket 300 Hari 2026–2027" : "Paket Mingguan 2026–2027";
  eyebrow.textContent = isDaily ? "BROSUR HARIAN" : "BROSUR MINGGUAN";
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}
function closePdf() {
  modal.classList.add("hidden");
  frame.src = "";
  document.body.style.overflow = "";
}
document.querySelectorAll("[data-pdf]").forEach(btn => {
  btn.addEventListener("click", () => openPdf(btn.dataset.pdf));
});
document.querySelectorAll("[data-close-modal]").forEach(el => el.addEventListener("click", closePdf));
document.addEventListener("keydown", e => { if (e.key === "Escape") closePdf(); });

// WhatsApp
const wa = document.getElementById("waButton");
if (WHATSAPP_NUMBER) {
  wa.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Halo Paket Monalisa, saya ingin menanyakan katalog barang.")}`;
  wa.target = "_blank";
} else {
  wa.href = "#";
  wa.addEventListener("click", e => {
    e.preventDefault();
    alert("Silakan isi WHATSAPP_NUMBER di file app.js terlebih dahulu.");
  });
}

document.getElementById("year").textContent = new Date().getFullYear();
renderProducts();
