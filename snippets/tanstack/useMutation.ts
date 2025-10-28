useMutation({
  mutationFn: updateTodo,
  onMutate: async (newTodo, context) => {
    await context.client.cancelQueries({ queryKey: ["todos"] });
    const previousTodos = context.client.getQueryData(["todos"]);
    context.client.setQueryData(["todos"], (old) => [...old, newTodo]);

    return { previousTodos };
  },
  onError: (err, newTodo, onMutateResult, context) => {
    context.client.setQueryData(["todos"], onMutateResult.previousTodos);
  },
  onSettled: (data, error, variables, onMutateResult, context) => {
    context.client.invalidateQueries({ queryKey: ["todos"] });
  },
});
