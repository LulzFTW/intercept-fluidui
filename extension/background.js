function listener(details) {
  let filter = browser.webRequest.filterResponseData(details.requestId);
  let decoder = new TextDecoder();
  let encoder = new TextEncoder();
  let str = '';

  filter.ondata = event => {
    str += decoder.decode(event.data, {stream: true});
  }

  filter.onstop = event => {
    let json = JSON.parse(str);
    if (json.accType) {
      json.accType = 'premium1';
      delete json.maxActiveProjects;
      delete json.maxPages;
    }
    str = JSON.stringify(json);
    filter.write(encoder.encode(str));
    filter.disconnect();
  }
}

browser.webRequest.onBeforeRequest.addListener(
  listener, {
    urls: ["https://www.fluidui.com/editor/live/index.php"],
    types: ["xmlhttprequest"]
  }, ["blocking"]
);