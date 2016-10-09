//App
import {fetchQuery, subscribeUpdates} from '../client.js'
import {run} from './interpreter-example.js'

//pure program 
const fetchApp = fetchQuery({type: 'Person'}).map(results => `<ul>
    ${results.map(({email, name}) =>
        `<li><a href="mailto:${email}">${name}</a></li>`)}
</ul><script>${JSON.stringify(results)}</script>`)


run(fetchApp)
