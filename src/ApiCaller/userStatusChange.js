import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import {BASE_URL} from "../constants";

function useAsync(getMethod, params) {
    const [value, setValue] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    async function getResource() {
        try {
            setLoading(true);
            setLoading(true);
            const myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + Cookies.get("access-token"));
            myHeaders.append("Content-Type", "application/json");

            const data = await fetch(`${BASE_URL}/users/${id}/change-approval-status`, {
                method: "PUT",
                body: JSON.stringify({
                    approvalStatus: status,
                }),
                headers: myHeaders,
            });
            const response = await data.json();
            if (response.code === 401) history.push("/signin");

            else setValue(response)
            setValue(result);
        } catch (e) {
            setError(e);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        getResource();
    }, params);

    return { value, error, loading };
}

