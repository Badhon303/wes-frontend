import React from 'react'
import Warning from '../../utils/warning';

function TextInput(props) {
  const { type, name, id, formik, placeholder } = props;

  return (
    <>
      <div className="mb-4 text-outline-color">
        <input type={type} name={name} id={id || name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values[name]}
          className="w-full h-10 p-3 text-outline-color placeholder-outline-color
                  rounded-2xl border-outline-color outline-outline-color ring-border-color focus:ring-2 focus:ring-purple-300
                  focus:border-purple-300  focus:outline-none
                  border-1 focus:border-0  bg-transparent ..."
          placeholder={placeholder || name} />
        {formik.touched[name] && formik.errors[name] ? (
          <Warning message={formik.errors[name]} />
        ) : null}
      </div>
    </>
  )
}

export default TextInput
