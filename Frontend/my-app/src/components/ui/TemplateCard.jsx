const TemplateCard = ({ title, provider, amount, cardType, cardNumber }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4 w-72">
      
      {/* Icon */}
      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" />
        </svg>
      </div>

      {/* Title & Provider */}
      <div>
        <h3 className="font-semibold text-gray-900 text-base">{title}</h3>
        <p className="text-gray-500 text-sm">{provider}</p>
      </div>

      {/* Amount */}
      <div>
        <p className="text-3xl font-bold text-gray-900">RSD {amount}</p>
        <p className="text-gray-400 text-sm mt-1">{cardType} •••• {cardNumber}</p>
        <p className="text-gray-400 text-sm">Card: {cardNumber}</p>
      </div>

      {/* Buttons */}
      <button className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-4.586-4.586A1 1 0 008.5 7.25v9.5a1 1 0 001.666.748l4.586-4.586a1 1 0 000-1.496z" />
        </svg>
        Execute
      </button>

      <div className="flex gap-3">
        <button className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2 rounded-xl flex items-center justify-center gap-2 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-6-6l6 6M9 15l6-6" />
          </svg>
          Edit
        </button>
        <button className="flex-1 border border-red-200 hover:bg-red-50 text-red-500 font-medium py-2 rounded-xl flex items-center justify-center gap-2 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4" />
          </svg>
          Delete
        </button>
      </div>

    </div>
  );
};

export default TemplateCard;