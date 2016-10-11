//App
import {fetchQuery, subscribeUpdates} from '../client.js'
import {run} from './interpreter-example.js'
import {lift} from 'ramda'

//pure program 
const Friends = fetchQuery({type: 'Person'}).map(results => `
<ul>
    ${results.map(({email, name}) =>`
        <li><a href="mailto:${email}">${name}</a></li>
    `).join(' ')}
</ul>`)

const Posts = fetchQuery({type: 'Post'}).map(results => {
   return `<div>
    <textarea id="status-update">What's your status?</textarea>
    ${results.map((result) => `
        <div class="post">
            <h4>${result.author.name}</h4>
            <p>${result.content}</p>
        </div>
    `).join(' ')}
    </div>
`})

const friendFeed = lift((friends, posts)=>`
<div>
       <h1>FriendFace</h1> 
    <section id="friend-list">
        <h2>Your Friends</h2>
        ${friends}
    </section>
    <section id="activity-feed">
        ${posts}
    </section>
</div>
`)(Friends, Posts)

run(friendFeed)
