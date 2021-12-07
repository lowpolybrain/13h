const fs = require('fs');
const ejs = require('ejs');

class LazyTemplate {
  constructor(ejsFilename) {
    this.ejsFilename = ejsFilename;
  }
  async getCompiledTemplate(){
    if(this.compiledTemplate){
      return this.compiledTemplate;
    }
    const template = await fs.promises.readFile(this.ejsFilename, 'utf-8');
    this.compiledTemplate = ejs.compile(template);
    return this.compiledTemplate;
  }
  async renderAndWrite(data, fileName){
    const compiledTemplate = await this.getCompiledTemplate();
    const compiledTemplateFileContents = compiledTemplate(data);
    return fs.promises.writeFile(fileName, compiledTemplateFileContents, 'utf-8');
  }
}
module.exports = LazyTemplate;
