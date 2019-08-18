const http = require('http');

const getData = (url) => {
    const localURL = new URL('http://yumuta.github.io/vocaminer/'+url);
    const requestURL = new URL('http://api.search.nicovideo.jp/api/v2/video/contents/search');
    requestURL.searchParams.set('q', localURL.searchParams.get('q') || 'ミクオリジナル曲');
    requestURL.searchParams.set('targets', 'tagsExact');
    requestURL.searchParams.set('filters[viewCounter][gte]', localURL.searchParams.get('viewgte') || 100);
    requestURL.searchParams.set('filters[viewCounter][lte]', localURL.searchParams.get('viewlte') || 1000);
    requestURL.searchParams.set('_limit', 1);
    // TODO: ソート方法をランダマイズ
    requestURL.searchParams.set('_sort', '-lastCommentTime');
    // TODO: contextはvocaminerでよさそう
    requestURL.searchParams.set('_context', 'apiguide');
    return new Promise((resolve, reject)=>{
        http.get(requestURL.href, res => {
            const count = res.headers['x-total-count'];
            requestURL.searchParams.set('fields', 'contentId,title');
            requestURL.searchParams.set('_offset', getOffset(count));
            http.get(requestURL.href, (res1) => {
                let chunk = "";
                res1.on('data', (receivedData) => {
                    chunk += receivedData
                }).on('end', () => {
                    let json = null;
                    try {
                        json = JSON.parse(chunk);
                    } catch (e) {
                        reject('JSON parse error');
                        return;
                    }
                    if (json.meta.status !== 200) {
                        reject('response is not 200');
                        return;
                    }
                    const movieNum = json.data.length;
                    if (movieNum === 0) reject('noResult');
                    resolve(json.data[0]);
                });
            }).on('error', (e) => {
                reject(e);
            }).end();
        }).on('error', (e) => {
            reject(e);
        }).end();
    });
};

const getOffset = (count) => {
    maxOffset = Math.min(1600, count);
    return Math.floor(Math.random() * maxOffset);
};

const server = http.createServer((req, res) => {
    if(req.method !== 'GET') return;
    getData(req.url)
    .then((receivedData)=>{
        let apiResponse = `{"contentId":"${receivedData.contentId}", "title": "${receivedData.title}"}`;
        res.statusCode = 200;
        res.setHeader('Access-Control-Allow-Origin','*');
        res.setHeader('Content-Type', 'application/json;charset=utf-8');
        res.end(apiResponse);
    })
    .catch((err)=>{
        res.statusCode = 200;
        res.setHeader('Access-Control-Allow-Origin','*');
        res.setHeader('Content-Type', 'application/json;charset=utf-8');
        if(err === 'noResult') res.end('{"contentId":null, "title":"noResult"}');
        else res.end('{"contentId":null, "title":"fetchError"}');
    });   
});

server.listen(8080);