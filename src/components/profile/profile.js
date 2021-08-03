import React, {useState} from 'react';


export default function Profile() {
    const [collpased, setCollapsed] = useState(false);

    function toggleCollapsed() {
        setCollapsed(!collpased)
    };

    return (
        <div>
            This is private
        </div>

    )
}
