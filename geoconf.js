
function getRequestData(request) {
 // https://workers.cloudflare.com/docs/reference/runtime/apis/fetch/#request
    let data = {
        'country':(request.cf.country || "Canada"),//can't get full country name, need mapping
        'country_code':(request.cf.country || "Canada"),
        'city': (request.cf.city || "Montreal"),
        'state':(request.cf.region || "Quebec"),
        'state_code':(request.cf.regionCode || "QC"),
        'continent':(request.cf.continent || "NA"),
        'ip': request.headers.get('CF-Connecting-IP')
    };
    return data;
}


addEventListener('fetch', event => {
event.passThroughOnException()
event.respondWith(cookieHandle(event.request))}
);

async function cookieHandle(request) {
  let response = await fetch(request)
  let geo = await getRequestData(request)
  console.log(request)
  let cookies = request.headers.get('Cookie') || ""
  if (cookies.includes("GeoConf=")) {
    // If cookes are created, just pass request through.
    return fetch(request)
  }
  // Copy Response object so that we can edit headers.
  response = new Response(response.body, response)
  //console.log(response)

  // Set cookie so that we don't add the headers
  // next time.
  var geoJSON = JSON.stringify(geo);
  response.headers.append("Set-Cookie", `GeoConf=${geoJSON}`)

  // Return on to client.
  return response
}
