import React, { useState, useEffect } from 'react';
import GaleVisualizer from './GaleVisualizer';
import './S1.css';

const instances = [
    {
        menPrefs: {
            A: ['X', 'Y', 'Z'],
            B: ['Y', 'X', 'Z'],
            C: ['Y', 'Z', 'X'],
            D: ['X', 'Y', 'Z']
        },
        womenPrefs: {
            X: ['B', 'A', 'C', 'D'],
            Y: ['C', 'B', 'A', 'D'],
            Z: ['C', 'B', 'D', 'A']
        },
        initialProposer: 'men',
        description: '4x3 Example with Men Proposing'
    },
    {
        menPrefs: {
            A: ['X', 'Y', 'Z', 'W'],
            B: ['Y', 'X', 'Z', 'W'],
            C: ['Y', 'Z', 'X', 'W'],
            D: ['W', 'X', 'Y', 'Z'],
            E: ['Z', 'W', 'Y', 'X']
        },
        womenPrefs: {
            W: ['A', 'B', 'C', 'D', 'E'],
            X: ['B', 'A', 'C', 'D', 'E'],
            Y: ['C', 'B', 'A', 'D', 'E'],
            Z: ['A', 'B', 'C', 'E', 'D']
        },
        initialProposer: 'women',
        description: '5x4 Example with Women Proposing'
    },
    {
        menPrefs: {
            A: ['X', 'Y', 'Z'],
            B: ['Y', 'X', 'Z'],
            C: ['Y', 'Z', 'X'],
            D: ['X', 'Y', 'Z']
        },
        womenPrefs: {
            X: ['B', 'A', 'C', 'D'],
            Y: ['C', 'B', 'A', 'D'],
            Z: ['C', 'B', 'D', 'A']
        },
        initialProposer: 'women',
        description: '4x3 Example with Women Proposing'
    },
    {
        menPrefs: {
            A: ['X', 'Y', 'Z', 'W'],
            B: ['Y', 'X', 'Z', 'W'],
            C: ['Y', 'Z', 'X', 'W'],
            D: ['W', 'X', 'Y', 'Z'],
            E: ['Z', 'W', 'Y', 'X']
        },
        womenPrefs: {
            W: ['A', 'B', 'C', 'D', 'E'],
            X: ['B', 'A', 'C', 'D', 'E'],
            Y: ['C', 'B', 'A', 'D', 'E'],
            Z: ['A', 'B', 'C', 'E', 'D']
        },
        initialProposer: 'men',
        description: '5x4 Example with Men Proposing'
    }
];

const StaticInputs = () => {
    return (
        <div className="s2-instances-container">
            {instances.map((instance, index) => {
               return(
                <div key={index} className="s2-instance">
                    <h2>{instance.description}</h2>
                    <GaleVisualizer
                        menPreferences={instance.menPrefs}
                        womenPreferences={instance.womenPrefs}
                        initialProposer={instance.initialProposer}
                    />
                </div>
               )
            })}
        </div>
    );
};

export { instances };
export default StaticInputs;
