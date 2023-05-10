	/**
	 * 공통 Page onload
	 */
	async function onload(pageInitUrl, callback) {
		document.body.style.opacity = 0;
		await API.get(pageInitUrl)
		.then(async resp => {
			document.getElementById("login-info").classList.remove('hide');
			document.getElementById("login-username").innerText = resp.loginInfo.userNm;
			
			renderMenu(resp.loginInfo.menus);
			
			await callback();
			
			document.body.style.opacity = 1;	
		}).catch(err => {
			document.getElementById("login").classList.remove('hide');
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
			if(menu.selectedYn == "Y") {
				li.classList.add('on');
			}
			li.insertAdjacentHTML("beforeend", `<a href='${menu.pageUrl}'>${menu.menuNm}</a>`);	
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
		const totalCount = pagination.totalCount;
		const currentPage = pagination.currentPage;
		const limitPerPage = pagination.limitPerPage;
		const pagePerBlock = pagination.pagePerBlock;
		
		//if (totalCount <= limitPerPage) return; 

		const totalPage = Math.ceil(totalCount / limitPerPage);
		const pageGroup = Math.ceil(currentPage / pagePerBlock);
		
		let last = pageGroup * pagePerBlock;
		if (last > totalPage) last = totalPage;
		let first = last - (pagePerBlock - 1) <= 0 ? 1 : last - (pagePerBlock - 1);
		let next = last + 1;
		if (next > totalPage) next = totalPage;
		//let prev = first - 1;
		let prev = first - pagePerBlock;
		if (prev < 1) prev = 1;
		
		let fragmentPage = document.createDocumentFragment();
		
		//prev	if (prev > 0) {
		//first	if (prev > 1) {
		
		let prevDiv = document.createElement('div');
		prevDiv.classList.add('navi_area');
		prevDiv.insertAdjacentHTML("beforeend", `<a href='#' class='btn_navi first' data-page='${1}'>&lt;&lt;</a>`);	
		prevDiv.insertAdjacentHTML("beforeend", `<a href='#' class='btn_navi prev' data-page='${prev}'>&lt;</a>`);	
		fragmentPage.appendChild(prevDiv);
		
		let ul = document.createElement("ul");	
		ul.classList.add('page_num');
		for (let i = first; i <= last; i++) {
			const li = document.createElement("li");
			li.classList.add('num');
			li.insertAdjacentHTML("beforeend", `<a href='#' class='btn_num ${i == currentPage ? "on" : ""}' data-page='${i}'>${i}</a>`);
			ul.appendChild(li);
		}
		fragmentPage.appendChild(ul);

		//next	if (last < totalPage) {
		//last	if (last + pagePerBlock < totalPage) 
		
		let nextDiv = document.createElement('div');
		nextDiv.classList.add('navi_area');
		nextDiv.insertAdjacentHTML("beforeend", `<a href='#' class='btn_navi next' data-page='${next}'>&gt;</a>`);	
		nextDiv.insertAdjacentHTML("beforeend", `<a href='#' class='btn_navi last' data-page='${totalPage}'>&gt;&gt;</a>`);	
		fragmentPage.appendChild(nextDiv);			

		element.appendChild(fragmentPage);
		
		element.querySelectorAll("a").forEach((item) => {
			item.addEventListener('click', function (e) {
			  	e.preventDefault();
				let page = e.target.dataset.page;
				callback(page);
			});
		});
	};

	/**
	 * 로그인
	 */			
	async function login() {
		let formData = new FormData(document.getElementById("login-form"));
			
		API.post("/login", formData)
		.then(resp => {
			localStorage.setItem("accessToken", resp.data.accessToken);	
			localStorage.setItem("refreshToken", resp.data.refreshToken);	
			alert("로그인!!");
			location.reload();
		}, err => {
			alert(err.message);
		});
	};

	/**
	 * 로그아웃
	 */			
	function logout() {
		if(confirm("로그아웃 하시겠습니까?")) {
			API.get("/logout");
			localStorage.removeItem("accessToken");	
			localStorage.removeItem("refreshToken");		
			delCookie("search");
			
			alert("로그아웃!!");		
			location.reload();
			//location.href = "/logout";
		};
	};
	