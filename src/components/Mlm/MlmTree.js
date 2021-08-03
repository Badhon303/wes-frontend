import React from 'react';
import Tree from 'react-d3-tree';
import './custom-tree.css';
import {useCenteredTree} from "./helpers";


const orgChart = {
    name: 'CEO',
    children: [
        {
            name: 'Manager',
            attributes: {
                department: 'Production',
            },
            children: [
                {
                    name: 'Foreman',
                    attributes: {
                        department: 'Fabrication',
                    },
                    children: [
                        {
                            name: 'Worker',
                        },
                    ],
                },
                {
                    name: 'Foreman',
                    attributes: {
                        department: 'Assembly',
                    },
                    children: [
                        {
                            name: 'Worker',
                        },
                    ],
                },
            ],
        },
    ],
};


let data=
{
    "user": {
    "firstName": "Ridoan",
        "lastName": "Khan",
        "middleName": "anik",
        "nickName": "Anik",
        "email": "ridoan.anik@leads-bd.com",
        "id": "6083f4a66641c2a2073b5d74"
},
    "level": 0,
    "children": [
    {
        "user": {
            "firstName": "",
            "lastName": "",
            "middleName": "",
            "nickName": "Tahmid",
            "email": "badhon.alam303@gmail.com",
            "id": "6088e39c21776d0552fcd987"
        },
        "level": 1,
        "children": []
    },
    {
        "user": {
            "firstName": "Naushad",
            "lastName": "Hossain",
            "middleName": "",
            "nickName": "Nitul",
            "email": "naushad.hossain@leads-bd.com",
            "id": "608bdfd32cf2210b3248b9f2"
        },
        "level": 1,
        "children": [
            {
                "user": {
                    "firstName": "",
                    "lastName": "",
                    "middleName": "",
                    "nickName": "Alam",
                    "email": "user@users.com",
                    "id": "60885ea9e06cc97ea433bd4b"
                },
                "level": 2,
                "children": []
            },
            {
                "user": {
                    "firstName": "Minul",
                    "lastName": "Alam",
                    "middleName": "James",
                    "nickName": "Alam",
                    "email": "minul.alam@leads-bd.com",
                    "id": "60854821487cdf7cc02b0330"
                },
                "level": 2,
                "children": [
                    {
                        "user": {
                            "firstName": "",
                            "lastName": "",
                            "middleName": "",
                            "nickName": "Farabi",
                            "email": "alfa.farabi@gmail.com",
                            "id": "6093919e2cf2210b3248ba36"
                        },
                        "level": 3,
                        "children": []
                    },
                    {
                        "user": {
                            "firstName": "",
                            "lastName": "",
                            "middleName": "",
                            "nickName": "Four",
                            "email": "level_four@gmail.com",
                            "id": "60af373317717251ccc839fc"
                        },
                        "level": 3,
                        "children": [
                            {
                                "user": {
                                    "firstName": "Mr",
                                    "lastName": "Five",
                                    "middleName": "Level",
                                    "nickName": "Five",
                                    "email": "level_five@gmail.com",
                                    "id": "60af383917717251ccc83a03"
                                },
                                "level": 4,
                                "children": [
                                    {
                                        "user": {
                                            "firstName": "Mr.",
                                            "lastName": "Six",
                                            "middleName": "Level",
                                            "nickName": "Six",
                                            "email": "level_six@gmail.com",
                                            "id": "60af389417717251ccc83a0a"
                                        },
                                        "level": 5,
                                        "children": []
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
]
}

function getMlmTree(obj) {
    const { user, children } = obj
    return {
        name: user.nickName,
        attributes: {
            email: user.email,
        },
        children: children.map(getMlmTree),
    };
}

const containerStyles = {
    width: "100vw",
    height: "100vh"
};


const renderForeignObjectNode = ({
                                     nodeDatum,
                                     toggleNode,
                                     foreignObjectProps
                                 }) => (
    <g>
       <circle r={20} fill="#ff8c00"></circle>
        {/* `foreignObject` requires width & height to be explicitly set. */}
        <foreignObject {...foreignObjectProps}>
            <div  className="pl-1 text-sm text-gray-600 w-64 break-words">
                <p  className="-mt-" >{nodeDatum.attributes ?.email}</p>
                <p  className="mt-1 font-semibold">{nodeDatum.name}</p>
            </div>
        </foreignObject>
    </g>
);


export default function MlmTree({mlmTree,referrer}) {


    const [translate, containerRef] = useCenteredTree();
    const nodeSize = { x: 300, y: 300 };
    const foreignObjectProps = { width: nodeSize.x, height: nodeSize.y, x: 25,  y:-20};

    let updatedData = {
        user: referrer,
        children: [mlmTree]
    }

    let mlmData = getMlmTree(mlmTree && referrer ? updatedData : mlmTree);


    return (
        <div >

            {mlmTree && mlmData &&
            <div style={containerStyles} ref={containerRef}>
                <Tree
                    data={mlmData}
                    translate={translate}
                    nodeSize={nodeSize}
                    renderCustomNodeElement={(rd3tProps) =>
                        renderForeignObjectNode({ ...rd3tProps, foreignObjectProps })
                    }
                    orientation="vertical"
                    pathFunc={"step"}
                />
            </div>
            }
        </div>
    );
}
