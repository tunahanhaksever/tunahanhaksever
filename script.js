/**
 * Tunahan Haksever Portfolio Interactive Engine
 * Zero dependencies, ultra-fast vanilla JS
 */

document.addEventListener('DOMContentLoaded', () => {
  initProjectFilters();
  initTerminal();
  initContactActions();
});

/* ==========================================================================
   1. Project Category Filtering
   ========================================================================== */
function initProjectFilters() {
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.project-card');

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
   2. Interactive Terminal Engine
   ========================================================================== */
function initTerminal() {
  const input = document.getElementById('terminal-input');
  const body = document.getElementById('terminal-body');
  const clearBtn = document.getElementById('clear-term-btn');
  const quickBtns = document.querySelectorAll('.cmd-pill');

  if (!input || !body) return;

  const commands = {
    help: () => `
      <div class="cyan-text">Kullanılabilir Komutlar:</div>
      <div>• <span class="highlight-text">whoami</span>    : Tunahan Haksever kimdir? Misyon ve vizyon.</div>
      <div>• <span class="highlight-text">projects</span>  : Geliştirilen açık kaynak projelerin dökümü.</div>
      <div>• <span class="highlight-text">skills</span>    : Sistem ve dil geliştirme yetkinlikleri.</div>
      <div>• <span class="highlight-text">tusi-demo</span> : Tusi-Lang programlama dilinden örnek kod çalıştırır.</div>
      <div>• <span class="highlight-text">contact</span>   : İletişim ve GitHub bağlantıları.</div>
      <div>• <span class="highlight-text">clear</span>     : Terminal ekranını temizler.</div>
    `,
    whoami: () => `
      <div><strong>Tunahan Haksever</strong></div>
      <div>Yazılım Mühendisi & Açık Kaynak Mimarı.</div>
      <div>WebOS, Bulut IDE ve Programlama Dili mimarileri üzerinde araştırmacı geliştirici.</div>
      <div class="cyan-text">GitHub: https://github.com/tunahanhaksever</div>
    `,
    projects: () => `
      <div><strong>🚀 Öne Çıkan Sistemler:</strong></div>
      <div>1. <span class="cyan-text">Bitigey WebOS</span>: Tarayıcı içi macOS & Cyberpunk hibrit işletim sistemi.</div>
      <div>2. <span class="cyan-text">Nova Cloud IDE</span>: Monaco Editor & WebAssembly altyapılı bulut stüdyosu.</div>
      <div>3. <span class="cyan-text">Tusi-Lang</span>: Özel Lexer, AST Parser ve TPM paket yöneticili programlama dili.</div>
      <div>4. <span class="cyan-text">BitigeyDB</span>: İstemci ve sunucu için hafif JSON veri motoru.</div>
    `,
    skills: () => `
      <div><strong>🛠️ Temel Yetkinlik Matrisi:</strong></div>
      <div>• Diller: JavaScript (ESNext), TypeScript, Python, Tusi-Lang</div>
      <div>• Mimariler: WebOS Window Management, Virtual File System, Monaco API</div>
      <div>• Derleyici: Lexer, Abstract Syntax Tree (AST), Bytecode/Interpreter, WASM</div>
    `,
    'tusi-demo': () => `
      <div class="cyan-text">// Tusi-Lang Canlı Yorumlama Simülasyonu:</div>
      <div style="color: #c084fc;">yaz("Merhaba Dünya! Bitigey Ekosistemine Hoş Geldiniz.");</div>
      <div style="color: #c084fc;">değişken sistem = "Bitigey WebOS";</div>
      <div style="color: #c084fc;">döngü(i = 1; i <= 3; i++) { yaz("Çekirdek Çalışıyor: " + i); }</div>
      <div class="success-text" style="color: #10b981; margin-top: 5px;">[Tusi Engine]: 0.002ms içinde başarıyla derlendi ve çalıştırıldı! ✓</div>
    `,
    contact: () => `
      <div>📧 E-Posta: <span class="cyan-text">tunahanhaksever@users.noreply.github.com</span></div>
      <div>🌐 GitHub: <a href="https://github.com/tunahanhaksever" target="_blank" style="color:#38bdf8;">github.com/tunahanhaksever</a></div>
    `,
    clear: () => {
      body.querySelectorAll('.term-line-history').forEach(el => el.remove());
      return null;
    }
  };

  function executeCommand(cmdRaw) {
    const cmd = cmdRaw.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === 'clear') {
      commands.clear();
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
    } else {
      respLine.innerHTML = `<span style="color:#ef4444;">Komut bulunamadı: '${escapeHtml(cmd)}'. Kullanılabilir komutları görmek için 'help' yazın.</span>`;
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
    commands.clear();
  });
}

/* ==========================================================================
   3. Contact & Copy Actions
   ========================================================================== */
function initContactActions() {
  const copyBtn = document.getElementById('copy-email-btn');
  const quickCopy = document.getElementById('copy-quick-email');
  const toast = document.getElementById('toast');

  const emailText = 'tunahanhaksever@users.noreply.github.com';

  function triggerCopy() {
    navigator.clipboard.writeText(emailText).then(() => {
      showToast('E-posta panoya kopyalandı!');
    }).catch(() => {
      showToast('Kopyalama yapılamadı, lütfen manuel alın.');
    });
  }

  if (copyBtn) copyBtn.addEventListener('click', triggerCopy);
  if (quickCopy) quickCopy.addEventListener('click', triggerCopy);

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }
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
