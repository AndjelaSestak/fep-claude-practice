import AddCardForm from './components/AddCardForm'

const AddCardPage = () => (
  <div className="min-h-screen bg-slate-100 flex flex-col items-center px-4 pt-12 pb-12">
    <div className="mb-8 text-center">
      <div className="flex items-center justify-center gap-2">
        <div className="rounded-lg bg-primary p-2">
          <span className="text-lg font-bold text-white">S</span>
        </div>
        <h1 className="text-4xl font-bold text-slate-900">SecureBank</h1>
      </div>
      <p className="mt-2 text-lg text-slate-600">Secure, modern banking platform</p>
    </div>

    <AddCardForm />
  </div>
)

export default AddCardPage
