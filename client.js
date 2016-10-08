import {tagged, taggedSum} from 'daggy'
import {Free, Monad, liftF} from 'freeky'

export const FetchQuery = tagged('query')
export const UpdateResults = tagged('updates', 'results')
export const TransformResults = tagged('results')
export const UpdatesSubscription = tagged()

export const fetchQuery = query => 
    liftF(FetchQuery(query))
        .chain(results => liftF(UpdateResults(UpdatesSubscription, results)))
        .chain(results => liftF(TransformResults(results)))


