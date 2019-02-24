function validate() {
    if (document.getElementById('password').value != document.getElementById('password-confirmation').value) {
        alert(`Passwords don't match!`);
        return false;
    } else {
        return true;
    }
}