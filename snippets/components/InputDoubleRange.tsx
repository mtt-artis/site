export const InputDoubleRange = (props: {
  min: number;
  max: number;
  inputA: {
    value: number;
    name: string;
    id: string;
  };
  inputB: {
    value: number;
    name: string;
    id: string;
  };
}) => {
  return (
    <div
      class="gri grid-cols-2"
      role="group"
      style={`
        --${props.inputA.name}: ${props.inputA.value};
        --${props.inputB.name}: ${props.inputB.value};
        --min: ${props.min};
        --max: ${props.max};`
      }
      onInput={(e) => {
        const t = e.target;
        if (t instanceof HTMLInputElement)
          e.currentTarget.style.setProperty(`--${t.name}`, t.value)
      }}
    >
      <label class="sr-only" for={props.inputA.id}>{props.inputA.name}</label>
      <input
        id={props.inputA.id}
        type="range"
        min={props.min}
        value={props.inputA.value}
        max={props.max}
        class="col-span-2 grid-row-2 bg-transparent pointer-events-none"
      />
      <output for={props.inputA.id} style="--c: var(--a)" class="grid-row-1"/>
      <label class="sr-only" for={props.inputB.id}>{props.inputB.name}</label>
      <input
        id={props.inputB.id}
        type="range"
        min={props.min}
        value={props.inputB.value}
        max={props.max}
        class="col-span-2 grid-row-2 bg-transparent pointer-events-none"
      />
      <output for={props.inputB.id} style="--c: var(--b)" class="grid-row-1 text" />
    </div>
  )
}
