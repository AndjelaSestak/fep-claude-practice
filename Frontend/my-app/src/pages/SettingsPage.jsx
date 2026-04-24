import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import  Sidebar  from "../components/layout/SideBar";
import NavBarAfterLogin from "../components/layout/NavBarAfterLogin";
import FormWrapper from "../components/ui/FormWrapper";
import FormField from "../components/ui/FormField";
import Input from "../components/ui/InputField";
import Button from "../components/ui/Button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/AlertDialog";
import { Trash2 } from "lucide-react";
import { updateCurrentUser, changePassword, deleteUser } from "../services/userService";

const SettingsPage = () => {
    const navigate = useNavigate();
    const [updateData, setUpdateData] = useState({
      name: "",
      city: "",
      address: "",
      date_of_birth: "",
    });
    const [passwordData, setPasswordData] = useState({
      current_password: "",
      new_password: "",
      confirm_new_password: "",
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [alert, setAlert] = useState(null);
    const { user, refreshUser } = useAuth();

    useEffect(() => {
      if (user) {
        setUpdateData({
          name: user.name || "",
          email: user.email || "",
          city: user.city || "",
          address: user.address || "",
          date_of_birth: user.date_of_birth || "",
        });
      }
    }, [user]);

    const handleChange = (setter) => (event) => {
      const { name, value } = event.target;

      setter((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    const handleUpdateSubmit = async (event) => {
      event.preventDefault();
      setIsSaving(true);

      try {
        await updateCurrentUser(updateData);
        await refreshUser();
        setAlert({
          title: "Profile updated",
          description: "Your personal details have been saved successfully.",
        });
      } catch (err) {
        setAlert({
          title: "Update failed",
          description: err.response?.data?.detail || "Failed to update profile.",
        });
      } finally {
        setIsSaving(false);
      }
    };

    const handlePasswordSubmit = async (event) => {
      event.preventDefault();
      setIsSaving(true);

      try {
        await changePassword(passwordData);
        setAlert({
          title: "Password updated",
          description: "Your password has been updated successfully.",
        });
      } catch (err) {
        setAlert({
          title: "Update failed",
          description: err.response?.data?.detail || "Failed to update password.",
        });
      } finally {
        setIsSaving(false);
      }
    };

    const handleDeleteAccount = async () => {
      setIsSaving(true);
      
      try {
        await deleteUser();
        setAlert({
          title: "Account deleted",
          description: "Your account has been deleted successfully.",
        });
        navigate("/");
        
      } catch (err) {
        setAlert({
          title: "Deletion failed",
          description: err.response?.data?.detail || "Failed to delete account.",
        });
      } finally {
        setIsSaving(false);
      }
    }


    return (
        <div className="flex h-screen">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-auto">
        <NavBarAfterLogin username="" />
        
        <div className="flex-1 bg-slate-50 flex flex-col px-8 pt-12 gap-8">
          
          
              
              {/* ZELENI HERO PANEL ZA PROFILE SETTINGS */}
              <header className="relative bg-primary/10 p-8 rounded-[2.5rem] border border-primary/20 flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
                {/* Prepoznatljivi dekorativni krugovi */}
                <div className="absolute -left-4 -top-4 w-32 h-32 bg-primary/15 rounded-full blur-3xl"></div>
                <div className="absolute right-10 bottom-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-2 w-10 bg-primary rounded-full shadow-[0_0_12px_rgba(34,197,94,0.6)]"></div>
                    <span className="text-[11px] font-black text-primary-dark uppercase tracking-[0.2em]">Account Info</span>
                  </div>
                  
                  <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-1">
                    Profile Settings
                  </h1>
                  
                  <p className="text-gray-700 font-semibold opacity-80">
                    Manage your account information and preferences.
                  </p>
                </div>

                {/* Opciono: Možeš dodati neku ikonicu profila ovde desno ako želiš */}
                <div className="relative z-10 hidden md:block opacity-20">
                  <svg className="w-20 h-20 text-primary-dark" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              </header>
            

          <FormWrapper className="max-w-none">

            <div className="flex items-start gap-4 mb-6">
              <div>
                <h3 className="text-lg font-semibold">
                  Profile Information
                </h3>
                <p className="text-sm text-gray-500">
                  Update your personal details
                </p>
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleUpdateSubmit}>
              <FormField label="Full Name" required>
                <Input
                  name="name"
                  value={updateData.name}
                  onChange={handleChange(setUpdateData)}
                  placeholder="John Doe"
                  className="w-full"
                />
              </FormField>

              <FormField label="Email" required>
                <Input
                  name="email"
                  value={updateData.email}
                  onChange={handleChange(setUpdateData)}
                  placeholder="john.doe@example.com"
                  className="w-full"
                  disabled
                />
              </FormField>
              
              <FormField label="City">
                <Input
                  name="city"
                  type="text"
                  value={updateData.city}
                  onChange={handleChange(setUpdateData)}
                  placeholder="Beograd"
                  className="w-full"
                />
              </FormField>

              <FormField label="Address">
                <Input
                  name="address"
                  type="text"
                  value={updateData.address}
                  onChange={handleChange(setUpdateData)}
                  placeholder="Knez Mihaila 123"
                  className="w-full"
                />
              </FormField>

              <FormField label="Date of Birth">
                <Input
                  name="date_of_birth"
                  type="date"
                  value={updateData.date_of_birth}
                  onChange={handleChange(setUpdateData)}
                  className="w-full"
                />
              </FormField>

              <div className="flex justify-end">
                <Button type="submit" size="sm" variant="default" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </form>
          </FormWrapper>

          <FormWrapper className="max-w-none">

            <div className="flex items-start gap-4 mb-6">
              <div>
                <h3 className="text-lg font-semibold">
                  Password Management
                </h3>
                <p className="text-sm text-gray-500">
                  Update your password
                </p>
              </div>
            </div>

            <form className="space-y-6" onSubmit={handlePasswordSubmit}>
              <FormField label="Current Password" required>
                <Input
                  name="current_password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordData.current_password}
                  onChange={handleChange(setPasswordData)}
                  placeholder="Current Password"
                  className="w-full"
                />
                <label className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={showCurrentPassword}
                    onChange={(event) => setShowCurrentPassword(event.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  Show current password
                </label>
              </FormField>
              
              <FormField label="New Password" required>
                <Input
                  name="new_password"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.new_password}
                  onChange={handleChange(setPasswordData)}
                  placeholder="New Password"
                  className="w-full"
                />
              </FormField>

              <FormField label="Confirm New Password" required>
                <Input
                  name="confirm_new_password"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.confirm_new_password}
                  onChange={handleChange(setPasswordData)}
                  placeholder="Confirm New Password"
                  className="w-full"
                />
                <label className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={showNewPassword}
                    onChange={(event) => setShowNewPassword(event.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  Show new password
                </label>
              </FormField>


              <div className="flex justify-end">
                <Button type="submit" size="sm" variant="default" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </form>
          </FormWrapper>

          <FormWrapper className="border-red-200  max-w-none">
            <div className="flex items-start gap-4 mb-6">
              
              {/* Icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>

              {/* Text */}
              <div>
                <h3 className="text-lg font-semibold">
                  Account Menagement
                </h3>
                <p className="text-sm text-gray-500">
                  Irreversible actions
                </p>
              </div>
            </div>

            {/* Button */}
            <Button 
              type ="button" 
              size="sm"
              variant="destructive"
              disabled={isSaving} 
              onClick={handleDeleteAccount}>
              {isSaving ? "Deleting..." : "Delete account"}
            </Button>
          </FormWrapper>
              
        </div>

        <AlertDialog open={Boolean(alert)} onClose={() => setAlert(null)}>
          <AlertDialogHeader>
            <AlertDialogTitle>{alert?.title}</AlertDialogTitle>
            <AlertDialogDescription>{alert?.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setAlert(null)}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialog>
        
      </div>

     
    </div>
    );
}

export default SettingsPage;
