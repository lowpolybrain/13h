export class Lazy<VT> {
  private _storedValue?: VT;
  constructor(private generator: (l: Lazy<VT>) => VT) {}
  get value(): VT{
    if(!this._storedValue){
      this._storedValue = this.generator(this);
    }
    return this._storedValue;
  }
  reset(){
    this._storedValue = undefined;
  }
}
