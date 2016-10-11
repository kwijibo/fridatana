import {fetchQuery, FetchQuery, UpdateResults, UpdateStream, TransformResults} from '../client.js'

//Test Interpreter
import Task from 'data.task'
import {dispatch} from 'freeky'
const interpret = dispatch.dispatch

// canned results for testing
const people_results = {list: ['joe', 'simon'], index: {
    'joe': { name: 'Joe', email: 'joe@gmail.com', friend: 'donna'},
    'simon': { name: 'Simon', email: 'simon@hotmail.com'},
    'donna': { name: 'Donna', email: 'donna@yahoo.com'},
}}
const posts_results = {
    list: [1,2,3],
    index: {
          1: { author: 'joe', content: `You won't believe what Bungle from Rainbow looks like now` }
        , 2: { author: 'donna', content: `Say goodbye to herpes with this one weird old trick`}
        , 3: { author: 'donna', content: `Most people won't share or like this but....`}
        , 'joe': { name: 'Joe' }
        , 'donna': { name: 'Donna' }
    }
}
const results = {
    Person: people_results,
    Post: posts_results 
}
const update1 = {s: "joe", p: "name", o:"Joe Bloggs"}
const update2 = {s: "joe", p: "email", o:"joe@example.info"}

//transformers
const fetchToTask = m => Task.of(JSON.parse(JSON.stringify(results[m.query.type])))
const updateSubscription = m => new Task((_,resolve)=>{ 
    resolve({})
    setTimeout(()=>resolve(update1), 1000) 
    setTimeout(()=>resolve(update2), 3000) 
})
const updaterToTask = ({update, results}) => { 
   const {s,p,o} = update
   if(s) results.index[s][p] = o
   return Task.of(results)
}
const transformToTask = x => {
    const m = Object.create(x)
    return Task.of(
        m.results.list.map(id => m.results.index[id])
                  .map(r => {
                    if(r.friend) r.friend = m.results.index[r.friend]
                    if(r.author) r.author = m.results.index[r.author]
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
