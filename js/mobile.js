var md = new MobileDetect(window.navigator.userAgent);

if (!(md.mobile())) {
    document.getElementById('preloader').style.display = 'block';
}
