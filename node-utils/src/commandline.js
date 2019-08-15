const commandLineArgs = require("command-line-args");
const commandLineUsage = require("command-line-usage");

const globalConstants = require("./constants");


class CommandLineLibrary{

        constructor() {
          this.commandLineUsageData = [
            {
              header: "Photo Gallery Utilities",
              content: "generates thumbnails from a folder of images"
            },
            {
              header: "Options",
              optionList: [
                {
                  name: "help",
                  description: "Displays the help message"
                },
                {
                  name: "task",
                  description: globalConstants.getRunnableTaskNames()
                }
              ]
            }
          ];


          this.commandLineArgsDefinition = [
            { name: "help"},
            { name: "user" },
            { name: "password" },
            { name: "host" },
            { name: "port" },
            { name: "db" },
            { name: "task" }
          ];

          this.commandLineArgs = commandLineArgs;
          this.commandLineUsage = commandLineUsage;
          this.theCommandLine = this.commandLineArgs(
            this.commandLineArgsDefinition
          );
  
          if (process.argv.length <= 2 || process.argv[2] === "--help") {
            const usage = this.commandLineUsage(
              this.commandLineUsageData
            );
            console.log(usage);
            process.exit(0);
          } 
        };

        
      
}


module.exports = new CommandLineLibrary();