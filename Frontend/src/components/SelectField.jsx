const SelectField = ({ icon: Icon, name, value, onChange, options }) => (
    <div className="relative group">
      <Icon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );

export default SelectField