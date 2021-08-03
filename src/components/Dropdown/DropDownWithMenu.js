import React, {Fragment, useEffect, useState} from 'react';
import Select, {components} from 'react-select';


const Placeholder = props => {
    return <components.Placeholder {...props} />;
};


export default function DropDownMenuWithIcon({defaultValue,options, selectCallback, placeholder,disabled}) {


    const [option, setOption] = useState(options);

    function handleChangeValue(e) {
        selectCallback(e)

    }




    useEffect(() => {
        setOption(options)
    }, [options])

    return (
        <Fragment>

            <Select
                defaultValue={defaultValue}
                className="content-center font-title hover:shadow-xl cursor-pointer border-gray-300  border-1 rounded-default shadow text-base text-label focus:outline-none font-medium cursor-pointer break-all"
                closeMenuOnSelect={true}
                components={{Placeholder}}
                placeholder={defaultValue}
                options={option}
                isDisabled={disabled? disabled : false}
                onChange={handleChangeValue}
                styles={{
                    control: (provided, state) => ({
                        ...provided,
                        // boxShadow: "none",
                        borderRadius: '15px',
                        paddingLeft: '3px',
                        border: 0,

                        justifyContent:'center',
                        textAlign:'center',

                        // This line disable the blue border
                        boxShadow: 'none'
                    }),
                    menu: (provided, state) => ({
                        ...provided,
                        borderTop: '0px',
                        marginTop: '0px',
                        borderBottom: '15px',
                        // padding: '4px 14px',


                    }),
                    option: (provided, state) => ({
                        ...provided,
                        borderTop: '0px',

                        // borderBottom: '15px',
                        // padding: '14px 14px',

                    }),

                    container: base => ({
                        ...base,
                        borderTop: 0,
                        // borderBottom: '12px',
                        shadow: 'box-shadow: 0px 1px 3px 0px #131313 13%',

                    }),
                    singleValue: base => ({
                        ...base,

                        fontSize: '16px',
                        borderRadius: '15px',
                        padding: '3px',

                        // height:'51px',
                    }),

                }}


                theme={theme => ({
                    ...theme,
                    spacing: {
                        ...theme.spacing,
                        controlHeight: '38px',
                        // margin: '6px',
                        // padding:'6px 4px',
                    },


                    shadow: 'box-shadow: 0px 1px 3px 0px #131313 13%',
                    colors: {
                        ...theme.colors,
                        primary25: '#ff8c00',
                        // primary: 'black',

                    },
                })}
            />
        </Fragment>
    );
}
