	/**
	 * 공통 Page onload
	 */
	async function onload(pageInitUrl, callback) {
		document.body.style.opacity = 0;
		await API.get(pageInitUrl)
		.then(async resp => {
			document.getElementById('login-info').classList.remove('hide');
			document.getElementById('login-username').innerText = resp.loginInfo.userNm;
			
			renderMenu(resp.loginInfo.menus);
			
			await callback();
			
			document.body.style.opacity = 1;	
		}).catch(err => {
			document.getElementById('login').classList.remove('hide');
			document.body.style.opacity = 1;	
			//alert(err.message);
		});
	};

	/**
	 * Menu 생성
	 */	
	function renderMenu(menus) {
		let ul = document.createElement('ul');
		let fragmentMenu = document.createDocumentFragment();
		for (let i = 0; i < menus.length; i++) {
			let menu = menus[i];
			let li = document.createElement('li');
			if(menu.selectedYn == 'Y') {
				li.classList.add('on');
			}
			li.insertAdjacentHTML('beforeend', `<a href='${menu.pageUrl}'>${menu.menuNm}</a>`);	
			fragmentMenu.appendChild(li);
		}
		ul.appendChild(fragmentMenu);
		document.getElementById('nav').appendChild(ul);		
	}

	/**
	 * 페이징 처리
	 */	
	function renderPagination(pagination, callback) {
		const element = getEmptyElement(document.getElementById('pagination'));
		
		//if(pagination.totalCount <= pagination.limitPerPage) return; 
			
		const fragmentPage = document.createDocumentFragment();
		const hasPrev = true;	//pagination.prev != 1;
		const hasNext = true;	//pagination.end < pagination.totalPageCount;
		
		if(hasPrev) {
			let prevDiv = document.createElement('div');
			prevDiv.classList.add('navi_area');
			prevDiv.insertAdjacentHTML('beforeend', `<a href='#' class='btn_navi first' data-page='${1}'>&lt;&lt;</a>`);	
			prevDiv.insertAdjacentHTML('beforeend', `<a href='#' class='btn_navi prev' data-page='${pagination.prev}'>&lt;</a>`);	
			fragmentPage.appendChild(prevDiv);			
		}
		
		let ul = document.createElement('ul');	
		ul.classList.add('page_num');
		for (let i = pagination.begin; i <= pagination.end; i++) {
			const li = document.createElement('li');
			li.classList.add('num');
			li.insertAdjacentHTML('beforeend', `<a href='#' class='btn_num ${i == pagination.page ? 'on' : ''}' data-page='${i}'>${i}</a>`);
			ul.appendChild(li);
		}
		fragmentPage.appendChild(ul);

		if(hasNext) {
			let nextDiv = document.createElement('div');
			nextDiv.classList.add('navi_area');
			nextDiv.insertAdjacentHTML('beforeend', `<a href='javascript' class='btn_navi next' data-page='${pagination.next}'>&gt;</a>`);	
			nextDiv.insertAdjacentHTML('beforeend', `<a href='#' class='btn_navi last' data-page='${pagination.totalPageCount}'>&gt;&gt;</a>`);	
			fragmentPage.appendChild(nextDiv);	
		}

		element.appendChild(fragmentPage);
		
		element.querySelectorAll('a').forEach((item) => {
			var hasOn = item.classList.contains('on');
			item.addEventListener('click', function (e) {
				e.preventDefault();
				
				if(hasOn) return false;
				  	
				callback(e.target.dataset.page);
			});
		});
	};

	/**
	 * 로그인
	 */			
	async function login() {
		let formData = new FormData(document.getElementById('login-form'));
			
		API.post('/login', formData)
		.then(resp => {
			localStorage.setItem('accessToken', resp.data.accessToken);	
			localStorage.setItem('refreshToken', resp.data.refreshToken);	
			alert('로그인!!');
			location.reload();
		}, err => {
			alert(err.message);
		});
	};

	/**
	 * 로그아웃
	 */			
	function logout() {
		if(confirm('로그아웃 하시겠습니까?')) {
			API.get('/logout');
 			localStorage.clear();
			alert('로그아웃!!');		
			location.reload();
			//location.href = '/logout';
		};
	};

	/**
	 * 페이지 새로고침: cookie 유지
	 * 페이지 이동: cookie 삭제 
	 */		
	var isRefresh = false;
	window.addEventListener('keydown', function (e) {
		let key = (e) ? e.keyCode : event.keyCode;
		isRefresh = (key == 116 || key == 17 || key == 82) ? true : false;
	});
	
	window.addEventListener('focus', function (e) {
		isRefresh = false;
	});
		
	window.addEventListener('beforeunload', function (e) {
		e.preventDefault();
		if(!isRefresh) delCookie('search', new URL(location.href).pathname);
	});	
	