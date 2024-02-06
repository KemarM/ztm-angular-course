import { of } from "rxjs";
import { reduce, take } from 'rxjs/operators'

//EXAMPLE of using an observable and fetching a REST API endpoint: const observable = from(fetch('https://jsonplaceholder.typicode.com/todos/1'))

/*EXAMPLE of pipable operators, the map() pipe operator
const observable = of(1,2,3,4,5).pipe(
    map((value) => `$${value}`)
)
*/

/*const observable = fromEvent(document, 'keydown').pipe(
    map((event) => {
        return event.code === "Space" ? event.code : null;
    })
    map((event) => event.code),
    filter((code) => code === "Space")
);*/

const observable = interval(500).pipe(
    
    take(),
    reduce(
        (acc, val) => acc + val,
        0
    )
)
//Registering a new observer
const subscription = observable.subscribe({
    next(value) {
        console.log(value)
    },
    complete() {
        console.log('complete')
    }
})

console.log('hello')