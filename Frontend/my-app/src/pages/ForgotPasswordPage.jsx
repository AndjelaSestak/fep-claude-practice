import { useState } from "react";
import { CreditCard } from "lucide-react";
import Button from "../components/ui/Button";
import FormField from "../components/ui/FormField";
import FormWrapper from "../components/ui/FormWrapper";
import Input from "../components/ui/InputField";
import { forgotPassword } from "../services/authService";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/AlertDialog";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [dialog, setDialog] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            await forgotPassword(email);
            setDialog({
              title: "Reset link sent",
              description: "If an account with that email exists, a password reset link has been sent.",
            });
        } catch (error) {
            console.error("Error occurred while sending reset link:", error);
            setDialog({
              title: "Reset link failed",
              description: error.response?.data?.detail || "Failed to send reset link.",
            });
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4">
            <CreditCard className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">SecureBank</h1>
        <p className="text-gray-500 text-sm mt-1">Secure, modern banking platform</p>
      </div>

      <FormWrapper className="max-w-md">
        <h2 className="text-2xl font-bold text-gray-900">Forgot password</h2>
        <p className="text-gray-500 text-sm mt-1 mb-6">
          Enter your email address and we will send you a reset link
        </p>

        <form onSubmit={handleSubmit}>
          <FormField label="Email" required>
            <Input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormField>

          <Button type="submit" className="w-full mt-6" size="lg" disabled={loading}>
            {loading ? "Sending..." : "Send reset link"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Remember your password?{" "}
          <a href="/login" className="text-primary font-medium hover:underline">
            Sign in
          </a>
        </p>
      </FormWrapper>

      <AlertDialog open={Boolean(dialog)} onClose={() => setDialog(null)}>
        <AlertDialogHeader>
          <AlertDialogTitle>{dialog?.title}</AlertDialogTitle>
          <AlertDialogDescription>{dialog?.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => setDialog(null)}>OK</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialog>
    </div>
  );
};

export default ForgotPasswordPage;
