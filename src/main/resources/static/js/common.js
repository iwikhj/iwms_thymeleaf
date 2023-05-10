	/**
	 * Empty the element
	 */
	function getEmptyElement(element) {
		while (element.firstChild)
			element.removeChild(element.firstChild);
		return element;
	};
	
	/**
	 * Set cookie
	 * expiration time: 60 * 60 * 1000 = 1h
	 */
	function setCookie(name, value, path = '/') {
	    let d = new Date();
	    d.setTime(d.getTime() + 60 * 60 * 1000);
	    document.cookie = name + '=' + value + ';expires=' + d.toUTCString() + ';path=' + path;
	};
	
	/**
	 * Get cookie
	 */
	function getCookie(name) {
	    let value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
	    return value? value[2] : null;
	};

	/**
	 * Delete cookie
	 */	
	function delCookie(name, path = '/') {
	    let d = new Date();
	    document.cookie = name + '= ' + '; expires=' + d.toUTCString() + ';path=' + path;
	};
