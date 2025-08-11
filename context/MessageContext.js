import { createContext, useContext } from "react"

export const MessageContext = createContext(null)
export const useGlobalMessage = () => useContext(MessageContext)
