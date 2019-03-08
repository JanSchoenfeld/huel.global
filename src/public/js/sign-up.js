function validate() {
    if (document.getElementById('password').value != document.getElementById('password-confirmation').value) {
        document.getElementById("dp-alert").style.setProperty("display", "inline");
        return false;
    } else {
        return true;
    }
}