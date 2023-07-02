chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
      text: 'OFF'
    });
  });
  
  const landingPage = 'https://www.youtube.com/';
  
  // When the user clicks on the extension action
  chrome.action.onClicked.addListener(async (tab) => {
    if (tab.url.startsWith(landingPage)) {
      // We retrieve the action badge to check if the extension is 'ON' or 'OFF'
      const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
      // Next state will always be the opposite
      const nextState = prevState === 'ON' ? 'OFF' : 'ON';
  
      // Set the action badge to the next state
      await chrome.action.setBadgeText({
        tabId: tab.id,
        text: nextState
      });
  
      if (nextState === 'ON') {
        // Insert the CSS file when the user turns the extension on
        await chrome.scripting.insertCSS({
          files: ['focus-mode.css'],
          target: { tabId: tab.id }
        });
      } else if (nextState === 'OFF') {
        // Remove the CSS file when the user turns the extension off
        await chrome.scripting.removeCSS({
          files: ['focus-mode.css'],
          target: { tabId: tab.id }
        });
        // Reload the page to re-render the original CSS
        await chrome.tabs.reload(tab.id);
      }
    }
  });

