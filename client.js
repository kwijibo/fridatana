import {tagged, taggedSum} from 'daggy'
import {Free, Monad, liftF} from 'freeky'
import {lift} from 'ramda'
export const FetchQuery = tagged('query')
export const UpdateResults = tagged('update', 'results')
export const UpdateStream = tagged('x')
export const TransformResults = tagged('results')

export const fetchQuery = query => {
    const Results = liftF(FetchQuery(query))
    const Updates = subscribeUpdates()
    const UpdatedResults = lift((update, results)=>UpdateResults(update,results))(Updates, Results)
    return UpdatedResults
            .chain(liftF) //we have to lift the resulting type into a free monad - surely it should be already?
            .chain(results => liftF(TransformResults(results)))
}

export const updateResults = (update, results) => liftF(UpdateResults(update, results))

export const subscribeUpdates = () => liftF(UpdateStream('subscription'))


