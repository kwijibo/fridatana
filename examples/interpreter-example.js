import {fetchQuery, FetchQuery, UpdateResults, UpdateStream, TransformResults} from '../client.js'

//Test Interpreter
import Task from 'data.task'
import {dispatch} from 'freeky'
const interpret = dispatch.dispatch

// canned results for testing
const results = {list: ['joe', 'simon'], index: {
    'joe': { name: 'Joe', email: 'joe@gmail.com', friend: 'donna'},
    'simon': { name: 'Simon', email: 'simon@hotmail.com'},
    'donna': { name: 'Donna', email: 'donna@yahoo.com'},
}}
const update1 = {set: {joe:{name: "Joe Bloggs"}}}
const update2 = {set: {joe:{email: "joe@example.org"}}}

//transformers
const fetchToTask = m => Task.of(results)
const updateSubscription = m => new Task((_,resolve)=>{ 
    setTimeout(()=>resolve(update1), 1000) 
    setTimeout(()=>resolve(update2), 2000) 
})
const updaterToTask = m => { 
   console.log('[updatedToTask]', m)
   return Task.of(m.results)
}
const transformToTask = m => {
    console.log('[transformToTask]', {m, results: m.results, update: m.update})
    return Task.of(
        m.results.list.map(id => m.results.index[id])
                  .map(r => {
                    if(r.friend) r.friend = m.results.index[r.friend]
                    return r
                  })
    )
}


const runApp = interpret([
                          [FetchQuery, fetchToTask],
                          [UpdateStream, updateSubscription],
                          [UpdateResults, updaterToTask],
                          [TransformResults, transformToTask]
                        ])

//run the app
export const run = app => app.foldMap(runApp, Task.of).fork(console.error, console.log)
