import { useReducer, useState } from "react";
import { Game } from "../../../game/game";

// const initState:Omit<Game , "update"|"render"> = {allFrozen:[] , currentTetrisElement:null , lastUpdated:Infinity , tetrisScale:[]}

// export default function useMyFirstHook ({initState}:{initState:Omit<Game , "update"|"render"|"freeze">}) {

//     const [state , stateDispatch] = useReducer((state:Omit<Game , "update"|"render">) => state , initState) ;

//     return {
//         state , stateDispatch
//     }
// }

export {};
