const qs = require('qs');
const url = require('url');


let queryUrlParams=((req, res, next) => {
    const parsedUrl = url.parse(req.url);
    const queryObj = qs.parse(parsedUrl.query);
    

    req.parsedQuery = queryObj;
  next();
})

module.exports=queryUrlParams