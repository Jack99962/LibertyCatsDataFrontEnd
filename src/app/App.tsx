import { RouterProvider } from 'react-router';
import { router } from './routes';
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

// Create a client
const queryClient = new QueryClient()
export default function App() {
  return <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />;
  </QueryClientProvider>
}