document.addEventListener('mouseup', (e) => {
  const selection = window.getSelection();
  const targetText = selection.toString();

  if (selection && targetText) {
    chrome.runtime.sendMessage({
      action: "translateText",
      text: targetText,
      mouseX: e.clientX,
      mouseY: e.clientY
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "displayTranslation") {
    const { translation, x, y } = request;

    const beforeResultElList = document.querySelectorAll('.translate_result');

    if (beforeResultElList) {
      beforeResultElList.forEach((item) => {
        item.remove();
      });
    }

    const resultEl = document.createElement('div');

    resultEl.classList.add('translate_result');
    resultEl.textContent = translation;
    resultEl.style.cssText = `
      position: fixed;
      top: ${y}px;
      left: ${x}px;
      z-index: 99999;
      width: auto;
      max-width: 350px;
      padding: 30px;
      background-color: #333;
      color: white;
      border-radius: 5px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    `;

    const closeBtn = document.createElement('div');
    closeBtn.textContent = 'x';
    closeBtn.style.cssText = `
      position: absolute;
      top: 10px;
      right: 15px;
      color: white;
      cursor: pointer;
    `;

    closeBtn.addEventListener('click', () => {
      resultEl.remove();
    })

    resultEl.appendChild(closeBtn);
    document.body.appendChild(resultEl);

  }
});
