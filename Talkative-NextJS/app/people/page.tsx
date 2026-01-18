import BackArrow from "@/components/BackArrow";
import PeopleList from "./PeopleList";

function People() {
  return (
    <div className="min-h-screen text-white bg-neutral-800 flex flex-col gap-7 p-10">
      <div className="flex gap-5">
        <BackArrow/>
        <h1 className="text-2xl font-semibold">Find out more people</h1>
      </div>
      <div className="">
        <PeopleList/>
      </div>
    </div>
  );
}

export default People;
