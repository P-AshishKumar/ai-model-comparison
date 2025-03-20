"use client"

import { useState, useEffect } from 'react'
import Screen2 from "@/app/Screen2"

export default function Week1Route() {
    // You could retrieve this from localStorage or an API
    const [completedExercises, setCompletedExercises] = useState<string[]>([]);
    const [currentExercise, setCurrentExercise] = useState<string>("exercise1");

    // Load completed exercises from localStorage on component mount
    useEffect(() => {
        const storedCompletedExercises = localStorage.getItem('completedExercises');
        if (storedCompletedExercises) {
            setCompletedExercises(JSON.parse(storedCompletedExercises));
        }

        // Determine the current exercise based on completed ones
        const exerciseOrder = ["exercise1", "exercise2", "exercise3", "exercise4"];
        for (let i = 0; i < exerciseOrder.length; i++) {
            const exercise = exerciseOrder[i];
            if (!JSON.parse(storedCompletedExercises || '[]').includes(exercise)) {
                setCurrentExercise(exercise);
                break;
            }
        }
    }, []);

    return (
        <Screen2
            completedExercises={completedExercises}
            currentExercise={currentExercise}
        />
    )
}