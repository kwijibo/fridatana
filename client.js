import {tagged, taggedSum} from 'daggy'
import {Free, Monad, liftF} from 'freeky'
import {lift} from 'ramda'
export const FetchQuery = tagged('query')
export const UpdateResults = tagged('update', 'results')
export const UpdateStream = tagged('x')
export const TransformResults = tagged('results')

const unwrappedresult = { list: [], index: {keith: { name: "K", email: "k@k.com"}}}

export const fetchQuery = query => {
    const Results = liftF(FetchQuery(query))
    const Updates = subscribeUpdates()
    const UpdatedResults = Monad.do(function *(){
        const update = yield Updates
        const results = yield Results
        return updateResults(update, results)
    })
    return UpdatedResults.chain(results => liftF(TransformResults(results)))
}

export const updateResults = (update, results) => liftF(UpdateResults(update, results))

export const subscribeUpdates = () => liftF(UpdateStream('subscription'))


