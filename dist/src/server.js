"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const myVariable = 'hello world';
function myFunction(arg1, arg2) {
    console.log(arg1);
    return arg2; // This should trigger a 'no-unused-vars' ESLint error
}
myFunction('hello', 42);
