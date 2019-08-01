const Koa = require('koa');
const axios = require('axios');
const cheerio = require("cheerio");
const app = new Koa();

app.use(async ctx => { //此拦截器表示所有请求进来我们都返回hello World
    let _headers = {};
    _headers.cookie = '你的cookie';

    let _res = await axios.get('https://www.zhihu.com/hot', { headers: _headers }).then(async (res) => {
        const $ = cheerio.load(res.data); //格式化数据

        //取基本数据
        const _list = $('html').find('.HotList-list .HotItem');

        let _dataTmp = []; //下发到客户端的数据
        await _list.each((_index, _el) => {
            const _item = $(_el);

            let _itemTmp = {}; //存储类目值

            let _title = _item.find('.HotItem-title').text().replace(/[\r\n]/g, ''); //标题
            let _Hot = _item.find('.HotItem-metrics').text().replace(/[\r\n]/g, ''); //热度

            _itemTmp = {
                title: _title,
                hot: _Hot
            };

            _dataTmp[_index] = _itemTmp; //下发到客户端的数据
        });

        return _dataTmp
    });

    ctx.body = JSON.stringify(_res);
});

console.log('站点建立在http://localhost:3000上');
app.listen(3000);