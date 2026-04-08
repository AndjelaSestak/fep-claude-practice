import  Sidebar  from "../components/layout/SideBar";
import NavBarAfterLogin from "../components/layout/NavBarAfterLogin";
import Button from "../components/ui/Button";
import SearchBar from "../components/ui/SearchBar";

const DashboardPage = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <NavBarAfterLogin username="" />
        
        <main className="p-8 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-6 text-[#111827]">Dashboard Page</h1>

          <div className="mb-10">
            <SearchBar placeholder="Search users..." />
          </div>

          <div className="flex flex-wrap gap-4 border-t pt-8">
            <Button>Default</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardPage;