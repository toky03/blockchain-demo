import {from, Observable, of} from "rxjs";
import {catchError, map} from "rxjs/operators";

const algorithm: RsaHashedKeyAlgorithm = {
  name: "RSA-OAEP",

  modulusLength: 1024,
  publicExponent: new Uint8Array([1, 0, 1]),
  hash: {name: "SHA-256"},
}

export function sha256(message: string): Observable<string> {
  return hashMessage(message).pipe(map((hashBuffer: ArrayBuffer) => {
    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    // convert bytes to hex string
    return hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
  }))
}

// value between 0 and 1
export function distributeHash(message: string): Observable<number> {
  return hashMessage(message).pipe(map((arrayBuffer: ArrayBuffer) => {
    const sum = Array.from(new Uint8Array(arrayBuffer)).reduce((a, b) => a + b, 0)
    return (sum / (255 * 20))
  }))
}

export function createRsaKeyPair(): Observable<CryptoKeyPair> {
  return from(crypto.subtle.generateKey(algorithm,
      true,
      ["encrypt", "decrypt"]))
}

export function encryptMessage(key: CryptoKey, message: string): Observable<ArrayBuffer> {
  return from(crypto.subtle.encrypt(algorithm, key, encode(message)))
}

export function decryptMessage(key: CryptoKey, message: ArrayBuffer): Observable<string> {
  return from(crypto.subtle.decrypt(algorithm, key, message)).pipe(map(decode), catchError(err => {
    console.error(err);
    return of(err)
  }))
}

function hashMessage(message: string): Observable<ArrayBuffer> {
  return from(crypto.subtle.digest('SHA-1', encode(message)))
}

function encode(message: string): ArrayBuffer {
  return new TextEncoder().encode(message);
}

export function decode(arrayBuffer: ArrayBuffer): string {
  return new TextDecoder().decode(new Uint8Array(arrayBuffer))
}
