chrome.runtime.onInstalled.addListener(() => {
    console.log('Auto Close Timer Extension Installed');
    setupAutoClose();
  });
  
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
      resetTimer(tabId);
    }
  });
  
  chrome.tabs.onActivated.addListener(activeInfo => {
    resetTimer(activeInfo.tabId);
  });
  
  //automatic closer
  //input: eventId
  //output: none
  function setupAutoClose() {
    chrome.storage.sync.get(['autoCloseEnabled', 'autoCloseTime'], (data) => {
      if (data.autoCloseEnabled) {
        const closeTime = data.autoCloseTime || 60; // start at 60 min
        startTimerForAllTabs(closeTime);
      }
    });
  }
  
  // timer for all tabs, should start when tab is open
  // chrome.tabs. - built into api
  //id called from eventId
  function startTimerForAllTabs(closeTime) {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        resetTimer(tab.id, closeTime);
      });
    });
  }
  
  // resetting the timer when the tab is opened
  function resetTimer(tabId, closeTime = 60) {
    clearTimeout(tabTimers[tabId]);
    
    chrome.storage.sync.get(['autoCloseEnabled', 'autoCloseTime'], (data) => {
      if (data.autoCloseEnabled) {
        const time = data.autoCloseTime || closeTime;
        tabTimers[tabId] = setTimeout(() => {
          chrome.tabs.remove(tabId);
        }, time * 60 * 1000); // google says they need to be ms for more accuracy - 60 seconds a min, 10000 = miliseconds
      }
    });
  }
  //make an object to store the active timers 
  // timer id: 'running time'
  const tabTimers = {}; 
  