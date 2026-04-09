const InfoCard = ({
  title,
  value,
  icon: Icon,
  iconColor = "text-primary",
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col gap-4">

      {/* Gornji deo - naslov i ikonica */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        {Icon && <Icon className={`w-5 h-5 ${iconColor}`} />}
      </div>

      {/* Donji deo - vrednost */}
      <p className="text-3xl font-bold text-gray-900">{value}</p>

    </div>
  );
};

export default InfoCard;