import React, { useState } from 'react';

/* Tab logic */
const style = {
    default: `-mb-2 px-4 md:px-8 py-6 text-base font-semibold md:py-1 inline-block focus:outline-none cursor-pointer`,
    selected: `text-gray-700 text-sm border-b-2 border-indigo-700 `,
    notSelected: `border-b text-sm`,
};
export const Tabs = ({ children }) => {
    const childrenArray = React.Children.toArray(children);
    const [current, setCurrent] = useState(childrenArray[0].key);
    const newChildren = childrenArray.map((child) =>
        React.cloneElement(child, { selected: child?.key === current }),
    );
    return (
        <nav className="border-b-1">
            {childrenArray.map((child) => (
                <div
                    role="link"
                    tabIndex={0}
                    onClick={() => setCurrent(child?.key)}
                    key={child?.key}
                    className={`${style.default} ${
                        current === child?.key ? style.selected : style.notSelected
                        }`}
                >
                    {child?.props.title}
                </div>
            ))}
            <section>{newChildren}</section>
        </nav>
    );
};
export const Tab = ({ children, selected }) => (
    <div hidden={!selected} className="mt-4">
        {children}
    </div>
);
