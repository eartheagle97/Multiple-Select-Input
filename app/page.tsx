import AutocompleteForm from "./container/AutocompleteForm";
import { initialData } from "./data/data";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="container mx-auto px-12 mt-12">
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">
          Pick Users
        </h1>
        <AutocompleteForm items={initialData} />
      </div>
    </main>
  );
}
