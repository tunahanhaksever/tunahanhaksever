// Tunahan Haksever - Portfolio & Systems Interactive Engine
document.addEventListener('DOMContentLoaded', () => {
  initSpaceBackground();
  initProjectFilters();
  initTerminal();
  initTusiStudio();
  initMobileNav();
});

/* ==========================================================================
   1. Dynamic Cosmic Space & Starfield Canvas Animation
   ========================================================================== */
function initSpaceBackground() {
  const canvas = document.getElementById('space-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let stars = [];
  let shootingStars = [];
  let mouse = { x: null, y: null, radius: 120 };

  const starColors = [
    '#ffffff',
    '#38bdf8', // Cyan
    '#818cf8', // Indigo
    '#c084fc', // Purple
    '#fef08a'  // Soft gold
  ];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createStars();
  }

  function createStars() {
    stars = [];
    const count = Math.floor((width * height) / 8000); // Responsive star density
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        originX: 0,
        originY: 0,
        radius: Math.random() * 1.8 + 0.5,
        baseAlpha: Math.random() * 0.7 + 0.2,
        alpha: Math.random() * 0.7 + 0.2,
        twinkleSpeed: (Math.random() * 0.02 + 0.005) * (Math.random() < 0.5 ? 1 : -1),
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        color: starColors[Math.floor(Math.random() * starColors.length)]
      });
    }
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Cosmic Shooting Star Spawner
  function maybeSpawnShootingStar() {
    if (Math.random() < 0.015 && shootingStars.length < 2) {
      shootingStars.push({
        x: Math.random() * width * 0.8 + width * 0.1,
        y: Math.random() * (height * 0.4),
        length: Math.random() * 80 + 70,
        speed: Math.random() * 8 + 10,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3, // ~45 degrees
        opacity: 1,
        fade: Math.random() * 0.02 + 0.015
      });
    }
  }

  function updateAndDrawShootingStars() {
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const s = shootingStars[i];
      s.x += Math.cos(s.angle) * s.speed;
      s.y += Math.sin(s.angle) * s.speed;
      s.opacity -= s.fade;

      if (s.opacity <= 0 || s.x > width || s.y > height) {
        shootingStars.splice(i, 1);
        continue;
      }

      const tailX = s.x - Math.cos(s.angle) * s.length;
      const tailY = s.y - Math.sin(s.angle) * s.length;

      const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
      grad.addColorStop(0, `rgba(56, 189, 248, ${s.opacity})`);
      grad.addColorStop(0.3, `rgba(255, 255, 255, ${s.opacity * 0.8})`);
      grad.addColorStop(1, `rgba(56, 189, 248, 0)`);

      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(tailX, tailY);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Bright head glow
      ctx.beginPath();
      ctx.arc(s.x, s.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0; // reset
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Update and draw stars
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];

      // Slow drift
      s.x += s.vx;
      s.y += s.vy;

      // Wrap around edges
      if (s.x < 0) s.x = width;
      if (s.x > width) s.x = 0;
      if (s.y < 0) s.y = height;
      if (s.y > height) s.y = 0;

      // Twinkle pulsation
      s.alpha += s.twinkleSpeed;
      if (s.alpha > 0.95 || s.alpha < 0.2) {
        s.twinkleSpeed = -s.twinkleSpeed;
      }

      // Mouse interactive gravitational repulsion
      if (mouse.x !== null) {
        const dx = s.x - mouse.x;
        const dy = s.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          s.x += (dx / dist) * force * 1.5;
          s.y += (dy / dist) * force * 1.5;
        }
      }

      // Draw star point
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.globalAlpha = Math.max(0.1, Math.min(1, s.alpha));
      ctx.fill();

      // Connect constellation lines between close stars
      for (let j = i + 1; j < stars.length; j++) {
        const s2 = stars[j];
        const dist = Math.hypot(s.x - s2.x, s.y - s2.y);
        if (dist < 75) {
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s2.x, s2.y);
          ctx.strokeStyle = '#38bdf8';
          ctx.globalAlpha = (1 - dist / 75) * 0.12;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    ctx.globalAlpha = 1;
    maybeSpawnShootingStar();
    updateAndDrawShootingStars();

    requestAnimationFrame(animate);
  }

  resize();
  animate();
}

/* ==========================================================================
   2. Project Category Filtering
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
   3. Interactive Terminal Engine (Tam Türkçe + Tusi Kılavuzu + Katkı Sistemi)
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
      <div>• <span class="highlight-text">yetenekler</span>     : Teknik yetkinlikler ve sistemler.</div>
      <div>• <span class="highlight-text">temizle</span>        : Terminal ekranını temizler.</div>
    `,

    // 2. Kimdir
    kimdir: () => `
      <div><strong>Tunahan Haksever</strong> (d. 7 Ağustos 2005, İstanbul)</div>
      <div>🔹 <strong>Alan:</strong> Açık Kaynak Geliştiricisi & Yazar</div>
      <div>🔹 <strong>Akademik:</strong> Karadeniz Teknik Üniversitesi Türk Dili ve Edebiyatı</div>
      <div>🔹 <strong>Platform:</strong> <a href="https://bitigey.com" target="_blank" style="color:#38bdf8;">bitigey.com</a></div>
      <div style="margin-top: 6px; color:#94a3b8;">
        Tarayıcı tabanlı işletim sistemleri (WebOS), bulut kodlama ortamları ve bağımsız 
        programlama dili projeleri geliştirmektedir. Çalışmaları 657 SK ve FSEK kapsamında 
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
      <div style="color:#94a3b8; margin-bottom: 6px;">Tusi, Türkçenin sözdizimsel sadeliği ile yazılım mantığını buluşturan bağımsız bir dildir.</div>
      
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
      <div>• <strong>Veri Sistemleri:</strong> Asenkron JSON Motorları (BitigeyDB), İstemci Güvenliği (MetaClean).</div>
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
    } else if (cmd.startsWith('sor-') || cmd.startsWith('sor ')) {
      const q = cmdRaw.replace(/^sor\s*/i, '').trim();
      const reply = getTusiBotReply(q);
      respLine.innerHTML = `<div class="cyan-text">🤖 Tusi Asistanı:</div><div>${reply}</div>`;
    } else if (cmd.startsWith('tusi-') || cmd.startsWith('tusi')) {
      respLine.innerHTML = commands['tusi-demo']();
    } else {
      // Check if it's a natural question
      const qLower = cmdRaw.toLowerCase();
      if (qLower.includes('nasıl') || qLower.includes('nedir') || qLower.includes('web') || qLower.includes('kod') || qLower.includes('tusi')) {
        const reply = getTusiBotReply(cmdRaw);
        respLine.innerHTML = `<div class="cyan-text">🤖 Tusi Asistanı:</div><div>${reply}</div>`;
      } else {
        respLine.innerHTML = `<span style="color:#ef4444;">Komut bulunamadı: '${escapeHtml(cmdRaw)}'. Kullanılabilir komutları görmek için <strong>yardım</strong> yazın veya Tusi'ye soru sormak için <strong>sor [sorunuz]</strong> yazın.</span>`;
      }
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

/* ==========================================================================
   4. Tusi-Lang Studio: AI Bot Engine & Live Website Simulator
   ========================================================================== */
function initTusiStudio() {
  initTusiBot();
  initTusiWebMockup();
}

/**
 * Knowledge Base & Response Engine for Tusi-Lang
 */
function getTusiBotReply(query) {
  const q = (query || '').toLowerCase().trim();

  // 1. Web Sitesi / Sunucu / HTTP
  if (q.includes('web') || q.includes('site') || q.includes('sunucu') || q.includes('http') || q.includes('port')) {
    return `
      <div>🌐 <strong>Tusi-Lang ile Web Sitesi ve Sunucu Geliştirme:</strong></div>
      <p style="margin: 4px 0;">Tusi, yerleşik HTTP sunucu motoruna (<code>sunucu_baslat</code>) sahiptir. Tek bir fonksiyonla dinamik sayfalar üretebilirsiniz:</p>
      <pre><code>// site.tusi - Web Sunucusu
fonksiyon ana_sayfa(istek, yanit) {
  yanit_yaz(yanit, "&lt;h1&gt;Tusi Web Sunucusu Çalışıyor!&lt;/h1&gt;")
  değişken saat = zaman_simdi()
  yanit_yaz(yanit, "&lt;p&gt;Sunucu Saati: " + saat + "&lt;/p&gt;")
  yanit_bitir(yanit)
}

// 8080 portunda sunucuyu dinlemeye al
sunucu_baslat(8080, ana_sayfa)</code></pre>
      <div style="color: #38bdf8; margin-top: 6px; font-size: 0.82rem;">👉 Sağdaki panelde bu kodun canlı çalışan tarayıcı simülasyonunu anlık olarak görebilirsiniz!</div>
    `;
  }

  // 2. Hesap Makinesi / İşlem
  if (q.includes('hesap') || q.includes('makine') || q.includes('topla') || q.includes('çarp') || q.includes('böl')) {
    return `
      <div>🧮 <strong>Tusi ile 4 İşlem Hesap Makinesi:</strong></div>
      <p style="margin: 4px 0;">Koşul ve fonksiyon mantığını birleştiren tam hesap makinesi örneği:</p>
      <pre><code>fonksiyon hesapla(islem, a, b) {
  eğer (islem == "+") ise {
    döndür a + b;
  }
  eğer (islem == "-") ise {
    döndür a - b;
  }
  eğer (islem == "*") ise {
    döndür a * b;
  }
  eğer (islem == "/") ise {
    eğer (b == 0) ise {
      döndür "Hata: Sıfıra bölünemez!";
    } değilse {
      döndür a / b;
    }
  }
  döndür "Bilinmeyen işlem!";
}

yazdır("15 + 25 = " + hesapla("+", 15, 25));
yazdır("100 / 4 = " + hesapla("/", 100, 4));</code></pre>
    `;
  }

  // 3. Döngüler / Loops
  if (q.includes('döngü') || q.includes('dongu') || q.includes('loop') || q.includes('while') || q.includes('for') || q.includes('tekrar')) {
    return `
      <div>🔁 <strong>Tusi-Lang Döngü Yapısı:</strong></div>
      <p style="margin: 4px 0;">Tusi'de <code>döngü</code> anahtar kelimesi ile şart sağlandığı sürece kod bloğu işletilir:</p>
      <pre><code>değişken sayac = 1;
değişken toplam = 0;

döngü (sayac <= 5) {
  yazdır("Adım: " + sayac);
  toplam = toplam + sayac;
  sayac = sayac + 1;
}

yazdır("1'den 5'e kadar toplam: " + toplam);</code></pre>
    `;
  }

  // 4. Koşullar / If-Else / Şart
  if (q.includes('koşul') || q.includes('kosul') || q.includes('şart') || q.includes('sart') || q.includes('eğer') || q.includes('eger') || q.includes('ise') || q.includes('değilse') || q.includes('degilse')) {
    return `
      <div>⚖️ <strong>Tusi-Lang Koşullu İfadeler (eğer / değilse):</strong></div>
      <pre><code>değişken notu = 85;

eğer (notu >= 90) ise {
  yazdır("Tebrikler: AA ile geçtiniz!");
} değilse {
  eğer (notu >= 60) ise {
    yazdır("Başarılı: Geçtiniz.");
  } değilse {
    yazdır("Kaldınız, bütünlemeye hazırlanınız.");
  }
}</code></pre>
    `;
  }

  // 5. Fonksiyonlar / Functions
  if (q.includes('fonksiyon') || q.includes('metot') || q.includes('function') || q.includes('def') || q.includes('tanımla')) {
    return `
      <div>⚙️ <strong>Tusi-Lang Fonksiyon Tanımlama:</strong></div>
      <p style="margin: 4px 0;">Fonksiyonlar <code>fonksiyon</code> sözcüğüyle açılır ve <code>döndür</code> ile değer üretir:</p>
      <pre><code>fonksiyon karesini_al(sayi) {
  döndür sayi * sayi;
}

fonksiyon selamlama(isim) {
  döndür "Sayın " + isim + ", Tusi dünyasına hoş geldiniz!";
}

yazdır(selamlama("Tunahan"));
yazdır("7'nin Karesi: " + karesini_al(7));</code></pre>
    `;
  }

  // 6. Değişkenler / Variables
  if (q.includes('değişken') || q.includes('degisken') || q.includes('var') || q.includes('let') || q.includes('veri tipi')) {
    return `
      <div>📦 <strong>Tusi-Lang Değişken Tanımlama:</strong></div>
      <p style="margin: 4px 0;">Tusi dinamik tipli bir dildir; metin, sayı, mantıksal değer ve dizileri doğrudan saklar:</p>
      <pre><code>değişken ad = "Tunahan Haksever";     // Metin (String)
değişken yil = 2026;                  // Sayı (Number)
değişken aktif_mi = doğru;            // Mantıksal (Boolean)
değişken diller = ["Tusi", "JS", "C"]; // Dizi (Array)

yazdır(ad + " - " + yil);</code></pre>
    `;
  }

  // 7. Tusi Nedir / Neden Yapıldı / Kim Geliştirdi
  if (q.includes('nedir') || q.includes('kim') || q.includes('amaç') || q.includes('amac') || q.includes('neden') || q.includes('felsefe')) {
    return `
      <div>🦄 <strong>Tusi Programlama Dili Nedir?</strong></div>
      <p style="margin: 4px 0;">
        <strong>Tusi-Lang</strong>, Türkçenin fonetik sadeliği ile derleyici teorisini harmanlayan bağımsız bir programlama dilidir.
        <strong>Tunahan Haksever</strong> tarafından açık kaynaklı ve eğitim amaçlı bir sistem projesi olarak geliştirilmiştir.
      </p>
      <ul style="margin: 6px 0; padding-left: 20px;">
        <li>🔹 <strong>Özgün Motor:</strong> Harici kütüphane bağımlılığı olmaksızın kendi Lexer ve AST Parser motorunu barındırır.</li>
        <li>🔹 <strong>TPM (Tusi Paket Yöneticisi):</strong> Modüler kütüphane paylaşım sistemi.</li>
        <li>🔹 <strong>Yerleşik Web Motoru:</strong> Ek sunucu yazılımı kurmadan web siteleri ve API'ler sunabilir.</li>
      </ul>
    `;
  }

  // 8. Dosya ve Sistem İşlemleri
  if (q.includes('dosya') || q.includes('file') || q.includes('oku') || q.includes('yaz')) {
    return `
      <div>📁 <strong>Tusi-Lang Dosya İşlemleri:</strong></div>
      <pre><code>// Dosyaya veri kaydetme
dosya_yaz("kayitlar.txt", "Tusi ile sistem güvenli şekilde başlatıldı.\n");

// Dosyadan veri okuma
değişken icerik = dosya_oku("kayitlar.txt");
yazdır("Okunan Belge: " + icerik);</code></pre>
    `;
  }

  // 9. Matematik ve Sayı İşlemleri
  if (q.includes('matematik') || q.includes('kök') || q.includes('rastgele') || q.includes('pi') || q.includes('math')) {
    return `
      <div>📐 <strong>Tusi Standart Matematik Kütüphanesi:</strong></div>
      <pre><code>değişken kok = mat_kok(144);          // 12
değişken zar = mat_rastgele(6);       // 1 - 6 arası rastgele tam sayı
değişken us = mat_us(2, 8);           // 2^8 = 256

yazdır("Karekök: " + kok);
yazdır("Zar Atışı: " + zar);
yazdır("2 üzeri 8: " + us);</code></pre>
    `;
  }

  // 10. Selamlaşma / Genel
  if (q.includes('merhaba') || q.includes('selam') || q.includes('naber') || q.includes('nasılsın') || q.includes('gunaydin') || q.includes('iyi günler')) {
    return `
      <div>👋 <strong>Merhaba! Hoş geldiniz.</strong></div>
      <p style="margin: 4px 0;">Ben Tusi-Lang akıllı kodlama asistanıyım. Tusi diliyle ilgili dilediğiniz her soruyu sorabilirsiniz.</p>
      <div style="margin-top: 6px; color: #38bdf8;">
        💡 <em>İpuçları: "Web sitesi nasıl yapılır?", "Hesap makinesi kodu", "Döngüler nasıl yazılır?", "Fonksiyon tanımlama" yazabilirsiniz.</em>
      </div>
    `;
  }

  // 11. Akıllı Genel Yanıt / Fallback
  return `
    <div>💡 <strong>Tusi-Lang Sözdizimi Özeti:</strong></div>
    <p style="margin: 4px 0;">"<em>${escapeHtml(query)}</em>" konulu sorunuz için temel Tusi sözdizim şablonu:</p>
    <pre><code>// Tusi-Lang Temel Kod Şablonu
fonksiyon ornek_islem(girdi) {
  değişken sonuc = girdi * 2;
  eğer (sonuc > 10) ise {
    döndür "Sonuç Yüksek: " + sonuc;
  } değilse {
    döndür "Sonuç Normal: " + sonuc;
  }
}

yazdır(ornek_islem(7));</code></pre>
    <div style="font-size: 0.82rem; color: #94a3b8; margin-top: 4px;">
      Daha spesifik bir örnek için butonlara tıklayabilir veya "web sitesi", "hesap makinesi", "fonksiyon", "döngü" gibi anahtar kelimelerle sorabilirsiniz.
    </div>
  `;
}

/**
 * Tusi AI Bot Chat Interface Logic
 */
function initTusiBot() {
  const chatBody = document.getElementById('bot-chat-body');
  const inputField = document.getElementById('bot-input-field');
  const sendBtn = document.getElementById('bot-send-btn');
  const pills = document.querySelectorAll('.bot-pill');

  if (!chatBody || !inputField || !sendBtn) return;

  function appendMessage(text, sender = 'bot') {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender}`;
    if (sender === 'user') {
      bubble.textContent = text;
    } else {
      bubble.innerHTML = text;
    }
    chatBody.appendChild(bubble);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function handleUserQuery(query) {
    const cleanQ = (query || '').trim();
    if (!cleanQ) return;

    // Add user message
    appendMessage(cleanQ, 'user');
    inputField.value = '';

    // Instant bot response (natural micro-delay for realistic UI feedback)
    setTimeout(() => {
      const replyHtml = getTusiBotReply(cleanQ);
      appendMessage(replyHtml, 'bot');
    }, 40);
  }

  sendBtn.addEventListener('click', () => {
    handleUserQuery(inputField.value);
  });

  inputField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleUserQuery(inputField.value);
    }
  });

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const prompt = pill.getAttribute('data-prompt');
      if (prompt) {
        handleUserQuery(prompt);
      }
    });
  });
}

/**
 * Live Tusi Web Server (site.tusi) Interactive Simulator
 */
function initTusiWebMockup() {
  const clockEl = document.getElementById('tusi-clock');
  const titleEl = document.getElementById('tusi-view-title');
  const descEl = document.getElementById('tusi-view-desc');
  const routeBtns = document.querySelectorAll('.browser-link-btn');

  // 1. Live server clock simulating zaman_simdi()
  function updateClock() {
    if (!clockEl) return;
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const timeStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    clockEl.textContent = `Sunucu Saati (zaman_simdi): ${timeStr}`;
  }

  updateClock();
  setInterval(updateClock, 1000);

  // 2. Simulated Tusi Routes (site.tusi response router)
  const routesData = {
    '/': {
      title: '🐟 Tusi Dünyasına Hoş Geldiniz!',
      desc: 'Bu site tamamen <strong>Tusi</strong> programlama dili ve yerleşik web motoru (<code>sunucu_baslat</code>) ile derlenip sunulmaktadır.'
    },
    '/hakkimizda': {
      title: '📖 Hakkımızda (site.tusi)',
      desc: 'Tusi-Lang; Türkçenin sözdizimsel zenginliğini modern yazılımla buluşturan, Tunahan Haksever tarafından geliştirilmiş bağımsız bir dildir.'
    },
    '/ozellikler': {
      title: '⚡ Tusi Web Sunucusu Yetenekleri',
      desc: '• Sıfır dış bağımlılık ile yerleşik HTTP motoru<br>• Mikro-saniye seviyesinde AST yorumlama hızı<br>• TPM (Tusi Paket Yöneticisi) ile tam modül desteği.'
    }
  };

  routeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      routeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const route = btn.getAttribute('data-route');
      const data = routesData[route] || routesData['/'];

      if (titleEl) titleEl.innerHTML = data.title;
      if (descEl) descEl.innerHTML = data.desc;
    });
  });
}

/* ==========================================================================
   5. Mobile Navigation Drawer Controller
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-toggle-btn');
  const closeBtn = document.getElementById('drawer-close-btn');
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  const links = document.querySelectorAll('.drawer-item');

  if (!toggleBtn || !drawer || !backdrop) return;

  function openDrawer() {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    document.body.classList.add('drawer-open');
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.classList.remove('drawer-open');
  }

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  links.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });
}
