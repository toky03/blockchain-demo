import {from, Observable} from "rxjs";
import {map} from "rxjs/operators";


export function sha256(message: string): Observable<string> {
  // encode as UTF-8
  const msgBuffer = new TextEncoder().encode(message);

  // hash the message
  const hashBufferObservable = from(crypto.subtle.digest('SHA-1', msgBuffer));

  return hashBufferObservable.pipe(map((hashBuffer: ArrayBuffer) => {
    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    // convert bytes to hex string
    return hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
  }))

}
