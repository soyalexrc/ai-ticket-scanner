import {createSlice} from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit'
import {RootState} from "@/store";
import {Ticket} from "@/utils/interfaces";

// Define a type for the slice state
interface TicketsState {
    errorsQueue: Ticket[];
    pendingQueue: Ticket[];
    successQueue: Ticket[]
}

// Define the initial state using that type
const initialState: TicketsState = {
    errorsQueue: [],
    pendingQueue: [],
    successQueue: []
}

export const ticketsSlice = createSlice({
    name: 'tickets',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        addToQueue: (state, action: PayloadAction<{ ticket: Ticket, type: 'success' | 'error' | 'pending' }>) => {
            const type = action.payload.type;
            if (type === 'success') state.successQueue.push(action.payload.ticket)
            if (type === 'error') state.errorsQueue.push(action.payload.ticket)
            if (type === 'pending') state.pendingQueue.push(action.payload.ticket)
        },
        removeFromQueue: (state, action: PayloadAction<{
            ticketId: string,
            type: 'success' | 'error' | 'pending'
        }>) => {
            const type = action.payload.type;
            if (type === 'success') {
                const ticket = state.successQueue.find(ticket => ticket.id === action.payload.ticketId);
                if (ticket) {
                    const index = state.successQueue.indexOf(ticket);
                    state.successQueue.splice(index, 1)
                }
            }
            if (type === 'error') {
                const ticket = state.errorsQueue.find(ticket => ticket.id === action.payload.ticketId);
                if (ticket) {
                    const index = state.errorsQueue.indexOf(ticket);
                    state.errorsQueue.splice(index, 1)
                }
            }
            if (type === 'pending') {
                const ticket = state.pendingQueue.find(ticket => ticket.id === action.payload.ticketId);
                if (ticket) {
                    const index = state.pendingQueue.indexOf(ticket);
                    state.pendingQueue.splice(index, 1)
                }
            }
        },
    },
})

export const {addToQueue, removeFromQueue} = ticketsSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectPendingTickets = (state: RootState) => state.tickets.pendingQueue;
export const selectErrorTickets = (state: RootState) => state.tickets.errorsQueue;
export const successTickets = (state: RootState) => state.tickets.successQueue;

export default ticketsSlice.reducer
