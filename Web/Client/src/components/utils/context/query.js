import { QueryClient, QueryClientProvider } from "react-query"
import { ReactQueryDevtools } from "react-query/devtools"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0, // Firefox Ubuntu
    }
  }
})

function QueryProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false}/>
    </QueryClientProvider>
  )
}

export { QueryProvider }
