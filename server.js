const http = require('http');
const fetch = require('node-fetch');

const getData = async(url) => {
    const localURL = new URL('http://yumuta.github.io/vocaminer/'+url);
    const requestURL = new URL('http://api.search.nicovideo.jp/api/v2/video/contents/search');
    const param = requestURL.searchParams;
    param.set('q', localURL.searchParams.get('q') || 'ミクオリジナル曲');
    param.set('targets', 'tagsExact');
    // 再生数
    param.set('filters[viewCounter][gte]', localURL.searchParams.get('viewgte') || 100);
    param.set('filters[viewCounter][lte]', localURL.searchParams.get('viewlte') || 1000);
    // 投稿年
    const dategte = localURL.searchParams.get('dategte');
    const datelt = localURL.searchParams.get('datelt');
    if (dategte) param.set('filters[startTime][gte]', dategte.replace(' ', '+'));
    if (datelt) param.set('filters[startTime][lt]', datelt.replace(' ', '+'));
    param.set('_limit', 1);
    // TODO: ソート方法をランダマイズ
    param.set('_sort', '-lastCommentTime');
    // TODO: contextはvocaminerでよさそう
    param.set('_context', 'apiguide');
    return new Promise(async(resolve, reject)=>{
        try {
            const res = await fetch(requestURL);
            const count = await res.headers.get('x-total-count');
            param.set('fields', 'contentId,title');
            param.set('_offset', getOffset(count));
            const res2 = await fetch(requestURL);
            const json = await res2.json();
            if (json.meta.status !== 200) return reject('response is not 200');
            if (json.data.length === 0) return reject('noResult');
            return resolve(json.data[0]);
        } catch (e) {
            return reject(e);
        }
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