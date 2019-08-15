/*

- Integrate imagemagick or some resizer via URLs
- Finish designing UI
- Figure out decent dynamic layout across the viewport sizes
- Add download links to modal image
- thumbnail view? 
- Bug: Modal only loops through pics that have been loaded, should display all pics 
*/

var express = require('express');
var app = express();
var q = require('q')
var path = require("path");
var fs = require("fs");
var winston = require('winston');
var sizeof = require('image-size');
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new (winston.transports.Console)(),
    //new (winston.transports.File)({ filename: path.join(process.env.HOME,'.NightshadeNG/universal-console.log')})
  ]
})

app.locals.apiUrl = '/api/v1/';
app.locals.publicFolder = __dirname + '/public';
app.locals.picFolder = __dirname + "/pics";
app.locals.webFolder = app.locals.picFolder+'/web';
app.locals.lowFolder = app.locals.picFolder+'/low/';
app.locals.highFolder = app.locals.picFolder+'/high/';
app.locals.loadCount = 20;

let pics = [];

const arrayToObject = (array) =>
  array.reduce((obj, item) => {
    obj[item.id] = item
    return obj
  }, {})


console.log(__dirname + app.locals.picFolder);
app.use(express.static( app.locals.publicFolder));
app.use(express.static( app.locals.picFolder));
//app.use(express.static( app.locals.Folder));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

    
app.get(app.locals.apiUrl, function(req, res) {
  logger.info('/ called');
  res.send({length: `${pics.length}`});
  //res.sendFile(path.join(app.locals.publicFolder, 'index.html'));	
});


app.get(`${app.locals.apiUrl}load/:startat`, function(req, res){
  logger.log('info', `load called, startat ${req.params.startat}`);
	if(!pics || pics.length < 1) {
	  loadPhotos();
	} 
	
	let startat = req.params.startat ? Number.parseInt(req.params.startat) : 0;
	let endat = startat + Number.parseInt(app.locals.loadCount); 
	if (endat >= pics.length) {
		endat = pics.length;
	}
	logger.log('info', 'startat ' + startat + ' endat ' + endat);
	let picBatch = pics.slice(startat,endat);
	

	res.send({ pics: picBatch, startat: startat, endat: endat });
});

app.get(`${app.locals.apiUrl}download/low/:file`, function(req, res){
  if(!req.params.file) { res.send('Missing filename.'); }
  var file = req.params.file;
  res.download('pics/low/' + file, function(err){
    if(err) logger.log('error', err); 
    
  });
  
});

app.get(`${app.locals.apiUrl}download/high/:file`, function(req, res){
  if(!req.params.file) { res.send('Missing filename.'); }
  var file = req.params.file;
  res.download('pics/high/' + file, function(err){
    if(err) logger.log('error', err);  
  });
});

const loadPhotos = () => {
  logger.info(`loading pics from ${app.locals.webFolder}`);
  var qreaddir = q.denodeify(fs.readdir);
  var qstat = q.denodeify(fs.stat); 
  qreaddir(app.locals.webFolder)
    .then(function(webImages) {
      logger.info(`webImages length: ${webImages.length}`);
      return webImages.forEach(function(image) {

        logger.info(path.join(app.locals.lowFolder, image));
        var item = {};

        item.file = image;
        qstat(path.join(app.locals.lowFolder, image))
          .then(function(stat) {
             item.low = stat.size; 
          })
          .then(function() {

            qstat(path.join(app.locals.highFolder, image))
              .then(function(stat) {
                 item.high = stat.size; 
              });
          }).
          then(function() {
            sizeof(path.join(app.locals.webFolder, image), function(err, dimensions){
              item.height = dimensions.height;  
              item.width = dimensions.width; 
              item.type = dimensions.type; 
            })
          })
          .then(function() {
            //ogger.info(`pushing ${item.file}`)
            pics.push(item);
          })
          .catch(function(err) {
            logger.error(err);
          });
      })
    })
    .catch(function(err) {
      logger.error(err);
    }); 
}



var server = app.listen(2084, function (err, response) {
  if(err) throw err;
  var port = server.address().port;
  logger.info(`Application listening at port ${port}`);
  loadPhotos();
  
});



exports.close = function() {
  server.close();
}

app.use(function(err, req, res, next){
  logger.log('error', err.stack);
  res.status(500).send('Something broke! ' + err.stack );
});