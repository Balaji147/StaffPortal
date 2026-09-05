import { createContext, useReducer } from "react";

export const UserInfoContext = createContext({
    userInfo:{},
    setUserInfo:()=>{},
    // loading:false,
    // setLoading:()=>{},
    // error:null,
    // setError:()=>{}
})

const INIT_VALUES = {userInfo:{}}

const userReducer = (state, action)=>{
    const {type, payload} = action

    switch(type){
        case "SET_USER_INFO":
            return {...state,  userInfo:payload === null?null:{...state.userInfo, ...payload}}
        // case "SET_LOADING":
        //     return {...state, payload}
        // case "SET_ERROR":
        //     return {...state, loading:false, userInfo:null, error:{...payload}}
        default:
            return state
    }
}

export const UserInfoProvider = ({children})=>{
    const [state, dispatch] = useReducer(userReducer, INIT_VALUES)

    const setUserInfo = (payload)=>{
        dispatch({
            type:"SET_USER_INFO",
            payload
        })
    }

    // const setLoading = (payload)=>{
    //     dispatch({
    //         type:"SET_LOADING",
    //         payload
    //     })
    // }

    // const setError = (payload)=>{
    //     dispatch({
    //         type:"SET_ERROR",
    //         payload
    //     })
    // }

    return(
        <UserInfoContext.Provider value={{...state, setUserInfo}}>
            {children}
        </UserInfoContext.Provider>
    )
}