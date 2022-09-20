function MenuItem(itemID: string){
    return (target: Function) => {
       target.prototype.id = 'abc'; 
    }
}

@MenuItem('abc')
class Pizza {
    id: string;
}

@MenuItem('xyz')
class Hamburger {
    id: string;
}

console.log(new Pizza().id);