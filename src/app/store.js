import { configureStore } from '@reduxjs/toolkit'
import counterR from '../features/counter/counterSlice'

export default configureStore({
  reducer: {
    counter: counterReducer
  }
})