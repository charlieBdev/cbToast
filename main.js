// Import the class from the subfolder
import cbToast from './cbToast/cbToast.js';

/* ==========================================================================
  1. STANDARD TOAST TRIGGERS
========================================================================== */

document.getElementById('defaultBtn').addEventListener('click', () => {
    new cbToast();
});

document.getElementById('infoBtn').addEventListener('click', () => {
    new cbToast({
        title: "Info",
        message: "This is an informational message.",
        type: "info",
        position: "top-right",
        duration: 4000,
        countdown: true
    });
});

document.getElementById('successBtn').addEventListener('click', () => {
    new cbToast({
        title: "Success",
        message: "Operation completed successfully!",
        type: "success",
        position: "bottom-right",
        duration: 4000,
        countdown: true
    });
});

document.getElementById('warningBtn').addEventListener('click', () => {
  new cbToast({
    title: "Warning",
    message: "This is a warning message.",
    type: "warning",
    position: "top-left",
    duration: 4000,
    countdown: true
  });
});

document.getElementById('errorBtn').addEventListener('click', () => {
    new cbToast({
        title: "Error",
        message: "Something went wrong!",
        type: "error",
        position: "bottom-left",
        duration: 4000,
        countdown: true
    });
});

/* ==========================================================================
  2. LIGHT MODE CYCLING LOGIC
========================================================================== */

const toastConfigs = [
    {
        title: "Default Light",
        message: "This is a default message in light mode.",
        type: "default",
        position: "center",
    },
    {
        title: "Info Light",
        message: "This is an informational message.",
        type: "info",
        position: "top-right"
    },
    {
        title: "Success Light",
        message: "Operation completed successfully!",
        type: "success",
        position: "bottom-right"
    },
    {
        title: "Warning Light",
        message: "This is a warning message.",
        type: "warning",
        position: "bottom-left"
    },
    {
        title: "Error Light",
        message: "Something went wrong!",
        type: "error",
        position: "top-left"
    }
];

let currentIndex = 0;

document.getElementById('lightModeBtn').addEventListener('click', () => {
    const currentOptions = toastConfigs[currentIndex];

    // Trigger the toast
    new cbToast({
        ...currentOptions, // Unpacks title, message, type, and position
        lightMode: true,   // Force light mode for this button
        duration: 4000,    // Standard duration for the cycle
        countdown: true    // Show the shrinking bar
    });

    // Cycle index: 0, 1, 2, 3, 4, then back to 0
    currentIndex = (currentIndex + 1) % toastConfigs.length;
});