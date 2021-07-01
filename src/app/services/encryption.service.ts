import { Injectable } from '@angular/core';
//import { hash, compare } from 'bcrypt';
//const bcrypt = require('bcrypt');
import * as CryptoJS from 'crypto-js';

@Injectable({
    providedIn: 'root'
  })
export class EncryptionService {
    
    private saltOrRounds = 10;
    private keys="Restau$#@$^@1ERF"
    constructor() {}
    
  hash(plain: string): string {
      return this.set(plain, this.keys)
  }

  compare(plain: string, encrypted: string): boolean {
      return this.hash(plain)==encrypted;      
  }
  //The set method is use for encrypt the value.
  set(keys, value){
    var key = CryptoJS.enc.Utf8.parse(keys);
    var iv = CryptoJS.enc.Utf8.parse(keys);
    var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
    {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return encrypted.toString();
  }

  //The get method is use for decrypt the value.
  get(keys, value){
    var key = CryptoJS.enc.Utf8.parse(keys);
    var iv = CryptoJS.enc.Utf8.parse(keys);
    var decrypted = CryptoJS.AES.decrypt(value, key, {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
