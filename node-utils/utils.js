const globalConstants = require("./src/constants");
const commandLineLibrary = require("./src/commandline");
const thumbnailGenerator = require("./src/ThumbnailGenerator");


function utils() {
  try {

    console.log("# Running:" + commandLineLibrary.theCommandLine.task);
    
    switch(commandLineLibrary.theCommandLine.task ) {

      case globalConstants.tasknames.make_thumbs : 
        //thumbnailGenerator.init( commandLineLibrary.theCommandLine );
        thumbnailGenerator.run();     
        break; 

      default: 
        let errorStr = "ERROR: The task: \"" + commandLineLibrary.theCommandLine.task + "\" was unknown to this module.";
        throw new Error(errorStr);      
        break;
    }
  } catch (err) {
    console.error("Error running task", err);
    throw err;
  }

}

utils();
