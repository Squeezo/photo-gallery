
module.exports = new class ConstantsGlobal {
    
  constructor() {
    this.tasknames = {
      make_thumbs: "make_thumbs"
    };
  }


  getRunnableTaskNames() {
    return "Name of the task to run (" + this.tasknames.make_thumbs + ", " + 
    				this.tasknames.make_thumbs + " )";
  }
}();