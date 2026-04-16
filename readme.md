# cbToast Documentation

A lightweight, zero-dependency, customizable toast notification library written in ES6 JavaScript.

## 🚀 Installation

1. Link the stylesheet in your <head>:
   <link rel="stylesheet" href="./cbToast/cbToast.css">

2. Import the class in your module-based JavaScript file:
   import cbToast from './cbToast/cbToast.js';

---

## 🛠️ Basic Usage

To trigger a notification with default settings:

new cbToast();

---

## ⚙️ Configuration Options

Pass an object to the constructor to customize your toast:

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| title | String | "Notification" | The header text of the toast. |
| message | String | "Default Message"| The body text/content. |
| type | String | "default" | default, info, success, warning, or error. |
| position | String | "center" | top-left, top-right, bottom-left, bottom-right, center. |
| duration | Number | 3000 | Time in ms before auto-hiding. Set to 0 for persistent. |
| countdown | Boolean| false | Shows a shrinking progress bar at the bottom. |
| maxStack | Number | 5 | Limits the number of toasts visible in one position. |
| lightMode | Boolean| false | Switches to a light-themed (white) notification. |

---

## 🌟 Examples

### Success Toast (Light Mode)
new cbToast({
  title: "Saved!",
  message: "Your profile has been updated.",
  type: "success",
  position: "top-right",
  lightMode: true,
  countdown: true
});

### Persistent Error Toast
new cbToast({
  title: "Connection Lost",
  message: "Unable to reach the server. Please check your internet.",
  type: "error",
  duration: 0 // Will not close until "X" is clicked
});

---

## 🏗️ Technical Features

### Max Stacking Logic
The library prevents "notification spam" by tracking the number of active toasts in each specific position. If the maxStack limit is reached (e.g., 5), the oldest toast in that container is automatically removed with an exit animation to make room for the new one.

### Theme Engine
The library uses CSS Variables and data-attributes (data-theme="light/dark") to handle color switching. This ensures high performance and prevents style "flickering" when multiple toasts are spawned.

### Position Containers
Toasts are grouped into dynamic container elements based on their position. This ensures that toasts in the top-right stack logically and separately from toasts in the bottom-left.