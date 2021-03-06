import {tagged, taggedSum} from 'daggy'
import {Free, Monad, liftF, dispatch} from 'freeky'
import {lift} from 'ramda'
import Task from 'data.task'
const interpret = dispatch.dispatch

const Val = tagged('a')
const Add = tagged('x','y')

const runApp = interpret([
                          [Val, m => new Task((_,resolve)=> { 
                              setTimeout(_=>resolve(m.a), 100) 
                              setTimeout(_=>resolve(m.a+42), 400) 
                          })],
                          [Add, m => Task.of(m.x + m.y)]
                        ])

//run the app
export const run = app => app.foldMap(runApp, Task.of).fork(console.error, console.log)

//app
const addWithLift = (x,y) => {
    
    const X = liftF(Val(x))
    const Y = liftF(Val(y))
    return lift((x,y)=>Add(x,y))(X,Y).chain(liftF)
}
const addWithDo = (x,y) => {
    const X = liftF(Val(x))
    const Y = liftF(Val(y))
    return Monad.do(function *(){
        const x = yield X
        const y = yield Y
        return liftF(Add(x,y))
    })

}

run(addWithLift(1,2))

