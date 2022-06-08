var express = require('express');
var path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/login', function (req, res, next) {
    res.render('login', { title: 'Express' });
});

/* GET upload page. */
router.post('/upload', function (req, res, next) {
    console.log(`req.body`, req.body);
    const body = req.body;
    if (body.name !== 'xxk') return res.status(400).send({ sucess: false, msg: '账号错误' });
    if (body.psw !== 'xxk') return res.status(400).send({ sucess: false, msg: '密码错误' });

    res.render('upload', { title: '上传' });
});

module.exports = router;
