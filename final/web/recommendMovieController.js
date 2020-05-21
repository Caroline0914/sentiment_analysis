const searchHistoryDao = require('../dao/searchHistoryDao');
const movieInfoDao = require('../dao/movieInfoDao');
const recommendMovieDao = require('../dao/recommendMovieDao');
const url = require('url');


let path = new Map();

/**
 * 获取历史记录
 * @returns {Promise<{country: {total: [], item: []}, director: {total: [], item: []}, author: {total: [], item: []}, language: {total: [], item: []}, coreActor: {total: [], item: []}, mType: {total: [], item: []}}>}
 */
async function getHistory(username) {
    let res = await searchHistoryDao.getSearchWord(username);
    let history = {
        "director": {
            "total": [],
            "item": []
        },
        "author": {
            "total": [],
            "item": []
        },
        "coreActor": {
            "total": [],
            "item": []
        },
        "mType": {
            "total": [],
            "item": []
        },
        "country": {
            "total": [],
            "item": []
        },
        "language": {
            "total": [],
            "item": []
        }
    };
    let allMovie = [];
    for(let i = 0; i < res.length; i++) {
        let item = res[i];
        //搜索演员情况
        if(item.flag == 2){
            // if(history.coreActor.item.includes(item.searchWord)){
            //     let index = history.coreActor.item.findIndex(ele => ele == item.searchWord);
            //     history.coreActor.total[index] += 2;
            // } else {
            //     history.coreActor.item.push(item.searchWord);
            //     history.coreActor.total.push(2);
            // }
            addItem(item.searchWord, history.coreActor, 2);
        }
        //搜索电影情况
        if(item.flag == 1){
            let movieContent = await movieInfoDao.getMovieByName(item.searchWord);
            allMovie.push(JSON.parse(JSON.stringify(movieContent)));
            movieContent.director && movieContent.director.split(';').forEach(it => {
                it && addItem(it, history.director, 1);
            });
            movieContent.author && movieContent.author.split(';').forEach(it => {
                it && addItem(it, history.author, 1);
            });
            let corAct = movieContent.coreActor && movieContent.coreActor.split(';');//演员只取前1/3
            corAct && corAct.splice(0, Math.ceil(corAct.length / 3)).forEach(it => {
                it && addItem(it, history.coreActor, 1);
            });
            movieContent.country && movieContent.country.split('/').forEach(it => {
                it && addItem(it.trim(), history.country, 1);
            });
            movieContent.mType && movieContent.mType.split(';').forEach(it => {
                it && addItem(it, history.mType, 1);
            });
            movieContent.language && movieContent.language.split('/').forEach(it => {
                it && addItem(it.trim(), history.language, 1);
            });
        }
    }
    return {
        "history": history,
        "allMovie": [].slice.call(allMovie)
    }
}

/**
 * 添加辅助方法
 * @param con 添加内容
 * @param to 添加的地方
 * @param num 添加的权重
 */
function addItem(con, to, num) {
    if(con){
        if(to.item.includes(con)){
            let index = to.item.findIndex(ele => ele == con);
            to.total[index] += num;
        } else {
            to.item.push(con);
            to.total.push(num);
        }
    }
}

/**
 * 获取推荐电影id和相似度
 * @returns {Promise<void>}
 */
async function exec(username) {
    let result = await getHistory(username);
    //先分析导演，编剧，主演
    let data = getMax(result);
    let total = data.total;
    let item = data.item;
    //用于分析之后的类型，国家和语言
    let movieList = [];
    let final = {};
    for(let i = 0; i < item.length; i++) {
        let ele = item[i];
        await movieInfoDao.getMovieByLike(ele.key, ele.value).then(res => {
            for (let prop in res) {
                if(final[res[prop].id]) {
                    final[res[prop].id] += total[i] * 0.5;
                } else {
                    movieList.push(res[prop]);
                    final[res[prop].id] = total[i] * 0.5;
                }
            }
        }, err => {
            console.log(err);
        })
    }
    //再分析类型，国家，语言
    let mType = result.history.mType;
    let country = result.history.country;
    let language = result.history.language;
    for(let i = 0; i < movieList.length; i++) {
        // 类型
        for(let j = 0; j < mType.item.length; j++) {
            if(movieList[i].mType && movieList[i].mType.indexOf(mType.item[j]) >= 0){
                final[movieList[i].id] += mType.total[j];
            }
        }
        // 国家
        for(let j = 0; j < country.item.length; j++) {
            if(movieList[i].country && movieList[i].country.indexOf(country.item[j]) >= 0){
                final[movieList[i].id] += country.total[j] * 0.5;
            }
        }
        // 语言
        for(let j = 0; j < language.item.length; j++) {
            if(movieList[i].language && movieList[i].language.indexOf(language.item[j]) >= 0){
                final[movieList[i].id] += language.total[j] * 0.5;
            }
        }
    }
    let arr = [];
    let has = [];
    for(let i = 0; i < result.allMovie.length; i++) {
        has.push(result.allMovie[i].id);
    }
    for(let prop in final) {
        arr.push(final[prop]);
    }
    arr.sort((a, b) => b - a);//从大到小
    let flag = arr[10 + result.allMovie.length];
    let obj = {};
    for(let prop in final) {
        if(final[prop] >= flag && (!has.includes(prop))){
            obj[prop] = final[prop];
        }
    }
    return obj;
}

/**
 * 设置推荐电影
 * @param username 用户名
 */
function setRecommendMovie(username) {
    recommendMovieDao.deleteMovie(username).then(result =>{
        exec(username).then(res => {
            for(let prop in res) {
                recommendMovieDao.setRecommendMovie(username, prop, res[prop]).then(data => {
                    // console.log(data);
                }, err => {
                    console.log(err);
                })
            }
        }, error => {
            console.log(error);
        })
    }, err => {
        console.log(err);
    })
}


/**
 * 获取需要分析的电影列表
 * @param result
 * @returns {{total: [], item: []}}
 */
function getMax(result){
    let history = JSON.parse(JSON.stringify(result.history));
    let allMovie = result.allMovie;
    let data = {
        total: [],
        item: []
    };
    [].slice.call(allMovie);
    //如果历史记录有电影，取电影长度5倍；没有电影取演员数量
    let len = allMovie.length ? allMovie.length * 5 : history.coreActor.item.length;
    let prevMax = 0;
    while (len > data.total.length){
        let max;
        if(prevMax) {
            let arr =  [...result.history.director.total, ...result.history.coreActor.total, ...result.history.author.total].filter(item => item != prevMax);
            max = Math.max(...arr);
        } else {
            max = Math.max(...result.history.director.total, ...result.history.coreActor.total, ...result.history.author.total);
        }
        prevMax = max;
        fillData(max, result.history.director, history.director, data, "director");
        fillData(max, result.history.author, history.author, data, "author");
        fillData(max, result.history.coreActor, history.coreActor, data, "coreActor");
    }
    return data;
}

/**
 * 补全data
 * @param max
 * @param from
 * @param to
 * @param data
 * @param key
 */
function fillData(max, from, to, data, key){
    from.total.includes(max) && from.total.forEach((ele, i) => {
        if(ele == max) {
            data.total.push(ele);
            data.item.push({
                key: key,
                value: from.item[i]
            });
        }
    });
}


/**
 * 获取推荐电影
 * @param request
 * @param response
 */
async function getRecommendMovie(request, response) {//GET
    let params = url.parse(request.url, true).query;
    let obj = [];
    let idList =  await recommendMovieDao.getMovieId(params.username);
    for(let prop in idList) {
        let content = await recommendMovieDao.getRecommendMovie(idList[prop].movieId);
        obj.push(content[0]);
    }
    if(obj.length) {
        response.writeHead(200);
        response.write(JSON.stringify(obj));
        response.end();
    } else {
        response.writeHead(200);
        response.write("noData");
        response.end();
    }
}
path.set('/api/getRecommendMovie', getRecommendMovie);


module.exports.path = path;
module.exports.setRecommendMovie = setRecommendMovie;


