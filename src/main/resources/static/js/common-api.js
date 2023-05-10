/**
 * 
 */
function CommonApi(apiBaseUrl = 'http://192.168.0.77/iwms', apiVersion = 'v1') {
	
	const target = apiBaseUrl + '/' + apiVersion; 

	this.get = async function(url) {
		return await apiCall(url); 	
	};
	
	this.post = async function(url, payload) {	
		let options = {
			method: 'POST',
			body: payload
		};
		return await apiCall(url, options); 	
	};
	
	this.put = async function(url, payload) {	
		let options = {
			method: 'PUT',
			body: payload
		};
		return await apiCall(url, options);
	};
	
	this.patch = async function(url, payload) {	
		let options = {
			method: 'PATCH',
			body: payload
		};
		return await apiCall(url, options);
	};
	
	this.delete = async function(url) {
		let options = {
			method: 'DELETE'
		};
		return await apiCall(url, options);
	};		
	
	this.download = async function(url, name) {	
		/* JQuery 3.0 ++ 
			
			let options = {
				url: target + url,
				cache: false,
				xhrFields: {
					responseType: 'blob'
				}
			};	
			let blob = await callAjax(options);
			let fileObjectUrl = window.URL.createObjectURL(blob);
			let a = document.createElement('a');
			a.href = fileObjectUrl;
			a.download = name;
			a.click();
			window.URL.revokeObjectURL(fileObjectUrl);	
		*/
		
		fetch(target + url, {
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
			}
		})
		.then (async response => {
			if (!response.ok){
				let err = await response.json();
				throw new Error(err.message);
			}
			return response.blob();
		})
		.then(blob => {
			let fileObjectUrl = window.URL.createObjectURL(blob);
			let a = document.createElement('a');
			a.href = fileObjectUrl;
			a.download = name;
			a.click();
			window.URL.revokeObjectURL(fileObjectUrl);
		}).catch(alert);  
	};

	/**
	 * 공통 api 호출 
	 */		
	async function apiCall(url, options = {method: 'GET'}) {
		return new Promise(async (resolve, reject) => {
			console.log('[' + options.method + '] ' + (target + url) + (options.body ? ', [BODY] ' + formDataToString(options.body) : ''));
			
			options.headers = {
				'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
			}
			
			const response = await fetch(target + url, options).catch(reject);
			if(!response) return;
			
			let result = await response.json().catch(reject);
			if(!result) return;
			
			if(response.ok) {
				console.log('[RES] ', result);
				resolve(result);
			} else if(response.status == 401 && result.code == '023') {
				console.warn('토큰 만료');
				result = await reissue();
				
				if(result.data) {
					console.warn('토큰 재발급 성공');
					localStorage.setItem('accessToken', result.data.accessToken);
					resolve(apiCall(url, options));
				} else {
					console.warn('토큰 재발급 실패');
					console.error('[ERR] ', result);
					reject(result);			
				}
			} else {
				console.error('[ERR] ', result);
				reject(result);					
			}
		});		
	};
	
	/**
	 * Access token 재발급
	 */
	async function reissue() {
		let formData = new FormData();
		formData.append('refreshToken', localStorage.getItem('refreshToken'));
		return await fetch(target + '/reissue', {method: 'POST', body: formData}).then(response => response.json());
	};
	
	/**
	 * FormData to string
	 */
	function formDataToString(fd) {
	    let s='', f = '';
	    for(const [name, value] of fd.entries()){
	        if(typeof value == 'string') {
	            s += (s ? '&' : '') + name + '=' + value;
	        } else if(typeof value == 'object' && value instanceof File) {
 				f += (f ? ',' : '&' + name  +'=[') + value.name;
 			}
	    }
	    return s + (f ? f + ']' : '');
	};
}
