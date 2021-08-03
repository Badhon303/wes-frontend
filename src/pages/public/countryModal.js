import {VerifyFirstModalHeadline} from "../../utils/staticTexts";
import React ,{useState} from "react";
import {CountryDropdown} from "react-country-region-selector";

const REDIRECT_AFTER_VERIFICATION = '/buy'

const VERIFICATION_TYPE_NID = 1;
const VERIFICATION_TYPE_PASSPORT = 2;
const VERIFICATION_TYPE_DRIVING_LICENSE = 3;

const validate = values => {
    const errors = {};
    const {firstName, lastName, nickName, photo, nid, email, address,country} = values;

    if (!nickName) {
        errors.nickkNme = 'Required';
    } else if (!(nickName.length >= 3 && nickName.length < 30)) {
        errors.nickName = 'Must be greater than 3 and less than 30 characters';
    }

    return errors;
};



export default function CountryModalPage(props) {

    const [country,setCountry] =useState('United States');

    function handleCountryValue(e) {

        setCountry(e)
        console.log(e);
    }
    function handleSubmit() {
        props.country(country)
    }

    return(

        <div className="flex items-center  p-1 ">

            <div >

                <p className="text-lg font-bold text-left text-gray-500 py-4 ">{VerifyFirstModalHeadline} </p>

                <p className="text-base font-medium text-left text-gray-500 py-2 ">Residential country/region: </p>



                <div className=" py-1 ">
                    <CountryDropdown
                        value={country}
                        onChange={handleCountryValue}
                        style={{
                            backgroundColor: 'white',
                            color: 'black',
                            fontSize: 18,
                            // width:'200px',
                        }}
                        tabIndex={1000}
                        disabled={false}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />

                    {/*<select*/}
                        {/*id="country" onChange={formik.handleChange} autoComplete="country"*/}
                        {/*onBlur={formik.handleBlur} value={formik.values.country}*/}
                        {/*placeholder="Nationality"*/}
                        {/*className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">*/}
                        {/*<option disabled>Select country</option>*/}
                        {/*{*/}
                            {/*countries.map(country => (<option key={country.id}*/}
                                                              {/*value={country.id}>{country.label}</option>))*/}
                        {/*}*/}
                    {/*</select>*/}


                </div>

                <div className="text-base font-medium text-left text-gray-500 py-6 md:py-8">
                    <p className="text-bold text-gray-400 py-2 ">  Basic information </p>
                     <ul className="md:px-4 px-2 py-2 text-sm text-gray-400 list-disc">
                         <li>  First and last name </li>
                         <li> Date of birth </li>
                         <li> Residential address </li>
                     </ul>
                </div>



                {country &&   <button onClick={handleSubmit}
                    className="bg-site-theme  mt-6 w-full text-white active:bg-green-600 font-bold uppercase text-base px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none "
                    type="button"
                    style={{ transition: "all .15s ease" }}
                >
                    Start
                </button> }
            </div>
        </div>
    )
}

