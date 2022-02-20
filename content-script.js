const updateCheckbox = async (id) => {
  const currentValue = await chrome.storage.local.get(id);
  const isCurrentlyChecked = !!currentValue[id];
  chrome.storage.local.set({ [id]: !isCurrentlyChecked });
};

window.observer = null;
let loadDebounceTimer = null;

const main = async () => {
  const targetNode = document.getElementById("browse-view");
  const config = { attributes: true, childList: true, subtree: true };

  const callback = function (mutationsList, observer) {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        window.observer.disconnect();

        loadExtension();
      }
    }
  };

  window.observer = new MutationObserver(callback);
  window.observer.observe(targetNode, config);
};

const loadExtension = () => {
  clearTimeout(loadDebounceTimer);
  loadDebounceTimer = setTimeout(debouncedLoaded, 100);
};

const debouncedLoaded = async () => {
  const _container1Array = document.querySelectorAll(
    ".orders-full-width-panel-on-mobile .panel-body-row"
  );

  for (let i = 0; i < _container1Array.length; i++) {
    let _container = _container1Array[i];
    let checkboxContainer = _container.firstChild.firstChild;

    const orderId = _container.querySelector(
      ".col-group.col-flush.mt-xs-1.mt-md-0 .hide-xs.hide-sm .text-gray"
    ).text;

    const currentValue = await chrome.storage.local.get(orderId);
    const isChecked = !!currentValue[orderId];

    const div = document.createElement("div");
    div.className = "etsy-complete-container";
    const p = document.createElement("p");
    p.innerHTML = "Printed";

    // insert the checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = orderId;
    checkbox.onchange = () => updateCheckbox(orderId);
    checkbox.checked = isChecked;

    div.appendChild(checkbox);
    div.appendChild(p);

    checkboxContainer.appendChild(div);
  }
};

main();

//
// FUTURE ENHANCEMENTS
// 1. Make the checkbox be based on the current localstorage state,
//      instead of trying to change state and the current value separately
//
//
//
