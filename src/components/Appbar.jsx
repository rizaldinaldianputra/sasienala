export const AppBar = ({ title, onBack }) => {
  return (
    <div className="w-full justify-between bg-white shadow-md p-4 flex items-center">
      {onBack && (
        <button onClick={onBack} className="mr-4 text-xl font-bold text-gray-700">
          ←
        </button>
      )}
      <h1 className="text-lg font-semibold">{title}</h1>
      <h1 className="text-lg font-semibold">{''}</h1>
    </div>
  );
};

export default AppBar;
