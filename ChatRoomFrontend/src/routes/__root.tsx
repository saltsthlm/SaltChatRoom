/* eslint-disable react/react-in-jsx-scope */
import { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRootRouteWithContext, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { GlobalContext } from '../main';
import { useContext } from 'react';

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
    component: RootComponent,
});

function RootComponent() {
    const globalContext = useContext(GlobalContext);
    const signedIn = !!globalContext.signedInAs;

    return (
        <>
            <div className="p-2 flex gap-2 text-lg">
                <Link
                    to={'/login'}
                    activeProps={{
                        className: 'font-bold',
                    }}
                    disabled={signedIn}>
                    Login
                </Link>

                <Link
                    to="/createAccount"
                    activeProps={{
                        className: 'font-bold',
                    }}
                    disabled={signedIn} >
                    Create Account
                </Link>

                <Link
                    to="/spaces"
                    search={{ user: "anonymous" }}
                    activeProps={{
                        className: 'font-bold',
                    }} >
                    Spaces
                </Link>
            </div >
            <hr />
            <Outlet />
            <ReactQueryDevtools buttonPosition="top-right" />
            <TanStackRouterDevtools position="bottom-right" />
        </>
    )
}
