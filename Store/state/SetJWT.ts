import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface JwtState {
  token: string;
}

const initialState:JwtState = {
    token: ''
}
export const setJwt = createSlice({
    name: "setJwt",
    initialState: initialState,
    reducers: {
        setJwtToken: (state, action: PayloadAction<string>) =>{
            state.token = action.payload;
            if(state.token) {
                localStorage.setItem("jwt", state.token);
            }
        },
        clearJwtToken: (state) => {
            state.token = '';
            localStorage.removeItem("jwt");
        }
    }
    
})


export const { setJwtToken, clearJwtToken } = setJwt.actions;

export default setJwt.reducer;