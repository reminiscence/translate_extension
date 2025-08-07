chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  chrome.storage.sync.get(['isActive'], function(result) {
    if (result.isActive !== false) {
      if (request.action === "translateText") {
        const textToTranslate = request.text;
        const mouseX = request.mouseX;
        const mouseY = request.mouseY;
        const enExp = /[a-zA-Z]/g;
        const jaExp = /[ぁ-ゔ]+|[ァ-ヴー]+[々〆〤]/g;

        const translator = new Promise((resolve) => {
          resolve(Translator.create({
            sourceLanguage: enExp.test(textToTranslate) ? "en" : jaExp.test(textToTranslate) ? 'ja' : 'en',
            targetLanguage: "ko",
          }))
        });

        translator.then(result => {
          const translation = new Promise((resolve) => {
            resolve(result.translate(textToTranslate));
          });

          translation.then(result => {
            if (translation) {
              // 번역 결과를 다시 content.js로 보냄
              chrome.tabs.sendMessage(sender.tab.id, {
                action: "displayTranslation",
                translation: result,
                x: mouseX,
                y: mouseY
              });
            }
          })
        });
      }
    }
  });
});
