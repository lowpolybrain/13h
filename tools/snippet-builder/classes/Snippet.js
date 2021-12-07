const path = require('path');

class Snippet {
  constructor(fullFileName) {
    this.fullFileName = fullFileName;
    this.fileNameWithoutExtension = path.basename(fullFileName, '.ts');
  }
  get data(){
    return {
      name: this.fileNameWithoutExtension,
      fileName: this.fileNameWithoutExtension,
      sourceFileName: this.fullFileName
    }
  }
}

module.exports = Snippet;
