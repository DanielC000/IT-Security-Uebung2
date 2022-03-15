import {Injectable} from '@angular/core';

@Injectable()
export class NativeObjectService {
  public getNativeWindow(): Window {
    return window;
  }

  public getNativeDocument(): Document {
    return document;
  }
}
