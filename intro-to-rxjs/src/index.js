import { of } from "rxjs";

const observable = of(1,2,3,4,5)

const subscription = observable.subscribe( //Registering a new observer
    console.log    
)

console.log('hello')