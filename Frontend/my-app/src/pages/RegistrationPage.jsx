import  Button  from '../components/ui/Button';
import  FormField  from '../components/ui/FormField';
import  Input  from '../components/ui/InputField';
import { Link } from 'react-router-dom';
import FormWrapper from '../components/ui/FormWrapper';
import { useNavigate } from 'react-router-dom'; 
import { registerUser } from '../services/authService';
import { useState } from 'react';

const RegistrationPage = () => {

  const navigate = useNavigate();
  
  // Stanje za formu (ovako povezuješ inpute)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    city: '',
    address: '',
    date_of_birth: '',
    password: ''
  });

  const handleRegister = async () => {
    try {
      // 1. Pozivamo bekand preko servisa
      await registerUser(formData);
      
      // 2. Ako je uspešno, šaljemo ga na OTP stranicu
      // Prosleđujemo email kroz 'state' da bi OTP stranica znala kome proverava kod
      navigate('/verify-email', { state: { email: formData.email } });
      
    } catch (err) {
      alert(err.message); // Ovde ispisuješ one tvoje Custom Errore sa bekanda
    }
  };
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center px-4 pt-12">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2">
          <div className="rounded-lg bg-primary p-2">
            <span className="text-lg font-bold text-white">S</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900">SecureBank</h1>
        </div>
        <p className="mt-2 text-lg text-slate-600">
          Secure, modern banking platform
        </p>
      </div>

      <FormWrapper>
        <div className="w-full">
          <div className="mb-8 text-left">
            <h2 className="text-4xl font-bold text-slate-900">
              Create an account
            </h2>
            <p className="mt-2 text-lg text-slate-600">
              Enter your details to create your account
            </p>
          </div>

          <div className="space-y-6">
            <FormField label="Full Name" required>
              <Input placeholder="John Doe" className="w-full" />
            </FormField>

            <FormField label="Email" required>
              <Input type="email" placeholder="name@example.com" className="w-full" />
            </FormField>

            <FormField label="City" required>
              <Input placeholder="Belgrade" className="w-full" />
            </FormField>

            <FormField label="Address" required>
              <Input placeholder="123 Main St" className="w-full" />
            </FormField>

            <FormField label="Date of Birth">
              <Input type="date" className="w-full" />
            </FormField>

            <FormField label="Password" required>
              <Input type="password" placeholder="••••••••" className="w-full" />
            </FormField>

            <FormField label="Confirm Password" required>
              <Input type="password" placeholder="••••••••" className="w-full" />
            </FormField>

            <Button size="lg" className="w-full mt-4" onClick={handleRegister}>
              Create account
            </Button>

            <p className="text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </FormWrapper>
    </div>
  );
};
export default RegistrationPage;
