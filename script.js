// Tunahan Haksever - Portfolio & Systems Interactive Engine
document.addEventListener('DOMContentLoaded', () => {
  initProjectFilters();
  initTerminal();
});

/* ==========================================================================
   1. Project Category Filtering
   ========================================================================== */
function initProjectFilters() {
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.project-card');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   2. Interactive Terminal Engine (Tam Türkçe + Tusi Kılavuzu + Katkı Sistemi)
   ========================================================================== */
function initTerminal() {
  const input = document.getElementById('terminal-input');
  const body = document.getElementById('terminal-body');
  const clearBtn = document.getElementById('clear-term-btn');
  const quickBtns = document.querySelectorAll('.cmd-pill');

  if (!input || !body) return;

  const commands = {
    // 1. Yardım / Help
    yardim: () => `
      <div class="cyan-text">⌨️ Kullanılabilir Türkçe Komutlar:</div>
      <div>• <span class="highlight-text">kimdir</span>         : Tunahan Haksever kimdir? Biyografi ve misyon.</div>
      <div>• <span class="highlight-text">projeler</span>       : Açık kaynak sistemler (Bitigey WebOS, Nova IDE vb.).</div>
      <div>• <span class="highlight-text">tusi-kilavuz</span>   : Tusi Programlama Dili tam eğitim kılavuzu ve sözdizimi.</div>
      <div>• <span class="highlight-text">tusi-demo</span>      : Canlı Tusi kodlama örneğini çalıştırır.</div>
      <div>• <span class="highlight-text">katkida-bulun</span>  : Ekosistemin gelişmesine nasıl yardımcı olabilirsiniz?</div>
      <div>• <span class="highlight-text">kitaplar</span>       : Edebi eserler (Mâsivâ Yolculuğu, Ekinoksu Beklemek).</div>
      <div>• <span class="highlight-text">yetenekler</span>     : Sistem mimarisi ve teknik yetkinlikler.</div>
      <div>• <span class="highlight-text">temizle</span>        : Terminal ekranını temizler.</div>
    `,

    // 2. Kimdir
    kimdir: () => `
      <div><strong>Tunahan Haksever</strong> (d. 7 Ağustos 2005, İstanbul)</div>
      <div>🔹 <strong>Unvan:</strong> Sistem Mimarı, Yazar & Açık Kaynak Araştırmacısı</div>
      <div>🔹 <strong>Akademik:</strong> Karadeniz Teknik Üniversitesi Türk Dili ve Edebiyatı</div>
      <div>🔹 <strong>Platform:</strong> <a href="https://bitigey.com" target="_blank" style="color:#38bdf8;">bitigey.com</a> Kurucusu</div>
      <div style="margin-top: 6px; color:#94a3b8;">
        Tarayıcı tabanlı işletim sistemleri (WebOS), bulut kodlama ortamları ve bağımsız 
        programlama dili mimarileri geliştirmektedir. Çalışmaları 657 SK ve FSEK kapsamında 
        kamu yararına, kar amacı gütmeyen özgür yazılımlardır.
      </div>
    `,

    // 3. Projeler
    projeler: () => `
      <div><strong>🚀 Geliştirilen Açık Kaynak Sistemler:</strong></div>
      <div>1. <span class="cyan-text">Bitigey WebOS</span>       : Tarayıcı içi macOS & Cyberpunk hibrit işletim sistemi (VFS, Pencere Yöneticisi).</div>
      <div>2. <span class="cyan-text">Nova Cloud IDE</span>      : Monaco Editor & WebAssembly (WASM) destekli bulut kodlama stüdyosu.</div>
      <div>3. <span class="cyan-text">Tusi-Lang</span>          : Bağımsız Lexer, AST Parser ve TPM paket yöneticili programlama dili.</div>
      <div>4. <span class="cyan-text">BitigeyDB</span>          : Hafif, asenkron ve yüksek performanslı JSON veri motoru.</div>
      <div>5. <span class="cyan-text">OmniCalc 2026</span>      : 2D grafik ve bilimsel hesaplama süiti.</div>
      <div>6. <span class="cyan-text">Bitigey Sözlük</span>     : 1.000+ köklü karşılaştırmalı etimoloji külliyatı.</div>
    `,

    // 4. Tusi-Lang Eğitim Kılavuzu
    'tusi-kilavuz': () => `
      <div class="cyan-text">🦄 Tusi Programlama Dili: Hızlı Öğrenme Kılavuzu (v2.0)</div>
      <div style="color:#94a3b8; margin-bottom: 6px;">Tusi, Türkçenin sözdizimsel sadeliği ile sistem mimarisini buluşturan bağımsız bir dildir.</div>
      
      <div><strong style="color:#fff;">1. Değişken Tanımlama:</strong></div>
      <div style="color:#a855f7; font-family: monospace;">değişken isim = "Tunahan";  // Metin</div>
      <div style="color:#a855f7; font-family: monospace;">değişken puan = 95;          // Sayı</div>
      
      <div style="margin-top:4px;"><strong style="color:#fff;">2. Ekrana Yazdırma:</strong></div>
      <div style="color:#a855f7; font-family: monospace;">yazdır("Merhaba Dünya!");</div>
      
      <div style="margin-top:4px;"><strong style="color:#fff;">3. Koşullu İfadeler:</strong></div>
      <div style="color:#a855f7; font-family: monospace;">eğer (puan > 50) ise { yazdır("Başarılı!"); } değilse { yazdır("Kaldı"); }</div>
      
      <div style="margin-top:4px;"><strong style="color:#fff;">4. Döngü Mekanizması:</strong></div>
      <div style="color:#a855f7; font-family: monospace;">değişken sayac = 1;</div>
      <div style="color:#a855f7; font-family: monospace;">döngü (sayac <= 3) { yazdır("Adım: " + sayac); sayac = sayac + 1; }</div>
      
      <div style="margin-top:4px;"><strong style="color:#fff;">5. Fonksiyonlar:</strong></div>
      <div style="color:#a855f7; font-family: monospace;">fonksiyon topla(a, b) { döndür a + b; }</div>
      
      <div style="color:#10b981; margin-top: 6px;">💡 Canlı çalıştırmak için terminale <strong>tusi-demo</strong> yazın!</div>
    `,

    // 5. Tusi Canlı Demo
    'tusi-demo': () => `
      <div class="cyan-text">// Tusi-Lang Yorumlayıcı Motoru Çalıştırılıyor...</div>
      <div style="color:#a855f7;">> değişken proje = "Bitigey WebOS";</div>
      <div style="color:#a855f7;">> değişken versiyon = 2.5;</div>
      <div style="color:#a855f7;">> fonksiyon selamla(ad) { döndür "Hoş geldin, " + ad; }</div>
      <div style="color:#a855f7;">> yazdır(selamla("Açık Kaynak Dünyası!"));</div>
      <div style="color:#a855f7;">> döngü (i = 1; i <= 3; i++) { yazdır("Çekirdek Çalışıyor: Modül " + i); }</div>
      <div style="color:#10b981; margin-top: 6px; font-weight: bold;">
        [Tusi Interpreter Runtime]: 0.002ms içinde başarıyla derlendi ve yürütüldü! ✓
      </div>
      <div style="color:#e2e8f0; font-style: italic;">Çıktı: "Hoş geldin, Açık Kaynak Dünyası! | Modül 1 | Modül 2 | Modül 3 Aktif."</div>
    `,

    // 6. Gelişmesine Yardımcı Ol / Katkıda Bulun
    'katkida-bulun': () => `
      <div class="cyan-text">🤝 Ekosistemin Gelişmesine Nasıl Yardımcı Olabilirsiniz?</div>
      <div style="color:#94a3b8; margin-top:4px;">
        Bitigey WebOS, Nova IDE ve Tusi-Lang projeleri dünya çapında özgür yazılım olarak büyümektedir.
        Siz de şu yollarla destek olabilirsiniz:
      </div>
      <div style="margin-top: 6px;">
        <div>⭐ <strong>1. GitHub Yıldızı (Star):</strong> Depolara yıldız vererek keşfedilirliği artırın.</div>
        <div>🐛 <strong>2. Hata & İyileştirme Bildirimi (Issues):</strong> Karşılaştığınız sorunları GitHub Issues üzerinden iletin.</div>
        <div>💡 <strong>3. Tusi Dili Modülleri (TPM):</strong> Tusi dili için yeni kütüphaneler yazarak katkı sağlayın.</div>
        <div>📖 <strong>4. Dokümantasyon & Çeviri:</strong> Kılavuzların farklı dillere çevrilmesine yardımcı olun.</div>
        <div>🌐 <strong>GitHub Repo:</strong> <a href="https://github.com/tunahanhaksever" target="_blank" style="color:#38bdf8;">github.com/tunahanhaksever</a></div>
      </div>
    `,

    // 7. Kitaplar & Edebiyat
    kitaplar: () => `
      <div><strong>📚 Tunahan Haksever Edebi Eserleri:</strong></div>
      <div>• <em>Mâsivâ Yolculuğu</em>: İnsanın içsel derinliğini ve varoluş sorgusunu işleyen şiir külliyatı.</div>
      <div>• <em>Ekinoksu Beklemek</em>: Kültürel hafıza ve edebi tahlil anlatısı.</div>
      <div>• <em>Kög Dergisi</em>: Dijital edebiyat ve kültür arşivi.</div>
      <div>• <em>Bitigey.com</em>: Bağımsız edebiyat hafızası portalı (<a href="https://bitigey.com" target="_blank" style="color:#38bdf8;">bitigey.com</a>).</div>
    `,

    // 8. Yetenekler
    yetenekler: () => `
      <div><strong>🛠️ Sistem Yetkinlikleri:</strong></div>
      <div>• <strong>Sistem & WebOS:</strong> Pencere Yöneticisi (Window Manager), Sanal Dosya Sistemi (VFS), Web Workers.</div>
      <div>• <strong>Derleyiciler & Diller:</strong> Lexical Analysis (Lexer), Abstract Syntax Tree (AST), Yorumlayıcı Tasarımı.</div>
      <div>• <strong>Bulut Araçları:</strong> Monaco Editor API, WebAssembly (WASM), Pyodide, Vite.</div>
      <div>• <strong>Veri Mimarisi:</strong> Asenkron JSON Motorları (BitigeyDB), İstemci Güvenliği (MetaClean).</div>
    `,

    // Temizle
    temizle: () => {
      body.querySelectorAll('.term-line-history').forEach(el => el.remove());
      return null;
    }
  };

  // English aliases for international visitors
  commands.help = commands.yardim;
  commands.whoami = commands.kimdir;
  commands.projects = commands.projeler;
  commands.skills = commands.yetenekler;
  commands.clear = commands.temizle;
  commands.contribute = commands['katkida-bulun'];
  commands['yardimci-ol'] = commands['katkida-bulun'];
  commands['tusi-rehber'] = commands['tusi-kilavuz'];
  commands['tusi-ogren'] = commands['tusi-kilavuz'];

  function executeCommand(cmdRaw) {
    const cmd = cmdRaw.trim().toLowerCase().replace(/\s+/g, '-');
    if (!cmd) return;

    if (cmd === 'temizle' || cmd === 'clear') {
      commands.temizle();
      input.value = '';
      return;
    }

    // Append user input line
    const userLine = document.createElement('div');
    userLine.className = 'term-line term-line-history';
    userLine.innerHTML = `<span class="term-prompt">tunahan@root:~$</span> <span>${escapeHtml(cmdRaw)}</span>`;

    // Calculate response
    const respLine = document.createElement('div');
    respLine.className = 'term-line output term-line-history';

    if (commands[cmd]) {
      respLine.innerHTML = commands[cmd]();
    } else if (cmd.startsWith('tusi-') || cmd.startsWith('tusi')) {
      respLine.innerHTML = commands['tusi-demo']();
    } else {
      respLine.innerHTML = `<span style="color:#ef4444;">Komut bulunamadı: '${escapeHtml(cmdRaw)}'. Kullanılabilir Türkçe komutları görmek için <strong>yardım</strong> yazın.</span>`;
    }

    // Insert before the input row
    const inputRow = body.querySelector('.term-input-row');
    body.insertBefore(userLine, inputRow);
    body.insertBefore(respLine, inputRow);

    input.value = '';
    body.scrollTop = body.scrollHeight;
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      executeCommand(input.value);
    }
  });

  quickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      executeCommand(cmd);
      input.focus();
    });
  });

  clearBtn.addEventListener('click', () => {
    commands.temizle();
  });
}

function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}
