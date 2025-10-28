/**
 * <SuspenseQuery/> serves to make `useSuspenseQuery` easier to use in tsx.
 * works with react and solidjs
 $
 * @example
 * ```tsx
 * import { SuspenseQuery } from '~/components/shared/SuspenseQuery'
 *
 * // You can use queryOptions as props.
 * <SuspenseQuery {...queryOptions()}>
 *   {({ data }) => { return <> </> }}
 * </SuspenseQuery>
 */
export const SuspenseQuery = <
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(props: {
  options: UseSuspenseQueryOptions<TQueryFnData, TError, TData, TQueryKey>;
  children: (queryResult: UseSuspenseQueryResult<TData, TError>) => ReactNode;
}) => <>{props.children(useSuspenseQuery(props.options))}</>;