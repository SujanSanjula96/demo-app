import React, {FunctionComponent, PropsWithChildren, useContext, useState} from "react";

const userContext = React.createContext(null);

interface IUserContextProps {
    user: IUserContext;
}

interface IUserContext {
    scopes: string;
    email: string;
    displayName: string;
}

export function useUser() {
    return useContext(userContext);
}

export const UserProvider : FunctionComponent<PropsWithChildren<IUserContextProps>> = 
    ( props :  PropsWithChildren<IUserContextProps>) => {

    return (
        <userContext.Provider value={props.user} >
            { props.children }
        </userContext.Provider>
    );

}