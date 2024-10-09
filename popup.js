document.addEventListener("DOMContentLoaded", () => {
	const autoCloseToggle = document.getElementById("auto-close-toggle");
	const closeTimeInput = document.getElementById("close-time");
	const saveButton = document.getElementById("save-btn");
	const data = chrome.storage.sync.get("options");
  console.log(data);

	Object.assign(options, data.options);
	optionsForm.debug.checked = Boolean(options.debug);

	// if checked/ on - should keep timer of taqbs
	chrome.storage.sync.get(["autoCloseEnabled", "autoCloseTime"], (data) => {
		autoCloseToggle.checked = data.autoCloseEnabled || false;
		closeTimeInput.value = data.autoCloseTime || 60;
	});

	// small form for timer, listener for 
	saveButton.addEventListener("click", () => {
		const autoCloseEnabled = autoCloseToggle.checked;
		const autoCloseTime = parseInt(closeTimeInput.value, 10);

		chrome.storage.sync.set(
			{
				autoCloseEnabled,
				autoCloseTime,
			},
			() => {
				console.log("Settings saved:", { autoCloseEnabled, autoCloseTime });
			}
		);
	});
});
