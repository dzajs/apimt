const request = require('request');
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.sendStatus(200)
})

app.get('/convert', (req, resp) => {
  const imgUrl = req.originalUrl.split("convert?url=");
    return new Promise((resolve, reject) => {
      request({ url: imgUrl[1], encoding: null }, (error, response, data) => {
  if (error) {
    console.error(error);
  } else {
    const img = Buffer.from(data, 'binary').toString('base64');
    const headers = {
    "Host": "openflow.mtlab.meitu.com",
    "Connection": "keep-alive",
    "Content-Length": img.length,
    "Authorization": "0082e88c30754678adb210f95b4f83d4",
    "User-Agent": "Mozilla/5.0 (Linux; Android 10; SM-G965F Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/107.0.5304.141 Mobile Safari/537.36 com.meitu.mtxx.mtxx/9707(android10)/lang:en/isDeviceSupport64Bit:true MTWebView/4.8.5 MeituWebViewSupportOpenAppLogin",
    "Content-Type": "application/octet-stream",
    "Origin": "https://titan-h5.meitu.com",
    "X-Requested-With": "com.mt.mtxx.mtxx",
    "Sec-Fetch-Site": "same-site",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Dest": "empty",
    "Referer": "https://titan-h5.meitu.com/",
    "Accept-Encoding": "gzip, deflate",
    "Accept-Language": "en,ar-AE;q\u003d0.9,ar;q\u003d0.8,en-US;q\u003d0.7"
  };
    const url = "https://openflow.mtlab.meitu.com/open/putbase64?api_key\u003d0082e88c30754678adb210f95b4f83d4\u0026type\u003d1";
    
    request.post({ url: url, headers: headers, body: img }, function (err, res, body) {
    if (err) {
      console.error("Err : ", err);
      return;
    }

    const r = JSON.parse(body);
      const data = {
  'build':'49184',
  "equipment":"samsung_SM-G965F,29,720X1280,512",
  'data_protected':'false',
  'version':'9.7.0.7',
  'gnum':'2854794730',
  'gid':'2854794730',
  'client_id':'1089867602',
  'previous_version':'9.7.0.7',
  'client_channel_id':'google',
  'client_language':'en',
  'country_code':'OTHER',
  'effect':'ai_draw',
  'url': r.key,
  'type':'0',
  };

const options = {
  method: 'POST',
  url: 'https://ai.xiuxiu.meitu.com/v1/tool/mtlab/ai_draw_online.json',
  formData: data
};
request(options, function (err, res, body) {
  if (err) {
    console.error(err);
    return;
  }
  const x = JSON.parse(body);
  resolve(resp.json(x));
});
  });
    
  }
});
    })
})

app.get('/v2', async (req, res) => {
	try {
		const { prompt, imageSize, image } = req.query;
		if (!image) return res.jsonp({ error: 'No prompt provided or image url' });
			const data = {
				"parameter": {
					"rsp_media_type": "jpg"
				},
				"extra": {},
				"media_info_list": [{
					"media_data": (await axios.get(image, { responseType: 'arraybuffer' })).data.toString('base64'),
					"media_profiles": {
						"media_data_type": "jpg"
					},
					"media_extra": {
					}
				}]
			};

			const r = await axios.post('https://openapi.mtlab.meitu.com/v1/stable_diffusion_anime?api_key=237d6363213c4751ba1775aba648517d&api_secret=b7b1c5865a83461ea5865da3ecc7c03d',
				data
			);
      
			const im = r.data.media_info_list[0].media_data;
			const imageResposne = Buffer.from(im, 'base64');
			//res.json(r.data)
      res.writeHead(200, {
				'Content-Type': 'image/jpeg',
				'Content-Length': imageResposne.length
			});
			res.end(imageResposne);
	} catch (e) {
    console.log(e)
		return res.jsonp({ error: 'An error occurred' });
	}
});

app.listen(3000, () => {
  console.log(`listening on port 3000`)
});
