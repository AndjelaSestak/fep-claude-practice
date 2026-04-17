import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CreditCard } from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/InputField";
import FormField from "../components/ui/FormField";
import AlertDialog, {
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "../components/ui/AlertDialog";
import { resetPassword } from "../services/authService";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Reset token was not found. Open the link from your email to reset your password.");
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.newPassword) {
      return "Please enter your new password.";
    }

    if (formData.newPassword.length < 8) {
      return "Password must be at least 8 characters.";
    }

    if (!formData.confirmPassword) {
      return "Please confirm your new password.";
    }

    if (formData.newPassword !== formData.confirmPassword) {
      return "Passwords do not match.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Reset token is not available. Please use a valid link.");
      showErrorDialog("Reset token is not available. Please use a valid link.");
      return;
    }

    setError("");
    const validationMessage = validateForm();
    if (validationMessage) {
      showErrorDialog(validationMessage);
      return;
    }

    setLoading(true);

    try {
      await resetPassword({
        token,
        new_password: formData.newPassword,
        confirm_new_password: formData.confirmPassword,
      });
      setSuccess("Password reset successfully. Redirecting to login...");
      setFormData({ newPassword: "", confirmPassword: "" });
      navigate("/login");
    } catch (err) {
      const message = err?.response?.data?.detail || err?.message || "Something went wrong. Please try again.";
      setError(message);
      showErrorDialog(message);
    } finally {
      setLoading(false);
    }
  };

  const showErrorDialog = (message) => {
    setErrorMessage(message);
    setErrorDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4">
          <CreditCard className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">SecureBank</h1>
        <p className="text-gray-500 text-sm mt-1">Reset your password for your account</p>
      </div>

      <AlertDialog open={errorDialogOpen} onClose={() => setErrorDialogOpen(false)}>
        <AlertDialogHeader>
          <AlertDialogTitle>Password reset failed</AlertDialogTitle>
          <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setErrorDialogOpen(false)}>
            Close
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialog>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
        <div className="mb-4 text-left">
          <h2 className="text-2xl font-bold text-gray-900">Reset your password</h2>
          <p className="text-gray-500 text-sm mt-1 mb-6">
            Enter a new password and confirm it. Your reset link must be valid.
          </p>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
            <FormField label="New password" required>
            <Input
              type="password"
              name="newPassword"
              placeholder="Enter your new password"
              value={formData.newPassword}
              onChange={handleChange}
            />
          </FormField>

          <FormField label="Confirm new password" required>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Re-enter your new password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </FormField>

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Resetting password..." : "Reset password"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
