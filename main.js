import cbToast from './cbToast/cbToast.js';

document.getElementById('runCodeBtn').addEventListener('click', () => {
    const codeElement = document.getElementById('editableCode');
    
    // 1. Get the raw text (ignoring the span tags)
    let rawText = codeElement.innerText;

    try {
        /* 2. Extract just the object between ({ and })
           We look for the first '{' and the last '}'
        */
        const startIdx = rawText.indexOf('{');
        const endIdx = rawText.lastIndexOf('}');
        
        if (startIdx === -1 || endIdx === -1) {
            throw new Error("Could not find a valid config object.");
        }

        const jsonString = rawText.substring(startIdx, endIdx + 1);

        /* 3. Convert string to Object. 
           Using 'new Function' is safer/cleaner than eval() for this.
        */
        const config = new Function(`return ${jsonString}`)();

        // 4. Fire the toast!
        cbToast(config);

    } catch (err) {
        // 5. Show error toast if the user messed up the syntax
        cbToast({
            title: 'Syntax Error',
            message: `Failed to parse config: ${err.message}`,
            type: 'error',
            position: "top-right",
            duration: 0
        });
        console.error("Toast Parsing Error:", err);
    }
});

/* ==========================================================================
    1. STANDARD TOAST TRIGGERS
========================================================================== */

document.getElementById('defaultBtn').addEventListener('click', () => {
    cbToast();
});

document.getElementById('infoBtn').addEventListener('click', () => {
    cbToast({
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
    cbToast({
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
    cbToast({
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
    cbToast({
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
    cbToast({
        title: 'Bootstrap Theme',
        message: 'Using --bs-primary and detecting dark mode.',
        type: 'default', // Will use Primary blue
        useBS5Theme: true
    });
});

// 2. Test No Icon / No Title Layout
document.getElementById('noIconBtn').addEventListener('click', () => {
    cbToast({
        title: false, // Close button will move into the body
        icon: false,
        message: 'This is a minimal toast with no icon or title.',
        type: 'default'
    });
});

// 3. Test the Stack Limit (maxStack)
document.getElementById('stackBtn').addEventListener('click', () => {
    cbToast({
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
    cbToast({
        ...currentOptions, // Unpacks title, message, type, and position
        lightMode: true,   // Force light mode for this button
    });

    // Cycle index: 0, 1, 2, 3, 4, then back to 0
    currentIndex = (currentIndex + 1) % toastConfigs.length;
});