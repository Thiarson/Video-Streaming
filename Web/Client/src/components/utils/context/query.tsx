import { PropsWithChildren } from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import { ReactQueryDevtools } from "react-query/devtools"
import type { FC } from "react"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false }
  }
})

const QueryProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false}/>
    </QueryClientProvider>
  )
}

export { QueryProvider }
