const translateBtn = document.querySelector('.translate');
const transTargetInput = document.querySelector('.trans_target_input');
const resultArea = document.querySelector('.trans_result');
const toggleButton = document.querySelector('#toggle_button');

translateBtn.addEventListener('click', async () => {
  const targetText = transTargetInput.value;
  let srcLng;
  let targetLng;

  const srcLngEl = document.querySelector('#srcLng');
  const targetLngEl = document.querySelector('#targetLng');

  srcLng = srcLngEl.options[srcLngEl.selectedIndex].value;
  targetLng = targetLngEl.options[targetLngEl.selectedIndex].value;

  const translator = await Translator.create({
    sourceLanguage: srcLng,
    targetLanguage: targetLng,
  });

  const translation = await translator.translate(targetText);

  resultArea.textContent = translation;
});


// 팝업이 열릴 때 저장된 값을 불러와서 버튼 상태를 업데이트
chrome.storage.sync.get(['isActive'], function(result) {
  if (result.isActive === false) {
    toggleButton.textContent = 'Off';
    toggleButton.classList.add('off');
  } else {
    toggleButton.textContent = 'On';
    toggleButton.classList.remove('off');
  }
});


// 버튼 클릭 시 상태를 토글하고 저장
toggleButton.addEventListener('click', () => {
  chrome.storage.sync.get(['isActive'], function(result) {
    const newStatus = !result.isActive;

    chrome.storage.sync.set({isActive: newStatus}, function() {
      if (newStatus) {
        toggleButton.textContent = 'On';
        toggleButton.classList.remove('off');
      } else {
        toggleButton.textContent = 'Off';
        toggleButton.classList.add('off');
      }
    });
  });
});
