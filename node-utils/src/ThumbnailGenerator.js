const im = require('imagemagick');
const fs = require("fs");
const path = "../pics/low/";
 

class ThumbnailGenerator {

  run() {

    fs.readdir(path, function (err, files) {
      if (err) {
        throw err;
      }
      
      if(!files.length) {
        console.log('no files found');
      } else {
        console.log('looping')
        files.forEach(file => {

          im.identify(path+file, function(err, features){
            console.log(`filename is ${path+file}`);
            console.log(`w: ${features.height}, h: ${features.width}`);
            if (err) throw err;

            let orientation = "portrait";  
            let w = "600";
            let h = "800";
            
            if (features.height < features.width) {
               console.log(`found a landscape: ${file}`);
               orientation = "landscape";
               w = "800";
               h = "600";
            }
            
            im.resize({
              srcData: fs.readFileSync(path+file, 'binary'),
              dstPath: '../pics/web/' + file,
              width:   w,
              height:  h
            }, function(err, stdout, stderr){
              if (err) throw err;
              console.log('resized ' + file + ' to h: ' + h + ' w: '+ w);
            });


          });

        })

      }

        
    });


  };

};

module.exports = new ThumbnailGenerator();