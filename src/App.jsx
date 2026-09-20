import { useEffect, useMemo, useState } from 'react';
import { CATEGORIES, PRODUCTS } from './data/products';

const WHATSAPP_NUMBER = '';

const money = (value) => {
  if (!value) return '-';
  return `Rp ${value}`;
};

const parseRupiah = (value) => {
  if (!value) return 0;
  return Number(String(value).replace(/\./g, '').replace(/,/g, '.')) || 0;
};

const formatRupiah = (n) => `Rp ${Math.round(n).toLocaleString('id-ID')}`;

const iconFor = (category) => {
  const map = {
    'HANDPHONE': 'handphone',
    'ELEKTRONIK': 'elektronik',
    'FURNITURE': 'furniture',
    'BAHAN BANGUNAN': 'bahan-bangunan',
    'ALAT RUMAH TANGGA': 'alat-rumah-tangga',
    'PERMADANI': 'permadani',
    'BAHAN POKOK': 'bahan-pokok',
    'TEH,KOPI,SUSU': 'teh-kopi-susu',
    'BUMBU BUMBU': 'bumbu-bumbu',
    'MINUMAN SEGAR': 'minuman-segar',
    'LAUK PAUK': 'lauk-pauk',
    'MIE INSTAN': 'mie-instan',
    'BUAH BUAHAN': 'buah-buahan',
    'KUE KALENG': 'kue-kaleng',
    'EMPING': 'emping',
    'ANEKA KUE': 'aneka-kue',
    'KACANG KACANGAN': 'kacang-kacangan',
    'KUE BLEKAN': 'kue-blekan',
    'MAKANAN RINGAN': 'makanan-ringan',
    'DETERGEN': 'detergen',
    'ROKOK': 'rokok',
    'EMAS': 'emas',
  };

  const assetName = map[category] || 'elektronik';
  return new URL(`../assets/${assetName}.svg`, import.meta.url).href;
};

const pdfFor = (type) =>
  type === 'daily' ? '/PAKET%20HARIAN%202027.pdf' : '/PAKET%20MINGGUAN%202027.pdf';

const categoryPalette = {
  HANDPHONE: { background: 'linear-gradient(135deg, #fff8f2 0%, #fceae0 100%)', accent: '#d9281c' },
  ELEKTRONIK: { background: 'linear-gradient(135deg, #edf8ff 0%, #dfeeff 100%)', accent: '#2a6bcf' },
  FURNITURE: { background: 'linear-gradient(135deg, #fff3ea 0%, #f7e8d1 100%)', accent: '#b86a2f' },
  'ALAT RUMAH TANGGA': { background: 'linear-gradient(135deg, #f4fff2 0%, #e2f7d9 100%)', accent: '#38854d' },
  'BAHAN POKOK': { background: 'linear-gradient(135deg, #fff8eb 0%, #f9e7bf 100%)', accent: '#d29723' },
  'BAHAN BANGUNAN': { background: 'linear-gradient(135deg, #f6f4ff 0%, #e7e3ff 100%)', accent: '#5d49c9' },
  'BUMBU BUMBU': { background: 'linear-gradient(135deg, #fff2f1 0%, #ffd7d1 100%)', accent: '#c7533a' },
  'BUAH BUAHAN': { background: 'linear-gradient(135deg, #f5fff1 0%, #dffbd0 100%)', accent: '#3ea14d' },
  'MAKANAN RINGAN': { background: 'linear-gradient(135deg, #fffaf1 0%, #ffe8d0 100%)', accent: '#dd8d2b' },
  'MIE INSTAN': { background: 'linear-gradient(135deg, #fff1f2 0%, #ffdfe0 100%)', accent: '#c54d53' },
  'MINUMAN SEGAR': { background: 'linear-gradient(135deg, #effcff 0%, #d4f7ff 100%)', accent: '#1e8fb7' },
  'TEH,KOPI,SUSU': { background: 'linear-gradient(135deg, #f9f4ff 0%, #e9dcff 100%)', accent: '#7d52c8' },
  'DETERGEN': { background: 'linear-gradient(135deg, #f0f9ff 0%, #d9f4ff 100%)', accent: '#2d8cbf' },
  'ROKOK': { background: 'linear-gradient(135deg, #f7f2ee 0%, #f0e1d7 100%)', accent: '#744d39' },
  'ANEKA KUE': { background: 'linear-gradient(135deg, #fffaf2 0%, #ffe7c7 100%)', accent: '#d18e3d' },
  'KUE BLEKAN': { background: 'linear-gradient(135deg, #fff2ec 0%, #ffe3d7 100%)', accent: '#c76c4d' },
  default: { background: 'linear-gradient(135deg, #fff7f2 0%, #f3e1d8 100%)', accent: '#d9281c' },
};

function App() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('both');
  const [modalPdf, setModalPdf] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();

    return PRODUCTS.filter((product) => {
      const text = `${product.name} ${product.detail} ${product.category}`.toLowerCase();
      const matchesSearch = !q || text.includes(q);
      const matchesCategory = !category || product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  useEffect(() => {
    document.body.style.overflow = modalPdf ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [modalPdf]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setModalPdf(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openPdf = (type) => setModalPdf(type);
  const closePdf = () => setModalPdf(null);

  const waTarget = WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Halo Paket Monalisa, saya ingin menanyakan katalog barang.')}`
    : '#';

  return (
    <>
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">M</div>
          <div>
            <div className="brand-name">Paket Monalisa</div>
            <div className="brand-est">Est. 2006</div>
          </div>
        </div>

        <button
          type="button"
          className="nav-toggle"
          aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <div className={`nav-panel ${menuOpen ? 'open' : ''}`}>
          <nav>
            <a href="#katalog" onClick={() => setMenuOpen(false)}>Katalog Barang</a>
            <button type="button" data-pdf="daily" onClick={() => { openPdf('daily'); setMenuOpen(false); }}>Brosur Harian</button>
            <button type="button" data-pdf="weekly" onClick={() => { openPdf('weekly'); setMenuOpen(false); }}>Brosur Mingguan</button>
            <a href="#lokasi" onClick={() => setMenuOpen(false)}>Cabang / Tempat</a>
            <a
              className="wa-nav"
              href={waTarget}
              target={WHATSAPP_NUMBER ? '_blank' : undefined}
              rel={WHATSAPP_NUMBER ? 'noreferrer' : undefined}
              onClick={(event) => {
                if (!WHATSAPP_NUMBER) {
                  event.preventDefault();
                  window.alert('Silakan isi WHATSAPP_NUMBER di file App.jsx terlebih dahulu.');
                }
                setMenuOpen(false);
              }}
            >
              WA
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">KATALOG 2026–2027</span>
            <h1>Belanja kebutuhan rumah tangga &amp; paket Monalisa dengan lebih mudah.</h1>
            <p>
              Jelajahi produk berdasarkan kategori, lihat keterangan barang, serta bandingkan harga
              dari brosur paket 300 hari dan mingguan.
            </p>
            <div className="hero-actions">
              <a className="btn primary" href="#katalog">Lihat Katalog</a>
              <button className="btn secondary" type="button" onClick={() => openPdf('daily')}>Buka Brosur Harian</button>
            </div>
          </div>

          <div className="hero-card">
            <div className="hero-logo">
              Paket
              <br />
              <strong>Monalisa</strong>
            </div>
            <div className="hero-line">Blok B · Desa Rajagaluh Lor</div>
            <div className="hero-badges">
              <span>300 Hari</span>
              <span>Mingguan</span>
            </div>
          </div>
        </section>

        <section className="brochure-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">BROSUR</span>
              <h2>Dua sumber katalog</h2>
              <p>Dokumen asli tetap dapat dibuka langsung dari website.</p>
            </div>
          </div>

          <div className="brochure-grid">
            <button type="button" className="brochure-card" onClick={() => openPdf('daily')}>
              <div className="brochure-preview">
                <iframe title="Preview Paket Harian" src={pdfFor('daily')} />
              </div>
              <div className="brochure-meta">
                <div className="brochure-icon">📄</div>
                <div>
                  <strong>Paket 300 Hari 2026–2027</strong>
                  <span>15+ kategori · 4 halaman</span>
                </div>
                <b>→</b>
              </div>
            </button>

            <button type="button" className="brochure-card" onClick={() => openPdf('weekly')}>
              <div className="brochure-preview">
                <iframe title="Preview Paket Mingguan" src={pdfFor('weekly')} />
              </div>
              <div className="brochure-meta">
                <div className="brochure-icon">📑</div>
                <div>
                  <strong>Paket Mingguan 2026–2027</strong>
                  <span>22 kategori · 4 halaman</span>
                </div>
                <b>→</b>
              </div>
            </button>
          </div>
        </section>

        <section id="katalog" className="catalog-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">KATALOG BARANG</span>
              <h2>Semua Barang</h2>
              <p>{filteredProducts.length.toLocaleString('id-ID')} barang ditampilkan dari {PRODUCTS.length.toLocaleString('id-ID')} barang.</p>
            </div>

            <div className="controls">
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari nama barang…"
                aria-label="Cari barang"
              />

              <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Pilih kategori">
                <option value="">Semua kategori</option>
                {CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <select value={price} onChange={(event) => setPrice(event.target.value)} aria-label="Pilih harga">
                <option value="both">Tampilkan 2 harga</option>
                <option value="daily">Harga 300 Hari</option>
                <option value="weekly">Harga Mingguan</option>
              </select>
            </div>
          </div>

          <div className="chips">
            <button type="button" className={`chip ${!category ? 'active' : ''}`} onClick={() => setCategory('')}>
              Semua
            </button>
            {CATEGORIES.map((item) => (
              <button
                key={item}
                type="button"
                className={`chip ${item === category ? 'active' : ''}`}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">🔎</div>
              <h3>Barang tidak ditemukan</h3>
              <p>Coba kata pencarian atau kategori yang berbeda.</p>
            </div>
          ) : (
            <div className="product-grid">
              {filteredProducts.map((product) => {
                const daily = parseRupiah(product.daily);
                const monthly = daily ? formatRupiah(daily * 30) : '-';
                const showDaily = price !== 'weekly';
                const showWeekly = price !== 'daily';

                return (
                  <article key={`${product.category}-${product.no}-${product.name}`} className="product-card">
                    <div
                      className="product-image"
                      style={categoryPalette[product.category] || categoryPalette.default}
                    >
                      <div className="product-image__badge">{product.category}</div>
                      <img src={iconFor(product.category)} alt={`Ilustrasi ${product.category}`} />
                    </div>
                    <div className="product-body">
                      <div className="cat">{product.category}</div>
                      <div className="product-name">{product.name}</div>
                      <div className="detail">{product.detail || '—'}</div>

                      <div className="prices">
                        {showDaily && (
                          <div className="price">
                            <small>HARGA 300 HARI</small>
                            <b>{money(product.daily)}</b>
                          </div>
                        )}
                        {showWeekly && (
                          <div className="price">
                            <small>HARGA MINGGUAN</small>
                            <b>{money(product.weekly)}</b>
                          </div>
                        )}
                      </div>

                      {showDaily && (
                        <div className="monthly">
                          Estimasi 30 hari: <b>{monthly}</b>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section id="lokasi" className="location-section">
          <div>
            <span className="eyebrow">CABANG / TEMPAT</span>
            <h2>Paket Monalisa</h2>
            <p>Blok B, Desa Rajagaluh Lor</p>
            <p className="muted">
              Alamat ini mengikuti informasi yang tercantum pada brosur. Nomor WhatsApp dapat diatur pada file App.jsx.
            </p>
          </div>

          <div id="kontak" className="contact-card">
            <span>Butuh informasi barang?</span>
            <a className="btn primary" href={waTarget} target={WHATSAPP_NUMBER ? '_blank' : undefined} rel={WHATSAPP_NUMBER ? 'noreferrer' : undefined} onClick={!WHATSAPP_NUMBER ? (event) => { event.preventDefault(); window.alert('Silakan isi WHATSAPP_NUMBER di file App.jsx terlebih dahulu.'); } : undefined}>Hubungi WhatsApp</a>
          </div>
        </section>
      </main>

      <footer>
        <div>
          <strong>Paket Monalisa</strong> · Est. 2006
        </div>
        <div>© {new Date().getFullYear()} Katalog Monalisa</div>
      </footer>

      {modalPdf && (
        <div className="modal" role="dialog" aria-modal="true" aria-label="Brosur">
          <div className="modal-backdrop" onClick={closePdf} />
          <div className="modal-box">
            <div className="modal-head">
              <div>
                <span className="eyebrow">{modalPdf === 'daily' ? 'BROSUR HARIAN' : 'BROSUR MINGGUAN'}</span>
                <h3>{modalPdf === 'daily' ? 'Paket 300 Hari 2026–2027' : 'Paket Mingguan 2026–2027'}</h3>
              </div>
              <button className="close" type="button" onClick={closePdf} aria-label="Tutup">
                ×
              </button>
            </div>
            <iframe
              title="Brosur PDF"
              src={modalPdf === 'daily' ? pdfFor('daily') : pdfFor('weekly')}
              style={{ width: '100%', height: '100%', border: 0, background: '#eee' }}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default App;
