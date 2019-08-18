const http = require('http');

const getData = (url) => {
    const localURL = new URL('http://yumuta.github.io/vocaminer/'+url);
    const requestURL = new URL('http://api.search.nicovideo.jp/api/v2/video/contents/search?q=ミクオリジナル曲&targets=tagsExact&fields=contentId,title&filters[viewCounter][gte]=100&filters[viewCounter][lte]=1000&_sort=-lastCommentTime&_offset=0&_limit=100&_context=apiguide');
    requestURL.searchParams.set('q', localURL.searchParams.get('q'));
    requestURL.searchParams.set('filters[viewCounter][gte]', localURL.searchParams.get('viewgte'));
    requestURL.searchParams.set('filters[viewCounter][lte]', localURL.searchParams.get('viewlte'));
    return new Promise((resolve, reject)=>{
        http.get(requestURL.href, (res1)=>{
            let chunk = "";
            res1.on('data',(receivedData) => {
                chunk+=receivedData
            }).on('end', ()=>{
                let json = null;
                try{
                    json = JSON.parse(chunk);
                } catch(e) {
                    reject('JSON parse error');
                    return;
                }
                if(json.meta.status !== 200) {
                    reject('response is not 200');
                    return;
                }
                const movieNum = json.data.length;
                if(movieNum === 0) reject('noResult');
                let pickedUpMovie = json.data[Math.floor(Math.random()*movieNum)];
                resolve(pickedUpMovie);
            });
        }).on('error',(e)=>{
            reject(e);
        }).end();
    });
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