var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var error = req.flash('error')[0];
  res.render('login', { title: 'Express', message: error});
});

module.exports = router;