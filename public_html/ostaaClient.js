let formForItem = document.getElementById("itemForm");
let addItemButton = document.getElementById("addItemButton");
let itemUsername = document.getElementById("itemUsername");

function submitItemForm() {
    if (itemUsername.value !== null) {
        formForItem.action = "/add/item/" + itemUsername.value;
        formForItem.submit();
    }
}

function main() {
    addItemButton.addEventListener("click", submitItemForm);
}

main();
