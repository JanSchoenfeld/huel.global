function validate() {
    if (document.getElementById('password').value != document.getElementById('password-confirmation').value) {
        
        document.getElementById("dp-alert").style.setProperty("display", "inline");
        // console.log($("#dp-alert"));
        // $("#dp-alert").fadeIn(() => {
        
        //     return false;
        // });

        // alert('Passwords do not match!');
        return false;
    } else {
        return true;
    }
}