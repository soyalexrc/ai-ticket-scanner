import { configureStore } from '@reduxjs/toolkit'
import ticketsReducer from './features/tickets/ticketsSlice';
import networkReducer from './features/network/networkSlice';

export const store = configureStore({
    reducer: {
        tickets: ticketsReducer,
        network: networkReducer
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
