// // 1
// const getFirstElement = <T>(array: T[]): T => {
//   return array[0]
// }
//
// // // Пример 1: Массив чисел
// // const numbers = [1, 2, 3, 4, 5]
// // console.log(getFirstElement(numbers)) // 1
//
// // // Пример 2: Массив строк
// // const words = ['hello', 'world', 'typescript']
// // console.log(getFirstElement(words)) // 'hello'

// // 2
// const filterArray = <T>(array: T[], predicate: (value:T) => boolean): T[] => {
//   return array.filter(predicate)
// }
//
// // // Пример 1: Фильтрация чисел
// // const numbers = [1, 2, 3, 4, 5]
// // const isEven = (num: number) => num % 2 === 0
// //
// // console.log(filterArray(numbers, isEven)) // [2, 4]
//
// // // Пример 2: Фильтрация строк
// // const words = ['hello', 'world', 'typescript']
// // const startsWithT = (word: string) => word.startsWith('t')
// //
// // console.log(filterArray(words, startsWithT)) // ["typescript"]

// // 3
//
// const mapArray = <T,D>(array: T[], transform: (value: T) => D):D[] => {
//   return array.map(transform)
// }
//
// // // Пример 1: Преобразование чисел в строки
// // const numbers = [1, 2, 3, 4]
// // const transformNumberToString = (num: number) => `Number: ${num}`
// //
// // console.log(mapArray(numbers, transformNumberToString)) // ["Number: 1", "Number: 2", "Number: 3", "Number: 4"]
//
// // // Пример 2: Преобразование строк в их длины
// // const words = ['hello', 'world', 'typescript']
// // const getLength = (word: string) => word.length
// //
// // console.log(mapArray(words, getLength)) // [5, 5, 10]
//
// // // Пример 3: Преобразование объектов в строки
// // type Person = { name: string; age: number }
// // const people: Person[] = [
// //   { name: 'Agnes', age: 25 },
// //   { name: 'Robert', age: 30 },
// // ]
// // const toDescription = (person: Person) => `${person.name} is ${person.age} years old`
// //
// // console.log(mapArray(people, toDescription)) // ["Agnes is 25 years old", "Robert is 30 years old"]


// // Homework
// const updateArray = <T>(array: T[], value: T): T[] => {
//
//   return array.includes(value)? array : [...array, value]
//
// }
//
// // const transform = (value: string) => num % 2 === 0
//
// // Строки
// const stringArray = ["apple", "banana", "cherry"]
// console.log(updateArray(stringArray, "banana")) // ['apple', 'banana', 'cherry']
// console.log(updateArray(stringArray, "strawberry")) // ['apple', 'banana', 'cherry', 'strawberry']
//
// // Числа
// const numberArray = [1, 2, 3]
// console.log(updateArray(numberArray, 2)) // [1, 2, 3]
// console.log(updateArray(numberArray, 4)) // [1, 2, 3, 4]