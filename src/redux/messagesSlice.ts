
import { Message } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type MessagesState = {
    messages: Message[];
};

const initialState: MessagesState = {
    messages: [],
};

const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        setMessagesAction: (state, action: PayloadAction<Message[]>) => {
            state.messages = action.payload;
        },
        addMessageAction: (state, action: PayloadAction<Message>) => {
            if (!state.messages.some((msg) => msg.id === action.payload.id)) {
                state.messages.push(action.payload);
            }
        },
        updateMessageAction: (state, action: PayloadAction<Message>) => {
            const index = state.messages.findIndex(
                (message) => message.id === action.payload.id
            );
            if (index !== -1) {
                state.messages[index] = action.payload;
            }
        },
        deleteMessageAction: (state, action: PayloadAction<number | string>) => {
            state.messages = state.messages.filter(
                (message) => message.id !== action.payload
            );
        },
    },
});

export const { setMessagesAction, addMessageAction, updateMessageAction, deleteMessageAction } =
    messagesSlice.actions;

export default messagesSlice.reducer;
