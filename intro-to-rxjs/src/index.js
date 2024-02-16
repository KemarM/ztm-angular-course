import { fromEvent, interval } from "rxjs";
import { map, mergeMap, switchMap, concatMap, exhaustMap, take, tap } from 'rxjs/operators'
import { ajax } from 'rxjs/ajax'

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

// Use tap() operator to check the values passed through observables, use take() to limit the observable's values to a maximum number, 
//in this case only 5 values will be processed
/*const observable = interval(500).pipe(
    take(5),
    tap({
        next(val){
            console.log(val)
        }
    }),
    reduce(
        (acc, val) => acc + val,
        0
    )
)*/

const button = document.querySelector('#btn')
const observable = fromEvent(
    button, 'click'
).pipe(
    /*mergeMap(() => { //mergMap() operator subscribes to the observable from within the pipe
        /*return ajax.getJSON(
            'https://jsonplaceholder.typicode.com/todos/1'
            )*/
       /* return interval(1000).pipe(
            tap(console.log)
            //take(5)  -  the interval() is also an observable, it's an inner observable that we can also use the take() operator 
            //to complete just the inner observable and keep the outter observalble running
        )
    }),
    //take(5) - stops the outer observable */
    /*switchMap(() => { //switchMap() operator subscribes to the observable from within the pipe and ensures only one request will be processed at a time, 
                        //this would help with slow data connections like 3G
        return ajax.getJSON(
            'https://jsonplaceholder.typicode.com/todos/1'
            ).pipe(
            take(5),
            tap({
                complete() {
                    console.log('inner observable completed')
                }
            }) 
        )
    }),*/
    /*concatMap(() => { //concatMap() operator ensures the exisitng operator completes before processing another one, FIFO basically, could handle if a user clicks the button multiple times
                        //but this can cause a traffic jam of operators, slowing down the application
        return ajax.getJSON(
            'https://jsonplaceholder.typicode.com/todos/1'
            ).pipe(
            take(5),
            tap({
                complete() {
                    console.log('inner observable completed')
                }
            }) 
        )
    }),*/
    exhaustMap(() => { //exhaustMap() operator can be used if you want to process a form and ignore other oservables until the current observable completes.
        return ajax.getJSON(
            'https://jsonplaceholder.typicode.com/todos/1'
            ).pipe(
            take(5),
            tap({
                complete() {
                    console.log('inner observable completed')
                }
            }) 
        )
    }),
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

/*
ANALOGY (Retaurant Orders) for the Flattening operators for subscribing to inner observables:

switchMap() - Stop working on the current order and start working on the new order. Only the latest order will be finished.

concatMap() - The order gets added to a queue. You finish whatever order you're working on. Once you finish the order, you wil work on the next order.

mergeMap() - You will work on all orders at the same time as soon as you're given them.

exhaustMap() - You ignore new orders and finish whatever order you'e currently working on. Once finished, you are free to accept new orders.
*/