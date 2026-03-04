// src/plugins/securityBlocker.ts
import { App } from 'vue'

export default {
  install(app: App) {
    // 🔹 경고 오버레이 DOM 생성
    const overlay = document.createElement('div')
    overlay.id = 'security-overlay'
    overlay.style.cssText = `
      position: fixed;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.75);
      color: #fff;
      padding: 24px 40px;
      border-radius: 12px;
      font-size: 20px;
      font-weight: bold;
      text-align: center;
      z-index: 9999;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.4s ease;
    `
    document.body.appendChild(overlay)

    function showOverlay(action: string) {
      overlay.textContent = `🚫 이 페이지는 '${action}'이 허용되지 않습니다.`
      overlay.style.opacity = '1'
      setTimeout(() => {
        overlay.style.opacity = '0'
      }, 1800)
    }

    // 1. 드래그 방지
    document.addEventListener('dragstart', (e) => {
      e.preventDefault()
      showOverlay('드래그')
    })

    // 2. 복사 방지
    document.addEventListener('copy', (e) => {
      e.preventDefault()
      showOverlay('복사')
    })

    // 3. 우클릭 방지
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault()
      showOverlay('우클릭')
    })

    // 4. 키보드 단축키 방지
    document.addEventListener('keydown', (e: any) => {
      if ((e.ctrlKey && (e.key === 'c' || e.key === 'p')) || e.key === 'PrintScreen') {
        e.preventDefault()
        if (e.key === 'c') showOverlay('Ctrl + C (복사)')
        if (e.key === 'p') showOverlay('Ctrl + P (인쇄)')
        if (e.key === 'PrintScreen') showOverlay('PrintScreen (캡처)')
      }
    })
  }
}
