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
        duration: 3000,
        countdown: true,
        onClose: () => console.log("Info toast closed")
    });
});

document.getElementById('successBtn').addEventListener('click', () => {
    new cbToast({
        title: "Success",
        message: "Operation completed successfully!",
        type: "success",
        position: "bottom-right",
        duration: 3000,
        countdown: true,
        onClose: () => console.log("Success toast closed")
    });
});

document.getElementById('warningBtn').addEventListener('click', () => {
    new cbToast({
        title: "Warning",
        message: "This is a warning message.",
        type: "warning",
        position: "bottom-left",
        duration: 3000,
        countdown: true,
        onClose: () => console.log("Warning toast closed")
    });
});

document.getElementById('errorBtn').addEventListener('click', () => {
    new cbToast({
        title: "Error",
        message: "Something went wrong!",
        type: "error",
        position: "top-left",
        duration: 3000,
        countdown: true,
        onClose: () => console.log("Error toast closed")
    });
});

// 1. Test Bootstrap 5 Integration
document.getElementById('bs5Btn').addEventListener('click', () => {
    cbToast.show({
        title: 'Bootstrap Theme',
        message: 'Using --bs-primary and detecting dark mode.',
        type: 'default', // Will use Primary blue
        useBS5Theme: true
    });
});

// 2. Test No Icon / No Title Layout
document.getElementById('noIconBtn').addEventListener('click', () => {
    cbToast.show({
        title: false, // Close button will move into the body
        icon: false,
        message: 'This is a minimal toast with no icon or title.',
        type: 'default'
    });
});

// 3. Test the Stack Limit (maxStack)
document.getElementById('stackBtn').addEventListener('click', () => {
    cbToast.show({
        title: 'Spam Test',
        message: 'Watching the oldest toast disappear...',
        type: 'warning',
        maxStack: 2 // Lowering it here makes the effect more obvious
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
    });

    // Cycle index: 0, 1, 2, 3, 4, then back to 0
    currentIndex = (currentIndex + 1) % toastConfigs.length;
});