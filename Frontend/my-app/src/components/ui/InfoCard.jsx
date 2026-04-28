const InfoCard = ({
  title,
  value,
  icon: Icon,
  iconColor = "text-primary-dark",
  action,
}) => {
  return (
    <div className="relative overflow-hidden bg-primary/10 p-8 rounded-[2.5rem] border border-primary/20 flex flex-col justify-between h-full transition-all hover:shadow-lg hover:shadow-primary/5">
      
     
      <div className="absolute -right-4 -top-4 w-32 h-32 bg-primary/15 rounded-full blur-3xl opacity-60"></div>
      
      <div className="relative z-10 space-y-4">
       
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-6 bg-primary rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
            <span className="text-[11px] font-black text-primary-dark uppercase tracking-[0.2em]">
              {title}
            </span>
          </div>
          {Icon && <Icon className={`w-5 h-5 ${iconColor} opacity-70`} />}
        </div>

      
        <div>
          <p className="text-3xl font-black text-gray-900 tracking-tight leading-tight">
            {value}
          </p>
        </div>
      </div>

      {action && (
        <div className="mt-4 pt-4 border-t border-primary/20 relative z-10">
          {action}
        </div>
      )}
    </div>
  );
};

export default InfoCard;