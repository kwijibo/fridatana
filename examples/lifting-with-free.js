import {tagged, taggedSum} from 'daggy'
import {Free, Monad, liftF, dispatch} from 'freeky'
import {lift} from 'ramda'
import Task from 'data.task'
const interpret = dispatch.dispatch

const Val = tagged('a')
const Add = tagged('x','y')

const runApp = interpret([
                          [Val, m => Task.of(m.a)],
                          [Add, m => Task.of(m.x + m.y)]
                        ])

//run the app
export const run = app => app.foldMap(runApp, Task.of).fork(console.error, console.log)

//app
const add = (x,y) => {
    const X = liftF(Val(x))
    const Y = liftF(Val(y))
    return lift((x,y) => liftF(Add(x,y)))(X, Y)
}

run(add(1,2))

