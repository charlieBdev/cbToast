// Import the class from the subfolder
import cbToast from './cbToast/cbToast.js';
  
const defaultBtn = document.getElementById('defaultBtn');
  
defaultBtn.addEventListener('click', () => {
    new cbToast();
});

const infoBtn = document.getElementById('infoBtn');

infoBtn.addEventListener('click', () => {
    new cbToast({
        title: "Info",
        message: "This is an informational message.",
        type: "info",
        position: "top-right",
        duration: 4000
    });
});

const successBtn = document.getElementById('successBtn');

successBtn.addEventListener('click', () => {
    // Create a new instance of your package
    new cbToast({
        title: "Success",
        message: "Package Loaded Successfully!",
        type: "success",
        position: "bottom-right",
        duration: 4000
    });
});

const errorBtn = document.getElementById('errorBtn');

errorBtn.addEventListener('click', () => {
    new cbToast({
        title: "Error",
        message: "Something went wrong!",
        type: "error",
        position: "bottom-left",
        duration: 4000
    });
});

const warningBtn = document.getElementById('warningBtn');

warningBtn.addEventListener('click', () => {
    new cbToast({
        title: "Warning",
        message: "This is a warning message.",
        type: "warning",
        position: "top-left",
        duration: 4000
    });
});