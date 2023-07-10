
chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: 'X'
  });

  chrome.action.setBadgeTextColor({
    color: '#FFFFFF'  // white
  });

  chrome.action.setBadgeBackgroundColor({
    color: '#FF0000'  // red
  });

});
  
const landingPage = 'https://www.youtube.com/';

// When the user clicks on the extension action
chrome.action.onClicked.addListener(async (tab) => {
  if (tab.url.startsWith(landingPage)) {
    // We retrieve the action badge to check if the extension is 'ON' or 'OFF'
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
    // Next state will always be the opposite
    const nextState = prevState === '✓' ? 'X' : '✓';

    // Set the action badge to the next state
    await chrome.action.setBadgeText({
      tabId: tab.id,
      text: nextState
    });

    if (nextState === '✓') {
      // Insert the CSS file when the user turns the extension on
      await chrome.scripting.insertCSS({
        files: ['focus-mode.css'],
        target: { tabId: tab.id }
      });

      chrome.action.setBadgeBackgroundColor({
        color: '#00FF00'  // green
      });

      chrome.action.setBadgeTextColor({
        color: '#000000'  // black
      });

    } else if (nextState === 'X') {
      // Remove the CSS file when the user turns the extension off
      await chrome.scripting.removeCSS({
        files: ['focus-mode.css'],
        target: { tabId: tab.id }
      });

      chrome.action.setBadgeBackgroundColor({
        color: '#FF0000'  // red
      });

      chrome.action.setBadgeTextColor({
        color: '#FFFFFF'  // white
      });

      // Reload the page to re-render the original CSS
      await chrome.tabs.reload(tab.id);
    }
  } else {
    // remove badge
    await chrome.action.setBadgeText({
      tabId: tab.id,
      text: ''
    });

    
  }
});



