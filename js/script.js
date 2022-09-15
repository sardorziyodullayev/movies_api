//Add form and input
const elSiteForm = document.querySelector(".movie__form");
const elSiteInput = elSiteForm.querySelector(".movie__input");

// Add result list
const elSiteList = document.querySelector(".movie__result-list");

// Add template
const elTemplate = document.querySelector("#movie__template").content;

//Add spinner
const elSpinner = document.querySelector(".movie__spinner");

//Add Modal
const elModal = document.querySelector(".movie__modal");
const elModalInner = document.querySelector(".movie__modal-inner");

// favorite
let elMoviesFavoritesList = document.querySelector(".movie__favorites-list");
let elBookmark = document.querySelector(".bookmark");

const btn = document.querySelector(".movie__more-info");

//Bookmark
// let bookmarkArr = JSON.parse(localStorage.getItem("Bookmark")) ? JSON.parse(localStorage.getItem("Bookmark")) : [];

// function locoleStorageSet (arr) {
//   return localStorage.setItem("Bookmark", JSON.stringify(arr))
// }

// elSiteList.addEventListener("click", (evt) => {
//   if(evt.target.className == "bi bi-bookmark-heart") {
//       let movieTitle = evt.path[2].firstChild.nextElementSibling.getAttribute("title")
//       if(!bookmarkArr.includes(movieTitle)) bookmarkArr.push(movieTitle);
//   }
//   locoleStorageSet(bookmarkArr)
//   bookmarkRenderList(bookmarkArr)
// })

// bookmarkRenderList(bookmarkArr)

// function bookmarkRenderList (bookmarkArr) {
//   elBookmark.innerHTML = null;
//   bookmarkArr.forEach((el,i) => {
//       elBookmark.innerHTML += `
//           <li class="list-group-item-action py-2 my-1 bg-danger bg-opacity-10 d-flex justify-content-between">
//               <span class="d-block">${i+1} ${el}</span> <span><i onClick="bookmarkElRemov(${i})" class="bi bi-trash text-danger fs-4 d-block"></i></span>
//           </li>
//       `
//   })
// }

// function bookmarkRenderList (bookmarkArr) {
//   elBookmark.innerHTML = null;
//   console.log(bookmarkArr);
//   bookmarkArr.forEach((el,i) => {
//       elBookmark.innerHTML += `
//           <li class="list-group-item-action py-2 my-1 bg-danger bg-opacity-10 d-flex justify-content-between">
//               <span class="d-block">${i+1} ${el}</span> <span><i onClick="bookmarkElRemov(${i})" class="bi bi-trash text-danger fs-4 d-block"></i></span>
//           </li>
//       `
//   })
// }

elSiteList.addEventListener("click", (evt) => {
	if (evt.target.matches(".movie__modal") || evt.target.matches(".btn-close")) {
		elModal.classList.remove("movie__modal-active");
		document.body.classList.remove("overr");
	} else {
		elModal.classList.add("movie__modal-active");
	}
});

//Modal render

function btnModal(btns, data) {
	btns.forEach((btn, ind) => {
		btn.addEventListener("click", (e) => {
			elModal.classList.add("movie__modal-active");
			document.body.classList.add("overr");

			elModalInner.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <img class="rounded  movie__modal-img" src="${data.Poster}" alt="${data.title}" width="330" height="430">
          <h3 class="h5 "><span class="fw-bold text-danger ">Movie Name:</span> ${data.Title}</h3>
          <p class="mb-1"><span class="fw-bold text-danger">Year:</span> ${data.Year}</p>
          <p class="mb-1"><span class="fw-bold text-danger ">Director:</span> ${data.Director}</p>
          <p class="mb-1"><span class="fw-bold text-danger">Rating:</span> ${data.imdbRating}</p>
          <p class="mb-1"><span class="fw-bold text-danger">Summury:</span> ${data.Plot}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary">Save changes</button>
        </div>
      </div>
	       `;

			elModalInner.appendChild(closeBtn);
		});
	});
}

//Render movie
const renderMovie = (datum) => {
	elSiteList.innerHTML = null;

	const elFragment = document.createDocumentFragment();
	datum.forEach((data) => {
		const copyFragment = elTemplate.cloneNode(true);

		copyFragment.querySelector(".movie__img-poster").src = data.Poster;
		copyFragment.querySelector(".movie__img-poster").alt = data.Title;

		copyFragment.querySelector(".movie__card-title").innerHTML = data.Title.split(
			" ",
		)
			.slice(0, 5)
			.join(" ");

		const btns = copyFragment.querySelectorAll(".movie__more-info");

		btnModal(btns, data);
		elFragment.append(copyFragment);
	});

	elSiteList.appendChild(elFragment);
};

//Error

function error(err) {
	elSiteList.innerHTML = null;
	const errItem = document.createElement("li");
	errItem.className = "alert alert-danger";
	errItem.textContent = err;

	elSiteList.appendChild(errItem);
}

//  async fetch
const searchMovie = async (name) => {
	try {
		//   const response = await fetch(`https://api.jikan.moe/v4/anime?q=${name}&sfw`)
		const response = await fetch(
			`https://www.omdbapi.com/?s=${elSiteInput.value.trim()}&apikey=e668e570`,
		).finally(spinnerAdd);
		const data = await response.json();
		// render
		renderMovie(data.Search);
	} catch (err) {
		error(err);
		//   console.log("error");
	}
};

//  function searchMovie(country) {
//    fetch(`http://www.omdbapi.com/?s=${country}&apikey=5d36bd57`)
//      .then(res => {
//        if (!res.ok) {
//           throw new Error(renderError("Xatolik yuz berdi."));
//        }

//        return res.json();
//      })
//      .then(data => renderMovie(data))
//      .finally(function spinnerAdd() {
//        elSpinner.classList.add("d-none");
//      });
//  }

function spinnerRemove() {
	elSpinner.classList.remove("d-none");
}

function spinnerAdd() {
	elSpinner.classList.add("d-none");
}

//  searchMovie("Marvel")

elSiteForm.addEventListener("submit", (evt) => {
	evt.preventDefault();
	elSiteList.innerHTML = null;
	spinnerRemove();

	const inputValue = elSiteInput.value.toLowerCase().trim();

	searchMovie(inputValue);

	// elSiteInput.value = "";
});
