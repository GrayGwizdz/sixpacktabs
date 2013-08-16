/* Listen for commands */
chrome.commands.onCommand.addListener(function (command) {
	/* Toggle the pin state */
	if (command == "toggle-pin") {
		/* Get the currently selected tab */
		chrome.tabs.getSelected(null, function (tab) {
			/* Toggle the pinned status */
			chrome.tabs.update(tab.id, {
				'pinned': !tab.pinned
			});
		});
	/* Move the tab to the right */
	} else if (command == "tab-right") {
		/* First get the window */
		chrome.windows.getCurrent({'populate': true}, function (window) {
			/* Get the count of current tabs */
			var pinCount = 0;
			for(tab in window.tabs) {
				if(window.tabs[tab].pinned) {
					pinCount += 1;
				}
			}
			/* Get the selected tab */
			chrome.tabs.getSelected(null, function (tab) {
				/* Limit movement to range of pinned tabs */
				if(tab.pinned){
					chrome.tabs.move(tab.id, {
						'index': (tab.index + 1) % pinCount
					});
				/* Make sure to move tabs to right of pinned tabs */
				} else {
					var newIndex = (tab.index + 1) % window.tabs.length;
					if(newIndex < pinCount) {
						chrome.tabs.move(tab.id, {
							'index': pinCount
						});
					} else {
						chrome.tabs.move(tab.id, {
							'index': newIndex 
						});
					}
				}
			});
		});
	/* Move the tab to the left */
	} else if (command == "tab-left") {
		chrome.windows.getCurrent({'populate': true}, function (window) {
			/* Get the count of current tabs */
			var pinCount = 0;
			for(tab in window.tabs) {
				if(window.tabs[tab].pinned) {
					pinCount += 1;
				}
			}
			chrome.tabs.getSelected(null, function (tab) {
				if(tab.pinned){
					chrome.tabs.move(tab.id, {
						'index': (tab.index + pinCount - 1) % pinCount
					});
				} else {
					var newIndex = tab.index - 1;
					if(newIndex < pinCount) {
						chrome.tabs.move(tab.id, {
							'index': window.tabs.length - 1
						});
					} else {
						chrome.tabs.move(tab.id, {
							'index': newIndex 
						});
					}
				}
			});
		});
	}
});
