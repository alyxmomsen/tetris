import { createSlice } from "@reduxjs/toolkit";

const myCanvasSlice = createSlice({
  name: "myCanvas",
  initialState: 0,
  reducers: {
    incremented: (state) => {
      state++;
    },
    decremented: (state) => {
      state--;
    },
  },
});

export const { incremented, decremented } = myCanvasSlice.actions;

export default myCanvasSlice.reducer;
