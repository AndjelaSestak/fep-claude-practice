import { useSettings } from '../../../hooks/useSettings'
import FormWrapper from '../../../components/ui/FormWrapper'
import FormField from '../../../components/ui/FormField'
import Input from '../../../components/ui/InputField'
import Button from '../../../components/ui/Button'

const ProfileInformationForm = () => {
  const { user, updateProfile, isUpdateProfilePending } = useSettings()

  const handleUpdateSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const profileData = {
      name: formData.get('name'),
      city: formData.get('city'),
      address: formData.get('address'),
      date_of_birth: formData.get('date_of_birth') || null
    }

    updateProfile(profileData)
  }

  if (!user) {
    return null
  }

  return (
    <FormWrapper className="max-w-none">
      <div className="flex items-start gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold">Profile Information</h3>
          <p className="text-sm text-gray-500">Update your personal details</p>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleUpdateSubmit}>
        <FormField label="Full Name" required>
          <Input
            name="name"
            defaultValue={user.name || ''}
            placeholder="John Doe"
            className="w-full"
          />
        </FormField>

        <FormField label="Email" required>
          <Input
            name="email"
            defaultValue={user.email || ''}
            placeholder="john.doe@example.com"
            className="w-full"
            disabled
          />
        </FormField>

        <FormField label="City">
          <Input
            name="city"
            type="text"
            defaultValue={user.city || ''}
            placeholder="Beograd"
            className="w-full"
          />
        </FormField>

        <FormField label="Address">
          <Input
            name="address"
            type="text"
            defaultValue={user.address || ''}
            placeholder="Knez Mihaila 123"
            className="w-full"
          />
        </FormField>

        <FormField label="Date of Birth">
          <Input
            name="date_of_birth"
            type="date"
            defaultValue={user.date_of_birth || ''}
            className="w-full"
          />
        </FormField>

        <div className="flex justify-end">
          <Button type="submit" size="sm" variant="default" disabled={isUpdateProfilePending}>
            {isUpdateProfilePending ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      </form>
    </FormWrapper>
  )
}

export default ProfileInformationForm
