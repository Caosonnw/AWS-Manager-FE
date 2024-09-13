const InputText = ({
  label,
  name,
  handleChange,
  handleBlur,
  type = 'text',
  placeholder,
  error,
  touched,
  className,
  value,
  autoComplete,
}) => {
  return (
    <div className={className}>
      <label htmlFor="" className="block mb-2 text-sm font-bold text-gray-900">
        {label}
      </label>
      <input
        // giá trị name nhận vào sẽ tương ứng với thuộc tính cần lấy dữu liệu trên initialValues
        name={name}
        // handleChange là phương thức giúp lấy dữ liệu cho formik
        onChange={handleChange}
        onBlur={handleBlur}
        type={type}
        className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-[#dcbb87]`}
        placeholder={placeholder}
        value={value}
        autoComplete={autoComplete}
      />
      {/* nếu như người dùng đã bấm vào input và có lỗi thì mới hiện thông báo lỗi lên và việc kiểm tra xem người dùng bấm vào input hay chưa sẽ được formik.touched quản lí */}
      {touched && error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default InputText;
