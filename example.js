//App
import {fetchQuery, FetchQuery, UpdateResults, TransformResults} from './client.js'

const myApp = fetchQuery({type: 'Person'}).map(results => `<ul>
    ${results.map(({email, name}) =>
        `<li><a href="mailto:${email}">${name}</a></li>`)}
</ul><script>${JSON.stringify(results)}</script>`)

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

//transformers
const fetchToTask = m => Task.of(results)
const updaterToTask = m => Task.of(m.results)
const transformToTask = m => Task.of(
    m.results.list.map(id => m.results.index[id])
                  .map(r => {
                    if(r.friend) r.friend = m.results.index[r.friend]
                    return r
                  })
)



const runApp = interpret([ [FetchQuery, fetchToTask],
                          [UpdateResults, updaterToTask],
                          [TransformResults, transformToTask]
                        ])

//run the app
myApp.foldMap(runApp, Task.of).fork(console.error, console.log)



