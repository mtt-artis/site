import { LabeledText } from "~/components/base/LabeledText";
import { Table } from "~/components/base/Table";

const SkeletonText = () => <div class="h-3.5 bg-gray-200 dark:bg-gray-700 my-1" />;

export const SkeletonTable = () => (
  <Table
    class="ui-card p-0"
    data={[{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }]}
    headers={[{ key: "id", header: <SkeletonText />, cell: SkeletonText }]}
  />
);

export const SkeletonCard = () => (
  <div class="ui-card grid gap-2 p-2 animate-pulse">
    <div class="w-full flex gap-2 p-1 relative">
      <div class="w-full grid gap-4 grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] xl:grid-cols-[repeat(4,10rem)_1fr_repeat(2,10rem)_4rem]">
        <LabeledText label={<SkeletonText />}>
          <SkeletonText />
        </LabeledText>
        <LabeledText label={<SkeletonText />}>
          <SkeletonText />
        </LabeledText>
        <LabeledText label={<SkeletonText />}>
          <SkeletonText />
        </LabeledText>
        <LabeledText label={<SkeletonText />} class="col-span-2">
          <SkeletonText />
        </LabeledText>
        <LabeledText label={<SkeletonText />}>
          <SkeletonText />
        </LabeledText>
        <LabeledText label={<SkeletonText />}>
          <SkeletonText />
        </LabeledText>
        <LabeledText label={<SkeletonText />}>
          <SkeletonText />
        </LabeledText>
      </div>
    </div>

    <SkeletonTable />
  </div>
);
