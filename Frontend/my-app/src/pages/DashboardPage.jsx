import Button from "../components/ui/Button";
import SearchBar from "../components/ui/SearchBar";

const DashboardPage = () => {
  return (
    <div className="p-8 font-sans">
      <h1 className="text-2xl font-bold mb-6 text-[#111827]">Dashboard Page</h1>

      {/* --- Visual Search Bar Test --- */}
      <div className="mb-10">
        <SearchBar placeholder="Search users..." />
      </div>

      {/* --- Buttons --- */}
      <div className="flex flex-wrap gap-4 border-t pt-8">
        <Button>Default</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="link">Link</Button>
      </div>
    </div>
  );
};

export default DashboardPage;