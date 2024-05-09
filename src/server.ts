// src/app.ts
const myVariable = 'hello world';



function myFunction(arg1: string, arg2: number) {
  console.log(arg1);
  return arg27; // This should trigger a 'no-unused-vars' ESLint error
}







myFunction('hello', 42);