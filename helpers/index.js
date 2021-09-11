const fs = require('fs');

module.exports = {
  parseHarFile: function (file) {
    const harDataJson = fs.readFileSync(file.path);
    try {
      const harData = JSON.parse(harDataJson.toString());

      const data = [];
      harData.log.entries.forEach(entry => {
        data.push({
          startedDateTime: entry.startedDateTime,
          wait: entry.timings.wait,
          serverIPAddress: entry.serverIPAddress,
          request: {
            method: entry.request.method,
            url: new URL(entry.request.url).host,
            headers: {
              contentType: entry.request.headers.find(o => {
                return o.name.toLowerCase() === 'content-type';
              })?.value || null,
              cacheControl: entry.request.headers.find(o => {
                return o.name.toLowerCase() === 'cache-control';
              })?.value || null,
              pragma: entry.request.headers.find(o => {
                return o.name.toLowerCase() === 'pragma';
              })?.value || null,
              expires: entry.request.headers.find(o => {
                return o.name.toLowerCase() === 'expires';
              })?.value || null,
              age: entry.request.headers.find(o => {
                return o.name.toLowerCase() === 'age';
              })?.value || null,
              lastModified: entry.request.headers.find(o => {
                return o.name.toLowerCase() === 'last-modified';
              })?.value || null,
              host: entry.request.headers.find(o => {
                return o.name.toLowerCase() === 'host';
              })?.value
            }
          },
          response: {
            status: entry.response.status,
            statusText: entry.response.statusText,
            headers: {
              contentType: entry.response.headers.find(o => {
                return o.name.toLowerCase() === 'content-type';
              })?.value || null,
              cacheControl: entry.response.headers.find(o => {
                return o.name.toLowerCase() === 'cache-control';
              })?.value || null,
              pragma: entry.response.headers.find(o => {
                return o.name.toLowerCase() === 'pragma';
              })?.value || null,
              expires: entry.response.headers.find(o => {
                return o.name.toLowerCase() === 'expires';
              })?.value || null,
              age: entry.response.headers.find(o => {
                return o.name.toLowerCase() === 'age';
              })?.value || null,
              lastModified: entry.response.headers.find(o => {
                return o.name.toLowerCase() === 'last-modified';
              })?.value || null,
              host: entry.response.headers.find(o => {
                return o.name.toLowerCase() === 'host';
              })?.value
            }
          }
        })
      });

      return data;
    } catch(error) {
      console.error('Error parsing HAR file');
      return null;
    }
  }
};
